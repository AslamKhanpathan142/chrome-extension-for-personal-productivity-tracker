chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId);
  if (tab.url.startsWith('chrome://')) return;
  if (activeTabId && startTime) {
    const duration = (Date.now() - startTime) / 1000;
    const domain = new URL(tab.url).hostname;

    chrome.storage.local.get([domain], (res) => {
      const previous = res[domain] || 0;
      chrome.storage.local.set({ [domain]: previous + duration });
    });
  }
  activeTabId = tabId;
  startTime = Date.now();
});

chrome.tabs.onRemoved.addListener(() => {
  activeTabId = null;
  startTime = null;
});
