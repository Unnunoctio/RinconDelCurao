import { ApolloServer, gql } from 'apollo-server'
import './database/config.js'
import { Enums, Inputs, ProductDiscount, ProductList, typeProduct, typeProductDiscount, typeProductList } from './types/index.js'
import { isProductExist, getBestDiscountProducts, getProduct, getProducts, totalPages, totalProducts } from './queries/product.js'
import { addProduct, removeWebsite } from './mutations/product.js'

const typeDefinitions = gql`
  type Mutation {
    addProduct(data: DataInput!, website: WebsiteInput!): Product
    removeWebsite(urlWebsite: String!): Boolean!
  }

  type Query {
    totalProducts(filters: FiltersInput!): Int!
    totalPages(page: Int!, filters: FiltersInput!): Int!
    allProducts(orderBy: OrderByEnum!, page: Int!, filters: FiltersInput!): [ProductList]!
    bestDiscountProducts: [ProductDiscount]!
    product(id: ID!, title: String!): Product

    isProductExist(urlWebsite: String!): Boolean!
  }
`
typeDefinitions.definitions.push(Enums)
typeDefinitions.definitions.push(Inputs)
typeDefinitions.definitions.push(typeProduct)
typeDefinitions.definitions.push(typeProductDiscount)
typeDefinitions.definitions.push(typeProductList)

const resolvers = {
  Mutation: {
    addProduct,
    removeWebsite
  },
  Query: {
    totalProducts,
    totalPages,
    allProducts: getProducts,
    bestDiscountProducts: getBestDiscountProducts,
    product: getProduct,
    isProductExist
  },
  ProductList,
  ProductDiscount
}

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers,
  context: async ({ req }) => {
    const scrapyApiKey = req ? req.headers['x-api-key'] : null
    if (scrapyApiKey === process.env.SCRAPY_API_KEY) {
      return { apiKey: scrapyApiKey }
    }
    return null
  }
})

server.listen(process.env.PORT)
  .then(({ url }) => console.log(`Server ready at ${url}`))
  .catch((err) => console.log(`Error connection to server ${err.message}`))
