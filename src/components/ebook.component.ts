import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../services/translation.service';
import { LibraryService, UserEbook } from '../services/library.service';
import { Capacitor } from '@capacitor/core';

type ViewState = 'list' | 'add' | 'read' | 'detail';

@Component({
  selector: 'app-ebook',
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
              </svg>
            </button>
          }
          <h1 class="text-xl font-bold flex-1" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
            @if (viewState() === 'list') { 📚 Perpustakaan }
            @else if (viewState() === 'add') { ➕ Tambah Ebook }
            @else if (viewState() === 'detail') { 📖 Detail Buku }
            @else if (viewState() === 'read') { 📖 Baca }
          </h1>
          @if (viewState() === 'list') {
            <button (click)="viewState.set('add')"
                    class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold transition active:scale-95">
              ➕ Tambah
            </button>
          }
          @if (viewState() === 'detail' && selectedBook()) {
            <button (click)="confirmDelete(selectedBook()!.id)"
                    class="p-2 rounded-xl text-red-400 hover:bg-red-900/20 transition">
              🗑️
            </button>
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
              placeholder="Cari judul, penulis..." />
          </div>
        }
      </div>

      <!-- LIST -->
      @if (viewState() === 'list') {
        <div class="p-4">
          @if (library.isLoading()) {
            <div class="text-center py-16 opacity-50">
              <div class="text-4xl mb-3 animate-pulse">📚</div>
              <p class="text-sm" [class.text-slate-400]="ts.isDarkMode()">Memuat...</p>
            </div>
          } @else if (library.books().length === 0) {
            <div class="text-center py-16">
              <div class="text-6xl mb-4">📭</div>
              <h3 class="text-lg font-bold mb-2" [class.text-white]="ts.isDarkMode()" [class.text-slate-800]="!ts.isDarkMode()">Perpustakaan Kosong</h3>
              <p class="text-sm mb-6" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Belum ada ebook. Tambahkan PDF, link, atau file lainnya!</p>
              <button (click)="viewState.set('add')" class="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold text-sm transition active:scale-95">
                ➕ Tambah Ebook Pertama
              </button>
            </div>
          } @else if (filteredBooks().length === 0) {
            <div class="text-center py-10 opacity-50">
              <div class="text-4xl mb-2">🔍</div>
              <p class="text-sm" [class.text-slate-400]="ts.isDarkMode()">Tidak ada hasil ditemukan</p>
            </div>
          } @else {
            <div class="grid grid-cols-2 gap-3">
              @for (book of filteredBooks(); track book.id) {
                <div (click)="openDetail(book)"
                     class="rounded-2xl border overflow-hidden cursor-pointer transition-all active:scale-95"
                     [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
                     [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                  <div class="h-28 flex items-center justify-center text-5xl relative"
                       [style.background]="getCoverGradient(book)">
                    <span>{{ book.coverEmoji }}</span>
                    <div class="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/40 text-white uppercase">{{ book.fileType }}</div>
                    <div class="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/30 text-white">{{ book.level }}</div>
                  </div>
                  <div class="p-3">
                    <h3 class="font-bold text-xs leading-tight line-clamp-2 mb-1" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">{{ book.title }}</h3>
                    <p class="text-[10px] line-clamp-1" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">{{ book.author || 'Tidak diketahui' }}</p>
                    <div class="flex items-center justify-between mt-1.5">
                      <span class="text-[9px] px-1.5 py-0.5 rounded-full" [class.bg-indigo-900]="ts.isDarkMode()" [class.text-indigo-300]="ts.isDarkMode()" [class.bg-indigo-100]="!ts.isDarkMode()" [class.text-indigo-700]="!ts.isDarkMode()">{{ getCategoryLabel(book.category) }}</span>
                      <span class="text-[9px]" [class.text-slate-500]="ts.isDarkMode()" [class.text-slate-400]="!ts.isDarkMode()">{{ book.addedDate }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
            <p class="text-center text-xs mt-4" [class.text-slate-500]="ts.isDarkMode()" [class.text-slate-400]="!ts.isDarkMode()">{{ filteredBooks().length }} ebook</p>
          }
        </div>
      }

      <!-- ADD FORM -->
      @if (viewState() === 'add') {
        <div class="p-4 space-y-4">
          <!-- File Type -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Tipe Sumber</label>
            <div class="grid grid-cols-2 gap-2">
              @for (t of fileTypes; track t.value) {
                <button (click)="form.fileType = t.value"
                        class="p-3 rounded-xl border text-sm font-semibold transition-all text-left"
                        [class.border-indigo-500]="form.fileType === t.value"
                        [class.bg-indigo-900]="ts.isDarkMode() && form.fileType === t.value" [class.text-white]="ts.isDarkMode() && form.fileType === t.value"
                        [class.bg-indigo-50]="!ts.isDarkMode() && form.fileType === t.value" [class.text-indigo-700]="!ts.isDarkMode() && form.fileType === t.value"
                        [class.bg-slate-900]="ts.isDarkMode() && form.fileType !== t.value" [class.border-slate-700]="ts.isDarkMode() && form.fileType !== t.value" [class.text-slate-300]="ts.isDarkMode() && form.fileType !== t.value"
                        [class.bg-white]="!ts.isDarkMode() && form.fileType !== t.value" [class.border-gray-200]="!ts.isDarkMode() && form.fileType !== t.value" [class.text-slate-700]="!ts.isDarkMode() && form.fileType !== t.value">
                  {{ t.icon }} {{ t.label }}
                </button>
              }
            </div>
          </div>

          <!-- File Upload -->
          @if (form.fileType !== 'URL') {
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">File</label>
              <div class="relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer"
                   [class.border-slate-700]="ts.isDarkMode() && !selectedFile()" [class.bg-slate-900]="ts.isDarkMode()"
                   [class.border-gray-300]="!ts.isDarkMode() && !selectedFile()" [class.bg-white]="!ts.isDarkMode()"
                   [class.border-indigo-500]="selectedFile()"
                   (click)="fileInput.click()"
                   (dragover)="$event.preventDefault()"
                   (drop)="onFileDrop($event)">
                <input #fileInput type="file" class="hidden" [accept]="getAcceptTypes()" (change)="onFileSelected($event)"/>
                @if (!selectedFile()) {
                  <div class="text-4xl mb-2">📁</div>
                  <p class="text-sm font-medium" [class.text-white]="ts.isDarkMode()" [class.text-slate-700]="!ts.isDarkMode()">Ketuk untuk pilih file</p>
                  <p class="text-xs mt-1 opacity-50">PDF, gambar, atau dokumen lainnya</p>
                } @else {
                  <div class="text-3xl mb-2">✅</div>
                  <p class="text-sm font-bold" [class.text-white]="ts.isDarkMode()" [class.text-slate-800]="!ts.isDarkMode()">{{ selectedFile()!.name }}</p>
                  <p class="text-xs opacity-60 mt-1">{{ library.formatFileSize(selectedFile()!.size) }}</p>
                  <button (click)="$event.stopPropagation(); clearFile()" class="mt-2 text-xs text-red-400 underline">Ganti file</button>
                }
              </div>
            </div>
          }

          <!-- URL -->
          @if (form.fileType === 'URL') {
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Link URL</label>
              <input type="url" [(ngModel)]="form.sourceUrl"
                     class="w-full px-4 py-3 rounded-xl border outline-none text-sm"
                     [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()" [class.text-white]="ts.isDarkMode()"
                     [class.bg-white]="!ts.isDarkMode()" [class.border-gray-300]="!ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()"
                     placeholder="https://contoh.com/buku.pdf"/>
            </div>
          }

          <!-- Title -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Judul *</label>
            <input type="text" [(ngModel)]="form.title"
                   class="w-full px-4 py-3 rounded-xl border outline-none text-sm"
                   [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()" [class.text-white]="ts.isDarkMode()"
                   [class.bg-white]="!ts.isDarkMode()" [class.border-gray-300]="!ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()"
                   placeholder="Judul ebook..."/>
          </div>

          <!-- Author -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Penulis</label>
            <input type="text" [(ngModel)]="form.author"
                   class="w-full px-4 py-3 rounded-xl border outline-none text-sm"
                   [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()" [class.text-white]="ts.isDarkMode()"
                   [class.bg-white]="!ts.isDarkMode()" [class.border-gray-300]="!ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()"
                   placeholder="Nama penulis..."/>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Deskripsi</label>
            <textarea [(ngModel)]="form.description" rows="2"
                      class="w-full px-4 py-3 rounded-xl border outline-none text-sm resize-none"
                      [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()" [class.text-white]="ts.isDarkMode()"
                      [class.bg-white]="!ts.isDarkMode()" [class.border-gray-300]="!ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()"
                      placeholder="Deskripsi singkat..."></textarea>
          </div>

          <!-- Level & Category -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Level</label>
              <select [(ngModel)]="form.level"
                      class="w-full px-3 py-2.5 rounded-xl border outline-none text-sm"
                      [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()" [class.text-white]="ts.isDarkMode()"
                      [class.bg-white]="!ts.isDarkMode()" [class.border-gray-300]="!ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
                @for (lv of levels; track lv) { <option [value]="lv">{{ lv }}</option> }
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Kategori</label>
              <select [(ngModel)]="form.category"
                      class="w-full px-3 py-2.5 rounded-xl border outline-none text-sm"
                      [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()" [class.text-white]="ts.isDarkMode()"
                      [class.bg-white]="!ts.isDarkMode()" [class.border-gray-300]="!ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
                @for (cat of categories; track cat.value) { <option [value]="cat.value">{{ cat.label }}</option> }
              </select>
            </div>
          </div>

          <!-- Cover -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Sampul</label>
            <div class="flex items-center gap-3">
              <div class="w-14 h-20 rounded-xl flex items-center justify-center text-3xl text-white shrink-0"
                   [style.background]="getCoverGradient({coverColor: form.coverColor})">
                {{ form.coverEmoji || '📖' }}
              </div>
              <div class="flex-1">
                <input type="text" [(ngModel)]="form.coverEmoji" maxlength="2"
                       class="w-full px-3 py-2 rounded-xl border outline-none text-sm mb-2"
                       [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()" [class.text-white]="ts.isDarkMode()"
                       [class.bg-white]="!ts.isDarkMode()" [class.border-gray-300]="!ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()"
                       placeholder="Emoji"/>
                <div class="flex gap-1.5 flex-wrap">
                  @for (clr of coverColors; track clr.value) {
                    <button (click)="form.coverColor = clr.value"
                            class="w-7 h-7 rounded-full border-2 transition-all"
                            [style.background]="clr.preview"
                            [class.border-white]="form.coverColor === clr.value"
                            [class.scale-125]="form.coverColor === clr.value"
                            [class.border-transparent]="form.coverColor !== clr.value">
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Catatan (opsional)</label>
            <input type="text" [(ngModel)]="form.notes"
                   class="w-full px-4 py-3 rounded-xl border outline-none text-sm"
                   [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()" [class.text-white]="ts.isDarkMode()"
                   [class.bg-white]="!ts.isDarkMode()" [class.border-gray-300]="!ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()"
                   placeholder="Catatan tambahan..."/>
          </div>

          <!-- Save -->
          <button (click)="saveBook()" [disabled]="isSaving() || !canSave()"
                  class="w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-95"
                  [class.bg-indigo-600]="canSave() && !isSaving()"
                  [class.bg-slate-700]="!canSave() || isSaving()">
            @if (isSaving()) { ⏳ Menyimpan... } @else { ✅ Simpan Ebook }
          </button>
        </div>
      }

      <!-- DETAIL -->
      @if (viewState() === 'detail' && selectedBook()) {
        <div class="p-4">
          <div class="rounded-2xl overflow-hidden mb-4 border" [class.border-slate-800]="ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
            <div class="h-40 flex items-center justify-center text-7xl" [style.background]="getCoverGradient(selectedBook()!)">
              {{ selectedBook()!.coverEmoji }}
            </div>
            <div class="p-4" [class.bg-slate-900]="ts.isDarkMode()" [class.bg-white]="!ts.isDarkMode()">
              <div class="flex gap-2 mb-2 flex-wrap">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">{{ selectedBook()!.level }}</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full" [class.bg-slate-700]="ts.isDarkMode()" [class.text-slate-300]="ts.isDarkMode()" [class.bg-gray-200]="!ts.isDarkMode()" [class.text-slate-600]="!ts.isDarkMode()">{{ getCategoryLabel(selectedBook()!.category) }}</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full" [class.bg-slate-700]="ts.isDarkMode()" [class.text-slate-300]="ts.isDarkMode()" [class.bg-gray-200]="!ts.isDarkMode()" [class.text-slate-600]="!ts.isDarkMode()">{{ selectedBook()!.fileType }}</span>
              </div>
              <h2 class="text-xl font-bold mb-1" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">{{ selectedBook()!.title }}</h2>
              @if (selectedBook()!.author) { <p class="text-sm opacity-60" [class.text-slate-300]="ts.isDarkMode()" [class.text-slate-600]="!ts.isDarkMode()">oleh {{ selectedBook()!.author }}</p> }
              @if (selectedBook()!.description) {
                <p class="text-sm mt-2 leading-relaxed" [class.text-slate-300]="ts.isDarkMode()" [class.text-slate-600]="!ts.isDarkMode()">{{ selectedBook()!.description }}</p>
              }
              @if (selectedBook()!.notes) {
                <div class="mt-3 p-3 rounded-xl border" [class.bg-amber-900/20]="ts.isDarkMode()" [class.border-amber-800]="ts.isDarkMode()" [class.bg-amber-50]="!ts.isDarkMode()" [class.border-amber-200]="!ts.isDarkMode()">
                  <div class="text-[10px] text-amber-500 font-bold mb-1">📝 CATATAN</div>
                  <p class="text-xs" [class.text-amber-200]="ts.isDarkMode()" [class.text-amber-800]="!ts.isDarkMode()">{{ selectedBook()!.notes }}</p>
                </div>
              }
              <p class="text-xs mt-3 opacity-40">Ditambahkan {{ selectedBook()!.addedDate }}</p>
            </div>
          </div>
          <button (click)="openReader(selectedBook()!)" class="w-full py-4 rounded-2xl font-bold text-white bg-indigo-600 transition active:scale-95 flex items-center justify-center gap-2">
            📖 Buka Sekarang
          </button>
          @if (selectedBook()!.fileName) {
            <p class="text-center text-xs mt-2 opacity-40">{{ selectedBook()!.fileName }} @if (selectedBook()!.fileSize) { ({{ library.formatFileSize(selectedBook()!.fileSize!) }}) }</p>
          }
        </div>
      }

      <!-- READ -->
      @if (viewState() === 'read') {
        <div style="height: calc(100vh - 72px)">
          @if (isLoadingFile()) {
            <div class="flex items-center justify-center h-full opacity-50">
              <div class="text-center"><div class="text-4xl animate-pulse mb-3">📂</div><p class="text-sm">Memuat file...</p></div>
            </div>
          } @else if (fileUrl()) {
            @if (isPdfUrl()) {
              <iframe [src]="fileUrl()" class="w-full h-full border-0" title="PDF Viewer"></iframe>
            } @else if (isImageUrl()) {
              <div class="h-full overflow-auto flex items-start justify-center p-4">
                <img [src]="fileUrl()!" alt="Ebook" class="max-w-full rounded-xl shadow-2xl"/>
              </div>
            } @else {
              <iframe [src]="fileUrl()" class="w-full h-full border-0" title="File Viewer"></iframe>
            }
          } @else if (selectedBook()?.fileType === 'URL') {
            <div class="flex items-center justify-center h-full p-6">
              <div class="text-center">
                <div class="text-5xl mb-4">🔗</div>
                <p class="font-bold mb-2" [class.text-white]="ts.isDarkMode()" [class.text-slate-800]="!ts.isDarkMode()">Sumber Eksternal</p>
                <p class="text-xs mb-4 opacity-60 break-all">{{ selectedBook()!.sourceUrl }}</p>
                <a [href]="selectedBook()!.sourceUrl" target="_blank" rel="noopener"
                   class="inline-block px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm">🌐 Buka di Browser</a>
              </div>
            </div>
          } @else {
            <div class="flex items-center justify-center h-full opacity-50">
              <div class="text-center"><div class="text-4xl mb-3">❌</div><p class="text-sm">File tidak dapat dibuka</p></div>
            </div>
          }
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
              <h3 class="text-lg font-bold mb-1" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">Hapus Ebook?</h3>
              <p class="text-sm opacity-60">File dan data akan dihapus permanen.</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button (click)="showDeleteConfirm.set(false)" class="py-3 rounded-xl font-semibold text-sm border transition"
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
export class EbookComponent {
  ts = inject(TranslationService);
  library = inject(LibraryService);

  viewState = signal<ViewState>('list');
  selectedBook = signal<UserEbook | null>(null);
  searchQuery = signal('');
  isSaving = signal(false);
  isLoadingFile = signal(false);
  fileUrl = signal<string | null>(null);
  showDeleteConfirm = signal(false);
  selectedFile = signal<File | null>(null);
  private deleteTargetId = '';
  private isNative = Capacitor.isNativePlatform();

  form = this.freshForm();

  levels = ['N5', 'N4', 'N3', 'N2', 'N1', 'JFT', 'SEMUA'];
  fileTypes = [
    { value: 'PDF', label: 'PDF', icon: '📄' },
    { value: 'IMAGE', label: 'Gambar', icon: '🖼️' },
    { value: 'URL', label: 'Link URL', icon: '🔗' },
    { value: 'LAINNYA', label: 'Lainnya', icon: '📁' },
  ];
  categories = [
    { value: 'GRAMMAR', label: 'Tata Bahasa' },
    { value: 'VOCABULARY', label: 'Kosakata' },
    { value: 'KANJI', label: 'Kanji' },
    { value: 'READING', label: 'Membaca' },
    { value: 'JLPT_PREP', label: 'Persiapan JLPT' },
    { value: 'JFT_PREP', label: 'Persiapan JFT' },
    { value: 'CULTURE', label: 'Budaya' },
    { value: 'BUSINESS', label: 'Bisnis' },
    { value: 'CONVERSATION', label: 'Percakapan' },
    { value: 'WORKBOOK', label: 'Buku Latihan' },
    { value: 'LAINNYA', label: 'Lainnya' },
  ];
  coverColors = [
    { value: 'indigo', preview: 'linear-gradient(135deg,#4f46e5,#7c3aed)' },
    { value: 'blue',   preview: 'linear-gradient(135deg,#2563eb,#0891b2)' },
    { value: 'green',  preview: 'linear-gradient(135deg,#16a34a,#0d9488)' },
    { value: 'red',    preview: 'linear-gradient(135deg,#dc2626,#ea580c)' },
    { value: 'pink',   preview: 'linear-gradient(135deg,#db2777,#9333ea)' },
    { value: 'amber',  preview: 'linear-gradient(135deg,#d97706,#ca8a04)' },
    { value: 'slate',  preview: 'linear-gradient(135deg,#475569,#334155)' },
    { value: 'teal',   preview: 'linear-gradient(135deg,#0f766e,#0284c7)' },
  ];

  filteredBooks = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const all = this.library.books();
    if (!q) return all;
    return all.filter(b =>
      b.title.toLowerCase().includes(q) ||
      (b.author || '').toLowerCase().includes(q) ||
      (b.description || '').toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
    );
  });

  canSave = computed(() => {
    if (!this.form.title.trim()) return false;
    if (this.form.fileType === 'URL') return !!this.form.sourceUrl.trim();
    return !!this.selectedFile();
  });

  isPdfUrl = computed(() => {
    const url = this.fileUrl();
    const book = this.selectedBook();
    return url && (book?.fileMimeType === 'application/pdf' || book?.fileType === 'PDF');
  });

  isImageUrl = computed(() => {
    const book = this.selectedBook();
    return book?.fileMimeType?.startsWith('image/') || book?.fileType === 'IMAGE';
  });

  goBack() {
    if (this.viewState() === 'read') {
      this.viewState.set('detail');
      if (this.fileUrl()) { URL.revokeObjectURL(this.fileUrl()!); this.fileUrl.set(null); }
    } else if (this.viewState() === 'detail') {
      this.viewState.set('list'); this.selectedBook.set(null);
    } else {
      this.viewState.set('list'); this.resetForm();
    }
  }

  openDetail(book: UserEbook) { this.selectedBook.set(book); this.viewState.set('detail'); }

  async openReader(book: UserEbook) {
    this.selectedBook.set(book);
    this.viewState.set('read');
    if (book.fileType === 'URL') return;
    this.isLoadingFile.set(true);
    try {
      const url = await this.library.getFileUrl(book.id);
      this.fileUrl.set(url);
    } finally { this.isLoadingFile.set(false); }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.setFile(file);
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) this.setFile(file);
  }

  private setFile(file: File) {
    this.selectedFile.set(file);
    this.form.fileName = file.name;
    this.form.fileSize = file.size;
    this.form.fileMimeType = file.type;
    if (!this.form.title.trim()) this.form.title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    if (file.type === 'application/pdf') this.form.fileType = 'PDF';
    else if (file.type.startsWith('image/')) this.form.fileType = 'IMAGE';
    else this.form.fileType = 'LAINNYA';
  }

  clearFile() { this.selectedFile.set(null); this.form.fileName = ''; this.form.fileSize = 0; this.form.fileMimeType = ''; }

  getAcceptTypes(): string {
    switch (this.form.fileType) {
      case 'PDF': return '.pdf,application/pdf';
      case 'IMAGE': return 'image/*';
      default: return '*/*';
    }
  }

  async saveBook() {
    if (!this.canSave()) return;
    this.isSaving.set(true);
    try {
      const meta: Omit<UserEbook, 'id' | 'addedDate'> = {
        title: this.form.title.trim(),
        author: this.form.author.trim(),
        description: this.form.description.trim(),
        level: this.form.level as any,
        category: this.form.category,
        coverEmoji: this.form.coverEmoji || '📖',
        coverColor: this.form.coverColor,
        fileType: this.form.fileType as any,
        sourceUrl: this.form.fileType === 'URL' ? this.form.sourceUrl.trim() : undefined,
        fileName: this.form.fileName || undefined,
        fileSize: this.form.fileSize || undefined,
        fileMimeType: this.form.fileMimeType || undefined,
        language: 'BILINGUAL',
        notes: this.form.notes.trim() || undefined,
      };
      let fileBuffer: ArrayBuffer | undefined;
      if (this.selectedFile() && this.form.fileType !== 'URL') {
        fileBuffer = await this.selectedFile()!.arrayBuffer();
      }
      await this.library.addBook(meta, fileBuffer);
      this.resetForm();
      this.viewState.set('list');
    } catch (e) {
      console.error('[Ebook] Save error', e);
      alert('Gagal menyimpan. Pastikan ruang penyimpanan cukup.');
    } finally { this.isSaving.set(false); }
  }

  confirmDelete(id: string) { this.deleteTargetId = id; this.showDeleteConfirm.set(true); }

  async doDelete() {
    await this.library.deleteBook(this.deleteTargetId);
    this.showDeleteConfirm.set(false);
    this.viewState.set('list');
    this.selectedBook.set(null);
  }

  getCoverGradient(book: { coverColor?: string }): string {
    const m: Record<string, string> = {
      indigo: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
      blue:   'linear-gradient(135deg,#2563eb,#0891b2)',
      green:  'linear-gradient(135deg,#16a34a,#0d9488)',
      red:    'linear-gradient(135deg,#dc2626,#ea580c)',
      pink:   'linear-gradient(135deg,#db2777,#9333ea)',
      amber:  'linear-gradient(135deg,#d97706,#ca8a04)',
      slate:  'linear-gradient(135deg,#475569,#334155)',
      teal:   'linear-gradient(135deg,#0f766e,#0284c7)',
    };
    return m[book.coverColor || ''] ?? m['indigo'];
  }

  getCategoryLabel(cat: string): string {
    return this.categories.find(c => c.value === cat)?.label ?? cat;
  }

  private freshForm() {
    return { fileType: 'PDF', sourceUrl: '', title: '', author: '', description: '',
             level: 'N5', category: 'GRAMMAR', coverEmoji: '📖', coverColor: 'indigo',
             notes: '', fileName: '', fileSize: 0, fileMimeType: '' };
  }

  private resetForm() { this.form = this.freshForm(); this.selectedFile.set(null); }
}
