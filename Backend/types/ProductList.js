import { gql } from 'apollo-server'
import { getProductImage } from '../helpers/index.js'

const typeProductList = gql`
  type ProductList {
    id: ID!
    title: String!
    brand: String!
    alcoholic_grade: Float!
    content: Int!
    best_price: Int!
    image: String!
  }
`

const ProductList = {
  id: (root) => {
    const idString = root._id.toString()
    const pidString = root.product._id.toString()
    return idString.substring(idString.length - 3) + pidString.substring(pidString.length - 3)
  },
  title: (root) => root.title,
  brand: (root) => root.product.brand,
  alcoholic_grade: (root) => root.product.alcoholic_grade,
  content: (root) => root.product.content,
  best_price: (root) => root.websites[0].best_price,
  image: (root) => getProductImage(root.image_path, root.product.category)
}

export {
  typeProductList,
  ProductList
}
