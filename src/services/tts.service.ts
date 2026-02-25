import { Injectable, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';

/**
 * TtsService — Native Android TTS via @capacitor-community/text-to-speech
 *
 * ANDROID (APK): Pakai Android TTS Engine native → 100% offline, PASTI berbunyi
 * BROWSER/WEB:   Fallback ke window.speechSynthesis
 *
 * Semua method publik identik dengan versi lama — tidak ada perubahan di template.
 */
@Injectable({ providedIn: 'root' })
export class TtsService {

  /** Signal: true saat TTS sedang berbicara */
  isSpeaking = signal(false);

  private readonly isNative = Capacitor.isNativePlatform();
  private ttsPlugin: any = null;

  // Web Speech API fallback
  private webSynth: SpeechSynthesis | null = null;
  private webVoices: SpeechSynthesisVoice[] = [];
  private voiceRetry = 0;
  private voiceInterval: ReturnType<typeof setInterval> | null = null;

  private jpRegex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;

  constructor() {
    if (this.isNative) {
      this._loadNativePlugin();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.webSynth = window.speechSynthesis;
      this._initWebVoices();
    }
  }

  private _loadNativePlugin(): void {
    import('@capacitor-community/text-to-speech')
      .then(mod => {
        this.ttsPlugin = mod.TextToSpeech;
        console.log('[TTS] Native plugin LOADED ✓');
      })
      .catch(e => console.warn('[TTS] Plugin load failed, web fallback akan digunakan', e));
  }

  // ──────────────────────────────────────────────────────────────────
  // PUBLIC API — identik dengan interface tts.service lama
  // ──────────────────────────────────────────────────────────────────

  speak(text: string, defaultLang: 'id-ID' | 'ja-JP' = 'id-ID'): void {
    if (!text?.trim()) return;
    this.cancel();

    let t = text.replace(/([_\uFF3F\s\u3000\u2605\u2606]*[_\uFF3F]+[_\uFF3F\s\u3000\u2605\u2606]*)/g, ' ... ');
    if (defaultLang === 'id-ID') t = t.replace(/\//g, ' atau ');

    if (this.isNative && this.ttsPlugin) {
      this._nativeSpeakSegmented(t, defaultLang);
    } else {
      this._webSpeakSegmented(t, defaultLang);
    }
  }

  speakWord(kanji: string, kana?: string): void {
    if (!kanji && !kana) return;
    this.cancel();
    const text = kana || kanji;
    if (this.isNative && this.ttsPlugin) {
      this._nativeSpeakFire(text, 'ja-JP', 0.85);
    } else {
      this._webSpeakSingle(text, 'ja-JP', 0.85);
    }
  }

  speakSentence(japanese: string, _romaji?: string): void {
    if (!japanese?.trim()) return;
    this.speak(japanese, 'ja-JP');
  }

  /**
   * Ucapkan beberapa item berurutan dengan jeda — dipakai FlashcardComponent
   */
  async speakChain(
    items: Array<{ text: string; lang: string; rate?: number }>,
    ref: { cancelled: boolean },
    pauseMs: number
  ): Promise<void> {
    this.isSpeaking.set(true);
    try {
      for (let i = 0; i < items.length; i++) {
        if (ref.cancelled) break;
        const item = items[i];
        if (!item.text?.trim()) continue;
        await this._speakOneAwait(item.text, item.lang, item.rate ?? 1.0);
        if (ref.cancelled) break;
        if (i < items.length - 1) await this._delay(pauseMs);
      }
    } finally {
      if (!ref.cancelled) this.isSpeaking.set(false);
    }
  }

  /**
   * Speak a single text and await completion — dipakai MensetsuComponent
   */
  speakAsync(text: string, lang: string = 'id-ID', rate: number = 1.0): Promise<void> {
    return this._speakOneAwait(text, lang, rate);
  }

  cancel(): void {
    this.isSpeaking.set(false);
    if (this.isNative && this.ttsPlugin) {
      this.ttsPlugin.stop().catch(() => {});
    } else {
      this.webSynth?.cancel();
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // NATIVE ANDROID TTS ENGINE
  // ──────────────────────────────────────────────────────────────────

  private _nativeSpeakFire(text: string, lang: string, rate = 1.0): void {
    if (!this.ttsPlugin) return;
    this.isSpeaking.set(true);
    this.ttsPlugin.stop()
      .catch(() => {})
      .then(() => this.ttsPlugin.speak({
        text: text.substring(0, 4000),
        lang: this._normLang(lang),
        rate, pitch: 1.0, volume: 1.0, category: 'ambient'
      }))
      .then(() => this.isSpeaking.set(false))
      .catch((e: any) => { console.error('[TTS]', e); this.isSpeaking.set(false); });
  }

  private async _nativeSpeakSegmented(text: string, defaultLang: string): Promise<void> {
    const segs = this._segmentText(text, defaultLang);
    this.isSpeaking.set(true);
    try {
      for (const seg of segs) {
        if (!this.isSpeaking()) break;
        await this._nativeSpeakAwait(seg.text, seg.lang, seg.lang === 'ja-JP' ? 0.85 : 0.9);
      }
    } finally {
      this.isSpeaking.set(false);
    }
  }

  private async _nativeSpeakAwait(text: string, lang: string, rate = 1.0): Promise<void> {
    if (!this.ttsPlugin) return;
    try {
      await this.ttsPlugin.stop().catch(() => {});
      await this.ttsPlugin.speak({
        text: text.substring(0, 4000),
        lang: this._normLang(lang),
        rate, pitch: 1.0, volume: 1.0, category: 'ambient'
      });
    } catch (e) { console.error('[TTS Native]', e); }
  }

  // ──────────────────────────────────────────────────────────────────
  // WEB SPEECH API FALLBACK
  // ──────────────────────────────────────────────────────────────────

  private _webSpeakSingle(text: string, lang: string, rate = 1.0): void {
    if (!this.webSynth) return;
    this.webSynth.cancel();
    const u = new SpeechSynthesisUtterance(text.substring(0, 300));
    u.lang = this._normLang(lang); u.rate = rate; u.volume = 1.0; u.pitch = 1.0;
    const v = this._getBestWebVoice(lang); if (v) u.voice = v;
    u.onstart = () => this.isSpeaking.set(true);
    u.onend = () => this.isSpeaking.set(false);
    u.onerror = () => this.isSpeaking.set(false);
    this.webSynth.speak(u);
    setTimeout(() => { if (this.webSynth?.paused) this.webSynth.resume(); }, 500);
  }

  private _webSpeakSegmented(text: string, defaultLang: string): void {
    if (!this.webSynth) return;
    const segs = this._segmentText(text, defaultLang);
    this.webSynth.cancel();
    segs.forEach((seg, idx) => {
      const u = new SpeechSynthesisUtterance(seg.text);
      u.lang = seg.lang; u.rate = seg.lang === 'ja-JP' ? 0.85 : 0.9;
      const v = this._getBestWebVoice(seg.lang); if (v) u.voice = v;
      if (idx === 0) u.onstart = () => this.isSpeaking.set(true);
      if (idx === segs.length - 1) {
        u.onend = () => this.isSpeaking.set(false);
        u.onerror = () => this.isSpeaking.set(false);
      }
      this.webSynth!.speak(u);
    });
    setTimeout(() => { if (this.webSynth?.paused) this.webSynth.resume(); }, 500);
  }

  private _webSpeakAwait(text: string, lang: string, rate = 1.0): Promise<void> {
    return new Promise(res => {
      if (!this.webSynth) { res(); return; }
      this.webSynth.cancel();
      const u = new SpeechSynthesisUtterance(text.substring(0, 300));
      u.lang = this._normLang(lang); u.rate = rate; u.volume = 1.0;
      const v = this._getBestWebVoice(lang); if (v) u.voice = v;
      u.onend = () => res(); u.onerror = () => res();
      this.webSynth.speak(u);
      setTimeout(() => { if (this.webSynth?.paused) this.webSynth.resume(); }, 500);
    });
  }

  private _speakOneAwait(text: string, lang: string, rate = 1.0): Promise<void> {
    if (this.isNative && this.ttsPlugin) {
      return this._nativeSpeakAwait(text, lang, rate);
    }
    return this._webSpeakAwait(text, lang, rate);
  }

  private _initWebVoices(): void {
    if (!this.webSynth) return;
    const load = () => {
      const v = this.webSynth!.getVoices();
      if (v.length) { this.webVoices = v; if (this.voiceInterval) { clearInterval(this.voiceInterval); this.voiceInterval = null; } }
    };
    this.webSynth.onvoiceschanged = load;
    load();
    this.voiceInterval = setInterval(() => {
      load(); if (++this.voiceRetry > 120) { clearInterval(this.voiceInterval!); this.voiceInterval = null; }
    }, 500);
  }

  private _getBestWebVoice(lang: string): SpeechSynthesisVoice | null {
    if (!this.webVoices.length) return null;
    const pool = this.webVoices.filter(v => v.lang.replace('_', '-').includes(lang));
    if (!pool.length) return null;
    return pool.find(v => v.name.includes('Google')) || pool.find(v => v.name.includes('Microsoft')) || pool[0];
  }

  private _segmentText(text: string, baseLang: string): Array<{ text: string; lang: string }> {
    const segs: Array<{ text: string; lang: string }> = [];
    let cur = ''; let curJp = false;
    const isJp = (c: string) => this.jpRegex.test(c);
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]; const jp = isJp(ch);
      if (i === 0) { curJp = jp; cur += ch; continue; }
      const code = ch.charCodeAt(0);
      const neutral = (code >= 0 && code <= 64) || (code >= 91 && code <= 96) || (code >= 123 && code <= 126);
      if (neutral) { cur += ch; }
      else if (jp !== curJp) {
        if (cur.trim()) segs.push({ text: cur.trim(), lang: curJp ? 'ja-JP' : baseLang });
        cur = ch; curJp = jp;
      } else { cur += ch; }
    }
    if (cur.trim()) segs.push({ text: cur.trim(), lang: curJp ? 'ja-JP' : baseLang });
    return segs.filter(s => s.text.length > 0);
  }

  private _normLang(lang: string): string {
    const map: Record<string, string> = { 'ja': 'ja-JP', 'id': 'id-ID', 'en': 'en-US', 'jp': 'ja-JP' };
    return map[lang.toLowerCase()] ?? lang;
  }

  private _delay(ms: number): Promise<void> {
    return new Promise(r => setTimeout(r, ms));
  }
}
