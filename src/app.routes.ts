import { Routes } from '@angular/router';

// ================================================================
// LAZY ROUTES — setiap halaman = chunk JS terpisah di APK
// ================================================================
// Dengan loadComponent(), Angular + Vite akan membuat file
// chunk terpisah untuk setiap komponen halaman.
// Komponen TIDAK dimuat ke memori sampai pengguna mengunjunginya.
// ================================================================

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'kana',
    loadComponent: () => import('./components/kana.component').then(m => m.KanaComponent)
  },
  {
    path: 'kanji',
    loadComponent: () => import('./components/kanji.component').then(m => m.KanjiComponent)
  },
  {
    path: 'bunpou',
    loadComponent: () => import('./components/bunpou.component').then(m => m.BunpouComponent)
  },
  {
    path: 'particles',
    loadComponent: () => import('./components/particles.component').then(m => m.ParticlesComponent)
  },
  {
    path: 'writing',
    loadComponent: () => import('./components/writing.component').then(m => m.WritingComponent)
  },
  {
    path: 'vocab',
    loadComponent: () => import('./components/vocab.component').then(m => m.VocabComponent)
  },
  {
    path: 'quiz',
    loadComponent: () => import('./components/quiz.component').then(m => m.QuizComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: 'flashcard',
    loadComponent: () => import('./components/flashcard.component').then(m => m.FlashcardComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'mensetsu',
    loadComponent: () => import('./components/mensetsu.component').then(m => m.MensetsuComponent)
  },
  {
    path: 'ebook',
    loadComponent: () => import('./components/ebook.component').then(m => m.EbookComponent)
  },
  {
    path: 'notes',
    loadComponent: () => import('./components/notes.component').then(m => m.NotesComponent)
  },
  {
    path: 'tambah/:type',
    loadComponent: () => import('./components/add-custom.component').then(m => m.AddCustomComponent)
  },
  { path: '**', redirectTo: '' }
];
