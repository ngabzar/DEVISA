import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JapaneseDataService } from '../services/data.service';
import { CustomDataService } from '../services/custom-data.service';
import { TranslationService } from '../services/translation.service';
import { Grammar } from '../types';
import { TtsService } from '../services/tts.service';

@Component({
  selector: 'app-bunpou',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 pb-20">
      <div class="sticky top-0 bg-slate-950 z-20 p-4 border-b border-slate-800 flex items-center gap-4">
        <a routerLink="/" class="text-slate-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </a>
        <h1 class="text-xl font-bold text-emerald-400 flex-1">{{ t.get('home.menu.grammar') }} (N5 - N1)</h1>
          <!-- Add Custom Button -->
          <a routerLink="/tambah/bunpou" class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/50 hover:bg-emerald-800/60 border border-emerald-700 text-emerald-300 text-xs font-semibold rounded-lg transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/>
            </svg>
            Tambah
          </a>
      </div>

      <div class="p-4 space-y-4">
        <!-- SEARCH BAR -->
        <div>
          <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" [placeholder]="t.get('content.search_grammar')"
            class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition placeholder-slate-600" />
        </div>

        <!-- Level Selector -->
        <div class="flex bg-slate-900 rounded-lg p-1 mb-2 gap-1 overflow-x-auto">
          <button (click)="onLevelChange('N5')" [class]="level() === 'N5' ? 'flex-1 bg-emerald-600 text-white rounded py-2 transition font-bold' : 'flex-1 text-slate-400 py-2 transition hover:text-white'">N5</button>
          <button (click)="onLevelChange('N4')" [class]="level() === 'N4' ? 'flex-1 bg-emerald-600 text-white rounded py-2 transition font-bold' : 'flex-1 text-slate-400 py-2 transition hover:text-white'">N4</button>
          <button (click)="onLevelChange('N3')" [class]="level() === 'N3' ? 'flex-1 bg-indigo-600 text-white rounded py-2 transition font-bold' : 'flex-1 text-slate-400 py-2 transition hover:text-white'">N3</button>
          <button (click)="onLevelChange('N2')" [class]="level() === 'N2' ? 'flex-1 bg-violet-600 text-white rounded py-2 transition font-bold' : 'flex-1 text-slate-400 py-2 transition hover:text-white'">N2</button>
          <button (click)="onLevelChange('N1')" [class]="level() === 'N1' ? 'flex-1 bg-rose-600 text-white rounded py-2 transition font-bold' : 'flex-1 text-slate-400 py-2 transition hover:text-white'">N1</button>
        </div>

        <!-- Grammar List -->
        @for (g of filteredList(); track g.title) {
          <div (click)="selectGrammar(g)" class="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-500 cursor-pointer transition group active:scale-[0.98]">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-bold text-emerald-300 group-hover:text-emerald-200"
                  [class.text-indigo-300]="g.level === 'N3'"
                  [class.text-violet-300]="g.level === 'N2'"
                  [class.text-rose-300]="g.level === 'N1'">
                  {{ g.title }}
              </h3>
              <span class="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">{{ t.get('content.detail') }} &gt;</span>
            </div>
            <div class="bg-slate-950 p-2 rounded border border-slate-800 mb-3 text-sm text-yellow-200 font-mono">
              {{ g.formula }}
            </div>
            <p class="text-slate-300 text-sm line-clamp-2">{{ t.c(g.explanation) }}</p>
            @if (isCustom(g)) {
              <div class="mt-2 flex gap-2">
                <span class="text-[10px] px-2 py-0.5 rounded border bg-emerald-950/50 text-emerald-400 border-emerald-800">✎ Custom</span>
                <button (click)="$event.stopPropagation(); deleteCustomGrammar(getCustomId(g))" class="text-[10px] text-rose-400 hover:text-rose-300 px-2 py-0.5 rounded border border-rose-900 bg-rose-950/50 transition">Hapus</button>
              </div>
            }
          </div>
        } @empty {
          <div class="text-center py-10 text-slate-500">{{ t.get('content.no_grammar') }}</div>
        }
      </div>

      <!-- Modal Detail -->
      @if (selectedGrammar()) {
        <div class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" (click)="selectedGrammar.set(null)">
          <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl" (click)="$event.stopPropagation()">

            <!-- Modal Header -->
            <div class="p-5 border-b border-slate-800 flex justify-between items-start shrink-0 bg-slate-900 rounded-t-2xl">
               <div>
                 <div class="text-xs font-bold uppercase tracking-widest mb-1"
                      [class.text-emerald-600]="level() === 'N5' || level() === 'N4'"
                      [class.text-indigo-500]="level() === 'N3'"
                      [class.text-violet-500]="level() === 'N2'"
                      [class.text-rose-500]="level() === 'N1'">
                      {{ t.get('home.menu.grammar').toUpperCase() }} {{ level() }}
                 </div>
                 <h2 class="text-xl font-bold text-white">{{ selectedGrammar()?.title }}</h2>
               </div>
               <button (click)="selectedGrammar.set(null)" class="text-slate-400 hover:text-white p-2">✕</button>
            </div>

            <!-- Scrollable Content -->
            <div class="p-5 overflow-y-auto no-scrollbar">

              <!-- Formula -->
              <div class="mb-6">
                <h3 class="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">{{ t.get('content.formula') }}</h3>
                <div class="bg-slate-950 p-3 rounded-lg border border-slate-700 text-yellow-200 font-mono text-sm">
                  {{ selectedGrammar()?.formula }}
                </div>
              </div>

              <!-- Explanation -->
              <div class="mb-8">
                <h3 class="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">{{ t.get('content.explanation') }}</h3>
                <p class="text-slate-200 leading-relaxed text-sm">
                  {{ t.c(selectedGrammar()?.explanation || '') }}
                </p>
              </div>

              <!-- Examples Section -->
              <div>
                <h3 class="text-sm font-bold mb-4 uppercase tracking-wider flex items-center gap-2"
                    [class.text-emerald-400]="level() === 'N5' || level() === 'N4'"
                    [class.text-indigo-400]="level() === 'N3'"
                    [class.text-violet-400]="level() === 'N2'"
                    [class.text-rose-400]="level() === 'N1'">
                  <span>📖</span> {{ t.get('content.example') }}
                </h3>

                <div class="space-y-4">
                  @if (selectedGrammar()?.examples && selectedGrammar()!.examples!.length > 0) {
                    @for (ex of selectedGrammar()?.examples; track ex.japanese) {
                      <div class="bg-slate-800/50 rounded-xl p-4 border border-slate-800">
                        <div class="flex justify-between items-start mb-1 border-l-4 pl-3"
                             [class.border-emerald-500]="level() === 'N5' || level() === 'N4'"
                             [class.border-indigo-500]="level() === 'N3'"
                             [class.border-violet-500]="level() === 'N2'"
                             [class.border-rose-500]="level() === 'N1'">
                          <div class="text-lg text-white font-medium">{{ ex.japanese }}</div>
                          <button (click)="tts.speakSentence(ex.japanese, ex.romaji)" class="p-1 rounded hover:bg-slate-700 transition"
                                  [class.text-emerald-400]="level() === 'N5' || level() === 'N4'"
                                  [class.text-indigo-400]="level() === 'N3'"
                                  [class.text-violet-400]="level() === 'N2'"
                                  [class.text-rose-400]="level() === 'N1'">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 2.485.519 4.952 1.848 6.595.342 1.241 1.519 1.905 2.66 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                            </svg>
                          </button>
                        </div>
                        <div class="text-xs text-slate-400 font-mono mb-2 pl-4 italic">{{ ex.romaji }}</div>
                        <div class="text-sm pl-4"
                             [class.text-emerald-200]="level() === 'N5' || level() === 'N4'"
                             [class.text-indigo-200]="level() === 'N3'"
                             [class.text-violet-200]="level() === 'N2'"
                             [class.text-rose-200]="level() === 'N1'">
                          {{ t.c(ex.meaning) }}
                        </div>
                      </div>
                    }
                  } @else {
                    <div class="bg-slate-800/50 rounded-xl p-4 border border-slate-800">
                      <div class="flex justify-between items-start mb-2 border-l-4 border-emerald-500 pl-3">
                         <div class="text-lg text-white font-medium">{{ selectedGrammar()?.example }}</div>
                         <button (click)="tts.speakSentence(selectedGrammar()!.example!)" class="p-1 rounded text-emerald-400 hover:bg-slate-700 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 2.485.519 4.952 1.848 6.595.342 1.241 1.519 1.905 2.66 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" /></svg>
                         </button>
                      </div>
                    </div>
                  }
                </div>
              </div>

            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class BunpouComponent implements OnInit {
  dataService = inject(JapaneseDataService);
  customData = inject(CustomDataService);
  tts = inject(TtsService);
  t = inject(TranslationService);
  level = signal<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
  isLoading = signal(true);
  selectedGrammar = signal<Grammar | null>(null);
  searchQuery = signal('');

  filteredList = computed(() => {
    const builtin = this.dataService.getGrammar(this.level());
    const custom = this.customData.getCustomGrammar(this.level());
    const rawList = [...custom, ...builtin];
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return rawList;
    return rawList.filter(g =>
      g.title.toLowerCase().includes(query) ||
      g.explanation.toLowerCase().includes(query) ||
      g.formula.toLowerCase().includes(query)
    );
  });

  selectGrammar(g: Grammar) {
    this.selectedGrammar.set(g);
  }

  async ngOnInit() {
    this.isLoading.set(true);
    await this.dataService.loadGrammar(this.level());
    this.isLoading.set(false);
  }

  async onLevelChange(lv: 'N5' | 'N4' | 'N3' | 'N2' | 'N1') {
    this.isLoading.set(true);
    await this.dataService.loadGrammar(lv);
    this.isLoading.set(false);
    this.level.set(lv);
  }

  deleteCustomGrammar(id: string): void {
    this.customData.deleteGrammar(id);
  }

  isCustom(item: any): boolean { return !!item._custom; }
  getCustomId(item: any): string { return item._id || ''; }
}