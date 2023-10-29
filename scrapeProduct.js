// import puppeteer from 'puppeteer'
// import fs from 'fs'
const fs = require('fs')
const puppeteer = require('puppeteer')
const {strengthEquipmentCategories, weightsAndBarsCategories, conditioningCategories, gymStorageCategories, accessoriesCategories} = require('./categoriesArrays')

const scrapeSubCategory = require('./scrapeSubCategory')

const delay = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));
const testUrl = 'https://mirafit.co.uk/mirafit-m2-flat-weight-bench.html';
const subCategoryUrl = 'https://mirafit.co.uk/strength-equipment/weight-benches.html'
const categories = ['strength-equipment', 'weights-and-bars', 'conditioning', 'storage', 'accessories']
// const categories = ['strength-equipment']
const subCatObj = {
  'strength-equipment': strengthEquipmentCategories, 
  'weights-and-bars': weightsAndBarsCategories, 
  'conditioning': conditioningCategories, 
  'storage': gymStorageCategories, 
  'accessories': accessoriesCategories, 
}

const scrapeProduct = async (url) => {

  const baseUrl =`https://mirafit.co.uk`

  const subCatObjArr = []
  await delay(2000)
  // const browser = await puppeteer.launch({headless: false });
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // await page.goto(url); 
  // await delay(2000)
  // await page.click('button.amgdprcookie-button.-allow.-save[data-amgdprcookie-js="accept"]');
  // await delay(2000)

  const productObjArr = []

  // populates allProductUrlsArr with objects {category: string, subCat: string, productUrls: []}
  for (category of categories) {
    if (subCatObj[category]) {
      for(subCat of subCatObj[category]) {
        const subCatUrlObj = {category: category, subCat: subCat, productUrls:[]}
        const subCatUrl = `${baseUrl}/${category}/${subCat}.html`
        subCatUrlObj.productUrls = await scrapeSubCategory(subCatUrl, category, subCat)
        subCatObjArr.push(subCatUrlObj)
      }
    } else {
      const subCatUrlObj = {category: category, subCat: subCat, productUrls:[]}
      const subCatUrl = `${baseUrl}/${category}.html`
      subCatObj.productUrls = await scrapeSubCategory(subCatUrl, category)
      subCatObjArr.push(subCatUrlObj)
    }
  }

  console.log('scraping of categories for product urls complete')
  console.log(subCatObjArr, subCatObjArr.length, 'allProductUrlsArr')

  // fs.writeFileSync("./data.json", JSON.stringify(subCatObjArr, null, 4));
  //     console.log("File is created!");


  for (const subCategory of subCatObjArr) {
    if (subCategory.productUrls.length > 0) {
      for (const productUrl of subCategory.productUrls) {
          try {
          
          // await page.goto(productUrl.url);
          await page.goto(productUrl);
          await delay(3000)
          
          
          // Evaluate the page to extract the href attributes
          const productObj = await page.evaluate((subCategory) => {
      
            // const product = {category: subCategory.category, subCat: subCategory.subCat}
            const product = {
              category: subCategory.category,
              subCat: subCategory.subCat
            }
            
            const imgElements = Array.from(document.querySelectorAll('.fotorama__stage__frame.fotorama_vertical_ratio.fotorama__loaded.fotorama__loaded--img.fotorama__active'));
            product.img = imgElements.map(element => element.getAttribute('href'));
            console.log(product.img, 'img')
      
            const nameElement = document.querySelector('span.base[data-ui-id="page-title-wrapper"]');
            product.name = nameElement.textContent;
            console.log(product.name, 'name')
      
            const priceElement = document.querySelector('span.price');
            product.price = priceElement.textContent;
            console.log(product.price, 'price')

            const overviewOuterDiv = document.querySelector('div.product.attribute.overview');
            const overviewInnerDiv = overviewOuterDiv.querySelector('div.value');
            product.overview = overviewInnerDiv.textContent;
            console.log(product.overview, 'overview')
      
            const descriptionOuterDiv = document.querySelector('div.product.attribute.description');
            const descriptionUnorderedList = descriptionOuterDiv.querySelector('ul');
            const descriptionListItems = Array.from(descriptionUnorderedList.querySelectorAll('li'));
            product.description = descriptionListItems.map(item => item.textContent);
            console.log(product.description, 'description')

            const ratingElement = document.querySelector('p.amreview-summary');
            product.rating = ratingElement.textContent;
            console.log(product.rating, 'rating')

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
          }, subCategory);
          console.log('pushing', productObj, 'to productObjArr')
          productObjArr.push(productObj)

          
        } catch (error) {
          console.log(error)
        }




      }
    }
  }
  fs.writeFileSync("./productData.json", JSON.stringify(productObjArr, null, 4));
      console.log("File is created!");

  await browser.close();


  


  // for(const productUrls of allProductUrlsArr) {
  //   if (productUrls.productUrls.length > 0) {

  //     for (const productUrl of productUrls.productUrls) {
  //       console.log(productUrl, '!!!!!!!!')

  //       try {
          
  //         // await page.goto(productUrl.url);
  //         await page.goto(productUrl);
  //         await delay(3000)
          
          
  //         // Evaluate the page to extract the href attributes
  //         const productObj = await page.evaluate(() => {
      
  //           const product = {category: productUrls.category, subCat: productUrls.subCat}
  //           // const product = {}
  //           const imgElements = Array.from(document.querySelectorAll('.fotorama__stage__frame.fotorama_vertical_ratio.fotorama__loaded.fotorama__loaded--img.fotorama__active'));
  //           product.img = imgElements.map(element => element.getAttribute('href'));
  //           console.log(product.img, 'img')
      
  //           const nameElement = document.querySelector('span.base[data-ui-id="page-title-wrapper"]');
  //           product.name = nameElement.textContent;
  //           console.log(product.name, 'name')
      
  //           const priceElement = document.querySelector('span.price');
  //           product.price = priceElement.textContent;
  //           console.log(product.price, 'price')

  //           const overviewOuterDiv = document.querySelector('div.product.attribute.overview');
  //           const overviewInnerDiv = overviewOuterDiv.querySelector('div.value');
  //           product.overview = overviewInnerDiv.textContent;
  //           console.log(product.overview, 'overview')
      
  //           const descriptionOuterDiv = document.querySelector('div.product.attribute.description');
  //           const descriptionUnorderedList = descriptionOuterDiv.querySelector('ul');
  //           const descriptionListItems = Array.from(descriptionUnorderedList.querySelectorAll('li'));
  //           product.description = descriptionListItems.map(item => item.textContent);
  //           console.log(product.description, 'description')

  //           const ratingElement = document.querySelector('p.amreview-summary');
  //           product.rating = ratingElement.textContent;
  //           console.log(product.rating, 'rating')

  //           const reviewsOrderedListItems = Array.from(document.querySelectorAll('ol.items.amreview-review-items li'));

  //           product.reviews = reviewsOrderedListItems.map(listItem => {
  //             const author = listItem.querySelector('p.amreview-author').textContent;
  //             const date = listItem.querySelector('time[itemprop="datePublished"]').textContent;
  //             const title = listItem.querySelector('span.amreview-title-review').textContent;
  //             const rating = listItem.querySelector('span[itemprop="ratingValue"]').textContent;
  //             const body = listItem.querySelector('span.amreview-text.amshowmore-text.-active').textContent;
        
  //             return {
  //               author,
  //               date,
  //               title,
  //               rating,
  //               body,
  //             };
  //           });
      
  //           console.log(product.reviews, 'reviews')
  //           return product
  //         });
  //         console.log('pushing', productObj, 'to productObjArr')
  //         productObjArr.push(productObj)
          
  //       } catch (error) {
  //         console.log(error)
  //       }
  //     }
  //   }
  // }
  // await browser.close();

  // console.log('productObjArr'. productObjArr)
  
  // fs.writeFileSync("./productData.json", JSON.stringify(productObjArr, null, 4));
  //     console.log("File is created!");
};

scrapeProduct(testUrl)



{/* <button class="amgdprcookie-button -allow -save" data-amgdprcookie-js="accept">Accept Cookies</button> */}
