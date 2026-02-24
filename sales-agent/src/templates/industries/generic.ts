import type { Lead } from '../../types/index.js';

export const genericTemplate = {
  subject: (lead: Lead) =>
    `${lead.company_name}のメール配信、もっと効果的にできます`,

  bodyText: (lead: Lead) => `はじめまして、個人開発者のRikuと申します。

${lead.company_name}さんのウェブサイトを拝見し、メール・LINE配信に役立てていただけると思いご連絡しました。

MsgScore（https://msgscore.jp）というツールを作りました。配信文をAIがスコアリングし、開封率・CTRを事前に予測できます。「送る前に改善点がわかる」と多くの方にご好評いただいています。

まずは無料で1通試してみてください（登録不要・1日5回まで）。

Riku
https://msgscore.jp`,

  bodyHtml: (lead: Lead) => `<p>はじめまして、個人開発者のRikuと申します。</p>
<p>${lead.company_name}さんのウェブサイトを拝見し、メール・LINE配信に役立てていただけると思いご連絡しました。</p>
<p><a href="https://msgscore.jp">MsgScore</a>というツールを作りました。配信文をAIがスコアリングし、開封率・CTRを事前に予測できます。「送る前に改善点がわかる」と多くの方にご好評いただいています。</p>
<p>まずは無料で1通試してみてください（登録不要・1日5回まで）。</p>
<p>Riku<br><a href="https://msgscore.jp">https://msgscore.jp</a></p>`,
};
