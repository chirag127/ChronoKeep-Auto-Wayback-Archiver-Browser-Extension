import StorageUtils from "../storage.js";

const enableToggle = document.getElementById("enableToggle");
const statusText   = document.getElementById("statusText");
const historyList  = document.getElementById("historyList");
const optionsBtn   = document.getElementById("optionsBtn");

function formatDate(ts) {
  return new Date(ts).toLocaleString(undefined, {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function updateToggle(enabled) {
  enableToggle.checked = enabled;
  statusText.textContent = enabled ? "Auto-archiving enabled" : "Auto-archiving paused";
}

function renderHistory(history) {
  if (!history.length) {
    historyList.innerHTML = '<div class="empty-state">No archives yet — browse some pages.</div>';
    return;
  }
  historyList.innerHTML = history.map((entry) => {
    const badgeClass = entry.status === "ok" ? "status-ok" : "status-fail";
    const badgeLabel = entry.status === "ok" ? "saved" : "failed";
    return `
      <div class="history-item">
        <a href="${entry.archiveUrl}" target="_blank" rel="noopener" title="${entry.url}">${entry.url}</a>
        <div class="meta">
          <span class="timestamp">${formatDate(entry.timestamp)}</span>
          <span class="status-badge ${badgeClass}">${badgeLabel}</span>
        </div>
      </div>`;
  }).join("");
}

async function init() {
  const [enabled, history] = await Promise.all([
    StorageUtils.isEnabled(),
    StorageUtils.getHistory(),
  ]);
  updateToggle(enabled);
  renderHistory(history);

  enableToggle.addEventListener("change", async () => {
    await StorageUtils.setEnabled(enableToggle.checked);
    updateToggle(enableToggle.checked);
  });

  optionsBtn.addEventListener("click", () => chrome.runtime.openOptionsPage());
}

document.addEventListener("DOMContentLoaded", init);
