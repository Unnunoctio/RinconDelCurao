import axios from "axios";
import { getEnvVariables } from "../helpers";

const { VITE_API_URL } = getEnvVariables()

const productsApi = axios.create({
  baseURL: VITE_API_URL
})

//TODO: configurar interceptores
productsApi.interceptors.request.use(config => {
  config.headers = {
    ...config.headers,
    'Content-Type': 'application/json'
  }
  return config
})

export default productsApi