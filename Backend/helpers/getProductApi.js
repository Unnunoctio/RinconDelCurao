import axios from 'axios'

export const getProductApi = async (productData) => {
  try {
    const { title, brand, content, package: packageData, alcoholic_grade: alcoholicGrade } = productData
    const { data } = await axios.get(`http://localhost:4000/api/drinks/drink?brand=${brand}&content=${content}&package=${packageData}&alcoholic_grade=${alcoholicGrade}`)

    if (data.products.length === 0) return null

    let productCorrect = null
    let nameCorrect = []
    const titleSplit = title.toLowerCase().split(' ')

    data.products.forEach(product => {
      const nameSplit = product.name.replace(`${brand} `, '').toLowerCase().split(' ')
      const isContains = nameSplit.every((name) => titleSplit.includes(name))
      if (isContains && (nameSplit.length > nameCorrect.length)) {
        nameCorrect = nameSplit
        productCorrect = product
      }
    })

    return productCorrect
  } catch (error) {
    console.error(error)
    return null
  }
}
