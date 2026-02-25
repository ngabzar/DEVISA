import { defineConfig } from 'vite';

// ================================================================
// VITE CONFIG — CODE SPLITTING UNTUK DATA CHUNK TERPISAH
// ================================================================
// Konfigurasi ini memastikan Vite memisahkan setiap file data
// menjadi chunk JS tersendiri saat build production.
// Hasilnya: folder dist berisi ratusan file .js kecil, bukan
// satu main.js besar → APK bisa memuat data secara lazy/on-demand.
// ================================================================

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Pisahkan setiap modul data menjadi chunk manual
        manualChunks(id: string) {
          // ── Kanji per level ─────────────────────────────────
          if (id.includes('/data/kanji/kanjin5/')) return 'data-kanji-n5';
          if (id.includes('/data/kanji/kanjin4/')) return 'data-kanji-n4';
          if (id.includes('/data/kanji/kanjin3/')) return 'data-kanji-n3';
          if (id.includes('/data/kanji/kanjin2/')) return 'data-kanji-n2';
          if (id.includes('/data/kanji/kanjin1/')) return 'data-kanji-n1';

          // ── Kosakata per level ───────────────────────────────
          if (id.includes('/data/kosakata/kosakatan5/')) return 'data-vocab-n5';
          if (id.includes('/data/kosakata/kosakatan4/')) return 'data-vocab-n4';
          if (id.includes('/data/kosakata/kosakatan3/')) return 'data-vocab-n3';
          if (id.includes('/data/kosakata/kosakatan2/')) return 'data-vocab-n2';
          if (id.includes('/data/kosakata/kosakatan1/')) return 'data-vocab-n1';

          // ── Bunpou per level ─────────────────────────────────
          if (id.includes('/data/bunpou/bunpoun5/')) return 'data-grammar-n5';
          if (id.includes('/data/bunpou/bunpoun4/')) return 'data-grammar-n4';
          if (id.includes('/data/bunpou/bunpoun3/')) return 'data-grammar-n3';
          if (id.includes('/data/bunpou/bunpoun2/')) return 'data-grammar-n2';
          if (id.includes('/data/bunpou/bunpoun1/')) return 'data-grammar-n1';

          // ── Partikel per level ───────────────────────────────
          if (id.includes('/data/partikel/partikeln5/')) return 'data-particle-n5';
          if (id.includes('/data/partikel/partikeln4/')) return 'data-particle-n4';
          if (id.includes('/data/partikel/partikeln3/')) return 'data-particle-n3';
          if (id.includes('/data/partikel/partikeln2/')) return 'data-particle-n2';
          if (id.includes('/data/partikel/partikeln1/')) return 'data-particle-n1';

          // ── Kana ─────────────────────────────────────────────
          if (id.includes('/data/kana/hiragana/')) return 'data-kana-hiragana';
          if (id.includes('/data/kana/katakana/')) return 'data-kana-katakana';

          // ── Soal JLPT per level ──────────────────────────────
          if (id.includes('/data/soal/jlptn5_')) return 'data-soal-jlpt-n5';
          if (id.includes('/data/soal/jlptn4_')) return 'data-soal-jlpt-n4';
          if (id.includes('/data/soal/jlptn3_')) return 'data-soal-jlpt-n3';
          if (id.includes('/data/soal/jlptn2_')) return 'data-soal-jlpt-n2';
          if (id.includes('/data/soal/jlptn1_')) return 'data-soal-jlpt-n1';

          // ── Soal JFT ─────────────────────────────────────────
          if (id.includes('/data/soal/jftA2b_')) return 'data-soal-jft-a2';
          if (id.includes('/data/soal/jft_intermediate')) return 'data-soal-jft-intermediate';
          if (id.includes('/data/soal/jft_advanced')) return 'data-soal-jft-advanced';

          // ── Soal Kalimat & Partikel ──────────────────────────
          if (id.includes('/data/soal/latihan.kalimat_')) return 'data-soal-sentence';
          if (id.includes('/data/soal/latihan.partikel_')) return 'data-soal-particle';

          // ── Writing SVG ──────────────────────────────────────
          if (id.includes('/components/writing.component_')) return 'data-writing-svg';

          // ── Ebook ─────────────────────────────────────────────
          if (id.includes('/data/ebook/')) return 'data-ebook';

          // ── Angular core (satu chunk) ────────────────────────
          if (id.includes('node_modules/@angular/')) return 'vendor-angular';
          if (id.includes('node_modules/')) return 'vendor';
        },
        // Format chunk file dengan nama yang readable
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
      // Tingkatkan batas chunk agar tidak banyak peringatan
      onwarn(warning, warn) {
        // Abaikan peringatan circular dependency dari data files
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      }
    },
    // Naikkan batas chunk size warning (default 500KB terlalu kecil untuk data)
    chunkSizeWarningLimit: 2000,
    // Target modern browsers untuk hasil lebih kecil
    target: 'es2022',
  },
});
