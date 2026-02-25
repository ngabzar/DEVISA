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

const DB_NAME = 'javsensei-library';
const DB_VERSION = 1;
const BOOKS_STORE = 'books';
const FILES_STORE = 'files';
const META_KEY = 'library_meta';
const PREFS_BOOKS_KEY = 'javsensei_library_books';

@Injectable({ providedIn: 'root' })
export class LibraryService {
  books = signal<UserEbook[]>([]);
  isLoading = signal(false);

  private db: IDBDatabase | null = null;
  private readonly isNative = Capacitor.isNativePlatform();
  private prefsPlugin: any = null;

  constructor() {
    this.init();
  }

  async init(): Promise<void> {
    this.isLoading.set(true);
    try {
      if (this.isNative) {
        try {
          const mod = await import('@capacitor/preferences');
          this.prefsPlugin = mod.Preferences;
        } catch { /* fallback */ }
      }
      // Always try to open IndexedDB for file storage
      this.db = await this._openDB();
      const all = await this._getAllBooks();
      this.books.set(all);
    } catch (e) {
      console.error('[Library] Init failed, fallback to localStorage', e);
      this._loadFromLocalStorage();
    } finally {
      this.isLoading.set(false);
    }
  }

  async addBook(meta: Omit<UserEbook, 'id' | 'addedDate'>, fileData?: ArrayBuffer): Promise<UserEbook> {
    const book: UserEbook = {
      ...meta,
      id: 'book-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      addedDate: new Date().toISOString().split('T')[0],
    };
    await this._saveBook(book);
    if (fileData && book.fileType !== 'URL') {
      await this._saveFile({ id: book.id, data: fileData, mimeType: book.fileMimeType || 'application/pdf' });
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
    this.books.update(list => list.map(b => b.id === id ? newBook : b));
  }

  /** Get file as ObjectURL or DataURL (DataURL used on native for iframe compat) */
  async getFileUrl(bookId: string): Promise<string | null> {
    try {
      const stored = await this._getFile(bookId);
      if (!stored) return null;
      // On native, use data URL for better WebView compatibility
      if (this.isNative) {
        return await this._arrayBufferToDataUrl(stored.data, stored.mimeType);
      }
      const blob = new Blob([stored.data], { type: stored.mimeType });
      return URL.createObjectURL(blob);
    } catch { return null; }
  }

  async getFileDataUrl(bookId: string): Promise<string | null> {
    try {
      const stored = await this._getFile(bookId);
      if (!stored) return null;
      return await this._arrayBufferToDataUrl(stored.data, stored.mimeType);
    } catch { return null; }
  }

  // ── INDEXEDDB ─────────────────────────────────────────────────────

  private _openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(BOOKS_STORE)) db.createObjectStore(BOOKS_STORE, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(FILES_STORE)) db.createObjectStore(FILES_STORE, { keyPath: 'id' });
      };
      req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
      req.onerror = () => reject(req.error);
    });
  }

  private _getAllBooks(): Promise<UserEbook[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) { resolve([]); return; }
      const tx = this.db.transaction(BOOKS_STORE, 'readonly');
      const req = tx.objectStore(BOOKS_STORE).getAll();
      req.onsuccess = () => resolve((req.result as UserEbook[]).sort((a, b) =>
        new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
      ));
      req.onerror = () => reject(req.error);
    });
  }

  private _saveBook(book: UserEbook): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) { this._saveToLocalStorage(book); resolve(); return; }
      const tx = this.db.transaction(BOOKS_STORE, 'readwrite');
      const req = tx.objectStore(BOOKS_STORE).put(book);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  private _deleteBook(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) { resolve(); return; }
      const tx = this.db.transaction(BOOKS_STORE, 'readwrite');
      const req = tx.objectStore(BOOKS_STORE).delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  private _saveFile(file: StoredFileData): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) { resolve(); return; }
      const tx = this.db.transaction(FILES_STORE, 'readwrite');
      const req = tx.objectStore(FILES_STORE).put(file);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  private _getFile(id: string): Promise<StoredFileData | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) { resolve(null); return; }
      const tx = this.db.transaction(FILES_STORE, 'readonly');
      const req = tx.objectStore(FILES_STORE).get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  private _deleteFile(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) { resolve(); return; }
      const tx = this.db.transaction(FILES_STORE, 'readwrite');
      const req = tx.objectStore(FILES_STORE).delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // ── LOCALSTORAGE FALLBACK ─────────────────────────────────────────

  private _loadFromLocalStorage(): void {
    try {
      const raw = localStorage.getItem(META_KEY);
      this.books.set(raw ? JSON.parse(raw) : []);
    } catch { this.books.set([]); }
  }

  private _saveToLocalStorage(book: UserEbook): void {
    try {
      const list = this.books();
      const exists = list.findIndex(b => b.id === book.id);
      if (exists >= 0) list[exists] = book; else list.unshift(book);
      localStorage.setItem(META_KEY, JSON.stringify(list));
    } catch (e) { console.error('[Library] LS save failed', e); }
  }

  // ── UTILITY ───────────────────────────────────────────────────────

  private _arrayBufferToDataUrl(buffer: ArrayBuffer, mimeType: string): Promise<string> {
    return new Promise((resolve) => {
      const blob = new Blob([buffer], { type: mimeType });
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}
