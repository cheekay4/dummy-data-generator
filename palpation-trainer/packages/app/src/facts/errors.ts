/** scope.json のホワイトリスト外の構造が要求されたときのエラー（仕様 §3.1） */
export class OutOfScopeError extends Error {
  constructor(public readonly fmaId: string) {
    super(`対象領域（scope.json）に含まれない構造です: ${fmaId}`);
    this.name = "OutOfScopeError";
  }
}

/** データ整合性違反（scope と層B の不一致など）。起動時に検出する */
export class DataIntegrityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DataIntegrityError";
  }
}
