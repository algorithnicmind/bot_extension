importScripts("../../assets/lib/marked.umd.js");

// Basic background worker
console.log("AI Background Assistant started.");

// Keep track of any open popup or state if needed
// (State can be added here if background needs to maintain memory across interactions)

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

/**
 * Handle making actual API requests natively using Google Gemini
 * Note: You can expand this generic function to route to OpenAI / Claude based on state later.
 */
async function handleAIRequest(
	provider,
	apiKey,
	contextText,
	type,
	userPrompt = null,
) {
	// Construct the actual prompt based on user request and our standard 5_api_prompts list
	let systemInstruction = "";

	switch (type) {
		case "summarize":
			systemInstruction =
				"You are a highly intelligent and concise reading assistant. Your task is to summarize the provided webpage text. Extract the most critical points, the central thesis, and any key actionable takeaways. Format your response using bullet points for readability. Ignore any navigational text, ads, or cookie banners that may have been accidentally included in the text. Keep the summary under 500 words.";
			break;
		case "explain":
			systemInstruction =
				"You are a knowledgeable and patient teacher. The user has highlighted a specific piece of text from an article they are reading. Your task is to explain the highlighted text simply and clearly. Break down any complex jargon or technical terms. If helpful to understanding, provide a short analogy. Keep your explanation brief, within 2-3 short paragraphs.";
			break;
		case "translate":
			systemInstruction =
				"You are a master translator. Detect the original language of the provided text, and accurately translate the core content into English. If it is already in English, translate it to Spanish. Preserve the original meaning and tone.";
			break;
		case "explain_page":
			systemInstruction =
				"You are an expert tutor. Formulate a list of the key concepts and jargon present in this text, and explain each of them clearly.";
			break;
		case "chat":
			systemInstruction =
				"You are an AI sidekick attached to the user's browser. The user has provided the text of the current webpage they are looking at as context. Answer the user's question directly based on the provided text context. Do not invent new facts. If the answer is not in the context, tell the user.";
			break;
		default:
			systemInstruction =
				"You are a helpful AI assistant. Answer the user's question clearly and concisely based on the context provided.";
	}

	let userMessage = contextText;

	if (type === "chat" && userPrompt) {
		// If it's a chat type, the user message is the active question + the context
		userMessage = `Question: ${userPrompt}\n\nContext:\n${contextText}`;
	}

	// Route request based on chosen provider
	if (provider === "gemini") {
		return await callGeminiAPI(apiKey, systemInstruction, userMessage);
	} else if (provider === "openai") {
		return await callOpenAI(apiKey, systemInstruction, userMessage);
	} else if (provider === "anthropic") {
		return await callAnthropic(apiKey, systemInstruction, userMessage);
	} else {
		throw new Error(
			"Unsupported AI Provider Selected. Please check Options page.",
		);
	}
}

async function callGeminiAPI(apiKey, systemInstruction, userMessage) {
	const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

	const body = {
		system_instruction: {
			parts: { text: systemInstruction },
		},
		contents: [
			{
				parts: [{ text: userMessage }],
			},
		],
	};

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const errMsg = await response.text();
		throw new Error(`Gemini API Error: ${response.status} - ${errMsg}`);
	}

	const data = await response.json();

	if (data?.candidates?.length > 0) {
		return data.candidates[0].content.parts[0].text;
	} else {
		throw new Error("Unexpected response format from Gemini API.");
	}
}

// Stubs for future integrations
async function callOpenAI(apiKey, systemInstruction, userMessage) {
	const url = "https://api.openai.com/v1/chat/completions";
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model: "gpt-4o-mini", // fast model
			messages: [
				{ role: "system", content: systemInstruction },
				{ role: "user", content: userMessage },
			],
			temperature: 0.7,
		}),
	});

	if (!response.ok) {
		throw new Error(`OpenAI API Error: ${response.statusText}`);
	}
	const data = await response.json();
	return data.choices[0].message.content;
}

async function callAnthropic(apiKey, systemInstruction, userMessage) {
	const url = "https://api.anthropic.com/v1/messages";
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"x-api-key": apiKey,
			"anthropic-version": "2023-06-01",
			"content-type": "application/json",
		},
		body: JSON.stringify({
			model: "claude-3-haiku-20240307",
			max_tokens: 1024,
			system: systemInstruction,
			messages: [{ role: "user", content: userMessage }],
		}),
	});

	if (!response.ok) {
		throw new Error(`Claude API Error: ${response.statusText}`);
	}
	const data = await response.json();
	return data.content[0].text;
}
