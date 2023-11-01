const productData = require('./productData.json')
const fs = require('fs')
const {percentageToDecimal} = require('./utils')
const userNames = []
const filePath = './productData.json';
const userPath = './userList.json';
const reviewObjArr = []

fs.readFile(filePath, 'utf8', async(err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }
    
    try {
        const productDataArr = JSON.parse(data);
        for (const [productIndex, product] of productDataArr.entries()) {
          if (product.reviews.length > 0) {
              for (const review of product.reviews) {
                const reviewObj = {
                  author: review.author.replace(/\n/g, ''),
                  date: review.date.replace(/\n/g, ''),
                  title: review.title.replace(/\n/g, ''),
                  rating: percentageToDecimal(review.rating.replace(/\n/g, '')),
                  body: review.body.replace(/\n/g, ''),
                  productId: productIndex +1,
                }
                reviewObjArr.push(reviewObj)
              }
                
            }
        }

        fs.writeFileSync("./reviewsData.json", JSON.stringify(reviewObjArr, null, 4));
              console.log("reviewsData file is created!");

        




    } catch (err) {
      console.error('Error parsing JSON:', err);
    }
});




  










