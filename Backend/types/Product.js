import { gql } from 'apollo-server'

const typeProduct = gql`
  type ProductUnit {
    name: String!
    brand: String!
    alcoholic_grade: Float!
    content: Int!
    package: String!
    category: String!
    sub_category: String!
    made_in: String
    variety: String
    bitterness: String
    strain: String
    vineyard: String
  }

  type Website {
    name: String!
    url: String!
    price: Int!
    best_price: Int!
  }

  type Product {
    title: String!
    product: ProductUnit!
    quantity: Int!
    websites: [Website]!
    image_path: String!
  }
`
export {
  typeProduct
}
