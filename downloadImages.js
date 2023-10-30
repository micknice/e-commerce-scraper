const puppeteer = require('puppeteer');
const fs = require('fs');
const {formatProductImgName, extractTextFromUrl} = require('./utils')
const filePath = './productData.json';

const delay = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));


// Read the JSON file
fs.readFile(filePath, 'utf8', async(err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    // Parse the JSON data
    const productDataArr = JSON.parse(data);
    for (const [index, product] of productDataArr.entries()) {
        await downloadImage(product, index)

    }
    
  } catch (err) {
    console.error('Error parsing JSON:', err);
  }
});


const downloadImage = async (product, index) => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  
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

  

  await browser.close();
}