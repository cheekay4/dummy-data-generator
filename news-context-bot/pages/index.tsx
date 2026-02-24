import React from 'react';

export default function Home() {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/manual/trigger-generate');
      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || '不明なエラーが発生しました');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>文脈の翻訳家 - ニュース自動解説システム</h1>
      <p>日本と海外のニュースの「温度差」を可視化し、note用記事を自動生成します。</p>

      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{
            padding: '1rem 2rem',
            fontSize: '1rem',
            backgroundColor: isGenerating ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
          }}
        >
          {isGenerating ? '生成中...' : '記事を生成する'}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fee', borderRadius: '5px' }}>
          <h3 style={{ color: '#c00' }}>エラー</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#efe', borderRadius: '5px' }}>
          <h3 style={{ color: '#0a0' }}>✓ 生成完了</h3>

          <h4>統計情報</h4>
          <ul>
            <li>収集記事数: {result.stats?.newsCollected || 0}件</li>
            <li>抽出トピック数: {result.stats?.topicsExtracted || 0}件</li>
            <li>生成記事数: {result.stats?.articlesGenerated || 0}件</li>
          </ul>

          <h4>生成された記事</h4>
          {result.articles?.map((article: any, index: number) => (
            <div key={index} style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: 'white', borderRadius: '3px' }}>
              <strong>{article.title}</strong>
              <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.3rem' }}>
                トピック: {article.topic} | 温度差スコア: {article.gapScore.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.3rem' }}>
                タグ: {article.tags.join(', ')}
              </div>
            </div>
          ))}

          <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            記事は <code>outputs/</code> ディレクトリに保存されました。
          </p>
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h3>使い方</h3>
        <ol>
          <li>上のボタンをクリックして記事を生成</li>
          <li><code>outputs/</code> ディレクトリを確認</li>
          <li>Markdownファイルをnoteにコピー&ペースト</li>
        </ol>

        <h4>API経由での実行</h4>
        <p>
          <code>http://localhost:3000/api/manual/trigger-generate</code> に直接アクセスしても実行できます。
        </p>
      </div>
    </div>
  );
}
