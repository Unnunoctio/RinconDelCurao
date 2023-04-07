"use strict"

const { Schema, model } = require("mongoose")

const ProductScraperSchema = Schema({
  product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  quantity: { type: Number, required: true },
  websites: [
    {
      website: { type: String, required: true },
      url: { type: String, required: true },
      price: { type: Number, required: true },
      best_price: { type: Number, required: true },
      average: { type: Number, default: 0 },
      last_hash: { type: String, required: true },
    },
  ],
  image: { type: String, required: true },
})

ProductScraperSchema.method('toJSON', function() {
  const { __v, product_id, ...object } = this.toObject()
  object.product = product_id
  return object
})

module.exports = model('Scraper_Product', ProductScraperSchema)