import { generateGender, generateName, generateAge, generateBirthDate, generateEmail, generatePhone } from "./generators/person";
import { generateAddress } from "./generators/address";
import { generateCompanyName, generateDepartment, generatePosition } from "./generators/business";
import { generateUserId, generatePassword, generateIpAddress, generateMacAddress } from "./generators/web";
import { generateCreditCard } from "./generators/credit-card";
import { generateMyNumber } from "./generators/my-number";

export type FieldKey =
  | "nameKanji"
  | "nameKana"
  | "nameRomaji"
  | "gender"
  | "age"
  | "birthDate"
  | "email"
  | "phone"
  | "zip"
  | "prefecture"
  | "city"
  | "banchi"
  | "building"
  | "company"
  | "department"
  | "position"
  | "userId"
  | "password"
  | "ipAddress"
  | "macAddress"
  | "creditCard"
  | "myNumber";

export type FieldConfig = {
  key: FieldKey;
  label: string;
  category: "personal" | "address" | "business" | "web";
};

export const fieldConfigs: FieldConfig[] = [
  { key: "nameKanji", label: "氏名（漢字）", category: "personal" },
  { key: "nameKana", label: "氏名（カタカナ）", category: "personal" },
  { key: "nameRomaji", label: "氏名（ローマ字）", category: "personal" },
  { key: "gender", label: "性別", category: "personal" },
  { key: "age", label: "年齢", category: "personal" },
  { key: "birthDate", label: "生年月日", category: "personal" },
  { key: "email", label: "メールアドレス", category: "personal" },
  { key: "phone", label: "電話番号", category: "personal" },
  { key: "zip", label: "郵便番号", category: "address" },
  { key: "prefecture", label: "都道府県", category: "address" },
  { key: "city", label: "市区町村", category: "address" },
  { key: "banchi", label: "番地", category: "address" },
  { key: "building", label: "建物名・部屋番号", category: "address" },
  { key: "company", label: "会社名", category: "business" },
  { key: "department", label: "部署名", category: "business" },
  { key: "position", label: "役職", category: "business" },
  { key: "userId", label: "ユーザーID", category: "web" },
  { key: "password", label: "パスワード", category: "web" },
  { key: "ipAddress", label: "IPアドレス", category: "web" },
  { key: "macAddress", label: "MACアドレス", category: "web" },
  { key: "creditCard", label: "クレジットカード番号", category: "web" },
  { key: "myNumber", label: "マイナンバー", category: "web" },
];

export const categoryLabels: Record<string, string> = {
  personal: "個人情報",
  address: "住所",
  business: "ビジネス",
  web: "Web/IT",
};

export type GenerateOptions = {
  fields: FieldKey[];
  count: number;
  ageMin: number;
  ageMax: number;
};

export function generateRecord(
  fields: FieldKey[],
  ageMin: number,
  ageMax: number
): Record<string, string> {
  const record: Record<string, string> = {};

  const needsName = fields.some((f) =>
    ["nameKanji", "nameKana", "nameRomaji", "email"].includes(f)
  );
  const needsGender = fields.includes("gender") || needsName;
  const needsAge = fields.includes("age") || fields.includes("birthDate");
  const needsAddress = fields.some((f) =>
    ["zip", "prefecture", "city", "banchi", "building"].includes(f)
  );

  const gender = needsGender ? generateGender() : undefined;
  const name = needsName ? generateName(gender!) : undefined;
  const age = needsAge ? generateAge(ageMin, ageMax) : undefined;
  const address = needsAddress ? generateAddress() : undefined;

  for (const field of fields) {
    switch (field) {
      case "nameKanji":
        record["氏名（漢字）"] = `${name!.lastName.kanji} ${name!.firstName.kanji}`;
        break;
      case "nameKana":
        record["氏名（カタカナ）"] = `${name!.lastName.kana} ${name!.firstName.kana}`;
        break;
      case "nameRomaji":
        record["氏名（ローマ字）"] = `${name!.firstName.romaji} ${name!.lastName.romaji}`;
        break;
      case "gender":
        record["性別"] = gender!;
        break;
      case "age":
        record["年齢"] = String(age!);
        break;
      case "birthDate":
        record["生年月日"] = generateBirthDate(age!);
        break;
      case "email":
        record["メールアドレス"] = generateEmail(name!.lastName, name!.firstName);
        break;
      case "phone":
        record["電話番号"] = generatePhone();
        break;
      case "zip":
        record["郵便番号"] = address!.zip;
        break;
      case "prefecture":
        record["都道府県"] = address!.prefecture;
        break;
      case "city":
        record["市区町村"] = `${address!.city}${address!.town}`;
        break;
      case "banchi":
        record["番地"] = address!.banchi;
        break;
      case "building":
        record["建物名"] = address!.building;
        break;
      case "company":
        record["会社名"] = generateCompanyName();
        break;
      case "department":
        record["部署名"] = generateDepartment();
        break;
      case "position":
        record["役職"] = generatePosition();
        break;
      case "userId":
        record["ユーザーID"] = generateUserId();
        break;
      case "password":
        record["パスワード"] = generatePassword();
        break;
      case "ipAddress":
        record["IPアドレス"] = generateIpAddress();
        break;
      case "macAddress":
        record["MACアドレス"] = generateMacAddress();
        break;
      case "creditCard":
        record["クレジットカード番号"] = generateCreditCard();
        break;
      case "myNumber":
        record["マイナンバー"] = generateMyNumber();
        break;
    }
  }

  return record;
}

export function generateData(options: GenerateOptions): Record<string, string>[] {
  const results: Record<string, string>[] = [];
  for (let i = 0; i < options.count; i++) {
    results.push(generateRecord(options.fields, options.ageMin, options.ageMax));
  }
  return results;
}

export function getHeaders(fields: FieldKey[]): string[] {
  return fields.map((f) => {
    const config = fieldConfigs.find((c) => c.key === f);
    switch (f) {
      case "nameKanji": return "氏名（漢字）";
      case "nameKana": return "氏名（カタカナ）";
      case "nameRomaji": return "氏名（ローマ字）";
      case "city": return "市区町村";
      case "building": return "建物名";
      default: return config?.label ?? f;
    }
  });
}

export type Preset = {
  name: string;
  fields: FieldKey[];
};

export const presets: Preset[] = [
  {
    name: "名簿風",
    fields: ["nameKanji", "nameKana", "gender", "age", "phone", "zip", "prefecture", "city", "banchi"],
  },
  {
    name: "ユーザーDB風",
    fields: ["userId", "nameKanji", "email", "password", "phone", "birthDate"],
  },
  {
    name: "テスト顧客データ",
    fields: [
      "nameKanji", "nameKana", "nameRomaji", "gender", "age", "birthDate",
      "email", "phone", "zip", "prefecture", "city", "banchi", "building",
      "company", "department", "position",
    ],
  },
];
