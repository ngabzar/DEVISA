import { Question } from "../../types";

export const jlptn4_19: Question[] = [
  {
    q: "【ATMの操作案内】\nカードを入れて、暗証番号を押してください。次に、「お引き出し」のボタンを押して、金額を入力してください。最後に、カードとお金、明細書をお取りください。\n\n質問：暗証番号を押したあと、何をしますか。",
    options: ["カードを入れます", "「お引き出し」のボタンを押します", "お金を取ります", "金額を入力します"],
    correct: 1,
    type: "JLPT_N4",
    inputType: "CHOICE",
    explanation: "Urutannya: Kartu -> PIN (Anshou bangou) -> 'Tsugi ni, o-hikidashi no botan...' (Selanjutnya, tekan tombol penarikan)."
  },
  {
    q: "【料理のレシピ】\n「卵焼きの作り方」\n①卵を２個、ボールに割ります。\n②砂糖と塩を少し入れて、よく混ぜます。\n③熱いフライパンに油をひいて、卵を焼きます。\n\n質問：砂糖を入れる前に、何をしますか。",
    options: ["卵を焼きます", "卵を割ります", "油をひきます", "よく混ぜます"],
    correct: 1,
    type: "JLPT_N4",
    inputType: "CHOICE",
    explanation: "Langkah 1 adalah memecahkan telur (tamago o warimasu). Langkah 2 baru memasukkan gula (satou o ireru)."
  }
];
