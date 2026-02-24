// MsgScore Gmail コンテンツスクリプト（Shadow DOM パネル方式）

import { AUDIENCE_PRESETS } from '../shared/presets';
import type { AudienceSegment, Channel } from '../shared/types';

const FREE_DAILY_LIMIT = 5;
const API_BASE = 'https://msg-scorer.vercel.app';
const INJECTED_ATTR = 'data-msgscore-injected';
const PANEL_ID = 'msgscore-gmail-panel';

const SELECTORS = {
  composeDialog: 'div[role="dialog"]',
  subjectInput: 'input[name="subjectbox"]',
  bodyEditable: 'div[g_editable="true"]',
  toolbar: 'tr.btC',
} as const;

// ---- ストレージ（Promise ベース — MV3 推奨） ----

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
    // 書き込み失敗はサイレントに無視
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
  channel: Channel,
  text: string,
  audience: AudienceSegment,
): Promise<{ totalScore?: number; axes?: { name: string; score: number }[]; improvements?: string[]; error?: string }> {
  const extensionToken = await getStorageValue<string>('extensionToken', '');
  const tokenValid = await getStorageValue<boolean>('tokenValid', false);

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (tokenValid && extensionToken) headers['X-Extension-Token'] = extensionToken;

  try {
    const res = await fetch(`${API_BASE}/api/score`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ channel, text, audience, source: 'chrome-extension' }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? 'スコアリングに失敗しました' };
    return data;
  } catch {
    return { error: '通信エラーが発生しました' };
  }
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
        border: 1px solid #c7d2fe;
        border-radius: 10px;
        padding: 10px 12px;
        background: #fff;
        font-family: 'Hiragino Sans', 'Meiryo', sans-serif;
        font-size: 13px;
        color: #1a1a1a;
        width: 360px;
      }
      .panel-header {
        font-weight: 700;
        color: #4f46e5;
        margin-bottom: 8px;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .logo-diamond { color: #4f46e5; font-size: 14px; }
      .badge {
        font-size: 10px;
        background: #e0e7ff;
        color: #4f46e5;
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
        background: #4f46e5;
        color: #fff;
        border: none;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;
        font-family: inherit;
        min-width: 52px;
      }
      .btn-score:hover:not(:disabled) { background: #4338ca; }
      .btn-score:disabled { background: #9ca3af; cursor: not-allowed; }
      .usage-txt { font-size: 11px; color: #6b7280; white-space: nowrap; }
      .usage-txt.pro { color: #4f46e5; font-weight: 700; }

      /* ---- ローディング ---- */
      .loading-area {
        padding: 10px 0 6px;
      }
      .loading-steps {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-bottom: 8px;
      }
      .loading-step {
        display: flex;
        align-items: center;
        gap: 7px;
        font-size: 12px;
        color: #9ca3af;
        transition: color 0.3s;
      }
      .loading-step.active { color: #4f46e5; font-weight: 600; }
      .loading-step.done   { color: #16a34a; }
      .step-icon {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 9px;
        flex-shrink: 0;
        transition: background 0.3s;
      }
      .loading-step.active .step-icon {
        background: #4f46e5;
      }
      .loading-step.done .step-icon {
        background: #16a34a;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      .step-spinner {
        width: 10px; height: 10px;
        border: 2px solid rgba(255,255,255,0.4);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }
      .step-check { color: #fff; font-size: 9px; }
      .step-dot { width: 5px; height: 5px; background: #9ca3af; border-radius: 50%; }
      .progress-bar-bg {
        height: 3px;
        background: #e5e7eb;
        border-radius: 2px;
        overflow: hidden;
      }
      .progress-bar-fill {
        height: 100%;
        background: #4f46e5;
        border-radius: 2px;
        transition: width 1s ease;
      }
      .loading-timer {
        font-size: 11px;
        color: #9ca3af;
        text-align: right;
        margin-top: 4px;
      }

      /* ---- エラー ---- */
      .error-txt {
        color: #dc2626;
        font-size: 12px;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 6px;
        padding: 6px 8px;
        margin-top: 4px;
      }

      /* ---- スコア結果 ---- */
      .score-section { margin-top: 8px; }
      .score-row { display: flex; align-items: baseline; gap: 4px; margin-bottom: 6px; }
      .score-num { font-size: 32px; font-weight: 800; line-height: 1; color: #4f46e5; }
      .score-num.high { color: #16a34a; }
      .score-num.mid  { color: #d97706; }
      .score-num.low  { color: #dc2626; }
      .score-label { font-size: 12px; color: #9ca3af; }
      .axis-row { display: flex; align-items: center; gap: 5px; margin-bottom: 4px; }
      .axis-name { font-size: 10px; color: #6b7280; width: 72px; flex-shrink: 0; }
      .axis-bar-bg {
        flex: 1; height: 5px; background: #e5e7eb;
        border-radius: 3px; overflow: hidden;
      }
      .axis-bar-fill { height: 100%; border-radius: 3px; background: #4f46e5; }
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
      .improvements li::before { content: '•'; position: absolute; left: 0; color: #4f46e5; }
      .footer-link {
        display: block; margin-top: 6px; font-size: 11px;
        color: #4f46e5; text-decoration: none;
      }
      .footer-link:hover { text-decoration: underline; }
    </style>
    <div class="panel">
      <div class="panel-header">
        <span class="logo-diamond">◆</span>
        <span>MsgScore</span>
        <span class="badge" id="channel-badge">メール件名</span>
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

      <!-- ローディング表示（採点中のみ表示） -->
      <div class="loading-area" id="loading-area" style="display:none;">
        <div class="loading-steps">
          <div class="loading-step" id="step-1">
            <div class="step-icon"><div class="step-dot"></div></div>
            <span>テキストを送信中</span>
          </div>
          <div class="loading-step" id="step-2">
            <div class="step-icon"><div class="step-dot"></div></div>
            <span>AI がメッセージを分析中</span>
          </div>
          <div class="loading-step" id="step-3">
            <div class="step-icon"><div class="step-dot"></div></div>
            <span>スコアを計算中</span>
          </div>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" id="progress-fill" style="width:0%"></div>
        </div>
        <div class="loading-timer" id="loading-timer">0s</div>
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

// ---- ローディングアニメーション制御 ----

function startLoadingAnimation(shadow: ShadowRoot): () => void {
  const loadingArea = shadow.getElementById('loading-area')!;
  const progressFill = shadow.getElementById('progress-fill')!;
  const timerEl = shadow.getElementById('loading-timer')!;
  const step1 = shadow.getElementById('step-1')!;
  const step2 = shadow.getElementById('step-2')!;
  const step3 = shadow.getElementById('step-3')!;

  loadingArea.style.display = 'block';

  const startTime = Date.now();

  function setStep(el: HTMLElement, state: 'active' | 'done' | 'pending') {
    el.className = `loading-step ${state === 'pending' ? '' : state}`;
    const icon = el.querySelector('.step-icon')!;
    if (state === 'active') {
      icon.innerHTML = '<div class="step-spinner"></div>';
    } else if (state === 'done') {
      icon.innerHTML = '<span class="step-check">✓</span>';
    } else {
      icon.innerHTML = '<div class="step-dot"></div>';
    }
  }

  // ステップ進行スケジュール: 0s→step1 active, 2s→step1 done+step2 active, 8s→step2 done+step3 active
  setStep(step1, 'active');
  setStep(step2, 'pending');
  setStep(step3, 'pending');
  (progressFill as HTMLElement).style.width = '10%';

  const t1 = setTimeout(() => {
    setStep(step1, 'done');
    setStep(step2, 'active');
    (progressFill as HTMLElement).style.width = '40%';
  }, 2000);

  const t2 = setTimeout(() => {
    setStep(step2, 'done');
    setStep(step3, 'active');
    (progressFill as HTMLElement).style.width = '75%';
  }, 8000);

  // 経過秒数カウンター
  const timerInterval = setInterval(() => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    timerEl.textContent = `${elapsed}s`;
  }, 1000);

  return () => {
    clearTimeout(t1);
    clearTimeout(t2);
    clearInterval(timerInterval);
    setStep(step1, 'done');
    setStep(step2, 'done');
    setStep(step3, 'done');
    (progressFill as HTMLElement).style.width = '100%';
    setTimeout(() => { loadingArea.style.display = 'none'; }, 300);
  };
}

// ---- ツールバーボタン挿入 ----

function injectButton(composeDialog: Element): void {
  const toolbar = composeDialog.querySelector(SELECTORS.toolbar);
  if (!toolbar) return;
  if (toolbar.querySelector(`[${INJECTED_ATTR}]`)) return;

  const btnCell = document.createElement('td');
  btnCell.setAttribute(INJECTED_ATTR, 'true');
  btnCell.style.cssText = 'padding: 0 2px; vertical-align: middle;';

  const btn = document.createElement('button');
  btn.textContent = '◆ Score';
  btn.style.cssText = `
    padding: 4px 8px;
    background: #fff;
    border: 1px solid #c7d2fe;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
    color: #4f46e5;
    font-weight: 600;
  `;
  btn.onmouseenter = () => { btn.style.boxShadow = '0 1px 4px rgba(79,70,229,0.2)'; };
  btn.onmouseleave = () => { btn.style.boxShadow = ''; };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanel(composeDialog, btn);
  });

  btnCell.appendChild(btn);
  toolbar.appendChild(btnCell);
}

function detectChannel(composeDialog: Element): { channel: Channel; text: string } {
  const subjectEl = composeDialog.querySelector<HTMLInputElement>(SELECTORS.subjectInput);
  const bodyEl = composeDialog.querySelector<HTMLElement>(SELECTORS.bodyEditable);
  const subject = subjectEl?.value?.trim() ?? '';
  const body = bodyEl?.innerText?.trim() ?? '';

  if (body.length > 0) {
    return { channel: 'email-body', text: body };
  }
  return { channel: 'email-subject', text: subject };
}

function togglePanel(composeDialog: Element, triggerBtn: HTMLElement): void {
  const existing = document.getElementById(PANEL_ID);
  if (existing) {
    existing.remove();
    return;
  }

  const { channel, text: extractedText } = detectChannel(composeDialog);

  const host = document.createElement('div');
  const shadow = buildScorePanel(host);

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
    border-radius: 10px;
  `;
  document.body.appendChild(host);

  // 採点中フラグ — true の間は外側クリックで閉じない
  let isScoring = false;

  const closeOnOutsideClick = (e: MouseEvent) => {
    if (isScoring) return; // 採点中は閉じない
    if (!host.contains(e.target as Node) && e.target !== triggerBtn) {
      host.remove();
      document.removeEventListener('click', closeOnOutsideClick, true);
    }
  };
  setTimeout(() => {
    document.addEventListener('click', closeOnOutsideClick, true);
  }, 0);

  // チャネルバッジ
  const channelBadge = shadow.getElementById('channel-badge')!;
  channelBadge.textContent = channel === 'email-subject' ? 'メール件名' : 'メール本文';

  // プリセット復元
  const selPreset = shadow.getElementById('sel-preset') as HTMLSelectElement;
  getStorageValue<string>('lastPreset', 'ec-general').then((p) => { selPreset.value = p; });

  // 残り回数表示
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

  // スコアリング
  const errorTxt = shadow.getElementById('error-txt')!;
  const scoreSection = shadow.getElementById('score-section')!;
  const scoreNumEl = shadow.getElementById('score-num')!;
  const axesList = shadow.getElementById('axes-list')!;
  const improvementsEl = shadow.getElementById('improvements')!;
  const improvementsList = shadow.getElementById('improvements-list')!;

  btnScore.addEventListener('click', async () => {
    errorTxt.style.display = 'none';
    scoreSection.style.display = 'none';
    btnScore.textContent = '採点中';
    btnScore.disabled = true;
    isScoring = true;

    const stopLoading = startLoadingAnimation(shadow);
    const preset = AUDIENCE_PRESETS[selPreset.value] ?? AUDIENCE_PRESETS['ec-general'];
    await setStorageValues({ lastPreset: selPreset.value });

    const result = await callScoreApi(channel, extractedText || '(テキストなし)', preset);

    stopLoading();
    isScoring = false;
    btnScore.textContent = '採点';
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
  const dialogs = document.querySelectorAll(SELECTORS.composeDialog);
  dialogs.forEach((dialog) => {
    if (dialog.querySelector(SELECTORS.bodyEditable)) {
      injectButton(dialog);
    }
  });
}

const observer = new MutationObserver(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(scanAndInject, 500);
});

observer.observe(document.body, { childList: true, subtree: true });
scanAndInject();
