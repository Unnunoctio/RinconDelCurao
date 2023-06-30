import { gql } from 'apollo-server'
import { getProductImage } from '../helpers/index.js'

const typeProductAverage = gql`
  type ProductAverage {
    id: ID!
    title: String!
    brand: String!
    average: Float!
    best_price: Int!
    image: String!
  }
`

const ProductAverage = {
  id: (root) => {
    const idString = root._id.toString()
    const pidString = root.product._id.toString()
    return idString.substring(idString.length - 3) + pidString.substring(pidString.length - 3)
  },
  title: (root) => root.title,
  brand: (root) => root.product.brand,
  average: (root) => {
    let count = 0
    let sumAverage = 0
    for (const website of root.websites) {
      if (website.average !== null) {
        count++
        sumAverage += website.average
      }
    }
    return count > 0 ? sumAverage / count : null
  },
  best_price: (root) => root.websites[0].best_price,
  image: (root) => getProductImage(root.image_path, root.product.category)
}

export {
  typeProductAverage,
  ProductAverage
}
