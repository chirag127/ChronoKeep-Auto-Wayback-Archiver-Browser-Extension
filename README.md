# ClerkFlow-Secure-Auth-Browser-Extension

Production-ready Manifest V3 browser extension boilerplate with secure Clerk authentication and in-browser data persistence.

**Live:** https://ClerkFlow-Secure-Auth-Browser-Extension.oriz.in

[![GitHub Stars](https://img.shields.io/github/stars/chirag127/ClerkFlow-Secure-Auth-Browser-Extension?style=flat-square)](https://github.com/chirag127/ClerkFlow-Secure-Auth-Browser-Extension/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](./LICENSE)
![Build](https://img.shields.io/github/actions/workflow/status/chirag127/ClerkFlow-Secure-Auth-Browser-Extension/ci.yml?style=flat-square)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue?style=flat-square)

Star this repo if you find it useful.

## Overview

ClerkFlow is a frontend-only Manifest V3 extension boilerplate. It integrates Clerk for secure user authentication and persists all data in the browser via `chrome.storage.local` — no backend required. Use it as the foundation for building secure, serverless web extensions that meet modern browser security standards.

## Architecture

Pure frontend, TypeScript + Vite toolchain. Clerk session tokens are handled inside the isolated service-worker context; user-provided API keys and app data live in `chrome.storage.local`.

```
extension/
├── manifest.json          Manifest V3 config
├── background/            service worker (session + storage)
├── popup/                 popup UI
├── scripts/              auth, clerk, api, notes, config
├── styles/               popup CSS
└── assets/               icons
```

## Tech stack

| Category | Technology |
| --- | --- |
| Language | TypeScript |
| Build | Vite |
| Styling | TailwindCSS |
| Auth | Clerk SDK |
| Storage | chrome.storage.local |

## Setup

Requires Node.js 20+ and npm.

```bash
git clone https://github.com/chirag127/ClerkFlow-Secure-Auth-Browser-Extension.git
cd ClerkFlow-Secure-Auth-Browser-Extension
npm install
npm run dev      # Vite dev server with HMR
npm run build    # production bundle
```

## Load in browser

1. `npm run build`
2. Open `chrome://extensions`, enable Developer mode.
3. "Load unpacked" → select the built `extension` directory.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Security policy: [SECURITY.md](./SECURITY.md).

## License

MIT — see [LICENSE](./LICENSE).
