// const productData = require('./productData.json')
const fs = require('fs')
const userNames = []
const filePath = './productData.json';
const userPath = './userList.json';
const inventoryObjArr = []
const productData = require('./db/seeds/data/productData')


        
for (const [index, username] of productData.entries()) {
    const inventoryObj = {
        product_id: index +1,
        quantity: Math.floor(Math.random() * 21)                    
    }
    inventoryObjArr.push(inventoryObj)
}
        
fs.writeFileSync("./inventoryData.json", JSON.stringify(inventoryObjArr, null, 4));
  console.log("usersData filile is created!");
                
            
        



   




  










