import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../services/translation.service';
import { TtsService } from '../services/tts.service';
import { mensetsuData, MensetsuLevel, MensetsuCategory, MensetsuQuestion } from '../data/mensetsu/mensetsu';

@Component({
  selector: 'app-mensetsu',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen pb-24 transition-colors duration-300"
         [class.bg-slate-950]="ts.isDarkMode()" [class.bg-gray-50]="!ts.isDarkMode()"
         [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">

      <!-- Header -->
      <div class="sticky top-0 z-20 p-4 border-b flex items-center gap-4 transition-colors"
           [class.bg-slate-950]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
           [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
        <button (click)="goBack()" class="p-2 rounded-xl hover:bg-opacity-20 hover:bg-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div>
          <h1 class="text-xl font-bold">🎤 Kisi-kisi Mensetsu</h1>
          <p class="text-xs opacity-60">面接準備</p>
        </div>
      </div>

      <!-- Level Selection (Root) -->
      @if (!selectedLevel() && !selectedCategory() && !selectedQuestion()) {
        <div class="p-4">
          <p class="text-sm mb-4" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">
            Pilih level JLPT untuk mulai latihan wawancara:
          </p>
          
          <div class="space-y-3">
            @for (level of mensetsuLevels; track level.level) {
              <button (click)="selectLevel(level)"
                      class="w-full text-left p-4 rounded-2xl border transition-all active:scale-95"
                      [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()"
                      [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-bold text-lg px-2 py-0.5 rounded-lg text-sm"
                            [class]="getLevelBadgeClass(level.level)">
                        {{ level.level }}
                      </span>
                      <span class="font-semibold" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
                        {{ level.title.replace(level.level + ' - ', '') }}
                      </span>
                    </div>
                    <p class="text-xs" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">
                      {{ level.description }} • {{ getTotalQuestions(level) }} pertanyaan
                    </p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 opacity-40">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </button>
            }
          </div>
        </div>
      }

      <!-- Category Selection -->
      @if (selectedLevel() && !selectedCategory() && !selectedQuestion()) {
        <div class="p-4">
          <div class="flex items-center gap-2 mb-4">
            <span class="px-2 py-1 rounded-lg text-sm font-bold" [class]="getLevelBadgeClass(selectedLevel()!.level)">
              {{ selectedLevel()!.level }}
            </span>
            <span class="font-semibold" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
              Pilih Bidang Pekerjaan
            </span>
          </div>
          
          <div class="space-y-3">
            @for (category of selectedLevel()!.categories; track category.field) {
              <button (click)="selectCategory(category)"
                      class="w-full text-left p-4 rounded-2xl border transition-all active:scale-95"
                      [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()"
                      [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="text-3xl">{{ category.icon }}</span>
                    <div>
                      <div class="font-semibold" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
                        {{ category.field }}
                      </div>
                      <div class="text-xs" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">
                        {{ category.fieldJa }} • {{ category.questions.length }} pertanyaan
                      </div>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 opacity-40">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </button>
            }
          </div>
        </div>
      }

      <!-- Question List -->
      @if (selectedLevel() && selectedCategory() && !selectedQuestion()) {
        <div class="p-4">
          <!-- Play All Button -->
          <div class="flex gap-2 mb-4">
            <button (click)="playAll()"
                    class="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all"
                    [class.bg-blue-700]="ts.isDarkMode()" [class.text-white]="ts.isDarkMode()"
                    [class.bg-blue-600]="!ts.isDarkMode()" [class.text-white]="!ts.isDarkMode()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-4 h-4">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Play Semua Pertanyaan
            </button>
            @if (isSpeaking()) {
              <button (click)="stopSpeaking()"
                      class="px-4 py-3 rounded-xl text-sm font-semibold bg-red-600 text-white transition-all">
                ⏹ Stop
              </button>
            }
          </div>

          <div class="space-y-3">
            @for (q of selectedCategory()!.questions; track q.id; let i = $index) {
              <div class="rounded-2xl border overflow-hidden"
                   [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()"
                   [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                <div class="p-4">
                  <div class="flex items-start justify-between gap-3 mb-2">
                    <div class="flex-1">
                      <div class="text-xs font-bold text-blue-500 mb-1">Pertanyaan {{ i + 1 }}</div>
                      <div class="font-bold text-base leading-snug" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
                        {{ q.japanese }}
                      </div>
                      <div class="text-xs mt-1" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">
                        {{ q.indonesian }}
                      </div>
                    </div>
                    <button (click)="playSingle(q)" 
                            class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                            [class.bg-blue-800]="ts.isDarkMode() && currentPlayingId() !== q.id"
                            [class.bg-blue-600]="!ts.isDarkMode() && currentPlayingId() !== q.id"
                            [class.bg-green-600]="currentPlayingId() === q.id"
                            [class.text-white]="true"
                            [class.animate-pulse]="currentPlayingId() === q.id">
                      @if (currentPlayingId() === q.id) {
                        🔊
                      } @else {
                        ▶
                      }
                    </button>
                  </div>
                  
                  <button (click)="toggleExpand(q.id)"
                          class="text-xs font-medium text-blue-500 flex items-center gap-1 mt-2">
                    {{ expandedId() === q.id ? '▲ Sembunyikan' : '▼ Lihat Contoh Jawaban' }}
                  </button>
                </div>
                
                @if (expandedId() === q.id) {
                  <div class="px-4 pb-4 border-t"
                       [class.border-slate-800]="ts.isDarkMode()" [class.border-gray-100]="!ts.isDarkMode()">
                    <!-- Sample Answer -->
                    <div class="mt-3 rounded-xl p-3 border"
                         [class.bg-emerald-900_20]="ts.isDarkMode()" [class.border-emerald-800]="ts.isDarkMode()"
                         [class.bg-emerald-50]="!ts.isDarkMode()" [class.border-emerald-200]="!ts.isDarkMode()">
                      <div class="text-xs font-bold text-emerald-500 mb-1">📝 Contoh Jawaban</div>
                      <div class="text-sm font-medium leading-relaxed" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
                        {{ q.sampleAnswer.japanese }}
                      </div>
                      <div class="text-xs mt-1 italic" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">
                        {{ q.sampleAnswer.romaji }}
                      </div>
                      <div class="text-xs mt-1 text-emerald-600">{{ q.sampleAnswer.indonesian }}</div>
                    </div>

                    <!-- Tips -->
                    <div class="mt-3 rounded-xl p-3 border"
                         [class.bg-amber-900_20]="ts.isDarkMode()" [class.border-amber-800]="ts.isDarkMode()"
                         [class.bg-amber-50]="!ts.isDarkMode()" [class.border-amber-200]="!ts.isDarkMode()">
                      <div class="text-xs font-bold text-amber-500 mb-1">💡 Tips</div>
                      <div class="text-xs leading-relaxed" [class.text-amber-200]="ts.isDarkMode()" [class.text-amber-800]="!ts.isDarkMode()">
                        {{ q.tips }}
                      </div>
                    </div>

                    <!-- STT (Speech to Text) Practice -->
                    <div class="mt-3">
                      <div class="text-xs font-bold mb-2 opacity-60">🎤 Latihan Jawab (STT)</div>
                      <div class="flex gap-2">
                        <button (click)="startSTT(q.id)"
                                class="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all border"
                                [class.bg-rose-900_30]="ts.isDarkMode()" [class.border-rose-800]="ts.isDarkMode()" [class.text-rose-300]="ts.isDarkMode()"
                                [class.bg-rose-50]="!ts.isDarkMode()" [class.border-rose-300]="!ts.isDarkMode()" [class.text-rose-600]="!ts.isDarkMode()"
                                [class.animate-pulse]="sttActiveId() === q.id">
                          @if (sttActiveId() === q.id) {
                            🔴 Merekam... (klik untuk stop)
                          } @else {
                            🎤 Jawab (Bicara)
                          }
                        </button>
                      </div>
                      
                      @if (sttTranscripts()[q.id]) {
                        <div class="mt-2 p-3 rounded-xl border text-sm"
                             [class.bg-slate-800]="ts.isDarkMode()" [class.border-slate-700]="ts.isDarkMode()"
                             [class.bg-gray-100]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                          <div class="text-xs opacity-60 mb-1">Jawaban Anda:</div>
                          <div [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
                            {{ sttTranscripts()[q.id] }}
                          </div>
                        </div>
                      }
                    </div>

                    <!-- Keywords -->
                    <div class="mt-3 flex flex-wrap gap-1">
                      @for (kw of q.keywords; track kw) {
                        <span class="text-xs px-2 py-1 rounded-full"
                              [class.bg-slate-800]="ts.isDarkMode()" [class.text-slate-300]="ts.isDarkMode()"
                              [class.bg-gray-200]="!ts.isDarkMode()" [class.text-slate-600]="!ts.isDarkMode()">
                          {{ kw }}
                        </span>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }

    </div>
  `
})
export class MensetsuComponent {
  ts = inject(TranslationService);
  tts = inject(TtsService);
  
  mensetsuLevels = mensetsuData;
  selectedLevel = signal<MensetsuLevel | null>(null);
  selectedCategory = signal<MensetsuCategory | null>(null);
  selectedQuestion = signal<MensetsuQuestion | null>(null);
  expandedId = signal<string | null>(null);
  
  isSpeaking = signal(false);
  currentPlayingId = signal<string | null>(null);
  sttActiveId = signal<string | null>(null);
  sttTranscripts = signal<Record<string, string>>({});

  private recognition: any = null;
  private cancelRef = { cancelled: false };

  getLevelBadgeClass(level: string): string {
    const map: Record<string, string> = {
      'N5': 'bg-green-700 text-green-100',
      'N4': 'bg-blue-700 text-blue-100',
      'N3': 'bg-yellow-700 text-yellow-100',
      'N2': 'bg-orange-700 text-orange-100',
      'N1': 'bg-red-700 text-red-100',
    };
    return map[level] || 'bg-gray-700 text-gray-100';
  }

  getTotalQuestions(level: MensetsuLevel): number {
    return level.categories.reduce((sum, cat) => sum + cat.questions.length, 0);
  }

  selectLevel(level: MensetsuLevel) {
    this.selectedLevel.set(level);
  }

  selectCategory(category: MensetsuCategory) {
    this.selectedCategory.set(category);
  }

  toggleExpand(id: string) {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  goBack() {
    if (this.selectedCategory()) {
      this.selectedCategory.set(null);
    } else if (this.selectedLevel()) {
      this.selectedLevel.set(null);
    }
    this.stopSpeaking();
  }

  async playSingle(q: MensetsuQuestion) {
    if (this.currentPlayingId() === q.id) {
      this.stopSpeaking();
      return;
    }
    
    this.stopSpeaking();
    this.cancelRef = { cancelled: false };
    this.currentPlayingId.set(q.id);
    this.isSpeaking.set(true);
    
    await this.speakMensetsuStyle(q);
    
    if (!this.cancelRef.cancelled) {
      this.currentPlayingId.set(null);
      this.isSpeaking.set(false);
    }
  }

  async playAll() {
    const questions = this.selectedCategory()?.questions || [];
    this.stopSpeaking();
    this.cancelRef = { cancelled: false };
    this.isSpeaking.set(true);
    
    for (const q of questions) {
      if (this.cancelRef.cancelled) break;
      this.currentPlayingId.set(q.id);
      await this.speakMensetsuStyle(q);
      if (!this.cancelRef.cancelled) {
        await this.delay(1500);
      }
    }
    
    if (!this.cancelRef.cancelled) {
      this.currentPlayingId.set(null);
      this.isSpeaking.set(false);
    }
  }

  private async speakMensetsuStyle(q: MensetsuQuestion): Promise<void> {
    if (this.cancelRef.cancelled) return;

    // Build sequence of items to speak
    const words = q.sampleAnswer.japanese.split(/[\s。、]+/).filter(w => w);
    
    const items: Array<{ text: string; lang: string; rate?: number }> = [
      { text: q.japanese, lang: 'ja-JP', rate: 0.85 },
      { text: q.indonesian, lang: 'id-ID', rate: 0.95 },
      { text: 'Contoh jawaban: ', lang: 'id-ID', rate: 0.9 },
      { text: q.sampleAnswer.japanese, lang: 'ja-JP', rate: 0.8 },
      ...words.map(w => ({ text: w, lang: 'ja-JP', rate: 0.7 })),
      { text: q.sampleAnswer.indonesian, lang: 'id-ID', rate: 0.95 },
    ];

    await this.tts.speakChain(items, this.cancelRef, 400);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stopSpeaking() {
    this.cancelRef.cancelled = true;
    this.tts.cancel();
    this.isSpeaking.set(false);
    this.currentPlayingId.set(null);
  }

  startSTT(questionId: string) {
    if (this.sttActiveId() === questionId) {
      if (this.recognition) {
        this.recognition.stop();
      }
      this.sttActiveId.set(null);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser Anda tidak mendukung Speech Recognition. Gunakan Chrome untuk fitur ini.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'ja-JP';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const current = this.sttTranscripts();
      this.sttTranscripts.set({ ...current, [questionId]: transcript });
    };

    this.recognition.onend = () => {
      this.sttActiveId.set(null);
    };

    this.recognition.onerror = () => {
      this.sttActiveId.set(null);
    };

    this.sttActiveId.set(questionId);
    this.recognition.start();
  }
}
