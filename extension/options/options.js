import StorageUtils from "../storage.js";

const enableToggle  = document.getElementById("enableToggle");
const delayInput    = document.getElementById("delayInput");
const newDomainInput = document.getElementById("newDomain");
const addDomainBtn  = document.getElementById("addDomainBtn");
const ignoreListEl  = document.getElementById("ignoreList");
const historyListEl = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

function formatDate(ts) {
  return new Date(ts).toLocaleString(undefined, {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function renderIgnoreList(domains) {
  if (!domains.length) {
    ignoreListEl.innerHTML = '<li class="empty-state">No patterns — everything will be archived.</li>';
    return;
  }
  ignoreListEl.innerHTML = domains.map((d) =>
    `<li>
      <span>${d}</span>
      <button class="remove-btn" data-domain="${d}">Remove</button>
    </li>`
  ).join("");

  ignoreListEl.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await StorageUtils.removeFromIgnoreList(btn.dataset.domain);
      renderIgnoreList(await StorageUtils.getIgnoreList());
    });
  });
}

function renderHistory(history) {
  if (!history.length) {
    historyListEl.innerHTML = '<div class="empty-state">No archives yet.</div>';
    return;
  }
  historyListEl.innerHTML = history.map((entry) => {
    const cls = entry.status === "ok" ? "status-ok" : "status-fail";
    const label = entry.status === "ok" ? "saved" : "failed";
    return `
      <div class="history-item">
        <a href="${entry.archiveUrl}" target="_blank" rel="noopener" title="${entry.url}">${entry.url}</a>
        <div class="meta">
          <span class="timestamp">${formatDate(entry.timestamp)}</span>
          <span class="status-badge ${cls}">${label}</span>
        </div>
      </div>`;
  }).join("");
}

async function init() {
  const [enabled, delay, domains, history] = await Promise.all([
    StorageUtils.isEnabled(),
    StorageUtils.getArchiveDelay(),
    StorageUtils.getIgnoreList(),
    StorageUtils.getHistory(),
  ]);

  enableToggle.checked = enabled;
  delayInput.value = delay;
  renderIgnoreList(domains);
  renderHistory(history);

  enableToggle.addEventListener("change", () =>
    StorageUtils.setEnabled(enableToggle.checked)
  );

  delayInput.addEventListener("change", () => {
    const v = parseInt(delayInput.value, 10);
    if (!isNaN(v) && v >= 500) StorageUtils.setArchiveDelay(v);
  });

  async function addDomain() {
    const domain = newDomainInput.value.trim();
    if (!domain) return;
    await StorageUtils.addToIgnoreList(domain);
    newDomainInput.value = "";
    renderIgnoreList(await StorageUtils.getIgnoreList());
  }

  addDomainBtn.addEventListener("click", addDomain);
  newDomainInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addDomain();
  });

  clearHistoryBtn.addEventListener("click", async () => {
    if (!confirm("Clear all archive history on this device?")) return;
    await StorageUtils.clearHistory();
    renderHistory([]);
  });
}

document.addEventListener("DOMContentLoaded", init);
