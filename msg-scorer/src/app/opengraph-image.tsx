import { ImageResponse } from 'next/og';

export const alt = 'MsgScore — メール・LINE配信文AIスコアリング';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
          fontFamily: 'sans-serif',
          padding: '60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 背景装飾 */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '300px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            display: 'flex',
          }}
        />

        {/* コンテンツ */}
        <div style={{ display: 'flex', flex: 1, gap: '80px', alignItems: 'center' }}>
          {/* 左: テキスト */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '16px' }}>
            {/* ロゴ */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '32px', color: '#A5B4FC' }}>◆</span>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff' }}>MsgScore</span>
            </div>

            {/* メインコピー */}
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '52px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, letterSpacing: '-1px' }}>
              <span>この読者層に、</span>
              <span>このメッセージは</span>
              <span style={{ color: '#A5B4FC' }}>どれだけ届くか。</span>
            </div>

            {/* サブコピー */}
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '22px', color: '#C7D2FE', marginTop: '8px', lineHeight: 1.5 }}>
              <span>AIがセグメント×目的別に5軸評価。</span>
              <span>推定開封数・CV数・改善案を即提案。</span>
            </div>

            {/* バッジ */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              {['無料で1日5回', '登録不要', '30秒で結果'].map((badge) => (
                <div
                  key={badge}
                  style={{
                    display: 'flex',
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '20px',
                    padding: '6px 16px',
                    fontSize: '16px',
                    color: '#E0E7FF',
                  }}
                >
                  ✓ {badge}
                </div>
              ))}
            </div>
          </div>

          {/* 右: スコアモック */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '24px',
              padding: '32px',
              minWidth: '300px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '13px', color: '#A8A29E' }}>総合スコア</div>
                <div style={{ fontSize: '56px', fontWeight: 800, color: '#1C1917', lineHeight: 1 }}>
                  78
                </div>
                <div style={{ fontSize: '14px', color: '#A8A29E' }}>/ 100</div>
              </div>
              {/* 円グラフ (SVG) */}
              <svg width="90" height="90" viewBox="0 0 90 90">
                <circle cx="45" cy="45" r="36" stroke="#E7E5E4" strokeWidth="8" fill="none" />
                <circle
                  cx="45" cy="45" r="36"
                  stroke="#4F46E5" strokeWidth="8" fill="none"
                  strokeDasharray="226.2"
                  strokeDashoffset={226.2 * (1 - 0.78)}
                  strokeLinecap="round"
                  transform="rotate(-90 45 45)"
                />
              </svg>
            </div>

            {/* 軸バー */}
            {[
              { name: '開封誘引力', score: 82 },
              { name: 'CTA強度',    score: 80 },
              { name: '適合度',     score: 78 },
            ].map(({ name, score }) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#78716C', width: '70px', flexShrink: 0 }}>
                  {name}
                </span>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    height: '6px',
                    background: '#E7E5E4',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${score}%`,
                      height: '100%',
                      background: '#4F46E5',
                      borderRadius: '3px',
                    }}
                  />
                </div>
                <span style={{ fontSize: '12px', color: '#78716C', width: '24px', textAlign: 'right' }}>
                  {score}
                </span>
              </div>
            ))}

            {/* インパクト */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '12px',
                padding: '12px 16px',
                marginTop: '4px',
              }}
            >
              <div style={{ fontSize: '12px', color: '#16A34A' }}>改善後の推定購入数</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#15803D' }}>+4件 ↑</div>
            </div>
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            right: '60px',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.4)',
            display: 'flex',
          }}
        >
          msgscore.jp
        </div>
      </div>
    ),
    { ...size }
  );
}
