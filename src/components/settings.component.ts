import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService, LanguageCode } from '../services/translation.service';

@Component({
  selector: 'app-settings',
  imports: [CommonModule],
  template: `
    <div class="min-h-screen pb-24 transition-colors duration-300"
         [class.bg-slate-950]="ts.isDarkMode()" [class.bg-gray-50]="!ts.isDarkMode()"
         [class.text-white]="ts.isDarkMode()" [class.text-slate-900]="!ts.isDarkMode()">
      
      <!-- Header -->
      <div class="sticky top-0 z-20 p-4 border-b flex items-center gap-4 transition-colors"
           [class.bg-slate-950]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
           [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
        <h1 class="text-xl font-bold">{{ ts.get('settings.title') }}</h1>
      </div>

      <div class="p-4 space-y-6">
        
        <!-- Language Section -->
        <section>
          <h2 class="text-sm font-bold uppercase tracking-wider mb-3 opacity-60">{{ ts.get('settings.language') }}</h2>
          <div class="rounded-xl overflow-hidden border transition-colors"
               [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
               [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
            
            @for (lang of languages; track lang) {
              <button (click)="ts.setLanguage(lang)" 
                class="w-full flex items-center justify-between p-4 border-b last:border-0 transition-colors hover:bg-opacity-10 hover:bg-blue-500 text-left">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">{{ getFlag(lang) }}</span>
                  <span class="font-medium">{{ ts.getLangName(lang) }}</span>
                </div>
                @if (ts.currentLang() === lang) {
                  <span class="text-blue-500 font-bold">✓</span>
                }
              </button>
            }
          </div>
        </section>

        <!-- Theme Section -->
        <section>
          <h2 class="text-sm font-bold uppercase tracking-wider mb-3 opacity-60">{{ ts.get('settings.theme') }}</h2>
          <div class="rounded-xl p-4 border flex items-center justify-between transition-colors"
               [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
               [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
            <div class="flex items-center gap-3">
              <span class="text-xl">{{ ts.isDarkMode() ? '🌙' : '☀️' }}</span>
              <span class="font-medium">{{ ts.get('settings.dark_mode') }}</span>
            </div>
            
            <!-- Toggle Switch -->
            <button (click)="ts.toggleTheme()" 
              class="w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none"
              [class.bg-blue-600]="ts.isDarkMode()" [class.bg-gray-300]="!ts.isDarkMode()">
              <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 shadow-sm"
                   [class.left-6.5]="ts.isDarkMode()" [class.left-0.5]="!ts.isDarkMode()"></div>
            </button>
          </div>
        </section>

        <!-- About / Other -->
        <section>
          <h2 class="text-sm font-bold uppercase tracking-wider mb-3 opacity-60">Info</h2>
          <div class="rounded-xl overflow-hidden border transition-colors"
               [class.bg-slate-900]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
               [class.bg-white]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
            
            <div class="p-4 border-b last:border-0" [class.border-slate-800]="ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
              <div class="font-medium">{{ ts.get('settings.about') }}</div>
              <div class="text-xs opacity-60 mt-1">NihongoQuest v1.0.0</div>
            </div>

            <button (click)="resetProgress()" class="w-full p-4 text-left text-red-500 font-bold hover:bg-red-500/10 transition-colors">
              {{ ts.get('settings.reset') }}
            </button>
          </div>
        </section>

      </div>
    </div>
  `
})
export class SettingsComponent {
  ts = inject(TranslationService);
  languages: LanguageCode[] = ['ID', 'EN', 'VI', 'TH', 'PH', 'MY'];

  getFlag(lang: LanguageCode): string {
    switch(lang) {
      case 'ID': return '🇮🇩';
      case 'EN': return '🇺🇸';
      case 'VI': return '🇻🇳';
      case 'TH': return '🇹🇭';
      case 'PH': return '🇵🇭';
      case 'MY': return '🇲🇾';
      default: return '🌐';
    }
  }

  resetProgress() {
    if (confirm(this.ts.get('settings.reset_confirm'))) {
      try { localStorage.clear(); } catch { /* ignore */ }
      // Reload page to reset states
      window.location.reload();
    }
  }
}
