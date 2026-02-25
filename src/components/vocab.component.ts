import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JapaneseDataService } from '../services/data.service';
import { CustomDataService } from '../services/custom-data.service';
import { TranslationService } from '../services/translation.service';
import { Vocab } from '../types';
import { KanaToRomajiPipe } from '../pipes/kana-to-romaji.pipe';
import { TtsService } from '../services/tts.service';

@Component({
  selector: 'app-vocab',
  imports: [CommonModule, RouterLink, FormsModule, KanaToRomajiPipe],
  providers: [KanaToRomajiPipe],
  template: `
    <div class="min-h-screen bg-slate-950 pb-20">
      <div class="sticky top-0 bg-slate-950 z-20 p-4 border-b border-slate-800">
        <div class="flex items-center gap-4 mb-3">
          <a routerLink="/" class="text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </a>
          <h1 class="text-xl font-bold text-cyan-400 flex-1">{{ t.get('home.menu.vocab') }}</h1>

          <!-- Add Custom Button -->
          <a routerLink="/tambah/vocab" class="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-900/50 hover:bg-cyan-800/60 border border-cyan-700 text-cyan-300 text-xs font-semibold rounded-lg transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/>
            </svg>
            Tambah
          </a>

          <!-- Grid / List Toggle -->
          <div class="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
            <button (click)="viewMode.set('list')"
                    class="p-1.5 rounded transition"
                    [class.bg-cyan-700]="viewMode() === 'list'"
                    [class.text-white]="viewMode() === 'list'"
                    [class.text-slate-500]="viewMode() !== 'list'"
                    title="Tampilan List">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 15.25Z" clip-rule="evenodd"/>
              </svg>
            </button>
            <button (click)="viewMode.set('grid')"
                    class="p-1.5 rounded transition"
                    [class.bg-cyan-700]="viewMode() === 'grid'"
                    [class.text-white]="viewMode() === 'grid'"
                    [class.text-slate-500]="viewMode() !== 'grid'"
                    title="Tampilan Grid">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- SEARCH BAR -->
        <div class="mb-3">
          <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" [placeholder]="t.get('content.search_vocab')"
            class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition placeholder-slate-600" />
        </div>

        <!-- Level Selector -->
        <div class="flex bg-slate-900 rounded-lg p-1 gap-1 overflow-x-auto mb-3">
          <button (click)="onLevelChange('N5')"
            [class]="level() === 'N5' ? 'flex-1 bg-cyan-700 text-white rounded py-2 transition font-bold' : 'flex-1 text-slate-400 py-2 transition hover:text-white'">N5</button>
          <button (click)="onLevelChange('N4')"
            [class]="level() === 'N4' ? 'flex-1 bg-cyan-700 text-white rounded py-2 transition font-bold' : 'flex-1 text-slate-400 py-2 transition hover:text-white'">N4</button>
          <button (click)="onLevelChange('N3')"
            [class]="level() === 'N3' ? 'flex-1 bg-indigo-600 text-white rounded py-2 transition font-bold' : 'flex-1 text-slate-400 py-2 transition hover:text-white'">N3</button>
          <button (click)="onLevelChange('N2')"
            [class]="level() === 'N2' ? 'flex-1 bg-violet-600 text-white rounded py-2 transition font-bold' : 'flex-1 text-slate-400 py-2 transition hover:text-white'">N2</button>
          <button (click)="onLevelChange('N1')"
            [class]="level() === 'N1' ? 'flex-1 bg-rose-600 text-white rounded py-2 transition font-bold' : 'flex-1 text-slate-400 py-2 transition hover:text-white'">N1</button>
        </div>

        <!-- Category Sub-Menu -->
        <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button (click)="category.set('ALL')"
            [class]="category() === 'ALL' ? 'px-4 py-1.5 rounded-full text-sm font-medium bg-cyan-900 text-cyan-200 border border-cyan-700 whitespace-nowrap' : 'px-4 py-1.5 rounded-full text-sm font-medium bg-slate-900 text-slate-400 border border-slate-800 whitespace-nowrap hover:border-slate-600'">{{ t.get('content.all') }}</button>
          <button (click)="category.set('NOUN')"
            [class]="category() === 'NOUN' ? 'px-4 py-1.5 rounded-full text-sm font-medium bg-cyan-900 text-cyan-200 border border-cyan-700 whitespace-nowrap' : 'px-4 py-1.5 rounded-full text-sm font-medium bg-slate-900 text-slate-400 border border-slate-800 whitespace-nowrap hover:border-slate-600'">{{ t.get('content.noun') }}</button>
          <button (click)="category.set('VERB')"
            [class]="category() === 'VERB' ? 'px-4 py-1.5 rounded-full text-sm font-medium bg-cyan-900 text-cyan-200 border border-cyan-700 whitespace-nowrap' : 'px-4 py-1.5 rounded-full text-sm font-medium bg-slate-900 text-slate-400 border border-slate-800 whitespace-nowrap hover:border-slate-600'">{{ t.get('content.verb') }}</button>
          <button (click)="category.set('ADJ')"
            [class]="category() === 'ADJ' ? 'px-4 py-1.5 rounded-full text-sm font-medium bg-cyan-900 text-cyan-200 border border-cyan-700 whitespace-nowrap' : 'px-4 py-1.5 rounded-full text-sm font-medium bg-slate-900 text-slate-400 border border-slate-800 whitespace-nowrap hover:border-slate-600'">{{ t.get('content.adj') }}</button>
          <button (click)="category.set('OTHER')"
            [class]="category() === 'OTHER' ? 'px-4 py-1.5 rounded-full text-sm font-medium bg-cyan-900 text-cyan-200 border border-cyan-700 whitespace-nowrap' : 'px-4 py-1.5 rounded-full text-sm font-medium bg-slate-900 text-slate-400 border border-slate-800 whitespace-nowrap hover:border-slate-600'">Lain-lain</button>
        </div>
      </div>

      <div class="p-4">
        <!-- LIST VIEW -->
        @if (viewMode() === 'list') {
          <div class="space-y-2">
            @for (v of filteredList(); track v.word) {
              <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-800 transition">
                <div class="p-4">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-1">
                        <div class="text-xl text-white font-bold">{{ v.word }}</div>
                        <button (click)="tts.speakWord(v.word, v.kana)" class="p-1.5 bg-slate-800 rounded-full text-cyan-400 hover:bg-cyan-900 transition">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 2.485.519 4.952 1.848 6.595.342 1.241 1.519 1.905 2.66 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                          </svg>
                        </button>
                      </div>
                      <div class="text-sm text-cyan-400 mt-0.5">
                        {{ v.kana }}
                        <span class="text-slate-600 mx-1">-</span>
                        <span class="text-slate-400 italic">{{ v.kana | kanaToRomaji }}</span>
                      </div>
                    </div>
                    <div class="text-right flex flex-col items-end gap-1.5">
                      <div class="text-slate-300 font-medium">{{ t.c(v.meaning) }}</div>
                      <span [class]="getBadgeClass(v)">{{ getBadgeLabel(v) }}</span>
                      @if (isCustom(v)) {
                        <span class="text-[10px] px-2 py-0.5 rounded border bg-cyan-950/50 text-cyan-400 border-cyan-800">✎ Custom</span>
                        <button (click)="deleteCustomVocab(getCustomId(v))" class="text-[10px] text-rose-400 hover:text-rose-300 px-2 py-0.5 rounded border border-rose-900 bg-rose-950/50 transition">Hapus</button>
                      }
                      @if (v.examples && v.examples.length > 0) {
                        <button (click)="toggleDetail(v.word)"
                                class="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition"
                                [class.bg-amber-900\/40]="isExpanded(v.word)"
                                [class.border-amber-700]="isExpanded(v.word)"
                                [class.text-amber-300]="isExpanded(v.word)"
                                [class.bg-slate-800]="!isExpanded(v.word)"
                                [class.border-slate-700]="!isExpanded(v.word)"
                                [class.text-slate-400]="!isExpanded(v.word)">
                          {{ isExpanded(v.word) ? t.get('content.hide') : t.get('content.detail') }}
                        </button>
                      }
                    </div>
                  </div>
                </div>

                @if (isExpanded(v.word) && v.examples && v.examples.length > 0) {
                  <div class="border-t border-slate-800 bg-slate-950 p-4 space-y-2">
                    <div class="text-xs text-amber-500 uppercase tracking-wide font-semibold mb-2">Contoh Kalimat</div>
                    @for (ex of v.examples; track ex.japanese) {
                      <div class="bg-slate-800 rounded-lg p-2.5 text-sm">
                        <div class="flex items-start gap-2">
                          <button (click)="tts.speakSentence(ex.japanese, ex.romaji)" class="mt-0.5 p-1 bg-slate-700 rounded-full text-cyan-500 hover:bg-cyan-900 transition flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
                              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 2.485.519 4.952 1.848 6.595.342 1.241 1.519 1.905 2.66 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                            </svg>
                          </button>
                          <div class="flex-1">
                            <div class="text-white font-medium leading-snug">{{ ex.japanese }}</div>
                            <div class="text-slate-500 text-xs mt-0.5 italic">{{ ex.romaji }}</div>
                            <div class="text-cyan-300 text-xs mt-0.5">{{ t.c(ex.meaning) }}</div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            } @empty {
              <div class="text-center py-10 text-slate-500">{{ t.get('content.no_vocab') }}</div>
            }
          </div>
        }

        <!-- GRID VIEW -->
        @if (viewMode() === 'grid') {
          <div class="grid grid-cols-2 gap-2">
            @for (v of filteredList(); track v.word) {
              <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-800 transition flex flex-col">
                <div class="p-3 flex-1">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <div class="text-2xl text-white font-bold">{{ v.word }}</div>
                    <button (click)="tts.speakWord(v.word, v.kana)" class="p-1 bg-slate-800 rounded-full text-cyan-400 hover:bg-cyan-900 transition flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5">
                        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 2.485.519 4.952 1.848 6.595.342 1.241 1.519 1.905 2.66 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                      </svg>
                    </button>
                  </div>
                  <div class="text-xs text-cyan-400">{{ v.kana }}</div>
                  <div class="text-sm text-slate-300 font-medium mt-1">{{ t.c(v.meaning) }}</div>
                  <span [class]="getBadgeClass(v)">{{ getBadgeLabel(v) }}</span>
                </div>
                @if (v.examples && v.examples.length > 0) {
                  <button (click)="toggleDetail(v.word)"
                          class="w-full text-xs font-semibold py-2 border-t transition text-center"
                          [class.bg-amber-900]="isExpanded(v.word)"
                          [class.text-amber-200]="isExpanded(v.word)"
                          [class.border-amber-800]="isExpanded(v.word)"
                          [class.bg-slate-800]="!isExpanded(v.word)"
                          [class.text-slate-400]="!isExpanded(v.word)"
                          [class.border-slate-700]="!isExpanded(v.word)">
                    {{ isExpanded(v.word) ? t.get('content.hide') : t.get('content.detail') }}
                  </button>
                }
                @if (isExpanded(v.word) && v.examples && v.examples.length > 0) {
                  <div class="border-t border-slate-700 bg-slate-950 p-3 space-y-2">
                    @for (ex of v.examples; track ex.japanese) {
                      <div class="text-xs">
                        <div class="flex items-start gap-1.5">
                          <button (click)="tts.speakSentence(ex.japanese, ex.romaji)" class="p-0.5 bg-slate-700 rounded-full text-cyan-500 flex-shrink-0 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-2.5 h-2.5">
                              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 2.485.519 4.952 1.848 6.595.342 1.241 1.519 1.905 2.66 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06Z" />
                            </svg>
                          </button>
                          <div>
                            <div class="text-white font-medium leading-snug">{{ ex.japanese }}</div>
                            <div class="text-cyan-300 mt-0.5">{{ t.c(ex.meaning) }}</div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            } @empty {
              <div class="col-span-2 text-center py-10 text-slate-500">{{ t.get('content.no_vocab') }}</div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class VocabComponent implements OnInit {
  dataService = inject(JapaneseDataService);
  customData = inject(CustomDataService);
  tts = inject(TtsService);
  t = inject(TranslationService);
  kanaToRomaji = inject(KanaToRomajiPipe);
  level = signal<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
  category = signal<'ALL' | 'NOUN' | 'VERB' | 'ADJ' | 'OTHER'>('ALL');
  searchQuery = signal('');
  viewMode = signal<'list' | 'grid'>('list');
  isLoading = signal(true);

  private expandedSet = signal<Set<string>>(new Set());

  toggleDetail(word: string): void {
    this.expandedSet.update(s => {
      const n = new Set(s);
      if (n.has(word)) n.delete(word); else n.add(word);
      return n;
    });
  }

  isExpanded(word: string): boolean {
    return this.expandedSet().has(word);
  }

  /** Normalize new extended categories to the 4 UI categories */
  private normalizeCategory(cat?: string): 'NOUN' | 'VERB' | 'ADJ' | 'OTHER' {
    if (!cat) return 'NOUN';
    if (cat === 'VERB' || cat === 'AUX') return 'VERB';
    if (cat === 'NOUN' || cat === 'COUNTER' || cat === 'PN' || cat === 'NUM') return 'NOUN';
    if (cat.startsWith('ADJ')) return 'ADJ'; // ADJ, ADJ-I, ADJ-NA
    return 'OTHER'; // ADV, CONJ, PART, PREFIX, SUFFIX, EXPR, INTERJ, etc.
  }

  filteredList = computed(() => {
    const builtin = this.dataService.getVocab(this.level());
    const custom = this.customData.getCustomVocab(this.level());
    const all = [...custom, ...builtin];
    const cat = this.category();
    const query = this.searchQuery().toLowerCase().trim();
    let list = cat === 'ALL' ? all : all.filter(v => this.normalizeCategory(v.category) === cat);
    if (query) {
      list = list.filter(v =>
        v.word.toLowerCase().includes(query) ||
        v.kana.includes(query) ||
        v.meaning.toLowerCase().includes(query) ||
        this.kanaToRomaji.transform(v.kana).toLowerCase().includes(query) ||
        v.examples?.some(ex => (ex.japanese || '').toLowerCase().includes(query) || (ex.meaning || '').toLowerCase().includes(query))
      );
    }
    return list;
  });

  getBadgeLabel(v: Vocab): string {
    switch (this.normalizeCategory(v.category)) {
      case 'NOUN': return this.t.get('content.noun');
      case 'VERB': return this.t.get('content.verb');
      case 'ADJ': return this.t.get('content.adj');
      case 'OTHER': return 'Lain-lain';
      default: return this.t.get('content.noun');
    }
  }

  getBadgeClass(v: Vocab): string {
    const base = "text-[10px] px-2 py-0.5 rounded mt-1.5 inline-block font-medium border ";
    switch (this.normalizeCategory(v.category)) {
      case 'NOUN': return base + "bg-slate-800 text-slate-400 border-slate-700";
      case 'VERB': return base + "bg-blue-950/50 text-blue-400 border-blue-900";
      case 'ADJ': return base + "bg-amber-950/50 text-amber-400 border-amber-900";
      case 'OTHER': return base + "bg-rose-950/50 text-rose-400 border-rose-900";
      default: return base + "bg-slate-800 text-slate-400 border-slate-700";
    }
  }

  async ngOnInit() {
    this.isLoading.set(true);
    await this.dataService.loadVocab(this.level());
    this.isLoading.set(false);
  }

  deleteCustomVocab(id: string): void {
    this.customData.deleteVocab(id);
  }

  isCustom(item: any): boolean { return !!item._custom; }
  getCustomId(item: any): string { return item._id || ''; }

  async onLevelChange(lv: 'N5' | 'N4' | 'N3' | 'N2' | 'N1') {
    if (!this.dataService.isVocabLoaded(lv)) {
      this.isLoading.set(true);
      await this.dataService.loadVocab(lv);
      this.isLoading.set(false);
    }
    this.level.set(lv);
  }
}
