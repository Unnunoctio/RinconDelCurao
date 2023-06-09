import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

mongoose.connect(process.env.DB_CNN, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  // useFindAndModify: false
})
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.error('Error connection to DB', err.message))
