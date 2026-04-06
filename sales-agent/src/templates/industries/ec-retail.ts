import type { Lead } from '../../types/index.js';

export const ecRetailTemplate = {
  subject: (lead: Lead) =>
    `${lead.company_name}様のメルマガ開封率改善`,

  bodyText: (lead: Lead) => `はじめまして、
個人開発者のRikuと申します。

${lead.company_name}様のECサイトを拝見し、
メール施策に役立てていただけると思い
ご連絡しました。

MsgScore（https://msgscore.jp）という
ツールを作りました。
メルマガの件名や本文をAIがスコアリングし、
開封率・CTRを事前に予測できます。
EC事業者の方に特にご好評いただいており、
「送る前に数値で判断できる」と
喜ばれています。

無料で1通試してみませんか？
（登録不要・1日5回まで）

Riku
https://msgscore.jp`,

  bodyHtml: (lead: Lead) => `<p>はじめまして、<br>個人開発者のRikuと申します。</p>
<p>${lead.company_name}様のECサイトを拝見し、<br>メール施策に役立てていただけると思い<br>ご連絡しました。</p>
<p><a href="https://msgscore.jp">MsgScore</a>というツールを作りました。<br>メルマガの件名や本文をAIがスコアリングし、<br>開封率・CTRを事前に予測できます。<br>EC事業者の方に特にご好評いただいており、<br>「送る前に数値で判断できる」と<br>喜ばれています。</p>
<p>無料で1通試してみませんか？<br>（登録不要・1日5回まで）</p>
<p>Riku<br><a href="https://msgscore.jp">https://msgscore.jp</a></p>`,
};
