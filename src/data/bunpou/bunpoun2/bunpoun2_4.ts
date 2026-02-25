
import { Grammar } from "../../../types";

export const bunpoun2_4: Grammar[] = [
  { 
    title: '~につき (Ni tsuki)', 
    formula: 'KB + につき', 
    explanation: 'Dikarenakan... (Sangat formal, sering di papan pengumuman/surat).', 
    level: 'N2',
    examples: [
      { japanese: '工事中につき、立ち入り禁止。', romaji: 'Koujichuu ni tsuki, tachiiri kinshi.', meaning: 'Dikarenakan sedang ada konstruksi, dilarang masuk.' },
      { japanese: '本日は定休日につき、休みます。', romaji: 'Honjitsu wa teikyubi ni tsuki, yasumimasu.', meaning: 'Dikarenakan hari ini libur reguler, kami tutup.' },
      { japanese: '冷房中につき、ドアを閉めてください。', romaji: 'Reibouchuu ni tsuki, doa o shimete kudasai.', meaning: 'Dikarenakan ber-AC, tolong tutup pintunya.' }
    ]
  },
  { 
    title: '~ことだし (Koto da shi)', 
    formula: 'Bentuk Biasa + ことだし', 
    explanation: 'Karena... (dan mungkin ada alasan lain juga). Sedikit lebih formal/halus dari "shi".', 
    level: 'N2',
    examples: [
      { japanese: '雨もやんだことだし、そろそろ帰りましょう。', romaji: 'Ame mo yanda koto da shi, sorosoro kaerimashou.', meaning: 'Karena hujan juga sudah berhenti, ayo kita pulang.' },
      { japanese: 'お金もないことだし、今日は真っ直ぐ帰るよ。', romaji: 'Okane mo nai koto da shi, kyou wa massugu kaeru yo.', meaning: 'Karena uang juga tidak ada, hari ini aku langsung pulang.' },
      { japanese: '皆さんもお疲れのことだし、少し休憩しましょう。', romaji: 'Minasan mo otsukare no koto da shi, sukoshi kyuukei shimashou.', meaning: 'Karena semuanya juga sudah lelah, ayo istirahat sebentar.' }
    ]
  },
  { 
    title: '~おかげか (Okage ka)', 
    formula: 'Bentuk Biasa + おかげか', 
    explanation: 'Mungkin berkat... (Menduga penyebab positif, tapi tidak 100% yakin).', 
    level: 'N2',
    examples: [
      { japanese: '毎日運動したおかげか、最近体の調子がいい。', romaji: 'Mainichi undou shita okage ka, saikin karada no choushi ga ii.', meaning: 'Mungkin berkat olahraga setiap hari, akhir-akhir ini kondisi badan saya bagus.' },
      { japanese: '薬を飲んだおかげか、熱が下がった。', romaji: 'Kusuri o nonda okage ka, netsu ga sagatta.', meaning: 'Mungkin berkat minum obat, demam saya turun.' }
    ]
  },
  { 
    title: '~せいか (Sei ka)', 
    formula: 'Bentuk Biasa + せいか', 
    explanation: 'Mungkin gara-gara... (Menduga penyebab negatif/buruk).', 
    level: 'N2',
    examples: [
      { japanese: 'きのう飲みすぎたせいか、頭が痛い。', romaji: 'Kinou nomisugita sei ka, atama ga itai.', meaning: 'Mungkin gara-gara kemarin kebanyakan minum, kepala saya sakit.' },
      { japanese: '年のせいか、最近忘れっぽくなった。', romaji: 'Toshi no sei ka, saikin wasureppoku natta.', meaning: 'Mungkin gara-gara faktor usia, akhir-akhir ini jadi pelupa.' },
      { japanese: '暑さのせいか、食欲がない。', romaji: 'Atsusa no sei ka, shokuyoku ga nai.', meaning: 'Mungkin gara-gara panas, saya tidak nafsu makan.' }
    ]
  },
  { 
    title: '~ばかりに (Bakari ni)', 
    formula: 'Bentuk Biasa + ばかりに', 
    explanation: 'Hanya karena (sebab sepele/satu hal), akibatnya jadi buruk sekali (Penyesalan).', 
    level: 'N2',
    examples: [
      { japanese: '嘘をついたばかりに、彼に嫌われてしまった。', romaji: 'Uso o tsuita bakari ni, kare ni kirawarete shimatta.', meaning: 'Hanya gara-gara berbohong, saya jadi dibenci olehnya.' },
      { japanese: 'お金がないばかりに、進学をあきらめた。', romaji: 'Okane ga nai bakari ni, shingaku o akirameta.', meaning: 'Hanya gara-gara tidak punya uang, saya menyerah melanjutkan sekolah.' },
      { japanese: '日本語が下手なばかりに、苦労しました。', romaji: 'Nihongo ga heta na bakari ni, kurou shimashita.', meaning: 'Hanya gara-gara bahasa Jepang saya jelek, saya jadi kesusahan.' }
    ]
  }
];
