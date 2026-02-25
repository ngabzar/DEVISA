import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JapaneseDataService } from '../services/data.service';
import { Kana } from '../types';
import { TtsService } from '../services/tts.service';

type KanaTab = 'HIRAGANA' | 'KATAKANA';
type GroupTab = 'GOJUUON' | 'DAKUON' | 'HANDAKUON' | 'YOON';

@Component({
  selector: 'app-kana',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 pb-20">
      <div class="sticky top-0 bg-slate-950 z-20 p-4 border-b border-slate-800 flex items-center gap-4">
        <a routerLink="/" class="text-slate-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </a>
        <h1 class="text-xl font-bold text-rose-400">Belajar Kana</h1>
      </div>

      <!-- Main Tabs -->
      <div class="flex p-4 gap-2">
        <button (click)="activeTab.set('HIRAGANA')" 
          [class]="activeTab() === 'HIRAGANA' ? 'flex-1 py-2 bg-rose-600 rounded-lg text-white font-bold transition-all' : 'flex-1 py-2 bg-slate-800 rounded-lg text-slate-400 hover:bg-slate-700 transition-all'">
          Hiragana (あ)
        </button>
        <button (click)="activeTab.set('KATAKANA')"
          [class]="activeTab() === 'KATAKANA' ? 'flex-1 py-2 bg-rose-600 rounded-lg text-white font-bold transition-all' : 'flex-1 py-2 bg-slate-800 rounded-lg text-slate-400 hover:bg-slate-700 transition-all'">
          Katakana (ア)
        </button>
      </div>

      <!-- SEARCH BAR -->
      <div class="px-4 mb-4">
        <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" placeholder="Cari huruf (cth: a, ka, shi)..." 
          class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-rose-500 outline-none transition placeholder-slate-600" />
      </div>

      @if (!searchQuery()) {
        <!-- Sub Tabs (Only visible when NOT searching) -->
        <div class="flex px-4 gap-2 overflow-x-auto no-scrollbar mb-6">
           @for (g of groups; track g) {
             <button (click)="activeGroup.set(g)"
              [class]="activeGroup() === g ? 'whitespace-nowrap px-4 py-1.5 bg-slate-700 text-rose-300 rounded-full text-sm border border-rose-900 shadow-sm shadow-rose-900/20' : 'whitespace-nowrap px-4 py-1.5 bg-slate-900 text-slate-500 rounded-full text-sm border border-slate-800 hover:border-slate-600'">
              {{ formatGroupName(g) }}
             </button>
           }
        </div>

        <!-- Table Container (Standard View) -->
        <div class="px-4">
          <!-- Table Header (A I U E O) -->
          <div class="grid grid-cols-5 gap-px bg-slate-800 border border-slate-800 rounded-t-xl overflow-hidden mb-px">
            <div class="py-2 text-center text-xs font-bold text-slate-400 bg-slate-900">A</div>
            <div class="py-2 text-center text-xs font-bold text-slate-400 bg-slate-900">I</div>
            <div class="py-2 text-center text-xs font-bold text-slate-400 bg-slate-900">U</div>
            <div class="py-2 text-center text-xs font-bold text-slate-400 bg-slate-900">E</div>
            <div class="py-2 text-center text-xs font-bold text-slate-400 bg-slate-900">O</div>
          </div>

          <!-- The Grid -->
          <div class="grid grid-cols-5 gap-px bg-slate-800 border border-slate-800 rounded-b-xl rounded-t-none overflow-hidden ring-1 ring-slate-800">
            @for (item of getGridItems(); track $index) {
              @if (item) {
                <div (click)="tts.speak(item.char, 'ja-JP')" class="aspect-[4/5] bg-slate-900 hover:bg-slate-800 active:bg-slate-700 transition-colors flex flex-col items-center justify-center group cursor-pointer relative">
                  <div class="text-3xl font-medium text-white group-hover:text-rose-400 transition-colors mb-1">{{ item.char }}</div>
                  <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-rose-200">{{ item.romaji }}</div>
                  <!-- Sound Icon Hint -->
                  <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-rose-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
                      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 2.485.519 4.952 1.848 6.595.342 1.241 1.519 1.905 2.66 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                    </svg>
                  </div>
                </div>
              } @else {
                <!-- Empty Slot -->
                <div class="aspect-[4/5] bg-slate-950/50"></div>
              }
            }
          </div>

          <!-- Legend/Info -->
          <div class="mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-800/50 text-sm text-slate-400 text-center">
            @if (activeTab() === 'HIRAGANA') {
              Huruf asli Jepang. Digunakan untuk kata asli Jepang dan tata bahasa.
            } @else {
              Huruf serapan. Digunakan untuk kata asing, nama negara, dan penekanan kata.
            }
          </div>
        </div>
      } @else {
        <!-- SEARCH RESULTS VIEW -->
        <div class="px-4">
          <div class="text-sm text-slate-500 mb-2">Hasil pencarian:</div>
          <div class="grid grid-cols-5 gap-2">
            @for (item of searchResults(); track item.char) {
              <div (click)="tts.speak(item.char, 'ja-JP')" class="aspect-[4/5] bg-slate-900 border border-slate-800 rounded-xl hover:border-rose-500 transition-colors flex flex-col items-center justify-center group cursor-pointer relative">
                <div class="text-3xl font-medium text-white group-hover:text-rose-400 transition-colors mb-1">{{ item.char }}</div>
                <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{{ item.romaji }}</div>
                <div class="absolute top-1 right-1 text-rose-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
                      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 2.485.519 4.952 1.848 6.595.342 1.241 1.519 1.905 2.66 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                    </svg>
                </div>
              </div>
            } @empty {
              <div class="col-span-5 text-center py-8 text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
                Tidak ditemukan huruf yang cocok.
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class KanaComponent implements OnInit {
  dataService = inject(JapaneseDataService);
  tts = inject(TtsService); // Inject TTS
  route = inject(ActivatedRoute);
  
  activeTab = signal<KanaTab>('HIRAGANA');
  activeGroup = signal<GroupTab>('GOJUUON');
  groups: GroupTab[] = ['GOJUUON', 'DAKUON', 'HANDAKUON', 'YOON'];
  
  searchQuery = signal('');
  isLoading = signal(true);

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab === 'HIRAGANA' || tab === 'KATAKANA') {
        this.activeTab.set(tab);
      }
    });
    this.isLoading.set(true);
    await this.dataService.loadKana();
    this.isLoading.set(false);
  }

  // Computed Search Results
  searchResults = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];

    // Search across ALL groups in the active tab
    const groups: GroupTab[] = ['GOJUUON', 'DAKUON', 'HANDAKUON', 'YOON'];
    let allChars: Kana[] = [];
    
    groups.forEach(g => {
      allChars = [...allChars, ...this.dataService.getKana(this.activeTab(), g)];
    });

    return allChars.filter(k => 
      k.romaji.includes(query) || k.char.includes(query)
    );
  });

  // Helper to construct standard 5-column grid with gaps
  getGridItems(): (Kana | null)[] {
    const raw = this.dataService.getKana(this.activeTab(), this.activeGroup());
    const grid: (Kana | null)[] = [];
    
    let i = 0;
    while (i < raw.length) {
      const char = raw[i];
      
      // Handle Yoon (Kya, Sha, Cha, etc.)
      if (this.activeGroup() === 'YOON' && char.romaji.endsWith('ya')) {
         grid.push(raw[i]);     // ya (Col A)
         grid.push(null);       // (Col I)
         grid.push(raw[i+1]);   // yu (Col U)
         grid.push(null);       // (Col E)
         grid.push(raw[i+2]);   // yo (Col O)
         i += 3;
         continue;
      }

      // Handle Standard Y row (Ya, Yu, Yo)
      if (char.romaji === 'ya') {
        grid.push(raw[i]);   // Ya
        grid.push(null);
        grid.push(raw[i+1]); // Yu
        grid.push(null);
        grid.push(raw[i+2]); // Yo
        i += 3;
        continue;
      }

      // Handle W row (Wa, Wo)
      if (char.romaji === 'wa') {
        grid.push(raw[i]);   // Wa
        grid.push(null);
        grid.push(null);
        grid.push(null);
        grid.push(raw[i+1]); // Wo
        i += 2;
        continue;
      }

      // Handle N
      if (char.romaji === 'n') {
        grid.push(char); // N
        grid.push(null);
        grid.push(null);
        grid.push(null);
        grid.push(null);
        i++;
        continue;
      }

      // Normal rows (A, Ka, Sa, etc.) are already 5 chars long
      grid.push(char);
      i++;
    }

    return grid;
  }

  formatGroupName(g: string): string {
    switch(g) {
      case 'GOJUUON': return 'Dasar (Gojuuon)';
      case 'DAKUON': return 'Tenteng (Dakuon)';
      case 'HANDAKUON': return 'Maru (Handakuon)';
      case 'YOON': return 'Gabungan (Yoon)';
      default: return g;
    }
  }
}