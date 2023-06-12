// import axios from 'axios'
// import { getEnvVariables } from '../helpers'

// const { VITE_API_URL } = getEnvVariables()

// const productsApi = axios.create({
//   baseURL: VITE_API_URL
// })

// // TODO: configurar interceptores
// productsApi.interceptors.request.use(config => {
//   config.headers = {
//     ...config.headers,
//     'Content-Type': 'application/json'
//   }
//   return config
// })

// export default productsApi

import { getEnvVariables } from '../helpers'
import { GraphQLClient } from 'graphql-request'

const { VITE_API_URL } = getEnvVariables()

const productsApi = async (query, variables = {}) => {
  const headers = {
    'Content-Type': 'application/json'
  }
  const client = new GraphQLClient(VITE_API_URL, { headers })
  const response = await client.request(query, variables)
  return response
}

export default productsApi
