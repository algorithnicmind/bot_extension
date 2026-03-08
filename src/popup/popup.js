// Utility to render markdown
const renderMarkdown = (text) => {
	try {
		return marked.parse(text);
	} catch (e) {
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

	// ACTION: Summarize Page
	btnSummarize.addEventListener("click", async () => {
		showLoader();

		try {
			// Get Active Tab
			let [tab] = await chrome.tabs.query({
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
			let injectionResult = await chrome.scripting.executeScript({
				target: { tabId: tab.id },
				func: scrapePageContent,
			});

			// Handle scraped text
			const pageText = injectionResult[0].result;

			if (!pageText || pageText.length < 50) {
				hideLoaderAndShowError(
					"Not enough text found on this page to summarize.",
				);
				return;
			}

			// Send to Background script to query the AI Model securely
			chrome.runtime.sendMessage(
				{
					action: "askAI",
					promptType: "summarize",
					actionDescription: "Summarize Document",
					text: pageText,
				},
				(response) => {
					if (chrome.runtime.lastError) {
						hideLoaderAndShowError(
							"Background script error: " + chrome.runtime.lastError.message,
						);
						return;
					}
					if (response && response.error) {
						hideLoaderAndShowError(response.error);
					} else if (response && response.result) {
						displayResult(response.result);
					} else {
						hideLoaderAndShowError(
							"Unknown error occurred while processing AI response.",
						);
					}
				},
			);
		} catch (error) {
			hideLoaderAndShowError("Failed to access page data: " + error.message);
		}
	});
});

// Note: This function runs IN THE CONTEXT OF THE WEBPAGE, isolated from the popup
function scrapePageContent() {
	// Basic scrape: get document body text
	// In advanced versions we could remove <nav>, <header>, <footer>, <scripts> first.
	return document.body.innerText.substring(0, 15000); // chunk it to save tokens
}
