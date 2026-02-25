export interface Vocabulary {
  word: string;
  kana: string;
  meaning: string;
  level?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'n5' | 'n4' | 'n3' | 'n2' | 'n1';
  category?: string;
  tag?: string;
  examples?: {
    japanese?: string;
    romaji?: string;
    meaning?: string;
  }[];
}
