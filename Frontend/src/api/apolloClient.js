import { ApolloClient, InMemoryCache } from '@apollo/client'
import { getEnvVariables } from '../helpers'

const { VITE_API_URL } = getEnvVariables()

export const apolloClient = new ApolloClient({
  uri: VITE_API_URL,
  cache: new InMemoryCache()
})
