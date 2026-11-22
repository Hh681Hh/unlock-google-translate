(() => {
  let enabled = true;
  let observer = null;

  function cleanElement(el) {
    if (!el) return;
    if (el.getAttribute && el.getAttribute('translate') === 'no') {
      el.removeAttribute('translate');
    }
    if (el.classList && el.classList.contains('notranslate')) {
      el.classList.remove('notranslate');
    }
  }

  function cleanAll() {
    if (!enabled) return 0;
    let count = 0;

    if (document.documentElement) {
      if (
        document.documentElement.getAttribute('translate') === 'no' ||
        document.documentElement.classList.contains('notranslate')
      ) {
        count++;
      }
      cleanElement(document.documentElement);
    }

    if (document.body) {
      cleanElement(document.body);
    }

    document
      .querySelectorAll('meta[name="google"][content*="notranslate" i]')
      .forEach((m) => {
        m.remove();
        count++;
      });

    document.querySelectorAll('[translate="no"], .notranslate').forEach((el) => {
      cleanElement(el);
      count++;
    });

    return count;
  }

  function startObserver() {
    if (observer || !document.documentElement) return;
    observer = new MutationObserver(() => {
      if (!enabled) return;
      cleanElement(document.documentElement);
      if (document.body) cleanElement(document.body);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['translate', 'class']
    });
  }

  function stopObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function init() {
    chrome.storage.sync.get({ enabled: true }, (data) => {
      enabled = data.enabled !== false;
      if (enabled) {
        cleanAll();
        startObserver();
      }
    });
  }

  init();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (enabled) {
        cleanAll();
        startObserver();
      }
    });
  }

  window.addEventListener('load', () => {
    if (enabled) cleanAll();
  });

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg && msg.type === 'SET_ENABLED') {
      enabled = Boolean(msg.enabled);
      if (enabled) {
        const count = cleanAll();
        startObserver();
        sendResponse({ ok: true, enabled, count });
      } else {
        stopObserver();
        sendResponse({ ok: true, enabled });
      }
    } else if (msg && msg.type === 'CLEAN_NOW') {
      const prev = enabled;
      enabled = true;
      const count = cleanAll();
      startObserver();
      enabled = prev;
      sendResponse({ ok: true, count });
    }
    return true;
  });
})();
