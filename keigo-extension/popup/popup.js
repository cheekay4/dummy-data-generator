"use strict";
(() => {
  // src/shared/storage.ts
  var FREE_DAILY_LIMIT = 10;
  var DEFAULT_STORAGE = {
    usageCount: 0,
    usageDate: "",
    licenseKey: "",
    licenseValid: false,
    lastScene: "reply",
    lastRecipient: "client",
    lastTone: "polite",
    pendingText: ""
  };
  function getTodayString() {
    const d = /* @__PURE__ */ new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  async function getStorage() {
    return new Promise((resolve) => {
      chrome.storage.local.get(DEFAULT_STORAGE, (result) => {
        resolve(result);
      });
    });
  }
  async function setStorage(data) {
    return new Promise((resolve) => {
      chrome.storage.local.set(data, resolve);
    });
  }
  async function incrementUsage() {
    const storage = await getStorage();
    const today = getTodayString();
    if (storage.usageDate !== today) {
      await setStorage({ usageCount: 1, usageDate: today });
    } else {
      await setStorage({ usageCount: storage.usageCount + 1 });
    }
  }
  async function getRemainingCount() {
    const storage = await getStorage();
    if (storage.licenseValid) {
      return 999;
    }
    const today = getTodayString();
    if (storage.usageDate !== today) {
      return FREE_DAILY_LIMIT;
    }
    return Math.max(0, FREE_DAILY_LIMIT - storage.usageCount);
  }

  // src/shared/api.ts
  var API_BASE = "https://keigo-tools.vercel.app";
  var TIMEOUT_MS = 3e4;
  async function fetchWithTimeout(url, options) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }
  async function generateKeigo(req, licenseKey) {
    const headers = {
      "Content-Type": "application/json"
    };
    if (licenseKey) {
      headers["X-License-Key"] = licenseKey;
    }
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/generate`, {
        method: "POST",
        headers,
        body: JSON.stringify(req)
      });
      const data = await res.json();
      if (!res.ok) {
        return { result: "", error: data.error ?? "\u751F\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F" };
      }
      return { result: data.result ?? "" };
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return { result: "", error: "\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8\uFF0830\u79D2\uFF09\u3057\u307E\u3057\u305F\u3002\u518D\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044" };
      }
      return { result: "", error: "\u901A\u4FE1\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F" };
    }
  }
  async function verifyLicense(licenseKey) {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/verify-license`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey })
      });
      const data = await res.json();
      return data.valid === true;
    } catch {
      return false;
    }
  }

  // src/popup/popup.ts
  var viewMain = document.getElementById("view-main");
  var viewSettings = document.getElementById("view-settings");
  var btnSettings = document.getElementById("btn-settings");
  var inputText = document.getElementById("input-text");
  var selScene = document.getElementById("sel-scene");
  var selRecipient = document.getElementById("sel-recipient");
  var selTone = document.getElementById("sel-tone");
  var btnGenerate = document.getElementById("btn-generate");
  var usageBadge = document.getElementById("usage-badge");
  var errorMsg = document.getElementById("error-msg");
  var resultSection = document.getElementById("result-section");
  var resultText = document.getElementById("result-text");
  var btnCopy = document.getElementById("btn-copy");
  var inputLicense = document.getElementById("input-license");
  var btnSaveLicense = document.getElementById("btn-save-license");
  var licenseStatus = document.getElementById("license-status");
  var isSettingsView = false;
  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove("hidden");
  }
  function hideError() {
    errorMsg.classList.add("hidden");
  }
  async function refreshUsageBadge() {
    const storage = await getStorage();
    if (storage.licenseValid) {
      usageBadge.textContent = "\u2B50 Pro";
      usageBadge.className = "usage-badge pro";
    } else {
      const remaining = await getRemainingCount();
      usageBadge.textContent = `\u6B8B\u308A${remaining}\u56DE\uFF08\u672C\u65E5\uFF09`;
      usageBadge.className = "usage-badge";
    }
  }
  async function updateGenerateButton() {
    const remaining = await getRemainingCount();
    const storage = await getStorage();
    if (!storage.licenseValid && remaining === 0) {
      btnGenerate.disabled = true;
      btnGenerate.title = "\u672C\u65E5\u306E\u7121\u6599\u67A0\u3092\u4F7F\u3044\u5207\u308A\u307E\u3057\u305F\u3002Pro\u30D7\u30E9\u30F3\u3078\u306E\u30A2\u30C3\u30D7\u30B0\u30EC\u30FC\u30C9\u3092\u3054\u691C\u8A0E\u304F\u3060\u3055\u3044\u3002";
    } else {
      btnGenerate.disabled = false;
      btnGenerate.title = "";
    }
  }
  btnGenerate.addEventListener("click", async () => {
    const text = inputText.value.trim();
    if (!text) {
      showError("\u5909\u63DB\u3059\u308B\u30C6\u30AD\u30B9\u30C8\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
      return;
    }
    hideError();
    resultSection.classList.add("hidden");
    btnGenerate.innerHTML = '<span class="spinner"></span>\u5909\u63DB\u4E2D\u2026';
    btnGenerate.disabled = true;
    try {
      const storage = await getStorage();
      await setStorage({
        lastScene: selScene.value,
        lastRecipient: selRecipient.value,
        lastTone: selTone.value
      });
      const res = await generateKeigo(
        {
          text,
          scene: selScene.value,
          recipient: selRecipient.value,
          tone: selTone.value
        },
        storage.licenseValid ? storage.licenseKey : void 0
      );
      if (res.error) {
        showError(res.error);
      } else {
        let displayText = res.result;
        try {
          const parsed = JSON.parse(res.result);
          if (parsed.body) {
            displayText = parsed.body;
          }
        } catch {
        }
        resultText.value = displayText;
        resultSection.classList.remove("hidden");
        if (!storage.licenseValid) {
          await incrementUsage();
        }
        await refreshUsageBadge();
        await updateGenerateButton();
      }
    } finally {
      btnGenerate.innerHTML = "\u5909\u63DB\u3059\u308B";
      btnGenerate.disabled = false;
      await updateGenerateButton();
    }
  });
  btnCopy.addEventListener("click", async () => {
    await navigator.clipboard.writeText(resultText.value);
    btnCopy.textContent = "\u2713 \u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F";
    setTimeout(() => {
      btnCopy.textContent = "\u30B3\u30D4\u30FC\u3059\u308B";
    }, 2e3);
  });
  btnSettings.addEventListener("click", async () => {
    isSettingsView = !isSettingsView;
    if (isSettingsView) {
      viewMain.classList.add("hidden");
      viewSettings.classList.remove("hidden");
      btnSettings.textContent = "\u2190 \u623B\u308B";
      const storage = await getStorage();
      inputLicense.value = storage.licenseKey;
      if (storage.licenseKey) {
        licenseStatus.textContent = storage.licenseValid ? "\u2705 Pro\u6709\u52B9" : "\u274C \u7121\u52B9\u306A\u30AD\u30FC";
        licenseStatus.className = `license-status ${storage.licenseValid ? "valid" : "invalid"}`;
      } else {
        licenseStatus.textContent = "\u672A\u8A2D\u5B9A";
        licenseStatus.className = "license-status";
      }
    } else {
      viewMain.classList.remove("hidden");
      viewSettings.classList.add("hidden");
      btnSettings.textContent = "\u2699";
    }
  });
  btnSaveLicense.addEventListener("click", async () => {
    const key = inputLicense.value.trim();
    if (!key) {
      licenseStatus.textContent = "\u30AD\u30FC\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
      licenseStatus.className = "license-status invalid";
      return;
    }
    btnSaveLicense.textContent = "\u78BA\u8A8D\u4E2D\u2026";
    btnSaveLicense.disabled = true;
    licenseStatus.textContent = "";
    try {
      const valid = await verifyLicense(key);
      await setStorage({ licenseKey: key, licenseValid: valid });
      licenseStatus.textContent = valid ? "\u2705 Pro\u6709\u52B9" : "\u274C \u7121\u52B9\u306A\u30AD\u30FC";
      licenseStatus.className = `license-status ${valid ? "valid" : "invalid"}`;
      await refreshUsageBadge();
    } finally {
      btnSaveLicense.textContent = "\u4FDD\u5B58\u3057\u3066\u78BA\u8A8D";
      btnSaveLicense.disabled = false;
    }
  });
  async function init() {
    const storage = await getStorage();
    selScene.value = storage.lastScene;
    selRecipient.value = storage.lastRecipient;
    selTone.value = storage.lastTone;
    if (storage.pendingText) {
      inputText.value = storage.pendingText;
      await setStorage({ pendingText: "" });
    }
    await refreshUsageBadge();
    await updateGenerateButton();
  }
  init();
})();
