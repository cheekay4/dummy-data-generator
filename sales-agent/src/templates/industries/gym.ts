import type { Lead } from '../../types/index.js';

export const gymTemplate = {
  subject: (lead: Lead) =>
    `${lead.company_name}の入会促進メール、届いていますか？`,

  bodyText: (lead: Lead) => `はじめまして、個人開発者のRikuと申します。

${lead.company_name}さんのジム・フィットネス施設をウェブで拝見し、会員向けLINE・メール配信に役立てていただけると思いご連絡しました。

MsgScore（https://msgscore.jp）というツールを作りました。入会案内やキャンペーン告知の文章をAIがスコアリングし、開封率・問い合わせ数を事前に予測できます。「送る前に改善点がわかる」とご好評いただいています。

まずは無料で1通試してみてください（登録不要・1日5回まで）。

Riku
https://msgscore.jp`,

  bodyHtml: (lead: Lead) => `<p>はじめまして、個人開発者のRikuと申します。</p>
<p>${lead.company_name}さんのジム・フィットネス施設をウェブで拝見し、会員向けLINE・メール配信に役立てていただけると思いご連絡しました。</p>
<p><a href="https://msgscore.jp">MsgScore</a>というツールを作りました。入会案内やキャンペーン告知の文章をAIがスコアリングし、開封率・問い合わせ数を事前に予測できます。「送る前に改善点がわかる」とご好評いただいています。</p>
<p>まずは無料で1通試してみてください（登録不要・1日5回まで）。</p>
<p>Riku<br><a href="https://msgscore.jp">https://msgscore.jp</a></p>`,
};
