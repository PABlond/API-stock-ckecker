/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict"

var expect = require("chai").expect
const Currency = require("./../models/currency")
const StockHandler = require("./../controllers/stockHandler")

const CONNECTION_STRING = process.env.DB //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function(app) {
  app.route("/api/stock-prices").get(async (req, res) => {
    const stockHandler = new StockHandler()
    const { stock, like } = req.query
    if (stock instanceof Array && stock.length === 2) {
      return res.json({
        stockData: await stockHandler.CompareStockData({ stock, like })
      })
    } else {
      const ip = req.headers["x-real-ip"] || req.connection.remoteAddress
      return res.json({stockData: await stockHandler.getStockData({stock, like, ip})})
    }
  })
}
