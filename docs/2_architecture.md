# Architecture and Tech Stack

## 1. Tech Stack

- **Frontend / UI:** HTML5, CSS3, Vanilla JavaScript (or React.js/TailwindCSS for a more complex UI).
- **Extension Framework:** Manifest V3 API.
- **AI Integration:** OpenAI API (GPT-4o/GPT-3.5) / Anthropic API / Google Gemini API, OR an open-source model via an intermediate backend.
- **Bundler:** Webpack or Vite (if using a React/Typescript setup).

## 2. Extension Architecture (Manifest V3)

A Chrome extension is made up of several key components that communicate with each other:

### A. Manifest File (`manifest.json`)

The configuration file that tells Chrome about the extension properties, permissions, and what scripts to run.

### B. Popup (`popup.html` & `popup.js`)

The UI that appears when the user clicks the extension icon in the Chrome toolbar.

- Use case: Central hub for chatting with the AI, configuring settings, or triggering page-wide actions.

### C. Background Service Worker (`background.js`)

Runs in the background, independent of the current web page.

- Use case: Managing states, handling API requests to the AI provider securely (keeping API keys safe), and orchestrating communication between different parts of the extension.

### D. Content Scripts (`content.js`)

JavaScript files that run in the context of web pages. They can read details of the web pages the browser visits and make changes to them.

- Use case: Highlighting text, extracting page content to send to the AI, injecting a floating UI (like a mini chat bubble or tooltip) directly onto the page.

### E. Options Page (`options.html`)

A settings page where users can input their own API keys, set language preferences, or select their preferred AI model.

## 3. Data Flow Example: "Explain Selected Text"

1. **User Action:** User highlights text on a webpage and clicks a floating "Explain" button injected by the **Content Script**.
2. **Message Passing:** Content Script sends the highlighted text to the **Background Script**.
3. **API Call:** Background Script prepares the prompt and makes a secure HTTP request to the AI API (e.g., OpenAI).
4. **Response Handling:** Background Script receives the explanation and sends it back to the **Content Script**.
5. **UI Update:** Content Script renders a tooltip or sidebar to display the explanation to the user.
