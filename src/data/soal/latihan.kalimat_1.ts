
import { Question } from "../../types";

export const latihan_kalimat_1: Question[] = [
  {
    q: "Terjemahkan ke Bahasa Jepang (Romaji):\n\"Saya adalah siswa.\"",
    correctAnswers: ["watashi wa gakusei desu", "watashi wa gakusei desu."],
    type: "SENTENCE",
    inputType: "ESSAY",
    explanation: "✅ **Watashi wa gakusei desu**\n\n**Struktur:**\n[Topik] + WA + [Predikat] + DESU\n- **Watashi (Saya):** Topik kalimat.\n- **Wa:** Partikel penanda topik.\n- **Gakusei (Siswa):** Kata benda predikat.\n- **Desu:** Kopula sopan (penutup kalimat positif)."
  },
  {
    q: "Terjemahkan ke Bahasa Jepang (Romaji):\n\"Yamada adalah guru.\"",
    correctAnswers: ["yamada san wa sensei desu", "yamadasan wa sensei desu"],
    type: "SENTENCE",
    inputType: "ESSAY",
    explanation: "✅ **Yamada-san wa sensei desu**\n\n**Poin Penting:**\n- **-San:** Saat menyebut nama orang lain, WAJIB menambahkan gelar kehormatan '-san' agar sopan.\n- **Sensei:** Guru."
  },
  {
    q: "Terjemahkan ke Bahasa Jepang (Romaji):\n\"Bukan orang Jepang.\"",
    correctAnswers: ["nihonjin dewa arimasen", "nihonjin ja arimasen", "nihonjin ja nai desu"],
    type: "SENTENCE",
    inputType: "ESSAY",
    explanation: "✅ **Nihonjin dewa arimasen**\n\n**Bentuk Negatif Kalimat Benda:**\n- Formal: **Dewa arimasen**\n- Percakapan: **Ja arimasen**\n- Kasual: **Ja nai**\n- **Nihonjin:** Orang Jepang (Negara + Jin)."
  },
  {
    q: "Terjemahkan ke Bahasa Jepang (Romaji):\n\"Apakah Anda seorang dokter?\"",
    correctAnswers: ["anata wa isha desu ka", "isha desu ka"],
    type: "SENTENCE",
    inputType: "ESSAY",
    explanation: "✅ **(Anata wa) isha desu ka**\n\n**Kalimat Tanya:**\n- Tambahkan partikel **KA** di akhir kalimat positif.\n- Tanda tanya (?) tidak wajib dalam tulisan Jepang formal (diganti titik), tapi 'KA' wajib ada.\n- Subjek 'Anata' sering dihilangkan jika konteksnya jelas."
  },
  {
    q: "Terjemahkan ke Bahasa Indonesia:\n\"Watashi wa kaishain desu.\"",
    correctAnswers: ["saya pegawai perusahaan", "saya adalah karyawan", "aku pegawai kantor", "saya karyawan"],
    type: "SENTENCE",
    inputType: "ESSAY",
    explanation: "✅ **Saya adalah pegawai perusahaan/karyawan.**\n\n**Kosakata:**\n- **Kaishain:** Pegawai perusahaan (Company employee). Berbeda dengan 'Shain' yang harus diikuti nama perusahaan (misal: Google no shain)."
  },
  {
    q: "Terjemahkan ke Bahasa Jepang (Romaji):\n\"Santoso juga orang Indonesia.\"",
    correctAnswers: ["santoso san mo indoneshiajin desu", "santoso san mo indoneshia jin desu"],
    type: "SENTENCE",
    inputType: "ESSAY",
    explanation: "✅ **Santoso-san mo Indoneshia-jin desu**\n\n**Partikel MO:**\n- Artinya 'Juga'.\n- Menggantikan partikel 'Wa' ketika predikatnya sama dengan topik sebelumnya.\n- Jangan lupa '-san' untuk nama orang."
  },
  {
    q: "Terjemahkan ke Bahasa Jepang (Romaji):\n\"Ayu bukan mahasiswa.\"",
    correctAnswers: ["ayu san wa daigakusei dewa arimasen", "ayu san wa gakusei dewa arimasen"],
    type: "SENTENCE",
    inputType: "ESSAY",
    explanation: "✅ **Ayu-san wa daigakusei dewa arimasen**\n\n**Kosakata:**\n- **Daigakusei:** Mahasiswa (Universitas).\n- **Gakusei:** Siswa (Umum).\n- Negatif sopan: Dewa arimasen."
  },
  {
    q: "Terjemahkan ke Bahasa Indonesia:\n\"Ano kata wa donata desu ka.\"",
    correctAnswers: ["orang itu siapa", "siapakah orang itu", "beliau siapa", "siapa beliau"],
    type: "SENTENCE",
    inputType: "ESSAY",
    explanation: "✅ **Siapakah orang (beliau) itu?**\n\n**Tingkat Kesopanan (Keigo):**\n- **Ano hito / Dare:** Bentuk biasa/standar.\n- **Ano kata / Donata:** Bentuk sopan (Hormat). Digunakan di situasi formal atau bisnis."
  }
];
