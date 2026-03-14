
import { handleAIRequest } from "../utils/api.js";

// Basic background worker
console.log("AI Background Assistant started.");

// Create context menus on installation
chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "summarizeText",
		title: "Summarize Selection",
		contexts: ["selection"],
	});
	chrome.contextMenus.create({
		id: "explainText",
		title: "Explain Selection",
		contexts: ["selection"],
	});
	chrome.contextMenus.create({
		id: "translateText",
		title: "Translate Selection",
		contexts: ["selection"],
	});
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === "summarizeText" || info.menuItemId === "explainText" || info.menuItemId === "translateText") {
		const type = info.menuItemId === "summarizeText" ? "summarize" : (info.menuItemId === "explainText" ? "explain" : "translate");
		
		// Send message to content script to show the UI
		chrome.tabs.sendMessage(tab.id, {
			action: "showAIResponse",
			text: info.selectionText,
			type: type
		});
	}
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
	if (request.action === "askAI") {
		const { text, promptType, actionDescription, userPrompt } = request;

		console.log(`Received request to: ${actionDescription}`);

		// Get API key from storage before making request
		chrome.storage.local.get(["apiKey", "provider"], (result) => {
			if (!result.apiKey) {
				sendResponse({
					error:
						"API key not found. Please set your key in the extension options.",
				});
				return;
			}

			console.log(`Using AI Provider: ${result.provider}`);

			// We use an async wrapper to let the event listener return true
			handleAIRequest(
				result.provider,
				result.apiKey,
				text,
				promptType,
				userPrompt,
			)
				.then((aiResponse) => {
					sendResponse({ result: aiResponse });
				})
				.catch((error) => {
					console.error("AI Request Error:", error);
					sendResponse({ error: error.toString() });
				});
		});

		// Return true indicates we wish to send a response asynchronously
		return true;
	}

	if (request.action === "openOptions") {
		if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		} else {
			window.open(chrome.runtime.getURL("src/options/options.html"));
		}
		sendResponse({ success: true });
		return false;
	}
});
