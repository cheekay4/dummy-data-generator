import { getStorage, setStorage, incrementUsage, getRemainingCount } from '../shared/storage';
import { scoreText, verifyToken } from '../shared/api';
import { AUDIENCE_PRESETS } from '../shared/presets';
import type { Channel } from '../shared/types';

// ---- DOM refs ----
const viewMain = document.getElementById('view-main')!;
const viewSettings = document.getElementById('view-settings')!;
const btnSettings = document.getElementById('btn-settings')!;

const selChannel = document.getElementById('sel-channel') as HTMLSelectElement;
const selPreset = document.getElementById('sel-preset') as HTMLSelectElement;
const inputText = document.getElementById('input-text') as HTMLTextAreaElement;
const btnScore = document.getElementById('btn-score') as HTMLButtonElement;
const usageBadge = document.getElementById('usage-badge')!;
const errorMsg = document.getElementById('error-msg')!;

const resultSection = document.getElementById('result-section')!;
const scoreNumber = document.getElementById('score-number')!;
const axesList = document.getElementById('axes-list')!;
const improvementsSection = document.getElementById('improvements-section')!;
const improvementsList = document.getElementById('improvements-list')!;

const inputToken = document.getElementById('input-token') as HTMLInputElement;
const btnSaveToken = document.getElementById('btn-save-token') as HTMLButtonElement;
const tokenStatus = document.getElementById('token-status')!;

// ---- Helpers ----
function showError(msg: string) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove('hidden');
}

function hideError() {
  errorMsg.classList.add('hidden');
}

async function refreshUsageBadge() {
  const storage = await getStorage();
  if (storage.tokenValid) {
    const planLabel = storage.tokenPlan === 'pro' ? 'Pro' : storage.tokenPlan ?? 'Free';
    usageBadge.textContent = `⭐ ${planLabel}`;
    usageBadge.className = 'usage-badge pro';
  } else {
    const remaining = await getRemainingCount();
    usageBadge.textContent = `残り${remaining}回（本日）`;
    usageBadge.className = 'usage-badge';
  }
}

async function updateScoreButton() {
  const remaining = await getRemainingCount();
  const storage = await getStorage();
  if (!storage.tokenValid && remaining === 0) {
    btnScore.disabled = true;
    btnScore.title = '本日の無料枠を使い切りました。Proプランへのアップグレードをご検討ください。';
  } else {
    btnScore.disabled = false;
    btnScore.title = '';
  }
}

function renderResult(totalScore: number, axes: { name: string; score: number }[], improvements: string[]) {
  scoreNumber.textContent = String(totalScore);
  scoreNumber.className = 'score-number';
  if (totalScore >= 70) scoreNumber.classList.add('high');
  else if (totalScore >= 50) scoreNumber.classList.add('mid');
  else scoreNumber.classList.add('low');

  axesList.innerHTML = '';
  axes.forEach((axis) => {
    const row = document.createElement('div');
    row.className = 'axis-row';
    row.innerHTML = `
      <span class="axis-name">${axis.name}</span>
      <div class="axis-bar-bg">
        <div class="axis-bar-fill" style="width:${axis.score}%"></div>
      </div>
      <span class="axis-score-txt">${axis.score}</span>
    `;
    axesList.appendChild(row);
  });

  if (improvements.length > 0) {
    improvementsList.innerHTML = '';
    improvements.slice(0, 3).forEach((imp) => {
      const li = document.createElement('li');
      li.textContent = imp;
      improvementsList.appendChild(li);
    });
    improvementsSection.classList.remove('hidden');
  } else {
    improvementsSection.classList.add('hidden');
  }

  resultSection.classList.remove('hidden');
}

// ---- スコアリング ----
btnScore.addEventListener('click', async () => {
  const text = inputText.value.trim();
  if (!text) {
    showError('テキストを入力してください');
    return;
  }

  hideError();
  resultSection.classList.add('hidden');
  btnScore.innerHTML = '<span class="spinner"></span>採点中…';
  btnScore.disabled = true;

  try {
    const storage = await getStorage();
    const preset = AUDIENCE_PRESETS[selPreset.value] ?? AUDIENCE_PRESETS['ec-general'];
    const channel = selChannel.value as Channel;

    await setStorage({ lastChannel: channel, lastPreset: selPreset.value });

    const res = await scoreText({
      channel,
      text,
      audience: preset,
      extensionToken: storage.tokenValid ? storage.extensionToken : undefined,
    });

    if (res.error) {
      showError(res.error);
    } else if (res.result) {
      renderResult(res.result.totalScore, res.result.axes, res.result.improvements);

      if (!storage.tokenValid) {
        await incrementUsage();
      }
      await refreshUsageBadge();
      await updateScoreButton();
    }
  } finally {
    btnScore.innerHTML = 'スコアリング';
    await updateScoreButton();
  }
});

// ---- 設定トグル ----
let isSettingsView = false;

btnSettings.addEventListener('click', async () => {
  isSettingsView = !isSettingsView;
  if (isSettingsView) {
    viewMain.classList.add('hidden');
    viewSettings.classList.remove('hidden');
    btnSettings.textContent = '← 戻る';

    const storage = await getStorage();
    inputToken.value = storage.extensionToken;
    if (storage.extensionToken) {
      tokenStatus.textContent = storage.tokenValid ? '✅ 認証済み' : '❌ 無効なトークン';
      tokenStatus.className = `token-status ${storage.tokenValid ? 'valid' : 'invalid'}`;
    } else {
      tokenStatus.textContent = '未設定';
      tokenStatus.className = 'token-status';
    }
  } else {
    viewMain.classList.remove('hidden');
    viewSettings.classList.add('hidden');
    btnSettings.textContent = '⚙';
  }
});

// ---- トークン保存 ----
btnSaveToken.addEventListener('click', async () => {
  const token = inputToken.value.trim();
  if (!token) {
    tokenStatus.textContent = 'トークンを入力してください';
    tokenStatus.className = 'token-status invalid';
    return;
  }

  btnSaveToken.textContent = '確認中…';
  btnSaveToken.disabled = true;
  tokenStatus.textContent = '';

  try {
    const { valid, plan } = await verifyToken(token);
    await setStorage({ extensionToken: token, tokenValid: valid, tokenPlan: plan });
    tokenStatus.textContent = valid ? `✅ 認証済み（${plan ?? 'free'}プラン）` : '❌ 無効なトークン';
    tokenStatus.className = `token-status ${valid ? 'valid' : 'invalid'}`;
    await refreshUsageBadge();
  } finally {
    btnSaveToken.textContent = '保存して確認';
    btnSaveToken.disabled = false;
  }
});

// ---- 初期化 ----
async function init() {
  const storage = await getStorage();
  selChannel.value = storage.lastChannel;
  selPreset.value = storage.lastPreset;
  await refreshUsageBadge();
  await updateScoreButton();
}

init();
