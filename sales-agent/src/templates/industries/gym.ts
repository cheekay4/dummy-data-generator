import type { Lead } from '../../types/index.js';

export const gymTemplate = {
  subject: (lead: Lead) =>
    `${lead.company_name}様の入会促進メール改善`,

  bodyText: (lead: Lead) => `はじめまして、
個人開発者のRikuと申します。

${lead.company_name}様のジム・フィットネス施設を
ウェブで拝見し、
会員向けLINE・メール配信に
役立てていただけると思いご連絡しました。

MsgScore（https://msgscore.jp）という
ツールを作りました。
入会案内やキャンペーン告知の文章を
AIがスコアリングし、
開封率・問い合わせ数を事前に予測できます。
「送る前に改善点がわかる」と
ご好評いただいています。

無料で1通試してみませんか？
（登録不要・1日5回まで）

Riku
https://msgscore.jp`,

  bodyHtml: (lead: Lead) => `<p>はじめまして、<br>個人開発者のRikuと申します。</p>
<p>${lead.company_name}様のジム・フィットネス施設を<br>ウェブで拝見し、<br>会員向けLINE・メール配信に<br>役立てていただけると思いご連絡しました。</p>
<p><a href="https://msgscore.jp">MsgScore</a>というツールを作りました。<br>入会案内やキャンペーン告知の文章を<br>AIがスコアリングし、<br>開封率・問い合わせ数を事前に予測できます。<br>「送る前に改善点がわかる」と<br>ご好評いただいています。</p>
<p>無料で1通試してみませんか？<br>（登録不要・1日5回まで）</p>
<p>Riku<br><a href="https://msgscore.jp">https://msgscore.jp</a></p>`,
};
