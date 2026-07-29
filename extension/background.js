/**
 * Background service worker for ChronoKeep.
 * Listens for tab loads, checks ignore-list + enabled state, submits to Wayback Machine.
 */

import StorageUtils from "./storage.js";

const WAYBACK_SAVE_URL = "https://web.archive.org/save/";

// Internal patterns always skipped regardless of user ignore-list.
const ALWAYS_SKIP = [
  "chrome://",
  "chrome-extension://",
  "moz-extension://",
  "edge://",
  "about:",
  "file://",
  "data:",
];

function shouldIgnore(url, ignoreList) {
  if (ALWAYS_SKIP.some((p) => url.startsWith(p))) return true;
  try {
    const { hostname } = new URL(url);
    return ignoreList.some(
      (pattern) => hostname.includes(pattern) || url.includes(pattern)
    );
  } catch {
    return true;
  }
}

async function archiveUrl(url) {
  const archiveRequestUrl = WAYBACK_SAVE_URL + encodeURIComponent(url);
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = async function () {
      if (xhr.readyState !== 4) return;
      const archiveUrl =
        xhr.status >= 200 && xhr.status < 400
          ? xhr.responseURL || `https://web.archive.org/web/*/${url}`
          : `https://web.archive.org/web/*/${url}`;
      const status =
        xhr.status >= 200 && xhr.status < 400 ? "ok" : "failed";
      await StorageUtils.addToHistory({
        url,
        archiveUrl,
        timestamp: Date.now(),
        status,
      });
      resolve({ archiveUrl, status });
    };
    xhr.onerror = async function () {
      await StorageUtils.addToHistory({
        url,
        archiveUrl: `https://web.archive.org/web/*/${url}`,
        timestamp: Date.now(),
        status: "error",
      });
      resolve({ status: "error" });
    };
    xhr.open("GET", archiveRequestUrl, true);
    xhr.send();
  });
}

async function handleTabUpdate(_tabId, changeInfo, tab) {
  if (changeInfo.status !== "complete" || !tab.url) return;

  const [enabled, ignoreList, delay] = await Promise.all([
    StorageUtils.isEnabled(),
    StorageUtils.getIgnoreList(),
    StorageUtils.getArchiveDelay(),
  ]);

  if (!enabled || shouldIgnore(tab.url, ignoreList)) return;

  setTimeout(async () => {
    try {
      await archiveUrl(tab.url);
    } catch (err) {
      console.error("ChronoKeep archive error:", err);
    }
  }, delay);
}

chrome.tabs.onUpdated.addListener(handleTabUpdate);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message === "check-extension-status") {
    sendResponse({ status: "active", version: chrome.runtime.getManifest().version });
    return true;
  }
});
