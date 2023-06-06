import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.connect(process.env.DB_CNN, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  // useFindAndModify: false
  // useCreateIndex: true
}).then(() => {
  console.log('Connected to DB')
}).catch(error => {
  console.log('error connection to DB', error.message)
})
