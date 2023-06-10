import { ApolloServer, gql } from 'apollo-server'
import './database/config.js'
import { getBestDiscountProducts, getProduct, getProducts, totalPages, totalProducts } from './resolvers/product.js'
import { Enums, Inputs, ProductDiscount, ProductList, typeProduct, typeProductDiscount, typeProductList } from './types/index.js'

const typeDefinitions = gql`
  type Query {
    totalProducts(filters: FiltersInput!): Int!
    totalPages(page: Int!, filters: FiltersInput!): Int!
    allProducts(orderBy: OrderByEnum!, page: Int!, filters: FiltersInput!): [ProductList]!
    bestDiscountProducts: [ProductDiscount]!
    product(id: ID!, title: String!): Product!
  }
`
typeDefinitions.definitions.push(Enums)
typeDefinitions.definitions.push(Inputs)
typeDefinitions.definitions.push(typeProduct)
typeDefinitions.definitions.push(typeProductDiscount)
typeDefinitions.definitions.push(typeProductList)

const resolvers = {
  Query: {
    totalProducts,
    totalPages,
    allProducts: getProducts,
    bestDiscountProducts: getBestDiscountProducts,
    product: getProduct
  },
  ProductList,
  ProductDiscount
}

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers
})

server.listen(process.env.PORT)
  .then(({ url }) => console.log(`Server ready at ${url}`))
  .catch((err) => console.log(`Error connection to server ${err.message}`))
