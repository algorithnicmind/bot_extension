// Helper texts for different providers
const helperTexts = {
	gemini:
		'Get your Gemini key <a href="https://aistudio.google.com/app/apikey" target="_blank">here</a>.',
	openai:
		'Get your OpenAI key <a href="https://platform.openai.com/api-keys" target="_blank">here</a>.',
	anthropic:
		'Get your Anthropic key <a href="https://console.anthropic.com/settings/keys" target="_blank">here</a>.',
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("saveBtn").addEventListener("click", saveOptions);
document
	.getElementById("provider")
	.addEventListener("change", updateHelperText);

// Saves options to chrome.storage
function saveOptions() {
	const provider = document.getElementById("provider").value;
	const apiKey = document.getElementById("apiKey").value;

	chrome.storage.local.set({ provider, apiKey }, () => {
		// Update status to let user know options were saved.
		const status = document.getElementById("status");
		status.textContent = "Settings saved successfully!";
		status.className = "status-message success";

		setTimeout(() => {
			status.className = "status-message";
			setTimeout(() => (status.textContent = ""), 300); // clear after fade
		}, 3000);
	});
}

// Restores select box and input field state using the preferences
// stored in chrome.storage.
function restoreOptions() {
	chrome.storage.local.get({ provider: "gemini", apiKey: "" }, (items) => {
		document.getElementById("provider").value = items.provider;
		document.getElementById("apiKey").value = items.apiKey;
		updateHelperText();
	});
}

// Update helper link when provider changes
function updateHelperText() {
	const provider = document.getElementById("provider").value;
	document.getElementById("keyHelperText").innerHTML =
		helperTexts[provider] || helperTexts.gemini;
}
