import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="文脈の翻訳家 - ニュース自動解説システム" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
