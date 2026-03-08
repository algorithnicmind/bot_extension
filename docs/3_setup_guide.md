# Setup & Development Guide

## 1. Prerequisites

- **Google Chrome** browser installed.
- **Node.js** and **npm** (if using modern build tools).
- Code Editor (e.g., VS Code).
- API Key from an AI provider (e.g., OpenAI, Anthropic, or Gemini) for testing.

## 2. Recommended Directory Structure

This is the standard structure we will be aiming for:

```
bot_extension/
│
├── manifest.json         # Extension configuration
├── src/
│   ├── background/
│   │   └── background.js # Background service worker
│   ├── content/
│   │   ├── content.js    # Script injected into webpages
│   │   └── content.css   # Styles for injected UI elements
│   ├── popup/
│   │   ├── popup.html    # Icon click UI
│   │   ├── popup.css
│   │   └── popup.js
│   ├── options/
│   │   ├── options.html  # Settings page
│   │   └── options.js
│   └── utils/
│       └── api.js        # Helper functions for API calls
│
├── assets/
│   ├── icons/            # Extension icons (16x16, 48x48, 128x128)
│   └── images/
│
└── docs/                 # Project documentation
```

## 3. How to Load the Extension Locally

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Turn on the **Developer mode** toggle in the top right corner.
3. Click the **Load unpacked** button in the top left.
4. Select the root folder of this project (`bot_extension`).
5. The extension should now appear in your list of extensions and be usable in the browser.
6. **Note:** Whenever you make changes to the code (especially `manifest.json` or `background.js`), you must click the **refresh icon** on the extension card in `chrome://extensions/` for the changes to take effect.

## 4. Coding Standards & Best Practices

- **Security First:** Never hardcode API keys directly into public repositories. Use an `options` page so users can provide their own key, or use a proxy backend to handle API requests securely.
- **Permissions:** Only request the exact permissions needed in `manifest.json` (e.g., `activeTab` instead of `<all_urls>` if possible) to ensure user trust and ease of Chrome Web Store review.
- **Modular Code:** Keep files small and focused. Separate UI logic from background API logic.
