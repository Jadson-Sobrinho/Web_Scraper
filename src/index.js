const puppeteer = require('puppeteer');
const fs = require('fs');

async function ScrapeCarrefourDrinks(){
    
    /*Tirar a abertura do navegador e o slowmotion quando enviar*/
    const browser = await puppeteer.launch({ headless: false, slowMo: 100 });
    const page = await browser.newPage();

    try {

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

    
        fs.writeFileSync('./src/output.json', JSON.stringify(products, null, 2));
        //console.log(products);
        console.log("ok");
    } catch(e) {

        console.log("Erro", e);

    } finally{

        await browser.close();
    }
    
};

ScrapeCarrefourDrinks();

