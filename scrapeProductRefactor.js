// import puppeteer from 'puppeteer'
// import fs from 'fs'
const fs = require('fs')
const puppeteer = require('puppeteer')

const delay = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));
const testUrl = 'https://mirafit.co.uk/mirafit-m2-flat-weight-bench.html';


const scrapeProduct = async (url) => {
    try {
    const browser = await puppeteer.launch({headless: false });
    const page = await browser.newPage();
  
    // Replace with the URL of your website
    
    await page.goto(url);
    await delay(2000)
    await page.click('button.amgdprcookie-button.-allow.-save[data-amgdprcookie-js="accept"]');
    
    // Evaluate the page to extract the href attributes
    const productObj = await page.evaluate(() => {

      const product = {}
      const imgElements = Array.from(document.querySelectorAll('.fotorama__stage__frame.fotorama_vertical_ratio.fotorama__loaded.fotorama__loaded--img.fotorama__active'));
      product.img = imgElements.map(element => element.getAttribute('href'));

      const nameElement = document.querySelector('span.base[data-ui-id="page-title-wrapper"]');
      product.name = nameElement.textContent;

      const priceElement = document.querySelector('span.price');
      product.price = priceElement.textContent;

      const overviewOuterDiv = document.querySelector('div.product.attribute.overview');
      const overviewInnerDiv = overviewOuterDiv.querySelector('div.value');
      product.overview = overviewInnerDiv.textContent;

      const descriptionOuterDiv = document.querySelector('div.product.attribute.description');
      const descriptionUnorderedList = descriptionOuterDiv.querySelector('ul');
      const descriptionListItems = Array.from(descriptionUnorderedList.querySelectorAll('li'));
      product.description = descriptionListItems.map(item => item.textContent);

      const ratingElement = document.querySelector('p.amreview-summary');
      product.rating = ratingElement.textContent;

      const reviewsOrderedListItems = Array.from(document.querySelectorAll('ol.items.amreview-review-items li'));
      product.reviews = reviewsOrderedListItems.map(listItem => {
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

      return product
    });
    
    

    await page.click('.fotorama__arr.fotorama__arr--next');
    await delay()


    
    
    fs.writeFileSync("./data.json", JSON.stringify(productObj));
        console.log("File is created!");
  
    await browser.close();
    } catch (error) {
        console.log(error)
    }
  };

scrapeProduct(testUrl)



{/* <button class="amgdprcookie-button -allow -save" data-amgdprcookie-js="accept">Accept Cookies</button> */}
