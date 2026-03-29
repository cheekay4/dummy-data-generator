declare module "kuromoji" {
  interface IpadicFeatures {
    word_id: number;
    word_type: string;
    word_position: number;
    surface_form: string;
    pos: string;
    pos_detail_1: string;
    pos_detail_2: string;
    pos_detail_3: string;
    conjugated_type: string;
    conjugated_form: string;
    basic_form: string;
    reading?: string;
    pronunciation?: string;
  }

  interface Tokenizer<T> {
    tokenize(text: string): T[];
  }

  interface TokenizerBuilder<T> {
    build(callback: (err: Error | null, tokenizer: Tokenizer<T>) => void): void;
  }

  function builder(option: { dicPath: string }): TokenizerBuilder<IpadicFeatures>;
}
