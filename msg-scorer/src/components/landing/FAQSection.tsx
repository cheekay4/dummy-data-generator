'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const faqs = [
  {
    q: '無料で使えますか？',
    a: 'はい、登録不要で1日5回まで無料でご利用いただけます。',
  },
  {
    q: 'スコアの精度はどのくらいですか？',
    a: 'Claude AI（Anthropic社）の最新モデルを使用し、セグメント特性と配信目的を考慮した評価を行います。ただし予測数値は推定値であり、実際の配信結果を保証するものではありません。',
  },
  {
    q: 'LINE配信文にも対応していますか？',
    a: 'はい、LINE公式アカウントの配信メッセージ（500文字制限）に対応しています。',
  },
  {
    q: 'セグメント設定はどのように使いますか？',
    a: 'プリセット（女性誌読者、BtoBリードなど6種類）からワンタップで設定するか、性別・年代の構成比を自由にカスタマイズできます。配信母数を入力すると、推定開封数・CV数も表示されます。',
  },
  {
    q: '「配信の目的」は何に使いますか？',
    a: '購入・記事クリック・申込・来店・問い合わせの5つから選ぶことで、CTA（行動喚起）の評価基準が目的に最適化されます。例えばECなら「価格訴求の具体性」、美容サロンなら「予約の簡単さ」が評価のポイントになります。',
  },
  {
    q: 'どんな業種で使えますか？',
    a: 'EC・通販、美容サロン、飲食店、メディア・ニュースレター、BtoB営業、SaaS、教育・スクール、不動産、人材・採用など、メールやLINEで配信を行うあらゆる業種でご利用いただけます。',
  },
  {
    q: 'Chrome拡張はありますか？',
    a: '現在開発中です。Gmail作成画面やLINE公式アカウント管理画面から直接スコアリングできる拡張を予定しています。',
  },
  {
    q: '解約はいつでもできますか？',
    a: 'はい、Proプランはいつでも解約可能です。解約後は次の請求日からFreeプランに戻ります。',
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-stone-50 transition-colors"
      >
        <span className="text-sm font-medium text-stone-900">Q{index + 1}. {q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-stone-400 text-xs shrink-0 ml-3"
        >
          ▾
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <p className="px-6 pb-4 text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 px-4 sm:px-6" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-stone-400 text-xs uppercase tracking-widest mb-4">FAQ</p>
        <h2 className="font-outfit font-bold text-3xl text-stone-900 text-center mb-12">
          よくある質問
        </h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
