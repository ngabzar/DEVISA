
import { Grammar } from "../../../types";

export const bunpoun3_3: Grammar[] = [
  { 
    title: '~くらいなら (Kurai nara)', 
    formula: 'KK(Kamus) + くらいなら', 
    explanation: 'Daripada melakukan A (hal yang sangat tidak disukai), lebih baik B.', 
    level: 'N3',
    examples: [
      { japanese: 'あきらめるくらいなら、死んだほうがましだ。', romaji: 'Akirameru kurai nara, shinda hou ga mashi da.', meaning: 'Daripada menyerah, lebih baik mati.' },
      { japanese: '彼にお金を貸すくらいなら、捨てたほうがいい。', romaji: 'Kare ni okane o kasu kurai nara, suteta hou ga ii.', meaning: 'Daripada meminjamkan uang padanya, lebih baik dibuang.' },
      { japanese: '満員電車に乗るくらいなら、歩いて行きます。', romaji: 'Manin densha ni noru kurai nara, aruite ikimasu.', meaning: 'Daripada naik kereta penuh sesak, saya akan jalan kaki.' }
    ]
  },
  { 
    title: '~に限る (Ni kagiru)', 
    formula: 'KK/KB + に限る', 
    explanation: 'Yang terbaik adalah... / Paling bagus... (Pendapat pribadi yang kuat).', 
    level: 'N3',
    examples: [
      { japanese: '夏はビールに限る。', romaji: 'Natsu wa biiru ni kagiru.', meaning: 'Kalau musim panas paling enak minum bir.' },
      { japanese: '風邪を引いたときは、寝るに限る。', romaji: 'Kaze o hiita toki wa, neru ni kagiru.', meaning: 'Saat masuk angin, yang terbaik adalah tidur.' },
      { japanese: '古い都なら、京都に限ります。', romaji: 'Furui miyako nara, Kyouto ni kagirimasu.', meaning: 'Kalau bicara soal kota tua, tidak ada yang mengalahkan Kyoto.' }
    ]
  },
  { 
    title: '~に対して (Ni taishite)', 
    formula: 'KB + に対して', 
    explanation: 'Terhadap / Kepada / Berlawanan dengan.', 
    level: 'N3',
    examples: [
      { japanese: '目上の人に対しては、敬語を使います。', romaji: 'Meue no hito ni taishite wa, keigo o tsukaimasu.', meaning: 'Terhadap atasan, gunakanlah bahasa hormat.' },
      { japanese: '活発な姉に対して、妹は静かだ。', romaji: 'Kappatsu na ane ni taishite, imouto wa shizuka da.', meaning: 'Berlawanan dengan kakaknya yang aktif, adiknya pendiam.' },
      { japanese: 'お客様に対して、失礼なことを言ってはいけません。', romaji: 'Okyakusama ni taishite, shitsurei na koto o itte wa ikemasen.', meaning: 'Tidak boleh berkata kasar kepada pelanggan.' }
    ]
  },
  { 
    title: '~反面 (Hanmen)', 
    formula: 'Bentuk Biasa + 反面', 
    explanation: 'Di satu sisi A, tapi di sisi lain B (berlawanan).', 
    level: 'N3',
    examples: [
      { japanese: '都会の生活は便利な反面、人が多くて疲れる。', romaji: 'Tokai no seikatsu wa benri na hanmen, hito ga ookute tsukareru.', meaning: 'Kehidupan kota itu praktis, tapi di sisi lain melelahkan karena banyak orang.' },
      { japanese: 'この薬はよく効く反面、副作用も強い。', romaji: 'Kono kusuri wa yoku kiku hanmen, fukusage mo tsuyoi.', meaning: 'Obat ini sangat manjur, tapi di sisi lain efek sampingnya juga kuat.' },
      { japanese: '彼は優しい反面、厳しいところもある。', romaji: 'Kare wa yasashii hanmen, kibishii tokoro mo aru.', meaning: 'Dia baik hati, tapi di sisi lain ada bagian yang tegas juga.' }
    ]
  },
  { 
    title: '~一方 (Ippou)', 
    formula: 'Bentuk Biasa + 一方（で）', 
    explanation: 'Di satu sisi..., di sisi lain... (Membandingkan dua hal).', 
    level: 'N3',
    examples: [
      { japanese: '母は優しい一方で、父は厳しい。', romaji: 'Haha wa yasashii ippou de, chichi wa kibishii.', meaning: 'Ibu itu lembut, sedangkan Ayah tegas.' },
      { japanese: '子供が生まれてうれしい一方で、責任も感じる。', romaji: 'Kodomo ga umarete ureshii ippou de, sekinin mo kanjiru.', meaning: 'Saya senang anak lahir, tapi di sisi lain merasa bertanggung jawab.' }
    ]
  }
];
