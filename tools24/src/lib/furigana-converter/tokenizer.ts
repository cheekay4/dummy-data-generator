import kuromoji from "kuromoji";
import type { IpadicFeatures, Tokenizer } from "kuromoji";

let cachedTokenizer: Tokenizer<IpadicFeatures> | null = null;
let loadingPromise: Promise<Tokenizer<IpadicFeatures>> | null = null;

export type { IpadicFeatures };

export function getTokenizer(): Promise<Tokenizer<IpadicFeatures>> {
  if (cachedTokenizer) return Promise.resolve(cachedTokenizer);
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: "/dict/" }).build((err, tokenizer) => {
      if (err) {
        loadingPromise = null;
        reject(err);
        return;
      }
      cachedTokenizer = tokenizer;
      resolve(tokenizer);
    });
  });

  return loadingPromise;
}
