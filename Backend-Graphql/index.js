import { ApolloServer, gql } from 'apollo-server'
import './database/config.js'
// import Product from './models/Product.js'
import { getProducts, productCount } from './resolvers/product.js'

const typeDefinitions = gql`
  type UnitProduct {
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

  type Product {
    _id: ID!
    title: String!
    product: UnitProduct!
    quantity: Int!
    websites: [Website]
    image_path: String!
  }

  input FiltersInput {
    category: String!
  }

  type Query {
    totalProducts(filters: FiltersInput!): Int!
    getProducts(orderBy: String!, page: Int!, filters: FiltersInput!): [Product]!
  }
`

const resolvers = {
  Query: {
    totalProducts,
    getProducts
  }
}

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers
})

server.listen(process.env.PORT)
  .then(({ url }) => console.log(`Server ready at ${url}`))
  .catch((err) => console.log(`Error connection to server ${err.message}`))
