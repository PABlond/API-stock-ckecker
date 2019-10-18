const mongoose = require("mongoose")

module.exports = mongoose.model(
  "currency",
  new mongoose.Schema({
    name: String,
    like: [
      {
        ip: String
      }
    ]
  })
)
