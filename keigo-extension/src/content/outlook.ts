// Outlook Web用コンテントスクリプト（Shadow DOM インラインUI方式）

// storage.ts の FREE_DAILY_LIMIT と必ず同じ値に保つこと
const FREE_DAILY_LIMIT = 10;

const OUTLOOK_SELECTORS = {
  // Outlook Webの作成エリアセレクタ（ロケール依存。英語/日本語UIに対応）
  composeBody: [
    'div[aria-label="メッセージの本文"]',
    'div[aria-label="Message body"]',
    'div[aria-label="本文"]',
    'div[contenteditable="true"][role="textbox"]',
  ].join(', '),
  toolbar: [
    'div[data-app-section="CommandBar"]',
    'div[role="toolbar"]',
  ].join(', '),
  injectedAttr: 'data-keigo-injected',
} as const;

const INLINE_PANEL_ID = 'keigo-inline-panel-outlook';

// ---- Shadow DOM インラインUI（Gmailと共通のスタイル） ----

function buildInlinePanel(hostEl: HTMLElement): ShadowRoot {
  hostEl.id = INLINE_PANEL_ID;
  hostEl.style.cssText = 'display:block; margin-top:8px; padding: 0 8px;';

  const shadow = hostEl.attachShadow({ mode: 'open' });
  shadow.innerHTML = `
    <style>
      :host { display: block; }
      .panel {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 10px;
        background: #fff;
        font-family: 'Hiragino Sans', 'Meiryo', sans-serif;
        font-size: 13px;
        color: #1a1a1a;
      }
      .panel-header { font-weight: 700; color: #4f46e5; margin-bottom: 8px; font-size: 13px; }
      .selects { display: flex; gap: 6px; margin-bottom: 8px; }
      select {
        flex: 1;
        padding: 4px;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 12px;
        background: #fff;
        cursor: pointer;
      }
      .btn-row { display: flex; align-items: center; gap: 8px; }
      .btn-convert {
        padding: 6px 14px;
        background: #4f46e5;
        color: #fff;
        border: none;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
      }
      .btn-convert:hover:not(:disabled) { background: #4338ca; }
      .btn-convert:disabled { background: #9ca3af; cursor: not-allowed; }
      .usage-txt { font-size: 11px; color: #6b7280; }
      .usage-txt.pro { color: #4f46e5; font-weight: 700; }
      .result-area {
        margin-top: 8px;
        padding: 8px;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        font-size: 12px;
        line-height: 1.6;
        white-space: pre-wrap;
        max-height: 160px;
        overflow-y: auto;
      }
      .btn-paste {
        margin-top: 6px;
        padding: 5px 12px;
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
      }
      .btn-paste:hover { background: #e5e7eb; }
      .error-txt { color: #dc2626; font-size: 12px; margin-top: 6px; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .spinner {
        display: inline-block;
        width: 12px; height: 12px;
        border: 2px solid rgba(255,255,255,0.4);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
        vertical-align: middle;
        margin-right: 3px;
      }
    </style>
    <div class="panel">
      <div class="panel-header">✉ 敬語変換</div>
      <div class="selects">
        <select id="sel-scene">
          <option value="reply">返信</option>
          <option value="request">依頼</option>
          <option value="apologize">お詫び</option>
          <option value="thanks">感謝</option>
          <option value="check">確認</option>
        </select>
        <select id="sel-recipient">
          <option value="client">取引先</option>
          <option value="superior">上司</option>
          <option value="colleague">同僚</option>
          <option value="other">その他</option>
        </select>
        <select id="sel-tone">
          <option value="polite">丁寧</option>
          <option value="formal">かしこまる</option>
          <option value="casual">カジュアル</option>
        </select>
      </div>
      <div class="btn-row">
        <button class="btn-convert" id="btn-convert">変換する</button>
        <span class="usage-txt" id="usage-txt"></span>
      </div>
      <div class="error-txt" id="error-txt" style="display:none;"></div>
      <div class="result-area" id="result-area" style="display:none;"></div>
      <button class="btn-paste" id="btn-paste" style="display:none;">本文に貼り付け</button>
    </div>
  `;
  return shadow;
}

function isContextValid(): boolean {
  try { return !!chrome.runtime.id; } catch { return false; }
}

async function getStorageValue<T>(key: string, defaultVal: T): Promise<T> {
  if (!isContextValid()) return defaultVal;
  return new Promise((resolve) => {
    try {
      chrome.storage.local.get({ [key]: defaultVal }, (res) => resolve(res[key] as T));
    } catch { resolve(defaultVal); }
  });
}

async function setStorageValue(data: Record<string, unknown>): Promise<void> {
  if (!isContextValid()) return;
  return new Promise((resolve) => {
    try { chrome.storage.local.set(data, resolve); } catch { resolve(); }
  });
}

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function getRemainingCount(): Promise<number> {
  const licenseValid = await getStorageValue('licenseValid', false);
  if (licenseValid) return 999;
  const usageDate = await getStorageValue<string>('usageDate', '');
  const usageCount = await getStorageValue<number>('usageCount', 0);
  if (usageDate !== getTodayString()) return FREE_DAILY_LIMIT;
  return Math.max(0, FREE_DAILY_LIMIT - usageCount);
}

async function incrementUsage(): Promise<void> {
  const usageDate = await getStorageValue<string>('usageDate', '');
  const usageCount = await getStorageValue<number>('usageCount', 0);
  const today = getTodayString();
  if (usageDate !== today) {
    await setStorageValue({ usageCount: 1, usageDate: today });
  } else {
    await setStorageValue({ usageCount: usageCount + 1 });
  }
}

async function callGenerateApi(text: string, scene: string, recipient: string, tone: string): Promise<{ result?: string; error?: string }> {
  const licenseValid = await getStorageValue('licenseValid', false);
  const licenseKey = await getStorageValue<string>('licenseKey', '');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (licenseValid && licenseKey) headers['X-License-Key'] = licenseKey;

  try {
    const res = await fetch('https://keigo-tools.vercel.app/api/generate', {
      method: 'POST',
      headers,
      body: JSON.stringify({ text, scene, recipient, tone }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? '生成に失敗しました' };
    let result = data.result ?? '';
    try {
      const parsed = JSON.parse(result);
      if (parsed.body) result = parsed.body;
    } catch { /* そのまま */ }
    return { result };
  } catch {
    return { error: '通信エラーが発生しました' };
  }
}

// ---- ツールバーへのボタン挿入 ----

function findComposeContainer(): Element | null {
  // Outlook Webの作成エリアを囲む親要素を探す
  const candidates = document.querySelectorAll(OUTLOOK_SELECTORS.composeBody);
  for (const el of candidates) {
    if ((el as HTMLElement).isContentEditable) return el.closest('[role="main"]') ?? el.parentElement;
  }
  return null;
}

function injectButton(container: Element): void {
  if (container.querySelector(`[${OUTLOOK_SELECTORS.injectedAttr}]`)) return;

  const toolbar = container.querySelector(OUTLOOK_SELECTORS.toolbar);
  if (!toolbar) return;

  const btnWrapper = document.createElement('div');
  btnWrapper.setAttribute(OUTLOOK_SELECTORS.injectedAttr, 'true');
  btnWrapper.style.cssText = 'display:inline-flex; align-items:center; margin-left:8px;';

  const btn = document.createElement('button');
  btn.textContent = '✉敬語';
  btn.style.cssText = `
    padding: 4px 10px;
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
  `;
  btn.onmouseenter = () => { btn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.15)'; };
  btn.onmouseleave = () => { btn.style.boxShadow = ''; };
  btn.addEventListener('click', (e) => { e.stopPropagation(); toggleInlinePanel(container, btn); });

  btnWrapper.appendChild(btn);
  toolbar.appendChild(btnWrapper);
}

function toggleInlinePanel(container: Element, triggerBtn: HTMLElement): void {
  if (!isContextValid()) {
    alert('拡張機能が更新されました。ページを再読み込みしてください（F5）。');
    return;
  }

  const existing = document.getElementById(INLINE_PANEL_ID);
  if (existing) {
    existing.remove();
    return;
  }

  // メール本文テキストを取得
  const bodyEl = container.querySelector<HTMLElement>(OUTLOOK_SELECTORS.composeBody);
  const mailText = bodyEl?.innerText?.trim() ?? '';

  // フローティングパネルをdocument.bodyに挿入
  const host = document.createElement('div');
  const shadow = buildInlinePanel(host);

  const rect = triggerBtn.getBoundingClientRect();
  const panelWidth = 360;
  let left = rect.left;
  if (left + panelWidth > window.innerWidth - 8) {
    left = window.innerWidth - panelWidth - 8;
  }
  host.style.cssText = `
    display: block;
    position: fixed;
    z-index: 2147483647;
    left: ${left}px;
    bottom: ${window.innerHeight - rect.top + 4}px;
    width: ${panelWidth}px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.18);
    border-radius: 8px;
  `;
  document.body.appendChild(host);

  // 外側クリックで閉じる
  const closeOnOutsideClick = (e: MouseEvent) => {
    if (!host.contains(e.target as Node) && e.target !== triggerBtn) {
      host.remove();
      document.removeEventListener('click', closeOnOutsideClick, true);
    }
  };
  setTimeout(() => {
    document.addEventListener('click', closeOnOutsideClick, true);
  }, 0);

  const btnConvert = shadow.getElementById('btn-convert') as HTMLButtonElement;
  const usageTxt = shadow.getElementById('usage-txt')!;
  const errorTxt = shadow.getElementById('error-txt')!;
  const resultArea = shadow.getElementById('result-area')!;
  const btnPaste = shadow.getElementById('btn-paste') as HTMLButtonElement;
  const selScene = shadow.getElementById('sel-scene') as HTMLSelectElement;
  const selRecipient = shadow.getElementById('sel-recipient') as HTMLSelectElement;
  const selTone = shadow.getElementById('sel-tone') as HTMLSelectElement;

  // 前回の変換結果・設定を復元
  (async () => {
    const [lastResult, lastScene, lastRecipient, lastTone] = await Promise.all([
      getStorageValue<string>('lastResult', ''),
      getStorageValue<string>('lastScene', ''),
      getStorageValue<string>('lastRecipient', ''),
      getStorageValue<string>('lastTone', ''),
    ]);
    if (lastScene) selScene.value = lastScene;
    if (lastRecipient) selRecipient.value = lastRecipient;
    if (lastTone) selTone.value = lastTone;
    if (lastResult) {
      resultArea.textContent = lastResult;
      resultArea.style.display = 'block';
      btnPaste.style.display = 'block';
    }
  })();

  getRemainingCount().then((remaining) => {
    getStorageValue('licenseValid', false).then((valid) => {
      if (valid) {
        usageTxt.textContent = '⭐ Pro';
        usageTxt.className = 'usage-txt pro';
      } else {
        usageTxt.textContent = `残り${remaining}回`;
        if (remaining === 0) {
          btnConvert.disabled = true;
          btnConvert.title = '本日の無料枠を使い切りました';
        }
      }
    });
  });

  btnConvert.addEventListener('click', async () => {
    errorTxt.style.display = 'none';
    resultArea.style.display = 'none';
    btnPaste.style.display = 'none';
    btnConvert.innerHTML = '<span class="spinner"></span>変換中…';
    btnConvert.disabled = true;

    const res = await callGenerateApi(
      mailText,
      selScene.value,
      selRecipient.value,
      selTone.value
    );

    btnConvert.innerHTML = '変換する';
    const remaining = await getRemainingCount();
    const licValid = await getStorageValue('licenseValid', false);
    btnConvert.disabled = !licValid && remaining === 0;

    if (res.error) {
      errorTxt.textContent = res.error;
      errorTxt.style.display = 'block';
    } else {
      resultArea.textContent = res.result ?? '';
      resultArea.style.display = 'block';
      btnPaste.style.display = 'block';

      // 変換結果と設定を保存（次回パネルを開いたとき復元する）
      await setStorageValue({
        lastResult: res.result ?? '',
        lastScene: selScene.value,
        lastRecipient: selRecipient.value,
        lastTone: selTone.value,
      });

      if (!licValid) {
        await incrementUsage();
        const newRemaining = await getRemainingCount();
        usageTxt.textContent = `残り${newRemaining}回`;
        if (newRemaining === 0) btnConvert.disabled = true;
      }
    }
  });

  btnPaste.addEventListener('click', () => {
    if (!bodyEl) return;
    bodyEl.innerText = resultArea.textContent ?? '';
    bodyEl.dispatchEvent(new Event('input', { bubbles: true }));
    btnPaste.textContent = '✓ 貼り付けました';
    setTimeout(() => { btnPaste.textContent = '本文に貼り付け'; }, 2000);
  });
}

// ---- MutationObserver ----

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function scanAndInject(): void {
  const container = findComposeContainer();
  if (container) injectButton(container);
}

const observer = new MutationObserver(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(scanAndInject, 500);
});

observer.observe(document.body, { childList: true, subtree: true });
scanAndInject();
