import { getStorage, setStorage, incrementUsage, getRemainingCount } from '../shared/storage';
import { generateKeigo, verifyLicense } from '../shared/api';
import type { Scene, Recipient, Tone } from '../shared/types';

// ---- DOM refs ----
const viewMain = document.getElementById('view-main')!;
const viewSettings = document.getElementById('view-settings')!;
const btnSettings = document.getElementById('btn-settings')!;

const inputText = document.getElementById('input-text') as HTMLTextAreaElement;
const selScene = document.getElementById('sel-scene') as HTMLSelectElement;
const selRecipient = document.getElementById('sel-recipient') as HTMLSelectElement;
const selTone = document.getElementById('sel-tone') as HTMLSelectElement;
const btnGenerate = document.getElementById('btn-generate') as HTMLButtonElement;
const usageBadge = document.getElementById('usage-badge')!;
const errorMsg = document.getElementById('error-msg')!;
const resultSection = document.getElementById('result-section')!;
const resultText = document.getElementById('result-text') as HTMLTextAreaElement;
const btnCopy = document.getElementById('btn-copy') as HTMLButtonElement;

const inputLicense = document.getElementById('input-license') as HTMLInputElement;
const btnSaveLicense = document.getElementById('btn-save-license') as HTMLButtonElement;
const licenseStatus = document.getElementById('license-status')!;

// ---- State ----
let isSettingsView = false;

function showError(msg: string) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove('hidden');
}

function hideError() {
  errorMsg.classList.add('hidden');
}

async function refreshUsageBadge() {
  const storage = await getStorage();
  if (storage.licenseValid) {
    usageBadge.textContent = '⭐ Pro';
    usageBadge.className = 'usage-badge pro';
  } else {
    const remaining = await getRemainingCount();
    usageBadge.textContent = `残り${remaining}回（本日）`;
    usageBadge.className = 'usage-badge';
  }
}

async function updateGenerateButton() {
  const remaining = await getRemainingCount();
  const storage = await getStorage();

  if (!storage.licenseValid && remaining === 0) {
    btnGenerate.disabled = true;
    btnGenerate.title = '本日の無料枠を使い切りました。Proプランへのアップグレードをご検討ください。';
  } else {
    btnGenerate.disabled = false;
    btnGenerate.title = '';
  }
}

// ---- メイン変換 ----
btnGenerate.addEventListener('click', async () => {
  const text = inputText.value.trim();
  if (!text) {
    showError('変換するテキストを入力してください');
    return;
  }

  hideError();
  resultSection.classList.add('hidden');
  btnGenerate.innerHTML = '<span class="spinner"></span>変換中…';
  btnGenerate.disabled = true;

  try {
    const storage = await getStorage();

    // 最後の設定を保存
    await setStorage({
      lastScene: selScene.value as Scene,
      lastRecipient: selRecipient.value as Recipient,
      lastTone: selTone.value as Tone,
    });

    const res = await generateKeigo(
      {
        text,
        scene: selScene.value as Scene,
        recipient: selRecipient.value as Recipient,
        tone: selTone.value as Tone,
      },
      storage.licenseValid ? storage.licenseKey : undefined
    );

    if (res.error) {
      showError(res.error);
    } else {
      // JSONレスポンスのbodyだけ表示（keigo-tools APIはJSON文字列を返す場合がある）
      let displayText = res.result;
      try {
        const parsed = JSON.parse(res.result);
        if (parsed.body) {
          displayText = parsed.body;
        }
      } catch {
        // JSONでなければそのまま表示
      }

      resultText.value = displayText;
      resultSection.classList.remove('hidden');

      if (!storage.licenseValid) {
        await incrementUsage();
      }
      await refreshUsageBadge();
      await updateGenerateButton();
    }
  } finally {
    btnGenerate.innerHTML = '変換する';
    btnGenerate.disabled = false;
    await updateGenerateButton();
  }
});

// ---- コピー ----
btnCopy.addEventListener('click', async () => {
  await navigator.clipboard.writeText(resultText.value);
  btnCopy.textContent = '✓ コピーしました';
  setTimeout(() => {
    btnCopy.textContent = 'コピーする';
  }, 2000);
});

// ---- 設定トグル ----
btnSettings.addEventListener('click', async () => {
  isSettingsView = !isSettingsView;
  if (isSettingsView) {
    viewMain.classList.add('hidden');
    viewSettings.classList.remove('hidden');
    btnSettings.textContent = '← 戻る';

    const storage = await getStorage();
    inputLicense.value = storage.licenseKey;
    if (storage.licenseKey) {
      licenseStatus.textContent = storage.licenseValid ? '✅ Pro有効' : '❌ 無効なキー';
      licenseStatus.className = `license-status ${storage.licenseValid ? 'valid' : 'invalid'}`;
    } else {
      licenseStatus.textContent = '未設定';
      licenseStatus.className = 'license-status';
    }
  } else {
    viewMain.classList.remove('hidden');
    viewSettings.classList.add('hidden');
    btnSettings.textContent = '⚙';
  }
});

// ---- ライセンス保存 ----
btnSaveLicense.addEventListener('click', async () => {
  const key = inputLicense.value.trim();
  if (!key) {
    licenseStatus.textContent = 'キーを入力してください';
    licenseStatus.className = 'license-status invalid';
    return;
  }

  btnSaveLicense.textContent = '確認中…';
  btnSaveLicense.disabled = true;
  licenseStatus.textContent = '';

  try {
    const valid = await verifyLicense(key);
    await setStorage({ licenseKey: key, licenseValid: valid });
    licenseStatus.textContent = valid ? '✅ Pro有効' : '❌ 無効なキー';
    licenseStatus.className = `license-status ${valid ? 'valid' : 'invalid'}`;
    await refreshUsageBadge();
  } finally {
    btnSaveLicense.textContent = '保存して確認';
    btnSaveLicense.disabled = false;
  }
});

// ---- 初期化 ----
async function init() {
  const storage = await getStorage();

  // 最後の設定を復元
  selScene.value = storage.lastScene;
  selRecipient.value = storage.lastRecipient;
  selTone.value = storage.lastTone;

  // Gmail/Outlookから渡されたテキストを自動入力
  if (storage.pendingText) {
    inputText.value = storage.pendingText;
    await setStorage({ pendingText: '' }); // 使ったらクリア
  }

  await refreshUsageBadge();
  await updateGenerateButton();
}

init();
