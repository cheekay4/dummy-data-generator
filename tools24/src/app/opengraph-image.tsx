import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "tools24.jp — 無料Webツール集";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-2px",
            marginBottom: 24,
          }}
        >
          tools24.jp
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#94a3b8",
            marginBottom: 48,
          }}
        >
          無料Webツール集
        </div>
        <div
          style={{
            display: "flex",
            gap: "24px",
          }}
        >
          {["確定申告ツール", "文字化け修正", "ファビコン生成", "WebP変換"].map(
            (label) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "8px 20px",
                  color: "#e2e8f0",
                  fontSize: 22,
                }}
              >
                {label}
              </div>
            )
          )}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 20,
            color: "#64748b",
          }}
        >
          登録不要・データ送信なし・完全無料
        </div>
      </div>
    ),
    { ...size }
  );
}
