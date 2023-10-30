const puppeteer = require('puppeteer');
const fs = require('fs');
const {formatProductImgName, extractTextFromUrl} = require('./utils')
const filePath = './productData.json';

const delay = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));


// Read the JSON file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    // Parse the JSON data
    const jsonData = JSON.parse(data);

    downloadImages(jsonData)
    
  } catch (err) {
    console.error('Error parsing JSON:', err);
  }
});


const downloadImages = async (productDataArr) => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  for (const [index, product] of productDataArr.entries()) {
      page.on('response', async (response) => {
        const matches = /.*\.(jpg|png|svg|gif)$/.exec(response.url());
        console.log(matches);
        if (matches && (matches.length === 2)) {
          const extension = matches[1];
          const buffer = await response.buffer();
          fs.writeFileSync(`./images/${index}-${extractTextFromUrl(product.img[0])}.${extension}`, buffer, 'base64');
        }
    });
    if (product.img.length > 0) {
        await page.goto(product.img[0]);
      }
      await delay(2000)

  }
//   for (let i = 0; i < productDataArr.length; i++) {
//     if (productDataArr[i].img.length > 0) {
//       page.on('response', async (response) => {
//         const matches = /.*\.(jpg|png|svg|gif)$/.exec(response.url());
//         console.log(matches);
//         if (matches && (matches.length === 2)) {
//           const extension = matches[1];
//           const buffer = await response.buffer();
//           fs.writeFileSync(`./images/${i}-${extractTextFromUrl(productDataArr[i].img[0])}.${extension}`, buffer, 'base64');
//         }
//       });
      
//         console.log('!!!!!')
//           await page.goto(productDataArr[i].img[0]);
//       }
//       await delay(2000)

//   }


  await browser.close();
}