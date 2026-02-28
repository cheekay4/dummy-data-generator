import type { AxisKey } from '@/lib/types'

export interface QuestionOption {
  text: string
  scores: Partial<Record<AxisKey, number>>
}

export interface Question {
  id: number
  text: string
  options: QuestionOption[]
}

export const DIAGNOSIS_QUESTIONS: Question[] = [
  {
    id: 1,
    text: '友達が作った手料理。正直微妙だった。どうする？',
    options: [
      { text: '「美味しい！」と笑顔で完食する', scores: { agreeableness: 3 } },
      { text: '「味付けもうちょい濃くても良いかも？」とやんわり伝える', scores: { agreeableness: 1, conscientiousness: 2 } },
      { text: '「これ何入れたの？」と興味を示してレシピを聞く', scores: { agreeableness: 1, conscientiousness: 2 } },
      { text: '「俺が作り直してやろうか笑」と冗談で流す', scores: { agreeableness: 1, extraversion: 3 } },
    ],
  },
  {
    id: 2,
    text: '朝、知らない番号から着信があった。折り返す？',
    options: [
      { text: 'すぐ折り返す。相手が困ってるかもしれない', scores: { agreeableness: 3, extraversion: 1 } },
      { text: 'まず番号を検索してから判断する', scores: { conscientiousness: 3 } },
      { text: 'しばらく様子を見て、もう一度来たら出る', scores: { conscientiousness: 2 } },
      { text: '留守電入ってなければスルー', scores: { extraversion: 1 } },
    ],
  },
  {
    id: 3,
    text: '後輩が仕事でミスして落ち込んでる。どう声をかける？',
    options: [
      { text: '「気にすんな！俺なんかもっとやらかしてるよ笑」', scores: { agreeableness: 2, extraversion: 3 } },
      { text: '「大丈夫。次どうリカバリーするか一緒に考えよう」', scores: { agreeableness: 2, conscientiousness: 2 } },
      { text: '「飯でも行こうぜ」と仕事から離す', scores: { agreeableness: 2, extraversion: 1 } },
      { text: '「報告書は一緒に直すから、まず上に謝ろう」', scores: { conscientiousness: 3, openness: 2 } },
    ],
  },
  {
    id: 4,
    text: '旅先でめちゃくちゃ綺麗な景色に出会った。どうする？',
    options: [
      { text: 'すぐ写真撮って友達に送る「見て！やばい！」', scores: { agreeableness: 2, extraversion: 1 } },
      { text: 'しばらくぼーっと眺めてから、1枚だけ撮る', scores: { agreeableness: 2 } },
      { text: '場所と時間帯をメモして、次来るときの参考にする', scores: { conscientiousness: 3, openness: 1 } },
      { text: '動画撮りながら実況する', scores: { agreeableness: 1, extraversion: 2 } },
    ],
  },
  {
    id: 5,
    text: 'カフェで隣の席の人がコーヒーをこぼした。',
    options: [
      { text: 'さっとティッシュを差し出す', scores: { agreeableness: 2, extraversion: 2 } },
      { text: '店員さんを呼んであげる', scores: { conscientiousness: 2, openness: 1 } },
      { text: '「大丈夫ですか？」と声をかけつつ自分の荷物を避ける', scores: { agreeableness: 1, extraversion: 1 } },
      { text: '気づかないふりをする（相手の恥ずかしさに配慮）', scores: { agreeableness: 1 } },
    ],
  },
  {
    id: 6,
    text: '友達5人でどこに食べに行くか決まらない。あなたは？',
    options: [
      { text: '「じゃあ3つ候補出すから多数決ね」と仕切る', scores: { conscientiousness: 3, openness: 2 } },
      { text: '「なんでもいいよ〜」と誰かが決めるのを待つ', scores: { agreeableness: 1 } },
      { text: '「この前行って美味しかったとこあるんだけど！」と推す', scores: { agreeableness: 2, extraversion: 2, conscientiousness: 1 } },
      { text: '「とりあえず歩こう。目についた店に入ろう」', scores: { agreeableness: 1, extraversion: 2 } },
    ],
  },
  {
    id: 7,
    text: 'お世話になった人に、お礼のメッセージを送るとしたら？',
    options: [
      { text: '何が嬉しかったか、具体的に長めに書く', scores: { agreeableness: 2, conscientiousness: 3, openness: 1 } },
      { text: '短くても気持ちが伝わるように、言葉を選んで書く', scores: { agreeableness: 2, conscientiousness: 2 } },
      { text: '「ありがとう！！めっちゃ助かった！！」とテンション高めに', scores: { agreeableness: 3, extraversion: 1 } },
      { text: 'お礼の品も添えて、丁寧なメッセージを送る', scores: { conscientiousness: 3, openness: 1 } },
    ],
  },
  {
    id: 8,
    text: '自分の誕生日。理想の過ごし方は？',
    options: [
      { text: '親しい友達2-3人で静かに飲む', scores: { agreeableness: 2, extraversion: 1 } },
      { text: 'サプライズパーティーされたい！', scores: { agreeableness: 2, extraversion: 2 } },
      { text: '一人で好きなことしてゆっくり過ごす', scores: { conscientiousness: 1 } },
      { text: '美味しいお店を予約して、大事な人と行く', scores: { conscientiousness: 2, openness: 2 } },
    ],
  },
  {
    id: 9,
    text: 'タクシーの運転手さんがめっちゃ話しかけてくる。',
    options: [
      { text: '楽しく会話する。知らない人との話は好き', scores: { agreeableness: 3, extraversion: 1 } },
      { text: '相槌は打つけど、自分からは話を広げない', scores: { conscientiousness: 2 } },
      { text: '話を聞きつつ、面白いエピソードがあったら後で人に話す', scores: { extraversion: 2, openness: 1 } },
      { text: 'イヤホンを見せてやんわり会話を終わらせる', scores: { conscientiousness: 1 } },
    ],
  },
  {
    id: 10,
    text: '職場の飲み会。苦手な上司も来る。',
    options: [
      { text: '上司の近くには座らず、気の合う人と楽しむ', scores: { agreeableness: 1, extraversion: 1 } },
      { text: 'あえて上司の近くに座って、仕事以外の話を振ってみる', scores: { agreeableness: 2, extraversion: 2 } },
      { text: '幹事を買って出て、全体が楽しめるように動く', scores: { agreeableness: 2, conscientiousness: 2, openness: 1 } },
      { text: '一次会で「お先に〜」と爽やかに帰る', scores: { extraversion: 2, openness: 1 } },
    ],
  },
]

export const MAX_POSSIBLE_SCORES: Record<AxisKey, number> = {
  agreeableness: 24,
  extraversion: 19,
  conscientiousness: 22,
  openness: 9,
}
