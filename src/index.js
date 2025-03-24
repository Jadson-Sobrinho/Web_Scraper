const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    
    /*Tirar a abertura do navegador e o slowmotion quando enviar*/
    const browser = await puppeteer.launch({ headless: false, slowMo: 100 });
    const page = await browser.newPage();

    
    await page.goto('https://mercado.carrefour.com.br/bebidas', { waitUntil: 'load' });
    await page.waitForSelector('[data-product-card-content="true"]', { timeout: 60000 });

 
    const products = await page.evaluate(() => {

        const productsList = document.querySelectorAll('[data-product-card-content="true"]');
    
        return Array.from(productsList).map(product => {
            return {
                nome: product.querySelector('[data-testid="product-link"]')?.innerText.trim() || 'Nome não encontrado',
                preco: product.querySelector('[data-test-id="price"]')?.innerText.trim() || 'Preço não encontrado',
                link: product.querySelector('[data-testid="product-link"]')?.href || 'Link não encontrado'
            };
        });
    });

  
    console.log('Produtos encontrados:', products);

    await browser.close();

    
})();

