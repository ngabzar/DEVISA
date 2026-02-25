import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../services/translation.service';
import { NotesService, NOTE_COLORS } from '../services/notes.service';
import type { Note } from '../services/notes.service';

type ViewState = 'list' | 'edit' | 'view';

@Component({
  selector: 'app-notes',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen pb-24 transition-colors duration-300"
         [class.bg-slate-950]="ts.isDarkMode()" [class.bg-gray-50]="!ts.isDarkMode()">

      <!-- Header -->
      <div class="sticky top-0 z-20 p-4 border-b transition-colors"
           [class.bg-slate-950]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
           [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
        <div class="flex items-center gap-3">
          @if (viewState() !== 'list') {
            <button (click)="goBack()" class="p-2 rounded-xl opacity-70 hover:opacity-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"
                   [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
              </svg>
            </button>
          }
          <h1 class="text-xl font-bold flex-1" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
            @if (viewState() === 'list') { 📝 Catatan }
            @else if (viewState() === 'edit' && !editingNote()) { ✏️ Catatan Baru }
            @else if (viewState() === 'edit' && editingNote()) { ✏️ Edit Catatan }
            @else { 📄 {{ viewingNote()?.title }} }
          </h1>
          @if (viewState() === 'list') {
            <button (click)="startNew()"
                    class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold transition active:scale-95">
              ✏️ Baru
            </button>
          }
          @if (viewState() === 'view' && viewingNote()) {
            <button (click)="startEdit(viewingNote()!)" class="p-2 rounded-xl text-indigo-400 hover:bg-indigo-900/20 transition">✏️</button>
            <button (click)="confirmDelete(viewingNote()!.id)" class="p-2 rounded-xl text-red-400 hover:bg-red-900/20 transition">🗑️</button>
          }
        </div>

        @if (viewState() === 'list') {
          <div class="mt-3 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)"
                   class="block w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm outline-none"
                   [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()" [class.text-gray-300]="ts.isDarkMode()"
                   [class.bg-white]="!ts.isDarkMode()" [class.border-gray-300]="!ts.isDarkMode()" [class.text-gray-900]="!ts.isDarkMode()"
                   placeholder="Cari catatan..." />
          </div>
        }
      </div>

      <!-- LIST -->
      @if (viewState() === 'list') {
        <div class="p-4">
          @if (filteredNotes().length === 0 && !searchQuery()) {
            <div class="text-center py-16">
              <div class="text-6xl mb-4">📝</div>
              <h3 class="text-lg font-bold mb-2" [class.text-white]="ts.isDarkMode()" [class.text-slate-800]="!ts.isDarkMode()">Belum Ada Catatan</h3>
              <p class="text-sm mb-6" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Buat catatan pertama kamu di sini!</p>
              <button (click)="startNew()" class="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold text-sm transition active:scale-95">
                ✏️ Buat Catatan
              </button>
            </div>
          } @else if (filteredNotes().length === 0) {
            <div class="text-center py-10 opacity-50">
              <div class="text-4xl mb-2">🔍</div>
              <p class="text-sm" [class.text-slate-400]="ts.isDarkMode()">Tidak ada catatan ditemukan</p>
            </div>
          } @else {
            <div class="columns-2 gap-3 space-y-3">
              @for (note of filteredNotes(); track note.id) {
                @let cc = ns.getColorConfig(note.color);
                <div (click)="viewNote(note)"
                     class="break-inside-avoid rounded-2xl border p-3 cursor-pointer transition-all active:scale-95 mb-3 block"
                     [ngClass]="ts.isDarkMode() ? [cc.bg, cc.border] : [cc.light]">
                  @if (note.isPinned) {
                    <div class="text-[10px] font-bold mb-1 opacity-60">📌 DISEMATKAN</div>
                  }
                  <h3 class="font-bold text-sm leading-tight mb-1 line-clamp-2"
                      [class.text-white]="ts.isDarkMode()" [class.text-slate-800]="!ts.isDarkMode()">{{ note.title }}</h3>
                  @if (note.content) {
                    <p class="text-xs leading-relaxed line-clamp-4 opacity-80"
                       [class.text-slate-300]="ts.isDarkMode()" [class.text-slate-600]="!ts.isDarkMode()">{{ note.content }}</p>
                  }
                  <p class="text-[10px] mt-2 opacity-50" [class.text-slate-400]="ts.isDarkMode()">{{ ns.formatDate(note.updatedAt) }}</p>
                </div>
              }
            </div>
            <p class="text-center text-xs mt-4" [class.text-slate-500]="ts.isDarkMode()" [class.text-slate-400]="!ts.isDarkMode()">{{ filteredNotes().length }} catatan</p>
          }
        </div>
      }

      <!-- EDIT / NEW -->
      @if (viewState() === 'edit') {
        <div class="p-4 space-y-4">
          <!-- Color Picker -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60"
                   [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Warna</label>
            <div class="flex gap-2 flex-wrap">
              @for (clr of colors; track clr.value) {
                <button (click)="editForm.color = clr.value"
                        class="w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center text-white text-xs font-bold"
                        [style.background-color]="clr.dot"
                        [class.border-white]="editForm.color === clr.value"
                        [class.scale-125]="editForm.color === clr.value"
                        [class.border-transparent]="editForm.color !== clr.value">
                  @if (editForm.color === clr.value) { ✓ }
                </button>
              }
            </div>
          </div>

          <!-- Title -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60"
                   [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Judul</label>
            <input type="text" [(ngModel)]="editForm.title"
                   class="w-full px-4 py-3 rounded-xl border outline-none text-sm font-semibold"
                   [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()" [class.text-white]="ts.isDarkMode()"
                   [class.bg-white]="!ts.isDarkMode()" [class.border-gray-300]="!ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()"
                   placeholder="Judul catatan..."/>
          </div>

          <!-- Content -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60"
                   [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Isi Catatan</label>
            <textarea [(ngModel)]="editForm.content" rows="10"
                      class="w-full px-4 py-3 rounded-xl border outline-none text-sm resize-none leading-relaxed"
                      [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()" [class.text-white]="ts.isDarkMode()"
                      [class.bg-white]="!ts.isDarkMode()" [class.border-gray-300]="!ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()"
                      placeholder="Tulis catatan kamu..."></textarea>
          </div>

          <!-- Save -->
          <button (click)="saveNote()"
                  class="w-full py-4 rounded-2xl font-bold text-white bg-indigo-600 transition active:scale-95">
            ✅ Simpan Catatan
          </button>

          @if (editingNote()) {
            <button (click)="ns.togglePin(editingNote()!.id); saveNote()"
                    class="w-full py-3 rounded-2xl font-semibold text-sm border transition"
                    [class.border-slate-700]="ts.isDarkMode()" [class.text-slate-300]="ts.isDarkMode()"
                    [class.border-gray-300]="!ts.isDarkMode()" [class.text-slate-700]="!ts.isDarkMode()">
              {{ editingNote()?.isPinned ? '📌 Batalkan Sematkan' : '📌 Sematkan' }}
            </button>
          }
        </div>
      }

      <!-- VIEW -->
      @if (viewState() === 'view' && viewingNote()) {
        @let cc = ns.getColorConfig(viewingNote()!.color);
        <div class="p-4">
          <div class="rounded-2xl border p-5 mb-4"
               [ngClass]="ts.isDarkMode() ? [cc.bg, cc.border] : [cc.light]">
            @if (viewingNote()!.isPinned) {
              <div class="text-[10px] font-bold mb-2 opacity-60">📌 DISEMATKAN</div>
            }
            <h2 class="text-xl font-bold mb-3"
                [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">{{ viewingNote()!.title }}</h2>
            <p class="text-sm leading-relaxed whitespace-pre-wrap"
               [class.text-slate-200]="ts.isDarkMode()" [class.text-slate-700]="!ts.isDarkMode()">{{ viewingNote()!.content }}</p>
            <p class="text-xs mt-4 opacity-50">Diperbarui {{ ns.formatDate(viewingNote()!.updatedAt) }}</p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <button (click)="startEdit(viewingNote()!)"
                    class="py-3 rounded-2xl font-semibold text-sm bg-indigo-600 text-white transition active:scale-95">
              ✏️ Edit
            </button>
            <button (click)="ns.togglePin(viewingNote()!.id)"
                    class="py-3 rounded-2xl font-semibold text-sm border transition"
                    [class.border-slate-700]="ts.isDarkMode()" [class.text-slate-300]="ts.isDarkMode()"
                    [class.border-gray-300]="!ts.isDarkMode()" [class.text-slate-700]="!ts.isDarkMode()">
              {{ viewingNote()?.isPinned ? '📌 Lepas' : '📌 Sematkan' }}
            </button>
          </div>
        </div>
      }

      <!-- DELETE MODAL -->
      @if (showDeleteConfirm()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" (click)="showDeleteConfirm.set(false)"></div>
          <div class="relative border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
               [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()"
               [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
            <div class="text-center mb-5">
              <div class="text-4xl mb-3">🗑️</div>
              <h3 class="text-lg font-bold mb-1" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">Hapus Catatan?</h3>
              <p class="text-sm opacity-60">Catatan akan dihapus permanen.</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button (click)="showDeleteConfirm.set(false)"
                      class="py-3 rounded-xl font-semibold text-sm border transition"
                      [class.border-slate-700]="ts.isDarkMode()" [class.text-slate-300]="ts.isDarkMode()"
                      [class.border-gray-300]="!ts.isDarkMode()" [class.text-slate-700]="!ts.isDarkMode()">Batal</button>
              <button (click)="doDelete()" class="py-3 rounded-xl font-semibold text-sm bg-red-600 text-white transition active:scale-95">Ya, Hapus</button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class NotesComponent {
  ts = inject(TranslationService);
  ns = inject(NotesService);

  viewState = signal<ViewState>('list');
  searchQuery = signal('');
  editingNote = signal<Note | null>(null);
  viewingNote = signal<Note | null>(null);
  showDeleteConfirm = signal(false);
  private deleteTargetId = '';

  colors = NOTE_COLORS;

  editForm = this.freshForm();

  filteredNotes = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const all = this.ns.getSortedNotes();
    if (!q) return all;
    return all.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      (n.tags || []).some(t => t.toLowerCase().includes(q))
    );
  });

  goBack() {
    if (this.viewState() === 'edit' && this.editingNote()) {
      this.viewState.set('view');
    } else {
      this.viewState.set('list');
      this.editingNote.set(null);
      this.viewingNote.set(null);
      this.editForm = this.freshForm();
    }
  }

  startNew() {
    this.editingNote.set(null);
    this.editForm = this.freshForm();
    this.viewState.set('edit');
  }

  startEdit(note: Note) {
    this.editingNote.set(note);
    this.editForm = { title: note.title, content: note.content, color: note.color };
    this.viewState.set('edit');
  }

  viewNote(note: Note) {
    this.viewingNote.set(note);
    this.viewState.set('view');
  }

  saveNote() {
    const existing = this.editingNote();
    if (existing) {
      this.ns.updateNote(existing.id, { title: this.editForm.title, content: this.editForm.content, color: this.editForm.color });
      // Refresh viewing note
      const updated = this.ns.notes().find(n => n.id === existing.id);
      if (updated) this.viewingNote.set(updated);
      this.viewState.set('view');
    } else {
      const note = this.ns.addNote(this.editForm.title, this.editForm.content, this.editForm.color);
      this.viewingNote.set(note);
      this.editingNote.set(null);
      this.viewState.set('view');
    }
    this.editForm = this.freshForm();
  }

  confirmDelete(id: string) {
    this.deleteTargetId = id;
    this.showDeleteConfirm.set(true);
  }

  doDelete() {
    this.ns.deleteNote(this.deleteTargetId);
    this.showDeleteConfirm.set(false);
    this.viewState.set('list');
    this.viewingNote.set(null);
  }

  private freshForm() {
    return { title: '', content: '', color: 'yellow' };
  }
}
