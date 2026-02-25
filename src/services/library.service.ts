import { Injectable, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';

export interface UserEbook {
  id: string;
  title: string;
  author: string;
  description: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'JFT' | 'SEMUA';
  category: string;
  coverEmoji: string;
  coverColor: string;
  fileType: 'PDF' | 'URL' | 'IMAGE' | 'LAINNYA';
  sourceUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileMimeType?: string;
  totalPages?: number;
  language: 'ID' | 'JA' | 'EN' | 'BILINGUAL';
  addedDate: string;
  notes?: string;
}

export interface StoredFileData {
  id: string;
  data: ArrayBuffer;
  mimeType: string;
}

const DB_NAME         = 'javsensei-library';
const DB_VERSION      = 1;
const BOOKS_STORE     = 'books';
const FILES_STORE     = 'files';
const META_KEY        = 'library_meta';
const PREFS_BOOKS_KEY = 'javsensei_library_books_v2';
const FILES_DIR       = 'ebooks';

@Injectable({ providedIn: 'root' })
export class LibraryService {
  books     = signal<UserEbook[]>([]);
  isLoading = signal(false);

  private db: IDBDatabase | null = null;
  private readonly isNative = Capacitor.isNativePlatform();

  private Preferences: any = null;
  private Filesystem: any  = null;
  private Directory: any   = null;

  constructor() { this.init(); }

  async init(): Promise<void> {
    this.isLoading.set(true);
    try {
      if (this.isNative) {
        try {
          const prefMod    = await import('@capacitor/preferences');
          this.Preferences = prefMod.Preferences;
        } catch (e) { console.warn('[Library] Preferences plugin not available', e); }

        try {
          const fsMod     = await import('@capacitor/filesystem');
          this.Filesystem = fsMod.Filesystem;
          this.Directory  = fsMod.Directory;
          await this._ensureEbooksDir();
        } catch (e) { console.warn('[Library] Filesystem plugin not available', e); }

        const all = await this._nativeLoadBooks();
        this.books.set(all);
      } else {
        this.db = await this._openDB();
        const all = await this._getAllBooks();
        this.books.set(all);
      }
    } catch (e) {
      console.error('[Library] Init failed, fallback to localStorage', e);
      this._loadFromLocalStorage();
    } finally {
      this.isLoading.set(false);
    }
  }

  async addBook(
    meta: Omit<UserEbook, 'id' | 'addedDate'>,
    fileData?: ArrayBuffer
  ): Promise<UserEbook> {
    const book: UserEbook = {
      ...meta,
      id: 'book-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      addedDate: new Date().toISOString().split('T')[0],
    };

    await this._saveBook(book);

    if (fileData && book.fileType !== 'URL') {
      await this._saveFile({
        id: book.id,
        data: fileData,
        mimeType: book.fileMimeType || 'application/pdf',
      });
    }

    this.books.update(list => [book, ...list]);
    return book;
  }

  async deleteBook(id: string): Promise<void> {
    await this._deleteBook(id);
    await this._deleteFile(id);
    this.books.update(list => list.filter(b => b.id !== id));
  }

  async updateBook(id: string, updates: Partial<UserEbook>): Promise<void> {
    const updated = this.books().find(b => b.id === id);
    if (!updated) return;
    const newBook = { ...updated, ...updates };
    await this._saveBook(newBook);
    this.books.update(list => list.map(b => (b.id === id ? newBook : b)));
  }

  async getFileUrl(bookId: string): Promise<string | null> {
    try {
      const stored = await this._getFile(bookId);
      if (!stored) return null;
      if (this.isNative) {
        return this._arrayBufferToDataUrl(stored.data, stored.mimeType);
      }
      const blob = new Blob([stored.data], { type: stored.mimeType });
      return URL.createObjectURL(blob);
    } catch (e) {
      console.error('[Library] getFileUrl error', e);
      return null;
    }
  }

  async getFileDataUrl(bookId: string): Promise<string | null> {
    try {
      const stored = await this._getFile(bookId);
      if (!stored) return null;
      return this._arrayBufferToDataUrl(stored.data, stored.mimeType);
    } catch { return null; }
  }

  // ── NATIVE: CAPACITOR FILESYSTEM + PREFERENCES ───────────────────

  private async _ensureEbooksDir(): Promise<void> {
    if (!this.Filesystem || !this.Directory) return;
    try {
      await this.Filesystem.mkdir({
        path: FILES_DIR,
        directory: this.Directory.Data,
        recursive: true,
      });
    } catch (_) {}
  }

  private _nativeFilePath(bookId: string): string {
    return FILES_DIR + '/' + bookId + '.bin';
  }

  private async _nativeLoadBooks(): Promise<UserEbook[]> {
    if (!this.Preferences) return this._localStorageLoadBooks();
    try {
      const { value } = await this.Preferences.get({ key: PREFS_BOOKS_KEY });
      if (!value) return [];
      return (JSON.parse(value) as UserEbook[]).sort(
        (a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
      );
    } catch (e) {
      console.error('[Library] Native load books failed', e);
      return [];
    }
  }

  private async _nativeSaveBooks(books: UserEbook[]): Promise<void> {
    if (!this.Preferences) { this._localStorageSaveBooks(books); return; }
    try {
      await this.Preferences.set({
        key: PREFS_BOOKS_KEY,
        value: JSON.stringify(books),
      });
    } catch (e) {
      console.error('[Library] Native save books failed', e);
      this._localStorageSaveBooks(books);
    }
  }

  private async _nativeSaveFile(file: StoredFileData): Promise<void> {
    if (!this.Filesystem || !this.Directory) {
      console.warn('[Library] Filesystem plugin missing – file not saved');
      return;
    }
    const base64 = this._arrayBufferToBase64(file.data);
    await this.Filesystem.writeFile({
      path: this._nativeFilePath(file.id),
      data: base64,
      directory: this.Directory.Data,
      recursive: true,
    });
  }

  private async _nativeGetFile(bookId: string): Promise<StoredFileData | null> {
    if (!this.Filesystem || !this.Directory) return null;
    try {
      const book     = this.books().find(b => b.id === bookId);
      const mimeType = book?.fileMimeType || 'application/pdf';
      const result   = await this.Filesystem.readFile({
        path: this._nativeFilePath(bookId),
        directory: this.Directory.Data,
      });
      const data = typeof result.data === 'string'
        ? this._base64ToArrayBuffer(result.data)
        : (result.data as ArrayBuffer);
      return { id: bookId, data, mimeType };
    } catch (e) {
      console.error('[Library] Native get file failed', e);
      return null;
    }
  }

  private async _nativeDeleteFile(bookId: string): Promise<void> {
    if (!this.Filesystem || !this.Directory) return;
    try {
      await this.Filesystem.deleteFile({
        path: this._nativeFilePath(bookId),
        directory: this.Directory.Data,
      });
    } catch (_) {}
  }

  // ── ROUTING (native vs web) ───────────────────────────────────────

  private async _saveBook(book: UserEbook): Promise<void> {
    if (this.isNative) {
      const current = this.books();
      const idx     = current.findIndex(b => b.id === book.id);
      const updated = idx >= 0
        ? current.map(b => (b.id === book.id ? book : b))
        : [book, ...current];
      await this._nativeSaveBooks(updated);
    } else {
      await this._idbSaveBook(book);
    }
  }

  private async _deleteBook(id: string): Promise<void> {
    if (this.isNative) {
      await this._nativeSaveBooks(this.books().filter(b => b.id !== id));
    } else {
      await this._idbDeleteBook(id);
    }
  }

  private async _saveFile(file: StoredFileData): Promise<void> {
    if (this.isNative) {
      await this._nativeSaveFile(file);
    } else {
      await this._idbSaveFile(file);
    }
  }

  private async _getFile(id: string): Promise<StoredFileData | null> {
    return this.isNative ? this._nativeGetFile(id) : this._idbGetFile(id);
  }

  private async _deleteFile(id: string): Promise<void> {
    if (this.isNative) {
      await this._nativeDeleteFile(id);
    } else {
      await this._idbDeleteFile(id);
    }
  }

  // ── INDEXEDDB (WEB) ───────────────────────────────────────────────

  private _openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(BOOKS_STORE))
          db.createObjectStore(BOOKS_STORE, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(FILES_STORE))
          db.createObjectStore(FILES_STORE, { keyPath: 'id' });
      };
      req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
      req.onerror   = ()  => reject(req.error);
    });
  }

  private _getAllBooks(): Promise<UserEbook[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) { resolve([]); return; }
      const tx  = this.db.transaction(BOOKS_STORE, 'readonly');
      const req = tx.objectStore(BOOKS_STORE).getAll();
      req.onsuccess = () =>
        resolve(
          (req.result as UserEbook[]).sort(
            (a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
          )
        );
      req.onerror = () => reject(req.error);
    });
  }

  private _idbSaveBook(book: UserEbook): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) { this._localStorageSaveBook(book); resolve(); return; }
      const tx  = this.db.transaction(BOOKS_STORE, 'readwrite');
      const req = tx.objectStore(BOOKS_STORE).put(book);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  }

  private _idbDeleteBook(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) { resolve(); return; }
      const tx  = this.db.transaction(BOOKS_STORE, 'readwrite');
      const req = tx.objectStore(BOOKS_STORE).delete(id);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  }

  private _idbSaveFile(file: StoredFileData): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) { resolve(); return; }
      // Convert to number[] to avoid Android WebView IDB ArrayBuffer serialisation bug
      const safe = {
        id:       file.id,
        data:     Array.from(new Uint8Array(file.data)),
        mimeType: file.mimeType,
      };
      const tx  = this.db.transaction(FILES_STORE, 'readwrite');
      const req = tx.objectStore(FILES_STORE).put(safe);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  }

  private _idbGetFile(id: string): Promise<StoredFileData | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) { resolve(null); return; }
      const tx  = this.db.transaction(FILES_STORE, 'readonly');
      const req = tx.objectStore(FILES_STORE).get(id);
      req.onsuccess = () => {
        if (!req.result) { resolve(null); return; }
        const raw  = req.result;
        let data: ArrayBuffer;
        if (raw.data instanceof ArrayBuffer) {
          data = raw.data;
        } else if (Array.isArray(raw.data)) {
          data = new Uint8Array(raw.data).buffer;
        } else {
          data = raw.data as ArrayBuffer;
        }
        resolve({ id: raw.id, data, mimeType: raw.mimeType });
      };
      req.onerror = () => reject(req.error);
    });
  }

  private _idbDeleteFile(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) { resolve(); return; }
      const tx  = this.db.transaction(FILES_STORE, 'readwrite');
      const req = tx.objectStore(FILES_STORE).delete(id);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  }

  // ── LOCALSTORAGE FALLBACK ─────────────────────────────────────────

  private _loadFromLocalStorage(): void {
    this.books.set(this._localStorageLoadBooks());
  }

  private _localStorageLoadBooks(): UserEbook[] {
    try {
      const raw = localStorage.getItem(META_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private _localStorageSaveBooks(books: UserEbook[]): void {
    try { localStorage.setItem(META_KEY, JSON.stringify(books)); } catch {}
  }

  private _localStorageSaveBook(book: UserEbook): void {
    const list = [...this.books()];
    const idx  = list.findIndex(b => b.id === book.id);
    if (idx >= 0) list[idx] = book; else list.unshift(book);
    this._localStorageSaveBooks(list);
  }

  // ── UTILITY ───────────────────────────────────────────────────────

  private _arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const chunkSize = 8192;
    for (let i = 0; i < bytes.byteLength; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
  }

  private _base64ToArrayBuffer(base64: string): ArrayBuffer {
    const b64    = base64.includes(',') ? base64.split(',')[1] : base64;
    const binary = atob(b64);
    const bytes  = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  }

  private _arrayBufferToDataUrl(buffer: ArrayBuffer, mimeType: string): Promise<string> {
    return new Promise((resolve) => {
      const blob   = new Blob([buffer], { type: mimeType });
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024)        return bytes + ' B';
    if (bytes < 1048576)     return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }
}
