import { Injectable } from '@angular/core';
import { Kanji, Vocab, Grammar, Particle, Kana } from '../types';

// ============================================================
// DATA SERVICE — JSON + fetch() STRATEGY
// ============================================================
// API Pattern:
//   STEP 1 (async): await dataService.loadKanji('N5')
//   STEP 2 (sync) : dataService.getKanji('N5')
//   OR COMBINED   : await dataService.fetchKanji('N5')
// ============================================================

type Level = 'N1' | 'N2' | 'N3' | 'N4' | 'N5';
type KanaType = 'HIRAGANA' | 'KATAKANA';
type KanaGroup = 'GOJUUON' | 'DAKUON' | 'HANDAKUON' | 'YOON';

@Injectable({ providedIn: 'root' })
export class JapaneseDataService {

  // ── Cache in-memory ──────────────────────────────────────────
  private kanjiCache    = new Map<string, Kanji[]>();
  private vocabCache    = new Map<string, Vocab[]>();
  private grammarCache  = new Map<Level, Grammar[]>();
  private particleCache = new Map<Level, Particle[]>();
  private hiraganaCache: Kana[] | null = null;
  private katakanaCache: Kana[] | null = null;

  // ============================================================
  // KANJI
  // ============================================================

  async loadKanji(level: Level | 'ALL'): Promise<void> {
    if (level === 'ALL') {
      await Promise.all((['N5','N4','N3','N2','N1'] as Level[]).map(lv => this.loadKanji(lv)));
      return;
    }
    if (!this.kanjiCache.has(level)) {
      const data = await this._fetchFolder<Kanji>('kanji', `kanjin${level.replace('N','')}`);
      this.kanjiCache.set(level, data);
    }
  }

  isKanjiLoaded(level: Level | 'ALL'): boolean {
    if (level === 'ALL') return (['N5','N4','N3','N2','N1'] as Level[]).every(lv => this.kanjiCache.has(lv));
    return this.kanjiCache.has(level);
  }

  /** Sinkron — baca dari cache. Panggil loadKanji() terlebih dahulu. */
  getKanji(level: Level | 'ALL'): Kanji[] {
    if (level === 'ALL') {
      return (['N5','N4','N3','N2','N1'] as Level[]).flatMap(lv => this.kanjiCache.get(lv) ?? []);
    }
    return this.kanjiCache.get(level) ?? [];
  }

  /** Async — load lalu return. */
  async fetchKanji(level: Level | 'ALL'): Promise<Kanji[]> {
    await this.loadKanji(level);
    return this.getKanji(level);
  }

  // ============================================================
  // KOSAKATA
  // ============================================================

  async loadVocab(level: Level | 'ALL'): Promise<void> {
    if (level === 'ALL') {
      await Promise.all((['N5','N4','N3','N2','N1'] as Level[]).map(lv => this.loadVocab(lv)));
      return;
    }
    if (!this.vocabCache.has(level)) {
      const data = await this._fetchFolder<Vocab>('kosakata', `kosakatan${level.replace('N','')}`);
      this.vocabCache.set(level, data);
    }
  }

  isVocabLoaded(level: Level | 'ALL'): boolean {
    if (level === 'ALL') return (['N5','N4','N3','N2','N1'] as Level[]).every(lv => this.vocabCache.has(lv));
    return this.vocabCache.has(level);
  }

  /** Sinkron — baca dari cache. Panggil loadVocab() terlebih dahulu. */
  getVocab(level: Level | 'ALL'): Vocab[] {
    if (level === 'ALL') {
      return (['N5','N4','N3','N2','N1'] as Level[]).flatMap(lv => this.vocabCache.get(lv) ?? []);
    }
    return this.vocabCache.get(level) ?? [];
  }

  /** Async — load lalu return. */
  async fetchVocab(level: Level | 'ALL'): Promise<Vocab[]> {
    await this.loadVocab(level);
    return this.getVocab(level);
  }

  // ============================================================
  // BUNPOU (GRAMMAR)
  // ============================================================

  async loadGrammar(level: Level): Promise<void> {
    if (!this.grammarCache.has(level)) {
      const data = await this._fetchFolder<Grammar>('bunpou', `bunpoun${level.replace('N','')}`);
      this.grammarCache.set(level, data);
    }
  }

  /** Sinkron — baca dari cache. Panggil loadGrammar() terlebih dahulu. */
  getGrammar(level: Level): Grammar[] {
    return this.grammarCache.get(level) ?? [];
  }

  /** Async — load lalu return. */
  async fetchGrammar(level: Level): Promise<Grammar[]> {
    await this.loadGrammar(level);
    return this.getGrammar(level);
  }

  // ============================================================
  // PARTIKEL
  // ============================================================

  async loadParticles(level: Level): Promise<void> {
    if (!this.particleCache.has(level)) {
      const data = await this._fetchFolder<Particle>('partikel', `partikeln${level.replace('N','')}`);
      this.particleCache.set(level, data);
    }
  }

  /** Sinkron — baca dari cache. Panggil loadParticles() terlebih dahulu. */
  getParticles(level: Level): Particle[] {
    return this.particleCache.get(level) ?? [];
  }

  /** Async — load lalu return. */
  async fetchParticles(level: Level): Promise<Particle[]> {
    await this.loadParticles(level);
    return this.getParticles(level);
  }

  // ============================================================
  // KANA
  // ============================================================

  async loadKana(): Promise<void> {
    await Promise.all([this._loadHiraganaAll(), this._loadKatakanaAll()]);
  }

  /** Sinkron — baca dari cache. Panggil loadKana() terlebih dahulu. */
  getKana(type: KanaType, group: KanaGroup): Kana[] {
    const list = type === 'HIRAGANA'
      ? (this.hiraganaCache ?? [])
      : (this.katakanaCache ?? []);
    return list.filter(k => k.group === group);
  }

  /** Async — load lalu return. */
  async fetchKana(type: KanaType, group: KanaGroup): Promise<Kana[]> {
    await this.loadKana();
    return this.getKana(type, group);
  }

  private async _loadHiraganaAll(): Promise<Kana[]> {
    if (!this.hiraganaCache) {
      this.hiraganaCache = await this._fetchFolder<Kana>('kana', 'hiragana');
    }
    return this.hiraganaCache;
  }

  private async _loadKatakanaAll(): Promise<Kana[]> {
    if (!this.katakanaCache) {
      this.katakanaCache = await this._fetchFolder<Kana>('kana', 'katakana');
    }
    return this.katakanaCache;
  }

  // ============================================================
  // INTERNAL: fetch semua JSON dalam satu subfolder via manifest
  // ============================================================

  private async _fetchFolder<T>(category: string, subfolder: string): Promise<T[]> {
    const manifestUrl = `/data/${category}/${subfolder}/manifest.json`;
    let files: string[];
    try {
      const res = await fetch(manifestUrl);
      files = res.ok ? await res.json() : [];
    } catch {
      files = [];
    }
    const results = await Promise.all(
      files.map(f => this._fetchJson<T[]>(`/data/${category}/${subfolder}/${f}`))
    );
    return results.flat();
  }

  private async _fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch gagal: ${url} (${res.status})`);
    return res.json();
  }

  // ============================================================
  // CACHE MANAGEMENT
  // ============================================================

  clearCache(category?: 'kanji' | 'vocab' | 'grammar' | 'particle' | 'kana') {
    if (!category || category === 'kanji')    this.kanjiCache.clear();
    if (!category || category === 'vocab')    this.vocabCache.clear();
    if (!category || category === 'grammar')  this.grammarCache.clear();
    if (!category || category === 'particle') this.particleCache.clear();
    if (!category || category === 'kana') { this.hiraganaCache = null; this.katakanaCache = null; }
  }

  clearLevelCache(level: Level) {
    this.kanjiCache.delete(level);
    this.vocabCache.delete(level);
    this.grammarCache.delete(level);
    this.particleCache.delete(level);
  }
}
