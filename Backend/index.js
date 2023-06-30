import { ApolloServer, gql } from 'apollo-server'
import './database/config.js'
import { Enums, Inputs, Product, ProductAverage, ProductDiscount, ProductList, typeProduct, typeProductAverage, typeProductDiscount, typeProductList } from './types/index.js'
import { isProductExist, getBestDiscountProducts, getProduct, getProducts, totalPages, totalProducts, getBestAverageProducts } from './queries/product.js'
import { addProduct, removeWebsite, updateWebsite } from './mutations/product.js'

const typeDefinitions = gql`
  type Mutation {
    addProduct(data: DataInput!, website: WebsiteInput!): Product
    removeWebsite(urlWebsite: String!): Boolean!
    updateWebsite(newWebsite: WebsiteInput!): Boolean!
  }

  type Query {
    requestId(requestId: ID!): ID!
    totalProducts(filters: FiltersInput!): Int!
    totalPages(page: Int!, filters: FiltersInput!): Int!
    allProducts(orderBy: OrderByEnum!, page: Int!, filters: FiltersInput!): [ProductList]!
    bestDiscountProducts: [ProductDiscount]!
    bestAverageProducts: [ProductAverage]!
    product(id: ID!, title: String!): Product

    isProductExist(urlWebsite: String!): Boolean!
  }
`
typeDefinitions.definitions.push(Enums)
typeDefinitions.definitions.push(Inputs)
typeDefinitions.definitions.push(typeProduct)
typeDefinitions.definitions.push(typeProductDiscount)
typeDefinitions.definitions.push(typeProductAverage)
typeDefinitions.definitions.push(typeProductList)

const resolvers = {
  Mutation: {
    addProduct,
    removeWebsite,
    updateWebsite
  },
  Query: {
    requestId: (root, { requestId }) => requestId,
    totalProducts,
    totalPages,
    allProducts: getProducts,
    bestDiscountProducts: getBestDiscountProducts,
    bestAverageProducts: getBestAverageProducts,
    product: getProduct,
    // productImage: getProductImage,
    isProductExist
  },
  ProductList,
  ProductDiscount,
  ProductAverage,
  Product
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
