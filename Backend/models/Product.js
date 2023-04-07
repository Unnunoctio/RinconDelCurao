"use strict"

const { Schema, model } = require("mongoose")

const ProductSchema = Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  alcoholic_grade: { type: Number, required: true },
  content: { type: Number, required: true },
  package: { type: String, required: true },
  category: { type: String, required: true },
  sub_category: { type: String, required: true },
  features: [
    {
      title: { type: String },
      value: { type: String }
    },
  ]
})

module.exports = model('Product', ProductSchema)