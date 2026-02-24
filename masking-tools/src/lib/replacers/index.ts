import { DetectedItem, MaskMode } from "../types";
import { applyFixedReplacement } from "./fixed-replacer";
import { applyRedactReplacement } from "./redact-replacer";
import { applyHashReplacement } from "./hash-replacer";
import { applyDummyReplacement } from "./dummy-replacer";

export async function applyMask(
  text: string,
  items: DetectedItem[],
  mode: MaskMode
): Promise<string> {
  switch (mode) {
    case "fixed":
      return applyFixedReplacement(text, items);
    case "redact":
      return applyRedactReplacement(text, items);
    case "hash":
      return await applyHashReplacement(text, items);
    case "dummy":
      return applyDummyReplacement(text, items);
  }
}
