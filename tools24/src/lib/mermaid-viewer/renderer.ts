let initialized = false;
let currentTheme = "default";

export async function initMermaid(
  theme: "default" | "dark" | "forest" | "neutral"
): Promise<void> {
  const mermaid = (await import("mermaid")).default;
  mermaid.initialize({
    startOnLoad: false,
    theme,
    securityLevel: "loose",
    fontFamily: "Noto Sans JP, sans-serif",
  });
  currentTheme = theme;
  initialized = true;
}

export async function renderMermaid(
  code: string,
  theme: "default" | "dark" | "forest" | "neutral"
): Promise<{ svg: string; error?: string }> {
  try {
    if (!initialized || currentTheme !== theme) {
      await initMermaid(theme);
    }
    const mermaid = (await import("mermaid")).default;
    const id = `mermaid-${Date.now()}`;
    const { svg } = await mermaid.render(id, code);
    return { svg };
  } catch (err) {
    return { svg: "", error: String(err) };
  }
}
