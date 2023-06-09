import { ApolloServer, gql } from 'apollo-server'
import './database/config.js'
import { getBestDiscountProducts, getProducts, totalPages, totalProducts } from './resolvers/product.js'

const typeDefinitions = gql`
  type ProductAPI {
    _id: ID!
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
    id: ID
    name: String!
    url: String!
    price: Int!
    best_price: Int!
    last_hash: String!
  }

  type ProductDB {
    _id: ID!
    title: String!
    product: ProductAPI!
    quantity: Int!
    websites: [Website]
    image_path: String!
  }

  type Product {
    id: ID!
    title: String!
    brand: String!
    alcoholic_grade: Float!
    content: Int!
    best_price: Int!
    image_path: String!
  }

  type ProductDiscount {
    id: ID!
    title: String!
    brand: String!
    discount: Int!
    best_price: Int!
    image_path: String!
  }

  input FiltersInput {
    category: String!
  }

  enum OrderByEnum {
    SCORE_DESC,
    PRICE_DESC,
    PRICE_ASC,
    NAME_ASC,
    NAME_DESC
  }

  type Query {
    totalProducts(filters: FiltersInput!): Int!
    totalPages(filters: FiltersInput!): Int!
    allProducts(orderBy: OrderByEnum!, page: Int!, filters: FiltersInput!): [Product]!
    bestDiscountProducts: [ProductDiscount]!
  }
`

const resolvers = {
  Query: {
    totalProducts,
    totalPages,
    allProducts: getProducts,
    bestDiscountProducts: getBestDiscountProducts
  },
  Product: {
    id: (root) => {
      const idString = root._id.toString()
      const pidString = root.product._id.toString()
      return idString.substring(idString.length - 3) + pidString.substring(pidString.length - 3)
    },
    brand: (root) => root.product.brand,
    alcoholic_grade: (root) => root.product.alcoholic_grade,
    content: (root) => root.product.content,
    best_price: (root) => root.websites[0].best_price
  },
  ProductDiscount: {
    id: (root) => {
      const idString = root._id.toString()
      const pidString = root.product._id.toString()
      return idString.substring(idString.length - 3) + pidString.substring(pidString.length - 3)
    },
    brand: (root) => root.product.brand,
    discount: (root) => Math.round(100 - ((root.websites[0].best_price * 100) / root.websites[0].price)),
    best_price: (root) => root.websites[0].best_price
  }
}

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers
})

server.listen(process.env.PORT)
  .then(({ url }) => console.log(`Server ready at ${url}`))
  .catch((err) => console.log(`Error connection to server ${err.message}`))
