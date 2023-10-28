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

          await page.goto(productToScrape);
          await delay(5000)
          // await page.click('button.amgdprcookie-button.-allow.-save[data-amgdprcookie-js="accept"]');
          const product = {}
          // Evaluate the page to extract the href attributes
          product.img = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('.fotorama__stage__frame.fotorama_vertical_ratio.fotorama__loaded.fotorama__loaded--img.fotorama__active'));
            return elements.map(element => element.getAttribute('href'));
          });
          product.name = await page.evaluate(() => {
              const element = document.querySelector('span.base[data-ui-id="page-title-wrapper"]');
              return element.textContent;
          });
          product.price = await page.evaluate(() => {
              const element = document.querySelector('span.price');
              return element.textContent;
          });
          product.overview = await page.evaluate(() => {
              const outerDiv = document.querySelector('div.product.attribute.overview');
              const innerDiv = outerDiv.querySelector('div.value');
              return innerDiv.textContent;
          });
          product.description = await page.evaluate(() => {
              const outerDiv = document.querySelector('div.product.attribute.description');
              const unorderedList = outerDiv.querySelector('ul');
              const listItems = Array.from(unorderedList.querySelectorAll('li'));
              return listItems.map(item => item.textContent);
          });
          product.rating = await page.evaluate(() => {
              const element = document.querySelector('p.amreview-summary');
              return element.textContent;
          });
          product.reviews = await page.evaluate(() => {
              const orderedListItems = Array.from(document.querySelectorAll('ol.items.amreview-review-items li'));
              
              const scrapedData = orderedListItems.map(listItem => {
                const author = listItem.querySelector('p.amreview-author').textContent;
                const date = listItem.querySelector('time[itemprop="datePublished"]').textContent;
                const title = listItem.querySelector('span.amreview-title-review').textContent;
                const rating = listItem.querySelector('span[itemprop="ratingValue"]').textContent;
                const body = listItem.querySelector('span.amreview-text.amshowmore-text.-active').textContent;
          
                return {
                  author,
                  date,
                  title,
                  rating,
                  body,
                };
              });
          
              return scrapedData;
            });



            productsArr.push(product)
          
      }
        



        fs.writeFileSync(`./products.json`, JSON.stringify(productsArr));
        console.log("File is created!");

      
        // Close the Puppeteer browser
        await browser.close();
      
        
    } catch (error) {
        console.log(error)
    }
  };

scrapeCategory(categoryUrl)



