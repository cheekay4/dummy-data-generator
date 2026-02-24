import type { Lead } from '../../types/index.js';

export const ecRetailTemplate = {
  subject: (lead: Lead) =>
    `${lead.company_name}のメルマガ開封率、改善できます`,

  bodyText: (lead: Lead) => `はじめまして、個人開発者のRikuと申します。

${lead.company_name}さんのECサイトを拝見し、メール施策に役立てていただけるかと思いご連絡しました。

MsgScore（https://msgscore.jp）というツールを作りました。メルマガの件名や本文をAIがスコアリングし、開封率・CTRを事前に予測できます。EC事業者さんに特にご好評いただいており、「送る前に数値で判断できる」と喜ばれています。

まずは無料で1通試してみてください（登録不要・1日5回まで）。

Riku
https://msgscore.jp`,

  bodyHtml: (lead: Lead) => `<p>はじめまして、個人開発者のRikuと申します。</p>
<p>${lead.company_name}さんのECサイトを拝見し、メール施策に役立てていただけるかと思いご連絡しました。</p>
<p><a href="https://msgscore.jp">MsgScore</a>というツールを作りました。メルマガの件名や本文をAIがスコアリングし、開封率・CTRを事前に予測できます。EC事業者さんに特にご好評いただいており、「送る前に数値で判断できる」と喜ばれています。</p>
<p>まずは無料で1通試してみてください（登録不要・1日5回まで）。</p>
<p>Riku<br><a href="https://msgscore.jp">https://msgscore.jp</a></p>`,
};
