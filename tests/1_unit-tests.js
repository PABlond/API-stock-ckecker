/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

var chai = require("chai")
var StockHandler = require("../controllers/stockHandler.js")
const Currency = require("./../models/currency")
require("dotenv").config()
const mongoose = require("mongoose")
const { MONGO_PASSWORD, MONGO_USER } = process.env
mongoose.connect(
  `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@ds137008.mlab.com:37008/stock-checker`,
  { useNewUrlParser: true }
)
const assert = chai.assert
var stockPrices = new StockHandler()

suite("Unit Tests", function() {
  before(function(done) {
    Currency.remove({}).then(() => done())
  })

  test("createStock", done => {
    stockPrices.createStock("goog", [])
    done()
  })

  test("getDbCurrency", done => {
    stockPrices.getDbCurrency("goog").then(response => {
      assert.equal(response.name, "goog")
      done()
    })
  })

  test("getPrice", done => {
    stockPrices.getPrice("goog").then(response => {
      assert.isNumber(response, "price of stock goog")
      done()
    })
  })

  test("getRelLikes without like=true", done => {
    const response = stockPrices.getRelLikes(
      [
        { stock: "goog", price: 2.3, likes: 3 },
        { stock: "aapl", price: 2.3, likes: 5 }
      ]
    )
    assert.isUndefined(response[0].rel_likes, "rel_likes is undefined")
    assert.equal(response[0].stock, "goog")
    assert.isNumber(response[0].price, "price of google stock")
    assert.equal(response.length, 2)
    done()
  })

  test("getRelLikes with like=true", done => {
    const response = stockPrices.getRelLikes(
      [
        { stock: "goog", price: 2.3, likes: 3 },
        { stock: "aapl", price: 2.3, likes: 5 }
      ],
      true
    )
    assert.property(response[0], "rel_likes")
    assert.equal(response[0].stock, "goog")
    assert.isNumber(response[0].price, "price of google stock")
    assert.isNumber(response[0].rel_likes, "number of rel_likes")
    assert.equal(response.length, 2)
    done()
  })

  //none requiered
})
