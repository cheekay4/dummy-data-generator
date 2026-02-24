import type { Lead } from '../../types/index.js';

export const restaurantTemplate = {
  subject: (lead: Lead) =>
    `${lead.company_name}のLINE配信、もっと来店につながりますか？`,

  bodyText: (lead: Lead) => `はじめまして、個人開発者のRikuと申します。

${lead.company_name}さんのお店をウェブで拝見し、LINE配信や予約案内のメール施策に役立てていただけると思いご連絡しました。

MsgScore（https://msgscore.jp）というツールを作りました。LINE・メールの配信文をAIがスコアリングし、開封率・来店CVを事前に予測できます。飲食店さんのクーポン配信や限定メニュー告知にもご活用いただいています。

まずは無料で1通試してみてください（登録不要・1日5回まで）。

Riku
https://msgscore.jp`,

  bodyHtml: (lead: Lead) => `<p>はじめまして、個人開発者のRikuと申します。</p>
<p>${lead.company_name}さんのお店をウェブで拝見し、LINE配信や予約案内のメール施策に役立てていただけると思いご連絡しました。</p>
<p><a href="https://msgscore.jp">MsgScore</a>というツールを作りました。LINE・メールの配信文をAIがスコアリングし、開封率・来店CVを事前に予測できます。飲食店さんのクーポン配信や限定メニュー告知にもご活用いただいています。</p>
<p>まずは無料で1通試してみてください（登録不要・1日5回まで）。</p>
<p>Riku<br><a href="https://msgscore.jp">https://msgscore.jp</a></p>`,
};
