# ChronoKeep

Auto-archive every page you visit to the Wayback Machine. MV3 browser extension, 100% client-side, no account, cross-device sync.

**Live:** https://chronokeep-bs-ext.oriz.in

[![Stars](https://img.shields.io/github/stars/chirag127/chronokeep-bs-ext?style=flat-square)](https://github.com/chirag127/chronokeep-bs-ext)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](./LICENSE)
[![Release](https://img.shields.io/github/v/release/chirag127/chronokeep-bs-ext?style=flat-square)](https://github.com/chirag127/chronokeep-bs-ext/releases/latest)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue?style=flat-square)

## What it does

ChronoKeep runs invisibly in the background. One second after every page finishes loading, it submits the URL to `https://web.archive.org/save/`. The page gets a permanent Wayback Machine snapshot — automatically, with no clicks required.

No backend. No account. No tracking. All state lives in `chrome.storage`.

## Features

- Automatic background archiving to the Wayback Machine
- **Cross-device sync** — ignore list, on/off toggle, and archive delay sync across all your signed-in Chrome/Edge instances via `chrome.storage.sync` (uses the browser's own sync; no account we manage)
- Customizable ignore list — defaults skip localhost, banking patterns, Gmail, Outlook, PayPal, and more
- Configurable archive delay (default 1 s)
- One-click on/off toggle in the popup
- Archive history (last 100 pages) with direct snapshot links
- 100% frontend — no server, no login

## Install (developer mode)

1. Download `chronokeep.zip` from the [latest release](https://github.com/chirag127/chronokeep-bs-ext/releases/latest) and extract it.
2. Open `chrome://extensions/` and enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select the `extension/` folder.
4. The ChronoKeep icon appears in your toolbar. Archiving is on by default.

Firefox: load temporarily via `about:debugging` → Load Temporary Add-on → select `extension/manifest.json`. AMO submission planned.

## How it works

```
extension/
├── manifest.json      MV3 config (tabs + storage permissions)
├── background.js      service worker — watches tab loads, fires save requests
├── storage.js         storage layer (sync for settings, local for history)
├── popup/             toolbar popup — toggle + recent archives
├── options/           options page — ignore list, delay, sync indicator
└── icons/             16 / 48 / 128 px icons
```

Storage split:
- `chrome.storage.sync` — enabled toggle, archive delay, ignore list (synced across devices)
- `chrome.storage.local` — history only (can grow large; sync quota would be blown)

## Permissions

| Permission | Why |
|---|---|
| `tabs` | detect page loads |
| `storage` | persist settings, ignore list, history |
| `https://web.archive.org/*` | submit save requests |

## Privacy

The extension sends only visited URLs (excluding ignored domains) to `web.archive.org`. No personal data collected. No analytics. No backend. See [privacy policy](https://chronokeep-bs-ext.oriz.in/privacy.html).

## License

[MIT](./LICENSE)
