/**
 * Storage utility for ChronoKeep.
 *
 * SYNC vs LOCAL split:
 *   chrome.storage.sync  — settings (enabled, archiveDelay) + ignoreList
 *                          Syncs across all signed-in browser instances automatically.
 *                          Quota: 100 KB total, 8 KB per item.
 *   chrome.storage.local — history only (can grow large, would blow sync quota).
 */

const SyncKeys = {
  ENABLED: "enabled",
  ARCHIVE_DELAY: "archiveDelay",
  IGNORE_LIST: "ignoreList",
};

const LocalKeys = {
  HISTORY: "history",
};

const SyncDefaults = {
  [SyncKeys.ENABLED]: true,
  [SyncKeys.ARCHIVE_DELAY]: 1000,
  [SyncKeys.IGNORE_LIST]: [
    "localhost",
    "127.0.0.1",
    "mail.google.com",
    "gmail.com",
    "outlook.live.com",
    "online-banking",
    "bank",
    "account",
    "paypal.com",
    "stripe.com",
  ],
};

const SYNC_QUOTA_BYTES_PER_ITEM = 8192; // chrome.storage.sync hard limit

// ── helpers ──────────────────────────────────────────────────────────────────

function getSync(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (result) => {
      resolve(result[key] !== undefined ? result[key] : SyncDefaults[key]);
    });
  });
}

function setSync(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

function getLocal(key, defaultValue) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key] !== undefined ? result[key] : defaultValue);
    });
  });
}

function setLocal(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, resolve);
  });
}

// ── public API ────────────────────────────────────────────────────────────────

const StorageUtils = {
  // Settings — synced

  isEnabled() {
    return getSync(SyncKeys.ENABLED);
  },
  setEnabled(enabled) {
    return setSync(SyncKeys.ENABLED, enabled);
  },

  getArchiveDelay() {
    return getSync(SyncKeys.ARCHIVE_DELAY);
  },
  setArchiveDelay(ms) {
    return setSync(SyncKeys.ARCHIVE_DELAY, ms);
  },

  // Ignore list — synced, with quota fallback

  getIgnoreList() {
    return getSync(SyncKeys.IGNORE_LIST);
  },

  async setIgnoreList(list) {
    const serialized = JSON.stringify(list);
    if (new Blob([serialized]).size > SYNC_QUOTA_BYTES_PER_ITEM) {
      // Graceful fallback: persist locally and warn.
      await setLocal("ignoreList_overflow", list);
      console.warn(
        "ChronoKeep: ignore-list exceeds chrome.storage.sync per-item quota. Stored locally."
      );
      return;
    }
    return setSync(SyncKeys.IGNORE_LIST, list);
  },

  async addToIgnoreList(domain) {
    const list = await this.getIgnoreList();
    if (!list.includes(domain)) {
      list.push(domain);
      return this.setIgnoreList(list);
    }
  },

  async removeFromIgnoreList(domain) {
    const list = await this.getIgnoreList();
    const idx = list.indexOf(domain);
    if (idx !== -1) {
      list.splice(idx, 1);
      return this.setIgnoreList(list);
    }
  },

  // History — local only

  getHistory() {
    return getLocal(LocalKeys.HISTORY, []);
  },

  async addToHistory(entry) {
    const history = await this.getHistory();
    history.unshift(entry);
    if (history.length > 100) history.pop();
    return setLocal(LocalKeys.HISTORY, history);
  },

  clearHistory() {
    return setLocal(LocalKeys.HISTORY, []);
  },
};

export default StorageUtils;
export { SyncKeys, LocalKeys, SyncDefaults };
