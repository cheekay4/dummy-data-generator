import type { Lead } from '../../types/index.js';

export const saasTemplate = {
  subject: (lead: Lead) =>
    `${lead.company_name}様のメール施策改善`,

  bodyText: (lead: Lead) => `はじめまして、
個人開発者のRikuと申します。

${lead.company_name}様のサービスをウェブで拝見し、
ユーザー向けメール施策に
役立てていただけると思いご連絡しました。

MsgScore（https://msgscore.jp）という
ツールを作りました。
オンボーディングやアップセルのメールを
AIがスコアリングし、
開封率・CTR・CVを事前に予測できます。
「どの文面が刺さるか、
送る前に判断できる」と喜ばれています。

無料で1通試してみませんか？
（登録不要・1日5回まで）

Riku
https://msgscore.jp`,

  bodyHtml: (lead: Lead) => `<p>はじめまして、<br>個人開発者のRikuと申します。</p>
<p>${lead.company_name}様のサービスをウェブで拝見し、<br>ユーザー向けメール施策に<br>役立てていただけると思いご連絡しました。</p>
<p><a href="https://msgscore.jp">MsgScore</a>というツールを作りました。<br>オンボーディングやアップセルのメールを<br>AIがスコアリングし、<br>開封率・CTR・CVを事前に予測できます。<br>「どの文面が刺さるか、<br>送る前に判断できる」と喜ばれています。</p>
<p>無料で1通試してみませんか？<br>（登録不要・1日5回まで）</p>
<p>Riku<br><a href="https://msgscore.jp">https://msgscore.jp</a></p>`,
};
