import { Injectable } from '@angular/core';

// ============================================================
// WRITING DATA SERVICE — JSON + fetch() STRATEGY
// ============================================================
// Data SVG tersimpan di /public/data/writing/writing_1.json s/d writing_20.json
// Setiap file = Record<string, string> (karakter → SVG)
// Dimuat secara lazy, satu chunk per fetch
// ============================================================

@Injectable({ providedIn: 'root' })
export class WritingDataService {

  private cache = new Map<string, string>();        // char → svg
  private loadedChunks = new Set<number>();
  private readonly TOTAL_CHUNKS = 20;

  /**
   * Ambil SVG untuk karakter tertentu.
   * Memuat chunk satu per satu hingga karakter ditemukan.
   */
  async getVector(char: string): Promise<string | undefined> {
    if (this.cache.has(char)) return this.cache.get(char);

    for (let i = 1; i <= this.TOTAL_CHUNKS; i++) {
      if (!this.loadedChunks.has(i)) {
        await this._loadChunk(i);
        if (this.cache.has(char)) return this.cache.get(char);
      }
    }
    return undefined;
  }

  /** Preload semua chunk sekaligus (panggil saat layar writing dibuka) */
  async preloadAll(): Promise<void> {
    await Promise.all(
      Array.from({length: this.TOTAL_CHUNKS}, (_, i) => this._loadChunk(i + 1))
    );
  }

  hasVector(char: string): boolean { return this.cache.has(char); }
  clearCache(): void { this.cache.clear(); this.loadedChunks.clear(); }

  private async _loadChunk(n: number): Promise<void> {
    if (this.loadedChunks.has(n)) return;
    try {
      const res = await fetch(`/data/writing/writing_${n}.json`);
      if (!res.ok) return;
      const map: Record<string, string> = await res.json();
      for (const [char, svg] of Object.entries(map)) {
        this.cache.set(char, svg);
      }
      this.loadedChunks.add(n);
    } catch(e) {
      console.warn(`[WritingDataService] Gagal muat chunk ${n}:`, e);
    }
  }
}
