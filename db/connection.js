const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
  
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}
const config = 
 {
                            connectionString: process.env.DATABASE_URL,
                            max: 2,
                            user: 'postgres',
                            host: 'localhost',
                            port: '5432',

                            password: "Airtrainersc2Reebokomn1l1te"
                          }
                        
console.log(config)
                      


module.exports = new Pool(config);