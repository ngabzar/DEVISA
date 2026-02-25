import { Component, signal, computed, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JapaneseDataService } from '../services/data.service';
import { SoalService, SoalCategory } from '../services/soal.service';
import { KanaToRomajiPipe } from '../pipes/kana-to-romaji.pipe';
import { Question } from '../types';
import { TranslationService } from '../services/translation.service';
import { TtsService } from '../services/tts.service';

// ── Semua data soal dimuat via SoalService (dynamic import) ──







// Type untuk mode ujian
type ExamMode = 'PRACTICE' | 'EXAM';

// ============================================================
// SMART SHUFFLE ENGINE
// Menyimpan pool per quizType di memori sesi.
// Pool = sisa soal yang belum muncul di putaran saat ini.
// Ketika pool habis, pool di-reset (acak ulang semua soal)
// sehingga soal tidak terulang sebelum semua selesai.
// Jawaban pilihan ganda diacak ulang SETIAP kemunculan soal
// sehingga posisi jawaban benar berpindah secara acak.
// ============================================================
interface ShufflePool {
  // Indeks soal dari master list yang BELUM muncul di putaran ini
  remaining: number[];
  // Putaran ke berapa (untuk info)
  round: number;
}

const shufflePools = new Map<string, ShufflePool>();

@Component({
  selector: 'app-quiz',
  imports: [CommonModule, RouterLink, FormsModule, KanaToRomajiPipe],
  template: `
    <div class="min-h-screen bg-slate-950 pb-20 text-slate-200">
      <!-- HEADER -->
      <div class="sticky top-0 bg-slate-950 z-20 p-4 border-b border-slate-800 flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <a routerLink="/" class="text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </a>
          <h1 class="text-xl font-bold text-slate-200">{{ ts.get('quiz.title') }}</h1>
        </div>
        
        @if (isStarted() && !showResult() && currentMode === 'PRACTICE') {
          <div class="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 font-mono text-lg font-bold" 
               [class.text-red-500]="remainingSeconds() < 60" 
               [class.text-blue-400]="remainingSeconds() >= 60">
            ⏱️ {{ formatTime(remainingSeconds()) }}
          </div>
        }

        @if (isStarted() && currentMode === 'EXAM') {
          <div class="flex items-center gap-3">
            <div class="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 font-mono text-lg font-bold"
                 [class.text-red-500]="remainingSeconds() < 300"
                 [class.text-blue-400]="remainingSeconds() >= 300">
              ⏱️ {{ formatTime(remainingSeconds()) }}
            </div>
            <button (click)="showSubmitConfirm.set(true)"
              class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full text-sm transition shadow-lg shadow-emerald-900/30">
              Kirim Jawaban
            </button>
          </div>
        }
      </div>

      <div class="p-4">

        <!-- ===== MENU UTAMA ===== -->
        @if (!isStarted() && !showExamResult()) {
          <div class="space-y-8 mt-2 animate-in slide-in-from-bottom-4 duration-500">
            
            <div>
              <h3 class="text-slate-400 text-sm font-bold uppercase tracking-wider mb-3 pl-1">Latihan Dasar</h3>
              <div class="grid grid-cols-1 gap-3">
                
                <button (click)="openKanaSelection()" class="flex items-center p-4 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-slate-700 transition group text-left">
                  <div class="w-12 h-12 rounded-lg bg-rose-900/30 flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform">あ</div>
                  <div class="flex-1">
                    <div class="font-bold text-rose-400">Latihan Kana</div>
                    <div class="text-xs text-slate-500">Hafalan Hiragana & Katakana</div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs text-slate-500">Hiragana</div>
                    <div class="text-xs font-bold text-rose-400">{{ menuCounts['KANA_HIRAGANA'] }} soal</div>
                    <div class="text-xs text-slate-500 mt-0.5">Katakana</div>
                    <div class="text-xs font-bold text-rose-400">{{ menuCounts['KANA_KATAKANA'] }} soal</div>
                  </div>
                </button>

                <button (click)="openLevelSelection('KANJI')" class="flex items-center p-4 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-slate-700 transition group text-left">
                  <div class="w-12 h-12 rounded-lg bg-blue-900/30 flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform">字</div>
                  <div class="flex-1">
                    <div class="font-bold text-blue-400">Latihan Kanji</div>
                    <div class="text-xs text-slate-500">Bacaan Onyomi & Kunyomi (N5 - N1)</div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs font-bold text-blue-400">{{ menuCounts['KANJI_TOTAL'] }} soal</div>
                    <div class="text-xs text-slate-500">N5~N1</div>
                  </div>
                </button>
                
                <button (click)="openLevelSelection('VOCAB')" class="flex items-center p-4 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-slate-700 transition group text-left">
                  <div class="w-12 h-12 rounded-lg bg-cyan-900/30 flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform">単</div>
                  <div class="flex-1">
                    <div class="font-bold text-cyan-400">Latihan Kosakata</div>
                    <div class="text-xs text-slate-500">Arti kata & penggunaan (N5 - N1)</div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs font-bold text-cyan-400">{{ menuCounts['VOCAB_TOTAL'] }} soal</div>
                    <div class="text-xs text-slate-500">N5~N1</div>
                  </div>
                </button>
                
                <button (click)="openLevelSelection('PARTICLE')" class="flex items-center p-4 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-slate-700 transition group text-left">
                  <div class="w-12 h-12 rounded-lg bg-amber-900/30 flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform">は</div>
                  <div class="flex-1">
                    <div class="font-bold text-amber-400">{{ ts.get('quiz.menu.particle') }}</div>
                    <div class="text-xs text-slate-500">{{ ts.get('quiz.menu.particle_desc') }} (N5 - N1)</div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs font-bold text-amber-400">{{ menuCounts['PARTICLE_TOTAL'] }} soal</div>
                    <div class="text-xs text-slate-500">N5~N1</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <h3 class="text-slate-400 text-sm font-bold uppercase tracking-wider mb-3 pl-1">Simulasi Ujian & Kalimat</h3>
              <div class="grid grid-cols-1 gap-3">

                <!-- JLPT N5 -->
                <button (click)="openModeSelection('JLPT_N5')" class="relative overflow-hidden p-4 bg-slate-900 border border-amber-600/50 rounded-xl hover:bg-slate-800 transition group text-left">
                  <div class="absolute top-0 right-0 bg-amber-600 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">SIMULASI</div>
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-lg bg-amber-900/20 border border-amber-600/30 flex items-center justify-center text-xl font-bold text-amber-500 mr-4 group-hover:scale-110 transition-transform">N5</div>
                    <div class="flex-1">
                      <div class="font-bold text-amber-400">JLPT N5</div>
                      <div class="text-xs text-slate-500">Format soal asli 90% mirip</div>
                    </div>
                    <div class="text-right mr-6">
                      <div class="text-xs font-bold text-amber-400">{{ menuCounts['JLPT_N5'] }} soal</div>
                    </div>
                  </div>
                </button>

                <!-- JLPT N4 -->
                <button (click)="openModeSelection('JLPT_N4')" class="relative overflow-hidden p-4 bg-slate-900 border border-amber-500/50 rounded-xl hover:bg-slate-800 transition group text-left">
                  <div class="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">SIMULASI</div>
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-lg bg-amber-800/20 border border-amber-500/30 flex items-center justify-center text-xl font-bold text-amber-400 mr-4 group-hover:scale-110 transition-transform">N4</div>
                    <div class="flex-1">
                      <div class="font-bold text-amber-400">JLPT N4</div>
                      <div class="text-xs text-slate-500">Tingkat dasar lanjut</div>
                    </div>
                    <div class="text-right mr-6">
                      <div class="text-xs font-bold text-amber-400">{{ menuCounts['JLPT_N4'] }} soal</div>
                    </div>
                  </div>
                </button>

                <!-- JLPT N3 -->
                <button (click)="openModeSelection('JLPT_N3')" class="relative overflow-hidden p-4 bg-slate-900 border border-yellow-500/50 rounded-xl hover:bg-slate-800 transition group text-left">
                  <div class="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">SIMULASI</div>
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-lg bg-yellow-900/20 border border-yellow-500/30 flex items-center justify-center text-xl font-bold text-yellow-500 mr-4 group-hover:scale-110 transition-transform">N3</div>
                    <div class="flex-1">
                      <div class="font-bold text-yellow-400">JLPT N3</div>
                      <div class="text-xs text-slate-500">Tingkat menengah (Intermediate)</div>
                    </div>
                    <div class="text-right mr-6">
                      <div class="text-xs font-bold text-yellow-400">{{ menuCounts['JLPT_N3'] }} soal</div>
                    </div>
                  </div>
                </button>

                <!-- JLPT N2 -->
                <button (click)="openModeSelection('JLPT_N2')" class="relative overflow-hidden p-4 bg-slate-900 border border-orange-500/50 rounded-xl hover:bg-slate-800 transition group text-left">
                  <div class="absolute top-0 right-0 bg-orange-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">SIMULASI</div>
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-lg bg-orange-900/20 border border-orange-500/30 flex items-center justify-center text-xl font-bold text-orange-500 mr-4 group-hover:scale-110 transition-transform">N2</div>
                    <div class="flex-1">
                      <div class="font-bold text-orange-400">JLPT N2</div>
                      <div class="text-xs text-slate-500">Tingkat menengah atas</div>
                    </div>
                    <div class="text-right mr-6">
                      <div class="text-xs font-bold text-orange-400">{{ menuCounts['JLPT_N2'] }} soal</div>
                    </div>
                  </div>
                </button>

                <!-- JLPT N1 -->
                <button (click)="openModeSelection('JLPT_N1')" class="relative overflow-hidden p-4 bg-slate-900 border border-red-500/50 rounded-xl hover:bg-slate-800 transition group text-left">
                  <div class="absolute top-0 right-0 bg-red-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">SIMULASI</div>
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-lg bg-red-900/20 border border-red-500/30 flex items-center justify-center text-xl font-bold text-red-500 mr-4 group-hover:scale-110 transition-transform">N1</div>
                    <div class="flex-1">
                      <div class="font-bold text-red-400">JLPT N1</div>
                      <div class="text-xs text-slate-500">Tingkat mahir (Advanced)</div>
                    </div>
                    <div class="text-right mr-6">
                      <div class="text-xs font-bold text-red-400">{{ menuCounts['JLPT_N1'] }} soal</div>
                    </div>
                  </div>
                </button>

                <!-- JFT A2 -->
                <button (click)="openModeSelection('JFT_A2')" class="relative overflow-hidden p-4 bg-slate-900 border border-emerald-600/50 rounded-xl hover:bg-slate-800 transition group text-left mt-2">
                  <div class="absolute top-0 right-0 bg-emerald-600 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">JFT</div>
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-lg bg-emerald-900/20 border border-emerald-600/30 flex items-center justify-center text-xl font-bold text-emerald-500 mr-4 group-hover:scale-110 transition-transform">A2</div>
                    <div class="flex-1">
                      <div class="font-bold text-emerald-400">JFT Basic A2</div>
                      <div class="text-xs text-slate-500">Ujian hidup & kerja (Tokutei)</div>
                    </div>
                    <div class="text-right mr-6">
                      <div class="text-xs font-bold text-emerald-400">{{ menuCounts['JFT_A2'] }} soal</div>
                    </div>
                  </div>
                </button>

                <!-- JFT Intermediate -->
                <button (click)="openModeSelection('JFT_INTERMEDIATE')" class="relative overflow-hidden p-4 bg-slate-900 border border-teal-600/50 rounded-xl hover:bg-slate-800 transition group text-left">
                  <div class="absolute top-0 right-0 bg-teal-600 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">JFT</div>
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-lg bg-teal-900/20 border border-teal-600/30 flex items-center justify-center text-xl font-bold text-teal-500 mr-4 group-hover:scale-110 transition-transform">B1</div>
                    <div class="flex-1">
                      <div class="font-bold text-teal-400">JFT Intermediate</div>
                      <div class="text-xs text-slate-500">Tingkat Menengah</div>
                    </div>
                    <div class="text-right mr-6">
                      <div class="text-xs font-bold text-teal-400">{{ menuCounts['JFT_INTERMEDIATE'] }} soal</div>
                    </div>
                  </div>
                </button>

                <!-- JFT Advanced -->
                <button (click)="openModeSelection('JFT_ADVANCED')" class="relative overflow-hidden p-4 bg-slate-900 border border-cyan-600/50 rounded-xl hover:bg-slate-800 transition group text-left">
                  <div class="absolute top-0 right-0 bg-cyan-600 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">JFT</div>
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-lg bg-cyan-900/20 border border-cyan-600/30 flex items-center justify-center text-xl font-bold text-cyan-500 mr-4 group-hover:scale-110 transition-transform">B2</div>
                    <div class="flex-1">
                      <div class="font-bold text-cyan-400">JFT Advanced</div>
                      <div class="text-xs text-slate-500">Tingkat Mahir</div>
                    </div>
                    <div class="text-right mr-6">
                      <div class="text-xs font-bold text-cyan-400">{{ menuCounts['JFT_ADVANCED'] }} soal</div>
                    </div>
                  </div>
                </button>

                <!-- Latihan Kalimat -->
                <button (click)="openConfig('SENTENCE')" class="flex items-center p-4 bg-slate-900 border border-purple-800 rounded-xl hover:bg-slate-800 hover:border-purple-600 transition group text-left mt-2">
                  <div class="w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform">✍️</div>
                  <div class="flex-1">
                    <div class="font-bold text-purple-400">Latihan Kalimat (Essay)</div>
                    <div class="text-xs text-slate-500">Terjemahan JP ↔ ID (Ketik)</div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs font-bold text-purple-400">{{ menuCounts['SENTENCE'] }} soal</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- MODAL: Pilih Mode (Simulasi / Latihan) -->
          @if (showModeSelectionModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" (click)="showModeSelectionModal.set(false)"></div>
              <div class="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
                <div class="text-center mb-6">
                  <div class="text-3xl mb-2">📋</div>
                  <h3 class="text-xl font-bold text-white mb-1">Pilih Mode</h3>
                  <p class="text-slate-400 text-xs">Pilih cara belajarmu</p>
                </div>
                <div class="grid grid-cols-1 gap-4">
                  <!-- Simulasi Ujian -->
                  <button (click)="startExamMode()" 
                    class="p-5 bg-gradient-to-br from-amber-900/40 to-amber-800/20 border border-amber-600/60 rounded-xl hover:border-amber-500 transition group text-left">
                    <div class="flex items-center gap-3 mb-2">
                      <div class="w-10 h-10 rounded-lg bg-amber-600/30 flex items-center justify-center text-xl">🏛️</div>
                      <div class="font-bold text-amber-400 text-lg">Simulasi Ujian</div>
                    </div>
                    <div class="text-xs text-slate-400 leading-relaxed">
                      60 soal • 90 menit • Format asli ujian<br>
                      5 soal per halaman • Kirim saat selesai
                    </div>
                  </button>
                  <!-- Latihan Soal -->
                  <button (click)="openConfig(pendingExamType)"
                    class="p-5 bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-600/60 rounded-xl hover:border-blue-500 transition group text-left">
                    <div class="flex items-center gap-3 mb-2">
                      <div class="w-10 h-10 rounded-lg bg-blue-600/30 flex items-center justify-center text-xl">📝</div>
                      <div class="font-bold text-blue-400 text-lg">Latihan Soal</div>
                    </div>
                    <div class="text-xs text-slate-400 leading-relaxed">
                      Pilih jumlah soal & durasi<br>
                      Feedback langsung setiap soal
                    </div>
                  </button>
                </div>
                <button (click)="showModeSelectionModal.set(false)" class="mt-5 w-full py-3 text-slate-500 font-bold hover:text-slate-300">Batal</button>
              </div>
            </div>
          }

          <!-- MODAL: Pilih Kana -->
          @if (showKanaSelectionModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" (click)="showKanaSelectionModal.set(false)"></div>
              <div class="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
                <div class="text-center mb-6">
                  <h3 class="text-xl font-bold text-white mb-1">Pilih Jenis Soal Kana</h3>
                  <p class="text-slate-400 text-xs">Pilih huruf yang ingin dilatih</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <button (click)="selectKanaQuiz('KANA_HIRAGANA')" class="p-6 bg-slate-800 border border-slate-600 rounded-xl hover:bg-slate-700 hover:border-rose-500 transition group">
                    <div class="text-4xl text-rose-400 font-bold mb-2 group-hover:scale-110 transition-transform">あ</div>
                    <div class="text-sm font-bold text-white">Hiragana</div>
                    <div class="text-xs text-slate-500 mt-1">{{ menuCounts['KANA_HIRAGANA'] }} soal</div>
                  </button>
                  <button (click)="selectKanaQuiz('KANA_KATAKANA')" class="p-6 bg-slate-800 border border-slate-600 rounded-xl hover:bg-slate-700 hover:border-blue-500 transition group">
                    <div class="text-4xl text-blue-400 font-bold mb-2 group-hover:scale-110 transition-transform">ア</div>
                    <div class="text-sm font-bold text-white">Katakana</div>
                    <div class="text-xs text-slate-500 mt-1">{{ menuCounts['KANA_KATAKANA'] }} soal</div>
                  </button>
                </div>
                <button (click)="showKanaSelectionModal.set(false)" class="mt-6 w-full py-3 text-slate-500 font-bold hover:text-slate-300">Batal</button>
              </div>
            </div>
          }

          <!-- MODAL: Pilih Level -->
          @if (showLevelSelectionModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" (click)="showLevelSelectionModal.set(false)"></div>
              <div class="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
                <div class="text-center mb-6">
                  <h3 class="text-xl font-bold text-white mb-1">Pilih Level JLPT</h3>
                  <p class="text-slate-400 text-xs">Tentukan level latihanmu</p>
                </div>
                <div class="grid grid-cols-1 gap-2">
                  <button (click)="selectLevel('N5')" class="py-3 px-4 bg-slate-800 border border-slate-600 rounded-xl hover:bg-slate-700 hover:border-amber-500 transition flex justify-between items-center">
                    <span class="text-white font-bold">Level N5</span>
                    <span class="text-xs text-amber-400 font-bold">{{ menuCounts[pendingBaseQuizType + '_N5'] || 0 }} soal</span>
                  </button>
                  <button (click)="selectLevel('N4')" class="py-3 px-4 bg-slate-800 border border-slate-600 rounded-xl hover:bg-slate-700 hover:border-amber-400 transition flex justify-between items-center">
                    <span class="text-white font-bold">Level N4</span>
                    <span class="text-xs text-amber-400 font-bold">{{ menuCounts[pendingBaseQuizType + '_N4'] || 0 }} soal</span>
                  </button>
                  <button (click)="selectLevel('N3')" class="py-3 px-4 bg-slate-800 border border-slate-600 rounded-xl hover:bg-slate-700 hover:border-yellow-400 transition flex justify-between items-center">
                    <span class="text-white font-bold">Level N3</span>
                    <span class="text-xs text-yellow-400 font-bold">{{ menuCounts[pendingBaseQuizType + '_N3'] || 0 }} soal</span>
                  </button>
                  <button (click)="selectLevel('N2')" class="py-3 px-4 bg-slate-800 border border-slate-600 rounded-xl hover:bg-slate-700 hover:border-orange-400 transition flex justify-between items-center">
                    <span class="text-white font-bold">Level N2</span>
                    <span class="text-xs text-orange-400 font-bold">{{ menuCounts[pendingBaseQuizType + '_N2'] || 0 }} soal</span>
                  </button>
                  <button (click)="selectLevel('N1')" class="py-3 px-4 bg-slate-800 border border-slate-600 rounded-xl hover:bg-slate-700 hover:border-red-400 transition flex justify-between items-center">
                    <span class="text-white font-bold">Level N1</span>
                    <span class="text-xs text-red-400 font-bold">{{ menuCounts[pendingBaseQuizType + '_N1'] || 0 }} soal</span>
                  </button>
                </div>
                <button (click)="showLevelSelectionModal.set(false)" class="mt-4 w-full py-3 text-slate-500 font-bold hover:text-slate-300">Batal</button>
              </div>
            </div>
          }

          <!-- MODAL: Config Latihan -->
          @if (showConfigModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" (click)="showConfigModal.set(false)"></div>
              <div class="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
                <div class="text-center mb-6">
                  <h3 class="text-xl font-bold text-white mb-1">Pengaturan Kuis</h3>
                  <p class="text-slate-400 text-xs">Sesuaikan latihanmu</p>
                </div>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">Waktu (Menit)</label>
                    <input type="number" min="1" max="500" [(ngModel)]="configDuration" 
                      class="block w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-center font-bold text-lg">
                    <div class="text-[10px] text-slate-500 mt-1 text-right">Maks: 500 menit</div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">Jumlah Soal</label>
                    <input type="number" min="1" max="500" [(ngModel)]="configQuestionCount" 
                      class="block w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-center font-bold text-lg">
                    <div class="text-[10px] text-slate-500 mt-1 text-right">
                      Tersedia: <span class="text-blue-400 font-bold">{{ availableQuestionCount }}</span> soal
                    </div>
                  </div>
                </div>
                <div class="mt-8 flex gap-3">
                  <button (click)="showConfigModal.set(false)" class="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 border border-slate-700 transition">Batal</button>
                  <button (click)="proceedToQuiz()" class="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-900/30 transition">Mulai</button>
                </div>
              </div>
            </div>
          }
        }

        <!-- ===== MODE LATIHAN (PRACTICE) ===== -->
        @if (isStarted() && currentMode === 'PRACTICE') {
          @if (currentQuestion()) {
            <div class="mt-4 max-w-lg mx-auto animate-in fade-in duration-300">
              <div class="flex justify-between text-sm text-slate-500 mb-2">
                <span>Soal {{currentIndex() + 1}} / {{questions().length}}</span>
                <span>Skor: <span class="text-green-400 font-bold">{{score()}}</span></span>
              </div>
              <div class="h-1.5 bg-slate-800 rounded-full mb-8 overflow-hidden">
                <div class="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out" [style.width.%]="((currentIndex() + 1) / questions().length) * 100"></div>
              </div>

              <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 min-h-[160px] flex flex-col items-center justify-center mb-6 text-center relative shadow-lg">
                <div class="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {{ getQuizLabel(currentQuestion()!.type) }}
                </div>

                <button (click)="toggleRomaji()" 
                  class="absolute top-3 right-3 px-3 py-1.5 rounded-lg border border-slate-700 font-bold text-xs transition-all z-10"
                  [class.bg-amber-900_20]="showRomaji()"
                  [class.text-amber-400]="showRomaji()"
                  [class.border-amber-500_50]="showRomaji()"
                  [class.bg-slate-800]="!showRomaji()"
                  [class.text-slate-400]="!showRomaji()">
                  あ/A
                </button>
                
                <div class="flex items-center gap-2 mb-2 w-full justify-center relative">
                  <h2 class="text-xl md:text-2xl font-bold text-white leading-relaxed whitespace-pre-line">{{ currentQuestion()?.q }}</h2>
                  <button (click)="speakQuestion()" class="p-2 rounded-full bg-slate-800 text-blue-400 hover:bg-slate-700 transition absolute right-[-40px]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 2.485.519 4.952 1.848 6.595.342 1.241 1.519 1.905 2.66 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                    </svg>
                  </button>
                </div>

                @if (showRomaji()) {
                  <div class="mt-4 text-amber-400/80 font-mono text-sm leading-relaxed border-t border-slate-800/50 pt-2 animate-in fade-in w-full">
                    {{ currentQuestion()?.q_romaji ? currentQuestion()?.q_romaji : ((currentQuestion()?.q || '') | kanaToRomaji) }}
                  </div>
                }
              </div>

              @if (currentQuestion()?.inputType === 'CHOICE') {
                <div class="grid grid-cols-1 gap-3">
                  @for (opt of currentQuestion()?.options; track opt; let i = $index) {
                    <button 
                      (click)="answerChoice(i)"
                      [disabled]="showResult()"
                      class="p-4 rounded-xl font-medium text-left transition-all border relative overflow-hidden group"
                      [class]="getOptionClass(i)">
                      <div class="flex items-start w-full">
                        <span class="inline-block w-6 h-6 rounded-full bg-slate-950/50 text-center leading-6 text-xs mr-3 border border-slate-700 text-slate-400 shrink-0 mt-0.5">{{ ['A','B','C','D'][i] }}</span>
                        <div class="flex-1 pr-6">
                          <div class="text-lg leading-relaxed">{{ opt }}</div>
                          @if (showRomaji()) {
                            <div class="text-amber-400/80 font-mono text-xs mt-1 animate-in fade-in">{{ opt | kanaToRomaji }}</div>
                          }
                        </div>
                        <div class="absolute right-3 top-3 z-10" *ngIf="!showResult()">
                          <button (click)="$event.stopPropagation(); tts.speak(opt, 'id-ID')" class="p-1.5 rounded-full text-slate-500 hover:text-blue-400 hover:bg-slate-800 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 2.485.519 4.952 1.848 6.595.342 1.241 1.519 1.905 2.66 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      @if (showResult()) {
                        @if (i === currentQuestion()!.correct) {
                          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 font-bold text-xl">✓</span>
                        }
                        @if (i === selectedAnswer() && i !== currentQuestion()!.correct) {
                          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 font-bold text-xl">✕</span>
                        }
                      }
                    </button>
                  }
                </div>
              } @else {
                <div class="flex flex-col gap-4">
                  <input 
                    type="text" 
                    [(ngModel)]="essayAnswer" 
                    [disabled]="showResult()"
                    (keyup.enter)="!showResult() ? checkEssay() : null"
                    class="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition text-center text-lg"
                    placeholder="Ketik jawaban di sini..."
                    autocomplete="off"/>
                  @if (!showResult()) {
                    <button (click)="checkEssay()" [disabled]="!essayAnswer.trim()"
                      class="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-900/20">
                      Jawab
                    </button>
                  } @else {
                    <div class="p-4 rounded-xl border text-center" 
                      [class]="isEssayCorrect ? 'bg-green-900/20 border-green-900 text-green-400' : 'bg-red-900/20 border-red-900 text-red-400'">
                      <div class="font-bold text-lg mb-1">{{ isEssayCorrect ? 'Benar!' : 'Kurang Tepat' }}</div>
                      @if (!isEssayCorrect) {
                        <div class="text-sm text-slate-400">Jawaban yang benar:</div>
                        <div class="text-white font-bold">{{ currentQuestion()?.correctAnswers?.[0] }}</div>
                      }
                    </div>
                  }
                </div>
              }

              @if (showResult()) {
                <div class="mt-6 animate-in fade-in slide-in-from-bottom-2">
                  @if (currentQuestion()?.explanation) {
                    <div class="mb-4 p-4 bg-slate-800/80 rounded-xl text-sm text-slate-300 border border-slate-700/50 shadow-sm">
                      <div class="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2">
                        <span class="text-lg">💡</span>
                        <span class="font-bold text-blue-400 uppercase tracking-wider text-xs">Pembahasan Detail</span>
                      </div>
                      <div class="whitespace-pre-wrap leading-relaxed opacity-90 text-left">{{ currentQuestion()?.explanation }}</div>
                    </div>
                  }
                  <div class="flex justify-center">
                    <button (click)="next()" class="px-8 py-3 bg-white text-slate-950 font-bold rounded-full hover:bg-slate-200 transition shadow-lg hover:scale-105 active:scale-95">
                      {{ currentIndex() < questions().length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil 🏆' }}
                    </button>
                  </div>
                </div>
              }
            </div>
          } @else {
            <!-- Hasil Latihan -->
            <div class="text-center mt-12 space-y-6 px-4 animate-in zoom-in duration-300">
              <div class="text-7xl mb-4 filter drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                {{ score() > questions().length / 2 ? '🏆' : '💪' }}
              </div>
              <div>
                <h2 class="text-3xl font-bold text-white mb-2">Selesai!</h2>
                <p class="text-slate-400">{{ timeIsUp ? 'Waktu habis.' : 'Kamu telah menyelesaikan sesi ini.' }}</p>
              </div>
              <div class="py-6 bg-slate-900 rounded-2xl border border-slate-800 max-w-xs mx-auto">
                <div class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-1">Skor Akhir</div>
                <div class="text-5xl font-black" [class]="getScoreColor()">
                  {{score()}} <span class="text-2xl text-slate-600 font-medium">/ {{questions().length}}</span>
                </div>
              </div>
              <button (click)="resetToMenu()" class="w-full max-w-xs py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition shadow-lg shadow-blue-900/20">
                Kembali ke Menu
              </button>
            </div>
          }
        }

        <!-- ===== MODE SIMULASI UJIAN (EXAM) ===== -->
        @if (isStarted() && currentMode === 'EXAM') {
          <div class="mt-4 max-w-2xl mx-auto">
            <!-- Progress Bar & Info -->
            <div class="flex justify-between items-center text-sm text-slate-500 mb-3">
              <span class="font-bold text-slate-300">
                Halaman <span class="text-blue-400">{{ examCurrentPage() + 1 }}</span> / {{ examTotalPages() }}
              </span>
              <span>
                Terjawab: 
                <span class="font-bold" [class.text-green-400]="examAnsweredCount() === questions().length" [class.text-yellow-400]="examAnsweredCount() < questions().length">
                  {{ examAnsweredCount() }} / {{ questions().length }}
                </span>
              </span>
            </div>

            <!-- Page indicator dots -->
            <div class="flex gap-1.5 mb-5 flex-wrap">
              @for (page of examPageArray(); track page; let pi = $index) {
                <button (click)="goToExamPage(pi)"
                  class="h-2 rounded-full transition-all"
                  [style.width.px]="pi === examCurrentPage() ? 24 : 8"
                  [class.bg-blue-500]="pi === examCurrentPage()"
                  [class.bg-green-500]="pi !== examCurrentPage() && isPageFullyAnswered(pi)"
                  [class.bg-slate-700]="pi !== examCurrentPage() && !isPageFullyAnswered(pi)">
                </button>
              }
            </div>

            <!-- Soal per halaman (5 soal) -->
            <div class="space-y-6">
              @for (qItem of currentPageQuestions(); track qItem.q; let qi = $index) {
                @let globalIdx = examCurrentPage() * examPageSize + qi;
                <div class="bg-slate-900 border rounded-2xl overflow-hidden shadow-lg transition-all"
                     [class.border-green-700]="examAnswers()[globalIdx] !== undefined && examAnswers()[globalIdx] !== null"
                     [class.border-slate-800]="examAnswers()[globalIdx] === undefined || examAnswers()[globalIdx] === null">
                  <!-- Nomor soal -->
                  <div class="px-5 pt-4 pb-2 border-b border-slate-800 flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Soal {{ globalIdx + 1 }}</span>
                    @if (examAnswers()[globalIdx] !== undefined && examAnswers()[globalIdx] !== null) {
                      <span class="text-xs text-green-400 font-bold">✓ Terjawab</span>
                    } @else {
                      <span class="text-xs text-slate-600 font-bold">Belum dijawab</span>
                    }
                  </div>
                  <!-- Pertanyaan -->
                  <div class="px-5 py-4">
                    <p class="text-white font-medium leading-relaxed whitespace-pre-line mb-4">{{ qItem.q }}</p>
                    <!-- Pilihan jawaban -->
                    <div class="grid grid-cols-1 gap-2">
                      @for (opt of qItem.options; track opt; let oi = $index) {
                        <button (click)="selectExamAnswer(globalIdx, oi)"
                          class="flex items-center gap-3 p-3 rounded-xl border text-left transition-all"
                          [class.bg-blue-900\/30]="examAnswers()[globalIdx] === oi"
                          [class.border-blue-500]="examAnswers()[globalIdx] === oi"
                          [class.text-blue-300]="examAnswers()[globalIdx] === oi"
                          [class.bg-slate-800]="examAnswers()[globalIdx] !== oi"
                          [class.border-slate-700]="examAnswers()[globalIdx] !== oi"
                          [class.text-slate-300]="examAnswers()[globalIdx] !== oi"
                          [class.hover\:border-slate-500]="examAnswers()[globalIdx] !== oi">
                          <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all"
                            [class.bg-blue-600]="examAnswers()[globalIdx] === oi"
                            [class.text-white]="examAnswers()[globalIdx] === oi"
                            [class.bg-slate-700]="examAnswers()[globalIdx] !== oi"
                            [class.text-slate-400]="examAnswers()[globalIdx] !== oi">
                            {{ ['A','B','C','D'][oi] }}
                          </span>
                          <span class="text-sm leading-relaxed">{{ opt }}</span>
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Navigasi Halaman -->
            <div class="flex justify-between items-center mt-8 gap-4">
              <button (click)="prevExamPage()" [disabled]="examCurrentPage() === 0"
                class="flex items-center gap-2 px-5 py-3 bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-xl hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Sebelumnya
              </button>

              @if (examCurrentPage() < examTotalPages() - 1) {
                <button (click)="nextExamPage()"
                  class="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition shadow-lg shadow-blue-900/30">
                  Selanjutnya
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              } @else {
                <button (click)="showSubmitConfirm.set(true)"
                  class="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/30">
                  Kirim Jawaban 📤
                </button>
              }
            </div>
          </div>
        }

        <!-- ===== HASIL SIMULASI UJIAN ===== -->
        @if (showExamResult()) {
          <div class="mt-4 max-w-2xl mx-auto animate-in fade-in duration-300">
            <div class="text-center mb-8">
              <div class="text-6xl mb-3 filter drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                {{ examScore() >= 48 ? '🏆' : examScore() >= 30 ? '📝' : '💪' }}
              </div>
              <h2 class="text-3xl font-bold text-white mb-1">Ujian Selesai!</h2>
              <p class="text-slate-400 text-sm">{{ examTimedOut ? 'Waktu habis.' : 'Jawaban berhasil dikirim.' }}</p>
            </div>

            <!-- Score Card -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 text-center shadow-xl">
              <div class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-2">Nilai Ujian</div>
              <div class="text-6xl font-black mb-2" 
                   [class.text-green-400]="examScore() / questions().length >= 0.8"
                   [class.text-yellow-400]="examScore() / questions().length >= 0.5 && examScore() / questions().length < 0.8"
                   [class.text-red-400]="examScore() / questions().length < 0.5">
                {{ examScore() }} <span class="text-2xl text-slate-600 font-medium">/ {{ questions().length }}</span>
              </div>
              <div class="text-slate-500 text-sm">
                {{ examScore() >= questions().length * 0.8 ? '🌟 Lulus dengan nilai tinggi!' : examScore() >= questions().length * 0.6 ? '👍 Lulus!' : '📚 Perlu belajar lebih giat.' }}
              </div>
              <!-- Stats -->
              <div class="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-800">
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-400">{{ examScore() }}</div>
                  <div class="text-xs text-slate-500 mt-0.5">Benar</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-red-400">{{ questions().length - examScore() }}</div>
                  <div class="text-xs text-slate-500 mt-0.5">Salah</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-400">{{ Math.round((examScore() / questions().length) * 100) }}%</div>
                  <div class="text-xs text-slate-500 mt-0.5">Akurasi</div>
                </div>
              </div>
            </div>

            <!-- Tombol Preview Jawaban & Kembali -->
            <div class="flex gap-3 mb-6">
              <button (click)="toggleExamReview()" 
                class="flex-1 py-3 font-bold rounded-xl border transition"
                [class.bg-blue-600]="showExamReview()"
                [class.text-white]="showExamReview()"
                [class.border-blue-600]="showExamReview()"
                [class.bg-slate-800]="!showExamReview()"
                [class.text-slate-300]="!showExamReview()"
                [class.border-slate-700]="!showExamReview()">
                {{ showExamReview() ? '🙈 Sembunyikan' : '🔍 Preview Jawaban' }}
              </button>
              <button (click)="resetToMenu()" class="flex-1 py-3 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 border border-slate-600 transition">
                ← Kembali
              </button>
            </div>

            <!-- Review Detail Jawaban -->
            @if (showExamReview()) {
              <div class="space-y-5 animate-in fade-in duration-300">
                @for (q of questions(); track q.q; let i = $index) {
                  @let isCorrect = examAnswers()[i] === q.correct;
                  <div class="bg-slate-900 rounded-2xl border overflow-hidden shadow-lg"
                       [class.border-green-700]="isCorrect"
                       [class.border-red-800]="!isCorrect">
                    <div class="px-5 pt-4 pb-2 border-b flex items-center justify-between"
                         [class.border-green-900]="isCorrect"
                         [class.border-red-900]="!isCorrect">
                      <span class="text-sm font-bold" [class.text-green-400]="isCorrect" [class.text-red-400]="!isCorrect">
                        {{ isCorrect ? '✓ Benar' : '✕ Salah' }} — Soal {{ i + 1 }}
                      </span>
                    </div>
                    <div class="px-5 py-4">
                      <p class="text-white text-sm leading-relaxed whitespace-pre-line mb-3">{{ q.q }}</p>
                      <div class="space-y-2">
                        @for (opt of q.options; track opt; let oi = $index) {
                          <div class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                               [class.bg-green-900\/30]="oi === q.correct"
                               [class.text-green-300]="oi === q.correct"
                               [class.border]="oi === q.correct || (oi === examAnswers()[i] && !isCorrect)"
                               [class.border-green-600]="oi === q.correct"
                               [class.bg-red-900\/30]="oi === examAnswers()[i] && !isCorrect"
                               [class.text-red-300]="oi === examAnswers()[i] && !isCorrect"
                               [class.border-red-600]="oi === examAnswers()[i] && !isCorrect"
                               [class.text-slate-500]="oi !== q.correct && oi !== examAnswers()[i]">
                            <span class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                  [class.bg-green-600]="oi === q.correct"
                                  [class.text-white]="oi === q.correct || (oi === examAnswers()[i] && !isCorrect)"
                                  [class.bg-red-600]="oi === examAnswers()[i] && !isCorrect"
                                  [class.bg-slate-700]="oi !== q.correct && oi !== examAnswers()[i]">
                              {{ ['A','B','C','D'][oi] }}
                            </span>
                            <span>{{ opt }}</span>
                            @if (oi === q.correct) { <span class="ml-auto text-xs font-bold text-green-500">✓ Benar</span> }
                            @if (oi === examAnswers()[i] && !isCorrect) { <span class="ml-auto text-xs font-bold text-red-500">Pilihan Anda</span> }
                          </div>
                        }
                      </div>
                      @if (q.explanation) {
                        <div class="mt-3 p-3 bg-slate-800/60 rounded-xl text-xs text-slate-400 border border-slate-700/50">
                          <span class="text-blue-400 font-bold">💡 Pembahasan: </span>
                          {{ q.explanation }}
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }

      </div>

      <!-- ===== MODAL: Konfirmasi Submit Ujian ===== -->
      @if (showSubmitConfirm()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <div class="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
            <div class="text-center mb-5">
              <div class="text-4xl mb-3">📤</div>
              <h3 class="text-xl font-bold text-white mb-2">Kirim Jawaban?</h3>
              <p class="text-slate-400 text-sm leading-relaxed">
                Apakah anda ingin mengirimkan soal ini? Apakah sudah terjawab semua tanpa ada soal yang kosong/terlewat?
              </p>
            </div>

            <!-- Status jawaban -->
            <div class="bg-slate-800 rounded-xl p-4 mb-5 border border-slate-700">
              <div class="flex justify-between text-sm mb-2">
                <span class="text-slate-400">Soal terjawab:</span>
                <span class="font-bold" [class.text-green-400]="examAnsweredCount() === questions().length" [class.text-yellow-400]="examAnsweredCount() < questions().length">
                  {{ examAnsweredCount() }} / {{ questions().length }}
                </span>
              </div>
              @if (examAnsweredCount() < questions().length) {
                <div class="text-xs text-yellow-400 flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>{{ questions().length - examAnsweredCount() }} soal belum terjawab!</span>
                </div>
              } @else {
                <div class="text-xs text-green-400 flex items-center gap-1.5">
                  <span>✅</span>
                  <span>Semua soal telah terjawab.</span>
                </div>
              }
            </div>

            <div class="flex gap-3">
              <button (click)="showSubmitConfirm.set(false)" class="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 border border-slate-700 transition">
                Kembali
              </button>
              <button (click)="submitExam()" class="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-900/30 transition">
                Ya, Kirim!
              </button>
            </div>
          </div>
        </div>
      }

      <!-- ===== MODAL: Loading Submit ===== -->
      @if (showSubmitLoading()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div class="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
          <div class="relative text-center">
            <div class="relative w-20 h-20 mx-auto mb-5">
              <div class="absolute inset-0 rounded-full border-4 border-slate-700"></div>
              <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin"></div>
              <div class="absolute inset-0 flex items-center justify-center text-2xl">📤</div>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Mengirim Jawaban...</h3>
            <p class="text-slate-400 text-sm">Mohon tunggu sebentar</p>
          </div>
        </div>
      }

    </div>
  `
})
export class QuizComponent implements OnDestroy, OnInit {
  dataService = inject(JapaneseDataService);
  soalService = inject(SoalService);
  ts = inject(TranslationService);
  tts = inject(TtsService);

  Math = Math;

  // ---- MODAL SIGNALS ----
  showConfigModal = signal(false);
  showKanaSelectionModal = signal(false);
  showLevelSelectionModal = signal(false);
  showModeSelectionModal = signal(false);
  showSubmitConfirm = signal(false);
  showSubmitLoading = signal(false);
  showExamResult = signal(false);
  showExamReview = signal(false);

  // ---- CONFIG ----
  configDuration = 10;
  configQuestionCount = 10;
  pendingBaseQuizType = '';
  selectedQuizType = '';
  availableQuestionCount = 0;
  pendingExamType = '';

  // ---- CURRENT MODE ----
  currentMode: ExamMode = 'PRACTICE';

  // ---- PRACTICE MODE ----
  isStarted = signal(false);
  questions = signal<Question[]>([]);
  currentIndex = signal(0);
  score = signal(0);
  showResult = signal(false);
  showRomaji = signal(false);
  selectedAnswer = signal<number | null>(null);
  essayAnswer = '';
  isEssayCorrect = false;
  remainingSeconds = signal(0);
  timerInterval: any = null;
  timeIsUp = false;

  // ---- EXAM MODE ----
  examCurrentPage = signal(0);
  examAnswers = signal<(number | null)[]>([]);
  examScore = signal(0);
  examTimedOut = false;
  examPageSize = 5;

  // ---- MENU COUNTS (jumlah soal per kategori) ----
  menuCounts: Record<string, number> = {};

  examTotalPages = computed(() => Math.ceil(this.questions().length / this.examPageSize));
  examPageArray = computed(() => Array.from({ length: this.examTotalPages() }, (_, i) => i));
  examAnsweredCount = computed(() => this.examAnswers().filter(a => a !== null && a !== undefined).length);
  currentPageQuestions = computed(() => {
    const start = this.examCurrentPage() * this.examPageSize;
    return this.questions().slice(start, start + this.examPageSize);
  });

  ngOnInit() {
    this.computeMenuCounts();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  // ---- Hitung jumlah soal untuk semua kategori ----
  async computeMenuCounts() {
    const levels = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;

    // Kanji per level — muat lazy lalu hitung
    let kanjiTotal = 0;
    for (const lv of levels) {
      await this.dataService.loadKanji(lv);
      const count = this.dataService.getKanji(lv)?.length || 0;
      this.menuCounts[`KANJI_${lv}`] = count;
      kanjiTotal += count;
    }
    this.menuCounts['KANJI_TOTAL'] = kanjiTotal;

    // Vocab per level — muat lazy lalu hitung
    let vocabTotal = 0;
    for (const lv of levels) {
      await this.dataService.loadVocab(lv);
      const count = this.dataService.getVocab(lv)?.length || 0;
      this.menuCounts[`VOCAB_${lv}`] = count;
      vocabTotal += count;
    }
    this.menuCounts['VOCAB_TOTAL'] = vocabTotal;

    // Partikel — load lazy via SoalService
    const partikelData = await this.soalService.load('PARTICLE_N5');
    this.menuCounts['PARTICLE_N5'] = partikelData.length;
    this.menuCounts['PARTICLE_N4'] = 0;
    this.menuCounts['PARTICLE_N3'] = 0;
    this.menuCounts['PARTICLE_N2'] = 0;
    this.menuCounts['PARTICLE_N1'] = 0;
    this.menuCounts['PARTICLE_TOTAL'] = partikelData.length;

    // JLPT — count loaded lazily (bisa di-update setelah user buka menu)
    // Set default dulu agar UI tidak kosong
    this.menuCounts['JLPT_N5'] = 0;
    this.menuCounts['JLPT_N4'] = 0;
    this.menuCounts['JLPT_N3'] = 0;
    this.menuCounts['JLPT_N2'] = 0;
    this.menuCounts['JLPT_N1'] = 0;
    // Load JLPT counts di background agar tidak blokir UI
    this._loadSoalCounts();

    // JFT
    this.menuCounts['JFT_A2'] = 0;
    this.menuCounts['JFT_INTERMEDIATE'] = 0;
    this.menuCounts['JFT_ADVANCED'] = 0;
    this.menuCounts['SENTENCE'] = 0;

    // Kana — muat lazy
    await this.dataService.loadKana();
    const hiraGojuuon = this.dataService.getKana('HIRAGANA', 'GOJUUON') || [];
    const hiraDakuon = this.dataService.getKana('HIRAGANA', 'DAKUON') || [];
    const hiraHandakuon = this.dataService.getKana('HIRAGANA', 'HANDAKUON') || [];
    this.menuCounts['KANA_HIRAGANA'] = hiraGojuuon.length + hiraDakuon.length + hiraHandakuon.length;

    const kataGojuuon = this.dataService.getKana('KATAKANA', 'GOJUUON') || [];
    const kataDakuon = this.dataService.getKana('KATAKANA', 'DAKUON') || [];
    const kataHandakuon = this.dataService.getKana('KATAKANA', 'HANDAKUON') || [];
    this.menuCounts['KANA_KATAKANA'] = kataGojuuon.length + kataDakuon.length + kataHandakuon.length;
  }

  // Load jumlah soal per kategori di background (tidak blokir UI)
  private async _loadSoalCounts() {
    const cats: SoalCategory[] = ['JLPT_N5','JLPT_N4','JLPT_N3','JLPT_N2','JLPT_N1','JFT_A2','JFT_INTERMEDIATE','JFT_ADVANCED','SENTENCE'];
    for (const cat of cats) {
      const data = await this.soalService.load(cat);
      this.menuCounts[cat] = data.length;
    }
  }

  // ============================================================
  // SMART SHUFFLE ENGINE
  // ============================================================

  /**
   * Mengambil soal dengan algoritma anti-pengulangan:
   * - Soal yang sudah muncul tidak akan muncul lagi sampai semua soal habis (pool exhaustion)
   * - Setelah pool habis, reset pool dan mulai putaran baru
   * - Jawaban pilihan ganda diacak ulang setiap kali soal diambil
   * 
   * @param masterList - Daftar master soal (tidak dimodifikasi)
   * @param poolKey    - Kunci unik untuk pool (misal: 'KANJI_N5')
   * @param count      - Jumlah soal yang diinginkan
   * @returns Array soal dengan jawaban teracak
   */
  drawQuestionsFromPool(masterList: Question[], poolKey: string, count: number): Question[] {
    if (masterList.length === 0) return [];

    // Ambil atau buat pool baru
    let pool = shufflePools.get(poolKey);
    if (!pool || pool.remaining.length === 0) {
      // Buat pool baru: semua indeks diacak
      const indices = Array.from({ length: masterList.length }, (_, i) => i);
      pool = { remaining: this.fisherYates(indices), round: (pool?.round ?? 0) + 1 };
      shufflePools.set(poolKey, pool);
    }

    const result: Question[] = [];
    const needed = Math.min(count, masterList.length);

    while (result.length < needed) {
      // Jika pool habis di tengah pengambilan, reset dan lanjutkan
      if (pool.remaining.length === 0) {
        const indices = Array.from({ length: masterList.length }, (_, i) => i);
        pool = { remaining: this.fisherYates(indices), round: pool.round + 1 };
        shufflePools.set(poolKey, pool);
      }

      // Ambil indeks teratas dari pool
      const idx = pool.remaining.pop()!;
      const originalQ = masterList[idx];

      // Acak ulang jawaban pilihan ganda
      const renderedQ = this.rerandomizeOptions(originalQ);
      result.push(renderedQ);
    }

    // Simpan pool yang sudah diupdate
    shufflePools.set(poolKey, pool);

    return result;
  }

  /**
   * Mengacak ulang opsi pilihan ganda setiap kemunculan soal.
   * Jawaban benar dipastikan mengikuti opsi yang dipindah.
   * Untuk soal essay (inputType !== 'CHOICE'), dikembalikan apa adanya.
   */
  rerandomizeOptions(q: Question): Question {
    if (q.inputType !== 'CHOICE' || !q.options || q.options.length === 0) {
      return { ...q };
    }

    const correctAnswer = q.options[q.correct];
    const shuffledOptions = this.fisherYates([...q.options]);
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);

    return {
      ...q,
      options: shuffledOptions,
      correct: newCorrectIndex
    };
  }

  /** Fisher-Yates in-place shuffle, returns array */
  fisherYates<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ---- MENU NAVIGATION ----

  openModeSelection(type: string) {
    this.pendingExamType = type;
    this.showModeSelectionModal.set(true);
  }

  async startExamMode() {
    this.showModeSelectionModal.set(false);
    this.currentMode = 'EXAM';

    const fullQuestions = await this.getRawQuestionsByType(this.pendingExamType);
    // Untuk exam mode: langsung shuffle tanpa pool tracking (tiap exam fresh)
    const shuffled = this.fisherYates([...fullQuestions]);
    const sliced = shuffled.slice(0, 60).map(q => this.rerandomizeOptions(q));

    this.questions.set(sliced);
    this.examAnswers.set(new Array(sliced.length).fill(null));
    this.examCurrentPage.set(0);
    this.examScore.set(0);
    this.examTimedOut = false;
    this.showExamResult.set(false);
    this.showExamReview.set(false);
    this.timeIsUp = false;

    this.remainingSeconds.set(90 * 60);
    this.startTimer();
    this.isStarted.set(true);
  }

  openKanaSelection() {
    this.showKanaSelectionModal.set(true);
  }

  selectKanaQuiz(type: 'KANA_HIRAGANA' | 'KANA_KATAKANA') {
    this.showKanaSelectionModal.set(false);
    this.openConfig(type);
  }

  openLevelSelection(baseType: string) {
    this.pendingBaseQuizType = baseType;
    this.showLevelSelectionModal.set(true);
  }

  selectLevel(level: string) {
    this.showLevelSelectionModal.set(false);
    this.openConfig(`${this.pendingBaseQuizType}_${level}`);
  }

  async openConfig(type: string) {
    this.currentMode = 'PRACTICE';
    this.selectedQuizType = type;
    this.configDuration = 10;
    this.configQuestionCount = 10;
    const fullData = await this.getRawQuestionsByType(type);
    this.availableQuestionCount = fullData.length;
    this.showModeSelectionModal.set(false);
    this.showConfigModal.set(true);
  }

  async proceedToQuiz() {
    if (this.configDuration < 1) this.configDuration = 1;
    if (this.configDuration > 500) this.configDuration = 500;
    if (this.configQuestionCount < 1) this.configQuestionCount = 1;
    if (this.configQuestionCount > 500) this.configQuestionCount = 500;

    const masterList = await this.getRawQuestionsByType(this.selectedQuizType);
    const sliceCount = Math.min(this.configQuestionCount, masterList.length);

    // Gunakan smart pool untuk mode practice
    const sliced = this.drawQuestionsFromPool(masterList, this.selectedQuizType, sliceCount);

    this.questions.set(sliced);
    this.currentIndex.set(0);
    this.score.set(0);
    this.showResult.set(false);
    this.showRomaji.set(false);
    this.selectedAnswer.set(null);
    this.essayAnswer = '';
    this.isEssayCorrect = false;
    this.timeIsUp = false;

    this.remainingSeconds.set(this.configDuration * 60);
    this.startTimer();

    this.showConfigModal.set(false);
    this.isStarted.set(true);
  }

  resetToMenu() {
    this.stopTimer();
    this.isStarted.set(false);
    this.showExamResult.set(false);
    this.showExamReview.set(false);
    this.currentMode = 'PRACTICE';
  }

  // ---- EXAM ACTIONS ----

  selectExamAnswer(globalIdx: number, optionIdx: number) {
    const answers = [...this.examAnswers()];
    answers[globalIdx] = optionIdx;
    this.examAnswers.set(answers);
  }

  isPageFullyAnswered(pageIdx: number): boolean {
    const start = pageIdx * this.examPageSize;
    const end = Math.min(start + this.examPageSize, this.questions().length);
    const answers = this.examAnswers();
    for (let i = start; i < end; i++) {
      if (answers[i] === null || answers[i] === undefined) return false;
    }
    return true;
  }

  nextExamPage() {
    if (this.examCurrentPage() < this.examTotalPages() - 1) {
      this.examCurrentPage.update(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevExamPage() {
    if (this.examCurrentPage() > 0) {
      this.examCurrentPage.update(p => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToExamPage(pageIdx: number) {
    this.examCurrentPage.set(pageIdx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submitExam() {
    this.showSubmitConfirm.set(false);
    this.showSubmitLoading.set(true);

    setTimeout(() => {
      this.stopTimer();
      this.showSubmitLoading.set(false);
      this.isStarted.set(false);

      let sc = 0;
      const answers = this.examAnswers();
      const qs = this.questions();
      for (let i = 0; i < qs.length; i++) {
        if (answers[i] === qs[i].correct) sc++;
      }
      this.examScore.set(sc);
      this.showExamResult.set(true);
    }, 3000);
  }

  toggleExamReview() {
    this.showExamReview.update(v => !v);
  }

  // ---- TIMER ----

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      const current = this.remainingSeconds();
      if (current > 0) {
        this.remainingSeconds.set(current - 1);
      } else {
        if (this.currentMode === 'EXAM') {
          this.finishExamByTimeout();
        } else {
          this.finishQuizByTimeout();
        }
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  finishQuizByTimeout() {
    this.stopTimer();
    this.timeIsUp = true;
    this.isStarted.set(false);
  }

  finishExamByTimeout() {
    this.stopTimer();
    this.examTimedOut = true;
    let sc = 0;
    const answers = this.examAnswers();
    const qs = this.questions();
    for (let i = 0; i < qs.length; i++) {
      if (answers[i] === qs[i].correct) sc++;
    }
    this.examScore.set(sc);
    this.isStarted.set(false);
    this.showExamResult.set(true);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  // ---- PRACTICE ACTIONS ----

  toggleRomaji() {
    this.showRomaji.update(v => !v);
  }

  currentQuestion() {
    if (this.currentIndex() >= this.questions().length) return null;
    return this.questions()[this.currentIndex()];
  }

  speakQuestion() {
    const q = this.currentQuestion();
    if (!q) return;
    this.tts.speak(q.q, 'id-ID');
  }

  answerChoice(index: number) {
    if (this.showResult()) return;
    this.selectedAnswer.set(index);
    this.showResult.set(true);
    if (index === this.currentQuestion()!.correct) {
      this.score.update(s => s + 1);
    }
  }

  checkEssay() {
    if (this.showResult() || !this.essayAnswer.trim()) return;
    const correctAnswers = this.currentQuestion()?.correctAnswers || [];
    const userAnswer = this.essayAnswer.toLowerCase().trim().replace(/[.,?!]/g, '');
    this.isEssayCorrect = correctAnswers.some(ans =>
      ans.toLowerCase().replace(/[.,?!]/g, '') === userAnswer
    );
    if (this.isEssayCorrect) {
      this.score.update(s => s + 1);
    }
    this.showResult.set(true);
  }

  next() {
    if (this.currentIndex() < this.questions().length - 1) {
      this.currentIndex.update(i => i + 1);
      this.showResult.set(false);
      this.showRomaji.set(false);
      this.selectedAnswer.set(null);
      this.essayAnswer = '';
      this.isEssayCorrect = false;
    } else {
      this.stopTimer();
      this.isStarted.set(false);
    }
  }

  // ---- HELPERS ----

  /** Alias untuk fisherYates agar kompatibel dengan kode yang sudah ada */
  shuffleArray<T>(array: T[]): T[] {
    return this.fisherYates([...array]);
  }

  getQuizLabel(type: string) {
    if (type?.includes('KANJI')) return 'Latihan Kanji';
    if (type?.includes('VOCAB')) return 'Latihan Kosakata';
    if (type?.includes('PARTICLE')) return 'Latihan Partikel';
    switch (type) {
      case 'JLPT_N5': return 'JLPT N5';
      case 'JLPT_N4': return 'JLPT N4';
      case 'JLPT_N3': return 'JLPT N3';
      case 'JLPT_N2': return 'JLPT N2';
      case 'JLPT_N1': return 'JLPT N1';
      case 'JFT_A2': return 'JFT Basic A2';
      case 'JFT_INTERMEDIATE': return 'JFT Intermediate';
      case 'JFT_ADVANCED': return 'JFT Advanced';
      case 'SENTENCE': return 'Latihan Kalimat';
      case 'KANA_HIRAGANA': return 'Hiragana Quiz';
      case 'KANA_KATAKANA': return 'Katakana Quiz';
      default: return 'Quiz';
    }
  }

  getScoreColor() {
    const s = this.score();
    const total = this.questions().length;
    if (total === 0) return 'text-slate-200';
    const percentage = s / total;
    if (percentage >= 0.8) return 'text-green-400';
    if (percentage >= 0.5) return 'text-yellow-400';
    return 'text-red-400';
  }

  getOptionClass(index: number): string {
    if (!this.showResult()) {
      return 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500';
    }
    const q = this.currentQuestion()!;
    if (index === q.correct) {
      return 'bg-green-900/40 border-green-500 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.2)]';
    }
    if (index === this.selectedAnswer() && index !== q.correct) {
      return 'bg-red-900/40 border-red-500 text-red-300';
    }
    return 'bg-slate-900 border-slate-800 text-slate-500 opacity-50';
  }

  // ============================================================
  // GET RAW QUESTIONS — mengembalikan master list TANPA shuffle jawaban
  // (shuffle jawaban dilakukan di drawQuestionsFromPool / rerandomizeOptions)
  // Untuk Kanji & Vocab: soal di-generate dari dataService setiap panggilan
  // ============================================================
  async getRawQuestionsByType(type: string): Promise<Question[]> {
    let qData: Question[] = [];

    // ----- KANJI -----
    if (type.startsWith('KANJI_')) {
      const level = type.replace('KANJI_', '') as any;
      await this.dataService.loadKanji(level);
      const allKanji = this.dataService.getKanji(level) || [];
      qData = allKanji.map(k => {
        const pool = allKanji.filter(x => x.meaning !== k.meaning);
        const wrongs = this.fisherYates([...pool]).slice(0, 3).map(x => x.meaning);
        while (wrongs.length < 3) wrongs.push('—');
        const opts = [k.meaning, ...wrongs];
        return {
          q: `Apa arti dari Kanji ini?\n\n${k.char}\n(On: ${k.onyomi?.join(', ') || '-'} | Kun: ${k.kunyomi?.join(', ') || '-'})`,
          options: opts, correct: 0, type: type, inputType: 'CHOICE',
          explanation: k.story || `Kanji ${k.char} berarti ${k.meaning}.`
        } as Question;
      });
      return qData;
    }

    // ----- VOCAB -----
    if (type.startsWith('VOCAB_')) {
      const level = type.replace('VOCAB_', '') as any;
      await this.dataService.loadVocab(level);
      const allVocab = this.dataService.getVocab(level) || [];
      qData = allVocab.map(v => {
        const pool = allVocab.filter(x => x.meaning !== v.meaning);
        const wrongs = this.fisherYates([...pool]).slice(0, 3).map(x => x.meaning);
        while (wrongs.length < 3) wrongs.push('—');
        return {
          q: `Apa arti kosakata ini?\n\n${v.word} (${v.kana})`,
          options: [v.meaning, ...wrongs], correct: 0, type: type, inputType: 'CHOICE'
        } as Question;
      });
      return qData;
    }

    // ----- PARTIKEL -----
    if (type.startsWith('PARTICLE_')) {
      return await this.soalService.load(type as SoalCategory);
    }

    // ----- KANA -----
    if (type === 'KANA_HIRAGANA') {
      await this.dataService.loadKana();
      const hiragana   = this.dataService.getKana('HIRAGANA', 'GOJUUON') || [];
      const dakuon     = this.dataService.getKana('HIRAGANA', 'DAKUON') || [];
      const handakuon  = this.dataService.getKana('HIRAGANA', 'HANDAKUON') || [];
      const all = [...hiragana, ...dakuon, ...handakuon];
      return all.map(k => {
        const pool = all.filter(x => x.romaji !== k.romaji);
        const wrongs = this.fisherYates([...pool]).slice(0, 3).map(x => x.romaji);
        while (wrongs.length < 3) wrongs.push('—');
        return { q: `Apa bacaan dari karakter ini?\n\n${k.char}`, options: [k.romaji, ...wrongs], correct: 0, type: 'KANA', inputType: 'CHOICE' } as Question;
      });
    }
    if (type === 'KANA_KATAKANA') {
      await this.dataService.loadKana();
      const katakana   = this.dataService.getKana('KATAKANA', 'GOJUUON') || [];
      const dakuon     = this.dataService.getKana('KATAKANA', 'DAKUON') || [];
      const handakuon  = this.dataService.getKana('KATAKANA', 'HANDAKUON') || [];
      const all = [...katakana, ...dakuon, ...handakuon];
      return all.map(k => {
        const pool = all.filter(x => x.romaji !== k.romaji);
        const wrongs = this.fisherYates([...pool]).slice(0, 3).map(x => x.romaji);
        while (wrongs.length < 3) wrongs.push('—');
        return { q: `Apa bacaan dari karakter ini?\n\n${k.char}`, options: [k.romaji, ...wrongs], correct: 0, type: 'KANA', inputType: 'CHOICE' } as Question;
      });
    }

    // ----- SOAL (JLPT / JFT / SENTENCE) via SoalService -----
    const soalTypes = ['JLPT_N5','JLPT_N4','JLPT_N3','JLPT_N2','JLPT_N1','JFT_A2','JFT_INTERMEDIATE','JFT_ADVANCED','SENTENCE'];
    if (soalTypes.includes(type)) {
      return await this.soalService.load(type as SoalCategory);
    }

    return qData;
  }

  // Alias (untuk kompatibilitas)
  async getQuestionsByType(type: string): Promise<Question[]> {
    return this.getRawQuestionsByType(type);
  }
}
