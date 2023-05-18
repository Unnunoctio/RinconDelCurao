import productsApi from "../../api/productsApi";
import { fetchImage } from "./fetchImage";

export const getProducts = async(body) => {
  try {
    const { data } = await productsApi.post('/scraper_products', JSON.stringify(body)) 
  
    await Promise.all(data.products.map( async product => {
      const image = await fetchImage(product.image)
      product.image = image
      return product
    }))
  
    return data
  } catch (error) {
    console.log(error)
    return null
  }
}