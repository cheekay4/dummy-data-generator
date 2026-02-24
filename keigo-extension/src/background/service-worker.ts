// コンテントスクリプトからのメッセージを受けてポップアップを開く
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'OPEN_POPUP') {
    chrome.action.openPopup()
      .then(() => sendResponse({ success: true }))
      .catch((err: Error) => sendResponse({ success: false, error: err.message }));
    return true; // 非同期レスポンスのため true を返す
  }
});
