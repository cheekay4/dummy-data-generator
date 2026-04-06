import type { Lead } from '../../types/index.js';

export const genericTemplate = {
  subject: (lead: Lead) =>
    `${lead.company_name}様のメール配信改善のご提案`,

  bodyText: (lead: Lead) => `はじめまして、
個人開発者のRikuと申します。

${lead.company_name}様のウェブサイトを拝見し、
メール・LINE配信に役立てていただけると思い
ご連絡しました。

MsgScore（https://msgscore.jp）という
ツールを作りました。
配信文をAIがスコアリングし、
開封率・CTRを事前に予測できます。
「送る前に改善点がわかる」と
ご好評いただいています。

無料で1通試してみませんか？
（登録不要・1日5回まで）

Riku
https://msgscore.jp`,

  bodyHtml: (lead: Lead) => `<p>はじめまして、<br>個人開発者のRikuと申します。</p>
<p>${lead.company_name}様のウェブサイトを拝見し、<br>メール・LINE配信に役立てていただけると思い<br>ご連絡しました。</p>
<p><a href="https://msgscore.jp">MsgScore</a>というツールを作りました。<br>配信文をAIがスコアリングし、<br>開封率・CTRを事前に予測できます。<br>「送る前に改善点がわかる」と<br>ご好評いただいています。</p>
<p>無料で1通試してみませんか？<br>（登録不要・1日5回まで）</p>
<p>Riku<br><a href="https://msgscore.jp">https://msgscore.jp</a></p>`,
};
