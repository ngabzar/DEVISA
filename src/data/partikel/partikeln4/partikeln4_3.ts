import { Particle } from "../../../types";

export const partikeln4_3: Particle[] = [
  { 
    char: 'より (Yori)', 
    usage: 'Perbandingan (Daripada)', 
    explanation: 'Digunakan dalam kalimat perbandingan untuk menandai standar pembandingnya (daripada X).', 
    example: 'バスより電車のほうが速いです (Kereta lebih cepat daripada bus).', 
    level: 'N4',
    examples: [
      { japanese: '今日は昨日より暑いです。', romaji: 'Kyou wa kinou yori atsui desu.', meaning: 'Hari ini lebih panas daripada kemarin.' },
      { japanese: '日本より広いです。', romaji: 'Nihon yori hiroi desu.', meaning: 'Lebih luas daripada Jepang.' },
      { japanese: '肉より魚が好きです。', romaji: 'Niku yori sakana ga suki desu.', meaning: 'Saya lebih suka ikan daripada daging.' },
      { japanese: '誰より美しいです。', romaji: 'Dare yori utsukushii desu.', meaning: 'Lebih cantik daripada siapapun.' },
      { japanese: '花より団子。', romaji: 'Hana yori dango.', meaning: 'Dango lebih baik daripada bunga (Lebih mementingkan isi/kenyang daripada estetika).' }
    ]
  },
  { 
    char: 'ほど (Hodo)', 
    usage: 'Kira-kira / Batas', 
    explanation: 'Menunjukkan perkiraan jumlah/waktu (seperti "gurai").', 
    example: '1時間ほど待ちました (Menunggu kira-kira 1 jam).', 
    level: 'N4',
    examples: [
      { japanese: '駅まで１０分ほどかかります。', romaji: 'Eki made juppun hodo kakarimasu.', meaning: 'Memakan waktu kira-kira 10 menit sampai stasiun.' },
      { japanese: '３人ほど来ました。', romaji: 'Sannin hodo kimashita.', meaning: 'Datang kira-kira 3 orang.' },
      { japanese: '死ぬほど疲れました。', romaji: 'Shinu hodo tsukaremashita.', meaning: 'Lelah setengah mati (lelah sampai batas mau mati).' },
      { japanese: '山ほど宿題があります。', romaji: 'Yama hodo shukudai ga arimasu.', meaning: 'Ada PR sebanyak gunung.' },
      { japanese: '泣きたいほど嬉しいです。', romaji: 'Nakitai hodo ureshii desu.', meaning: 'Senang sampai rasanya ingin menangis.' }
    ]
  },
  { 
    char: 'ほど (Hodo)', 
    usage: 'Tidak se- (Negatif)', 
    explanation: 'Dalam kalimat negatif, berarti "Tidak se...". Menunjukkan bahwa subjek tidak mencapai tingkat standar pembanding.', 
    example: '今年は去年ほど暑くないです (Tahun ini tidak sepanas tahun lalu).', 
    level: 'N4',
    examples: [
      { japanese: '英語は日本語ほど難しくないです。', romaji: 'Eigo wa Nihongo hodo muzukashiku nai desu.', meaning: 'Bahasa Inggris tidak sesulit bahasa Jepang.' },
      { japanese: '彼は私ほど背が高くありません。', romaji: 'Kare wa watashi hodo se ga takaku arimasen.', meaning: 'Dia tidak setinggi saya.' },
      { japanese: '週末ほど人が多くないです。', romaji: 'Shuumatsu hodo hito ga ooku nai desu.', meaning: 'Orangnya tidak sebanyak saat akhir pekan.' },
      { japanese: 'それほどでもないです。', romaji: 'Sore hodo demo nai desu.', meaning: 'Tidak sampai sebegitunya kok (merendah saat dipuji).' },
      { japanese: '痛いですが、泣くほどではありません。', romaji: 'Itai desu ga, naku hodo dewa arimasen.', meaning: 'Sakit sih, tapi tidak sampai (selevel) nangis.' }
    ]
  }
];