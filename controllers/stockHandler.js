const axios = require("axios")
const Currency = require("./../models/currency")

module.exports = class StockHandler {
  async getDbCurrency(name) {
    return await Currency.findOne({ name })
  }

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
    
    return stockData.map((stock, i) => {
      const target = i === 0 ? 1 : 0
      return {...stock, rel_likes: stockData[i].likes - stockData[target].likes}
    }).map(stock => ({...stock, likes: undefined}))
  }

  async CompareStockData({ stock, like }) {
    const stockData = []
    for await (const cur of stock) {
      const dbCur = await this.getDbCurrency(cur)
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

  async getStockData({ stock, like, ip }) {
    const price = await this.getPrice(stock)
    const dbStock = await this.getDbCurrency(stock)
    if (!dbStock) {
      const dbLike = like ? [{ ip }] : []
      await new Currency({
        name: stock,
        like: dbLike
      }).save()
      return { stock, price, likes: dbLike.length }
    } else {
      if (
        like &&
        dbStock.like.every(({ ip: previousIp }) => previousIp !== ip)
      ) {
        dbStock.like.push({ ip })
        await dbStock.save()
      }
      return { stock, price, likes: dbStock.like.length }
    }
  }
}
