import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JapaneseDataService } from '../services/data.service';
import { CustomDataService } from '../services/custom-data.service';
import { TranslationService } from '../services/translation.service';
import { Kanji } from '../types';
import { TtsService } from '../services/tts.service';
import { KanaToRomajiPipe } from '../pipes/kana-to-romaji.pipe';

@Component({
  selector: 'app-kanji',
  imports: [CommonModule, RouterLink, FormsModule],
  providers: [KanaToRomajiPipe],
  template: `
    <div class="min-h-screen bg-slate-950 pb-20">
      <div class="sticky top-0 bg-slate-950 z-20 p-4 border-b border-slate-800 flex items-center gap-4">
        <a routerLink="/" class="text-slate-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </a>
        <h1 class="text-xl font-bold text-blue-400 flex-1">{{ t.get('home.menu.kanji') }}</h1>
          <!-- Add Custom Button -->
          <a routerLink="/tambah/kanji" class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/50 hover:bg-blue-800/60 border border-blue-700 text-blue-300 text-xs font-semibold rounded-lg transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/>
            </svg>
            Tambah
          </a>
        <!-- Grid / List Toggle -->
        <div class="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
          <button (click)="viewMode.set('list')"
                  class="p-1.5 rounded transition"
                  [class.bg-blue-700]="viewMode() === 'list'"
                  [class.text-white]="viewMode() === 'list'"
                  [class.text-slate-500]="viewMode() !== 'list'">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
              <path fill-rule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 15.25Z" clip-rule="evenodd"/>
            </svg>
          </button>
          <button (click)="viewMode.set('grid')"
                  class="p-1.5 rounded transition"
                  [class.bg-blue-700]="viewMode() === 'grid'"
                  [class.text-white]="viewMode() === 'grid'"
                  [class.text-slate-500]="viewMode() !== 'grid'">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
              <path fill-rule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="p-4">
        <!-- SEARCH BAR -->
        <div class="mb-4">
          <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" [placeholder]="t.get('content.search_kanji')"
            class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition placeholder-slate-600" />
        </div>

        <!-- Level Tabs with Count -->
        <div class="flex bg-slate-900 rounded-lg p-1 mb-6 gap-1 overflow-x-auto">
          <button (click)="onLevelChange('N5')"
            [class]="level() === 'N5' ? 'flex-1 bg-blue-600 text-white rounded py-2 transition flex flex-col items-center justify-center min-w-[60px]' : 'flex-1 text-slate-400 py-2 transition hover:text-white flex flex-col items-center justify-center min-w-[60px]'">
            <span class="font-bold">N5</span>
            <span class="text-[10px] opacity-80">{{ n5Count() }}</span>
          </button>
          <button (click)="onLevelChange('N4')"
            [class]="level() === 'N4' ? 'flex-1 bg-blue-600 text-white rounded py-2 transition flex flex-col items-center justify-center min-w-[60px]' : 'flex-1 text-slate-400 py-2 transition hover:text-white flex flex-col items-center justify-center min-w-[60px]'">
            <span class="font-bold">N4</span>
            <span class="text-[10px] opacity-80">{{ n4Count() }}</span>
          </button>
          <button (click)="onLevelChange('N3')"
            [class]="level() === 'N3' ? 'flex-1 bg-indigo-600 text-white rounded py-2 transition flex flex-col items-center justify-center min-w-[60px]' : 'flex-1 text-slate-400 py-2 transition hover:text-white flex flex-col items-center justify-center min-w-[60px]'">
            <span class="font-bold">N3</span>
            <span class="text-[10px] opacity-80">{{ n3Count() }}</span>
          </button>
          <button (click)="onLevelChange('N2')"
            [class]="level() === 'N2' ? 'flex-1 bg-violet-600 text-white rounded py-2 transition flex flex-col items-center justify-center min-w-[60px]' : 'flex-1 text-slate-400 py-2 transition hover:text-white flex flex-col items-center justify-center min-w-[60px]'">
            <span class="font-bold">N2</span>
            <span class="text-[10px] opacity-80">{{ n2Count() }}</span>
          </button>
          <button (click)="onLevelChange('N1')"
            [class]="level() === 'N1' ? 'flex-1 bg-rose-600 text-white rounded py-2 transition flex flex-col items-center justify-center min-w-[60px]' : 'flex-1 text-slate-400 py-2 transition hover:text-white flex flex-col items-center justify-center min-w-[60px]'">
            <span class="font-bold">N1</span>
            <span class="text-[10px] opacity-80">{{ n1Count() }}</span>
          </button>
        </div>

        <div class="grid grid-cols-1 gap-4" [class.grid-cols-2]="viewMode() === 'grid'" [class.gap-2]="viewMode() === 'grid'">
          @for (k of filteredList(); track k.char) {
            <!-- LIST MODE -->
            @if (viewMode() === 'list') {
            <div (click)="selectedKanji.set(k)" class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-4 hover:border-blue-700 cursor-pointer transition group">
              <div class="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center text-4xl text-white font-serif shrink-0">
                {{ k.char }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center">
                  <h3 class="font-bold text-lg text-blue-200 truncate"
                      [class.text-indigo-300]="k.level === 'N3'"
                      [class.text-violet-300]="k.level === 'N2'"
                      [class.text-rose-300]="k.level === 'N1'">
                      {{ t.c(k.meaning) }}
                  </h3>
                  <button (click)="$event.stopPropagation(); tts.speakWord(k.char, k.kunyomi[0] || k.onyomi[0])" class="p-1.5 rounded-full text-slate-600 hover:text-blue-400 hover:bg-slate-800 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 2.485.519 4.952 1.848 6.595.342 1.241 1.519 1.905 2.66 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                    </svg>
                  </button>
                </div>
                <div class="text-sm text-slate-400 mt-1 truncate">
                  <span class="text-xs px-2 py-0.5 bg-slate-800 rounded text-blue-300 mr-2"
                        [class.text-indigo-300]="k.level === 'N3'"
                        [class.text-violet-300]="k.level === 'N2'"
                        [class.text-rose-300]="k.level === 'N1'">
                    ON
                  </span>
                  {{ k.onyomi.join(', ') }}
                </div>
                <div class="text-sm text-slate-400 mt-1 truncate">
                  <span class="text-xs px-2 py-0.5 bg-slate-800 rounded text-rose-300 mr-2">KUN</span>{{ k.kunyomi.join(', ') }}
                </div>
                @if (isCustom(k)) {
                  <div class="mt-2 flex gap-2">
                    <span class="text-[10px] px-2 py-0.5 rounded border bg-blue-950/50 text-blue-400 border-blue-800">✎ Custom</span>
                    <button (click)="$event.stopPropagation(); deleteCustomKanji(getCustomId(k))" class="text-[10px] text-rose-400 hover:text-rose-300 px-2 py-0.5 rounded border border-rose-900 bg-rose-950/50 transition">Hapus</button>
                  </div>
                }
              </div>
            </div>
            }

            <!-- GRID MODE -->
            @if (viewMode() === 'grid') {
            <div (click)="selectedKanji.set(k)" class="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center hover:border-blue-700 cursor-pointer transition text-center gap-1">
              <div class="text-5xl text-white font-serif">{{ k.char }}</div>
              <div class="text-xs font-bold truncate w-full"
                   [class.text-blue-300]="k.level === 'N5' || k.level === 'N4'"
                   [class.text-indigo-300]="k.level === 'N3'"
                   [class.text-violet-300]="k.level === 'N2'"
                   [class.text-rose-300]="k.level === 'N1'">
                {{ t.c(k.meaning) }}
              </div>
              <div class="text-[10px] text-slate-500 truncate w-full">{{ k.onyomi[0] || k.kunyomi[0] }}</div>
            </div>
            }
          } @empty {
            <div class="text-center py-10 text-slate-500">{{ t.get('content.no_kanji') }}</div>
          }
        </div>
      </div>

      <!-- Modal Detail -->
      @if (selectedKanji()) {
        <div class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" (click)="selectedKanji.set(null)">
          <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl" (click)="$event.stopPropagation()">

            <!-- Modal Header -->
            <div class="p-6 border-b border-slate-800 flex justify-between items-start shrink-0">
               <div>
                 <div class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                   <span [class.text-blue-400]="selectedKanji()?.level === 'N5' || selectedKanji()?.level === 'N4'"
                         [class.text-indigo-400]="selectedKanji()?.level === 'N3'"
                         [class.text-violet-400]="selectedKanji()?.level === 'N2'"
                         [class.text-rose-400]="selectedKanji()?.level === 'N1'">
                     {{ selectedKanji()?.level }} {{ t.get('home.menu.kanji').toUpperCase() }}
                   </span>
                 </div>
                 <h2 class="text-2xl font-bold text-white">{{ t.c(selectedKanji()?.meaning || '') }}</h2>
               </div>
               <button (click)="selectedKanji.set(null)" class="text-slate-400 hover:text-white p-2">✕</button>
            </div>

            <!-- Scrollable Content -->
            <div class="p-6 overflow-y-auto no-scrollbar">

              <!-- Character Display -->
              <div class="flex flex-col items-center mb-8 relative">
                 <div class="text-9xl font-serif text-white mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] cursor-pointer hover:scale-105 transition active:scale-95"
                      [class.drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]]="selectedKanji()?.level === 'N3'"
                      [class.drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]]="selectedKanji()?.level === 'N2'"
                      [class.drop-shadow-[0_0_15px_rgba(225,29,72,0.5)]]="selectedKanji()?.level === 'N1'"
                      (click)="tts.speakWord(selectedKanji()!.char, selectedKanji()!.kunyomi[0] || selectedKanji()!.onyomi[0])">
                   {{ selectedKanji()?.char }}
                 </div>
                 <div class="text-sm px-3 py-1 bg-slate-800 rounded-full text-slate-400 border border-slate-700">{{ selectedKanji()?.strokes }} {{ t.get('content.strokes') }}</div>
                 <div class="absolute top-0 right-0 p-2 text-slate-500">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 animate-pulse">
                     <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                   </svg>
                 </div>
              </div>

              <!-- Story Section -->
              @if (selectedKanji()?.story) {
                <div class="mb-6 bg-slate-800/50 rounded-xl p-4 border border-blue-900/30"
                     [class.border-indigo-900]="selectedKanji()?.level === 'N3'"
                     [class.border-violet-900]="selectedKanji()?.level === 'N2'"
                     [class.border-rose-900]="selectedKanji()?.level === 'N1'">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <span class="text-xl">💡</span>
                      <h3 class="font-bold text-blue-300 text-sm uppercase tracking-wider"
                          [class.text-indigo-300]="selectedKanji()?.level === 'N3'"
                          [class.text-violet-300]="selectedKanji()?.level === 'N2'"
                          [class.text-rose-300]="selectedKanji()?.level === 'N1'">
                          {{ t.get('content.story') }}
                      </h3>
                    </div>
                    <button (click)="tts.speak(selectedKanji()!.story!, 'id-ID')" class="p-1 rounded hover:bg-slate-700 text-blue-400"
                            [class.text-indigo-400]="selectedKanji()?.level === 'N3'"
                            [class.text-violet-400]="selectedKanji()?.level === 'N2'"
                            [class.text-rose-400]="selectedKanji()?.level === 'N1'">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 2.485.519 4.952 1.848 6.595.342 1.241 1.519 1.905 2.66 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                      </svg>
                    </button>
                  </div>
                  <p class="text-slate-300 text-sm leading-relaxed">{{ selectedKanji()?.story }}</p>
                </div>
              }

              <!-- Readings -->
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-slate-800 p-3 rounded-lg border border-slate-700">
                  <span class="text-xs text-blue-400 font-bold block mb-1"
                        [class.text-indigo-400]="selectedKanji()?.level === 'N3'"
                        [class.text-violet-400]="selectedKanji()?.level === 'N2'"
                        [class.text-rose-400]="selectedKanji()?.level === 'N1'">
                    {{ t.get('content.on_reading') }}
                  </span>
                  <span class="text-white text-lg">{{ selectedKanji()?.onyomi?.join(', ') || '-' }}</span>
                </div>
                <div class="bg-slate-800 p-3 rounded-lg border border-slate-700">
                  <span class="text-xs text-rose-400 font-bold block mb-1">{{ t.get('content.kun_reading') }}</span>
                  <span class="text-white text-lg">{{ selectedKanji()?.kunyomi?.join(', ') || '-' }}</span>
                </div>
              </div>

              <!-- Vocab Examples -->
              @if (selectedKanji()?.examples?.length) {
                <div class="mb-6">
                  <h3 class="font-bold text-white text-sm uppercase tracking-wider mb-3">{{ t.get('content.vocab_examples') }}</h3>
                  <div class="space-y-2">
                    @for (ex of selectedKanji()?.examples; track ex.word) {
                      <div class="bg-slate-800/50 p-3 rounded-lg border border-slate-800 hover:border-slate-700 transition">
                        <div class="flex justify-between items-center cursor-pointer" (click)="tts.speakWord(ex.word, ex.reading)">
                          <div>
                            <div class="text-lg text-blue-200 font-medium"
                                 [class.text-indigo-200]="selectedKanji()?.level === 'N3'"
                                 [class.text-violet-200]="selectedKanji()?.level === 'N2'"
                                 [class.text-rose-200]="selectedKanji()?.level === 'N1'">
                              {{ ex.word }}
                            </div>
                            <div class="text-xs text-slate-500">{{ ex.reading }}</div>
                          </div>
                          <div class="text-sm text-slate-300 font-medium text-right">{{ t.c(ex.meaning) }}</div>
                        </div>
                        @if (ex.sentence) {
                          <div class="mt-2 pt-2 border-t border-slate-700">
                            <div class="flex items-start gap-2">
                              <button (click)="tts.speakSentence(ex.sentence, ex.sentence_romaji)" class="mt-0.5 p-1 bg-slate-700 rounded-full text-cyan-500 hover:bg-cyan-900 transition flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
                                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 2.485.519 4.952 1.848 6.595.342 1.241 1.519 1.905 2.66 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06Z" />
                                </svg>
                              </button>
                              <div>
                                <div class="text-sm text-white">{{ ex.sentence }}</div>
                                <div class="text-xs text-slate-500 italic mt-0.5">{{ ex.sentence_romaji }}</div>
                                <div class="text-xs text-cyan-300 mt-0.5">{{ t.c(ex.sentence_meaning || '') }}</div>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Footer Action -->
            <div class="p-6 border-t border-slate-800 shrink-0 bg-slate-900 rounded-b-2xl">
              <button class="w-full py-3 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-900/20"
                      [class.bg-indigo-600]="selectedKanji()?.level === 'N3'"
                      [class.bg-violet-600]="selectedKanji()?.level === 'N2'"
                      [class.bg-rose-600]="selectedKanji()?.level === 'N1'"
                      routerLink="/writing">
                {{ t.get('content.practice_write') }} {{ selectedKanji()?.char }}
              </button>
            </div>

          </div>
        </div>
      }
    </div>
  `
})
export class KanjiComponent implements OnInit {
  dataService = inject(JapaneseDataService);
  customData = inject(CustomDataService);
  tts = inject(TtsService);
  t = inject(TranslationService);
  kanaToRomaji = inject(KanaToRomajiPipe);
  level = signal<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
  selectedKanji = signal<Kanji | null>(null);
  searchQuery = signal('');
  viewMode = signal<'list' | 'grid'>('list');
  isLoading = signal(true);

  // Counts diupdate setelah load selesai
  n5Count = signal(0);
  n4Count = signal(0);
  n3Count = signal(0);
  n2Count = signal(0);
  n1Count = signal(0);

  filteredList = computed(() => {
    const builtin = this.dataService.getKanji(this.level());
    const custom = this.customData.getCustomKanji(this.level() as any);
    const rawList = [...custom, ...builtin];
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return rawList;
    return rawList.filter(k =>
      k.char.includes(query) ||
      k.meaning.toLowerCase().includes(query) ||
      k.onyomi.some(r => r.toLowerCase().includes(query)) ||
      k.kunyomi.some(r => r.toLowerCase().includes(query)) ||
      k.onyomi.some(r => this.kanaToRomaji.transform(r).toLowerCase().includes(query)) ||
      k.kunyomi.some(r => this.kanaToRomaji.transform(r).toLowerCase().includes(query)) ||
      k.examples?.some(ex => ex.word.toLowerCase().includes(query) || ex.meaning.toLowerCase().includes(query))
    );
  });

  async ngOnInit() {
    this.isLoading.set(true);
    // Hanya muat level yang aktif dulu, lainnya preload di background
    await this.dataService.loadKanji(this.level());
    this.isLoading.set(false);
    // Hitung counts untuk semua level di background
    this._loadCounts();
  }

  async onLevelChange(lv: 'N5' | 'N4' | 'N3' | 'N2' | 'N1') {
    if (!this.dataService.isKanjiLoaded(lv)) {
      this.isLoading.set(true);
      await this.dataService.loadKanji(lv);
      this.isLoading.set(false);
    }
    this.level.set(lv);
  }

  private async _loadCounts() {
    for (const lv of ['N5','N4','N3','N2','N1'] as const) {
      await this.dataService.loadKanji(lv);
      const count = this.dataService.getKanji(lv).length;
      if (lv==='N5') this.n5Count.set(count);
      else if (lv==='N4') this.n4Count.set(count);
      else if (lv==='N3') this.n3Count.set(count);
      else if (lv==='N2') this.n2Count.set(count);
      else if (lv==='N1') this.n1Count.set(count);
    }
  }

  deleteCustomKanji(id: string): void {
    this.customData.deleteKanji(id);
  }

  isCustom(item: any): boolean { return !!item._custom; }
  getCustomId(item: any): string { return item._id || ''; }
}
