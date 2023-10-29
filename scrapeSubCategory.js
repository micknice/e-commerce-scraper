const fs = require('fs')
const puppeteer = require('puppeteer')

const delay = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));
const productUrl = 'https://mirafit.co.uk/mirafit-m2-flat-weight-bench.html';
const categoryUrl = 'https://mirafit.co.uk/strength-equipment/weight-benches.html'
const scrapeProduct = require('./scrapeProduct');

const scrapeSubCategory = async (url, category, subcategory=null) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
      
        await page.goto(url); 
        await page.click('button.amgdprcookie-button.-allow.-save[data-amgdprcookie-js="accept"]');
      
        // Evaluate page, scrape href attributes from the <a> tags in OL
        const hrefs = await page.evaluate(() => {
          const anchors = document.querySelectorAll('ol.products.list.items.product-items.itemgrid li.item a.product.photo.product-item-photo');
          const hrefArray = Array.from(anchors).map(a => a.getAttribute('href'));
          return hrefArray;
        });
      
        await browser.close();
        return hrefs
        
    } catch (error) {
        console.log('subCategory Scrape error:', error)
    }
  };

module.exports = scrapeSubCategory

