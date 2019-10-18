const axios = require("axios")
const Currency = require("./../models/currency")

module.exports = class StockHandler {
  async getPrice(stock) {
    const {
      data: { latestPrice: price }
    } = await axios
      .get(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`)
      .catch(err => err)
    return price
  }

  async createStock(name, like) {
    await new Currency({
      name,
      like
    }).save()
  }

  getRelLikes(stockData, like) {
    if (like) {
      stockData[0].rel_likes = stockData[0].likes - stockData[1].likes
      stockData[1].rel_likes = stockData[1].likes - stockData[0].likes
    }
    return stockData
  }

  async getStockData({ stock, like }) {
    const stockData = []
    for await (const cur of stock) {
      const dbCur = await Currency.findOne({ name: cur })
      if (!dbCur) {
        this.createStock(cur, like ? [{ ip }] : [])
      }
      stockData.push({
        stock: cur,
        price: await this.getPrice(cur),
        likes: dbCur ? dbCur.like.length : 0
      })
    }
    return this.getRelLikes(stockData, like)
  }
}
