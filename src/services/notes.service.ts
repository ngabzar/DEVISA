import { Injectable, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  isPinned?: boolean;
}

export const NOTE_COLORS = [
  { label: 'Kuning', value: 'yellow', bg: 'bg-yellow-900/40', border: 'border-yellow-700', text: 'text-yellow-200', dot: '#eab308', light: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
  { label: 'Biru',   value: 'blue',   bg: 'bg-blue-900/40',   border: 'border-blue-700',   text: 'text-blue-200',   dot: '#3b82f6', light: 'bg-blue-50 border-blue-200 text-blue-800' },
  { label: 'Hijau',  value: 'green',  bg: 'bg-green-900/40',  border: 'border-green-700',  text: 'text-green-200',  dot: '#22c55e', light: 'bg-green-50 border-green-200 text-green-800' },
  { label: 'Merah',  value: 'red',    bg: 'bg-red-900/40',    border: 'border-red-700',    text: 'text-red-200',    dot: '#ef4444', light: 'bg-red-50 border-red-200 text-red-800' },
  { label: 'Ungu',   value: 'purple', bg: 'bg-purple-900/40', border: 'border-purple-700', text: 'text-purple-200', dot: '#a855f7', light: 'bg-purple-50 border-purple-200 text-purple-800' },
  { label: 'Abu',    value: 'gray',   bg: 'bg-slate-800/60',  border: 'border-slate-600',  text: 'text-slate-300',  dot: '#94a3b8', light: 'bg-gray-50 border-gray-200 text-gray-800' },
];

const NOTES_KEY = 'javsensei_notes';

@Injectable({ providedIn: 'root' })
export class NotesService {
  notes = signal<Note[]>([]);
  readonly colors = NOTE_COLORS;
  isReady = signal(false);

  private readonly isNative = Capacitor.isNativePlatform();
  private prefsPlugin: any = null;

  constructor() {
    this._initAndLoad();
  }

  private async _initAndLoad() {
    if (this.isNative) {
      try {
        const mod = await import('@capacitor/preferences');
        this.prefsPlugin = mod.Preferences;
      } catch { /* fallback localStorage */ }
    }
    await this._load();
    this.isReady.set(true);
  }

  addNote(title: string, content: string, color: string = 'yellow', tags: string[] = []): Note {
    const note: Note = {
      id: 'note-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      title: title.trim() || 'Catatan Baru',
      content: content.trim(),
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags,
      isPinned: false,
    };
    this.notes.update(list => [note, ...list]);
    this._save();
    return note;
  }

  updateNote(id: string, updates: Partial<Pick<Note, 'title' | 'content' | 'color' | 'tags' | 'isPinned'>>): void {
    this.notes.update(list => list.map(n => n.id === id
      ? { ...n, ...updates, updatedAt: new Date().toISOString() }
      : n
    ));
    this._save();
  }

  deleteNote(id: string): void {
    this.notes.update(list => list.filter(n => n.id !== id));
    this._save();
  }

  togglePin(id: string): void {
    this.notes.update(list => list.map(n => n.id === id
      ? { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() }
      : n
    ));
    this._save();
  }

  getSortedNotes(): Note[] {
    const all = this.notes();
    const pinned = all.filter(n => n.isPinned);
    const unpinned = all.filter(n => !n.isPinned);
    return [...pinned, ...unpinned];
  }

  getColorConfig(colorValue: string) {
    return NOTE_COLORS.find(c => c.value === colorValue) ?? NOTE_COLORS[0];
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} mnt lalu`;
    if (diffHour < 24) return `${diffHour} jam lalu`;
    if (diffDay === 1) return 'Kemarin';
    if (diffDay < 7) return `${diffDay} hari lalu`;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  private async _load(): Promise<void> {
    try {
      let raw: string | null = null;
      if (this.isNative && this.prefsPlugin) {
        const result = await this.prefsPlugin.get({ key: NOTES_KEY });
        raw = result?.value ?? null;
      } else {
        raw = localStorage.getItem(NOTES_KEY);
      }
      this.notes.set(raw ? JSON.parse(raw) : []);
    } catch { this.notes.set([]); }
  }

  private async _save(): Promise<void> {
    try {
      const json = JSON.stringify(this.notes());
      if (this.isNative && this.prefsPlugin) {
        await this.prefsPlugin.set({ key: NOTES_KEY, value: json });
      } else {
        localStorage.setItem(NOTES_KEY, json);
      }
    } catch {
      try { localStorage.setItem(NOTES_KEY, JSON.stringify(this.notes())); } catch {}
    }
  }
}
