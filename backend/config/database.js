const Sequelize = require('sequelize').Sequelize;
require('dotenv').config();

const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
});

sequelize
  .sync()
  .then(() => {
    console.log('DB sync');
  })
  .catch((err) => {
    console.log(err);
  });

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;