const toggle = document.getElementById('toggle');
const cleanBtn = document.getElementById('cleanBtn');
const statusEl = document.getElementById('status');

function setStatus(text) {
  statusEl.textContent = text;
}

function sendToActiveTab(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    if (!tab || !tab.id) {
      if (callback) callback(null);
      return;
    }
    chrome.tabs.sendMessage(tab.id, message, (resp) => {
      if (chrome.runtime.lastError) {
        if (callback) callback(null);
        return;
      }
      if (callback) callback(resp);
    });
  });
}

chrome.storage.sync.get({ enabled: true }, (data) => {
  const enabled = data.enabled !== false;
  toggle.checked = enabled;
  setStatus(enabled ? '已开启自动解锁' : '已暂停自动解锁');
});

toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.sync.set({ enabled }, () => {
    setStatus(enabled ? '已开启自动解锁' : '已暂停（刷新网页恢复原样）');
    sendToActiveTab({ type: 'SET_ENABLED', enabled });
  });
});

cleanBtn.addEventListener('click', () => {
  sendToActiveTab({ type: 'CLEAN_NOW' }, (resp) => {
    if (resp && resp.ok) {
      setStatus('已解锁当前页，请点地址栏谷歌翻译');
    } else {
      setStatus('请刷新网页后再试（系统页面不支持）');
    }
  });
});
