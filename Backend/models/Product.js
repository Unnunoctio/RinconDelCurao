import { Schema, model } from 'mongoose'

const productSchema = Schema({
  title: { type: String, required: true, unique: true },
  product: {
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    alcoholic_grade: { type: Number, required: true },
    content: { type: Number, required: true },
    package: { type: String, required: true },
    category: { type: String, required: true },
    sub_category: { type: String, required: true },
    made_in: { type: String },
    variety: { type: String }, // Cervezas
    bitterness: { type: String }, // Cervezas
    strain: { type: String }, // Vinos
    vineyard: { type: String } // Vinos
  },
  quantity: { type: Number, required: true },
  websites: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true },
      price: { type: Number, required: true },
      best_price: { type: Number, required: true },
      average: { type: Number }
      // last_hash: { type: String, required: true }
    }
  ],
  image_path: { type: String, required: true, unique: true }
})

export default model('Product', productSchema)
