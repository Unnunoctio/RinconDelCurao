import { ApolloServer, gql } from 'apollo-server'
import './database/db.js'
import Product from './models/Product.js'

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

  type Query {
    productCount: Int!
    allProducts(title: String): [Product]!
  }
`

const resolvers = {
  Query: {
    productCount: () => Product.collection.countDocuments(),
    allProducts: async (root, args) => {
      console.log(args)
      return Product.find({})
    }
  }
}

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
