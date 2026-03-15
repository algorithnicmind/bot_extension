const path = require('node:path');
const { chromium } = require('playwright');
(async () => {
    console.log("Starting Playwright...");
    const browser = await chromium.launch({headless: true});
    const page = await browser.newPage();
    const url = `file:///${path.resolve('test.html').replace(/\\/g, '/')}`;
    console.log("Navigating to", url);
    await page.goto(url);
    
    // Select the text
    console.log("Selecting text...");
    await page.evaluate(() => {
        const p = document.querySelector('p');
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(p);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Dispatch mouseup with coordinates
        const event = new MouseEvent('mouseup', { bubbles: true, pageX: 100, pageY: 100 });
        document.dispatchEvent(event);
    });

    await page.waitForTimeout(500); // Wait for specific setTimeout(..., 10)
    
    // Inspect shadow host
    const shadowHost = await page.$('#ai-assistant-shadow-host');
    if (!shadowHost) {
        console.log('Shadow Host NOT injected.');
    } else {
        const btnVisible = await page.evaluate(() => {
            const host = document.querySelector('#ai-assistant-shadow-host');
            const btn = host.shadowRoot.querySelector('.ai-assistant-floating-btn');
            return btn ? btn.style.display : 'not found';
        });
        console.log('Floating button display:', btnVisible);
        
        const hostPosition = await page.evaluate(() => {
            const host = document.querySelector('#ai-assistant-shadow-host');
            return host.style.cssText;
        });
        console.log('Host internal CSS text:', hostPosition);
    }
    
    await browser.close();
})();
