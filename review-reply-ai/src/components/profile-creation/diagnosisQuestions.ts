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
    text: '友達が作ってくれた手料理。ちょっと口に合わなかったとき、あなたはどうしますか？',
    options: [
      { text: '「美味しいよ！」と笑顔で完食する', scores: { agreeableness: 3 } },
      { text: '「もう少し味付け濃いめも合うかも？」とやんわり伝える', scores: { agreeableness: 1, conscientiousness: 2 } },
      { text: '「これ何を入れたの？」と興味を持ってレシピを聞く', scores: { agreeableness: 1, conscientiousness: 2 } },
      { text: '「じゃあ次は一緒に作ろうよ！」と明るく切り替える', scores: { agreeableness: 1, extraversion: 3 } },
    ],
  },
  {
    id: 2,
    text: '朝、知らない番号から着信がありました。あなたはどうしますか？',
    options: [
      { text: 'すぐ折り返す。相手が困っているかもしれない', scores: { agreeableness: 3, extraversion: 1 } },
      { text: 'まず番号を調べてから、折り返すか判断する', scores: { conscientiousness: 3 } },
      { text: 'しばらく様子を見て、もう一度かかってきたら出る', scores: { conscientiousness: 2 } },
      { text: '留守電が入っていなければ、そのままにしておく', scores: { extraversion: 1 } },
    ],
  },
  {
    id: 3,
    text: '後輩が仕事でミスをして落ち込んでいます。あなたならどう声をかけますか？',
    options: [
      { text: '「大丈夫！自分もよくやらかしてたよ」と笑顔で励ます', scores: { agreeableness: 2, extraversion: 3 } },
      { text: '「大丈夫。次どうリカバリーするか一緒に考えよう」と寄り添う', scores: { agreeableness: 2, conscientiousness: 2 } },
      { text: '「ちょっとお茶でもしない？」と気分転換に誘う', scores: { agreeableness: 2, extraversion: 1 } },
      { text: '「一緒に修正するから、まず上司に報告しよう」と具体的に動く', scores: { conscientiousness: 3, openness: 2 } },
    ],
  },
  {
    id: 4,
    text: '旅先でとても綺麗な景色に出会いました。あなたはどうしますか？',
    options: [
      { text: 'すぐ写真を撮って友達に送る「見て！すごく綺麗！」', scores: { agreeableness: 2, extraversion: 1 } },
      { text: 'しばらくゆっくり眺めてから、1枚だけ写真を撮る', scores: { agreeableness: 2 } },
      { text: '場所と時間帯をメモして、次に来るときの参考にする', scores: { conscientiousness: 3, openness: 1 } },
      { text: '動画を撮りながら感想を残す', scores: { agreeableness: 1, extraversion: 2 } },
    ],
  },
  {
    id: 5,
    text: 'カフェで隣の席の方がコーヒーをこぼしてしまいました。あなたはどうしますか？',
    options: [
      { text: 'さっとティッシュを差し出す', scores: { agreeableness: 2, extraversion: 2 } },
      { text: '店員さんを呼んであげる', scores: { conscientiousness: 2, openness: 1 } },
      { text: '「大丈夫ですか？」と声をかけつつ、自分の荷物を避ける', scores: { agreeableness: 1, extraversion: 1 } },
      { text: 'そっとしておく（相手が恥ずかしくないように配慮）', scores: { agreeableness: 1 } },
    ],
  },
  {
    id: 6,
    text: '友達5人でどこに食べに行くか決まらないとき、あなたは？',
    options: [
      { text: '「3つ候補を出すから、みんなで選ぼう！」と提案する', scores: { conscientiousness: 3, openness: 2 } },
      { text: '「どこでも楽しいよ〜」とみんなに任せる', scores: { agreeableness: 1 } },
      { text: '「前に行って美味しかったお店があるんだけど！」とおすすめする', scores: { agreeableness: 2, extraversion: 2, conscientiousness: 1 } },
      { text: '「とりあえず歩いてみよう。良さそうなお店に入ろう！」', scores: { agreeableness: 1, extraversion: 2 } },
    ],
  },
  {
    id: 7,
    text: 'お世話になった方に、お礼のメッセージを送るとしたら？',
    options: [
      { text: '何が嬉しかったか、具体的にしっかり書く', scores: { agreeableness: 2, conscientiousness: 3, openness: 1 } },
      { text: '短くても気持ちが伝わるように、言葉を選んで書く', scores: { agreeableness: 2, conscientiousness: 2 } },
      { text: '「ありがとうございます！とても助かりました！」と素直に伝える', scores: { agreeableness: 3, extraversion: 1 } },
      { text: 'お礼の品も添えて、丁寧なメッセージを送る', scores: { conscientiousness: 3, openness: 1 } },
    ],
  },
  {
    id: 8,
    text: 'お誕生日の理想の過ごし方は？',
    options: [
      { text: '親しい友達2〜3人と静かに過ごす', scores: { agreeableness: 2, extraversion: 1 } },
      { text: 'みんなにお祝いしてもらいたい！', scores: { agreeableness: 2, extraversion: 2 } },
      { text: '一人で好きなことをしてゆっくり過ごす', scores: { conscientiousness: 1 } },
      { text: '美味しいお店を予約して、大切な人と過ごす', scores: { conscientiousness: 2, openness: 2 } },
    ],
  },
  {
    id: 9,
    text: 'タクシーの運転手さんがたくさん話しかけてくれます。あなたはどうしますか？',
    options: [
      { text: '楽しく会話する。初めての方とのお話も好き', scores: { agreeableness: 3, extraversion: 1 } },
      { text: '相づちは打つけれど、自分からは話を広げない', scores: { conscientiousness: 2 } },
      { text: 'お話を聞きつつ、面白いエピソードは覚えておく', scores: { extraversion: 2, openness: 1 } },
      { text: 'さりげなくイヤホンを見せて、静かに過ごす', scores: { conscientiousness: 1 } },
    ],
  },
  {
    id: 10,
    text: '職場の食事会。少し苦手な上司も参加します。あなたはどうしますか？',
    options: [
      { text: '上司からは少し離れて、気の合う人と楽しく過ごす', scores: { agreeableness: 1, extraversion: 1 } },
      { text: 'あえて上司の近くに座って、仕事以外の話を振ってみる', scores: { agreeableness: 2, extraversion: 2 } },
      { text: '幹事役を引き受けて、みんなが楽しめるように動く', scores: { agreeableness: 2, conscientiousness: 2, openness: 1 } },
      { text: '早めに「お先に失礼します」と爽やかに帰る', scores: { extraversion: 2, openness: 1 } },
    ],
  },
]

export const MAX_POSSIBLE_SCORES: Record<AxisKey, number> = {
  agreeableness: 24,
  extraversion: 19,
  conscientiousness: 22,
  openness: 9,
}
