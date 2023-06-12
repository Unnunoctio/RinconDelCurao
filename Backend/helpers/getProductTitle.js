export const getProductTitle = (productApi, productData) => {
  const { name, package: packageData, content } = productApi
  const { quantity } = productData

  let title = ''
  if (quantity > 1) title += `Pack ${quantity} un. `

  title += `${name} ${packageData} `

  if (content >= 1000) {
    title += `${content / 1000}L`
  } else {
    title += `${content}cc`
  }

  return title
}
