

export interface Kanji {
  char: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  onyomi: string[];
  kunyomi: string[];
  meaning: string;
  strokes: number;
  story?: string; // Cerita / Mnemonic
  examples?: {    // Contoh penggunaan
    word: string;
    reading: string;
    meaning: string;
    sentence?: string;          // Contoh kalimat Jepang
    sentence_romaji?: string;   // Romaji kalimat
    sentence_meaning?: string;  // Arti kalimat
  }[];
}

export interface Vocab {
  word: string;
  kana: string;
  meaning: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'n5' | 'n4' | 'n3' | 'n2' | 'n1';
  category?: 'NOUN' | 'VERB' | 'ADJ' | 'OTHER' | 'ADJ-I' | 'ADJ-NA' | 'ADV' | 'CONJ' | 'PART' | 'PREFIX' | 'SUFFIX' | 'EXPR' | 'COUNTER' | 'AUX' | 'INTERJ' | 'NUM' | 'PN' | string; // Kategori untuk filter
  tag?: string; // Tag tambahan (daily, color, season, etc.)
  examples?: {  // Contoh kalimat
    japanese?: string;
    romaji?: string;
    meaning?: string;
  }[];
}

export interface Grammar {
  title: string;
  formula: string;
  explanation: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  // Legacy single example (optional support)
  example?: string;
  // New detailed examples structure
  examples?: {
    japanese: string;
    romaji: string;
    meaning: string;
  }[];
}

export interface Particle {
  char: string;
  usage: string;
  explanation?: string; // Penjelasan rinci
  example: string;      // Contoh singkat untuk list view
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  examples?: {          // 5 Contoh kalimat lengkap
    japanese: string;
    romaji: string;
    meaning: string;
  }[];
}

export interface Example {
  japanese: string;
  romaji?: string;   // optional now
  meaning?: string;  // optional if appropriate
}

export interface Kana {
  char: string;
  romaji: string;
  type: 'HIRAGANA' | 'KATAKANA';
  group: 'GOJUUON' | 'DAKUON' | 'HANDAKUON' | 'YOON';
}

export interface Question {
  q: string;
  q_romaji?: string; // Romaji version of the question, especially for questions with Kanji
  options?: string[]; // Untuk Pilihan Ganda
  correct?: number;   // Index jawaban benar (Pilihan Ganda)
  correctAnswers?: string[]; // Jawaban benar (Essay)
  type: 'KANA' | 'KANJI' | 'VOCAB' | 'JLPT_N5' | 'JLPT_N4' | 'JLPT_N3' | 'JFT_A2' | 'SENTENCE' | 'PARTICLE';
  inputType: 'CHOICE' | 'ESSAY'; // Tipe Input
  explanation?: string; // Penjelasan singkat
}
