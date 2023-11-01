const productData = require('./productData.json')
const fs = require('fs')
const userNames = []
const filePath = './productData.json';
const userPath = './userList.json';
const addressObjArr = []
const productData = require('./db/seeds/data/productData')


        
for (const [index, username] of productData.entries()) {
    const addressObj = {
        address_line_1: productData[index].address_line_1,
        address_line_2: productData[index].address_line_2,
        city: productData[index].city,
        country: productData[index].country,
        postcode: productData[index].postcode,
        user_id: index +1                        
    }
    addressObjArr.push(addressObj)
}
        
fs.writeFileSync("./addressData.json", JSON.stringify(addressObjArr, null, 4));
  console.log("usersData filile is created!");
                
            
        



   




  










