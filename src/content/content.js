// Mitra AI Content Script Payload
// Will be injected onto web pages to detect highlights, spawn floating buttons, etc.

console.log("Mitra AI Content Script loaded");

// Example: Listen for selected text on the DOM
document.addEventListener('mouseup', function() {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 5) {
        // We can spawn a floating tooltip here
        console.log("User selected text:", selectedText);
    }
});
