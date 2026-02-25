
import { Grammar } from "../../../types";

export const bunpoun3_4: Grammar[] = [
  { 
    title: '~というより (To iu yori)', 
    formula: 'Frasa A + というより + Frasa B', 
    explanation: 'Daripada dibilang A, lebih tepatnya B.', 
    level: 'N3',
    examples: [
      { japanese: '彼は先生というより、友達みたいだ。', romaji: 'Kare wa sensei to iu yori, tomodachi mitai da.', meaning: 'Dia itu daripada dibilang guru, lebih mirip teman.' },
      { japanese: '涼しいというより、寒いです。', romaji: 'Suzushii to iu yori, samui desu.', meaning: 'Daripada dibilang sejuk, ini sih dingin.' },
      { japanese: 'あの人は歩くのが速い。歩くというより走っているようだ。', romaji: 'Ano hito wa aruku no ga hayai. Aruku to iu yori hashitte iru you da.', meaning: 'Orang itu jalannya cepat. Daripada jalan, lebih seperti lari.' }
    ]
  },
  { 
    title: '~かわりに (Kawari ni)', 
    formula: 'KK(Kamus)/KB+の + かわりに', 
    explanation: 'Sebagai ganti / Sebagai imbalan.', 
    level: 'N3',
    examples: [
      { japanese: '日曜日に働いたかわりに、月曜日休みました。', romaji: 'Nichiyoubi ni hataraita kawari ni, getsuyoubi yasumimashita.', meaning: 'Sebagai ganti bekerja di hari Minggu, saya libur di hari Senin.' },
      { japanese: '英語を教えてもらうかわりに、日本語を教えます。', romaji: 'Eigo o oshiete morau kawari ni, Nihongo o oshiemasu.', meaning: 'Sebagai imbalan diajari bahasa Inggris, saya akan mengajar bahasa Jepang.' },
      { japanese: '母のかわりに、私が買い物に行きます。', romaji: 'Haha no kawari ni, watashi ga kaimono ni ikimasu.', meaning: 'Saya akan pergi belanja menggantikan Ibu.' }
    ]
  },
  { 
    title: '~ため（に） (Tame ni) - Sebab', 
    formula: 'Bentuk Biasa + ため（に）', 
    explanation: 'Karena / Disebabkan oleh (Formal, Objektif).', 
    level: 'N3',
    examples: [
      { japanese: '大雪のため、電車が遅れました。', romaji: 'Ooyuki no tame, densha ga okuremashita.', meaning: 'Kereta terlambat dikarenakan salju lebat.' },
      { japanese: '事故のため、通行止めです。', romaji: 'Jiko no tame, tsuukoudome desu.', meaning: 'Jalan ditutup dikarenakan kecelakaan.' },
      { japanese: '風邪のため、欠席します。', romaji: 'Kaze no tame, kesseki shimasu.', meaning: 'Saya absen dikarenakan flu.' }
    ]
  },
  { 
    title: '~によって (Ni yotte) - Sebab', 
    formula: 'KB + によって', 
    explanation: 'Disebabkan oleh (Formal).', 
    level: 'N3',
    examples: [
      { japanese: '不注意によって、火事が起きました。', romaji: 'Fuchuui ni yotte, kaji ga okimashita.', meaning: 'Kebakaran terjadi disebabkan oleh kecerobohan.' },
      { japanese: '台風によって、木が倒れました。', romaji: 'Taifuu ni yotte, ki ga taoremashita.', meaning: 'Pohon tumbang disebabkan oleh topan.' }
    ]
  },
  { 
    title: '~から / ~ことから (Kara / Koto kara)', 
    formula: 'Bentuk Biasa + ことから', 
    explanation: 'Karena (alasan penamaan atau asal usul).', 
    level: 'N3',
    examples: [
      { japanese: '道がぬれていることから、昨夜雨が降ったことがわかった。', romaji: 'Michi ga Nureteiru koto kara, sakuya ame ga futta koto ga wakatta.', meaning: 'Dari fakta jalannya basah, diketahui bahwa semalam turun hujan.' },
      { japanese: '顔が似ていることから、親子だとわかった。', romaji: 'Kao ga niteiru koto kara, oyako da to wakatta.', meaning: 'Karena wajahnya mirip, ketahuan kalau mereka orang tua dan anak.' }
    ]
  }
];
