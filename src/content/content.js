// Mitra AI Content Script Payload
// Will be injected onto web pages to detect highlights, spawn floating buttons, etc.

console.log("Mitra AI Content Script loaded");

let floatingBtn = null;
let currentSelectedText = "";
let tooltipBox = null;

document.addEventListener("mouseup", function (e) {
	// Small delay to allow selection to register
	setTimeout(() => {
		let selectedText = window.getSelection().toString().trim();
		if (selectedText.length > 5) {
			currentSelectedText = selectedText;
			showFloatingButton(e.pageX, e.pageY);
		} else {
			hideFloatingButton();
		}
	}, 10);
});

// Hide on mousedown if clicking elsewhere
document.addEventListener("mousedown", function(e) {
    if (floatingBtn && !floatingBtn.contains(e.target) && tooltipBox && !tooltipBox.contains(e.target)) {
        hideFloatingButton();
        if (tooltipBox) tooltipBox.style.display = "none";
    }
});

function showFloatingButton(x, y) {
	if (!floatingBtn) {
		floatingBtn = document.createElement("button");
		floatingBtn.className = "mitra-ai-floating-btn";
		floatingBtn.innerText = "✨ Ask AI";
		floatingBtn.onclick = handleFloatingClick;
		document.body.appendChild(floatingBtn);
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

	let originalText = floatingBtn.innerText;
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
				showTooltip("Error: " + chrome.runtime.lastError.message, e.pageX, e.pageY);
				return;
			}
			if (response && response.error) {
				showTooltip("Error: " + response.error, e.pageX, e.pageY);
			} else if (response && response.result) {
				showTooltip(response.result, e.pageX, e.pageY);
			} else {
				showTooltip("Unknown error occurred.", e.pageX, e.pageY);
			}
		}
	);
}

function showTooltip(text, x, y) {
	if (!tooltipBox) {
		tooltipBox = document.createElement("div");
		tooltipBox.className = "mitra-ai-tooltip";

		const closeBtn = document.createElement("button");
		closeBtn.innerText = "×";
		closeBtn.className = "mitra-ai-tooltip-close";
		closeBtn.onclick = () => {
			tooltipBox.style.display = "none";
		};

		tooltipBox.appendChild(closeBtn);

		const content = document.createElement("div");
		content.className = "mitra-ai-tooltip-content";
		tooltipBox.appendChild(content);

		document.body.appendChild(tooltipBox);
	}

	// Basic formatting for Markdown-like response
    const formattedText = text.replace(/\n\n/g, '<br><br>').replace(/\n/g, ' ');
	tooltipBox.querySelector(".mitra-ai-tooltip-content").innerHTML = formattedText;
	
    // Ensure it doesn't flow off the screen
    const tooltipWidth = 300;
	tooltipBox.style.left = Math.min(x, window.innerWidth - tooltipWidth - 20) + "px";
	tooltipBox.style.top = (parseInt(y, 10) + 30) + "px";
	tooltipBox.style.display = "block";
}
