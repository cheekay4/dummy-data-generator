#!/usr/bin/env node
/**
 * 症例 DB のオーサリングスクリプト（§7.1: 実行時生成はしない。オフライン生成 → レビュー → 固定）。
 * ランドマーク座標は case-landmarks.gen.json（メッシュ幾何近似の皮膚投影）を参照する。
 * 出力: src/data/cases/case-XX-*.json（全件 reviewStatus="draft"。教員レビューで approved に上げる）
 *
 * 内訳設計は DECISIONS.md D-007 を参照。
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "..", "src");
const GEN = JSON.parse(readFileSync(join(SRC, "data", "case-landmarks.gen.json"), "utf8"));

const P = (name) => {
  const p = GEN.points[name];
  if (!p) throw new Error(`landmark point not found: ${name}`);
  return p.skinPoint;
};

const RATIONALE_NOTE = "座標はメッシュ幾何近似の皮膚投影（教員レビュー前）";
const lm = (fmaId, pointName, radiusMm, weight, rationale) => ({
  fmaId,
  center: P(pointName),
  radiusMm,
  weight,
  radiusRationale: `${rationale}。${RATIONALE_NOTE}`,
});

const REVIEW = { reviewedBy: null, reviewedAt: null, reviewStatus: "draft" };

// FMA ID 定数（scope.json 準拠）
const M = {
  supraspinatus: "FMA9629", infraspinatus: "FMA32546", teresMinor: "FMA32550",
  teresMajor: "FMA32549", subscapularis: "FMA13413", deltoid: "FMA32521",
  biceps: "FMA37670", triceps: "FMA37688", brachialis: "FMA37667",
  coracobrachialis: "FMA37664", pectMajor: "FMA9627", trapezius: "FMA9626",
  serratus: "FMA13397", rhomboidMajor: "FMA13379", rhomboidMinor: "FMA13380",
  levator: "FMA32519", latissimus: "FMA13357",
};
const N = {
  suprascapular: "FMA37025", axillary: "FMA37072", musculocutaneous: "FMA37064",
  radial: "FMA37069", median: "FMA14385", supSubscap: "FMA65304",
  infSubscap: "FMA65307", thoracodorsal: "FMA65290", longThoracic: "FMA65275",
  dorsalScapular: "FMA65279", accessory: "FMA6720",
};
const L = {
  greaterTubercle: "FMA23390", lesserTubercle: "FMA23393",
  intertubercular: "FMA23396", deltoidTuberosity: "FMA23418",
  medialBorder: "FMA23242",
};

const cases = [
  {
    id: "case-01-supraspinatus-tendinopathy",
    region: "shoulder",
    difficulty: "basic",
    public: {
      demographics: "52歳 男性 右利き 事務職",
      chiefComplaint: "右肩が上がらない。夜、痛みで目が覚めることがある",
      historyScript: {
        "発症・きっかけ": "2か月ほど前から徐々に。思い当たるきっかけは特にない",
        "疼痛部位": "肩の外側、少し前のあたり。腕の付け根の外側が痛む",
        "疼痛の性質": "動かすとズキッとする。じっとしていれば軽い鈍痛",
        "夜間痛": "ある。痛いほうの肩を下にして寝ると目が覚める",
        "増悪動作": "腕を横から上げる途中が一番痛い。上まで上がればましになる",
        "軽快因子": "腕を下ろして安静にしていると楽",
        "職業・生活": "デスクワーク中心。書類を高い棚に置くのがつらい",
        "スポーツ・趣味": "特にしていない",
        "既往・全身状態": "特記なし。健診でも異常は言われていない",
        "しびれ・感覚": "しびれはない",
      },
      persona: {
        speechStyle: "落ち着いた話し方。質問には簡潔に答える",
        emotionalState: "夜眠れないことにやや疲れている",
        cooperativeness: "high",
      },
      forbidden: [
        "夜間痛のことは聞かれるまで自分からは言わない",
        "痛みの正確な部位は「このあたり」と大まかにしか言わない（検査者に触診で確認させる）",
        "病名や原因を推測して口にしない",
      ],
    },
    truth: {
      targetLandmarks: [
        lm(L.greaterTubercle, "greater_tubercle_r", 25, 2, "三角筋越しに触れる骨指標のためやや広め（D-008）"),
        lm(M.supraspinatus, "supraspinatus_belly_r", 35, 1, "僧帽筋越しの深部筋腹で境界が不明瞭なため広め（D-008）"),
      ],
      responsibleMuscles: [M.supraspinatus],
      innervation: [N.suprascapular],
      diagnosisLabel: "棘上筋腱障害（肩峰下インピンジメントを含む腱板障害の初期像）",
      distractors: [
        { fmaId: M.deltoid, kind: "muscle", reason: "痛みの部位が三角筋領域と重なるため混同しやすいが、有痛弧と夜間痛は腱板由来を示唆する" },
        { fmaId: M.infraspinatus, kind: "muscle", reason: "同じ腱板だが停止は大結節中面で、主訴の外転時痛は棘上筋の関与がより大きい" },
        { fmaId: N.axillary, kind: "nerve", reason: "三角筋と混同した場合に選ばれやすい。棘上筋の支配は肩甲上神経" },
      ],
    },
    review: REVIEW,
  },
  {
    id: "case-02-biceps-long-head",
    region: "shoulder",
    difficulty: "basic",
    public: {
      demographics: "45歳 女性 右利き 保育士",
      chiefComplaint: "右肩の前が痛い。子どもを抱き上げるときにズキッとする",
      historyScript: {
        "発症・きっかけ": "3週間前から。園で子どもを繰り返し抱き上げた日の翌日から痛み出した",
        "疼痛部位": "肩の前面。力こぶの筋を上へたどった付け根のあたり",
        "疼痛の性質": "持ち上げ動作で鋭い痛み。普段は違和感程度",
        "夜間痛": "ほとんどない。寝られている",
        "増悪動作": "前へ手を伸ばして物を持ち上げる、ドライヤーで髪を乾かす動作",
        "軽快因子": "腕を使わなければ痛まない",
        "職業・生活": "保育士。抱っこや荷物運びが多い",
        "スポーツ・趣味": "ヨガを週1回。最近は休んでいる",
        "既往・全身状態": "特記なし",
        "しびれ・感覚": "ない",
      },
      persona: {
        speechStyle: "早口で具体的。日常の動作を例に挙げて説明する",
        emotionalState: "仕事に支障が出ることを心配している",
        cooperativeness: "high",
      },
      forbidden: [
        "痛む部位を最初は「肩の前」としか言わない（詳細は聞かれたら答える）",
        "きっかけの抱き上げ動作は「何かきっかけは？」と聞かれてから話す",
        "病名を推測して口にしない",
      ],
    },
    truth: {
      targetLandmarks: [
        lm(L.intertubercular, "intertubercular_r", 25, 2, "大小結節の間の溝。軽度外旋位で触れやすい骨指標だが三角筋前部越しのためやや広め（D-008）"),
        lm(M.biceps, "biceps_long_belly_r", 30, 1, "表在筋腹（D-008）"),
      ],
      responsibleMuscles: [M.biceps],
      innervation: [N.musculocutaneous],
      diagnosisLabel: "上腕二頭筋長頭腱障害（結節間溝部の腱炎）",
      distractors: [
        { fmaId: M.supraspinatus, kind: "muscle", reason: "肩前外側の痛みで腱板と迷いやすいが、圧痛の中心は結節間溝で挙上痛より持ち上げ動作痛が主体" },
        { fmaId: M.coracobrachialis, kind: "muscle", reason: "同じ肩前面・筋皮神経支配だが、起始は烏口突起で圧痛部位が内側になる" },
        { fmaId: N.median, kind: "nerve", reason: "上腕前面の神経として混同しやすいが、上腕二頭筋の支配は筋皮神経" },
      ],
    },
    review: REVIEW,
  },
  {
    id: "case-03-trapezius-levator",
    region: "shoulder",
    difficulty: "basic",
    public: {
      demographics: "38歳 女性 右利き 事務職（デスクワーク）",
      chiefComplaint: "右の首から肩にかけて重だるく、こりがひどい。ときどき頭痛もする",
      historyScript: {
        "発症・きっかけ": "半年以上前から慢性的。締め切り前の残業が続くと悪化する",
        "疼痛部位": "首の付け根から肩の上面。肩甲骨の内上のあたりも張る",
        "疼痛の性質": "重だるい鈍痛と張り感。ズキズキはしない",
        "夜間痛": "ない。ただし朝起きたときに固まっている感じがする",
        "増悪動作": "長時間のパソコン作業、下を向いてのスマホ操作",
        "軽快因子": "入浴で温まると楽。マッサージで一時的に軽くなる",
        "職業・生活": "1日8時間以上パソコン作業。モニターは1枚で少し低い位置にある",
        "スポーツ・趣味": "運動習慣はない",
        "既往・全身状態": "特記なし。血圧正常",
        "しびれ・感覚": "手のしびれはない",
      },
      persona: {
        speechStyle: "丁寧だがやや遠回しな話し方",
        emotionalState: "長引いていることにうんざりしている",
        cooperativeness: "high",
      },
      forbidden: [
        "頭痛のことは聞かれるまで言わない",
        "作業環境（モニター位置）は生活について聞かれてから話す",
        "病名や「ストレートネック」等の俗称を自分からは口にしない",
      ],
    },
    truth: {
      targetLandmarks: [
        lm(M.trapezius, "trapezius_upper_belly_r", 30, 2, "表在筋腹（僧帽筋上部線維の圧痛好発部）（D-008）"),
        lm(M.levator, "levator_insertion_r", 35, 1, "肩甲骨上角への停止部。僧帽筋越しで境界不明瞭なため広め（D-008）"),
      ],
      responsibleMuscles: [M.trapezius, M.levator],
      innervation: [N.accessory, N.dorsalScapular],
      diagnosisLabel: "僧帽筋上部・肩甲挙筋の筋筋膜性疼痛（いわゆる慢性肩こり）",
      distractors: [
        { fmaId: M.rhomboidMinor, kind: "muscle", reason: "肩甲骨内上の張りで混同しやすいが、主圧痛は僧帽筋上部線維と上角停止部にある" },
        { fmaId: M.supraspinatus, kind: "muscle", reason: "肩上面の痛みで想起されやすいが、挙上時の有痛弧がなく安静時の張り感が主体" },
        { fmaId: N.suprascapular, kind: "nerve", reason: "肩上部の神経として選ばれやすいが、僧帽筋の運動支配は副神経" },
      ],
    },
    review: REVIEW,
  },
  {
    id: "case-04-infraspinatus-tp",
    region: "shoulder",
    difficulty: "intermediate",
    public: {
      demographics: "41歳 男性 右利き 会社員（週末テニス愛好家）",
      chiefComplaint: "右肩の後ろが痛い。サーブのフォロースルーで痛みが走る",
      historyScript: {
        "発症・きっかけ": "1か月前、テニスの試合で多くサーブを打った翌日から",
        "疼痛部位": "肩甲骨の背中側。外側寄りの少し下のあたり。ときどき肩の外側や腕にも響く",
        "疼痛の性質": "押すと強い圧痛がある点がある。動作時はズーンと響く痛み",
        "夜間痛": "痛い側を下にすると気になるが、眠れないほどではない",
        "増悪動作": "サーブの振り抜き、背中に手を回す動作",
        "軽快因子": "温めると楽になる",
        "職業・生活": "デスクワーク。テニスは週2回",
        "スポーツ・趣味": "テニス歴10年。最近ラケットを重いものに替えた",
        "既往・全身状態": "特記なし",
        "しびれ・感覚": "しびれというより「響く」感じ。感覚が鈍い場所はない",
      },
      persona: {
        speechStyle: "スポーツの話になると饒舌。動作を身振りで説明したがる",
        emotionalState: "早くテニスに復帰したい焦りがある",
        cooperativeness: "high",
      },
      forbidden: [
        "ラケットを替えたことは道具・練習内容を聞かれてから話す",
        "放散痛（腕に響く）は部位を詳しく聞かれてから言う",
        "病名を推測して口にしない",
      ],
    },
    truth: {
      targetLandmarks: [
        lm(M.infraspinatus, "infraspinatus_belly_r", 35, 2, "棘下窩の筋腹。トリガーポイント好発部だが深さがあるため広め（D-008）"),
        lm(M.teresMinor, "teres_minor_belly_r", 35, 1, "肩甲骨外側縁上部の小筋で境界不明瞭のため広め（D-008）"),
      ],
      responsibleMuscles: [M.infraspinatus, M.teresMinor],
      innervation: [N.suprascapular, N.axillary],
      diagnosisLabel: "棘下筋・小円筋の筋筋膜性疼痛（トリガーポイントによる後方肩痛）",
      distractors: [
        { fmaId: M.teresMajor, kind: "muscle", reason: "位置が近く混同しやすいが、大円筋は下角起始で支配神経も下肩甲下神経と異なる" },
        { fmaId: M.deltoid, kind: "muscle", reason: "肩外側への放散痛から選ばれやすいが、圧痛の中心は棘下窩にある" },
        { fmaId: N.radial, kind: "nerve", reason: "腕への放散から選ばれやすいが、棘下筋の支配は肩甲上神経・小円筋は腋窩神経" },
      ],
    },
    review: REVIEW,
  },
  {
    id: "case-05-subscapularis-stiffness",
    region: "shoulder",
    difficulty: "advanced",
    public: {
      demographics: "58歳 女性 右利き パート勤務（スーパーの品出し）",
      chiefComplaint: "右肩が固まって動かない。特に腕を外へひねる動きと、帯を結ぶような動きができない",
      historyScript: {
        "発症・きっかけ": "4か月前から徐々に。最初は痛みだけだったが、だんだん動かなくなった",
        "疼痛部位": "肩の前のほう。奥のほうが痛い感じ。最近は痛みより動かないことが困る",
        "疼痛の性質": "動かせる範囲の端で突っ張るような痛み",
        "夜間痛": "以前はあったが、最近は減ってきた",
        "増悪動作": "エプロンの紐を後ろで結ぶ、髪を結ぶ、腕を外へひねる動き",
        "軽快因子": "無理に動かさなければ痛まない",
        "職業・生活": "品出しで高い棚に商品を上げる作業がつらく、担当を替えてもらった",
        "スポーツ・趣味": "特にない",
        "既往・全身状態": "2年前に健診で血糖が高めと言われた。治療はしていない",
        "しびれ・感覚": "ない",
      },
      persona: {
        speechStyle: "ゆっくり話す。動きの説明は実演しようとして痛がる",
        emotionalState: "長引いてあきらめ気味。改善するのか不安",
        cooperativeness: "high",
      },
      forbidden: [
        "血糖のことは既往歴を聞かれるまで言わない",
        "夜間痛が過去にあったことは経過を聞かれてから話す",
        "「五十肩」という言葉を自分からは使わない",
      ],
    },
    truth: {
      targetLandmarks: [
        lm(L.lesserTubercle, "lesser_tubercle_r", 25, 2, "肩甲下筋停止部の骨指標。烏口突起の外下方で三角筋前部越しのためやや広め（D-008）。筋腹は腋窩深部で体表からの直接触診が困難なため停止部を対象とする"),
      ],
      responsibleMuscles: [M.subscapularis],
      innervation: [N.supSubscap, N.infSubscap],
      diagnosisLabel: "肩甲下筋の伸張性低下を主体とする肩関節拘縮（凍結肩の回復期像）",
      distractors: [
        { fmaId: M.pectMajor, kind: "muscle", reason: "同じ内旋筋で外旋制限に関与しうるが、結帯動作の制限と小結節部圧痛は肩甲下筋を示唆する" },
        { fmaId: M.biceps, kind: "muscle", reason: "肩前面の痛みで選ばれやすいが、圧痛の中心は結節間溝より内側の小結節部" },
        { fmaId: N.musculocutaneous, kind: "nerve", reason: "肩前面から想起されやすいが、肩甲下筋の支配は上・下肩甲下神経" },
      ],
    },
    review: REVIEW,
  },
  {
    id: "case-06-thrower-posterior",
    region: "shoulder",
    difficulty: "intermediate",
    public: {
      demographics: "19歳 男性 右利き 大学野球部（投手）",
      chiefComplaint: "投球のリリースからフォロースルーで右肩の後ろから脇の下あたりが痛い",
      historyScript: {
        "発症・きっかけ": "2週間前の連投後から。徐々に悪化している",
        "疼痛部位": "肩の後ろ、脇の下寄り。腕の後ろ側の上のほうにも張りがある",
        "疼痛の性質": "投げるときだけ鋭い痛み。普段は張り感",
        "夜間痛": "ない",
        "増悪動作": "投球動作の後半。特にボールを離した後の振り抜き",
        "軽快因子": "投げなければ痛まない。ストレッチで少し楽",
        "職業・生活": "大学2年。週6日練習",
        "スポーツ・趣味": "野球歴11年。球速は最近落ちていない",
        "既往・全身状態": "高校時代に肘の張りを経験。肩は初めて",
        "しびれ・感覚": "ない",
      },
      persona: {
        speechStyle: "体育会系の歯切れよい返答。痛みを軽く見せようとする傾向",
        emotionalState: "リーグ戦が近く、練習を休みたくない",
        cooperativeness: "high",
      },
      forbidden: [
        "連投の事実は練習量を聞かれてから話す",
        "痛みを1〜10で聞かれたら実際より低めに言う（ただし嘘はつかない）",
        "肘の既往は既往歴を聞かれるまで言わない",
      ],
    },
    truth: {
      targetLandmarks: [
        lm(M.triceps, "triceps_long_belly_r", 35, 2, "上腕三頭筋長頭の近位筋腹。関節下結節起始部への負荷部位（D-008: 筋腹広め）"),
        lm(M.teresMajor, "teres_major_belly_r", 35, 1, "腋窩後壁を構成する筋腹。境界不明瞭のため広め（D-008）"),
      ],
      responsibleMuscles: [M.triceps, M.teresMajor],
      innervation: [N.radial, N.infSubscap],
      diagnosisLabel: "投球フォロースルー期の後方筋群（上腕三頭筋長頭・大円筋）過負荷",
      distractors: [
        { fmaId: M.infraspinatus, kind: "muscle", reason: "投球障害の後方痛でまず想起されるが、本例の圧痛は腋窩後壁〜三頭筋長頭起始部が中心" },
        { fmaId: M.latissimus, kind: "muscle", reason: "腋窩後壁の構成筋で混同しやすい。広背筋はより下方から停止に向かい、支配は胸背神経" },
        { fmaId: N.axillary, kind: "nerve", reason: "外側腋窩隙の近傍で選ばれやすいが、三頭筋は橈骨神経・大円筋は下肩甲下神経" },
      ],
    },
    review: REVIEW,
  },
  {
    id: "case-07-serratus-winging",
    region: "shoulder",
    difficulty: "advanced",
    public: {
      demographics: "24歳 女性 右利き 社会人バレーボール選手（会社員）",
      chiefComplaint: "右腕を前へ上げると力が入らず、肩甲骨のあたりに違和感がある。家族に「背中の骨が浮き出ている」と言われた",
      historyScript: {
        "発症・きっかけ": "3週間前、重いリュックを長時間背負って登山した数日後から",
        "疼痛部位": "痛みは強くない。肩甲骨の内側の縁のあたりに違和感",
        "疼痛の性質": "痛みより「力が入らない」「引っかかる」感じ",
        "夜間痛": "ない",
        "増悪動作": "腕を前方へ押し出す動き。壁を押すと肩甲骨が浮く感じがする",
        "軽快因子": "腕を使わなければ気にならない",
        "職業・生活": "デスクワーク。通勤でもリュックを使う",
        "スポーツ・趣味": "バレーボール週2回。最近スパイクが打ちにくい",
        "既往・全身状態": "特記なし。発熱や先行感染の記憶はない",
        "しびれ・感覚": "しびれはない。感覚が鈍い場所もない",
      },
      persona: {
        speechStyle: "理知的で観察が細かい。自分の症状をよく観察して伝える",
        emotionalState: "力が入らないことに強い不安を感じている",
        cooperativeness: "high",
      },
      forbidden: [
        "登山とリュックの件は、きっかけを聞かれてから話す",
        "「肩甲骨が浮く」は増悪動作か視診の話題になってから言う",
        "神経麻痺などの言葉を自分からは使わない",
      ],
    },
    truth: {
      targetLandmarks: [
        lm(L.medialBorder, "medial_border_mid_r", 30, 2, "翼状肩甲の観察・触診部位である肩甲骨内側縁（D-008: 浅層骨縁だが長い構造のため中程度）"),
        lm(M.serratus, "serratus_belly_r", 40, 1, "側胸部の筋腹（鋸歯状部）。肋骨上で境界不明瞭のため最大幅（D-008）"),
      ],
      responsibleMuscles: [M.serratus],
      innervation: [N.longThoracic],
      diagnosisLabel: "長胸神経障害による前鋸筋機能不全（翼状肩甲）の疑い",
      distractors: [
        { fmaId: M.rhomboidMajor, kind: "muscle", reason: "同じ内側縁に停止し翼状肩甲の鑑別対象（菱形筋麻痺では下角が外方へ回旋する点が異なる）" },
        { fmaId: M.trapezius, kind: "muscle", reason: "僧帽筋麻痺でも肩甲骨の位置異常が出るが、前方挙上での浮き上がりは前鋸筋を示唆" },
        { fmaId: N.dorsalScapular, kind: "nerve", reason: "肩甲骨内側の症状から選ばれやすいが、前鋸筋の支配は長胸神経" },
      ],
    },
    review: REVIEW,
  },
  {
    id: "case-08-deltoid-overuse",
    region: "shoulder",
    difficulty: "basic",
    public: {
      demographics: "29歳 男性 右利き ITエンジニア（筋トレ初心者）",
      chiefComplaint: "右肩の外側が痛い。ジムでショルダープレスをした翌日から",
      historyScript: {
        "発症・きっかけ": "4日前、ジムで普段より重い重量に挑戦した翌日から",
        "疼痛部位": "肩の外側の盛り上がった筋。腕の外側の中ほどまで痛だるい",
        "疼痛の性質": "筋肉痛のような痛みが強く残っている。押すと痛い",
        "夜間痛": "寝返りで少し痛むが眠れる",
        "増悪動作": "腕を横に上げる動作。シャンプーで腕を上げるのもつらい",
        "軽快因子": "安静。湿布で少し楽",
        "職業・生活": "デスクワーク。ジム通いは2か月目",
        "スポーツ・趣味": "筋トレ週3回。フォームは動画で自己流",
        "既往・全身状態": "特記なし",
        "しびれ・感覚": "ない。肩の外側の感覚も普通",
      },
      persona: {
        speechStyle: "フランクで若者らしい話し方。トレーニング用語を使う",
        emotionalState: "軽く考えているが、長引くのは嫌がっている",
        cooperativeness: "high",
      },
      forbidden: [
        "重量を上げた事実は、きっかけ・運動内容を聞かれてから話す",
        "自己流フォームであることはトレーニング内容を聞かれてから話す",
      ],
    },
    truth: {
      targetLandmarks: [
        lm(L.deltoidTuberosity, "deltoid_tuberosity_r", 25, 2, "三角筋停止部の骨指標。筋腹越しでやや不明瞭のため広め（D-008）"),
        lm(M.deltoid, "deltoid_middle_belly_r", 30, 1, "表在筋腹（三角筋中部）（D-008）"),
      ],
      responsibleMuscles: [M.deltoid],
      innervation: [N.axillary],
      diagnosisLabel: "三角筋の運動後過負荷（遅発性筋痛〜停止部炎の初期像）",
      distractors: [
        { fmaId: M.supraspinatus, kind: "muscle", reason: "外転時痛で腱板と迷いやすいが、圧痛は筋腹と三角筋粗面に限局し夜間痛が軽い" },
        { fmaId: M.biceps, kind: "muscle", reason: "上腕の痛みとして選ばれやすいが、痛みは外側面で屈曲・回外では増悪しない" },
        { fmaId: N.musculocutaneous, kind: "nerve", reason: "上腕の筋として二頭筋と混同した場合の誤答。三角筋の支配は腋窩神経" },
      ],
    },
    review: REVIEW,
  },
  {
    id: "case-09-rhomboid-interscapular",
    region: "shoulder",
    difficulty: "intermediate",
    public: {
      demographics: "35歳 女性 右利き 美容師",
      chiefComplaint: "右の肩甲骨と背骨の間がズーンと痛む。仕事の後半になるとひどい",
      historyScript: {
        "発症・きっかけ": "数か月前から。立て込んだ週の後から気になり出した",
        "疼痛部位": "肩甲骨の内側の縁と背骨の間。指1本で「ここ」と示せる点がある",
        "疼痛の性質": "重い鈍痛。ひどいときは焼けるような感じ",
        "夜間痛": "ない",
        "増悪動作": "腕を前に伸ばしたままハサミを使い続ける姿勢。長時間の同一姿勢",
        "軽快因子": "肩甲骨を寄せて伸びをすると一時的に楽",
        "職業・生活": "美容師10年目。1日8時間立ち仕事で腕を前に上げている時間が長い",
        "スポーツ・趣味": "ない",
        "既往・全身状態": "特記なし",
        "しびれ・感覚": "腕や手のしびれはない",
      },
      persona: {
        speechStyle: "接客業らしい丁寧な話し方。痛む場所を的確に示す",
        emotionalState: "仕事は続けたいので付き合い方を知りたい",
        cooperativeness: "high",
      },
      forbidden: [
        "仕事姿勢の詳細は職業について聞かれてから話す",
        "「ここ」と一点で示せることは、部位を詳しく聞かれてから言う",
      ],
    },
    truth: {
      targetLandmarks: [
        lm(M.rhomboidMajor, "rhomboid_major_belly_r", 30, 2, "肩甲骨内側縁と棘突起の間の筋腹。僧帽筋中部越しだが圧痛点は限局しやすい（D-008）"),
        lm(L.medialBorder, "medial_border_mid_r", 30, 1, "停止部の骨縁（D-008）"),
      ],
      responsibleMuscles: [M.rhomboidMajor, M.rhomboidMinor],
      innervation: [N.dorsalScapular],
      diagnosisLabel: "菱形筋の筋筋膜性疼痛（肩甲間部痛）",
      distractors: [
        { fmaId: M.trapezius, kind: "muscle", reason: "同部位の表層を覆うため混同しやすいが、圧痛の深さと肩甲骨内転での再現が菱形筋を示唆" },
        { fmaId: M.serratus, kind: "muscle", reason: "同じ内側縁に付着する拮抗筋で、機能的関連から選ばれやすい" },
        { fmaId: N.accessory, kind: "nerve", reason: "僧帽筋と混同した場合の誤答。菱形筋の支配は肩甲背神経" },
      ],
    },
    review: REVIEW,
  },
  {
    id: "case-10-brachialis-climber",
    region: "shoulder",
    difficulty: "intermediate",
    public: {
      demographics: "27歳 男性 右利き 会社員（ボルダリング歴2年）",
      chiefComplaint: "右の肘の上あたり、腕の前面が痛い。登った翌日は肘が伸ばしにくい",
      historyScript: {
        "発症・きっかけ": "1か月前から。課題の難度を上げて保持系のトレーニングを増やしてから",
        "疼痛部位": "肘のすぐ上、腕の前面の深いところ。力こぶの筋よりも奥の感じ",
        "疼痛の性質": "登った後にズーンと重い痛み。押すと奥に響く",
        "夜間痛": "登った日の夜に疼くことがある",
        "増悪動作": "肘を曲げたまま体を保持する動き。重い鞄を肘を曲げて持つ",
        "軽快因子": "数日登らないと軽くなるが、登ると戻る",
        "職業・生活": "デスクワーク。ジムには週3回",
        "スポーツ・趣味": "ボルダリング。最近ぶら下がり系の自主トレも追加した",
        "既往・全身状態": "特記なし",
        "しびれ・感覚": "ない",
      },
      persona: {
        speechStyle: "淡々と要点を話す。クライミング用語を使う",
        emotionalState: "フォームか練習量か、原因を知りたがっている",
        cooperativeness: "high",
      },
      forbidden: [
        "自主トレを増やした件は練習内容を聞かれてから話す",
        "「力こぶより奥」という表現は部位を詳しく聞かれてから言う",
      ],
    },
    truth: {
      targetLandmarks: [
        lm(M.brachialis, "brachialis_belly_r", 35, 2, "上腕二頭筋の深層にある筋腹。深部で境界不明瞭のため広め（D-008）"),
      ],
      responsibleMuscles: [M.brachialis, M.biceps],
      innervation: [N.musculocutaneous, N.radial],
      diagnosisLabel: "上腕筋を主体とする肘屈筋群の過負荷（クライマーに多い上腕前面深部痛）",
      distractors: [
        { fmaId: M.coracobrachialis, kind: "muscle", reason: "同じ筋皮神経支配の上腕前面筋だが、部位は近位内側で本例の遠位痛と合わない" },
        { fmaId: M.triceps, kind: "muscle", reason: "肘周囲の痛みで選ばれやすいが、痛みは前面で肘屈曲保持により増悪する" },
        { fmaId: N.median, kind: "nerve", reason: "上腕前面を走行するため選ばれやすいが、上腕筋の主支配は筋皮神経（外側部に橈骨神経枝）" },
      ],
    },
    review: REVIEW,
  },
];

const dir = join(SRC, "data", "cases");
mkdirSync(dir, { recursive: true });
for (const c of cases) {
  writeFileSync(join(dir, `${c.id}.json`), JSON.stringify(c, null, 2) + "\n", "utf8");
}
const multi = cases.filter((c) => c.truth.responsibleMuscles.length >= 2).length;
const byDiff = {};
for (const c of cases) byDiff[c.difficulty] = (byDiff[c.difficulty] ?? 0) + 1;
console.log(`cases: ${cases.length} / 複数筋: ${multi} / 難易度:`, byDiff);
