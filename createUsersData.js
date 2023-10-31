const productData = require('./productData.json')
const fs = require('fs')
const userNames = []
const filePath = './productData.json';
const userPath = './userList.json';
const userObjArr = []

fs.readFile(filePath, 'utf8', async(err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }
    
    try {
        const productDataArr = JSON.parse(data);
        for (const product of productDataArr) {
            for (const review of product.reviews) {
                const username = review.author.replace(/\n/g, '')
                if(!userNames.includes(username)) {
                    userNames.push(username)
                }
            }
        }

        fs.readFile(userPath, 'utf8', async(err, data) => {
            console.log('!!', userNames)
            if (err) {
              console.error('Error reading the file:', err);
              return;
            }
            try {
                
                const userArr = JSON.parse(data);
                // console.log(userArr)
        
                for (const [index, username] of userNames.entries()) {
                    const userObj = {
                        username: username,
                        first_name: userArr[index].first_name,
                        last_name: userArr[index].last_name,
                        email: userArr[index].email,
                        address_line_1: userArr[index].address_line_1,
                        address_line_2: userArr[index].address_line_2,
                        city: userArr[index].city,
                        country: userArr[index].country,
                        postcode: userArr[index].postcode,
                    }
                    console.log(userObj, 'userObj')
                    userObjArr.push(userObj)
                }
        
            fs.writeFileSync("./usersData.json", JSON.stringify(userObjArr, null, 4));
              console.log("usersData filile is created!");
                
            
            } catch (err) {
              console.error('Error parsing JSON:', err);
            }
        });




    } catch (err) {
      console.error('Error parsing JSON:', err);
    }
});




  










