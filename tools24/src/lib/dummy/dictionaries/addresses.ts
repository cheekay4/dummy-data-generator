export type AddressEntry = {
  prefecture: string;
  city: string;
  town: string;
  zip: string;
};

export const addresses: AddressEntry[] = [
  // 北海道
  { prefecture: "北海道", city: "札幌市中央区", town: "大通西", zip: "060-0042" },
  { prefecture: "北海道", city: "札幌市北区", town: "北二十四条西", zip: "001-0024" },
  { prefecture: "北海道", city: "旭川市", town: "宮下通", zip: "070-0030" },
  { prefecture: "北海道", city: "函館市", town: "本町", zip: "040-0011" },
  { prefecture: "北海道", city: "帯広市", town: "西三条南", zip: "080-0013" },
  // 青森県
  { prefecture: "青森県", city: "青森市", town: "新町", zip: "030-0801" },
  { prefecture: "青森県", city: "八戸市", town: "城下", zip: "031-0086" },
  { prefecture: "青森県", city: "弘前市", town: "駅前町", zip: "036-8003" },
  // 岩手県
  { prefecture: "岩手県", city: "盛岡市", town: "中央通", zip: "020-0021" },
  { prefecture: "岩手県", city: "一関市", town: "大町", zip: "021-0884" },
  { prefecture: "岩手県", city: "花巻市", town: "花城町", zip: "025-0075" },
  // 宮城県
  { prefecture: "宮城県", city: "仙台市青葉区", town: "一番町", zip: "980-0811" },
  { prefecture: "宮城県", city: "仙台市宮城野区", town: "榴岡", zip: "983-0852" },
  { prefecture: "宮城県", city: "石巻市", town: "中央", zip: "986-0822" },
  { prefecture: "宮城県", city: "大崎市", town: "古川駅前大通", zip: "989-6163" },
  // 秋田県
  { prefecture: "秋田県", city: "秋田市", town: "中通", zip: "010-0001" },
  { prefecture: "秋田県", city: "横手市", town: "駅前町", zip: "013-0043" },
  { prefecture: "秋田県", city: "大仙市", town: "大曲通町", zip: "014-0027" },
  // 山形県
  { prefecture: "山形県", city: "山形市", town: "香澄町", zip: "990-0039" },
  { prefecture: "山形県", city: "鶴岡市", town: "本町", zip: "997-0034" },
  { prefecture: "山形県", city: "米沢市", town: "中央", zip: "992-0045" },
  // 福島県
  { prefecture: "福島県", city: "福島市", town: "栄町", zip: "960-8031" },
  { prefecture: "福島県", city: "郡山市", town: "駅前", zip: "963-8002" },
  { prefecture: "福島県", city: "いわき市", town: "平字田町", zip: "970-8026" },
  // 茨城県
  { prefecture: "茨城県", city: "水戸市", town: "泉町", zip: "310-0026" },
  { prefecture: "茨城県", city: "つくば市", town: "吾妻", zip: "305-0031" },
  { prefecture: "茨城県", city: "日立市", town: "幸町", zip: "317-0073" },
  // 栃木県
  { prefecture: "栃木県", city: "宇都宮市", town: "大通り", zip: "320-0811" },
  { prefecture: "栃木県", city: "小山市", town: "中央町", zip: "323-0023" },
  { prefecture: "栃木県", city: "足利市", town: "通", zip: "326-0053" },
  // 群馬県
  { prefecture: "群馬県", city: "前橋市", town: "本町", zip: "371-0023" },
  { prefecture: "群馬県", city: "高崎市", town: "栄町", zip: "370-0841" },
  { prefecture: "群馬県", city: "太田市", town: "浜町", zip: "373-0026" },
  // 埼玉県
  { prefecture: "埼玉県", city: "さいたま市大宮区", town: "桜木町", zip: "330-0854" },
  { prefecture: "埼玉県", city: "さいたま市浦和区", town: "高砂", zip: "330-0063" },
  { prefecture: "埼玉県", city: "川越市", town: "脇田本町", zip: "350-1123" },
  { prefecture: "埼玉県", city: "川口市", town: "栄町", zip: "332-0017" },
  { prefecture: "埼玉県", city: "越谷市", town: "南越谷", zip: "343-0845" },
  // 千葉県
  { prefecture: "千葉県", city: "千葉市中央区", town: "中央", zip: "260-0013" },
  { prefecture: "千葉県", city: "船橋市", town: "本町", zip: "273-0005" },
  { prefecture: "千葉県", city: "柏市", town: "柏", zip: "277-0005" },
  { prefecture: "千葉県", city: "松戸市", town: "本町", zip: "271-0091" },
  { prefecture: "千葉県", city: "市川市", town: "八幡", zip: "272-0021" },
  // 東京都
  { prefecture: "東京都", city: "千代田区", town: "丸の内", zip: "100-0005" },
  { prefecture: "東京都", city: "中央区", town: "銀座", zip: "104-0061" },
  { prefecture: "東京都", city: "港区", town: "六本木", zip: "106-0032" },
  { prefecture: "東京都", city: "新宿区", town: "西新宿", zip: "160-0023" },
  { prefecture: "東京都", city: "渋谷区", town: "神宮前", zip: "150-0001" },
  { prefecture: "東京都", city: "豊島区", town: "東池袋", zip: "170-0013" },
  { prefecture: "東京都", city: "台東区", town: "上野", zip: "110-0005" },
  { prefecture: "東京都", city: "品川区", town: "東品川", zip: "140-0002" },
  { prefecture: "東京都", city: "目黒区", town: "中目黒", zip: "153-0061" },
  { prefecture: "東京都", city: "世田谷区", town: "三軒茶屋", zip: "154-0024" },
  { prefecture: "東京都", city: "杉並区", town: "高円寺南", zip: "166-0003" },
  { prefecture: "東京都", city: "練馬区", town: "豊玉北", zip: "176-0012" },
  { prefecture: "東京都", city: "足立区", town: "千住", zip: "120-0034" },
  { prefecture: "東京都", city: "江東区", town: "豊洲", zip: "135-0061" },
  { prefecture: "東京都", city: "墨田区", town: "押上", zip: "131-0045" },
  { prefecture: "東京都", city: "八王子市", town: "旭町", zip: "192-0083" },
  { prefecture: "東京都", city: "町田市", town: "原町田", zip: "194-0013" },
  { prefecture: "東京都", city: "立川市", town: "曙町", zip: "190-0012" },
  // 神奈川県
  { prefecture: "神奈川県", city: "横浜市西区", town: "みなとみらい", zip: "220-0012" },
  { prefecture: "神奈川県", city: "横浜市中区", town: "山下町", zip: "231-0023" },
  { prefecture: "神奈川県", city: "川崎市川崎区", town: "駅前本町", zip: "210-0007" },
  { prefecture: "神奈川県", city: "相模原市中央区", town: "相模原", zip: "252-0231" },
  { prefecture: "神奈川県", city: "藤沢市", town: "藤沢", zip: "251-0055" },
  { prefecture: "神奈川県", city: "横須賀市", town: "本町", zip: "238-0041" },
  // 新潟県
  { prefecture: "新潟県", city: "新潟市中央区", town: "万代", zip: "950-0088" },
  { prefecture: "新潟県", city: "長岡市", town: "大手通", zip: "940-0062" },
  { prefecture: "新潟県", city: "上越市", town: "本町", zip: "943-0832" },
  // 富山県
  { prefecture: "富山県", city: "富山市", town: "桜町", zip: "930-0003" },
  { prefecture: "富山県", city: "高岡市", town: "末広町", zip: "933-0023" },
  { prefecture: "富山県", city: "射水市", town: "三ケ", zip: "934-0049" },
  // 石川県
  { prefecture: "石川県", city: "金沢市", town: "片町", zip: "920-0981" },
  { prefecture: "石川県", city: "白山市", town: "西新町", zip: "924-0872" },
  { prefecture: "石川県", city: "小松市", town: "土居原町", zip: "923-0921" },
  // 福井県
  { prefecture: "福井県", city: "福井市", town: "中央", zip: "910-0006" },
  { prefecture: "福井県", city: "敦賀市", town: "本町", zip: "914-0063" },
  { prefecture: "福井県", city: "越前市", town: "府中", zip: "915-0071" },
  // 山梨県
  { prefecture: "山梨県", city: "甲府市", town: "丸の内", zip: "400-0031" },
  { prefecture: "山梨県", city: "富士吉田市", town: "中曽根", zip: "403-0004" },
  { prefecture: "山梨県", city: "甲斐市", town: "篠原", zip: "400-0104" },
  // 長野県
  { prefecture: "長野県", city: "長野市", town: "南千歳", zip: "380-0823" },
  { prefecture: "長野県", city: "松本市", town: "中央", zip: "390-0811" },
  { prefecture: "長野県", city: "上田市", town: "天神", zip: "386-0025" },
  // 岐阜県
  { prefecture: "岐阜県", city: "岐阜市", town: "神田町", zip: "500-8833" },
  { prefecture: "岐阜県", city: "大垣市", town: "高屋町", zip: "503-0908" },
  { prefecture: "岐阜県", city: "多治見市", town: "本町", zip: "507-0033" },
  // 静岡県
  { prefecture: "静岡県", city: "静岡市葵区", town: "御幸町", zip: "420-0857" },
  { prefecture: "静岡県", city: "浜松市中区", town: "鍛冶町", zip: "430-0928" },
  { prefecture: "静岡県", city: "沼津市", town: "大手町", zip: "410-0801" },
  { prefecture: "静岡県", city: "富士市", town: "本町", zip: "417-0051" },
  // 愛知県
  { prefecture: "愛知県", city: "名古屋市中区", town: "栄", zip: "460-0008" },
  { prefecture: "愛知県", city: "名古屋市中村区", town: "名駅", zip: "450-0002" },
  { prefecture: "愛知県", city: "名古屋市千種区", town: "今池", zip: "464-0850" },
  { prefecture: "愛知県", city: "豊田市", town: "西町", zip: "471-0025" },
  { prefecture: "愛知県", city: "豊橋市", town: "駅前大通", zip: "440-0888" },
  { prefecture: "愛知県", city: "岡崎市", town: "康生通南", zip: "444-0045" },
  // 三重県
  { prefecture: "三重県", city: "津市", town: "栄町", zip: "514-0009" },
  { prefecture: "三重県", city: "四日市市", town: "諏訪町", zip: "510-0085" },
  { prefecture: "三重県", city: "伊勢市", town: "本町", zip: "516-0074" },
  // 滋賀県
  { prefecture: "滋賀県", city: "大津市", town: "浜大津", zip: "520-0043" },
  { prefecture: "滋賀県", city: "草津市", town: "渋川", zip: "525-0034" },
  { prefecture: "滋賀県", city: "彦根市", town: "佐和町", zip: "522-0068" },
  // 京都府
  { prefecture: "京都府", city: "京都市下京区", town: "四条通", zip: "600-8006" },
  { prefecture: "京都府", city: "京都市中京区", town: "河原町通", zip: "604-8005" },
  { prefecture: "京都府", city: "京都市左京区", town: "下鴨本町", zip: "606-0864" },
  { prefecture: "京都府", city: "宇治市", town: "宇治", zip: "611-0021" },
  // 大阪府
  { prefecture: "大阪府", city: "大阪市北区", town: "梅田", zip: "530-0001" },
  { prefecture: "大阪府", city: "大阪市中央区", town: "難波", zip: "542-0076" },
  { prefecture: "大阪府", city: "大阪市天王寺区", town: "上本町", zip: "543-0001" },
  { prefecture: "大阪府", city: "大阪市浪速区", town: "日本橋", zip: "556-0005" },
  { prefecture: "大阪府", city: "堺市堺区", town: "市之町東", zip: "590-0953" },
  { prefecture: "大阪府", city: "豊中市", town: "本町", zip: "560-0021" },
  { prefecture: "大阪府", city: "吹田市", town: "江坂町", zip: "564-0063" },
  { prefecture: "大阪府", city: "東大阪市", town: "長堂", zip: "577-0013" },
  // 兵庫県
  { prefecture: "兵庫県", city: "神戸市中央区", town: "三宮町", zip: "650-0021" },
  { prefecture: "兵庫県", city: "神戸市兵庫区", town: "新開地", zip: "652-0811" },
  { prefecture: "兵庫県", city: "姫路市", town: "駅前町", zip: "670-0927" },
  { prefecture: "兵庫県", city: "西宮市", town: "北口町", zip: "663-8035" },
  { prefecture: "兵庫県", city: "尼崎市", town: "潮江", zip: "661-0976" },
  // 奈良県
  { prefecture: "奈良県", city: "奈良市", town: "三条本町", zip: "630-8122" },
  { prefecture: "奈良県", city: "橿原市", town: "内膳町", zip: "634-0804" },
  { prefecture: "奈良県", city: "生駒市", town: "北新町", zip: "630-0251" },
  // 和歌山県
  { prefecture: "和歌山県", city: "和歌山市", town: "本町", zip: "640-8033" },
  { prefecture: "和歌山県", city: "田辺市", town: "湊", zip: "646-0031" },
  { prefecture: "和歌山県", city: "海南市", town: "名高", zip: "642-0002" },
  // 鳥取県
  { prefecture: "鳥取県", city: "鳥取市", town: "栄町", zip: "680-0846" },
  { prefecture: "鳥取県", city: "米子市", town: "明治町", zip: "683-0067" },
  { prefecture: "鳥取県", city: "倉吉市", town: "上井町", zip: "682-0802" },
  // 島根県
  { prefecture: "島根県", city: "松江市", town: "朝日町", zip: "690-0003" },
  { prefecture: "島根県", city: "出雲市", town: "今市町", zip: "693-0001" },
  { prefecture: "島根県", city: "浜田市", town: "殿町", zip: "697-0024" },
  // 岡山県
  { prefecture: "岡山県", city: "岡山市北区", town: "駅前町", zip: "700-0023" },
  { prefecture: "岡山県", city: "倉敷市", town: "阿知", zip: "710-0055" },
  { prefecture: "岡山県", city: "津山市", town: "大手町", zip: "708-0834" },
  // 広島県
  { prefecture: "広島県", city: "広島市中区", town: "紙屋町", zip: "730-0031" },
  { prefecture: "広島県", city: "広島市南区", town: "松原町", zip: "732-0822" },
  { prefecture: "広島県", city: "福山市", town: "三之丸町", zip: "720-0066" },
  { prefecture: "広島県", city: "呉市", town: "中央", zip: "737-0051" },
  // 山口県
  { prefecture: "山口県", city: "山口市", town: "中央", zip: "753-0042" },
  { prefecture: "山口県", city: "下関市", town: "竹崎町", zip: "750-0025" },
  { prefecture: "山口県", city: "周南市", town: "銀座", zip: "745-0032" },
  // 徳島県
  { prefecture: "徳島県", city: "徳島市", town: "寺島本町西", zip: "770-0831" },
  { prefecture: "徳島県", city: "鳴門市", town: "撫養町南浜", zip: "772-0003" },
  { prefecture: "徳島県", city: "阿南市", town: "富岡町", zip: "774-0030" },
  // 香川県
  { prefecture: "香川県", city: "高松市", town: "番町", zip: "760-0017" },
  { prefecture: "香川県", city: "丸亀市", town: "大手町", zip: "763-0022" },
  { prefecture: "香川県", city: "坂出市", town: "駒止町", zip: "762-0045" },
  // 愛媛県
  { prefecture: "愛媛県", city: "松山市", town: "大街道", zip: "790-0004" },
  { prefecture: "愛媛県", city: "今治市", town: "別宮町", zip: "794-0026" },
  { prefecture: "愛媛県", city: "新居浜市", town: "繁本町", zip: "792-0025" },
  // 高知県
  { prefecture: "高知県", city: "高知市", town: "帯屋町", zip: "780-0841" },
  { prefecture: "高知県", city: "南国市", town: "大埇甲", zip: "783-0006" },
  { prefecture: "高知県", city: "四万十市", town: "中村大橋通", zip: "787-0033" },
  // 福岡県
  { prefecture: "福岡県", city: "福岡市博多区", town: "博多駅前", zip: "812-0011" },
  { prefecture: "福岡県", city: "福岡市中央区", town: "天神", zip: "810-0001" },
  { prefecture: "福岡県", city: "北九州市小倉北区", town: "船場町", zip: "802-0006" },
  { prefecture: "福岡県", city: "久留米市", town: "東町", zip: "830-0032" },
  { prefecture: "福岡県", city: "福岡市早良区", town: "西新", zip: "814-0002" },
  // 佐賀県
  { prefecture: "佐賀県", city: "佐賀市", town: "駅前中央", zip: "849-0911" },
  { prefecture: "佐賀県", city: "唐津市", town: "新興町", zip: "847-0013" },
  { prefecture: "佐賀県", city: "鳥栖市", town: "京町", zip: "841-0052" },
  // 長崎県
  { prefecture: "長崎県", city: "長崎市", town: "浜町", zip: "850-0853" },
  { prefecture: "長崎県", city: "佐世保市", town: "栄町", zip: "857-0875" },
  { prefecture: "長崎県", city: "諫早市", town: "栄町", zip: "854-0072" },
  // 熊本県
  { prefecture: "熊本県", city: "熊本市中央区", town: "下通", zip: "860-0807" },
  { prefecture: "熊本県", city: "熊本市東区", town: "健軍", zip: "862-0903" },
  { prefecture: "熊本県", city: "八代市", town: "本町", zip: "866-0861" },
  // 大分県
  { prefecture: "大分県", city: "大分市", town: "府内町", zip: "870-0021" },
  { prefecture: "大分県", city: "別府市", town: "駅前町", zip: "874-0935" },
  { prefecture: "大分県", city: "中津市", town: "豊田町", zip: "871-0058" },
  // 宮崎県
  { prefecture: "宮崎県", city: "宮崎市", town: "橘通東", zip: "880-0805" },
  { prefecture: "宮崎県", city: "都城市", town: "栄町", zip: "885-0072" },
  { prefecture: "宮崎県", city: "延岡市", town: "幸町", zip: "882-0053" },
  // 鹿児島県
  { prefecture: "鹿児島県", city: "鹿児島市", town: "天文館町", zip: "892-0843" },
  { prefecture: "鹿児島県", city: "霧島市", town: "国分中央", zip: "899-4332" },
  { prefecture: "鹿児島県", city: "鹿屋市", town: "本町", zip: "893-0009" },
  // 沖縄県
  { prefecture: "沖縄県", city: "那覇市", town: "久茂地", zip: "900-0015" },
  { prefecture: "沖縄県", city: "浦添市", town: "安波茶", zip: "901-2101" },
  { prefecture: "沖縄県", city: "沖縄市", town: "中央", zip: "904-0004" },
  { prefecture: "沖縄県", city: "宜野湾市", town: "宇地泊", zip: "901-2227" },
];
