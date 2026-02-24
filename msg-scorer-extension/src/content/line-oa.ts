// MsgScore LINE OA Manager コンテンツスクリプト（Shadow DOM パネル方式）

import { AUDIENCE_PRESETS } from '../shared/presets';
import type { AudienceSegment } from '../shared/types';

// storage.ts の FREE_DAILY_LIMIT と必ず同じ値に保つこと
const FREE_DAILY_LIMIT = 5;
const API_BASE = 'https://msg-scorer.vercel.app';
const INJECTED_ATTR = 'data-msgscore-line-injected';
const PANEL_ID = 'msgscore-line-panel';

// LINE OA Manager のセレクター候補（DOM変更に備えてフォールバック）
const SELECTORS = {
  inputs: [
    'textarea',
    'div[contenteditable="true"]',
    '[role="textbox"]',
  ],
  // ボタンを挿入するコンテナ候補
  toolbarCandidates: [
    '[class*="MessageTextarea"]',
    '[class*="message-textarea"]',
    '[class*="text-area"]',
    'form',
    '[class*="compose"]',
  ],
} as const;

// ---- ストレージユーティリティ ----

async function getStorageValue<T>(key: string, defaultVal: T): Promise<T> {
  try {
    const result = await chrome.storage.local.get({ [key]: defaultVal });
    return (result[key] ?? defaultVal) as T;
  } catch {
    return defaultVal;
  }
}

async function setStorageValues(data: Record<string, unknown>): Promise<void> {
  try {
    await chrome.storage.local.set(data);
  } catch {
    // サイレントに無視
  }
}

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function getRemainingCount(): Promise<number> {
  const tokenValid = await getStorageValue('tokenValid', false);
  if (tokenValid) return 999;
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
    await setStorageValues({ usageCount: 1, usageDate: today });
  } else {
    await setStorageValues({ usageCount: usageCount + 1 });
  }
}

// ---- スコアリング API ----

async function callScoreApi(
  text: string,
  audience: AudienceSegment,
): Promise<{ totalScore?: number; axes?: { name: string; score: number; feedback: string }[]; improvements?: string[]; error?: string }> {
  const extensionToken = await getStorageValue<string>('extensionToken', '');
  const tokenValid = await getStorageValue<boolean>('tokenValid', false);

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (tokenValid && extensionToken) {
    headers['X-Extension-Token'] = extensionToken;
  }

  try {
    const res = await fetch(`${API_BASE}/api/score`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ channel: 'line', text, audience, source: 'chrome-extension' }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? 'スコアリングに失敗しました' };
    return data;
  } catch {
    return { error: '通信エラーが発生しました' };
  }
}

// ---- テキスト入力要素を検出 ----

function findTextInput(): HTMLTextAreaElement | HTMLElement | null {
  for (const selector of SELECTORS.inputs) {
    const el = document.querySelector<HTMLElement>(selector);
    if (el) {
      console.debug('[MsgScore LINE] Found input with selector:', selector);
      return el;
    }
  }
  console.debug('[MsgScore LINE] No text input found');
  return null;
}

function getTextFromInput(el: HTMLTextAreaElement | HTMLElement): string {
  if (el instanceof HTMLTextAreaElement) return el.value.trim();
  return (el as HTMLElement).innerText?.trim() ?? '';
}

// ---- Shadow DOM パネル ----

function buildScorePanel(hostEl: HTMLElement): ShadowRoot {
  hostEl.id = PANEL_ID;
  const shadow = hostEl.attachShadow({ mode: 'open' });

  shadow.innerHTML = `
    <style>
      :host { display: block; }
      * { box-sizing: border-box; }
      .panel {
        border: 1px solid #06c755;
        border-radius: 10px;
        padding: 10px 12px;
        background: #fff;
        font-family: 'Hiragino Sans', 'Meiryo', sans-serif;
        font-size: 13px;
        color: #1a1a1a;
        min-width: 320px;
      }
      .panel-header {
        font-weight: 700;
        color: #3730a3;
        margin-bottom: 8px;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .badge {
        font-size: 10px;
        background: #dcfce7;
        color: #16a34a;
        padding: 1px 6px;
        border-radius: 10px;
        font-weight: 600;
      }
      .row-controls {
        display: flex;
        gap: 6px;
        margin-bottom: 8px;
        align-items: center;
      }
      select {
        flex: 1;
        padding: 4px 6px;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 11px;
        background: #fff;
        cursor: pointer;
        font-family: inherit;
      }
      .btn-score {
        padding: 5px 14px;
        background: #3730a3;
        color: #fff;
        border: none;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;
        font-family: inherit;
      }
      .btn-score:hover:not(:disabled) { background: #312e81; }
      .btn-score:disabled { background: #9ca3af; cursor: not-allowed; }
      .usage-txt { font-size: 11px; color: #6b7280; white-space: nowrap; }
      .usage-txt.pro { color: #3730a3; font-weight: 700; }
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
      .score-section { margin-top: 8px; }
      .score-row { display: flex; align-items: baseline; gap: 4px; margin-bottom: 6px; }
      .score-num { font-size: 32px; font-weight: 800; line-height: 1; color: #3730a3; }
      .score-num.high { color: #16a34a; }
      .score-num.mid  { color: #d97706; }
      .score-num.low  { color: #dc2626; }
      .score-label { font-size: 12px; color: #9ca3af; }
      .axis-row { display: flex; align-items: center; gap: 5px; margin-bottom: 3px; }
      .axis-name { font-size: 10px; color: #6b7280; width: 72px; }
      .axis-bar-bg {
        flex: 1; height: 5px; background: #e5e7eb;
        border-radius: 3px; overflow: hidden;
      }
      .axis-bar-fill { height: 100%; border-radius: 3px; background: #3730a3; }
      .axis-score-txt { font-size: 10px; color: #374151; width: 20px; text-align: right; }
      .improvements {
        margin-top: 6px; padding-top: 6px; border-top: 1px solid #e5e7eb;
      }
      .improvements-title {
        font-size: 10px; font-weight: 700; color: #6b7280;
        text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px;
      }
      .improvements ul { list-style: none; padding: 0; margin: 0; }
      .improvements li {
        font-size: 11px; color: #374151; padding-left: 10px;
        position: relative; margin-bottom: 2px;
      }
      .improvements li::before { content: '•'; position: absolute; left: 0; color: #3730a3; }
      .footer-link {
        margin-top: 6px; font-size: 11px; color: #3730a3; text-decoration: none;
        display: block;
      }
      .footer-link:hover { text-decoration: underline; }
    </style>
    <div class="panel">
      <div class="panel-header">
        <span>M MsgScore</span>
        <span class="badge">LINE</span>
      </div>
      <div class="row-controls">
        <select id="sel-preset">
          <option value="ec-general">EC全体</option>
          <option value="young-women-ec">20代女性向けEC</option>
          <option value="btob-lead">BtoBリード</option>
          <option value="family">ファミリー層</option>
          <option value="senior">シニア層</option>
        </select>
        <button class="btn-score" id="btn-score">採点</button>
        <span class="usage-txt" id="usage-txt"></span>
      </div>
      <div class="error-txt" id="error-txt" style="display:none;"></div>
      <div class="score-section" id="score-section" style="display:none;">
        <div class="score-row">
          <span class="score-num" id="score-num">--</span>
          <span class="score-label">/ 100</span>
        </div>
        <div id="axes-list"></div>
        <div class="improvements" id="improvements" style="display:none;">
          <div class="improvements-title">改善提案</div>
          <ul id="improvements-list"></ul>
        </div>
        <a class="footer-link" href="https://msg-scorer.vercel.app" target="_blank">→ Web版で詳細を見る</a>
      </div>
    </div>
  `;
  return shadow;
}

// ---- ボタン注入 ----

function injectButton(inputEl: HTMLTextAreaElement | HTMLElement): void {
  // 既に注入済みならスキップ
  if (document.querySelector(`[${INJECTED_ATTR}]`)) return;

  const btn = document.createElement('button');
  btn.setAttribute(INJECTED_ATTR, 'true');
  btn.textContent = 'M Score';
  btn.type = 'button';
  btn.style.cssText = `
    display: inline-flex;
    align-items: center;
    padding: 5px 10px;
    background: #fff;
    border: 1.5px solid #c7d2fe;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    font-family: inherit;
    color: #3730a3;
    font-weight: 600;
    margin: 4px;
    z-index: 9999;
    position: relative;
  `;
  btn.onmouseenter = () => { btn.style.boxShadow = '0 1px 4px rgba(55,48,163,0.2)'; };
  btn.onmouseleave = () => { btn.style.boxShadow = ''; };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    togglePanel(inputEl, btn);
  });

  // inputElの後、または親要素の末尾に挿入
  const parent = inputEl.parentElement;
  if (parent) {
    parent.insertBefore(btn, inputEl.nextSibling);
  } else {
    document.body.appendChild(btn);
  }

  console.debug('[MsgScore LINE] Button injected');
}

function togglePanel(inputEl: HTMLTextAreaElement | HTMLElement, triggerBtn: HTMLElement): void {
  const existing = document.getElementById(PANEL_ID);
  if (existing) {
    existing.remove();
    return;
  }

  const text = getTextFromInput(inputEl);

  const host = document.createElement('div');
  const shadow = buildScorePanel(host);

  const rect = triggerBtn.getBoundingClientRect();
  const panelWidth = 340;
  let left = rect.left;
  if (left + panelWidth > window.innerWidth - 8) {
    left = window.innerWidth - panelWidth - 8;
  }
  host.style.cssText = `
    display: block;
    position: fixed;
    z-index: 2147483647;
    left: ${left}px;
    top: ${rect.bottom + 4}px;
    width: ${panelWidth}px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.18);
    border-radius: 10px;
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

  // プリセット復元
  const selPreset = shadow.getElementById('sel-preset') as HTMLSelectElement;
  getStorageValue<string>('lastPreset', 'ec-general').then((p) => { selPreset.value = p; });

  // 残り回数
  const usageTxt = shadow.getElementById('usage-txt')!;
  const btnScore = shadow.getElementById('btn-score') as HTMLButtonElement;

  const refreshUsage = async () => {
    const tokenValid = await getStorageValue('tokenValid', false);
    if (tokenValid) {
      usageTxt.textContent = '⭐ Pro';
      usageTxt.className = 'usage-txt pro';
    } else {
      const remaining = await getRemainingCount();
      usageTxt.textContent = `残り${remaining}回`;
      usageTxt.className = 'usage-txt';
      if (remaining === 0) {
        btnScore.disabled = true;
        btnScore.title = '本日の無料枠を使い切りました';
      }
    }
  };
  refreshUsage();

  const errorTxt = shadow.getElementById('error-txt')!;
  const scoreSection = shadow.getElementById('score-section')!;
  const scoreNumEl = shadow.getElementById('score-num')!;
  const axesList = shadow.getElementById('axes-list')!;
  const improvementsEl = shadow.getElementById('improvements')!;
  const improvementsList = shadow.getElementById('improvements-list')!;

  btnScore.addEventListener('click', async () => {
    errorTxt.style.display = 'none';
    scoreSection.style.display = 'none';
    btnScore.innerHTML = '<span class="spinner"></span>採点中…';
    btnScore.disabled = true;

    const preset = AUDIENCE_PRESETS[selPreset.value] ?? AUDIENCE_PRESETS['ec-general'];
    await setStorageValues({ lastPreset: selPreset.value });

    // 最新テキストを再取得
    const latestText = getTextFromInput(inputEl) || text || '(テキストなし)';
    const result = await callScoreApi(latestText, preset);

    btnScore.innerHTML = '採点';
    await refreshUsage();

    if (result.error) {
      errorTxt.textContent = result.error;
      errorTxt.style.display = 'block';
      return;
    }

    const totalScore = result.totalScore ?? 0;
    scoreNumEl.textContent = String(totalScore);
    scoreNumEl.className = 'score-num';
    if (totalScore >= 70) scoreNumEl.classList.add('high');
    else if (totalScore >= 50) scoreNumEl.classList.add('mid');
    else scoreNumEl.classList.add('low');

    axesList.innerHTML = '';
    (result.axes ?? []).forEach((axis) => {
      const row = document.createElement('div');
      row.className = 'axis-row';
      row.innerHTML = `
        <span class="axis-name">${axis.name}</span>
        <div class="axis-bar-bg"><div class="axis-bar-fill" style="width:${axis.score}%"></div></div>
        <span class="axis-score-txt">${axis.score}</span>
      `;
      axesList.appendChild(row);
    });

    const improvements = result.improvements ?? [];
    if (improvements.length > 0) {
      improvementsList.innerHTML = '';
      improvements.slice(0, 3).forEach((imp) => {
        const li = document.createElement('li');
        li.textContent = imp;
        improvementsList.appendChild(li);
      });
      improvementsEl.style.display = 'block';
    }

    scoreSection.style.display = 'block';

    const tokenValid = await getStorageValue('tokenValid', false);
    if (!tokenValid) {
      await incrementUsage();
      await refreshUsage();
    }
  });
}

// ---- MutationObserver ----

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function scanAndInject(): void {
  const inputEl = findTextInput();
  if (inputEl) {
    injectButton(inputEl as HTMLTextAreaElement);
  }
}

const observer = new MutationObserver(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(scanAndInject, 700);
});

observer.observe(document.body, { childList: true, subtree: true });

// 初回スキャン（ページロード時に既に要素がある場合）
setTimeout(scanAndInject, 1500);
