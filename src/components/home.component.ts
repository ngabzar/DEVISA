import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgOptimizedImage, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JapaneseDataService } from '../services/data.service';
import { TranslationService } from '../services/translation.service';
import { NotesService } from '../services/notes.service';
import { LibraryService } from '../services/library.service';
import { KanaToRomajiPipe } from '../pipes/kana-to-romaji.pipe';
import { Kanji, Vocab, Grammar, Particle, Kana } from '../types';

// Tipe gabungan untuk hasil pencarian
type SearchResult = 
  | { type: 'KANJI'; data: Kanji }
  | { type: 'VOCAB'; data: Vocab }
  | { type: 'GRAMMAR'; data: Grammar }
  | { type: 'PARTICLE'; data: Particle }
  | { type: 'KANA'; data: Kana };

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, FormsModule, KanaToRomajiPipe],
  providers: [KanaToRomajiPipe],
  template: `
    <div class="pb-24 relative min-h-screen transition-colors" 
         (click)="closeSearch()"
         [class.bg-slate-950]="ts.isDarkMode()" [class.bg-gray-50]="!ts.isDarkMode()">
         
      <div class="p-4 pt-6 sticky top-0 z-30 transition-colors" 
           (click)="$event.stopPropagation()"
           [class.bg-slate-950]="ts.isDarkMode()" [class.bg-gray-50]="!ts.isDarkMode()">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input type="text" 
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            (input)="onSearch()"
            class="block w-full pl-10 pr-10 py-3 border rounded-xl leading-5 sm:text-sm transition-all outline-none"
            [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()" [class.text-gray-300]="ts.isDarkMode()" [class.placeholder-gray-600]="ts.isDarkMode()"
            [class.bg-white]="!ts.isDarkMode()" [class.border-gray-300]="!ts.isDarkMode()" [class.text-gray-900]="!ts.isDarkMode()" [class.placeholder-gray-400]="!ts.isDarkMode()"
            [placeholder]="ts.get('home.search_placeholder')" />
          
          @if (searchQuery()) {
            <button (click)="clearSearch()" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          }

          @if (searchResults().length > 0 && searchQuery()) {
            <div class="absolute top-full left-0 right-0 mt-2 border rounded-xl shadow-2xl max-h-[60vh] overflow-y-auto no-scrollbar z-40"
                 [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()"
                 [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
              @for (result of searchResults(); track $index) {
                <div (click)="selectResult(result)" 
                     class="p-3 border-b cursor-pointer flex items-center gap-3 last:border-0 transition-colors"
                     [class.border-slate-800]="ts.isDarkMode()" [class.hover-bg-slate-800]="ts.isDarkMode()"
                     [class.border-gray-100]="!ts.isDarkMode()" [class.hover-bg-gray-100]="!ts.isDarkMode()">
                  
                  @if (result.type === 'KANJI') {
                    <div class="w-10 h-10 rounded-lg bg-blue-900/30 border border-blue-800 flex items-center justify-center text-blue-400 font-bold shrink-0">
                      {{ result.data.char }}
                    </div>
                  } @else if (result.type === 'VOCAB') {
                    <div class="w-10 h-10 rounded-lg bg-cyan-900/30 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
                      {{ result.data.level }}
                    </div>
                  } @else if (result.type === 'GRAMMAR') {
                    <div class="w-10 h-10 rounded-lg bg-emerald-900/30 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                      文
                    </div>
                  } @else if (result.type === 'PARTICLE') {
                    <div class="w-10 h-10 rounded-lg bg-amber-900/30 border border-amber-800 flex items-center justify-center text-amber-400 font-bold shrink-0">
                      {{ result.data.char }}
                    </div>
                  } @else if (result.type === 'KANA') {
                    <div class="w-10 h-10 rounded-lg bg-rose-900/30 border border-rose-800 flex items-center justify-center text-rose-400 font-bold shrink-0">
                      {{ result.data.char }}
                    </div>
                  }

                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-center mb-0.5">
                      <span class="font-bold truncate" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
                        @if (result.type === 'KANJI') { {{ result.data.meaning }} }
                        @else if (result.type === 'VOCAB') { {{ result.data.word }} — {{ result.data.meaning }} }
                        @else if (result.type === 'GRAMMAR') { {{ result.data.title }} }
                        @else if (result.type === 'PARTICLE') { {{ result.data.char }} — {{ result.data.usage }} }
                        @else if (result.type === 'KANA') { {{ result.data.char }} ({{ result.data.romaji }}) }
                      </span>
                      <span class="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ml-1 shrink-0"
                        [class]="result.type === 'KANJI' ? 'bg-blue-900 text-blue-300' : 
                                 result.type === 'VOCAB' ? 'bg-cyan-900 text-cyan-300' :
                                 result.type === 'GRAMMAR' ? 'bg-emerald-900 text-emerald-300' :
                                 result.type === 'PARTICLE' ? 'bg-amber-900 text-amber-300' :
                                 'bg-rose-900 text-rose-300'">
                        {{ result.type }}
                      </span>
                    </div>
                    <div class="text-xs text-slate-400 truncate">
                      @if (result.type === 'KANJI') {
                        On: {{ result.data.onyomi.join(', ') }} | Kun: {{ result.data.kunyomi.join(', ') }}
                      } @else if (result.type === 'VOCAB') {
                        {{ result.data.kana }} ({{ result.data.kana | kanaToRomaji }})
                      } @else if (result.type === 'GRAMMAR') {
                        {{ result.data.formula }} — Level {{ result.data.level }}
                      } @else if (result.type === 'PARTICLE') {
                        {{ result.data.example }}
                      } @else if (result.type === 'KANA') {
                        {{ result.data.type }} — {{ result.data.group }}
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else if (searchQuery() && searchResults().length === 0) {
             <div class="absolute top-full left-0 right-0 mt-2 border rounded-xl p-4 text-center text-slate-500 text-sm z-40"
                  [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()"
                  [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
               Tidak ada hasil ditemukan.
             </div>
          }
        </div>
        <h2 class="text-xl font-semibold mt-6 mb-2" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
          {{ ts.get('home.start_learning') }}
        </h2>
        <div class="h-0.5 w-full mb-4" [class.bg-slate-800]="ts.isDarkMode()" [class.bg-gray-200]="!ts.isDarkMode()"></div>
      </div>

      <div class="px-4 grid grid-cols-2 gap-4">
        
        <div (click)="showKanaModal.set(true)" 
             class="aspect-square border rounded-2xl flex flex-col items-center justify-center transition-colors cursor-pointer group"
             [class.bg-rose-950_20]="ts.isDarkMode()" [class.border-rose-900_50]="ts.isDarkMode()" [class.hover-bg-rose-900_30]="ts.isDarkMode()"
             [class.bg-rose-50]="!ts.isDarkMode()" [class.border-rose-200]="!ts.isDarkMode()" [class.hover-bg-rose-100]="!ts.isDarkMode()">
          <div class="text-5xl font-bold text-rose-400 mb-2 group-hover:scale-110 transition-transform">あ</div>
          <div class="text-sm font-medium" [class.text-rose-200]="ts.isDarkMode()" [class.text-rose-700]="!ts.isDarkMode()">{{ ts.get('home.menu.kana') }} (あ/ア)</div>
        </div>

        <a routerLink="/kanji" 
           class="aspect-square border rounded-2xl flex flex-col items-center justify-center transition-colors cursor-pointer group"
           [class.bg-blue-950_20]="ts.isDarkMode()" [class.border-blue-900_50]="ts.isDarkMode()" [class.hover-bg-blue-900_30]="ts.isDarkMode()"
           [class.bg-blue-50]="!ts.isDarkMode()" [class.border-blue-200]="!ts.isDarkMode()" [class.hover-bg-blue-100]="!ts.isDarkMode()">
          <div class="text-5xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform">字</div>
          <div class="text-sm font-medium" [class.text-blue-200]="ts.isDarkMode()" [class.text-blue-700]="!ts.isDarkMode()">{{ ts.get('home.menu.kanji') }} (漢字)</div>
        </a>

        <a routerLink="/bunpou" 
           class="aspect-square border rounded-2xl flex flex-col items-center justify-center transition-colors cursor-pointer group"
           [class.bg-emerald-950_20]="ts.isDarkMode()" [class.border-emerald-900_50]="ts.isDarkMode()" [class.hover-bg-emerald-900_30]="ts.isDarkMode()"
           [class.bg-emerald-50]="!ts.isDarkMode()" [class.border-emerald-200]="!ts.isDarkMode()" [class.hover-bg-emerald-100]="!ts.isDarkMode()">
          <div class="text-5xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform">文</div>
          <div class="text-sm font-medium" [class.text-emerald-200]="ts.isDarkMode()" [class.text-emerald-700]="!ts.isDarkMode()">{{ ts.get('home.menu.grammar') }} (文法)</div>
        </a>

        <a routerLink="/particles" 
           class="aspect-square border rounded-2xl flex flex-col items-center justify-center transition-colors cursor-pointer group"
           [class.bg-amber-950_20]="ts.isDarkMode()" [class.border-amber-900_50]="ts.isDarkMode()" [class.hover-bg-amber-900_30]="ts.isDarkMode()"
           [class.bg-amber-50]="!ts.isDarkMode()" [class.border-amber-200]="!ts.isDarkMode()" [class.hover-bg-amber-100]="!ts.isDarkMode()">
          <div class="text-5xl font-bold text-amber-400 mb-2 group-hover:scale-110 transition-transform">は</div>
          <div class="text-sm font-medium" [class.text-amber-200]="ts.isDarkMode()" [class.text-amber-700]="!ts.isDarkMode()">{{ ts.get('home.menu.particles') }} (助詞)</div>
        </a>

        <a routerLink="/writing" 
           class="aspect-square border rounded-2xl flex flex-col items-center justify-center transition-colors cursor-pointer group"
           [class.bg-purple-950_20]="ts.isDarkMode()" [class.border-purple-900_50]="ts.isDarkMode()" [class.hover-bg-purple-900_30]="ts.isDarkMode()"
           [class.bg-purple-50]="!ts.isDarkMode()" [class.border-purple-200]="!ts.isDarkMode()" [class.hover-bg-purple-100]="!ts.isDarkMode()">
          <div class="text-5xl mb-2 group-hover:scale-110 transition-transform text-purple-400">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
               <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </div>
          <div class="text-sm font-medium" [class.text-purple-200]="ts.isDarkMode()" [class.text-purple-700]="!ts.isDarkMode()">{{ ts.get('home.menu.writing') }} (書く)</div>
        </a>

        <a routerLink="/vocab" 
           class="aspect-square border rounded-2xl flex flex-col items-center justify-center transition-colors cursor-pointer group"
           [class.bg-cyan-950_20]="ts.isDarkMode()" [class.border-cyan-900_50]="ts.isDarkMode()" [class.hover-bg-cyan-900_30]="ts.isDarkMode()"
           [class.bg-cyan-50]="!ts.isDarkMode()" [class.border-cyan-200]="!ts.isDarkMode()" [class.hover-bg-cyan-100]="!ts.isDarkMode()">
          <div class="text-5xl font-bold text-cyan-400 mb-2 group-hover:scale-110 transition-transform">本</div>
          <div class="text-sm font-medium" [class.text-cyan-200]="ts.isDarkMode()" [class.text-cyan-700]="!ts.isDarkMode()">{{ ts.get('home.menu.vocab') }} (単語)</div>
        </a>

        <a routerLink="/flashcard" 
           class="aspect-square border rounded-2xl flex flex-col items-center justify-center transition-colors cursor-pointer group"
           [class.bg-yellow-950_20]="ts.isDarkMode()" [class.border-yellow-900_50]="ts.isDarkMode()" [class.hover-bg-yellow-900_30]="ts.isDarkMode()"
           [class.bg-yellow-50]="!ts.isDarkMode()" [class.border-yellow-200]="!ts.isDarkMode()" [class.hover-bg-yellow-100]="!ts.isDarkMode()">
          <div class="text-5xl mb-2 group-hover:scale-110 transition-transform text-yellow-400">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
            </svg>
          </div>
          <div class="text-sm font-medium" [class.text-yellow-200]="ts.isDarkMode()" [class.text-yellow-700]="!ts.isDarkMode()">{{ ts.get('home.menu.flashcard') }}</div>
        </a>

        <a routerLink="/quiz" 
           class="aspect-square border rounded-2xl flex flex-col items-center justify-center transition-colors cursor-pointer group"
           [class.bg-slate-800_40]="ts.isDarkMode()" [class.border-slate-700_50]="ts.isDarkMode()" [class.hover-bg-slate-800_60]="ts.isDarkMode()"
           [class.bg-slate-100]="!ts.isDarkMode()" [class.border-slate-200]="!ts.isDarkMode()" [class.hover-bg-slate-200]="!ts.isDarkMode()">
          <div class="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform" [class.text-slate-300]="ts.isDarkMode()" [class.text-slate-600]="!ts.isDarkMode()">?</div>
          <div class="text-sm font-medium" [class.text-slate-300]="ts.isDarkMode()" [class.text-slate-600]="!ts.isDarkMode()">{{ ts.get('home.menu.quiz') }}</div>
        </a>

        <!-- NEW: Mensetsu / Wawancara -->
        <div (click)="showMensetsuModal.set(true)"
             class="aspect-square border rounded-2xl flex flex-col items-center justify-center transition-colors cursor-pointer group"
             [class.bg-pink-950_20]="ts.isDarkMode()" [class.border-pink-900_50]="ts.isDarkMode()" [class.hover-bg-pink-900_30]="ts.isDarkMode()"
             [class.bg-pink-50]="!ts.isDarkMode()" [class.border-pink-200]="!ts.isDarkMode()" [class.hover-bg-pink-100]="!ts.isDarkMode()">
          <div class="text-5xl mb-2 group-hover:scale-110 transition-transform text-pink-400">🎤</div>
          <div class="text-sm font-medium text-center" [class.text-pink-200]="ts.isDarkMode()" [class.text-pink-700]="!ts.isDarkMode()">Kisi-kisi Mensetsu (面接)</div>
        </div>

        <!-- NEW: EBook -->
        <a routerLink="/ebook"
           class="aspect-square border rounded-2xl flex flex-col items-center justify-center transition-colors cursor-pointer group"
           [class.bg-indigo-950_20]="ts.isDarkMode()" [class.border-indigo-900_50]="ts.isDarkMode()" [class.hover-bg-indigo-900_30]="ts.isDarkMode()"
           [class.bg-indigo-50]="!ts.isDarkMode()" [class.border-indigo-200]="!ts.isDarkMode()" [class.hover-bg-indigo-100]="!ts.isDarkMode()">
          <div class="text-5xl mb-2 group-hover:scale-110 transition-transform text-indigo-400">📚</div>
          <div class="text-sm font-medium" [class.text-indigo-200]="ts.isDarkMode()" [class.text-indigo-700]="!ts.isDarkMode()">Perpustakaan (本棚)</div>
        </a>

        <!-- NEW: Catatan -->
        <a routerLink="/notes"
           class="aspect-square border rounded-2xl flex flex-col items-center justify-center transition-colors cursor-pointer group"
           [class.bg-yellow-950_20]="ts.isDarkMode()" [class.border-yellow-900_50]="ts.isDarkMode()" [class.hover-bg-yellow-900_30]="ts.isDarkMode()"
           [class.bg-yellow-50]="!ts.isDarkMode()" [class.border-yellow-200]="!ts.isDarkMode()" [class.hover-bg-yellow-100]="!ts.isDarkMode()">
          <div class="text-5xl mb-2 group-hover:scale-110 transition-transform text-yellow-400">📝</div>
          <div class="text-sm font-medium text-center" [class.text-yellow-200]="ts.isDarkMode()" [class.text-yellow-700]="!ts.isDarkMode()">Catatan (メモ)</div>
        </a>

      </div>

      <!-- Catatan Widget -->
      <div class="px-4 mt-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-bold text-sm" [class.text-white]="ts.isDarkMode()" [class.text-slate-800]="!ts.isDarkMode()">📝 Catatan Terakhir</h3>
          <a routerLink="/notes" class="text-xs text-indigo-400 font-semibold">Lihat semua →</a>
        </div>
        @if (ns.getSortedNotes().length === 0) {
          <a routerLink="/notes"
             class="block rounded-2xl border-2 border-dashed p-4 text-center transition"
             [class.border-slate-700]="ts.isDarkMode()" [class.text-slate-500]="ts.isDarkMode()"
             [class.border-gray-300]="!ts.isDarkMode()" [class.text-slate-400]="!ts.isDarkMode()">
            <div class="text-2xl mb-1">✏️</div>
            <p class="text-xs">Belum ada catatan. Ketuk untuk membuat</p>
          </a>
        } @else {
          <div class="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            @for (note of ns.getSortedNotes().slice(0, 5); track note.id) {
              @let cc = ns.getColorConfig(note.color);
              <a routerLink="/notes"
                 class="shrink-0 w-36 rounded-2xl border p-3 cursor-pointer transition-all active:scale-95"
                 [ngClass]="ts.isDarkMode() ? [cc.bg, cc.border] : [cc.light]">
                @if (note.isPinned) { <div class="text-[9px] opacity-60 mb-1">📌</div> }
                <h4 class="font-bold text-xs line-clamp-1 mb-1" [class.text-white]="ts.isDarkMode()" [class.text-slate-800]="!ts.isDarkMode()">{{ note.title }}</h4>
                <p class="text-[10px] leading-tight line-clamp-3 opacity-70" [class.text-slate-300]="ts.isDarkMode()" [class.text-slate-600]="!ts.isDarkMode()">{{ note.content }}</p>
              </a>
            }
          </div>
        }
      </div>

      <!-- Kana Modal -->
      @if (showKanaModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" (click)="showKanaModal.set(false)"></div>
          <div class="relative border rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200"
               [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
               [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
            <div class="text-center mb-6">
              <h3 class="text-2xl font-bold mb-2" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">{{ ts.get('home.menu.kana') }}</h3>
              <p class="text-sm" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Hiragana & Katakana</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <button (click)="navigateToKana('HIRAGANA')" 
                class="p-4 border rounded-xl transition-all group"
                [class.bg-slate-800]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()" [class.hover-bg-rose-900_40]="ts.isDarkMode()"
                [class.bg-gray-100]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()" [class.hover-bg-rose-100]="!ts.isDarkMode()">
                <div class="text-4xl font-bold text-rose-400 mb-2 group-hover:scale-110 transition-transform">あ</div>
                <div class="text-sm font-bold" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">Hiragana</div>
              </button>
              <button (click)="navigateToKana('KATAKANA')" 
                class="p-4 border rounded-xl transition-all group"
                [class.bg-slate-800]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()" [class.hover-bg-rose-900_40]="ts.isDarkMode()"
                [class.bg-gray-100]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()" [class.hover-bg-rose-100]="!ts.isDarkMode()">
                <div class="text-4xl font-bold text-rose-400 mb-2 group-hover:scale-110 transition-transform">ア</div>
                <div class="text-sm font-bold" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">Katakana</div>
              </button>
            </div>
            <button (click)="showKanaModal.set(false)" class="mt-6 w-full py-3 font-medium text-slate-500 hover:text-slate-700">Batal</button>
          </div>
        </div>
      }

      <!-- Mensetsu Modal -->
      @if (showMensetsuModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" (click)="showMensetsuModal.set(false)"></div>
          <div class="relative border rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[80vh] overflow-y-auto"
               [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
               [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
            <div class="text-center mb-6">
              <div class="text-4xl mb-2">🎤</div>
              <h3 class="text-xl font-bold mb-1" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">Kisi-kisi Mensetsu</h3>
              <p class="text-sm" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Pilih level untuk latihan wawancara kerja</p>
            </div>
            
            <div class="space-y-3">
              @for (level of mensetsuLevels; track level) {
                <button (click)="goToMensetsu(level)"
                        class="w-full text-left p-4 rounded-xl border transition-all active:scale-95 flex items-center gap-3"
                        [class.bg-slate-800]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()"
                        [class.bg-gray-100]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                  <span class="font-bold px-3 py-1 rounded-lg text-white"
                        [style.background]="getLevelColor(level)">
                    {{ level }}
                  </span>
                  <div>
                    <div class="font-semibold text-sm" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
                      Mensetsu {{ level }}
                    </div>
                    <div class="text-xs" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">
                      Kisi-kisi wawancara level {{ level }}
                    </div>
                  </div>
                </button>
              }
            </div>
            
            <button (click)="showMensetsuModal.set(false)" class="mt-6 w-full py-3 font-medium text-slate-500 hover:text-slate-700">Tutup</button>
          </div>
        </div>
      }

      <!-- Search Result Detail Modal -->
      @if (selectedResult()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div class="absolute inset-0 bg-black/90 backdrop-blur-sm" (click)="selectedResult.set(null)"></div>
          
          <div class="relative border rounded-2xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden"
               [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()"
               [class.bg-white]="!ts.isDarkMode()" [class.border-gray-300]="!ts.isDarkMode()">
            
            <div class="p-4 border-b flex justify-between items-start"
                 [class.border-slate-800]="ts.isDarkMode()" [class.bg-slate-950_50]="ts.isDarkMode()"
                 [class.border-gray-200]="!ts.isDarkMode()" [class.bg-gray-50]="!ts.isDarkMode()">
              <span class="px-2 py-1 rounded text-[10px] font-bold tracking-widest border"
                [class]="selectedResult()!.type === 'KANJI' ? 'bg-blue-900/30 text-blue-300 border-blue-800' :
                         selectedResult()!.type === 'VOCAB' ? 'bg-cyan-900/30 text-cyan-300 border-cyan-800' :
                         selectedResult()!.type === 'GRAMMAR' ? 'bg-emerald-900/30 text-emerald-300 border-emerald-800' :
                         selectedResult()!.type === 'PARTICLE' ? 'bg-amber-900/30 text-amber-300 border-amber-800' :
                         'bg-rose-900/30 text-rose-300 border-rose-800'">
                {{ selectedResult()!.type }}
              </span>
              <button (click)="selectedResult.set(null)" class="text-slate-400 hover:text-white">✕</button>
            </div>

            <div class="p-6 text-center">
              
              @if (selectedResult()!.type === 'KANJI') {
                @let k = $any(selectedResult()!.data);
                <div class="text-8xl font-serif mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                     [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">{{ k.char }}</div>
                <h2 class="text-2xl font-bold text-blue-500 mb-6">{{ k.meaning }}</h2>
                
                <div class="grid grid-cols-2 gap-3 mb-6 text-left">
                  <div class="p-3 rounded-lg border"
                       [class.bg-slate-800]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()"
                       [class.bg-gray-100]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                    <span class="text-[10px] text-blue-500 font-bold block mb-1">ONYOMI</span>
                    <span class="text-sm" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">{{ k.onyomi.join(', ') || '-' }}</span>
                  </div>
                  <div class="p-3 rounded-lg border"
                       [class.bg-slate-800]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()"
                       [class.bg-gray-100]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                    <span class="text-[10px] text-rose-500 font-bold block mb-1">KUNYOMI</span>
                    <span class="text-sm" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">{{ k.kunyomi.join(', ') || '-' }}</span>
                  </div>
                </div>

                @if(k.story) {
                  <div class="p-3 rounded-lg border text-left mb-6"
                       [class.bg-slate-800_50]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
                       [class.bg-gray-50]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                    <div class="text-[10px] text-slate-500 font-bold mb-1">CERITA</div>
                    <p class="text-sm leading-relaxed" [class.text-slate-300]="ts.isDarkMode()" [class.text-slate-700]="!ts.isDarkMode()">{{ k.story }}</p>
                  </div>
                }
              }

              @if (selectedResult()!.type === 'VOCAB') {
                @let v = $any(selectedResult()!.data);
                <div class="text-4xl font-bold mb-2" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">{{ v.word }}</div>
                <div class="text-xl text-cyan-500 mb-1">{{ v.kana }}</div>
                <div class="text-sm text-slate-500 font-mono mb-6 italic">{{ v.kana | kanaToRomaji }}</div>
                
                <div class="p-4 rounded-xl border mb-6"
                     [class.bg-slate-800_50]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
                     [class.bg-gray-50]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                  <div class="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">Arti</div>
                  <div class="text-lg font-medium" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">{{ v.meaning }}</div>
                </div>
                
                @if(v.category) {
                   <div class="inline-block px-3 py-1 rounded-full text-xs text-slate-500 border border-slate-700">
                     Kategori: {{ v.category }}
                   </div>
                }
              }

              @if (selectedResult()!.type === 'GRAMMAR') {
                @let g = $any(selectedResult()!.data);
                <div class="text-3xl font-bold text-emerald-400 mb-2">{{ g.title }}</div>
                <div class="text-sm text-slate-400 font-mono mb-4 italic">{{ g.formula }}</div>
                <div class="p-4 rounded-xl border text-left mb-4"
                     [class.bg-slate-800]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()"
                     [class.bg-gray-50]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                  <div class="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">Penjelasan</div>
                  <p class="text-sm leading-relaxed" [class.text-slate-200]="ts.isDarkMode()" [class.text-slate-700]="!ts.isDarkMode()">{{ g.explanation }}</p>
                </div>
                @if (g.examples && g.examples.length > 0) {
                  <div class="text-left space-y-2">
                    <div class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Contoh</div>
                    @for (ex of g.examples.slice(0,2); track $index) {
                      <div class="p-3 rounded-lg border text-sm"
                           [class.bg-slate-800]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()"
                           [class.bg-gray-100]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                        <div class="font-medium" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">{{ ex.japanese }}</div>
                        <div class="text-xs italic text-slate-400 mt-0.5">{{ ex.romaji }}</div>
                        <div class="text-xs text-emerald-500 mt-0.5">{{ ex.meaning }}</div>
                      </div>
                    }
                  </div>
                }
              }

              @if (selectedResult()!.type === 'PARTICLE') {
                @let p = $any(selectedResult()!.data);
                <div class="text-7xl font-bold text-amber-400 mb-2">{{ p.char }}</div>
                <div class="text-lg font-semibold mb-4" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">{{ p.usage }}</div>
                @if (p.explanation) {
                  <div class="p-4 rounded-xl border text-left mb-4"
                       [class.bg-slate-800]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()"
                       [class.bg-gray-50]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                    <div class="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">Penjelasan</div>
                    <p class="text-sm leading-relaxed" [class.text-slate-200]="ts.isDarkMode()" [class.text-slate-700]="!ts.isDarkMode()">{{ p.explanation }}</p>
                  </div>
                }
                <div class="p-3 rounded-lg border text-left"
                     [class.bg-slate-800]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()"
                     [class.bg-gray-100]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                  <div class="text-xs text-amber-500 font-bold mb-1">CONTOH</div>
                  <div class="text-sm font-medium" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">{{ p.example }}</div>
                </div>
              }

              @if (selectedResult()!.type === 'KANA') {
                @let kn = $any(selectedResult()!.data);
                <div class="text-8xl font-bold text-rose-400 mb-4">{{ kn.char }}</div>
                <div class="text-3xl font-mono text-slate-300 mb-2">{{ kn.romaji }}</div>
                <div class="flex justify-center gap-2 mt-4">
                  <span class="px-3 py-1 rounded-full text-xs bg-rose-900/30 text-rose-300 border border-rose-800">{{ kn.type }}</span>
                  <span class="px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-300 border border-slate-700">{{ kn.group }}</span>
                </div>
              }

            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class HomeComponent implements OnInit {
  router = inject(Router);
  dataService = inject(JapaneseDataService);
  ts = inject(TranslationService);
  kanaToRomaji = inject(KanaToRomajiPipe);
  ns = inject(NotesService);
  library = inject(LibraryService);
  
  showKanaModal = signal(false);
  showMensetsuModal = signal(false);
  
  mensetsuLevels = ['N5', 'N4', 'N3', 'N2', 'N1'];

  // Search State
  searchQuery = signal('');
  searchResults = signal<SearchResult[]>([]);
  selectedResult = signal<SearchResult | null>(null);

  getLevelColor(level: string): string {
    const map: Record<string, string> = {
      'N5': '#16a34a', 'N4': '#2563eb', 'N3': '#ca8a04',
      'N2': '#ea580c', 'N1': '#dc2626'
    };
    return map[level] || '#6b7280';
  }

  navigateToKana(type: 'HIRAGANA' | 'KATAKANA') {
    this.router.navigate(['/kana'], { queryParams: { tab: type } });
    this.showKanaModal.set(false);
  }

  goToMensetsu(level: string) {
    this.showMensetsuModal.set(false);
    this.router.navigate(['/mensetsu'], { queryParams: { level } });
  }

  // Search Logic (supports Kanji, Kana, Romaji, Bunpou, Partikel, Indonesia)
  async onSearch() {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) {
      this.searchResults.set([]);
      return;
    }

    // Muat semua data secara paralel
    await Promise.all([
      this.dataService.loadKanji('ALL'),
      this.dataService.loadVocab('ALL'),
      this.dataService.loadKana(),
      ...(['N5','N4','N3','N2','N1'] as const).map(lv => this.dataService.loadGrammar(lv)),
      ...(['N5','N4','N3','N2','N1'] as const).map(lv => this.dataService.loadParticles(lv)),
    ]);

    const kanjis = this.dataService.getKanji('ALL').filter(k => 
      k.char === q || 
      k.meaning.toLowerCase().includes(q) ||
      k.onyomi.some(r => r.toLowerCase().includes(q)) ||
      k.kunyomi.some(r => r.toLowerCase().includes(q)) ||
      k.onyomi.some(r => this.kanaToRomaji.transform(r).toLowerCase().includes(q)) ||
      k.kunyomi.some(r => this.kanaToRomaji.transform(r).toLowerCase().includes(q)) ||
      k.examples?.some(ex => ex.word.toLowerCase().includes(q) || ex.meaning.toLowerCase().includes(q))
    ).map(k => ({ type: 'KANJI', data: k } as SearchResult));

    const vocabs = this.dataService.getVocab('ALL').filter(v => 
      v.word.toLowerCase().includes(q) ||
      v.kana.includes(q) ||
      v.meaning.toLowerCase().includes(q) ||
      this.kanaToRomaji.transform(v.kana).toLowerCase().includes(q) ||
      v.examples?.some(ex => (ex.japanese || '').toLowerCase().includes(q) || (ex.meaning || '').toLowerCase().includes(q))
    ).map(v => ({ type: 'VOCAB', data: v } as SearchResult));

    const grammars = (['N5','N4','N3','N2','N1'] as const)
      .flatMap(lv => this.dataService.getGrammar(lv))
      .filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.explanation.toLowerCase().includes(q) ||
        g.formula.toLowerCase().includes(q) ||
        g.examples?.some(ex => ex.japanese.toLowerCase().includes(q) || ex.meaning.toLowerCase().includes(q))
      ).map(g => ({ type: 'GRAMMAR', data: g } as SearchResult));

    const particles = (['N5','N4','N3','N2','N1'] as const)
      .flatMap(lv => this.dataService.getParticles(lv))
      .filter(p =>
        p.char.toLowerCase().includes(q) ||
        p.usage.toLowerCase().includes(q) ||
        (p.explanation ? p.explanation.toLowerCase().includes(q) : false) ||
        p.example.toLowerCase().includes(q) ||
        p.examples?.some(ex => ex.japanese.toLowerCase().includes(q) || ex.meaning.toLowerCase().includes(q))
      ).map(p => ({ type: 'PARTICLE', data: p } as SearchResult));

    // Search Kana (hiragana + katakana) by romaji or char
    const kanaGroups: Array<'GOJUUON'|'DAKUON'|'HANDAKUON'|'YOON'> = ['GOJUUON','DAKUON','HANDAKUON','YOON'];
    const allKana = [
      ...kanaGroups.flatMap(g => this.dataService.getKana('HIRAGANA', g)),
      ...kanaGroups.flatMap(g => this.dataService.getKana('KATAKANA', g)),
    ];
    const kanas = allKana.filter(k =>
      k.char.includes(q) ||
      k.romaji.toLowerCase().includes(q)
    ).map(k => ({ type: 'KANA', data: k } as SearchResult));

    this.searchResults.set([...kanas, ...kanjis, ...vocabs, ...grammars, ...particles].slice(0, 60));
  }

  clearSearch() {
    this.searchQuery.set('');
    this.searchResults.set([]);
  }

  closeSearch() {
    setTimeout(() => {}, 100);
  }

  selectResult(res: SearchResult) {
    this.selectedResult.set(res);
  }

  ngOnInit() {
    // Data dimuat lazy hanya saat search — tidak preload di halaman utama
  }
}
