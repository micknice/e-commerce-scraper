const seed = require('./seed.js');
const db = require('../connection.js');
const productData = require('./data/productData.js')
const usersData = require('./data/usersData.js')
const reviewsData = require('./data/reviewsData.js')

const runSeed = () => {
  return seed(usersData, productData, reviewsData).then(() => db.end());
};

runSeed();