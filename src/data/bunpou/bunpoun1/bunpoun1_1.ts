
import { Grammar } from "../../../types";

export const bunpoun1_1: Grammar[] = [
  { 
    title: '~が早いか (Ga hayai ka)', 
    formula: 'KK(Kamus) + が早いか', 
    explanation: 'Segera setelah A terjadi, B langsung terjadi (hampir bersamaan). Sering digunakan dalam narasi atau deskripsi kejadian spontan.', 
    level: 'N1',
    examples: [
      { japanese: '授業終了のベルが鳴るが早いか、生徒たちは教室を飛び出した。', romaji: 'Jugyou shuuryou no beru ga naru ga hayai ka, seitotachi wa kyoushitsu o tobidashita.', meaning: 'Begitu bel tanda pelajaran selesai berbunyi, para siswa langsung berhamburan keluar kelas.' },
      { japanese: '彼は帰宅するが早いか、鞄を放り投げてゲームを始めた。', romaji: 'Kare wa kitaku suru ga hayai ka, kaban o hourinagete ge-mu ohajimeta.', meaning: 'Begitu pulang ke rumah, dia melempar tasnya dan mulai main game.' },
      { japanese: '彼女は僕の顔を見るが早いか、泣き出してしまった。', romaji: 'Kanojo wa boku no kao o miru ga hayai ka, nakidashite shimatta.', meaning: 'Begitu melihat wajahku, dia langsung menangis.' }
    ]
  },
  { 
    title: '~や / ~や否や (Ya / Ya ina ya)', 
    formula: 'KK(Kamus) + や / や否や', 
    explanation: 'Segera setelah... (Terjadi hal yang tiba-tiba/mengejutkan). Bersifat formal/tulisan.', 
    level: 'N1',
    examples: [
      { japanese: '選挙戦が始まるや否や、あちこちから立候補の声が上がった。', romaji: 'Senkyosen ga hajimaru ya ina ya, achikochi kara rikkouho no koe ga agatta.', meaning: 'Segera setelah masa kampanye dimulai, suara pencalonan terdengar dari sana-sini.' },
      { japanese: 'その男は警官の姿を見るや、逃げ出した。', romaji: 'Sono otoko wa keikan no sugata o miru ya, nigedashita.', meaning: 'Pria itu segera melarikan diri begitu melihat sosok polisi.' },
      { japanese: '空が暗くなるや否や、激しい雨が降り始めた。', romaji: 'Sora ga kuraku naru ya ina ya, hageshii ame ga furi-hajimeta.', meaning: 'Begitu langit menjadi gelap, hujan deras mulai turun.' }
    ]
  },
  { 
    title: '~なり (Nari)', 
    formula: 'KK(Kamus) + なり', 
    explanation: 'Segera setelah melakukan A, langsung melakukan B (biasanya subjek orang yang sama, seringkali mengejutkan/tidak biasa).', 
    level: 'N1',
    examples: [
      { japanese: '彼はコーヒーを一口飲むなり、吐き出してしまった。', romaji: 'Kare wa ko-hi- o hitokuchi nomu nari, hakidashite shimatta.', meaning: 'Begitu minum kopi seteguk, dia langsung memuntahkannya.' },
      { japanese: '課長は部屋に入ってくるなり、大声で怒鳴った。', romaji: 'Kachou wa heya ni haitte kuru nari, oogoe de donatta.', meaning: 'Kepala seksi begitu masuk ruangan langsung berteriak marah.' },
      { japanese: '子供は母親の顔を見るなり、わっと泣き出した。', romaji: 'Kodomo wa hahaoya no kao o miru nari, watto nakidashita.', meaning: 'Anak itu begitu melihat wajah ibunya langsung menangis keras.' }
    ]
  },
  { 
    title: '~そばから (Soba kara)', 
    formula: 'KK(Kamus/Ta) + そばから', 
    explanation: 'Meskipun sudah melakukan A, segera terjadi B (yang membatalkan/merusak hasil A). Berulang-ulang. Nuansa negatif.', 
    level: 'N1',
    examples: [
      { japanese: '片付けるそばから、子供が散らかしてしまう。', romaji: 'Katazukeru soba kara, kodomo ga chirakashite shimau.', meaning: 'Baru saja dibereskan, anak-anak langsung mengantakannya lagi (terus berulang).' },
      { japanese: '辞書で単語を覚えるそばから忘れていく。', romaji: 'Jisho de tango o oboeru soba kara wasurete iku.', meaning: 'Baru saja menghafal kosakata dari kamus, langsung lupa lagi.' },
      { japanese: '雑草は抜くそばから生えてくる。', romaji: 'Zassou wa nuku soba kara haete kuru.', meaning: 'Rumput liar itu baru dicabut langsung tumbuh lagi.' }
    ]
  },
  { 
    title: '~てからというもの (Te kara to iu mono)', 
    formula: 'KK(Te) + からというもの', 
    explanation: 'Sejak peristiwa A, terjadi perubahan besar dan keadaan B terus berlanjut hingga sekarang.', 
    level: 'N1',
    examples: [
      { japanese: '娘が生まれてからというもの、彼は酒を飲まなくなった。', romaji: 'Musume ga umarete kara to iu mono, kare wa sake o nomanaku natta.', meaning: 'Semenjak putrinya lahir, dia (sama sekali) tidak minum alkohol lagi.' },
      { japanese: '日本に来てからというもの、私の考え方は大きく変わった。', romaji: 'Nihon ni kite kara to iu mono, watashi no kangaekata wa ookiku kawatta.', meaning: 'Semenjak datang ke Jepang, cara pandang saya berubah drastis.' },
      { japanese: 'あの事故があってからというもの、彼は車を運転しなくなった。', romaji: 'Ano jiko ga atte kara to iu mono, kare wa kuruma o unten shinaku natta.', meaning: 'Semenjak kecelakaan itu, dia tidak lagi mengemudikan mobil.' }
    ]
  }
];
