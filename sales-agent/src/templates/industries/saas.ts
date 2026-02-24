import type { Lead } from '../../types/index.js';

export const saasTemplate = {
  subject: (lead: Lead) =>
    `${lead.company_name}のオンボーディングメール、改善できます`,

  bodyText: (lead: Lead) => `はじめまして、個人開発者のRikuと申します。

${lead.company_name}さんのサービスをウェブで拝見し、ユーザー向けメール施策に役立てていただけると思いご連絡しました。

MsgScore（https://msgscore.jp）というツールを作りました。オンボーディングメールやアップセルメールをAIがスコアリングし、開封率・CTR・CVを事前に予測できます。「どの文面が刺さるか、送る前に判断できる」と喜ばれています。

まずは無料で1通試してみてください（登録不要・1日5回まで）。

Riku
https://msgscore.jp`,

  bodyHtml: (lead: Lead) => `<p>はじめまして、個人開発者のRikuと申します。</p>
<p>${lead.company_name}さんのサービスをウェブで拝見し、ユーザー向けメール施策に役立てていただけると思いご連絡しました。</p>
<p><a href="https://msgscore.jp">MsgScore</a>というツールを作りました。オンボーディングメールやアップセルメールをAIがスコアリングし、開封率・CTR・CVを事前に予測できます。「どの文面が刺さるか、送る前に判断できる」と喜ばれています。</p>
<p>まずは無料で1通試してみてください（登録不要・1日5回まで）。</p>
<p>Riku<br><a href="https://msgscore.jp">https://msgscore.jp</a></p>`,
};
