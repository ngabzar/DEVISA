// src/data/mensetsu/mensetsu.ts
// Kisi-kisi pertanyaan wawancara kerja (面接) berdasarkan level JLPT dan bidang pekerjaan

export interface MensetsuQuestion {
  id: string;
  japanese: string;      // Pertanyaan dalam Bahasa Jepang
  romaji: string;        // Romaji
  indonesian: string;    // Arti dalam Bahasa Indonesia
  sampleAnswer: {
    japanese: string;    // Contoh jawaban Jepang
    romaji: string;      // Romaji jawaban
    indonesian: string;  // Arti jawaban
  };
  keywords: string[];    // Kata kunci penting
  tips: string;          // Tips menjawab
}

export interface MensetsuCategory {
  field: string;         // Bidang pekerjaan
  fieldJa: string;       // Bidang dalam bahasa Jepang
  icon: string;          // Emoji icon
  questions: MensetsuQuestion[];
}

export interface MensetsuLevel {
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  title: string;
  description: string;
  categories: MensetsuCategory[];
}

export const mensetsuData: MensetsuLevel[] = [
  {
    level: 'N5',
    title: 'N5 - Wawancara Dasar',
    description: 'Pertanyaan wawancara sangat dasar untuk pemula',
    categories: [
      {
        field: 'Umum',
        fieldJa: '一般',
        icon: '👤',
        questions: [
          {
            id: 'n5-1',
            japanese: 'お名前は何ですか？',
            romaji: 'O-namae wa nan desu ka?',
            indonesian: 'Siapa nama Anda?',
            sampleAnswer: {
              japanese: 'はじめまして。私の名前は[名前]です。どうぞよろしくお願いします。',
              romaji: 'Hajimemashite. Watashi no namae wa [nama] desu. Douzo yoroshiku onegaishimasu.',
              indonesian: 'Perkenalkan. Nama saya [nama]. Salam kenal.'
            },
            keywords: ['はじめまして', '名前', 'よろしく'],
            tips: 'Sertakan salam perkenalan はじめまして dan akhiri dengan どうぞよろしくお願いします.'
          },
          {
            id: 'n5-2',
            japanese: '出身はどちらですか？',
            romaji: 'Shusshin wa dochira desu ka?',
            indonesian: 'Dari mana asal Anda?',
            sampleAnswer: {
              japanese: '私はインドネシアの[都市名]出身です。',
              romaji: 'Watashi wa Indoneshia no [toshi-mei] shusshin desu.',
              indonesian: 'Saya berasal dari [nama kota] di Indonesia.'
            },
            keywords: ['出身', 'インドネシア'],
            tips: 'Sebutkan negara dan kota asal Anda dengan jelas.'
          },
          {
            id: 'n5-3',
            japanese: 'なぜ日本で働きたいですか？',
            romaji: 'Naze nihon de hatarakitai desu ka?',
            indonesian: 'Mengapa Anda ingin bekerja di Jepang?',
            sampleAnswer: {
              japanese: '日本の文化と技術に興味があります。そして日本語を勉強しています。',
              romaji: 'Nihon no bunka to gijutsu ni kyoumi ga arimasu. Soshite nihongo o benkyou shite imasu.',
              indonesian: 'Saya tertarik dengan budaya dan teknologi Jepang. Dan saya sedang belajar bahasa Jepang.'
            },
            keywords: ['文化', '技術', '興味'],
            tips: 'Sebutkan alasan positif dan spesifik mengapa memilih Jepang.'
          },
          {
            id: 'n5-4',
            japanese: '今、どこに住んでいますか？',
            romaji: 'Ima, doko ni sunde imasu ka?',
            indonesian: 'Sekarang Anda tinggal di mana?',
            sampleAnswer: {
              japanese: '今は[都市名]に住んでいます。',
              romaji: 'Ima wa [toshi-mei] ni sunde imasu.',
              indonesian: 'Sekarang saya tinggal di [nama kota].'
            },
            keywords: ['住んでいます', '今'],
            tips: 'Jawab dengan jelas nama kota atau daerah tempat tinggal sekarang.'
          },
          {
            id: 'n5-5',
            japanese: '趣味は何ですか？',
            romaji: 'Shumi wa nan desu ka?',
            indonesian: 'Apa hobi Anda?',
            sampleAnswer: {
              japanese: '私の趣味は音楽を聴くことと、料理をすることです。',
              romaji: 'Watashi no shumi wa ongaku o kiku koto to, ryouri o suru koto desu.',
              indonesian: 'Hobi saya adalah mendengarkan musik dan memasak.'
            },
            keywords: ['趣味', '〜ことです'],
            tips: 'Pola: 趣味は〜ことです. Sebutkan 2-3 hobi agar terkesan lebih berkarakter.'
          }
        ]
      },
      {
        field: 'Manufaktur',
        fieldJa: '製造業',
        icon: '🏭',
        questions: [
          {
            id: 'n5-mfg-1',
            japanese: '工場での仕事は初めてですか？',
            romaji: 'Koujou de no shigoto wa hajimete desu ka?',
            indonesian: 'Apakah ini pertama kali Anda bekerja di pabrik?',
            sampleAnswer: {
              japanese: 'はい、初めてですが、一生懸命頑張ります。',
              romaji: 'Hai, hajimete desu ga, isshoukenmei ganbarimasu.',
              indonesian: 'Ya, pertama kali, tetapi saya akan berusaha sepenuh hati.'
            },
            keywords: ['初めて', '一生懸命', '頑張ります'],
            tips: 'Jika memang baru pertama kali, akui dengan jujur tapi tunjukkan semangat kerja keras.'
          },
          {
            id: 'n5-mfg-2',
            japanese: '重い物を持つことはできますか？',
            romaji: 'Omoi mono o motsu koto wa dekimasu ka?',
            indonesian: 'Apakah Anda bisa mengangkat benda berat?',
            sampleAnswer: {
              japanese: 'はい、できます。体力には自信があります。',
              romaji: 'Hai, dekimasu. Tairyoku ni wa jishin ga arimasu.',
              indonesian: 'Ya, saya bisa. Saya percaya diri dengan stamina fisik saya.'
            },
            keywords: ['できます', '体力', '自信'],
            tips: 'Jika bisa, nyatakan dengan percaya diri. Tambahkan bahwa Anda menjaga kesehatan fisik.'
          }
        ]
      }
    ]
  },
  {
    level: 'N4',
    title: 'N4 - Wawancara Dasar Menengah',
    description: 'Pertanyaan wawancara tingkat dasar-menengah',
    categories: [
      {
        field: 'Umum',
        fieldJa: '一般',
        icon: '👤',
        questions: [
          {
            id: 'n4-1',
            japanese: '自己紹介をお願いします。',
            romaji: 'Jiko shoukai o onegai shimasu.',
            indonesian: 'Tolong perkenalkan diri Anda.',
            sampleAnswer: {
              japanese: 'はじめまして。[名前]と申します。インドネシアの[都市]出身です。[学校/会社]で[期間]働いておりました。本日はよろしくお願いいたします。',
              romaji: 'Hajimemashite. [Nama] to moushimasu. Indoneshia no [toshi] shusshin desu. [Gakkou/Kaisha] de [kikan] hataraite orimashita. Honjitsu wa yoroshiku onegai itashimasu.',
              indonesian: 'Perkenalkan. Nama saya [nama]. Saya berasal dari [kota] Indonesia. Saya pernah bekerja di [sekolah/perusahaan] selama [waktu]. Terima kasih atas kesempatan ini.'
            },
            keywords: ['〜と申します', '出身', 'よろしくお願いいたします'],
            tips: 'Perkenalan diri ideal: Nama → Asal → Pengalaman singkat → Salam. Gunakan 〜と申します (Keigo) bukan 〜と言います.'
          },
          {
            id: 'n4-2',
            japanese: '長所と短所を教えてください。',
            romaji: 'Chousho to tansho o oshiete kudasai.',
            indonesian: 'Tolong ceritakan kelebihan dan kekurangan Anda.',
            sampleAnswer: {
              japanese: '私の長所は、責任感が強いことです。短所は、完璧主義なところで、時間がかかってしまうことがあります。',
              romaji: 'Watashi no chousho wa, sekininkan ga tsuyoi koto desu. Tansho wa, kanpeki shugi na tokoro de, jikan ga kakatte shimau koto ga arimasu.',
              indonesian: 'Kelebihan saya adalah rasa tanggung jawab yang kuat. Kekurangan saya adalah sifat perfeksionis yang kadang membuat pekerjaan memakan waktu lebih lama.'
            },
            keywords: ['長所', '短所', '責任感'],
            tips: 'Strategi cerdas: Sebutkan kekurangan yang bisa diartikan sebagai kelebihan (perfeksionis, terlalu detail, dll).'
          },
          {
            id: 'n4-3',
            japanese: '日本語の勉強をどのくらいしましたか？',
            romaji: 'Nihongo no benkyou o dono kurai shimashita ka?',
            indonesian: 'Sudah berapa lama Anda belajar bahasa Jepang?',
            sampleAnswer: {
              japanese: '約[期間]日本語を勉強しています。今はN[数字]レベルです。',
              romaji: 'Yaku [kikan] nihongo o benkyou shite imasu. Ima wa N[suuji] reberu desu.',
              indonesian: 'Saya sudah belajar bahasa Jepang sekitar [waktu]. Sekarang level saya N[nomor].'
            },
            keywords: ['約', '〜を勉強しています', 'レベル'],
            tips: 'Sebutkan durasi belajar dan level JLPT yang dimiliki. Tunjukkan kesungguhan belajar.'
          }
        ]
      },
      {
        field: 'Pelayanan',
        fieldJa: 'サービス業',
        icon: '🛎️',
        questions: [
          {
            id: 'n4-srv-1',
            japanese: 'お客様とのコミュニケーションは得意ですか？',
            romaji: 'Okyakusama to no komyunikeeshon wa tokui desu ka?',
            indonesian: 'Apakah Anda mahir berkomunikasi dengan pelanggan?',
            sampleAnswer: {
              japanese: 'はい、インドネシアでのアルバイト経験がありますので、コミュニケーションには自信があります。',
              romaji: 'Hai, Indoneshia de no arubaito keiken ga arimasu node, komyunikeeshon ni wa jishin ga arimasu.',
              indonesian: 'Ya, karena saya punya pengalaman kerja paruh waktu di Indonesia, saya percaya diri dalam berkomunikasi.'
            },
            keywords: ['コミュニケーション', '経験', '自信'],
            tips: 'Dukung pernyataan dengan pengalaman konkret. Pewawancara menghargai bukti nyata.'
          }
        ]
      }
    ]
  },
  {
    level: 'N3',
    title: 'N3 - Wawancara Menengah',
    description: 'Pertanyaan wawancara tingkat menengah',
    categories: [
      {
        field: 'Umum',
        fieldJa: '一般',
        icon: '👤',
        questions: [
          {
            id: 'n3-1',
            japanese: 'あなたはどんな仕事がしたいですか？',
            romaji: 'Anata wa donna shigoto ga shitai desu ka?',
            indonesian: 'Jenis pekerjaan apa yang ingin Anda lakukan?',
            sampleAnswer: {
              japanese: '私は自分のスキルを活かして、チームに貢献できる仕事がしたいと思っています。',
              romaji: 'Watashi wa jibun no sukiru o ikashite, chiimu ni kouken dekiru shigoto ga shitai to omotteimasu.',
              indonesian: 'Saya ingin melakukan pekerjaan yang bisa memanfaatkan keahlian saya dan berkontribusi untuk tim.'
            },
            keywords: ['スキルを活かす', '貢献', 'チーム'],
            tips: 'Hubungkan jawaban dengan kebutuhan perusahaan. Gunakan kata kunci seperti 貢献 (berkontribusi).'
          },
          {
            id: 'n3-2',
            japanese: '前の職場を辞めた理由は何ですか？',
            romaji: 'Mae no shokuba o yameta riyuu wa nan desu ka?',
            indonesian: 'Apa alasan Anda keluar dari tempat kerja sebelumnya?',
            sampleAnswer: {
              japanese: 'キャリアアップを目指すために転職を決意しました。新しいことに挑戦したいと思っています。',
              romaji: 'Kyaria appu o mezasu tame ni tenshoku o ketsui shimashita. Atarashii koto ni chousen shitai to omotteimasu.',
              indonesian: 'Saya memutuskan untuk berpindah kerja demi kemajuan karir. Saya ingin mencoba hal-hal baru.'
            },
            keywords: ['キャリアアップ', '挑戦', '転職'],
            tips: 'JANGAN: Menjelekkan tempat kerja lama. Fokus pada motivasi positif untuk masa depan.'
          },
          {
            id: 'n3-3',
            japanese: '日本での生活に困ったことはありますか？',
            romaji: 'Nihon de no seikatsu ni komatta koto wa arimasu ka?',
            indonesian: 'Apakah ada kesulitan dalam kehidupan di Jepang?',
            sampleAnswer: {
              japanese: '最初は言葉の壁がありましたが、積極的に日本語を使うようにして克服しました。',
              romaji: 'Saisho wa kotoba no kabe ga arimashita ga, sekkyokuteki ni nihongo o tsukau you ni shite kokufuku shimashita.',
              indonesian: 'Awalnya ada hambatan bahasa, tapi saya berusaha aktif menggunakan bahasa Jepang dan berhasil mengatasinya.'
            },
            keywords: ['言葉の壁', '克服', '積極的'],
            tips: 'Akui kesulitan yang pernah dialami, tapi SELALU akhiri dengan bagaimana Anda mengatasinya.'
          }
        ]
      },
      {
        field: 'IT & Teknologi',
        fieldJa: 'IT・技術',
        icon: '💻',
        questions: [
          {
            id: 'n3-it-1',
            japanese: 'どんなプログラミング言語が使えますか？',
            romaji: 'Donna puroguramingu gengo ga tsukaemasu ka?',
            indonesian: 'Bahasa pemrograman apa yang bisa Anda gunakan?',
            sampleAnswer: {
              japanese: 'PythonとJavaScriptが得意です。最近はReactも勉強しています。',
              romaji: 'Python to JavaScript ga tokui desu. Saikin wa React mo benkyou shite imasu.',
              indonesian: 'Saya mahir Python dan JavaScript. Belakangan ini saya juga belajar React.'
            },
            keywords: ['得意', '勉強しています', 'プログラミング'],
            tips: 'Sebutkan yang paling dikuasai terlebih dahulu, lalu tambahkan yang sedang dipelajari untuk menunjukkan semangat belajar.'
          },
          {
            id: 'n3-it-2',
            japanese: 'チームで開発した経験はありますか？',
            romaji: 'Chiimu de kaihatsu shita keiken wa arimasu ka?',
            indonesian: 'Apakah Anda punya pengalaman pengembangan dalam tim?',
            sampleAnswer: {
              japanese: 'はい、学校のプロジェクトで5人のチームでアプリを開発しました。Gitを使って共同作業をしました。',
              romaji: 'Hai, gakkou no purojekuto de gonin no chiimu de apuri o kaihatsu shimashita. Git o tsukatte kyoudou sagyou o shimashita.',
              indonesian: 'Ya, saya pernah mengembangkan aplikasi dalam tim 5 orang untuk proyek sekolah. Kami berkolaborasi menggunakan Git.'
            },
            keywords: ['チーム', '開発', 'プロジェクト'],
            tips: 'Berikan contoh konkret dengan detail: jumlah orang, tools yang digunakan, dan hasil yang dicapai.'
          }
        ]
      },
      {
        field: 'Perawatan & Kesehatan',
        fieldJa: '介護・医療',
        icon: '🏥',
        questions: [
          {
            id: 'n3-care-1',
            japanese: '介護の仕事を選んだ理由は何ですか？',
            romaji: 'Kaigo no shigoto o eranda riyuu wa nan desu ka?',
            indonesian: 'Apa alasan Anda memilih pekerjaan perawatan?',
            sampleAnswer: {
              japanese: '高齢者の方々を助けたいという気持ちが強くあります。インドネシアでも家族の介護を経験し、この仕事のやりがいを感じました。',
              romaji: 'Koureisha no katagata o tasuketai to iu kimochi ga tsuyoku arimasu. Indoneshia demo kazoku no kaigo o keiken shi, kono shigoto no yarigai o kanjimashita.',
              indonesian: 'Saya memiliki keinginan kuat untuk membantu para lansia. Di Indonesia pun saya pernah merawat anggota keluarga dan merasakan kepuasan dari pekerjaan ini.'
            },
            keywords: ['介護', 'やりがい', '高齢者'],
            tips: 'Kaitkan dengan pengalaman personal untuk menunjukkan motivasi yang tulus.'
          }
        ]
      }
    ]
  },
  {
    level: 'N2',
    title: 'N2 - Wawancara Lanjutan',
    description: 'Pertanyaan wawancara tingkat lanjutan untuk profesional',
    categories: [
      {
        field: 'Umum',
        fieldJa: '一般',
        icon: '👤',
        questions: [
          {
            id: 'n2-1',
            japanese: '5年後、あなたはどんな人材になっていたいですか？',
            romaji: 'Gonenn go, anata wa donna jinzai ni natte itai desu ka?',
            indonesian: 'Lima tahun lagi, Anda ingin menjadi profesional seperti apa?',
            sampleAnswer: {
              japanese: '5年後には、専門知識と日本語能力を高め、プロジェクトリーダーとして活躍できる人材になりたいと考えています。',
              romaji: 'Go-nen go ni wa, senmon chishiki to nihongo nouryoku o takame, purojekuto riidaa to shite katsuyaku dekiru jinzai ni naritai to kangaete imasu.',
              indonesian: 'Lima tahun ke depan, saya ingin menjadi profesional yang meningkatkan pengetahuan spesialis dan kemampuan bahasa Jepang, sehingga bisa aktif berperan sebagai pemimpin proyek.'
            },
            keywords: ['専門知識', 'プロジェクトリーダー', '活躍'],
            tips: 'Jawaban 5 tahun harus sejalan dengan arah perusahaan. Tunjukkan ambisi yang realistis dan terencana.'
          },
          {
            id: 'n2-2',
            japanese: 'ストレスを感じたとき、どのように対処しますか？',
            romaji: 'Sutoresu o kanjita toki, dono you ni taisho shimasu ka?',
            indonesian: 'Bagaimana cara Anda mengatasi stres?',
            sampleAnswer: {
              japanese: '仕事の優先順位を整理し、一つ一つ対処するように心がけています。また、定期的に運動をすることでリフレッシュしています。',
              romaji: 'Shigoto no yuusen junnyi o seiri shi, hitotsu hitotsu taisho suru you ni kokorogakete imasu. Mata, teiki teki ni undou o suru koto de rifuresshu shite imasu.',
              indonesian: 'Saya terbiasa mengatur prioritas pekerjaan dan menanganinya satu per satu. Selain itu, saya menyegarkan diri dengan olahraga secara rutin.'
            },
            keywords: ['優先順位', '対処', 'リフレッシュ'],
            tips: 'Pewawancara ingin melihat ketahanan mental. Berikan solusi konkret, bukan sekedar "berusaha bersabar".'
          },
          {
            id: 'n2-3',
            japanese: '弊社を志望した理由を教えてください。',
            romaji: 'Heisha o shibou shita riyuu o oshiete kudasai.',
            indonesian: 'Tolong jelaskan alasan Anda melamar ke perusahaan kami.',
            sampleAnswer: {
              japanese: '御社の革新的な技術と、グローバルな事業展開に魅力を感じました。また、多様な人材を積極的に採用されているという点も、私が成長できる環境だと確信しています。',
              romaji: 'Onsha no kakushinteki na gijutsu to, guroobaruna jigyou tenkai ni miryoku o kanjimashita. Mata, tayouna jinzai o sekkyokuteki ni saiyou sarete iru to iu ten mo, watashi ga seichou dekiru kankyou da to kakushin shite imasu.',
              indonesian: 'Saya tertarik dengan teknologi inovatif perusahaan Anda dan ekspansi bisnisnya secara global. Selain itu, aktifnya perekrutan SDM yang beragam membuat saya yakin ini adalah lingkungan yang bisa mendukung pertumbuhan saya.'
            },
            keywords: ['御社', '志望', '魅力', '成長'],
            tips: 'WAJIB: Riset perusahaan sebelum wawancara! Gunakan 御社 (Onsha) untuk sebut nama perusahaan pewawancara secara hormat.'
          }
        ]
      },
      {
        field: 'Bisnis & Manajemen',
        fieldJa: 'ビジネス・経営',
        icon: '💼',
        questions: [
          {
            id: 'n2-biz-1',
            japanese: 'リーダーシップを発揮した経験を教えてください。',
            romaji: 'Riidaashiappu o hakki shita keiken o oshiete kudasai.',
            indonesian: 'Tolong ceritakan pengalaman Anda dalam menunjukkan kepemimpinan.',
            sampleAnswer: {
              japanese: '前職では10人のチームをまとめ、生産性を20%向上させることができました。定期的なミーティングと個別面談を通じて、チームの課題を早期に発見・解決しました。',
              romaji: 'Zenshoku de wa juunin no chiimu o matomete, seisansei o nijuu paasento koujou saseru koto ga dekimashita. Teiki teki na miitingu to kobetsu mendan o tsuujite, chiimu no kadai o souki ni hakken / kaiketsu shimashita.',
              indonesian: 'Di tempat kerja sebelumnya, saya memimpin tim 10 orang dan berhasil meningkatkan produktivitas sebesar 20%. Melalui rapat rutin dan pertemuan individual, saya berhasil mendeteksi dan menyelesaikan masalah tim lebih awal.'
            },
            keywords: ['リーダーシップ', '生産性向上', 'チームをまとめる'],
            tips: 'Gunakan angka/data konkret untuk mendukung klaim kepemimpinan Anda. Angka membuat jawaban lebih kredibel.'
          }
        ]
      },
      {
        field: 'Konstruksi',
        fieldJa: '建設業',
        icon: '🏗️',
        questions: [
          {
            id: 'n2-const-1',
            japanese: '安全管理において大切なことは何だと思いますか？',
            romaji: 'Anzen kanri ni oite taisetsu na koto wa nan da to omoimasu ka?',
            indonesian: 'Menurut Anda, apa yang paling penting dalam manajemen keselamatan?',
            sampleAnswer: {
              japanese: 'リスクアセスメントを徹底し、ヒヤリハットを報告し合うことが重要だと思います。また、KYT（危険予知訓練）を定期的に行うことで、事故を未然に防ぐことができると考えています。',
              romaji: 'Risuku asesumento o tesssei shi, hiyari-hatto o houkoku shi au koto ga juuyou da to omoimasu. Mata, KYT (kiken yochi kunren) o teikiteki ni okonau koto de, jiko o mizenni fusegu koto ga dekiru to kangaete imasu.',
              indonesian: 'Saya rasa penting untuk melaksanakan penilaian risiko secara menyeluruh dan saling melaporkan near-miss. Selain itu, dengan rutin melakukan KYT (pelatihan prediksi bahaya), kecelakaan bisa dicegah sebelum terjadi.'
            },
            keywords: ['安全管理', 'リスクアセスメント', 'ヒヤリハット'],
            tips: 'Penggunaan istilah teknis seperti KYT dan ヒヤリハット akan sangat mengesankan pewawancara di bidang konstruksi.'
          }
        ]
      }
    ]
  },
  {
    level: 'N1',
    title: 'N1 - Wawancara Tingkat Tinggi',
    description: 'Pertanyaan wawancara tingkat tinggi untuk posisi senior/managerial',
    categories: [
      {
        field: 'Umum',
        fieldJa: '一般',
        icon: '👤',
        questions: [
          {
            id: 'n1-1',
            japanese: '昨今のグローバル化の中で、外国人として日本企業に貢献できることは何だと思いますか？',
            romaji: 'Sakkon no guroobaruka no naka de, gaikokujin to shite nihon kigyou ni kouken dekiru koto wa nan da to omoimasu ka?',
            indonesian: 'Di tengah globalisasi saat ini, apa yang menurut Anda bisa Anda kontribusikan sebagai orang asing kepada perusahaan Jepang?',
            sampleAnswer: {
              japanese: '私は異文化理解と多言語能力を活かし、海外市場との橋渡し役を担えると考えています。また、多様な視点からのアイデアで、既存の慣習にとらわれない革新的な提案ができると確信しています。',
              romaji: 'Watashi wa ibunka rikai to tagengono nouryoku o ikashi, kaigai shijou to no hashi watashi yaku o ninau ru to kangaete imasu. Mata, tayouna shiten karano aidea de, kison no kanshuu ni torawarenai kakushinteki na teian ga dekiru to kakushin shite imasu.',
              indonesian: 'Saya percaya bisa berperan sebagai jembatan antara perusahaan dan pasar internasional, dengan memanfaatkan pemahaman lintas budaya dan kemampuan multibahasa saya. Selain itu, saya yakin bisa memberikan proposal inovatif yang tidak terkekang oleh kebiasaan yang ada, berdasarkan perspektif yang beragam.'
            },
            keywords: ['異文化理解', '橋渡し', '多様な視点', '革新'],
            tips: 'Di level N1, pewawancara mengharapkan jawaban yang menunjukkan pemikiran strategis dan kesadaran global.'
          },
          {
            id: 'n1-2',
            japanese: '日本の職場文化で戸惑ったことや、その経験から学んだことを教えてください。',
            romaji: 'Nihon no shokuba bunka de tomadotta koto ya, sono keiken kara mananda koto o oshiete kudasai.',
            indonesian: 'Ceritakan hal yang membuat Anda bingung tentang budaya kerja Jepang, dan apa yang Anda pelajari dari pengalaman tersebut.',
            sampleAnswer: {
              japanese: '最初は「報連相」の文化と、会議での暗黙の了解に戸惑いました。しかし、積極的に先輩に質問し、観察することで、この文化には情報共有と合意形成を大切にする深い意図があることを学びました。今では私自身がこの文化の良さを後輩に伝えています。',
              romaji: 'Saisho wa "horenso" no bunka to, kaigi de no anmoku no ryoukai ni tomadoimashita. Shikashi, sekkyokuteki ni senpai ni shitsumon shi, kansatsu suru koto de, kono bunka ni wa jouhou kyouyuu to goi keisei o taisetsu ni suru fukai ito ga aru koto o manabishimashita. Ima de wa watashi jishin ga kono bunka no yosa o kouhai ni tsutaete imasu.',
              indonesian: 'Awalnya saya bingung dengan budaya "Hou-Ren-Sou" dan konsensus tersirat dalam rapat. Namun, dengan aktif bertanya kepada senior dan mengamati, saya belajar bahwa budaya ini memiliki maksud mendalam untuk menghargai berbagi informasi dan membangun konsensus. Kini saya sendiri meneruskan nilai budaya ini kepada junior.'
            },
            keywords: ['報連相', '暗黙の了解', '合意形成', '異文化適応'],
            tips: 'Di N1, tunjukkan refleksi mendalam dan kemampuan adaptasi budaya (文化適応力). Penggunaan istilah 報連相 menunjukkan pemahaman budaya kerja Jepang yang mendalam.'
          },
          {
            id: 'n1-3',
            japanese: '困難なプロジェクトをどのように乗り越えましたか？具体例を挙げてください。',
            romaji: 'Konnan na purojekuto o dono you ni norikooemashita ka? Gutai rei o agete kudasai.',
            indonesian: 'Bagaimana Anda mengatasi proyek yang sulit? Berikan contoh konkret.',
            sampleAnswer: {
              japanese: '前職で、半年間のシステム移行プロジェクトを担当しました。利害関係者が多く、要件定義に難航しましたが、ステークホルダーへの個別ヒアリングを徹底し、共通の目標を明確化しました。結果として、期限内にプロジェクトを成功させ、顧客満足度も15%向上しました。',
              romaji: 'Zenshoku de, hantoshi kan no shisutemu ikou purojekuto o tantou shimashita. Rikaikankei sha ga ooku, youken teigi ni nankouimashita ga, suteekuhorudaa heno kobetsu hiringu o tessshi, kyoutsuu no mokuhyou o meikakuka shimashita. Kekka toshite, kigen nai ni purojekuto o seikou sase, kyaku manzokudo mo juugo paasento koujou shimashita.',
              indonesian: 'Di tempat kerja sebelumnya, saya menangani proyek migrasi sistem selama 6 bulan. Ada banyak pihak berkepentingan yang membuat definisi kebutuhan sulit, namun saya melakukan wawancara individual dengan semua stakeholder dan memperjelas tujuan bersama. Hasilnya, proyek berhasil diselesaikan tepat waktu dan kepuasan pelanggan meningkat 15%.'
            },
            keywords: ['ステークホルダー', '要件定義', '課題解決', 'STAR法'],
            tips: 'Gunakan metode STAR (Situation, Task, Action, Result). Angka konkret seperti "15%向上" sangat penting di level N1.'
          }
        ]
      },
      {
        field: 'Penelitian & Akademik',
        fieldJa: '研究・学術',
        icon: '🔬',
        questions: [
          {
            id: 'n1-res-1',
            japanese: 'あなたの研究分野と、それが社会にどう貢献できるか説明してください。',
            romaji: 'Anata no kenkyuu bunya to, sore ga shakai ni dou kouken dekiru ka setsumei shite kudasai.',
            indonesian: 'Jelaskan bidang penelitian Anda dan bagaimana hal tersebut dapat berkontribusi pada masyarakat.',
            sampleAnswer: {
              japanese: '私は[分野]を専門としており、特に[テーマ]に焦点を当てて研究を進めています。この研究は[社会課題]の解決に直接つながるものであり、[成果/論文]を通じて既に[インパクト]をもたらしています。',
              romaji: 'Watashi wa [bunya] o senmon to shite ori, toku ni [teema] ni shouten o atete kenkyuu o susumete imasu. Kono kenkyuu wa [shakai kadai] no kaiketsu ni chokusetu tsunagaru mono de ari, [seika / ronbun] o tsuujite sude ni [inpakuto] o motarashite imasu.',
              indonesian: 'Saya mengkhususkan diri di bidang [bidang], terutama berfokus pada penelitian tentang [tema]. Penelitian ini langsung berkaitan dengan penyelesaian [masalah sosial], dan melalui [hasil/makalah], sudah memberikan [dampak].'
            },
            keywords: ['専門', '研究', '社会貢献', 'インパクト'],
            tips: 'Jelaskan penelitian Anda dengan bahasa yang dapat dipahami orang non-spesialis, lalu tunjukkan dampak sosialnya.'
          }
        ]
      }
    ]
  }
];

// Helper function untuk mendapatkan semua pertanyaan per level
export function getQuestionsByLevel(level: string): MensetsuQuestion[] {
  const levelData = mensetsuData.find(l => l.level === level);
  if (!levelData) return [];
  
  const allQuestions: MensetsuQuestion[] = [];
  levelData.categories.forEach(cat => {
    allQuestions.push(...cat.questions);
  });
  return allQuestions;
}

// Helper function untuk mendapatkan pertanyaan per bidang
export function getQuestionsByField(level: string, field: string): MensetsuQuestion[] {
  const levelData = mensetsuData.find(l => l.level === level);
  if (!levelData) return [];
  
  const category = levelData.categories.find(c => c.field === field || c.fieldJa === field);
  return category?.questions || [];
}
