const format = require('pg-format');
const db = require('../connection');
const {
  convertTimestampToDate,
  createRef,
  formatComments,
  convertPriceStringToNumber
} = require('./utils');
const {percentageToDecimal} = require('../../utils')

const seed = (userData, productData, reviewData, addressData, inventoryData ) => {
  // return db
    // .query(`TRUNCATE address, inventory, local_user, product, review, verification_token, web_order, web_order_quantities RESTART IDENTITY CASCADE;`)
    // .then(() => {
    //   return db.query(`DROP TABLE IF EXISTS product;`);
    // })
    // .then(() => {
    //   return db.query(`DROP TABLE IF EXISTS users;`);
    // })
    // .then(() => {
    //   return db.query(`DROP TABLE IF EXISTS address;`);
    // })
    // .then(() => {
    //   return db.query(`DROP TABLE IF EXISTS inventory;`);
    // })
    // .then(() => {
    //   const usersTablePromise = db.query(`
    //   CREATE TABLE local_user (
    //     id SERIAL PRIMARY KEY,
    //     username VARCHAR UNIQUE NOT NULL,
    //     first_name VARCHAR NOT NULL,
    //     last_name VARCHAR NOT NULL,
    //     email VARCHAR NOT NULL,
    //     address_line_1 VARCHAR NOT NULL,
    //     address_line_2 VARCHAR NOT NULL,
    //     city VARCHAR NOT NULL,
    //     country VARCHAR NOT NULL,
    //     postcode VARCHAR NOT NULL,
    //     password VARCHAR NOT NULL DEFAULT 'Password1!'
    //     email_verified 
    //   );`);

    //   return Promise.all([usersTablePromise]);
    // })
    // .then(() => {
    //   return db.query(`
    //   CREATE TABLE product (
    //     product_id SERIAL PRIMARY KEY,
    //     long_description TEXT,
    //     name VARCHAR NOT NULL,
    //     category VARCHAR NOT NULL,
    //     sub_category VARCHAR NOT NULL,
    //     short_description TEXT NOT NULL,
    //     rating NUMERIC DEFAULT 0.0 NOT NULL,
    //     price NUMERIC NOT NULL,
    //     img TEXT DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
    //   );`);
    // })
    // .then(() => {
    //   return db.query(`
    //   CREATE TABLE review (
    //     id SERIAL PRIMARY KEY,
    //     author VARCHAR REFERENCES users(username) NOT NULL,
    //     date TIMESTAMP DEFAULT NOW(),
    //     title VARCHAR NOT NULL,
    //     rating NUMERIC NOT NULL,
    //     body TEXT NOT NULL,
    //     product_id INT REFERENCES product(product_id) NOT NULL
    //   );`);
    // })
    // .then(() => {
      const insertUsersQueryStr = format(
        'INSERT INTO local_user (username, first_name, last_name, email, password) VALUES %L;',
        userData.map(({ username, first_name, last_name, email, password }) => [
          username, 
          first_name, 
          last_name, 
          email, 
          password,
        ])
      );
      const usersPromise = db.query(insertUsersQueryStr);
      return Promise.all([usersPromise])
    // })
    .then(() => {
      const formattedProductData = productData.map(({category, subCat, img, name, price, overview, description, rating}) => 
      { return {category: category,
        subCat: subCat,
        img: img[0],
        name: name,
        price: price,
        overview: overview,
        description: description,
        rating: percentageToDecimal(rating)
      }})
      const insertProductsQueryStr = format(
        'INSERT INTO product (name, short_description, long_description, price, category, sub_category, rating, img) VALUES %L RETURNING * ;',
        formattedProductData.map(
          ({
            name,
            overview,
            description,
            price,
            category,
            subCat,
            rating,
            img,
          }) => [name, overview, `{textArr: ${description}}`, convertPriceStringToNumber(price),  category, subCat, rating, img]
        )
      );
      return db.query(insertProductsQueryStr);
    })
    .then(({ rows: productRows }) => {
      const productIdLookup = createRef(productRows, 'name', 'product_id');
      const formattedReviewData = formatComments(reviewData, productIdLookup);

      const insertReviewsQueryStr = format(
        'INSERT INTO review (author, date, title, rating, body, product_id) VALUES %L;',
        formattedReviewData.map(
          ({ author, date, title, rating, body, productId }) => [
            author, 
            date, 
            title, 
            rating, 
            body, 
            productId
          ]
        )
      );
      
      return db.query(insertReviewsQueryStr);
    })
    .then(() => {
      const insertInventoryQueryStr = format(
        'INSERT INTO inventory (product_id, quantity) VALUES %L;',
        inventoryData.map(({product_id, quantity}) => [
          product_id,
          quantity
        ])
      );
      const inventoryPromise = db.query(insertInventoryQueryStr);
      return Promise.all([inventoryPromise]);
    })
    .then(() => {
      const insertAddressQueryStr = format(
        'INSERT INTO address (address_line_1, address_line_2, city, country, postcode, user_id) VALUES %L;',
        addressData.map(({
          address_line_1,
          address_line_2,
          city,
          country,
          postcode,
          user_id
        }) => [
          address_line_1,
          address_line_2,
          city,
          country,
          postcode,
          user_id
        ])
      );
      const addressPromise = db.query(insertAddressQueryStr);
      return Promise.all([addressPromise]);
    })
};

module.exports = seed;