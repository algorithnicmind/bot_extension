# Step-by-step Development Roadmap

To build this massive project effectively, we should break it down into manageable phases.

## Phase 1: Foundation (Hello World Extension)

_Objective: Get a basic extension running._

- [ ] Create the `manifest.json` file (Manifest V3).
- [ ] Add simple placeholder icons.
- [ ] Create a basic `popup.html` and `popup.js`.
- [ ] Load the unpacked extension locally in Chrome and verify the popup works.

## Phase 2: Connecting to the AI Brain

_Objective: Successfully prompt an AI model and get a response._

- [ ] Create an `options.html` page to allow the user to securely input and save an OpenAI/Gemini API key using `chrome.storage`.
- [ ] Create the `background.js` service worker.
- [ ] Set up a message passing system between the popup and the background script.
- [ ] Implement an API calling utility in the background script.
- [ ] Test a simple chat interface in the popup.

## Phase 3: Interacting with Web Pages (Content Scripts)

_Objective: Read and interact with the active webpage._

- [ ] Implement `content.js` to run on allowed web pages.
- [ ] Build the "Summarize Page" feature. The popup triggers the background script, which asks the content script to scrape the `document.body.innerText`, sends it to the AI, and returns the summary.
- [ ] Inject a floating button into the webpage when text is highlighted by the user.

## Phase 4: Core Features Implementation

_Objective: Build out the specific AI capabilities._

- [ ] **Feature:** Explain Selected Text (Uses the injected floating button).
- [ ] **Feature:** Translate Content (Popup or context menu feature).
- [ ] **Feature:** Contextual Question Answering (Allow user to ask arbitrary questions about the read page context).

## Phase 5: UI/UX & Polish

_Objective: Make it look professional and user-friendly._

- [ ] Design a clean, modern UI for the popup using CSS (animations, loading states, error handling).
- [ ] Design the floating tooltips injected onto the page to ensure they don't break the host website's layout (using Shadow DOM if necessary).
- [ ] Add nice vector icons and ensure responsive design.

## Phase 6: Testing & Publishing

_Objective: Prepare for the real world._

- [ ] Test the extension on various popular sites (Wikipedia, GitHub, Medium, Gmail) to ensure cross-site compatibility and handle edge cases (e.g., sites with strict CSP - Content Security Policy).
- [ ] Write the Privacy Policy (required for the Web Store).
- [ ] Create promotional assets (screenshots, promo banners).
- [ ] Submit to the Google Chrome Web Store.
