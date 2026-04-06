export interface DocumentItem {
  id: string;
  name: string;             // 書類名
  description: string;      // 説明
  howToGet: string;         // 入手方法
  requiredFor: string[];    // どの状況で必要か（条件ID配列）
  category: 'basic' | 'income' | 'deduction' | 'other';
  important: boolean;       // 重要度（必須 vs あると良い）
}

export const documents: DocumentItem[] = [
  // 基本書類
  {
    id: 'mynumber',
    name: 'マイナンバーカード（または通知カード + 本人確認書類）',
    description: 'e-Taxの場合はマイナンバーカードでログイン。紙提出の場合はコピーを添付。',
    howToGet: 'お住まいの市区町村役場で申請',
    requiredFor: ['all'],
    category: 'basic',
    important: true,
  },
  {
    id: 'bank_account',
    name: '還付金の振込先口座情報',
    description: '本人名義の銀行口座。還付申告の場合に必要。',
    howToGet: '通帳またはキャッシュカードで確認',
    requiredFor: ['all'],
    category: 'basic',
    important: true,
  },
  // 収入に関する書類
  {
    id: 'gensen',
    name: '源泉徴収票',
    description: '勤務先から1月頃に届く。給与収入、所得控除、源泉徴収税額が記載。',
    howToGet: '勤務先の経理・人事部門に依頼',
    requiredFor: ['employee', 'part_time', 'retired'],
    category: 'income',
    important: true,
  },
  {
    id: 'side_job_income',
    name: '副業の収入・経費がわかる書類',
    description: '請求書、支払調書、売上記録、経費の領収書など。',
    howToGet: '取引先からの支払調書（1月頃届く）+ 自己管理の記録',
    requiredFor: ['side_job'],
    category: 'income',
    important: true,
  },
  // 控除に関する書類
  {
    id: 'medical_receipts',
    name: '医療費の領収書・明細書',
    description: '病院、薬局等の領収書。医療費控除の明細書にまとめて記載。',
    howToGet: '通院時に受け取り保管。健保組合の「医療費のお知らせ」も利用可。',
    requiredFor: ['medical'],
    category: 'deduction',
    important: true,
  },
  {
    id: 'medical_notice',
    name: '医療費のお知らせ（医療費通知）',
    description: '健康保険組合等から届く通知。これがあれば領収書の一部を省略できる。',
    howToGet: '加入している健康保険組合から届く（1〜2月頃）',
    requiredFor: ['medical'],
    category: 'deduction',
    important: false,
  },
  {
    id: 'furusato_certificate',
    name: 'ふるさと納税 寄附金受領証明書',
    description: '各自治体から届く証明書。寄附先ごとに1枚。',
    howToGet: '寄附後に各自治体から郵送（またはXMLデータ）',
    requiredFor: ['furusato'],
    category: 'deduction',
    important: true,
  },
  {
    id: 'furusato_xml',
    name: 'ふるさと納税 XMLデータ（電子証明書）',
    description: 'ふるさと納税サイトからダウンロードできる電子データ。e-Taxに一括読込可能。紙の証明書の代わりに使える。',
    howToGet: '利用したふるさと納税サイト（さとふる、ふるなび等）のマイページからダウンロード',
    requiredFor: ['furusato'],
    category: 'deduction',
    important: false,
  },
  {
    id: 'insurance_certificate',
    name: '生命保険料控除証明書',
    description: '保険会社から届く控除証明書。一般・介護医療・個人年金の区分と新旧制度が記載。',
    howToGet: '保険会社から10〜11月頃に届く',
    requiredFor: ['life_insurance'],
    category: 'deduction',
    important: true,
  },
  {
    id: 'housing_loan_certificate',
    name: '住宅ローン残高証明書（年末残高等証明書）',
    description: '金融機関から届く。年末時点のローン残高が記載。',
    howToGet: '住宅ローンを組んだ金融機関から10〜11月頃に届く',
    requiredFor: ['housing_loan'],
    category: 'deduction',
    important: true,
  },
  {
    id: 'housing_contract',
    name: '売買契約書・工事請負契約書のコピー',
    description: '住宅の取得価額を証明する書類。住宅ローン控除の初年度に必要。',
    howToGet: '購入時に受け取った契約書',
    requiredFor: ['housing_loan'],
    category: 'deduction',
    important: true,
  },
  {
    id: 'housing_registry',
    name: '建物・土地の登記事項証明書',
    description: '住宅ローン控除の初年度に必要。',
    howToGet: '法務局で取得（オンライン申請も可）',
    requiredFor: ['housing_loan'],
    category: 'deduction',
    important: true,
  },
];
