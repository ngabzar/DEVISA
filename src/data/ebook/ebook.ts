// src/data/ebook/ebook.ts
// Database EBook untuk JavSensei
// Tambahkan ebook baru dengan menambahkan entry di array 'ebooks' di bawah
// Format file: Letakkan PDF di src/data/ebook/ebook1.pdf, ebook2.pdf, dst.
// Atau gunakan URL link langsung dari internet

export interface EBook {
  id: string;
  title: string;           // Judul buku
  titleJa?: string;        // Judul dalam bahasa Jepang (opsional)
  author: string;          // Penulis
  description: string;     // Deskripsi singkat
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'JFT' | 'ALL'; // Level target
  category: EBookCategory; // Kategori
  coverColor: string;      // Warna sampul (CSS gradient atau hex)
  coverEmoji: string;      // Emoji untuk ikon sampul
  fileType: 'PDF' | 'URL' | 'LOCAL'; // Tipe file
  source: string;          // Path file atau URL
  totalPages?: number;     // Jumlah halaman (opsional)
  language: 'ID' | 'JA' | 'EN' | 'BILINGUAL'; // Bahasa buku
  tags: string[];          // Tag untuk pencarian
  isFree: boolean;         // Gratis atau berbayar
  addedDate: string;       // Tanggal ditambahkan
  rating?: number;         // Rating 1-5 (opsional)
}

export type EBookCategory = 
  | 'GRAMMAR'       // Tata Bahasa
  | 'VOCABULARY'    // Kosakata
  | 'KANJI'         // Kanji
  | 'READING'       // Membaca
  | 'LISTENING'     // Mendengar
  | 'SPEAKING'      // Berbicara
  | 'JLPT_PREP'     // Persiapan JLPT
  | 'JFT_PREP'      // Persiapan JFT Basic
  | 'CULTURE'       // Budaya Jepang
  | 'BUSINESS'      // Bahasa Bisnis
  | 'CONVERSATION'  // Percakapan
  | 'WORKBOOK';     // Buku Latihan

// ================================================
// DATABASE EBOOK
// Tambahkan ebook Anda di sini
// ================================================
export const ebooks: EBook[] = [
  {
    id: 'ebook-001',
    title: 'Panduan Lengkap Tata Bahasa N5',
    titleJa: 'N5文法完全ガイド',
    author: 'Tim JavSensei',
    description: 'Panduan lengkap tata bahasa JLPT N5 dalam bahasa Indonesia, cocok untuk pemula yang baru memulai belajar bahasa Jepang.',
    level: 'N5',
    category: 'GRAMMAR',
    coverColor: 'from-rose-500 to-pink-600',
    coverEmoji: '📖',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook1.pdf',  // Letakkan file PDF di folder assets/ebooks/
    totalPages: 120,
    language: 'BILINGUAL',
    tags: ['grammar', 'N5', 'pemula', 'tata bahasa'],
    isFree: true,
    addedDate: '2025-01-01',
    rating: 4.5
  },
  {
    id: 'ebook-002',
    title: 'Kosakata N5 Sehari-hari',
    titleJa: 'N5日常語彙集',
    author: 'Tim JavSensei',
    description: '800+ kosakata N5 yang paling sering digunakan dalam kehidupan sehari-hari, dilengkapi contoh kalimat dan gambar ilustrasi.',
    level: 'N5',
    category: 'VOCABULARY',
    coverColor: 'from-blue-500 to-cyan-600',
    coverEmoji: '📚',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook2.pdf',
    totalPages: 80,
    language: 'BILINGUAL',
    tags: ['vocabulary', 'N5', 'kosakata', 'sehari-hari'],
    isFree: true,
    addedDate: '2025-01-15',
    rating: 4.3
  },
  {
    id: 'ebook-003',
    title: 'Kanji N5 dengan Cerita',
    titleJa: 'N5漢字ストーリー',
    author: 'Tim JavSensei',
    description: 'Pelajari 100 kanji N5 dengan metode cerita yang mudah diingat. Setiap kanji memiliki mnemonic dan contoh penggunaan.',
    level: 'N5',
    category: 'KANJI',
    coverColor: 'from-purple-500 to-indigo-600',
    coverEmoji: '字',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook3.pdf',
    totalPages: 100,
    language: 'BILINGUAL',
    tags: ['kanji', 'N5', 'mnemonic', 'cerita'],
    isFree: true,
    addedDate: '2025-02-01',
    rating: 4.7
  },
  {
    id: 'ebook-004',
    title: 'Percakapan Jepang untuk Kerja',
    titleJa: '職場の日本語会話',
    author: 'Tim JavSensei',
    description: 'Panduan percakapan bahasa Jepang untuk lingkungan kerja, meliputi salam, laporan kerja, dan situasi darurat.',
    level: 'N4',
    category: 'CONVERSATION',
    coverColor: 'from-emerald-500 to-teal-600',
    coverEmoji: '💬',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook4.pdf',
    totalPages: 150,
    language: 'BILINGUAL',
    tags: ['conversation', 'N4', 'kerja', 'workplace'],
    isFree: true,
    addedDate: '2025-02-15',
    rating: 4.6
  },
  {
    id: 'ebook-005',
    title: 'Persiapan JFT Basic Lengkap',
    titleJa: 'JFT-Basic完全対策',
    author: 'Tim JavSensei',
    description: 'Buku persiapan JFT Basic yang komprehensif dengan soal-soal latihan, tips strategi mengerjakan soal, dan simulasi ujian.',
    level: 'JFT',
    category: 'JFT_PREP',
    coverColor: 'from-orange-500 to-amber-600',
    coverEmoji: '🎯',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook5.pdf',
    totalPages: 200,
    language: 'BILINGUAL',
    tags: ['JFT', 'persiapan', 'ujian', 'soal latihan'],
    isFree: true,
    addedDate: '2025-03-01',
    rating: 4.8
  },
  {
    id: 'ebook-006',
    title: 'Tata Bahasa N4 - Pola Kalimat Lanjutan',
    titleJa: 'N4文法-発展パターン',
    author: 'Tim JavSensei',
    description: 'Penjelasan mendalam tentang pola kalimat N4 dengan fokus pada partikel gabungan dan bentuk kata kerja kompleks.',
    level: 'N4',
    category: 'GRAMMAR',
    coverColor: 'from-sky-500 to-blue-600',
    coverEmoji: '文',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook6.pdf',
    totalPages: 130,
    language: 'BILINGUAL',
    tags: ['grammar', 'N4', 'pola kalimat', 'partikel'],
    isFree: true,
    addedDate: '2025-03-15',
    rating: 4.4
  },
  {
    id: 'ebook-007',
    title: 'Kosakata N3 untuk JLPT',
    titleJa: 'JLPT N3単語集',
    author: 'Tim JavSensei',
    description: 'Koleksi 1500+ kosakata N3 yang sering muncul di ujian JLPT, dikelompokkan berdasarkan tema dan disertai contoh kalimat.',
    level: 'N3',
    category: 'VOCABULARY',
    coverColor: 'from-violet-500 to-purple-600',
    coverEmoji: '📝',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook7.pdf',
    totalPages: 180,
    language: 'BILINGUAL',
    tags: ['vocabulary', 'N3', 'JLPT', 'kosakata'],
    isFree: true,
    addedDate: '2025-04-01',
    rating: 4.5
  },
  {
    id: 'ebook-008',
    title: 'Bahasa Jepang Bisnis Tingkat Lanjut',
    titleJa: 'ビジネス日本語上級',
    author: 'Tim JavSensei',
    description: 'Panduan bahasa Jepang bisnis tingkat lanjut untuk pekerja asing, mencakup keigo, email bisnis, dan presentasi formal.',
    level: 'N2',
    category: 'BUSINESS',
    coverColor: 'from-slate-600 to-gray-700',
    coverEmoji: '💼',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook8.pdf',
    totalPages: 220,
    language: 'BILINGUAL',
    tags: ['business', 'N2', 'keigo', 'email bisnis'],
    isFree: true,
    addedDate: '2025-04-15',
    rating: 4.9
  },
  {
    id: 'ebook-009',
    title: 'Kanji N3 - 300 Kanji Penting',
    titleJa: 'N3漢字300選',
    author: 'Tim JavSensei',
    description: '300 kanji N3 yang paling penting dengan penjelasan komprehensif termasuk on\'yomi, kun\'yomi, dan contoh kalimat.',
    level: 'N3',
    category: 'KANJI',
    coverColor: 'from-red-500 to-rose-600',
    coverEmoji: '漢',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook9.pdf',
    totalPages: 250,
    language: 'BILINGUAL',
    tags: ['kanji', 'N3', '300 kanji', 'onyomi', 'kunyomi'],
    isFree: true,
    addedDate: '2025-05-01',
    rating: 4.6
  },
  {
    id: 'ebook-010',
    title: 'Budaya Kerja Jepang untuk TKI',
    titleJa: '外国人労働者のための職場文化',
    author: 'Tim JavSensei',
    description: 'Panduan praktis memahami budaya kerja Jepang, termasuk etika kerja, komunikasi dengan atasan, dan kehidupan sehari-hari di Jepang.',
    level: 'ALL',
    category: 'CULTURE',
    coverColor: 'from-pink-500 to-fuchsia-600',
    coverEmoji: '🏮',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook10.pdf',
    totalPages: 160,
    language: 'ID',
    tags: ['budaya', 'kerja', 'TKI', 'etika', 'Jepang'],
    isFree: true,
    addedDate: '2025-05-15',
    rating: 4.7
  },
  {
    id: 'ebook-011',
    title: 'Simulasi JLPT N2 - 5 Paket Soal',
    titleJa: 'N2模擬試験5回分',
    author: 'Tim JavSensei',
    description: '5 paket soal simulasi JLPT N2 lengkap dengan kunci jawaban dan pembahasan detail untuk setiap soal.',
    level: 'N2',
    category: 'JLPT_PREP',
    coverColor: 'from-indigo-500 to-blue-600',
    coverEmoji: '✏️',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook11.pdf',
    totalPages: 300,
    language: 'BILINGUAL',
    tags: ['JLPT', 'N2', 'simulasi', 'soal ujian'],
    isFree: true,
    addedDate: '2025-06-01',
    rating: 4.8
  },
  {
    id: 'ebook-012',
    title: 'Tata Bahasa N2 Komprehensif',
    titleJa: 'N2文法総合',
    author: 'Tim JavSensei',
    description: 'Penjelasan mendalam semua pola tata bahasa N2 dengan perbandingan bentuk serupa yang sering membingungkan.',
    level: 'N2',
    category: 'GRAMMAR',
    coverColor: 'from-teal-500 to-cyan-600',
    coverEmoji: '📐',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook12.pdf',
    totalPages: 280,
    language: 'BILINGUAL',
    tags: ['grammar', 'N2', 'tata bahasa', 'komprehensif'],
    isFree: true,
    addedDate: '2025-06-15',
    rating: 4.9
  },
  {
    id: 'ebook-013',
    title: 'Latihan Membaca JLPT N3',
    titleJa: 'N3読解練習',
    author: 'Tim JavSensei',
    description: 'Kumpulan teks bacaan level N3 dengan pertanyaan pemahaman dan strategi menjawab soal membaca ujian JLPT.',
    level: 'N3',
    category: 'READING',
    coverColor: 'from-green-500 to-emerald-600',
    coverEmoji: '📰',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook13.pdf',
    totalPages: 190,
    language: 'BILINGUAL',
    tags: ['reading', 'N3', 'membaca', 'JLPT'],
    isFree: true,
    addedDate: '2025-07-01',
    rating: 4.4
  },
  {
    id: 'ebook-014',
    title: 'Panduan JLPT N1 - Kosakata & Kanji',
    titleJa: 'N1語彙・漢字完全攻略',
    author: 'Tim JavSensei',
    description: 'Panduan komprehensif kosakata dan kanji N1 dengan strategi belajar efektif dan peta konsep untuk memahami pola.',
    level: 'N1',
    category: 'JLPT_PREP',
    coverColor: 'from-yellow-500 to-orange-600',
    coverEmoji: '🏆',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook14.pdf',
    totalPages: 350,
    language: 'BILINGUAL',
    tags: ['N1', 'JLPT', 'kosakata', 'kanji', 'advanced'],
    isFree: true,
    addedDate: '2025-07-15',
    rating: 4.8
  },
  {
    id: 'ebook-015',
    title: 'Percakapan Sehari-hari N5',
    titleJa: 'N5日常会話',
    author: 'Tim JavSensei',
    description: 'Dialog percakapan sehari-hari level N5 dengan audio QR code, cocok untuk pemula yang ingin langsung bisa berbicara.',
    level: 'N5',
    category: 'CONVERSATION',
    coverColor: 'from-cyan-500 to-sky-600',
    coverEmoji: '🗣️',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook15.pdf',
    totalPages: 100,
    language: 'BILINGUAL',
    tags: ['conversation', 'N5', 'percakapan', 'dialog'],
    isFree: true,
    addedDate: '2025-08-01',
    rating: 4.6
  },
  {
    id: 'ebook-016',
    title: 'Latihan Soal Partikel N5-N3',
    titleJa: '助詞練習問題集',
    author: 'Tim JavSensei',
    description: 'Buku latihan soal partikel bahasa Jepang dari level N5 hingga N3, dengan penjelasan mendalam penggunaan setiap partikel.',
    level: 'N3',
    category: 'WORKBOOK',
    coverColor: 'from-amber-500 to-yellow-600',
    coverEmoji: '✍️',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook16.pdf',
    totalPages: 140,
    language: 'BILINGUAL',
    tags: ['partikel', 'N5', 'N4', 'N3', 'latihan'],
    isFree: true,
    addedDate: '2025-08-15',
    rating: 4.5
  },
  {
    id: 'ebook-017',
    title: 'Cara Cepat Belajar Hiragana & Katakana',
    titleJa: 'ひらがな・カタカナ速習法',
    author: 'Tim JavSensei',
    description: 'Panduan belajar hiragana dan katakana dalam 1 minggu dengan metode asosiasi gambar dan latihan menulis.',
    level: 'N5',
    category: 'WORKBOOK',
    coverColor: 'from-rose-400 to-pink-500',
    coverEmoji: 'あ',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook17.pdf',
    totalPages: 60,
    language: 'ID',
    tags: ['hiragana', 'katakana', 'N5', 'pemula', 'cepat'],
    isFree: true,
    addedDate: '2025-09-01',
    rating: 4.9
  },
  {
    id: 'ebook-018',
    title: 'Keigo - Bahasa Sopan Jepang',
    titleJa: '敬語完全マスター',
    author: 'Tim JavSensei',
    description: 'Panduan lengkap keigo (bahasa sopan) Jepang: sonkeigo, kenjougo, teineigo. Dilengkapi dengan konteks penggunaan dan contoh dialog.',
    level: 'N2',
    category: 'BUSINESS',
    coverColor: 'from-purple-600 to-violet-700',
    coverEmoji: '🎎',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook18.pdf',
    totalPages: 200,
    language: 'BILINGUAL',
    tags: ['keigo', 'sopan', 'bisnis', 'N2', 'N3'],
    isFree: true,
    addedDate: '2025-09-15',
    rating: 4.7
  },
  {
    id: 'ebook-019',
    title: 'Persiapan Wawancara Kerja di Jepang',
    titleJa: '就職面接完全対策',
    author: 'Tim JavSensei',
    description: 'Panduan wawancara kerja di Jepang untuk tenaga kerja asing, dari persiapan dokumen hingga cara menjawab pertanyaan sulit.',
    level: 'ALL',
    category: 'BUSINESS',
    coverColor: 'from-slate-500 to-zinc-600',
    coverEmoji: '💡',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook19.pdf',
    totalPages: 170,
    language: 'ID',
    tags: ['wawancara', 'kerja', 'mensetsu', 'TKI', 'persiapan'],
    isFree: true,
    addedDate: '2025-10-01',
    rating: 4.8
  },
  {
    id: 'ebook-020',
    title: 'Kosakata N1 - Kata-kata Tingkat Lanjut',
    titleJa: 'N1語彙 上級単語集',
    author: 'Tim JavSensei',
    description: 'Koleksi kosakata N1 tingkat lanjut dengan penjelasan nuansa makna, konteks penggunaan, dan perbedaan kata serupa.',
    level: 'N1',
    category: 'VOCABULARY',
    coverColor: 'from-gold-500 to-yellow-600',
    coverEmoji: '🌟',
    fileType: 'LOCAL',
    source: '/assets/ebooks/ebook20.pdf',
    totalPages: 320,
    language: 'BILINGUAL',
    tags: ['vocabulary', 'N1', 'advanced', 'kosakata tingkat lanjut'],
    isFree: true,
    addedDate: '2025-10-15',
    rating: 4.9
  }
];

// ================================================
// HELPER FUNCTIONS
// ================================================

// Filter ebook berdasarkan level
export function getEbooksByLevel(level: string): EBook[] {
  if (level === 'ALL') return ebooks;
  return ebooks.filter(e => e.level === level || e.level === 'ALL');
}

// Filter ebook berdasarkan kategori
export function getEbooksByCategory(category: EBookCategory): EBook[] {
  return ebooks.filter(e => e.category === category);
}

// Pencarian ebook
export function searchEbooks(query: string): EBook[] {
  const q = query.toLowerCase();
  return ebooks.filter(e => 
    e.title.toLowerCase().includes(q) ||
    e.titleJa?.includes(q) ||
    e.description.toLowerCase().includes(q) ||
    e.author.toLowerCase().includes(q) ||
    e.tags.some(t => t.toLowerCase().includes(q)) ||
    e.category.toLowerCase().includes(q) ||
    e.level.toLowerCase().includes(q)
  );
}

// Mendapatkan ebook berdasarkan ID
export function getEbookById(id: string): EBook | undefined {
  return ebooks.find(e => e.id === id);
}

// Fungsi untuk menambahkan ebook dari URL eksternal (dinamis)
export function createExternalEbook(
  id: string,
  title: string,
  url: string,
  level: EBook['level'],
  category: EBookCategory,
  description: string = '',
  author: string = 'Sumber Eksternal'
): EBook {
  return {
    id,
    title,
    author,
    description,
    level,
    category,
    coverColor: 'from-gray-500 to-slate-600',
    coverEmoji: '🔗',
    fileType: 'URL',
    source: url,
    language: 'BILINGUAL',
    tags: [level, category.toLowerCase()],
    isFree: true,
    addedDate: new Date().toISOString().split('T')[0]
  };
}

// Kategori dengan label Indonesia
export const categoryLabels: Record<EBookCategory, string> = {
  'GRAMMAR': 'Tata Bahasa',
  'VOCABULARY': 'Kosakata',
  'KANJI': 'Kanji',
  'READING': 'Membaca',
  'LISTENING': 'Mendengar',
  'SPEAKING': 'Berbicara',
  'JLPT_PREP': 'Persiapan JLPT',
  'JFT_PREP': 'Persiapan JFT',
  'CULTURE': 'Budaya',
  'BUSINESS': 'Bisnis',
  'CONVERSATION': 'Percakapan',
  'WORKBOOK': 'Buku Latihan'
};
