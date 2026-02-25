import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomDataService } from '../services/custom-data.service';

// ============================================================
// ADD CUSTOM ENTRY — Vocab / Kanji / Partikel / Bunpou
// Route: /tambah/:type  (type = vocab | kanji | partikel | bunpou)
// ============================================================

type EntryType = 'vocab' | 'kanji' | 'partikel' | 'bunpou';
type InputMode = 'single' | 'batch';
type Level = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

interface BatchResult { success: number; failed: number; errors: string[] }

@Component({
  selector: 'app-add-custom',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
<div class="min-h-screen bg-slate-950 pb-24">

  <!-- ── HEADER ─────────────────────────────────────────────── -->
  <div class="sticky top-0 bg-slate-950/95 backdrop-blur z-20 p-4 border-b border-slate-800">
    <div class="flex items-center gap-3">
      <a [routerLink]="backPath()" class="text-slate-400 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/>
        </svg>
      </a>
      <div class="flex-1">
        <h1 class="text-lg font-bold" [class]="accentText()">Tambah {{ typeLabel() }}</h1>
        <p class="text-xs text-slate-500">Data tersimpan offline di perangkat</p>
      </div>
      <!-- Type Switch Tabs -->
      <div class="flex gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
        @for (t of typeOptions; track t.value) {
          <button (click)="switchType(t.value)"
            class="px-2.5 py-1.5 text-xs rounded font-medium transition"
            [class.text-white]="entryType() === t.value"
            [class.text-slate-500]="entryType() !== t.value"
            [ngClass]="entryType() === t.value ? activeBg() : ''">
            {{ t.short }}
          </button>
        }
      </div>
    </div>
  </div>

  <div class="p-4 space-y-4 max-w-xl mx-auto">

    <!-- ── MODE SELECTOR ──────────────────────────────────────── -->
    <div class="flex bg-slate-900 rounded-xl p-1 gap-1 border border-slate-800">
      <button (click)="mode.set('single')"
        class="flex-1 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
        [class.text-white]="mode() === 'single'"
        [class.text-slate-500]="mode() !== 'single'"
        [ngClass]="mode() === 'single' ? activeBg() : ''">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
          <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/>
        </svg>
        Satu Persatu
      </button>
      <button (click)="mode.set('batch')"
        class="flex-1 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
        [class.text-white]="mode() === 'batch'"
        [class.text-slate-500]="mode() !== 'batch'"
        [ngClass]="mode() === 'batch' ? activeBg() : ''">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
          <path fill-rule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 15.25Z" clip-rule="evenodd"/>
        </svg>
        Batch (Banyak)
      </button>
    </div>

    <!-- ══════════════════════════════════════════════════════════
         SINGLE MODE
    ═══════════════════════════════════════════════════════════ -->
    @if (mode() === 'single') {

      <!-- Level Selector -->
      <div>
        <label class="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Level JLPT</label>
        <div class="flex gap-2">
          @for (lv of levels; track lv) {
            <button (click)="singleLevel.set(lv)"
              class="flex-1 py-2 rounded-lg text-sm font-bold border transition"
              [class.border-transparent]="singleLevel() !== lv"
              [class.bg-slate-800]="singleLevel() !== lv"
              [class.text-slate-400]="singleLevel() !== lv"
              [ngClass]="singleLevel() === lv ? activeLevelClass(lv) : ''">
              {{ lv }}
            </button>
          }
        </div>
      </div>

      <!-- ── VOCAB SINGLE ──────────────────────────────────────── -->
      @if (entryType() === 'vocab') {
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">Kata (漢字/Kana) <span class="text-rose-400">*</span></label>
              <input [(ngModel)]="v.word" placeholder="食べる" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-cyan-500 outline-none text-sm"/>
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">Kana (読み方) <span class="text-rose-400">*</span></label>
              <input [(ngModel)]="v.kana" placeholder="たべる" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-cyan-500 outline-none text-sm"/>
            </div>
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Arti (Indonesia) <span class="text-rose-400">*</span></label>
            <input [(ngModel)]="v.meaning" placeholder="memakan, makan" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-cyan-500 outline-none text-sm"/>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">Kategori</label>
              <select [(ngModel)]="v.category" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white outline-none text-sm">
                <option value="NOUN">Kata Benda</option>
                <option value="VERB">Kata Kerja</option>
                <option value="ADJ-I">Kata Sifat (-i)</option>
                <option value="ADJ-NA">Kata Sifat (-na)</option>
                <option value="ADV">Kata Keterangan</option>
                <option value="OTHER">Lain-lain</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">Tag (opsional)</label>
              <input [(ngModel)]="v.tag" placeholder="makanan, harian..." class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-cyan-500 outline-none text-sm"/>
            </div>
          </div>
          <!-- Examples -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs text-slate-400 font-semibold uppercase tracking-wide">Contoh Kalimat</label>
              <button (click)="addVocabExample()" class="text-xs text-cyan-400 hover:text-cyan-300 font-medium">+ Tambah</button>
            </div>
            @for (ex of v.examples; track $index; let i = $index) {
              <div class="bg-slate-900 border border-slate-800 rounded-lg p-3 mb-2 space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-xs text-slate-500">Contoh {{ i + 1 }}</span>
                  <button (click)="removeVocabExample(i)" class="text-rose-500 text-xs hover:text-rose-400">Hapus</button>
                </div>
                <input [(ngModel)]="ex.japanese" placeholder="食べるのが好きです" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm outline-none focus:border-cyan-600"/>
                <input [(ngModel)]="ex.romaji" placeholder="Taberu no ga suki desu" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-400 text-sm outline-none focus:border-cyan-600"/>
                <input [(ngModel)]="ex.meaning" placeholder="Saya suka makan" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-cyan-300 text-sm outline-none focus:border-cyan-600"/>
              </div>
            }
          </div>
        </div>
      }

      <!-- ── KANJI SINGLE ──────────────────────────────────────── -->
      @if (entryType() === 'kanji') {
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">Kanji <span class="text-rose-400">*</span></label>
              <input [(ngModel)]="k.char" placeholder="食" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-blue-500 outline-none text-xl text-center font-bold"/>
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">Jumlah Goresan</label>
              <input [(ngModel)]="k.strokes" type="number" placeholder="9" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-blue-500 outline-none text-sm"/>
            </div>
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Arti <span class="text-rose-400">*</span></label>
            <input [(ngModel)]="k.meaning" placeholder="makan, makanan" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-blue-500 outline-none text-sm"/>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">On'yomi (音読み)</label>
              <input [(ngModel)]="k._onyomiStr" placeholder="ショク、ジキ" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-blue-500 outline-none text-sm"/>
              <p class="text-[10px] text-slate-600 mt-1">Pisahkan dengan koma</p>
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">Kun'yomi (訓読み)</label>
              <input [(ngModel)]="k._kunyomiStr" placeholder="た.べる、く.う" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-blue-500 outline-none text-sm"/>
              <p class="text-[10px] text-slate-600 mt-1">Pisahkan dengan koma</p>
            </div>
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Cerita / Mnemonic (opsional)</label>
            <textarea [(ngModel)]="k.story" rows="2" placeholder="Bayangkan seseorang yang sedang makan..." class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-blue-500 outline-none text-sm resize-none"></textarea>
          </div>
          <!-- Kanji examples -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs text-slate-400 font-semibold uppercase tracking-wide">Contoh Kata</label>
              <button (click)="addKanjiExample()" class="text-xs text-blue-400 hover:text-blue-300 font-medium">+ Tambah</button>
            </div>
            @for (ex of k.examples; track $index; let i = $index) {
              <div class="bg-slate-900 border border-slate-800 rounded-lg p-3 mb-2 space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-xs text-slate-500">Contoh {{ i + 1 }}</span>
                  <button (click)="removeKanjiExample(i)" class="text-rose-500 text-xs">Hapus</button>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <input [(ngModel)]="ex.word" placeholder="食べ物" class="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white text-sm outline-none"/>
                  <input [(ngModel)]="ex.reading" placeholder="たべもの" class="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white text-sm outline-none"/>
                </div>
                <input [(ngModel)]="ex.meaning" placeholder="makanan" class="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-cyan-300 text-sm outline-none"/>
              </div>
            }
          </div>
        </div>
      }

      <!-- ── PARTIKEL SINGLE ──────────────────────────────────── -->
      @if (entryType() === 'partikel') {
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">Partikel <span class="text-rose-400">*</span></label>
              <input [(ngModel)]="p.char" placeholder="は" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-amber-500 outline-none text-xl text-center font-bold"/>
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">Fungsi / Usage <span class="text-rose-400">*</span></label>
              <input [(ngModel)]="p.usage" placeholder="topik kalimat" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-amber-500 outline-none text-sm"/>
            </div>
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Penjelasan</label>
            <textarea [(ngModel)]="p.explanation" rows="3" placeholder="Partikel は digunakan untuk menandai topik kalimat..." class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-amber-500 outline-none text-sm resize-none"></textarea>
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Contoh Singkat <span class="text-rose-400">*</span></label>
            <input [(ngModel)]="p.example" placeholder="私は学生です" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-amber-500 outline-none text-sm"/>
          </div>
          <!-- Particle examples -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs text-slate-400 font-semibold uppercase tracking-wide">Contoh Kalimat</label>
              <button (click)="addParticleExample()" class="text-xs text-amber-400 hover:text-amber-300 font-medium">+ Tambah</button>
            </div>
            @for (ex of p.examples; track $index; let i = $index) {
              <div class="bg-slate-900 border border-slate-800 rounded-lg p-3 mb-2 space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-xs text-slate-500">Contoh {{ i + 1 }}</span>
                  <button (click)="removeParticleExample(i)" class="text-rose-500 text-xs">Hapus</button>
                </div>
                <input [(ngModel)]="ex.japanese" placeholder="私は学生です" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm outline-none"/>
                <input [(ngModel)]="ex.romaji" placeholder="Watashi wa gakusei desu" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-400 text-sm outline-none"/>
                <input [(ngModel)]="ex.meaning" placeholder="Saya adalah pelajar" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-amber-300 text-sm outline-none"/>
              </div>
            }
          </div>
        </div>
      }

      <!-- ── BUNPOU SINGLE ──────────────────────────────────────── -->
      @if (entryType() === 'bunpou') {
        <div class="space-y-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">Pola Tata Bahasa <span class="text-rose-400">*</span></label>
            <input [(ngModel)]="g.title" placeholder="〜てください" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-emerald-500 outline-none text-sm font-bold"/>
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Formula / Rumus <span class="text-rose-400">*</span></label>
            <input [(ngModel)]="g.formula" placeholder="V-te + ください" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-emerald-500 outline-none text-sm font-mono"/>
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Penjelasan <span class="text-rose-400">*</span></label>
            <textarea [(ngModel)]="g.explanation" rows="3" placeholder="Digunakan untuk meminta seseorang melakukan sesuatu dengan sopan..." class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-emerald-500 outline-none text-sm resize-none"></textarea>
          </div>
          <!-- Grammar examples -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs text-slate-400 font-semibold uppercase tracking-wide">Contoh Kalimat</label>
              <button (click)="addGrammarExample()" class="text-xs text-emerald-400 hover:text-emerald-300 font-medium">+ Tambah</button>
            </div>
            @for (ex of g.examples; track $index; let i = $index) {
              <div class="bg-slate-900 border border-slate-800 rounded-lg p-3 mb-2 space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-xs text-slate-500">Contoh {{ i + 1 }}</span>
                  <button (click)="removeGrammarExample(i)" class="text-rose-500 text-xs">Hapus</button>
                </div>
                <input [(ngModel)]="ex.japanese" placeholder="待ってください" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm outline-none"/>
                <input [(ngModel)]="ex.romaji" placeholder="Matte kudasai" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-400 text-sm outline-none"/>
                <input [(ngModel)]="ex.meaning" placeholder="Tolong tunggu" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-emerald-300 text-sm outline-none"/>
              </div>
            }
          </div>
        </div>
      }

      <!-- SAVE BUTTON -->
      <button (click)="saveSingle()"
        class="w-full py-3.5 rounded-xl text-white font-bold text-base transition active:scale-[0.98] flex items-center justify-center gap-2"
        [ngClass]="activeBg()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/>
        </svg>
        Simpan {{ typeLabel() }}
      </button>

    }

    <!-- ══════════════════════════════════════════════════════════
         BATCH MODE
    ═══════════════════════════════════════════════════════════ -->
    @if (mode() === 'batch') {

      <!-- Level -->
      <div>
        <label class="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Level JLPT (untuk semua data batch)</label>
        <div class="flex gap-2">
          @for (lv of levels; track lv) {
            <button (click)="batchLevel.set(lv)"
              class="flex-1 py-2 rounded-lg text-sm font-bold border transition"
              [class.border-transparent]="batchLevel() !== lv"
              [class.bg-slate-800]="batchLevel() !== lv"
              [class.text-slate-400]="batchLevel() !== lv"
              [ngClass]="batchLevel() === lv ? activeLevelClass(lv) : ''">
              {{ lv }}
            </button>
          }
        </div>
      </div>

      <!-- Separator Settings -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <h3 class="text-sm font-bold text-slate-300 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-slate-400">
            <path fill-rule="evenodd" d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 0 1 1.262.125l.962.962a1 1 0 0 1 .125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.294a1 1 0 0 1 .804.98v1.361a1 1 0 0 1-.804.98l-1.473.295a6.95 6.95 0 0 1-.587 1.416l.834 1.25a1 1 0 0 1-.125 1.262l-.962.962a1 1 0 0 1-1.262.125l-1.25-.834a6.953 6.953 0 0 1-1.416.587l-.294 1.473a1 1 0 0 1-.98.804H9.32a1 1 0 0 1-.98-.804l-.295-1.473a6.957 6.957 0 0 1-1.416-.587l-1.25.834a1 1 0 0 1-1.262-.125l-.962-.962a1 1 0 0 1-.125-1.262l.834-1.25a6.957 6.957 0 0 1-.587-1.416l-1.473-.294A1 1 0 0 1 1 10.68V9.32a1 1 0 0 1 .804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 0 1 .125-1.262l.962-.962A1 1 0 0 1 5.38 3.03l1.25.834a6.957 6.957 0 0 1 1.416-.587L8.34 1.804Z" clip-rule="evenodd"/>
          </svg>
          Pengaturan Pemisah
        </h3>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] text-slate-400 mb-1">Pemisah Kolom</label>
            <div class="flex gap-2">
              @for (sep of sepOptions; track sep.value) {
                <button (click)="fieldSep.set(sep.value)"
                  class="flex-1 py-1.5 text-xs rounded border transition font-mono"
                  [class.bg-slate-800]="fieldSep() !== sep.value"
                  [class.text-slate-400]="fieldSep() !== sep.value"
                  [class.border-slate-700]="fieldSep() !== sep.value"
                  [class.text-white]="fieldSep() === sep.value"
                  [class.border-transparent]="fieldSep() === sep.value"
                  [ngClass]="fieldSep() === sep.value ? activeBg() : ''">
                  {{ sep.label }}
                </button>
              }
              <input [(ngModel)]="customFieldSep" (ngModelChange)="fieldSep.set($event || '|')"
                placeholder="..." maxlength="3"
                class="w-12 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-xs text-center outline-none font-mono"/>
            </div>
          </div>
          <div>
            <label class="block text-[11px] text-slate-400 mb-1">Pemisah Contoh</label>
            <div class="flex gap-2">
              @for (sep of exSepOptions; track sep.value) {
                <button (click)="exSep.set(sep.value)"
                  class="flex-1 py-1.5 text-xs rounded border transition font-mono"
                  [class.bg-slate-800]="exSep() !== sep.value"
                  [class.text-slate-400]="exSep() !== sep.value"
                  [class.border-slate-700]="exSep() !== sep.value"
                  [class.text-white]="exSep() === sep.value"
                  [class.border-transparent]="exSep() === sep.value"
                  [ngClass]="exSep() === sep.value ? activeBg() : ''">
                  {{ sep.label }}
                </button>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Format Guide -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wide">Format Batch</h3>
          <button (click)="showFormatHelp.set(!showFormatHelp())" class="text-xs text-slate-500 hover:text-white">
            {{ showFormatHelp() ? 'Sembunyikan' : 'Tampilkan' }}
          </button>
        </div>
        @if (showFormatHelp()) {
          <div class="text-xs text-slate-400 space-y-2">
            @if (entryType() === 'vocab') {
              <p class="text-slate-300 font-mono text-[11px] bg-slate-800 p-2 rounded">
                kata {{ fieldSep() }} kana {{ fieldSep() }} arti {{ fieldSep() }} kategori {{ fieldSep() }} contohJP{{ exSep() }}romajiContoh{{ exSep() }}artiContoh
              </p>
              <p class="text-slate-500">Contoh (<code>{{ fieldSep() }}</code> = pemisah kolom, <code>{{ exSep() }}</code> = pemisah contoh):</p>
              <p class="font-mono text-[11px] bg-slate-800 p-2 rounded text-cyan-300 break-all">
                食べる{{ fieldSep() }}たべる{{ fieldSep() }}makan{{ fieldSep() }}VERB{{ fieldSep() }}食べるのが好きです{{ exSep() }}Taberu no ga suki desu{{ exSep() }}Saya suka makan<br>
                飲む{{ fieldSep() }}のむ{{ fieldSep() }}minum{{ fieldSep() }}VERB
              </p>
              <ul class="text-[11px] text-slate-500 space-y-0.5">
                <li>• Kolom wajib: kata, kana, arti</li>
                <li>• Kategori opsional: NOUN, VERB, ADJ-I, ADJ-NA, ADV, OTHER</li>
                <li>• Contoh kalimat opsional (JP{{ exSep() }}romaji{{ exSep() }}arti)</li>
              </ul>
            }
            @if (entryType() === 'kanji') {
              <p class="text-slate-300 font-mono text-[11px] bg-slate-800 p-2 rounded">
                kanji {{ fieldSep() }} arti {{ fieldSep() }} onyomi,... {{ fieldSep() }} kunyomi,... {{ fieldSep() }} goresan {{ fieldSep() }} mnemonic
              </p>
              <p class="font-mono text-[11px] bg-slate-800 p-2 rounded text-blue-300 break-all">
                食{{ fieldSep() }}makan{{ fieldSep() }}ショク,ジキ{{ fieldSep() }}た.べる,く.う{{ fieldSep() }}9{{ fieldSep() }}Seperti orang makan<br>
                水{{ fieldSep() }}air{{ fieldSep() }}スイ{{ fieldSep() }}みず{{ fieldSep() }}4
              </p>
            }
            @if (entryType() === 'partikel') {
              <p class="text-slate-300 font-mono text-[11px] bg-slate-800 p-2 rounded">
                partikel {{ fieldSep() }} fungsi {{ fieldSep() }} penjelasan {{ fieldSep() }} contohSingkat {{ fieldSep() }} contohJP{{ exSep() }}romaji{{ exSep() }}arti
              </p>
              <p class="font-mono text-[11px] bg-slate-800 p-2 rounded text-amber-300 break-all">
                は{{ fieldSep() }}topik{{ fieldSep() }}menandai topik kalimat{{ fieldSep() }}私は学生です{{ fieldSep() }}私は先生です{{ exSep() }}Watashi wa sensei desu{{ exSep() }}Saya guru
              </p>
            }
            @if (entryType() === 'bunpou') {
              <p class="text-slate-300 font-mono text-[11px] bg-slate-800 p-2 rounded">
                pola {{ fieldSep() }} rumus {{ fieldSep() }} penjelasan {{ fieldSep() }} contohJP{{ exSep() }}romaji{{ exSep() }}arti
              </p>
              <p class="font-mono text-[11px] bg-slate-800 p-2 rounded text-emerald-300 break-all">
                〜てください{{ fieldSep() }}V-te+ください{{ fieldSep() }}meminta dengan sopan{{ fieldSep() }}待ってください{{ exSep() }}Matte kudasai{{ exSep() }}Tolong tunggu
              </p>
            }
          </div>
        }
      </div>

      <!-- Batch Text Area -->
      <div>
        <label class="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Data Batch (satu baris = satu entri)</label>
        <textarea [(ngModel)]="batchText" rows="10"
          [placeholder]="batchPlaceholder()"
          class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none text-sm font-mono resize-y placeholder-slate-700"></textarea>
        <p class="text-xs text-slate-600 mt-1">{{ batchLineCount() }} baris terdeteksi</p>
      </div>

      <!-- Parse Preview -->
      @if (batchText.trim()) {
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Preview Parse ({{ batchPreview().valid }} valid, {{ batchPreview().invalid }} tidak valid)</h3>
          <div class="space-y-2 max-h-48 overflow-y-auto">
            @for (row of batchPreview().rows; track $index) {
              <div class="flex items-start gap-2 text-xs">
                @if (row.valid) {
                  <span class="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                  <span class="text-slate-300 font-mono truncate">{{ row.preview }}</span>
                } @else {
                  <span class="text-rose-400 mt-0.5 flex-shrink-0">✗</span>
                  <span class="text-slate-500 font-mono truncate">{{ row.preview }}</span>
                  <span class="text-rose-500 flex-shrink-0">{{ row.error }}</span>
                }
              </div>
            }
          </div>
        </div>
      }

      <!-- Import Button -->
      <button (click)="saveBatch()"
        [disabled]="!batchText.trim() || batchPreview().valid === 0"
        class="w-full py-3.5 rounded-xl text-white font-bold text-base transition active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        [ngClass]="activeBg()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z" clip-rule="evenodd"/>
        </svg>
        Import {{ batchPreview().valid }} {{ typeLabel() }}
      </button>
    }

  </div>
</div>

<!-- ── SUCCESS TOAST ─────────────────────────────────────────── -->
@if (toast()) {
  <div class="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 animate-bounce-in"
    [class.bg-emerald-600]="toast()!.type === 'success'"
    [class.bg-rose-600]="toast()!.type === 'error'"
    [class.text-white]="true">
    @if (toast()!.type === 'success') {
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd"/></svg>
    } @else {
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd"/></svg>
    }
    {{ toast()!.message }}
  </div>
}
  `
})
export class AddCustomComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private customData = inject(CustomDataService);

  entryType = signal<EntryType>('vocab');
  mode = signal<InputMode>('single');
  singleLevel = signal<Level>('N5');
  batchLevel = signal<Level>('N5');
  toast = signal<{ type: 'success' | 'error'; message: string } | null>(null);
  showFormatHelp = signal(true);

  readonly levels: Level[] = ['N5', 'N4', 'N3', 'N2', 'N1'];
  readonly typeOptions = [
    { value: 'vocab' as EntryType, short: 'Kosa' },
    { value: 'kanji' as EntryType, short: 'Kanji' },
    { value: 'partikel' as EntryType, short: 'Part.' },
    { value: 'bunpou' as EntryType, short: 'Bunp.' },
  ];

  // ── Separator options ──
  readonly sepOptions = [
    { label: '|', value: '|' },
    { label: ';', value: ';' },
    { label: ',', value: ',' },
    { label: '/', value: '/' },
  ];
  readonly exSepOptions = [
    { label: '~', value: '~' },
    { label: '^', value: '^' },
    { label: '§', value: '§' },
  ];

  fieldSep = signal('|');
  exSep = signal('~');
  customFieldSep = '';

  // ── Batch ──
  batchText = '';

  // ── Single form models ──
  v = this.freshVocab();
  k = this.freshKanji();
  p = this.freshParticle();
  g = this.freshGrammar();

  // ── Lifecycle ──
  ngOnInit() {
    const type = this.route.snapshot.paramMap.get('type') as EntryType | null;
    if (type && ['vocab','kanji','partikel','bunpou'].includes(type)) {
      this.entryType.set(type);
    }
  }

  // ── Helpers ──
  typeLabel(): string {
    return { vocab:'Kosakata', kanji:'Kanji', partikel:'Partikel', bunpou:'Bunpou' }[this.entryType()];
  }

  backPath(): string {
    return { vocab:'/vocab', kanji:'/kanji', partikel:'/particles', bunpou:'/bunpou' }[this.entryType()];
  }

  accentText(): string {
    return { vocab:'text-cyan-400', kanji:'text-blue-400', partikel:'text-amber-400', bunpou:'text-emerald-400' }[this.entryType()];
  }

  activeBg(): string {
    return { vocab:'bg-cyan-700 hover:bg-cyan-600', kanji:'bg-blue-700 hover:bg-blue-600', partikel:'bg-amber-700 hover:bg-amber-600', bunpou:'bg-emerald-700 hover:bg-emerald-600' }[this.entryType()];
  }

  activeLevelClass(lv: Level): string {
    const colors: Record<Level, string> = { N5:'bg-cyan-700 text-white border-cyan-600', N4:'bg-cyan-700 text-white border-cyan-600', N3:'bg-indigo-700 text-white border-indigo-600', N2:'bg-violet-700 text-white border-violet-600', N1:'bg-rose-700 text-white border-rose-600' };
    return colors[lv];
  }

  switchType(t: EntryType) {
    this.entryType.set(t);
    this.router.navigate(['/tambah', t], { replaceUrl: true });
  }

  batchPlaceholder(): string {
    const s = this.fieldSep();
    const e = this.exSep();
    const ph: Record<EntryType, string> = {
      vocab: `食べる${s}たべる${s}makan${s}VERB${s}食べるのが好きです${e}Taberu no ga suki desu${e}Saya suka makan\n飲む${s}のむ${s}minum${s}VERB`,
      kanji: `食${s}makan${s}ショク,ジキ${s}た.べる,く.う${s}9\n水${s}air${s}スイ${s}みず${s}4`,
      partikel: `は${s}topik${s}Menandai topik kalimat${s}私は学生です${s}私は先生です${e}Watashi wa sensei desu${e}Saya guru`,
      bunpou: `〜てください${s}V-te+ください${s}meminta dengan sopan${s}待ってください${e}Matte kudasai${e}Tolong tunggu\n〜たい${s}V-masu stem+たい${s}mengungkapkan keinginan`,
    };
    return ph[this.entryType()];
  }

  batchLineCount(): number {
    return this.batchText.trim() ? this.batchText.trim().split('\n').filter(l => l.trim()).length : 0;
  }

  // ── Batch Preview ──
  batchPreview = computed(() => {
    const text = this.batchText;
    const type = this.entryType();
    const sep = this.fieldSep();
    const exs = this.exSep();
    const rows: { valid: boolean; preview: string; error?: string }[] = [];
    let valid = 0, invalid = 0;

    const lines = text.trim().split('\n').filter(l => l.trim());
    for (const line of lines) {
      const cols = line.split(sep).map(c => c.trim());
      const result = this.validateBatchRow(cols, type, exs);
      rows.push({ valid: result.valid, preview: line.slice(0, 60) + (line.length > 60 ? '…' : ''), error: result.error });
      if (result.valid) valid++; else invalid++;
    }
    return { rows, valid, invalid };
  });

  private validateBatchRow(cols: string[], type: EntryType, exs: string): { valid: boolean; error?: string } {
    if (type === 'vocab') {
      if (!cols[0]) return { valid: false, error: 'Kata kosong' };
      if (!cols[1]) return { valid: false, error: 'Kana kosong' };
      if (!cols[2]) return { valid: false, error: 'Arti kosong' };
      return { valid: true };
    }
    if (type === 'kanji') {
      if (!cols[0]) return { valid: false, error: 'Kanji kosong' };
      if (!cols[1]) return { valid: false, error: 'Arti kosong' };
      return { valid: true };
    }
    if (type === 'partikel') {
      if (!cols[0]) return { valid: false, error: 'Partikel kosong' };
      if (!cols[1]) return { valid: false, error: 'Fungsi kosong' };
      return { valid: true };
    }
    if (type === 'bunpou') {
      if (!cols[0]) return { valid: false, error: 'Pola kosong' };
      if (!cols[1]) return { valid: false, error: 'Rumus kosong' };
      if (!cols[2]) return { valid: false, error: 'Penjelasan kosong' };
      return { valid: true };
    }
    return { valid: false, error: 'Unknown type' };
  }

  // ── Single SAVE ──
  saveSingle() {
    const lv = this.singleLevel();
    try {
      if (this.entryType() === 'vocab') {
        if (!this.v.word || !this.v.kana || !this.v.meaning) { this.showToast('error', 'Kata, Kana, dan Arti wajib diisi!'); return; }
        this.customData.addVocab({ ...this.v, level: lv });
        this.v = this.freshVocab();
        this.showToast('success', 'Kosakata berhasil disimpan!');
      } else if (this.entryType() === 'kanji') {
        if (!this.k.char || !this.k.meaning) { this.showToast('error', 'Kanji dan Arti wajib diisi!'); return; }
        this.customData.addKanji({ char: this.k.char, meaning: this.k.meaning, level: lv, strokes: this.k.strokes || 0, story: this.k.story, onyomi: (this.k._onyomiStr || '').split(',').map(s => s.trim()).filter(Boolean), kunyomi: (this.k._kunyomiStr || '').split(',').map(s => s.trim()).filter(Boolean), examples: this.k.examples });
        this.k = this.freshKanji();
        this.showToast('success', 'Kanji berhasil disimpan!');
      } else if (this.entryType() === 'partikel') {
        if (!this.p.char || !this.p.usage) { this.showToast('error', 'Partikel dan Fungsi wajib diisi!'); return; }
        this.customData.addParticle({ ...this.p, level: lv, example: this.p.example || '' });
        this.p = this.freshParticle();
        this.showToast('success', 'Partikel berhasil disimpan!');
      } else if (this.entryType() === 'bunpou') {
        if (!this.g.title || !this.g.formula || !this.g.explanation) { this.showToast('error', 'Pola, Rumus, dan Penjelasan wajib diisi!'); return; }
        this.customData.addGrammar({ ...this.g, level: lv });
        this.g = this.freshGrammar();
        this.showToast('success', 'Bunpou berhasil disimpan!');
      }
    } catch (e: any) { this.showToast('error', 'Gagal: ' + e.message); }
  }

  // ── Batch SAVE ──
  saveBatch() {
    const lv = this.batchLevel();
    const sep = this.fieldSep();
    const exs = this.exSep();
    const lines = this.batchText.trim().split('\n').filter(l => l.trim());
    let count = 0;

    try {
      if (this.entryType() === 'vocab') {
        const items = lines.filter(l => {
          const c = l.split(sep); return c[0] && c[1] && c[2];
        }).map(l => {
          const c = l.split(sep).map(s => s.trim());
          const exPart = c[4];
          const examples = exPart ? this.parseExamples(exPart, exs) : [];
          return { word: c[0], kana: c[1], meaning: c[2], level: lv, category: c[3] || 'NOUN', examples } as any;
        });
        this.customData.addVocabBatch(items); count = items.length;
      } else if (this.entryType() === 'kanji') {
        const items = lines.filter(l => { const c = l.split(sep); return c[0] && c[1]; }).map(l => {
          const c = l.split(sep).map(s => s.trim());
          return { char: c[0], meaning: c[1], onyomi: (c[2] || '').split(',').map(s => s.trim()).filter(Boolean), kunyomi: (c[3] || '').split(',').map(s => s.trim()).filter(Boolean), strokes: parseInt(c[4] || '0') || 0, story: c[5] || '', level: lv, examples: [] } as any;
        });
        this.customData.addKanjiBatch(items); count = items.length;
      } else if (this.entryType() === 'partikel') {
        const items = lines.filter(l => { const c = l.split(sep); return c[0] && c[1]; }).map(l => {
          const c = l.split(sep).map(s => s.trim());
          const exPart = c[4];
          const examples = exPart ? this.parseExamples(exPart, exs) : [];
          return { char: c[0], usage: c[1], explanation: c[2] || '', example: c[3] || '', level: lv, examples } as any;
        });
        this.customData.addParticleBatch(items); count = items.length;
      } else if (this.entryType() === 'bunpou') {
        const items = lines.filter(l => { const c = l.split(sep); return c[0] && c[1] && c[2]; }).map(l => {
          const c = l.split(sep).map(s => s.trim());
          const exPart = c[3];
          const examples = exPart ? this.parseExamples(exPart, exs) : [];
          return { title: c[0], formula: c[1], explanation: c[2], level: lv, examples } as any;
        });
        this.customData.addGrammarBatch(items); count = items.length;
      }

      this.batchText = '';
      this.showToast('success', `${count} ${this.typeLabel()} berhasil diimpor!`);
    } catch (e: any) { this.showToast('error', 'Gagal import: ' + e.message); }
  }

  private parseExamples(str: string, sep: string): { japanese: string; romaji: string; meaning: string }[] {
    const parts = str.split(sep).map(s => s.trim());
    if (parts.length < 3) return parts[0] ? [{ japanese: parts[0], romaji: parts[1] || '', meaning: parts[2] || '' }] : [];
    // group by 3
    const out = [];
    for (let i = 0; i < parts.length; i += 3) {
      if (parts[i]) out.push({ japanese: parts[i], romaji: parts[i+1] || '', meaning: parts[i+2] || '' });
    }
    return out;
  }

  // ── Example helpers ──
  addVocabExample() { this.v.examples = [...(this.v.examples || []), { japanese: '', romaji: '', meaning: '' }]; }
  removeVocabExample(i: number) { this.v.examples?.splice(i, 1); this.v.examples = [...(this.v.examples||[])]; }
  addKanjiExample() { this.k.examples = [...(this.k.examples || []), { word: '', reading: '', meaning: '' }]; }
  removeKanjiExample(i: number) { this.k.examples?.splice(i, 1); this.k.examples = [...(this.k.examples||[])]; }
  addParticleExample() { this.p.examples = [...(this.p.examples || []), { japanese: '', romaji: '', meaning: '' }]; }
  removeParticleExample(i: number) { this.p.examples?.splice(i, 1); this.p.examples = [...(this.p.examples||[])]; }
  addGrammarExample() { this.g.examples = [...(this.g.examples || []), { japanese: '', romaji: '', meaning: '' }]; }
  removeGrammarExample(i: number) { this.g.examples?.splice(i, 1); this.g.examples = [...(this.g.examples||[])]; }

  // ── Toast ──
  private toastTimer: any;
  showToast(type: 'success' | 'error', message: string) {
    this.toast.set({ type, message });
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(null), 3000);
  }

  // ── Fresh models ──
  freshVocab() { return { word:'', kana:'', meaning:'', category:'NOUN', tag:'', examples:[] as any[] }; }
  freshKanji() { return { char:'', meaning:'', _onyomiStr:'', _kunyomiStr:'', strokes:0, story:'', examples:[] as any[] }; }
  freshParticle() { return { char:'', usage:'', explanation:'', example:'', examples:[] as any[] }; }
  freshGrammar() { return { title:'', formula:'', explanation:'', examples:[] as any[] }; }
}
