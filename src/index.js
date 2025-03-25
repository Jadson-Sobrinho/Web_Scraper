const puppeteer = require('puppeteer');
const fs = require('fs');

async function ScrapeCarrefourDrinks(){
    
    /*Tirar a abertura do navegador e o slowmotion quando enviar*/
    const browser = await puppeteer.launch({ headless: false, slowMo: 200 });
    const page = await browser.newPage();
    const allProducts = [];
    let currentPage = 1;

    try {

        await page.goto('https://mercado.carrefour.com.br/bebidas', { waitUntil: 'load' });
        
        while (true) {
            await page.waitForSelector('[data-product-card-content="true"]', { timeout: 60000 });

        
            const products = await page.evaluate(async () => {
        /* Caso o site não seja dinamico
        *
        *       window.scrollTo(0, document.body.scrollHeight);
        */

          
                for (let i = 0; i < 4; i++) {  // Rola 4 vezes

                    window.scrollBy(0, window.innerHeight); // Rola uma tela de cada vez
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1s para carregar

                } 
         

                const productsList = document.querySelectorAll('[data-product-card-content="true"]');
            
                return Array.from(productsList).map(product => {
                        return {
                            nome: product.querySelector('[data-testid="product-link"]')?.innerText.trim() || 'Nome não encontrado',
                            preco: product.querySelector('[data-test-id="price"]')?.innerText.trim() || 'Preço não encontrado',
                            link: product.querySelector('[data-testid="product-link"]')?.href || 'Link não encontrado'
                        };
                    });
                });

                allProducts.push(...products);
                console.log(`Página ${currentPage} coletada!`);

           // Verifica se há um botão de próxima página
           const nextPageButton = await page.$('a[href*="page="]');
           if (!nextPageButton) {
               console.log('🚀 Fim da paginação.');
               break;
           }

           // Obtém a URL da próxima página
           const nextPageUrl = await page.evaluate(button => button.href, nextPageButton);
           console.log(`🔄 Indo para a página ${currentPage + 1}...`);

            if (!nextPageUrl) {
                console.log('Fim da paginação.');
                break;
            }
    
            // Navega para a próxima página
            await page.goto(nextPageUrl, { waitUntil: 'load' });
            currentPage++;

            //if(currentPage == 5) break;

        }

        fs.writeFileSync('./src/output.json', JSON.stringify(allProducts, null, 2));
        console.log(`Extração concluída! ${allProducts.length} produtos coletados.`)
        //console.log(products);
        console.log("ok");

    } catch(e) {

        console.log("Erro", e);

    } finally{

        await browser.close();
    }
    
};

ScrapeCarrefourDrinks();

