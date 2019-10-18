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
    if (stock instanceof Array) {
      const stockData = await stockHandler.getStockData({ stock, like })
      console.log(stockData)
      return res.json({
        stockData: stockData.map(({ stock, price, rel_likes }) => ({
          stock,
          price,
          rel_likes
        }))
      })
    } else {
      const ip = req.headers["x-real-ip"] || req.connection.remoteAddress
      const price = await stockHandler.getPrice(stock)
      const dbStock = await Currency.findOne({ name: stock })
      if (!dbStock) {
        const dbLike = like ? [{ ip }] : []
        await new Currency({
          name: stock,
          like: dbLike
        }).save()
        const likes = dbLike.length
        return res.json({ stockData: { stock, price, likes } })
      } else {
        if (
          like &&
          dbStock.like.every(({ ip: previousIp }) => previousIp !== ip)
        ) {
          dbStock.like.push({ ip })
          await dbStock.save()
        }
        const likes = dbStock.like.length
        return res.json({ stockData: { stock, price, likes } })
      }
    }
  })
}
