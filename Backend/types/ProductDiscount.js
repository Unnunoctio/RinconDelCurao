import { gql } from 'apollo-server'

const typeProductDiscount = gql`
  type ProductDiscount {
    id: ID!
    title: String!
    brand: String!
    discount: Int!
    best_price: Int!
    image_path: String!
  }
`

const ProductDiscount = {
  id: (root) => {
    const idString = root._id.toString()
    const pidString = root.product._id.toString()
    return idString.substring(idString.length - 3) + pidString.substring(pidString.length - 3)
  },
  title: (root) => root.title,
  brand: (root) => root.product.brand,
  discount: (root) => Math.round(100 - ((root.websites[0].best_price * 100) / root.websites[0].price)),
  best_price: (root) => root.websites[0].best_price,
  image_path: (root) => root.image_path
}

export {
  typeProductDiscount,
  ProductDiscount
}
