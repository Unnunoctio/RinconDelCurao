import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Error404Page } from "./Error404Page"

const allowedUrls = [
  {
    category: 'cervezas',
    subCategories: [ 'cervezas-artesanales', 'cervezas-tradicionales', 'cervezas-importadas', 'cervezas-sin-alcohol' ]
  },
  {
    category: 'vinos',
    subCategories: [ 'vinos-tintos', 'vinos-blancos', 'vinos-rose','vinos-cero' ]
  },
  {
    category: 'destilados',
    subCategories: [ 'whisky', 'pisco', 'ron', 'tequila' ]
  }
]

export const ProductsPage = () => {
  const [error404, setError404] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const pathSplit = pathname.split('/')
    const pathCategory = pathSplit[1]
    const pathSubCategory = pathSplit[2]

    let isPathAllowed = true

    // ver si esta por medio de category-subCategory o solo category
    if(!!pathSubCategory) {
      isPathAllowed = allowedUrls.some((item) => {
        if(item.category === pathCategory) {
          return item.subCategories.includes(pathSubCategory)
        }
        return false
      })
    }else {
      isPathAllowed = allowedUrls.some((item) => { return item.category === pathCategory })
    }

    setError404(isPathAllowed === false)
  }, [pathname])
  
  return (
    <>
      {
        (error404) 
          ? (<Error404Page />) 
          : (<div>Pagina de la lista de productos</div>)
      }
    </>
  )
}
