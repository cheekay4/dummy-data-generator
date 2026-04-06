import type { Lead } from '../../types/index.js';

export const restaurantTemplate = {
  subject: (lead: Lead) =>
    `${lead.company_name}様のLINE配信を改善`,

  bodyText: (lead: Lead) => `はじめまして、
個人開発者のRikuと申します。

${lead.company_name}様のお店をウェブで拝見し、
LINE配信や予約案内に役立てていただけると思い
ご連絡しました。

MsgScore（https://msgscore.jp）という
ツールを作りました。
LINE・メールの配信文をAIがスコアリングし、
開封率・来店CVを事前に予測できます。
飲食店の方のクーポン配信や
限定メニュー告知にもご活用いただいています。

無料で1通試してみませんか？
（登録不要・1日5回まで）

Riku
https://msgscore.jp`,

  bodyHtml: (lead: Lead) => `<p>はじめまして、<br>個人開発者のRikuと申します。</p>
<p>${lead.company_name}様のお店をウェブで拝見し、<br>LINE配信や予約案内に役立てていただけると思い<br>ご連絡しました。</p>
<p><a href="https://msgscore.jp">MsgScore</a>というツールを作りました。<br>LINE・メールの配信文をAIがスコアリングし、<br>開封率・来店CVを事前に予測できます。<br>飲食店の方のクーポン配信や<br>限定メニュー告知にもご活用いただいています。</p>
<p>無料で1通試してみませんか？<br>（登録不要・1日5回まで）</p>
<p>Riku<br><a href="https://msgscore.jp">https://msgscore.jp</a></p>`,
};
