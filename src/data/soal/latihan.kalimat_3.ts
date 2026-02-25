import { Question } from "../../types";

export const latihan_kalimat_3: Question[] = [
  {
    q: "Terjemahkan ke Bahasa Jepang (Romaji):\n\"Ada kucing.\"",
    correctAnswers: ["neko ga imasu"],
    type: "SENTENCE",
    inputType: "ESSAY",
    explanation: "Makhluk hidup menggunakan 'imasu'."
  },
  {
    q: "Terjemahkan ke Bahasa Jepang (Romaji):\n\"Ada uang.\"",
    correctAnswers: ["okane ga arimasu"],
    type: "SENTENCE",
    inputType: "ESSAY",
    explanation: "Benda mati menggunakan 'arimasu'."
  },
  {
    q: "Terjemahkan ke Bahasa Jepang (Romaji):\n\"Ada buku di atas meja.\"",
    correctAnswers: ["tsukue no ue ni hon ga arimasu", "hon wa tsukue no ue ni arimasu"],
    type: "SENTENCE",
    inputType: "ESSAY",
    explanation: "Tempat + ni + Benda + ga + arimasu."
  },
  {
    q: "Terjemahkan ke Bahasa Jepang (Romaji):\n\"Tanaka ada di kantor.\"",
    correctAnswers: ["tanaka san wa jimusho ni imasu", "tanaka san wa kaisha ni imasu"],
    type: "SENTENCE",
    inputType: "ESSAY",
    explanation: "Subjek + wa + Tempat + ni + imasu."
  },
  {
    q: "Terjemahkan ke Bahasa Jepang (Romaji):\n\"Toilet ada di mana?\"",
    correctAnswers: ["toire wa doko desu ka", "toire wa doko ni arimasu ka"],
    type: "SENTENCE",
    inputType: "ESSAY",
    explanation: "Doko = Di mana."
  },
  {
    q: "Terjemahkan ke Bahasa Indonesia:\n\"Asoko ni inu ga imasu.\"",
    correctAnswers: ["di sana ada anjing", "ada anjing di sana"],
    type: "SENTENCE",
    inputType: "ESSAY",
    explanation: "Asoko = Di sana (jauh). Inu = Anjing."
  },
  {
    q: "Terjemahkan ke Bahasa Jepang (Romaji):\n\"Di dalam kotak ada apel.\"",
    correctAnswers: ["hako no naka ni ringo ga arimasu"],
    type: "SENTENCE",
    inputType: "ESSAY",
    explanation: "Naka = Dalam. Ringo = Apel."
  },
  {
    q: "Terjemahkan ke Bahasa Jepang (Romaji):\n\"Tidak ada siapa-siapa.\"",
    correctAnswers: ["daremo imasen", "dare mo imasen"],
    type: "SENTENCE",
    inputType: "ESSAY",
    explanation: "Daremo + Negatif = Tidak ada siapapun."
  }
];