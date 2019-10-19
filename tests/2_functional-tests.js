/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http")
var chai = require("chai")
var assert = chai.assert
var server = require("../server")
const Currency = require('./../models/currency')
require("dotenv").config()
const mongoose = require('mongoose')
const {MONGO_PASSWORD, MONGO_USER} = process.env
mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@ds137008.mlab.com:37008/stock-checker`, {useNewUrlParser: true});
// (async () => {
//   )
// })()
chai.use(chaiHttp)

suite("Functional Tests", function() {
  suite("GET /api/stock-prices => stockData object", function() {
    before(function(done) {
      Currency.remove({}).then(() => done());
    })

    test("1 stock", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "aapl" })
        .end(function(err, res) {
          assert.equal(res.status, 201)
          assert.equal(res.body.stockData.stock, "aapl")
          assert.property(res.body.stockData, "price")
          assert.property(res.body.stockData, "likes")
          assert.equal(res.body.stockData.likes, 0)
          done()
        })
    })

    test("1 stock with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "aapl", like: true })
        .end(function(err, res) {
          assert.equal(res.status, 201)
          assert.equal(res.body.stockData.stock, "aapl")
          assert.property(res.body.stockData, "price")
          assert.property(res.body.stockData, "likes")
          assert.equal(res.body.stockData.likes, 1)
          done()
        })
    })

    test("1 stock with like again (ensure likes arent double counted)", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "aapl", like: true })
        .end(function(err, res) {
          assert.equal(res.status, 201)
          assert.equal(res.body.stockData.stock, "aapl")
          assert.property(res.body.stockData, "price")
          assert.property(res.body.stockData, "likes")
          assert.equal(res.body.stockData.likes, 1)
          done()
        })
    })

    test('2 stocks', function(done) {
      chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: ["aapl", 'goog'] })
      .end(function(err, res) {
        assert.equal(res.status, 201)
        assert.equal(res.body.stockData.length, 2)
        assert.property(res.body.stockData[0], "price")
        assert.notProperty(res.body.stockData[0], "rel_likes")
        done()
      })
    });

    test('2 stocks with like', function(done) {
      chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: ["aapl", 'goog'], like: true })
      .end(function(err, res) {
        assert.equal(res.status, 201)
        assert.equal(res.body.stockData.length, 2)
        assert.property(res.body.stockData[0], "price")
        assert.property(res.body.stockData[0], "rel_likes")
        assert.equal(res.body.stockData[0].rel_likes, 1)
        assert.equal(res.body.stockData[1].rel_likes, -1)
        done()
      })
    });
  })
})
