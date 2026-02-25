import { Injectable, signal } from '@angular/core';
import { Vocab, Kanji, Grammar, Particle } from '../types';

// ============================================================
// CUSTOM DATA SERVICE — localStorage (works offline & native APK)
// Menyimpan kosakata / kanji / partikel / bunpou custom user
// ============================================================

type Level = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

const KEYS = {
  vocab:    'custom_vocab_v1',
  kanji:    'custom_kanji_v1',
  grammar:  'custom_grammar_v1',
  particle: 'custom_particle_v1',
};

export interface CustomVocab extends Vocab {
  _custom: true;
  _id: string;
  _addedAt: number;
}

export interface CustomKanji extends Kanji {
  _custom: true;
  _id: string;
  _addedAt: number;
}

export interface CustomGrammar extends Grammar {
  _custom: true;
  _id: string;
  _addedAt: number;
}

export interface CustomParticle extends Particle {
  _custom: true;
  _id: string;
  _addedAt: number;
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function save<T>(key: string, data: T[]): void {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

@Injectable({ providedIn: 'root' })
export class CustomDataService {

  // reactive signals so UI updates instantly
  private _vocab    = signal<CustomVocab[]>(load(KEYS.vocab));
  private _kanji    = signal<CustomKanji[]>(load(KEYS.kanji));
  private _grammar  = signal<CustomGrammar[]>(load(KEYS.grammar));
  private _particle = signal<CustomParticle[]>(load(KEYS.particle));

  // ── READ ─────────────────────────────────────────────────────

  getCustomVocab(level?: Level): CustomVocab[] {
    const all = this._vocab();
    return level ? all.filter(v => v.level?.toUpperCase() === level) : all;
  }

  getCustomKanji(level?: Level): CustomKanji[] {
    const all = this._kanji();
    return level ? all.filter(k => k.level === level) : all;
  }

  getCustomGrammar(level?: Level): CustomGrammar[] {
    const all = this._grammar();
    return level ? all.filter(g => g.level === level) : all;
  }

  getCustomParticle(level?: Level): CustomParticle[] {
    const all = this._particle();
    return level ? all.filter(p => p.level === level) : all;
  }

  // ── ADD SINGLE ───────────────────────────────────────────────

  addVocab(item: Omit<Vocab, '_custom' | '_id' | '_addedAt'>): CustomVocab {
    const entry: CustomVocab = { ...item as any, _custom: true, _id: genId(), _addedAt: Date.now() };
    const updated = [...this._vocab(), entry];
    this._vocab.set(updated);
    save(KEYS.vocab, updated);
    return entry;
  }

  addKanji(item: Omit<Kanji, '_custom' | '_id' | '_addedAt'>): CustomKanji {
    const entry: CustomKanji = { ...item as any, _custom: true, _id: genId(), _addedAt: Date.now() };
    const updated = [...this._kanji(), entry];
    this._kanji.set(updated);
    save(KEYS.kanji, updated);
    return entry;
  }

  addGrammar(item: Omit<Grammar, '_custom' | '_id' | '_addedAt'>): CustomGrammar {
    const entry: CustomGrammar = { ...item as any, _custom: true, _id: genId(), _addedAt: Date.now() };
    const updated = [...this._grammar(), entry];
    this._grammar.set(updated);
    save(KEYS.grammar, updated);
    return entry;
  }

  addParticle(item: Omit<Particle, '_custom' | '_id' | '_addedAt'>): CustomParticle {
    const entry: CustomParticle = { ...item as any, _custom: true, _id: genId(), _addedAt: Date.now() };
    const updated = [...this._particle(), entry];
    this._particle.set(updated);
    save(KEYS.particle, updated);
    return entry;
  }

  // ── ADD BATCH ────────────────────────────────────────────────

  addVocabBatch(items: Omit<Vocab, '_custom'|'_id'|'_addedAt'>[]): CustomVocab[] {
    const entries = items.map(i => ({ ...i as any, _custom: true as const, _id: genId(), _addedAt: Date.now() }));
    const updated = [...this._vocab(), ...entries];
    this._vocab.set(updated);
    save(KEYS.vocab, updated);
    return entries;
  }

  addKanjiBatch(items: Omit<Kanji, '_custom'|'_id'|'_addedAt'>[]): CustomKanji[] {
    const entries = items.map(i => ({ ...i as any, _custom: true as const, _id: genId(), _addedAt: Date.now() }));
    const updated = [...this._kanji(), ...entries];
    this._kanji.set(updated);
    save(KEYS.kanji, updated);
    return entries;
  }

  addGrammarBatch(items: Omit<Grammar, '_custom'|'_id'|'_addedAt'>[]): CustomGrammar[] {
    const entries = items.map(i => ({ ...i as any, _custom: true as const, _id: genId(), _addedAt: Date.now() }));
    const updated = [...this._grammar(), ...entries];
    this._grammar.set(updated);
    save(KEYS.grammar, updated);
    return entries;
  }

  addParticleBatch(items: Omit<Particle, '_custom'|'_id'|'_addedAt'>[]): CustomParticle[] {
    const entries = items.map(i => ({ ...i as any, _custom: true as const, _id: genId(), _addedAt: Date.now() }));
    const updated = [...this._particle(), ...entries];
    this._particle.set(updated);
    save(KEYS.particle, updated);
    return entries;
  }

  // ── DELETE ───────────────────────────────────────────────────

  deleteVocab(id: string): void {
    const updated = this._vocab().filter(v => v._id !== id);
    this._vocab.set(updated);
    save(KEYS.vocab, updated);
  }

  deleteKanji(id: string): void {
    const updated = this._kanji().filter(k => k._id !== id);
    this._kanji.set(updated);
    save(KEYS.kanji, updated);
  }

  deleteGrammar(id: string): void {
    const updated = this._grammar().filter(g => g._id !== id);
    this._grammar.set(updated);
    save(KEYS.grammar, updated);
  }

  deleteParticle(id: string): void {
    const updated = this._particle().filter(p => p._id !== id);
    this._particle.set(updated);
    save(KEYS.particle, updated);
  }

  // ── COUNTS ───────────────────────────────────────────────────

  get vocabCount() { return this._vocab().length; }
  get kanjiCount() { return this._kanji().length; }
  get grammarCount() { return this._grammar().length; }
  get particleCount() { return this._particle().length; }

  // ── EXPORT JSON ──────────────────────────────────────────────

  exportAll(): string {
    return JSON.stringify({
      vocab: this._vocab(),
      kanji: this._kanji(),
      grammar: this._grammar(),
      particle: this._particle(),
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  importAll(jsonStr: string): { ok: boolean; message: string } {
    try {
      const data = JSON.parse(jsonStr);
      if (data.vocab)    { const u = [...this._vocab(),    ...data.vocab];    this._vocab.set(u);    save(KEYS.vocab, u); }
      if (data.kanji)    { const u = [...this._kanji(),    ...data.kanji];    this._kanji.set(u);    save(KEYS.kanji, u); }
      if (data.grammar)  { const u = [...this._grammar(),  ...data.grammar];  this._grammar.set(u);  save(KEYS.grammar, u); }
      if (data.particle) { const u = [...this._particle(), ...data.particle]; this._particle.set(u); save(KEYS.particle, u); }
      return { ok: true, message: 'Import berhasil!' };
    } catch (e: any) {
      return { ok: false, message: 'Format JSON tidak valid: ' + e.message };
    }
  }

  // ── SIGNALS (for reactivity) ─────────────────────────────────
  readonly vocabSignal    = this._vocab.asReadonly();
  readonly kanjiSignal    = this._kanji.asReadonly();
  readonly grammarSignal  = this._grammar.asReadonly();
  readonly particleSignal = this._particle.asReadonly();
}
