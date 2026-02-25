import { Component, ElementRef, ViewChild, AfterViewInit, signal, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JapaneseDataService } from '../services/data.service';
import { WritingDataService } from '../services/writing-data.service';

@Component({
  selector: 'app-writing',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  styles: [`
    /* Animasi Goyang (Shake) saat jawaban salah */
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-10px) rotate(-2deg); }
      40% { transform: translateX(10px) rotate(2deg); }
      60% { transform: translateX(-10px) rotate(-2deg); }
      80% { transform: translateX(10px) rotate(2deg); }
    }
    .shake-animation {
      animation: shake 0.5s ease-in-out;
    }
    
    .canvas-container {
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
  `],
  template: `
    <div class="min-h-screen bg-black pb-20 overflow-x-hidden overflow-y-auto">
      <div class="p-4 border-b border-zinc-900 flex items-center gap-4 sticky top-0 bg-black z-20">
        <a routerLink="/" class="text-zinc-400 hover:text-white transition-colors">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </a>
        <h1 class="text-xl font-bold text-white">Latihan Menulis</h1>
      </div>

      <div class="p-4 flex flex-col items-center">
        
        <div class="flex w-full bg-zinc-900 p-1 rounded-xl mb-4 max-w-md">
          <button (click)="setCategory('HIRAGANA')" 
            [class]="category() === 'HIRAGANA' ? 'flex-1 py-2 bg-white text-black rounded-lg font-bold transition text-sm' : 'flex-1 py-2 text-zinc-400 hover:text-white transition text-sm font-medium'">
            Hiragana
          </button>
          <button (click)="setCategory('KATAKANA')" 
            [class]="category() === 'KATAKANA' ? 'flex-1 py-2 bg-white text-black rounded-lg font-bold transition text-sm' : 'flex-1 py-2 text-zinc-400 hover:text-white transition text-sm font-medium'">
            Katakana
          </button>
          <button (click)="setCategory('KANJI')" 
            [class]="category() === 'KANJI' ? 'flex-1 py-2 bg-white text-black rounded-lg font-bold transition text-sm' : 'flex-1 py-2 text-zinc-400 hover:text-white transition text-sm font-medium'">
            Kanji
          </button>
        </div>

        @if (category() === 'KANJI') {
          <div class="flex w-full gap-1 mb-4 max-w-md animate-in slide-in-from-top-2 duration-200">
            <button (click)="setKanjiLevel('N5')" 
              [class]="kanjiLevel() === 'N5' ? 'flex-1 py-1.5 bg-zinc-800 border border-white text-white rounded-lg text-xs font-bold' : 'flex-1 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-lg text-xs hover:bg-zinc-800 hover:text-white'">
              N5
            </button>
            <button (click)="setKanjiLevel('N4')" 
              [class]="kanjiLevel() === 'N4' ? 'flex-1 py-1.5 bg-zinc-800 border border-white text-white rounded-lg text-xs font-bold' : 'flex-1 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-lg text-xs hover:bg-zinc-800 hover:text-white'">
              N4
            </button>
            <button (click)="setKanjiLevel('N3')" 
              [class]="kanjiLevel() === 'N3' ? 'flex-1 py-1.5 bg-zinc-800 border border-white text-white rounded-lg text-xs font-bold' : 'flex-1 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-lg text-xs hover:bg-zinc-800 hover:text-white'">
              N3
            </button>
            <button (click)="setKanjiLevel('N2')" 
              [class]="kanjiLevel() === 'N2' ? 'flex-1 py-1.5 bg-zinc-800 border border-white text-white rounded-lg text-xs font-bold' : 'flex-1 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-lg text-xs hover:bg-zinc-800 hover:text-white'">
              N2
            </button>
            <button (click)="setKanjiLevel('N1')" 
              [class]="kanjiLevel() === 'N1' ? 'flex-1 py-1.5 bg-zinc-800 border border-white text-white rounded-lg text-xs font-bold' : 'flex-1 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-lg text-xs hover:bg-zinc-800 hover:text-white'">
              N1
            </button>
          </div>
        }

        <div class="flex flex-wrap items-center justify-center gap-2 mb-4 w-full max-w-md bg-zinc-900/50 p-2 rounded-xl border border-zinc-800">
          <span class="text-zinc-400 text-xs font-medium mr-1">Ukuran Papan:</span>
          <button (click)="changeCanvasSize(250)" [class]="canvasSize() === 250 ? 'bg-white text-black px-2 py-1 rounded-md text-xs font-bold' : 'bg-zinc-800 text-zinc-300 hover:text-white px-2 py-1 rounded-md text-xs'">250px</button>
          <button (click)="changeCanvasSize(300)" [class]="canvasSize() === 300 ? 'bg-white text-black px-2 py-1 rounded-md text-xs font-bold' : 'bg-zinc-800 text-zinc-300 hover:text-white px-2 py-1 rounded-md text-xs'">300px</button>
          <button (click)="changeCanvasSize(400)" [class]="canvasSize() === 400 ? 'bg-white text-black px-2 py-1 rounded-md text-xs font-bold' : 'bg-zinc-800 text-zinc-300 hover:text-white px-2 py-1 rounded-md text-xs'">400px</button>
          
          <div class="flex items-center gap-1 ml-auto">
            <input type="number" [(ngModel)]="customSizeValue" placeholder="Custom" 
              class="w-16 bg-black border border-zinc-700 text-white px-2 py-1 rounded-md text-xs outline-none focus:border-white">
            <button (click)="applyCustomSize()" class="bg-zinc-700 hover:bg-zinc-600 text-white px-2 py-1 rounded-md text-xs font-medium transition">Set</button>
          </div>
        </div>

        <div class="canvas-container relative bg-white rounded-2xl border-4 overflow-hidden touch-none mb-4"
             [class.border-zinc-700]="drawingState() === 'normal'"
             [class.shadow-[0_0_20px_rgba(255,255,255,0.05)]]="drawingState() === 'normal'"
             [class.border-red-500]="drawingState() === 'wrong'"
             [class.shadow-[0_0_20px_rgba(239,68,68,0.5)]]="drawingState() === 'wrong'"
             [class.shake-animation]="drawingState() === 'wrong'"
             [class.border-green-500]="drawingState() === 'correct'"
             [class.shadow-[0_0_20px_rgba(34,197,94,0.5)]]="drawingState() === 'correct'"
             [style.width.px]="canvasSize()" 
             [style.height.px]="canvasSize()">
           
           <div class="absolute top-0 left-0 right-0 p-3 z-50 flex flex-col items-center pointer-events-none">
              @if (charInfo(); as info) {
                @if (info.type === 'KANJI') {
                  <div class="bg-black/80 px-3 py-1 rounded-lg backdrop-blur-sm border border-zinc-700/50 flex flex-col items-center shadow-md">
                    <div class="text-zinc-200 font-bold text-lg leading-none mb-1">{{ info.data.meaning }}</div>
                    <div class="flex gap-3 text-[10px]">
                      @if (info.data.onyomi.length > 0) {
                        <span class="text-zinc-400">ON: <span class="text-white font-bold">{{ info.data.onyomi[0] }}</span></span>
                      }
                      @if (info.data.kunyomi.length > 0) {
                        <span class="text-zinc-400">KUN: <span class="text-white font-bold">{{ info.data.kunyomi[0] }}</span></span>
                      }
                    </div>
                  </div>
                } @else {
                  <div class="bg-black/80 px-4 py-1.5 rounded-xl border border-zinc-700/50 backdrop-blur-sm shadow-md">
                    <div class="text-white font-mono text-xl font-bold tracking-[0.2em]">
                      {{ info.data.romaji.toUpperCase() }}
                    </div>
                  </div>
                }
              }
           </div>

           <div class="absolute inset-0 pointer-events-none z-0">
             <div class="w-full h-1/2 border-b border-dashed border-zinc-300"></div>
             <div class="h-full w-1/2 border-r border-dashed border-zinc-300 absolute top-0"></div>
           </div>

           <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 p-4">
              <span class="absolute text-[180px] font-serif text-zinc-200 opacity-50 -z-10 leading-none pt-6"
                    [style.font-size.px]="canvasSize() * 0.6">{{ currentChar() }}</span>

              @if (!hasImageError()) {
                 @if (showTutorial()) {
                    <img [src]="tutorialUrl()" 
                         (error)="hasImageError.set(true)"
                         class="w-full h-full object-contain opacity-90 transition-opacity duration-300 rounded-xl" 
                         alt="Tutorial">
                 } @else {
                    <img [src]="staticUrl()" 
                         (error)="hasImageError.set(true)"
                         class="w-full h-full object-contain opacity-20 transition-opacity duration-300" 
                         alt="Guide">
                 }
              } @else {
                 <div class="flex flex-col items-center justify-center text-zinc-600 text-center gap-1">
                   <span class="text-[10px] opacity-40">Panduan butuh internet</span>
                 </div>
              }
           </div>

           <canvas #canvas class="absolute inset-0 w-full h-full z-30 cursor-crosshair touch-none"
             (mousedown)="startDrawing($event)"
             (mousemove)="draw($event)"
             (mouseup)="stopDrawing()"
             (mouseleave)="stopDrawing()"
             (touchstart)="startDrawingTouch($event)"
             (touchmove)="drawTouch($event)"
             (touchend)="stopDrawing()"
           ></canvas>
        </div>

        <div class="flex justify-between w-full mb-3 transition-all" [style.max-width.px]="canvasSize()">
            <button (click)="prevChar()" class="flex-1 mr-1 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 active:bg-black transition flex items-center justify-center gap-2 group">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                <span class="text-xs font-bold uppercase tracking-wider">Sebelumnya</span>
            </button>
            <button (click)="nextChar()" class="flex-1 ml-1 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 active:bg-black transition flex items-center justify-center gap-2 group">
                <span class="text-xs font-bold uppercase tracking-wider">Selanjutnya</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 group-hover:translate-x-1 transition-transform">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>

        <div class="grid grid-cols-4 gap-2 mb-6 w-full transition-all" [style.max-width.px]="canvasSize()">
          <button (click)="clearCanvas()" class="py-3 bg-zinc-800 text-white rounded-xl font-bold text-[10px] sm:text-xs hover:bg-zinc-700 border border-zinc-700 transition active:scale-95 flex flex-col items-center justify-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
            Hapus
          </button>
          
          <button (click)="tidyUpDrawing()" class="py-3 bg-zinc-800 text-white rounded-xl font-bold text-[10px] sm:text-xs hover:bg-zinc-700 border border-zinc-700 transition active:scale-95 flex flex-col items-center justify-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
            Rapihkan
          </button>

          <button (click)="toggleTutorial()" 
            [class]="showTutorial() ? 'py-3 bg-white text-black rounded-xl font-bold text-[10px] sm:text-xs border border-white transition active:scale-95 flex flex-col items-center justify-center gap-1' : 'py-3 bg-zinc-800 text-white rounded-xl font-bold text-[10px] sm:text-xs hover:bg-zinc-700 border border-zinc-700 transition active:scale-95 flex flex-col items-center justify-center gap-1'">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {{ showTutorial() ? 'Tutup' : 'Tutorial' }}
          </button>

           <button (click)="checkDrawing()" class="py-3 bg-white text-black rounded-xl font-bold text-[10px] sm:text-xs hover:bg-zinc-200 transition active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.3)] flex flex-col items-center justify-center gap-1">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Cek Tulisan
          </button>
        </div>

        <div class="w-full border-t border-zinc-900 my-2 max-w-md"></div>

        <div class="w-full max-w-md mb-2">
            <button (click)="showList.set(!showList())" class="w-full py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-xl hover:text-white hover:bg-zinc-800 transition text-xs font-bold flex items-center justify-center gap-2">
               <span>{{ showList() ? 'Sembunyikan Daftar Huruf' : 'Tampilkan Daftar Huruf' }}</span>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
                    class="w-4 h-4 transition-transform duration-300" [class.rotate-180]="!showList()">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
               </svg>
            </button>
        </div>

        @if (showList()) {
          <div class="w-full max-w-md animate-in slide-in-from-top-2 duration-300 fade-in-0">
            <div class="flex justify-between items-end mb-3 pl-1">
              <h3 class="text-zinc-400 text-sm font-bold">Pilih Huruf:</h3>
              <div class="w-1/2">
                  <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" placeholder="Cari..." 
                    class="w-full bg-black border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white focus:border-white outline-none transition" />
              </div>
            </div>
            
            <div class="h-[240px] overflow-y-auto pr-1 no-scrollbar bg-black/50 rounded-xl border border-zinc-900 p-2">
              <div class="grid grid-cols-5 gap-2">
                @for(char of displayList(); track char) {
                  <button (click)="selectChar(char)" 
                      [class]="currentChar() === char ? 'aspect-square flex items-center justify-center bg-zinc-800 border-2 border-white rounded-lg text-white font-serif font-bold text-xl shadow-[0_0_10px_rgba(255,255,255,0.2)] transition' : 'aspect-square flex items-center justify-center bg-black border border-zinc-900 rounded-lg text-zinc-500 font-serif text-lg hover:bg-zinc-800 hover:text-white transition'">
                      {{char}}
                  </button>
                } @empty {
                  <div class="col-span-5 text-center text-zinc-600 text-xs py-4">Tidak ditemukan.</div>
                }
              </div>
            </div>
          </div>
        }

      </div>
    </div>
  `
})
export class WritingComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  dataService = inject(JapaneseDataService);
  writingDataService = inject(WritingDataService);

  category = signal<'HIRAGANA' | 'KATAKANA' | 'KANJI'>('HIRAGANA');
  kanjiLevel = signal<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
  currentChar = signal('あ');
  searchQuery = signal('');
  showTutorial = signal(false);
  hasImageError = signal(false);
  
  showList = signal(true);
  canvasSize = signal(300);
  customSizeValue: number = 300; 
  
  // State animasi & pewarnaan
  drawingState = signal<'normal' | 'correct' | 'wrong'>('normal');

  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;

  tutorialUrl = computed(() => {
    const char = this.currentChar();
    if (!char) return '';
    const hex = char.charCodeAt(0).toString(16).toLowerCase();
    return `https://raw.githubusercontent.com/mistval/kanji_images/master/gifs/${hex}.gif`;
  });

  staticUrl = computed(() => {
    const char = this.currentChar();
    if (!char) return '';
    const hex = char.charCodeAt(0).toString(16).toLowerCase();
    const paddedHex = hex.padStart(5, '0');
    return `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${paddedHex}.svg`;
  });

  charInfo = computed(() => {
    const c = this.currentChar();
    const cat = this.category();

    if (cat === 'KANJI') {
      const k = this.dataService.getKanji('ALL').find(x => x.char === c);
      return k ? { type: 'KANJI', data: k } : null;
    } else {
      const groups = ['GOJUUON', 'DAKUON', 'HANDAKUON', 'YOON'] as const;
      for (const g of groups) {
         const found = this.dataService.getKana(cat, g).find(k => k.char === c);
         if (found) return { type: 'KANA', data: found };
      }
      return null;
    }
  });

  displayList = computed(() => {
    const cat = this.category();
    const query = this.searchQuery().toLowerCase().trim();
    let chars: string[] = [];

    if (cat === 'HIRAGANA') {
      chars = this.dataService.getKana('HIRAGANA', 'GOJUUON').map(k => k.char);
    } else if (cat === 'KATAKANA') {
      chars = this.dataService.getKana('KATAKANA', 'GOJUUON').map(k => k.char);
    } else {
      const level = this.kanjiLevel();
      chars = this.dataService.getKanji(level).map(k => k.char);
    }

    if (query) {
      if (cat === 'KANJI') {
         return this.dataService.getKanji(this.kanjiLevel())
           .filter(k => k.char.includes(query) || k.meaning.toLowerCase().includes(query))
           .map(k => k.char);
      } else {
         return this.dataService.getKana(cat, 'GOJUUON')
           .filter(k => k.char.includes(query) || k.romaji.includes(query))
           .map(k => k.char);
      }
    }
    return chars;
  });

  constructor() {
    effect(() => {
      const list = this.displayList();
      if (list.length > 0 && !list.includes(this.currentChar())) {
        this.selectChar(list[0]);
      }
    }, { allowSignalWrites: true });

    effect(() => {
      this.currentChar();
      this.showTutorial();
      this.hasImageError.set(false);
      this.drawingState.set('normal'); 
    }, { allowSignalWrites: true });
  }

  ngAfterViewInit() {
    this.initCanvas();
  }

  changeCanvasSize(size: number) {
    if (size < 200) size = 200;
    if (size > 600) size = 600;
    
    this.canvasSize.set(size);
    this.customSizeValue = size;

    setTimeout(() => {
      this.initCanvas();
    }, 0);
  }

  applyCustomSize() {
    if (this.customSizeValue) {
      this.changeCanvasSize(this.customSizeValue);
    }
  }

  private initCanvas() {
    if (!this.canvasRef || !this.canvasRef.nativeElement) return;
    
    const canvas = this.canvasRef.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    const currentSize = this.canvasSize();
    
    canvas.width = currentSize * dpr;
    canvas.height = currentSize * dpr;
    
    this.ctx = canvas.getContext('2d', { desynchronized: true })!;
    if (!this.ctx) return;

    this.ctx.scale(dpr, dpr);
    this.ctx.lineWidth = Math.max(8, currentSize / 30); 
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = '#000000';
  }

  setCategory(c: 'HIRAGANA' | 'KATAKANA' | 'KANJI') {
    this.category.set(c);
    this.searchQuery.set(''); 
    this.showTutorial.set(false);
  }

  setKanjiLevel(l: 'N5' | 'N4' | 'N3' | 'N2' | 'N1') {
    this.kanjiLevel.set(l);
    this.showTutorial.set(false);
  }

  selectChar(c: string) {
    this.currentChar.set(c);
    this.clearCanvas();
    this.showTutorial.set(false);
  }

  prevChar() {
    const list = this.displayList();
    const curr = this.currentChar();
    const idx = list.indexOf(curr);
    if (list.length === 0) return;
    const newIdx = (idx - 1 + list.length) % list.length;
    this.selectChar(list[newIdx]);
  }

  nextChar() {
    const list = this.displayList();
    const curr = this.currentChar();
    const idx = list.indexOf(curr);
    if (list.length === 0) return;
    const newIdx = (idx + 1) % list.length;
    this.selectChar(list[newIdx]);
  }

  toggleTutorial() {
    this.showTutorial.update(v => !v);
  }

  // ==========================================
  // LOGIKA BARU: CLEAR, RAPID & CEK
  // ==========================================

  clearCanvas() {
    if (!this.ctx || !this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawingState.set('normal');
    
    // Kembalikan properti menggambar ke standar
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.strokeStyle = '#000000'; 
  }

  tidyUpDrawing() {
    if (!this.ctx || !this.canvasRef) return;
    
    this.clearCanvas(); // Bersihkan dulu kanvasnya
    
    const size = this.canvasSize();
    this.showTutorial.set(false); // Sembunyikan tutorial agar tidak menimpa teks
    
    // Auto-draw menggunakan Font Teks (Tampilan Rapih)
    this.ctx.font = `${size * 0.6}px serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    // Isi teks berwarna Hijau langsung (bukan menggunakan fungsi recolor)
    this.ctx.fillStyle = '#22c55e';
    this.ctx.fillText(this.currentChar(), size / 2, size / 2 + (size * 0.05));
    
    this.drawingState.set('correct');
  }

  checkDrawing() {
    if (!this.ctx || !this.canvasRef) return;

    // 1. Reset state (sangat penting agar CSS Animation terpicu ulang jika ditekan berkali-kali)
    this.drawingState.set('normal');
    
    // 2. Beri jeda sangat kecil agar Angular dapat mendeteksi perubahan state di atas
    setTimeout(() => {
      const accuracy = this.calculateAccuracy();
      
      // Menggunakan threshold toleransi (20% kemiripan) karena jari/mouse tidak sesempurna font
      if (accuracy > 0.20) {
        this.drawingState.set('correct');
        this.recolorCanvas('#22c55e'); // Pewarnaan Hijau
      } else {
        this.drawingState.set('wrong');
        this.recolorCanvas('#ef4444'); // Pewarnaan Merah
        
        // Hapus Otomatis jika salah (Sesuai request)
        setTimeout(() => {
          if (this.drawingState() === 'wrong') {
            this.clearCanvas();
          }
        }, 800); // Tunggu sampai animasi goyang selesai (800ms)
      }
    }, 50);
  }

  private calculateAccuracy(): number {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.width;
    const h = canvas.height;
    const dpr = window.devicePixelRatio || 1;
    const size = this.canvasSize();

    // Buat Off-Canvas rahasia untuk mencontoh huruf aslinya
    const offCanvas = document.createElement('canvas');
    offCanvas.width = w;
    offCanvas.height = h;
    const offCtx = offCanvas.getContext('2d')!;
    
    offCtx.scale(dpr, dpr);
    offCtx.font = `${size * 0.6}px serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = 'black';
    offCtx.fillText(this.currentChar(), size / 2, size / 2 + (size * 0.05));

    // Ekstrak data Piksel
    const userImg = this.ctx.getImageData(0, 0, w, h).data;
    const perfectImg = offCtx.getImageData(0, 0, w, h).data;

    let perfectInk = 0;
    let overlap = 0;
    let userInk = 0;

    for (let i = 3; i < userImg.length; i += 4) {
      const uAlpha = userImg[i];
      const pAlpha = perfectImg[i];

      if (pAlpha > 50) perfectInk++;
      if (uAlpha > 50) userInk++;
      if (uAlpha > 50 && pAlpha > 50) overlap++;
    }

    if (perfectInk === 0 || userInk === 0) return 0; // Kosong atau tidak bisa dihitung
    
    const coverage = overlap / perfectInk;
    const neatness = overlap / userInk;

    // Kalkulasi skor akhir
    return coverage * 0.6 + neatness * 0.4;
  }

  private recolorCanvas(color: string) {
    if (!this.ctx || !this.canvasRef) return;
    const size = this.canvasSize();
    
    // Ganti warna HANYA pada coretan yang sudah ada (source-in)
    this.ctx.globalCompositeOperation = 'source-in';
    this.ctx.fillStyle = color;
    
    // Koordinat isi ulang menggunakan CSS Pixels karena konteks sudah di-'scale(dpr)'
    this.ctx.fillRect(0, 0, size, size);
    
    // Kembalikan ke normal
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.strokeStyle = color; 
  }

  // --- LOGIKA MENGGAMBAR KANVAS ---
  startDrawing(e: MouseEvent) {
    if (this.drawingState() !== 'normal') this.clearCanvas();
    
    this.isDrawing = true;
    const { x, y } = this.getMousePos(e);
    [this.lastX, this.lastY] = [x, y];
  }

  draw(e: MouseEvent) {
    if (!this.isDrawing) return;
    const { x, y } = this.getMousePos(e);
    this.drawLine(x, y);
  }

  startDrawingTouch(e: TouchEvent) {
    if (e.cancelable) e.preventDefault();
    if (this.drawingState() !== 'normal') this.clearCanvas();
    
    this.isDrawing = true;
    const { x, y } = this.getTouchPos(e);
    [this.lastX, this.lastY] = [x, y];
  }

  drawTouch(e: TouchEvent) {
    if (e.cancelable) e.preventDefault();
    if (!this.isDrawing) return;
    const { x, y } = this.getTouchPos(e);
    this.drawLine(x, y);
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  private drawLine(x: number, y: number) {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    [this.lastX, this.lastY] = [x, y];
  }

  private getMousePos(e: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  private getTouchPos(e: TouchEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }
}
