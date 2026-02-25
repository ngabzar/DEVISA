import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslationService } from './services/translation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="mx-auto max-w-md min-h-[100dvh] shadow-2xl overflow-hidden relative transition-colors duration-300"
         [class.bg-slate-950]="ts.isDarkMode()" 
         [class.text-white]="ts.isDarkMode()"
         [class.bg-gray-50]="!ts.isDarkMode()"
         [class.text-slate-900]="!ts.isDarkMode()">
         
      <router-outlet></router-outlet>

      <!-- Bottom Navigation -->
      <div class="fixed bottom-0 left-0 right-0 max-w-md mx-auto backdrop-blur-lg border-t p-2 grid grid-cols-5 gap-1 z-50 transition-colors"
           [class.bg-slate-950_90]="ts.isDarkMode()" [class.border-slate-800]="ts.isDarkMode()"
           [class.bg-white_90]="!ts.isDarkMode()" [class.border-gray-200]="!ts.isDarkMode()">
        
        <!-- Home -->
        <a routerLink="/" routerLinkActive="text-blue-500" [routerLinkActiveOptions]="{exact: true}" 
           class="flex flex-col items-center justify-center py-2 rounded-xl transition-colors"
           [class.text-slate-500]="ts.isDarkMode()" [class.hover-text-slate-300]="ts.isDarkMode()"
           [class.text-slate-400]="!ts.isDarkMode()" [class.hover-text-slate-600]="!ts.isDarkMode()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mb-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span class="text-[9px] font-medium truncate w-full text-center">{{ ts.get('nav.home') }}</span>
        </a>

        <!-- Vocab -->
        <a routerLink="/vocab" routerLinkActive="text-blue-500" 
           class="flex flex-col items-center justify-center py-2 rounded-xl transition-colors"
           [class.text-slate-500]="ts.isDarkMode()" [class.hover-text-slate-300]="ts.isDarkMode()"
           [class.text-slate-400]="!ts.isDarkMode()" [class.hover-text-slate-600]="!ts.isDarkMode()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mb-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
          <span class="text-[9px] font-medium truncate w-full text-center">{{ ts.get('nav.vocab') }}</span>
        </a>

        <!-- Writing -->
        <a routerLink="/writing" routerLinkActive="text-blue-500" 
           class="flex flex-col items-center justify-center py-2 rounded-xl transition-colors"
           [class.text-slate-500]="ts.isDarkMode()" [class.hover-text-slate-300]="ts.isDarkMode()"
           [class.text-slate-400]="!ts.isDarkMode()" [class.hover-text-slate-600]="!ts.isDarkMode()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mb-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          <span class="text-[9px] font-medium truncate w-full text-center">{{ ts.get('nav.writing') }}</span>
        </a>

        <!-- Profile -->
        <a routerLink="/profile" routerLinkActive="text-blue-500" 
           class="flex flex-col items-center justify-center py-2 rounded-xl transition-colors"
           [class.text-slate-500]="ts.isDarkMode()" [class.hover-text-slate-300]="ts.isDarkMode()"
           [class.text-slate-400]="!ts.isDarkMode()" [class.hover-text-slate-600]="!ts.isDarkMode()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mb-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <span class="text-[9px] font-medium truncate w-full text-center">{{ ts.get('nav.profile') }}</span>
        </a>

        <!-- Settings (New) -->
        <a routerLink="/settings" routerLinkActive="text-blue-500" 
           class="flex flex-col items-center justify-center py-2 rounded-xl transition-colors"
           [class.text-slate-500]="ts.isDarkMode()" [class.hover-text-slate-300]="ts.isDarkMode()"
           [class.text-slate-400]="!ts.isDarkMode()" [class.hover-text-slate-600]="!ts.isDarkMode()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mb-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <span class="text-[9px] font-medium truncate w-full text-center">{{ ts.get('nav.settings') }}</span>
        </a>

      </div>
    </div>
  `
})
export class AppComponent {
  ts = inject(TranslationService);
}
