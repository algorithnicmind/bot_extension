let shadowHost = null;
let shadowRoot = null;
let floatingBtn = null;
let tooltipBox = null;
let currentSelectedText = "";

// Listen for messages from background (e.g., from context menu)
chrome.runtime.onMessage.addListener((request) => {
	if (request.action === "showAIResponse") {
		const { text, type } = request;
		showFloatingButton(window.innerWidth / 2, window.innerHeight / 2, true);

		// Map type to display text
		const descriptions = {
			summarize: "Summarizing Selection...",
			explain: "Explaining Selection...",
			translate: "Translating Selection...",
		};

		floatingBtn.innerText = `⏳ ${descriptions[type] || "Thinking..."}`;
		floatingBtn.disabled = true;

		chrome.runtime.sendMessage(
			{
				action: "askAI",
				promptType: type,
				actionDescription: descriptions[type] || "AI Action",
				text: text,
			},
			(response) => {
				floatingBtn.innerText = "✨ Ask AI";
				floatingBtn.disabled = false;
				hideFloatingButton();

				if (response?.result) {
					showTooltip(
						response.result,
						window.innerWidth / 2 - 150,
						window.innerHeight / 2 - 100,
					);
				} else {
					showTooltip(
						response?.error || "Error processing request",
						window.innerWidth / 2 - 150,
						window.innerHeight / 2 - 100,
					);
				}
			},
		);
	}
});

function initShadowDOM() {
	if (!shadowHost) {
		shadowHost = document.createElement("div");
		shadowHost.id = "ai-assistant-shadow-host";
		// Ensure it sits on top of everything and doesn't interfere with layout
		shadowHost.style.cssText =
			"position: absolute; top: 0; left: 0; width: 0; height: 0; overflow: visible; z-index: 2147483647;";
		document.body.appendChild(shadowHost);

		shadowRoot = shadowHost.attachShadow({ mode: "closed" });

		const style = document.createElement("style");
		style.textContent = `
			.ai-assistant-floating-btn {
				position: absolute;
				z-index: 2147483647;
				background: #6366f1;
				color: white;
				padding: 8px 12px;
				border-radius: 8px;
				box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
				cursor: pointer;
				font-family: 'Inter', -apple-system, sans-serif;
				font-size: 14px;
				border: none;
				transition: transform 0.2s;
			}
			.ai-assistant-floating-btn:hover {
				transform: scale(1.05);
			}
			.ai-assistant-tooltip {
				position: absolute;
				z-index: 2147483647;
				background: #ffffff;
				color: #1e293b;
				padding: 16px;
				border-radius: 8px;
				box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
				font-family: Arial, sans-serif;
				font-size: 14px;
				border: 1px solid #e2e8f0;
				width: 300px;
				max-height: 400px;
				overflow-y: auto;
				line-height: 1.5;
			}
			.ai-assistant-tooltip-close {
				position: absolute;
				top: 8px;
				right: 8px;
				background: none;
				border: none;
				font-size: 18px;
				cursor: pointer;
				color: #64748b;
			}
			.ai-assistant-tooltip-close:hover {
				color: #ef4444;
			}
			.ai-assistant-tooltip-content {
				margin-top: 10px;
			}
            .ai-assistant-error {
                color: #b91c1c;
            }
		`;
		shadowRoot.appendChild(style);
	}
}

document.addEventListener("mouseup", (e) => {
	// Small delay to allow selection to register
	setTimeout(() => {
		const selectedText = window.getSelection().toString().trim();
		if (selectedText.length > 5) {
			currentSelectedText = selectedText;
			showFloatingButton(e.pageX, e.pageY);
		} else {
			hideFloatingButton();
		}
	}, 10);
});

// Hide on mousedown if clicking elsewhere
document.addEventListener("mousedown", (e) => {
	// If click is not inside shadowRoot, then hide
	if (shadowRoot) {
		const path = e.composedPath();
		if (
			floatingBtn &&
			!path.includes(floatingBtn) &&
			tooltipBox &&
			!path.includes(tooltipBox)
		) {
			hideFloatingButton();
			if (tooltipBox) tooltipBox.style.display = "none";
		}
	}
});

function showFloatingButton(x, y) {
	initShadowDOM();

	if (!floatingBtn) {
		floatingBtn = document.createElement("button");
		floatingBtn.className = "ai-assistant-floating-btn";
		floatingBtn.innerText = "✨ Ask AI";
		floatingBtn.onclick = handleFloatingClick;
		shadowRoot.appendChild(floatingBtn);
	}

	floatingBtn.style.left = `${x + 10}px`;
	floatingBtn.style.top = `${y + 10}px`;
	floatingBtn.style.display = "block";
}

function hideFloatingButton() {
	if (floatingBtn) {
		floatingBtn.style.display = "none";
	}
}

function handleFloatingClick(e) {
	e.stopPropagation();
	if (!currentSelectedText) return;

	const originalText = floatingBtn.innerText;
	floatingBtn.innerText = "⏳ Thinking...";
	floatingBtn.disabled = true;

	chrome.runtime.sendMessage(
		{
			action: "askAI",
			promptType: "explain",
			actionDescription: "Explain Text",
			text: currentSelectedText,
		},
		(response) => {
			floatingBtn.innerText = originalText;
			floatingBtn.disabled = false;
			hideFloatingButton();

			if (chrome.runtime.lastError) {
				showTooltip(
					`<span class='ai-assistant-error'>Error: ${chrome.runtime.lastError.message}</span>`,
					e.pageX,
					e.pageY,
				);
				return;
			}
			if (response?.error) {
				showTooltip(
					"<span class='ai-assistant-error'>Error: " +
						response.error +
						"</span>",
					e.pageX,
					e.pageY,
				);
			} else if (response?.result) {
				showTooltip(response.result, e.pageX, e.pageY);
			} else {
				showTooltip(
					"<span class='ai-assistant-error'>Unknown error occurred.</span>",
					e.pageX,
					e.pageY,
				);
			}
		},
	);
}

function showTooltip(text, x, y) {
	initShadowDOM();

	if (!tooltipBox) {
		tooltipBox = document.createElement("div");
		tooltipBox.className = "ai-assistant-tooltip";

		const closeBtn = document.createElement("button");
		closeBtn.innerText = "×";
		closeBtn.className = "ai-assistant-tooltip-close";
		closeBtn.onclick = () => {
			tooltipBox.style.display = "none";
		};

		tooltipBox.appendChild(closeBtn);

		const content = document.createElement("div");
		content.className = "ai-assistant-tooltip-content";
		tooltipBox.appendChild(content);

		shadowRoot.appendChild(tooltipBox);
	}

	// Basic formatting for Markdown-like response
	const formattedText = text.replace(/\n\n/g, "<br><br>").replace(/\n/g, " ");
	tooltipBox.querySelector(".ai-assistant-tooltip-content").innerHTML =
		formattedText;

	// Ensure it doesn't flow off the screen
	const tooltipWidth = 300;
	tooltipBox.style.left = `${Math.min(x, window.innerWidth - tooltipWidth - 20)}px`;
	tooltipBox.style.top = `${parseInt(y, 10) + 30}px`;
	tooltipBox.style.display = "block";
}
