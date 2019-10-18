/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict"

var expect = require("chai").expect
var MongoClient = require("mongodb")
const axios = require("axios")

const CONNECTION_STRING = process.env.DB //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

const getPrice = async stock => {
  const {
    data: { latestPrice: price }
  } = await axios
    .get(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`)
    .catch(err => err)
  return price
}

module.exports = function(app) {
  app.route("/api/stock-prices").get(async (req, res) => {
    const { stock, like } = req.query
    if (stock instanceof Array) {
      const stockData = []
      for await (const cur of stock) {
        stockData.push({stoc: cur, price: await getPrice(cur)})
      }
      // const stockData = await stock.map(async stock => {
      //   const price = await getPrice(stock)
      //   return {stock, price}
      // })
      res.json({ stockData })
    } else {
      const price = await getPrice(stock)
      console.log(price)
      res.json({ stockData: { stock, price } })
    }
  })
}
