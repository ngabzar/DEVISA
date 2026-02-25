import { Injectable } from '@angular/core';
import { Question } from '../types';

// ============================================================
// SOAL SERVICE — JSON + fetch() STRATEGY
// ============================================================

export type SoalCategory =
  | 'JLPT_N5' | 'JLPT_N4' | 'JLPT_N3' | 'JLPT_N2' | 'JLPT_N1'
  | 'JFT_A2' | 'JFT_INTERMEDIATE' | 'JFT_ADVANCED'
  | 'SENTENCE'
  | 'PARTICLE_N5' | 'PARTICLE_N4' | 'PARTICLE_N3' | 'PARTICLE_N2' | 'PARTICLE_N1';

// Mapping kategori → subfolder dan pattern nama file di /public/data/soal/
const SOAL_FILE_MAP: Record<SoalCategory, string[]> = {
  JLPT_N5: Array.from({length:20}, (_,i) => `jlptn5_${i+1}.json`),
  JLPT_N4: Array.from({length:20}, (_,i) => `jlptn4_${i+1}.json`),
  JLPT_N3: ['jlptn3_1.json'],
  JLPT_N2: ['jlptn2_1.json', 'jlptn2_2.json'],
  JLPT_N1: ['jlptn1_1.json', 'jlptn1_2.json'],
  JFT_A2:  Array.from({length:20}, (_,i) => `jftA2b_${i+1}.json`),
  JFT_INTERMEDIATE: ['jft_intermediate_1.json','jft_intermediate_2.json'],
  JFT_ADVANCED:     ['jft_advanced_1.json','jft_advanced_2.json'],
  SENTENCE:    Array.from({length:20}, (_,i) => `latihan.kalimat_${i+1}.json`),
  PARTICLE_N5: Array.from({length:20}, (_,i) => `latihan.partikel_${i+1}.json`),
  PARTICLE_N4: [],
  PARTICLE_N3: [],
  PARTICLE_N2: [],
  PARTICLE_N1: [],
};

@Injectable({ providedIn: 'root' })
export class SoalService {

  private cache = new Map<SoalCategory, Question[]>();

  async getSoal(category: SoalCategory): Promise<Question[]> {
    if (this.cache.has(category)) return this.cache.get(category)!;
    const files = SOAL_FILE_MAP[category] || [];
    if (files.length === 0) return [];
    const results = await Promise.all(
      files.map(f => this._fetch<Question[]>(`/data/soal/${f}`))
    );
    const data = results.flat();
    this.cache.set(category, data);
    return data;
  }

  /** Alias untuk getSoal() — untuk kompatibilitas dengan kode lama. */
  async load(category: SoalCategory): Promise<Question[]> {
    return this.getSoal(category);
  }

  async getSoalCount(category: SoalCategory): Promise<number> {
    return (await this.getSoal(category)).length;
  }

  clearCache(category?: SoalCategory) {
    category ? this.cache.delete(category) : this.cache.clear();
  }

  private async _fetch<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch gagal: ${url}`);
    return res.json();
  }
}
