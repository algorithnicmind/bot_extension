<div align="center">
  <h1>✨ Mitra AI Assistant</h1>
  <p><strong>Your Personal AI Companion in the Browser</strong></p>

  [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/algorithnicmind/bot_extension)
  [![Manifest](https://img.shields.io/badge/manifest-V3-success.svg)](https://developer.chrome.com/docs/extensions/mv3/)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
</div>

<br />

## 🎯 What is Mitra AI?

**Mitra AI** is a powerful, modern Chrome Extension designed to bring the capabilities of Large Language Models (LLMs) directly to any webpage you visit. Built with the **Manifest V3** standard, it securely and seamlessly integrates AI into your daily browsing to enhance productivity, reading comprehension, and learning.

Say goodbye to constantly switching tabs to ask ChatGPT. Let the AI come to your content.

---

## 🚀 Key Features

- **📝 Summarize Webpages:** Instantly extract the gist, central thesis, and key takeaways of long articles or complicated documentation.
- **🧠 Explain Selected Text:** Simply highlight confusing jargon, complex paragraphs, or strange code snippets anywhere on the page, and get simple, clear explanations via a non-intrusive floating tooltip.
- **🌐 Translate Content:** Break language barriers on the fly. Accurately translate selected content into English (or Spanish).
- **💬 Ask Page Context (Chat):** Open the extension popup to ask arbitrary questions. Mitra reads the current webpage and answers strictly based on the page's context.

---

## 🛠 Tech Stack

- **Frontend Core:** Vanilla HTML, CSS, JavaScript
- **DOM Isolation:** Shadow DOM technology to ensure the AI UI never breaks the host website's layout.
- **Extension API:** Chrome Extension Manifest V3 Standard (using isolated Service Workers).
- **Code Quality:** [Biome](https://biomejs.dev/) for strict linting and standard formatting.
- **AI Integrations Supported:**
  - Google Gemini (Default & Recommended)
  - OpenAI (ChatGPT)
  - Anthropic (Claude)

---

## 📦 Installation & Setup

Mitra AI is designed for developers and power users. Follow these steps to load the extension into your Chrome browser:

### 1. Download the Project
Clone the repository to your local machine:
```bash
git clone https://github.com/algorithnicmind/bot_extension.git
cd bot_extension
```

### 2. Load into Chrome
1. Open Google Chrome and type `chrome://extensions/` in the URL bar.
2. Toggle on **"Developer mode"** in the top-right corner.
3. Click the **"Load unpacked"** button in the top-left.
4. Select the `bot_extension` directory you just cloned.
5. *Optional but recommended:* Click the puzzle piece (`🧩`) next to your Chrome profile avatar and "Pin" Mitra AI to your toolbar for easy access.

### 3. Configure Your AI Provider
1. Right-click the Mitra AI extension icon and select **"Options"** (or click the "⚙️ Settings" gear icon in the extension popup).
2. Select your preferred AI provider (e.g., Google Gemini).
3. Obtain an API key from your provider (e.g., [Google AI Studio](https://aistudio.google.com/app/apikey)).
4. Paste your API Key in the settings page and click **Save Configuration**.

> **🔒 Privacy Note:** Your API keys are encrypted and stored safely on your local device using `chrome.storage.local`. They are never transmitted anywhere except directly to the AI provider you selected.

---

## 📚 Project Documentation

For contributors and developers who want to understand the inner workings of Mitra AI, we maintain detailed documentation in the `/docs` folder:

1. [Project Overview](docs/1_project_overview.md) - Deep dive into goals and features.
2. [Architecture & Tech Stack](docs/2_architecture.md) - Understand the Manifest V3 data flow, service workers, and message passing.
3. [Setup & Development Guide](docs/3_setup_guide.md) - Coding standards and architecture rules.
4. [Step-by-step Roadmap](docs/4_roadmap.md) - How this project was built phase-by-phase.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check out the [issues page](https://github.com/algorithnicmind/bot_extension/issues) if you want to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Verify code passes linting (`npx @biomejs/biome check ./src`)
5. Push to the Branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

---

<div align="center">
  <i>Built with ❤️ by <a href="https://github.com/algorithnicmind">algorithnicmind</a> to revolutionize how we browse the web.</i>
</div>
