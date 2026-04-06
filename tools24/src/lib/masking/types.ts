export type DetectionType =
  | "name"
  | "phone"
  | "email"
  | "address"
  | "zipcode"
  | "mynumber"
  | "creditcard"
  | "ip";

export type MaskMode = "dummy" | "redact" | "hash" | "fixed";

export interface DetectedItem {
  type: DetectionType;
  value: string;
  start: number;
  end: number;
}

export interface DetectionResult {
  items: DetectedItem[];
  counts: Record<DetectionType, number>;
}

export interface MaskSettings {
  targets: Record<DetectionType, boolean>;
  mode: MaskMode;
}

export const DEFAULT_MASK_SETTINGS: MaskSettings = {
  targets: {
    name: true,
    phone: true,
    email: true,
    address: true,
    zipcode: true,
    mynumber: true,
    creditcard: true,
    ip: true,
  },
  mode: "fixed",
};

export const DETECTION_LABELS: Record<DetectionType, string> = {
  name: "氏名",
  phone: "電話番号",
  email: "メールアドレス",
  address: "住所",
  zipcode: "郵便番号",
  mynumber: "マイナンバー",
  creditcard: "クレジットカード番号",
  ip: "IPアドレス",
};
