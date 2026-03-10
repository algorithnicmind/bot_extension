// Utility to render markdown
const renderMarkdown = (text) => {
	try {
		return marked.parse(text);
	} catch (_e) {
		console.warn("Marked not loaded, displaying raw text.");
		return text;
	}
};

document.addEventListener("DOMContentLoaded", () => {
	// DOM Elements
	const btnSummarize = document.getElementById("btnSummarize");
	const settingsBtn = document.getElementById("settingsBtn");
	const welcomeMsg = document.getElementById("welcomeMsg");
	const loader = document.getElementById("loader");
	const outputContainer = document.getElementById("outputContainer");

	// UI State Helpers
	const showLoader = () => {
		welcomeMsg.style.display = "none";
		outputContainer.innerHTML = "";
		loader.style.display = "block";
		btnSummarize.disabled = true;
	};

	const hideLoaderAndShowError = (errMessage) => {
		loader.style.display = "none";
		outputContainer.innerHTML = `
            <div class="error-msg">
                <strong>Error:</strong> ${errMessage} <br><br>
                <em>Hint: Did you open the settings (⚙️) and save your API Key?</em>
            </div>`;
		btnSummarize.disabled = false;
	};

	const displayResult = (markdownText) => {
		loader.style.display = "none";
		outputContainer.innerHTML = `
            <div class="message-bubble">
                ${renderMarkdown(markdownText)}
            </div>
        `;
		btnSummarize.disabled = false;
	};

	// ACTION: Open Settings
	settingsBtn.addEventListener("click", () => {
		chrome.runtime.sendMessage({ action: "openOptions" });
	});

	// Generalized function to run AI tasks
	async function runAITask(promptType, actionDescription, userPrompt = null) {
		showLoader();

		try {
			// Get Active Tab
			const [tab] = await chrome.tabs.query({
				active: true,
				currentWindow: true,
			});

			if (!tab || tab.url.startsWith("chrome://")) {
				hideLoaderAndShowError(
					"Cannot run on Chrome system pages or settings.",
				);
				return;
			}

			// Inject a content script natively to scrape page content
			const injectionResult = await chrome.scripting.executeScript({
				target: { tabId: tab.id },
				func: scrapePageContent,
			});

			// Handle scraped text
			const pageText = injectionResult[0].result;

			if (!pageText || pageText.length < 50) {
				hideLoaderAndShowError("Not enough text found on this page.");
				return;
			}

			const payload = {
				action: "askAI",
				promptType: promptType,
				actionDescription: actionDescription,
				text: pageText,
			};

			if (userPrompt) {
				payload.userPrompt = userPrompt;
			}

			// Send to Background script to query the AI Model securely
			chrome.runtime.sendMessage(payload, (response) => {
				if (chrome.runtime.lastError) {
					hideLoaderAndShowError(
						`Background script error: ${chrome.runtime.lastError.message}`,
					);
					return;
				}
				if (response?.error) {
					hideLoaderAndShowError(response.error);
				} else if (response?.result) {
					displayResult(response.result);
				} else {
					hideLoaderAndShowError(
						"Unknown error occurred while processing AI response.",
					);
				}
			});
		} catch (error) {
			hideLoaderAndShowError(`Failed to access page data: ${error.message}`);
		}
	}

	// ACTION: Summarize Page
	btnSummarize.addEventListener("click", () => {
		runAITask("summarize", "Summarize Document");
	});

	// ACTION: Translate Page
	document.getElementById("btnTranslate").addEventListener("click", () => {
		runAITask("translate", "Translate Document");
	});

	// ACTION: Explain Selected (Simplified for overall page if nothing selected, or context based)
	document.getElementById("btnExplain").addEventListener("click", () => {
		runAITask("explain_page", "Explain Document Concepts");
	});
	// Note: Explain Selected is mostly handled by the floating button directly in content.js,
	// but we can let it explain the general page concepts here if they click it.
	document.getElementById("btnExplain").disabled = false;
	document.getElementById("btnExplain").title =
		"Explain key concepts on this page";

	// ACTION: Contextual Chat
	const chatInput = document.getElementById("chatInput");
	const btnChat = document.getElementById("btnChat");

	btnChat.addEventListener("click", () => {
		const q = chatInput.value.trim();
		if (q) {
			runAITask("chat", "Chat about Document", q);
			chatInput.value = "";
		}
	});

	chatInput.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			btnChat.click();
		}
	});
});

// Note: This function runs IN THE CONTEXT OF THE WEBPAGE, isolated from the popup
function scrapePageContent() {
	// Basic scrape: get document body text
	// In advanced versions we could remove <nav>, <header>, <footer>, <scripts> first.
	return document.body.innerText.substring(0, 15000); // chunk it to save tokens
}
