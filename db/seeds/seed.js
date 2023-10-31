const format = require('pg-format');
const db = require('../connection');
const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require('./utils');

const seed = (userData, productData, commentData ) => {
  return db
    .query(`DROP TABLE IF EXISTS reviews;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS products;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      const usersTablePromise = db.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL,
        first_name VARCHAR NOT NULL,
        last_name VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        address_line_1 VARCHAR NOT NULL,
        address_line_2 VARCHAR NOT NULL,
        city VARCHAR NOT NULL,
        country VARCHAR NOT NULL,
        postcode VARCHAR NOT NULL,
        password VARCHAR NOT NULL DEFAULT 'Password1!'
      );`);

      return Promise.all([usersTablePromise]);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE product (
        product_id SERIAL PRIMARY KEY,
        long_description TEXT[],
        name VARCHAR NOT NULL,
        category VARCHAR NOT NULL,
        sub_category VARCHAR NOT NULL,
        short_description TEXT NOT NULL,
        rating INT DEFAULT 0 NOT NULL,
        img VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        author VARCHAR REFERENCES users(username) NOT NULL,
        date TIMESTAMP DEFAULT NOW()
        title VARCHAR NOT NULL,
        rating NUMERIC NOT NULL,
        body VARCHAR NOT NULL,
        product_id INT REFERENCES products(product_id) NOT NULL
      );`);
    })
    .then(() => {
      
      const insertUsersQueryStr = format(
        'INSERT INTO users ( username, first_name, last_name, email, address_line_1, address_line_2, city, country, postcode, password) VALUES %L;',
        userData.map(({ username, first_name, last_name, email, address_line_1, address_line_2, city, country, postcode, password }) => [
          username, 
          first_name, 
          last_name, 
          email, 
          address_line_1, 
          address_line_2, 
          city, 
          country, 
          postcode, 
          password
        ])
      );
      const usersPromise = db.query(insertUsersQueryStr);

      return Promise.all([usersPromise]);
    })
    .then(() => {
      const insertProductsQueryStr = format(
        'INSERT INTO product (long_description, name, category, sub_category, short_description, rating, img) VALUES %L RETURNING *;',
        productData.map(
          ({
            description,
            name,
            category,
            sub_cat,
            overview,
            rating = 1.0,
            img,
          }) => [description, name, category, sub_cat, overview, rating = 1.0, img]
        )
      );
      return db.query(insertProductsQueryStr);
    })
    .then(({ rows: articleRows }) => {
      const articleIdLookup = createRef(articleRows, 'title', 'article_id');
      const formattedCommentData = formatComments(commentData, articleIdLookup);

      const insertCommentsQueryStr = format(
        'INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L;',
        formattedCommentData.map(
          ({ body, author, article_id, votes = 0, created_at }) => [
            body,
            author,
            article_id,
            votes,
            created_at,
          ]
        )
      );
      return db.query(insertCommentsQueryStr);
    });
};

module.exports = seed;