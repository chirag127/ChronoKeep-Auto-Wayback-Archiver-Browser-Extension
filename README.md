# ChronoKeep — Auto Wayback Archiver

Manifest V3 browser extension that automatically saves every webpage you visit to the Internet Archive's Wayback Machine, with a customizable ignore list for privacy.

**Live:** https://chronokeep-auto-wayback-archiver-browser-extension.oriz.in

[![Stars](https://img.shields.io/github/stars/chirag127/ChronoKeep-Auto-Wayback-Archiver-Browser-Extension?style=flat-square)](https://github.com/chirag127/ChronoKeep-Auto-Wayback-Archiver-Browser-Extension)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](./LICENSE)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue?style=flat-square)

Star this repo if you find it useful.

## Overview

ChronoKeep runs in the background and, a moment after each page finishes loading, submits its URL to the Wayback Machine (`https://web.archive.org/save/`). Pages you visit get a permanent public snapshot without any manual action. A customizable ignore list keeps private and sensitive pages out of the archive, and the popup gives real-time feedback on what was saved.

No backend, no account. All state lives in `chrome.storage.local`.

## Features

- Automatic background archiving of visited pages to the Wayback Machine
- Customizable ignore list (domains / URL patterns) — defaults skip `localhost`, banking, webmail, `chrome://`, `file://`, etc.
- One-click on/off toggle in the popup
- Archive history and real-time feedback
- 100% frontend — no server, no login, data stays in your browser

## Architecture

Pure Manifest V3 service worker. No build step — load the `extension/` folder as-is.

```
extension/
├── manifest.json      Manifest V3 config (tabs + storage permissions)
├── background.js      service worker — watches tab updates, archives URLs
├── storage.js         chrome.storage.local wrapper (enabled, history, ignoreList)
├── popup/             popup UI — toggle + status
├── options/           options page — manage the ignore list
└── icons/             extension icons
```

## Install (developer mode)

1. Clone this repo:
   ```bash
   git clone https://github.com/chirag127/ChronoKeep-Auto-Wayback-Archiver-Browser-Extension.git
   ```
2. Open `chrome://extensions/` and enable **Developer mode** (top-right).
3. Click **Load unpacked** and select the `extension/` folder.
4. The ChronoKeep icon appears in your toolbar. Archiving is on by default.

See [INSTALL.md](./INSTALL.md) for full details.

## Usage

- Browse normally — visited pages are archived automatically after load.
- Click the toolbar icon to toggle archiving on/off and view recent activity.
- Open **Options** to add domains or patterns to the ignore list.

## Permissions

| Permission | Why |
| --- | --- |
| `tabs` | detect page loads to archive |
| `storage` | persist settings, history, ignore list |
| `https://web.archive.org/*` | submit save requests to the Wayback Machine |

## License

[MIT](./LICENSE)
