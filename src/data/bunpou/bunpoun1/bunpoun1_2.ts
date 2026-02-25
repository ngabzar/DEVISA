
import { Grammar } from "../../../types";

export const bunpoun1_2: Grammar[] = [
  { 
    title: '~あっての (Atte no)', 
    formula: 'KB + あっての + KB', 
    explanation: 'Bisa eksis/sukses KARENA ada hal tersebut. Tanpa A, B tidak mungkin ada. Menunjukkan rasa syukur/pentingnya A.', 
    level: 'N1',
    examples: [
      { japanese: 'お客様あっての私たちです。', romaji: 'Okyakusama atte no watashitachi desu.', meaning: 'Kami ada karena adanya pelanggan.' },
      { japanese: '健康あっての仕事だ。無理をしてはいけない。', romaji: 'Kenkou atte no shigoto da. Muri o shite wa ikenai.', meaning: 'Pekerjaan itu ada karena kesehatan. Jangan memaksakan diri.' },
      { japanese: '日々の練習あっての勝利だ。', romaji: 'Hibi no renshuu atte no shouri da.', meaning: 'Kemenangan ini ada berkat latihan setiap hari.' }
    ]
  },
  { 
    title: '~極まりない (Kiwamarinai)', 
    formula: 'KS-Na(+な)/KS-I(I) + こと + 極まりない | KS-Na(tanpa na) + 極まりない', 
    explanation: 'Sangat... / Tak terhingga... (Biasanya untuk hal negatif atau kritis).', 
    level: 'N1',
    examples: [
      { japanese: '彼の態度は失礼極まりない。', romaji: 'Kare no taido wa shitsurei kiwamarinai.', meaning: 'Sikapnya sungguh sangat tidak sopan.' },
      { japanese: '危険極まりない行為だ。', romaji: 'Kiken kiwamarinai koui da.', meaning: 'Itu adalah tindakan yang sangat berbahaya.' },
      { japanese: 'その説明は不愉快極まりない。', romaji: 'Sono setsumei wa fuyukai kiwamarinai.', meaning: 'Penjelasan itu sangat tidak menyenangkan.' }
    ]
  },
  { 
    title: '~ごとき / ~ごとく (Gotoki / Gotoku)', 
    formula: 'KB + の + ごとき/ごとく | KK/Bentuk Biasa + が + ごとき/ごとく', 
    explanation: 'Seperti... (Kiasan/Formal). "Gotoki" memodifikasi kata benda, "Gotoku" memodifikasi kata kerja/sifat. Bisa juga merendahkan ("Saya yang seperti ini...").', 
    level: 'N1',
    examples: [
      { japanese: '光陰矢のごとし。', romaji: 'Kouin ya no gotoshi.', meaning: 'Waktu berlalu seperti anak panah (cepat sekali).' },
      { japanese: '私ごときがこのような大役を任されるとは光栄です。', romaji: 'Watashi gotoki ga kono you na taiyaku o makasareru to wa kouei desu.', meaning: 'Sungguh kehormatan bagi orang (rendahan) seperti saya diserahi tugas besar ini.' },
      { japanese: '彼は風のごとく去っていった。', romaji: 'Kare wa kaze no gotoku satte itta.', meaning: 'Dia pergi (menghilang) seperti angin.' }
    ]
  },
  { 
    title: '~始末だ (Shimatsu da)', 
    formula: 'KK(Kamus) + 始末だ / この/その/あの + 始末だ', 
    explanation: 'Akhirnya menjadi... (hasil yang buruk). Setelah proses negatif, berakhir dengan keadaan menyedihkan ini.', 
    level: 'N1',
    examples: [
      { japanese: '彼は遊んでばかりいて、学校も辞めてしまう始末だ。', romaji: 'Kare wa asonde bakari ite, gakkou mo yamete shimau shimatsu da.', meaning: 'Dia main melulu, akhirnya sampai berhenti sekolah.' },
      { japanese: '息子は家出をして、警察に補導される始末だ。', romaji: 'Musuko wa iede o shite, keisatsu ni hodou sareru shimatsu da.', meaning: 'Anaknya kabur dari rumah, dan akhirnya diamankan polisi.' },
      { japanese: '昨日は飲みすぎて、駅のベンチで寝てしまう始末だった。', romaji: 'Kinou wa nomisugite, eki no benchi de nete shimau shimatsu datta.', meaning: 'Kemarin minum terlalu banyak, akhirnya malah tidur di bangku stasiun.' }
    ]
  },
  { 
    title: '~ずくめ (Zukume)', 
    formula: 'KB + ずくめ', 
    explanation: 'Penuh dengan... / Semuanya... (Biasanya hal yang baik atau mencolok).', 
    level: 'N1',
    examples: [
      { japanese: '黒ずくめの服を着た男。', romaji: 'Kurozukume no fuku o kita otoko.', meaning: 'Pria yang berpakaian serba hitam.' },
      { japanese: 'この旅行はいいことずくめだった。', romaji: 'Kono ryokou wa ii koto zukume datta.', meaning: 'Perjalanan ini penuh dengan hal-hal baik.' },
      { japanese: '幸せずくめの人生なんてない。', romaji: 'Shiawase zukume no jinsei nante nai.', meaning: 'Tidak ada hidup yang isinya bahagia melulu.' }
    ]
  }
];
