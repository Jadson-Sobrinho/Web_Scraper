const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    
    /*Tirar a abertura do navegador e o slowmotion quando enviar*/
    const browser = await puppeteer.launch({ headless: false, slowMo: 100 });
    const page = await browser.newPage();

    
    await page.goto('https://mercado.carrefour.com.br/bebidas', { waitUntil: 'load' });
    await page.waitForSelector('[data-product-card-content="true"]', { timeout: 60000 });
    await browser.close();

    
})();
