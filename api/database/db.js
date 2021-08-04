require('dotenv').config();
const Sequelize = require('sequelize');
const db = {}
const dbUser = process.env.MYSQL_USER || 'root';
const dbPassword = process.env.MYSQL_PASSWORD || ''

const sequelize = new Sequelize("pio3", dbUser, dbPassword, {
  host: 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  dialect: 'mysql',
  operatorsAliases: true,
  pool:{
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
