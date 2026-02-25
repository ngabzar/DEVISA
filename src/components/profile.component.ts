import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../services/translation.service';
import { AuthService, AppUser } from '../data/login';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  providers: [],
  template: `
    <div class="min-h-screen pb-24 transition-colors duration-300"
         [class.bg-slate-950]="ts.isDarkMode()" [class.bg-gray-50]="!ts.isDarkMode()"
         [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
      
      <!-- Header -->
      <div class="sticky top-0 z-20 p-4 border-b flex items-center gap-4 transition-colors"
           [class.bg-slate-950]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
           [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
        <h1 class="text-xl font-bold">Profil Saya</h1>
      </div>

      <!-- Not logged in -->
      @if (!auth.isLoggedIn()) {
        <div class="flex flex-col items-center justify-center px-6 py-16 text-center">
          <!-- Illustration -->
          <div class="w-28 h-28 rounded-full mb-6 flex items-center justify-center text-6xl"
               [class.bg-slate-800]="ts.isDarkMode()" [class.bg-gray-200]="!ts.isDarkMode()">
            👤
          </div>
          
          <h2 class="text-2xl font-bold mb-2" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
            Masuk ke Akun Anda
          </h2>
          <p class="text-sm mb-8 leading-relaxed max-w-xs" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">
            Masuk untuk menyimpan progres belajar, sinkronisasi flashcard, dan melacak statistik belajar Anda.
          </p>

          <!-- Features list -->
          <div class="w-full max-w-xs mb-8 space-y-3 text-left">
            @for (feature of loginFeatures; track feature.icon) {
              <div class="flex items-center gap-3">
                <span class="text-2xl">{{ feature.icon }}</span>
                <span class="text-sm" [class.text-slate-300]="ts.isDarkMode()" [class.text-slate-600]="!ts.isDarkMode()">
                  {{ feature.text }}
                </span>
              </div>
            }
          </div>

          <!-- Google Sign In Button -->
          <button (click)="signInWithGoogle()" 
                  [disabled]="isSigningIn()"
                  class="w-full max-w-xs flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold text-base transition-all active:scale-95"
                  [class.bg-white]="true"
                  [class.text-slate-900]="true"
                  [class.shadow-lg]="true"
                  [class.hover:shadow-xl]="true"
                  [class.opacity-70]="isSigningIn()">
            @if (isSigningIn()) {
              <div class="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Sedang masuk...</span>
            } @else {
              <!-- Google Logo SVG -->
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Masuk dengan Google</span>
            }
          </button>

          <p class="text-xs mt-4" [class.text-slate-600]="ts.isDarkMode()" [class.text-slate-400]="!ts.isDarkMode()">
            Dengan masuk, Anda menyetujui syarat dan ketentuan JavSensei.
          </p>
        </div>
      }

      <!-- Logged in -->
      @if (auth.isLoggedIn()) {
        @let user = auth.currentUser()!;
        
        <!-- Profile Header -->
        <div class="px-4 py-6 flex flex-col items-center text-center border-b"
             [class.border-slate-800]="ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
          
          <!-- Avatar -->
          @if (user.photoURL) {
            <img [src]="user.photoURL" [alt]="user.displayName || 'User'" 
                 class="w-24 h-24 rounded-full mb-4 ring-4"
                 [class.ring-blue-500]="ts.isDarkMode()" [class.ring-blue-400]="!ts.isDarkMode()" />
          } @else {
            <div class="w-24 h-24 rounded-full mb-4 flex items-center justify-center text-4xl font-bold ring-4"
                 [class.bg-blue-800]="ts.isDarkMode()" [class.bg-blue-100]="!ts.isDarkMode()"
                 [class.text-blue-200]="ts.isDarkMode()" [class.text-blue-600]="!ts.isDarkMode()"
                 [class.ring-blue-500]="ts.isDarkMode()" [class.ring-blue-300]="!ts.isDarkMode()">
              {{ (user.displayName || user.email || 'U').charAt(0).toUpperCase() }}
            </div>
          }
          
          <h2 class="text-xl font-bold" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
            {{ user.displayName || 'Pengguna' }}
          </h2>
          <p class="text-sm" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">
            {{ user.email }}
          </p>
          <div class="mt-2 px-3 py-1 rounded-full text-xs font-medium"
               [class.bg-blue-900]="ts.isDarkMode()" [class.text-blue-300]="ts.isDarkMode()"
               [class.bg-blue-100]="!ts.isDarkMode()" [class.text-blue-700]="!ts.isDarkMode()">
            🎌 Pelajar JavSensei
          </div>
        </div>

        <!-- Study Stats -->
        @if (user.studyStats) {
          <div class="px-4 py-4">
            <h3 class="text-sm font-bold uppercase tracking-wider mb-3 opacity-60">Statistik Belajar</h3>
            
            <!-- Streak -->
            <div class="rounded-xl p-4 mb-4 border"
                 [class.bg-amber-900_20]="ts.isDarkMode()" [class.border-amber-800]="ts.isDarkMode()"
                 [class.bg-amber-50]="!ts.isDarkMode()" [class.border-amber-200]="!ts.isDarkMode()">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-3xl font-bold text-amber-500">🔥 {{ user.studyStats.currentStreak }}</div>
                  <div class="text-sm" [class.text-amber-300]="ts.isDarkMode()" [class.text-amber-700]="!ts.isDarkMode()">
                    Streak Hari Belajar
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-lg font-semibold" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
                    {{ user.studyStats.longestStreak }}
                  </div>
                  <div class="text-xs" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">
                    Streak Terpanjang
                  </div>
                </div>
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-xl p-3 border text-center"
                   [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
                   [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                <div class="text-2xl font-bold text-blue-500">{{ user.studyStats.kanjiLearned }}</div>
                <div class="text-xs" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Kanji Dipelajari</div>
              </div>
              <div class="rounded-xl p-3 border text-center"
                   [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
                   [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                <div class="text-2xl font-bold text-cyan-500">{{ user.studyStats.vocabLearned }}</div>
                <div class="text-xs" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Kosakata Dipelajari</div>
              </div>
              <div class="rounded-xl p-3 border text-center"
                   [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
                   [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                <div class="text-2xl font-bold text-emerald-500">{{ user.studyStats.quizCompleted }}</div>
                <div class="text-xs" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Kuis Selesai</div>
              </div>
              <div class="rounded-xl p-3 border text-center"
                   [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
                   [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
                <div class="text-2xl font-bold text-purple-500">{{ user.studyStats.flashcardReviewed }}</div>
                <div class="text-xs" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">Flashcard Review</div>
              </div>
            </div>
          </div>
        }

        <!-- Menu Options -->
        <div class="px-4 pb-4 space-y-3">
          <h3 class="text-sm font-bold uppercase tracking-wider mb-3 opacity-60">Pengaturan Akun</h3>
          
          <div class="rounded-xl border overflow-hidden"
               [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
               [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
            
            <!-- Sync Progress -->
            <button class="w-full flex items-center justify-between p-4 border-b text-left"
                    [class.border-slate-800]="ts.isDarkMode()" [class.border-gray-100]="!ts.isDarkMode()">
              <div class="flex items-center gap-3">
                <span class="text-xl">☁️</span>
                <span class="font-medium text-sm">Sinkronisasi Progres</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 opacity-50">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            <!-- Notifications -->
            <button class="w-full flex items-center justify-between p-4 border-b text-left"
                    [class.border-slate-800]="ts.isDarkMode()" [class.border-gray-100]="!ts.isDarkMode()">
              <div class="flex items-center gap-3">
                <span class="text-xl">🔔</span>
                <span class="font-medium text-sm">Pengingat Belajar</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 opacity-50">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            <!-- Study History -->
            <button class="w-full flex items-center justify-between p-4 text-left">
              <div class="flex items-center gap-3">
                <span class="text-xl">📊</span>
                <span class="font-medium text-sm">Riwayat Belajar</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 opacity-50">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          <!-- Sign Out Button -->
          <button (click)="showSignOutConfirm.set(true)" 
                  class="w-full py-4 rounded-xl border font-semibold text-sm transition-all active:scale-95"
                  [class.border-red-800]="ts.isDarkMode()" [class.text-red-400]="ts.isDarkMode()" [class.bg-red-950_30]="ts.isDarkMode()"
                  [class.border-red-200]="!ts.isDarkMode()" [class.text-red-500]="!ts.isDarkMode()" [class.bg-red-50]="!ts.isDarkMode()">
            🚪 Keluar dari Akun
          </button>
        </div>
      }

      <!-- Sign Out Confirm Dialog -->
      @if (showSignOutConfirm()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" (click)="showSignOutConfirm.set(false)"></div>
          <div class="relative border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
               [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
               [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
            <h3 class="text-lg font-bold mb-2" [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">Konfirmasi Keluar</h3>
            <p class="text-sm mb-6" [class.text-slate-400]="ts.isDarkMode()" [class.text-slate-500]="!ts.isDarkMode()">
              Apakah Anda yakin ingin keluar dari akun?
            </p>
            <div class="flex gap-3">
              <button (click)="showSignOutConfirm.set(false)" 
                      class="flex-1 py-3 rounded-xl font-medium text-sm border"
                      [class.border-slate-700]="ts.isDarkMode()" [class.text-slate-300]="ts.isDarkMode()"
                      [class.border-gray-300]="!ts.isDarkMode()" [class.text-slate-700]="!ts.isDarkMode()">
                Batal
              </button>
              <button (click)="signOut()" 
                      class="flex-1 py-3 rounded-xl font-semibold text-sm bg-red-600 text-white">
                Keluar
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class ProfileComponent {
  ts = inject(TranslationService);
  auth = inject(AuthService);

  isSigningIn = signal(false);
  showSignOutConfirm = signal(false);

  loginFeatures = [
    { icon: '📊', text: 'Lacak progres belajar harian Anda' },
    { icon: '🔄', text: 'Sinkronisasi antar perangkat' },
    { icon: '🔥', text: 'Pertahankan streak belajar' },
    { icon: '🏆', text: 'Raih pencapaian dan lencana' },
    { icon: '☁️', text: 'Backup data flashcard ke cloud' }
  ];

  async signInWithGoogle() {
    this.isSigningIn.set(true);
    try {
      await this.auth.signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      this.isSigningIn.set(false);
    }
  }

  async signOut() {
    await this.auth.signOut();
    this.showSignOutConfirm.set(false);
  }
}
