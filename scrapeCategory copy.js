const fs = require('fs')
const puppeteer = require('puppeteer')

const delay = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));
const productUrl = 'https://mirafit.co.uk/mirafit-m2-flat-weight-bench.html';
const categoryUrl = 'https://mirafit.co.uk/strength-equipment/weight-benches.html'
const scrapeProduct = require('./scrapeProduct');

const scrapeCategory = async (url) => {
    try {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
      
        await page.goto(url); 
        await page.click('button.amgdprcookie-button.-allow.-save[data-amgdprcookie-js="accept"]');
      
        // Evaluate page, scrape href attributes from the <a> tags in OL
        const hrefs = await page.evaluate(() => {
          const anchors = document.querySelectorAll('ol.products.list.items.product-items.itemgrid li.item a.product.photo.product-item-photo');
          const hrefArray = Array.from(anchors).map(a => a.getAttribute('href'));
          return hrefArray;
        });

        productsArr = []
        //iterate over hrefs and scrape product info from each
        for(productToScrape of hrefs) {
            const product = await scrapeProduct(productToScrape)
            console.log(product, 'product')
            productsArr.push(product)
        }
        
        // individual product scraping 







        fs.writeFileSync(`./products.json`, JSON.stringify(productsArr));
        console.log("File is created!");

      
        // Close the Puppeteer browser
        await browser.close();
      
        
    } catch (error) {
        console.log(error)
    }
  };

// scrapeCategory(categoryUrl)

moddule.ex

