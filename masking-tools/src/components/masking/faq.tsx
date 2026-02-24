import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    q: "データはサーバーに送信されますか？",
    a: "いいえ、全てブラウザ内で処理されます。ネットワーク通信は一切行いません。入力したテキストが外部に送信されることは絶対にありません。",
  },
  {
    q: "無料で使えますか？",
    a: "はい、1日10回まで無料でお使いいただけます。Proプラン（月額190円）で回数無制限になります。",
  },
  {
    q: "検出精度はどのくらいですか？",
    a: "正規表現ベースで一般的な日本の個人情報フォーマットを高い精度で検出します。Proプランではさらに高精度なAI検出モードが利用できます（近日公開予定）。",
  },
  {
    q: "マスクした後、元に戻せますか？",
    a: "Proプランの復元機能で、マスク前後の対応表を保持し、元のテキストに復元できます（近日公開予定）。Freeプランではマスク後の復元はできません。",
  },
];

export function FAQ() {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-4">よくある質問</h2>
      <Accordion type="single" collapsible className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium text-left">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
