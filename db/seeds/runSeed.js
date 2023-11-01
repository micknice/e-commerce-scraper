const seed = require('./seed.js');
const db = require('../connection.js');
const productData = require('./data/productData.js')
const usersData = require('./data/usersData.js')
const reviewsData = require('./data/reviewsData.js')
const addressData = require('./data/addressData.js')
const inventoryData = require('./data/inventoryData.js')

const runSeed = () => {
  return seed(usersData, productData, reviewsData, addressData, inventoryData).then(() => db.end());
};

runSeed();