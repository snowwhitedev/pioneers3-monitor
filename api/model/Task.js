const Sequelize = require("sequelize");
const db = require("../database/db.js");

module.exports = db.sequelize.define(
  "weight_history", 
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    address: {
      type: Sequelize.STRING
    },
    timestamp: {
      type: Sequelize.INTEGER
    },
    weight: {
      type: Sequelize.STRING
    },
    token: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps:false,
    freezeTableName: true
  }
)
