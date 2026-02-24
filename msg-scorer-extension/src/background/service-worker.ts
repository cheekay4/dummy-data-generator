// MsgScore Chrome拡張 Service Worker (MV3)
// 現在は最小限のみ。将来的にコンテキストメニューなどを追加可能。

chrome.runtime.onInstalled.addListener(() => {
  console.log('[MsgScore] Extension installed / updated');
});
