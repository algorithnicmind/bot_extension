<div align="center">
  <img src="assets/icons/icon128.png" alt="AI Agent Icon" width="128" />
  
  <h1>✨ Personal AI Assistant</h1>
  <p><strong>Your Ultimate AI Powerhouse Built Directly Into the Browser</strong></p>

  [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge&logo=appveyor)](https://github.com/algorithnicmind/bot_extension)
  [![Manifest](https://img.shields.io/badge/manifest-V3-success.svg?style=for-the-badge&logo=googlechrome)](https://developer.chrome.com/docs/extensions/mv3/)
  [![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](LICENSE)
</div>

<br />

## 🌟 Transform How You Browse
This **AI Assistant Chrome Extension** seamlessly weaves large language models into your daily web browsing. Why jump between tabs to talk to ChatGPT when you can bring the intelligence directly to the content you are viewing?

### 🚀 Powerful Interactive Features
| Feature | Details |
| :--- | :--- |
| **📝 Summarize** | Too long; didn't read? Get the key takeaways, bullet points, and core meaning of long articles instantly. |
| **🧠 Explain In-Context** | Highlight confusing sentences, technical jargon, or code blocks on any site, and a floating **✨ Ask AI** tooltip will explain it to you directly. |
| **🌐 Translate Anywhere** | Instantly overcome language barriers on the fly. Accurately translate selected content. |
| **💬 Direct Page Chat** | Open the extension and talk _with_ the webpage. The AI understands the context of the page you are on. |
| **🖱️ Context Menu** | Right-click any selection to quickly Summarize, Explain, or Translate via the browser's context menu. |

---

## 🛠️ Cutting-Edge Architecture

Built natively for speed and security without heavy external dependencies.

- **Frontend Core:** Pure, lightning-fast HTML/CSS/Vanilla JavaScript.
- **Shadow DOM Isolation:** The floating tooltips are injected via a highly secure `ShadowRoot`, guaranteeing the host site's CSS will **never** leak into or break your extension's layout.
- **Chrome Manifest V3:** Fully compliant with the latest security standards, offline script bundling, and isolated Service Workers.
- **Strict Linting:** Zero errors and flawless code readability via [Biome](https://biomejs.dev/).

### Integrated LLM Providers:
- 🟢 **Google Gemini** (Recommended, extremely fast response)
- 🔵 **OpenAI** (ChatGPT integration supported)
- 🟣 **Anthropic** (Claude integration supported)

---

## ⚙️ Installation & Usage Guide

### 1. Grab the Project
```bash
git clone https://github.com/algorithnicmind/bot_extension.git
cd bot_extension
```

### 2. Add to Chrome 🧩
1. Type `chrome://extensions/` in your Chrome URL bar.
2. Toggle on **"Developer mode"** ✨ (top-right).
3. Click **"Load unpacked"** 📂 (top-left).
4. Select the `bot_extension` folder.
5. *Pro Tip:* Click the puzzle piece icon next to your profile picture and **Pin** the extension so it's always accessible!

### 3. Connect Your Brain 🧠
1. Open the **AI Assistant** popup and click the `⚙️` options gear.
2. Grab a free API Key from your favorite provider (e.g., [Google AI Studio](https://aistudio.google.com/app/apikey)).
3. Paste the key and hit **Save**.

> **🔒 Security First:** Your API keys are encrypted locally on your device (`chrome.storage.local`). We never track, store, or siphon your data.

---

## 🏗️ Deep Dive Documentation

Are you a developer looking to understand how to build complex Mv3 Chrome Extensions? Check out the `/docs` folder!

- 📘 [Project Overview](docs/1_project_overview.md) 
- 📗 [Architecture & Tech Stack](docs/2_architecture.md)
- 📙 [Setup & Development Guide](docs/3_setup_guide.md)
- 📕 [Step-by-step Roadmap](docs/4_roadmap.md)

---

## 🤝 Open Source Contributions

We love PRs! If you have an idea to make this AI Assistant even smarter, let's collaborate:

1. **Fork** the Repo 
2. **Branch** out (`git checkout -b feature/EpicSuperPower`)
3. **Commit** changes (`git commit -m 'Add EpicSuperPower'`)
4. **Lint** your code (`npx @biomejs/biome check ./src`)
5. **Push** (`git push origin feature/EpicSuperPower`)
6. Open a **Pull Request**

---

<div align="center">
  <i>Engineered by <a href="https://github.com/algorithnicmind">algorithnicmind</a> to revolutionize productivity on the modern web.</i>
</div>
