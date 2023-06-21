// tier: 1 = product[filterKey], 2 = product.product[filterKey]
export const applyFilter = (array, filterKey, tier) => {
  return array.reduce((acc, product) => {
    if (tier === 1) {
      acc[product[filterKey]] = (acc[product[filterKey]] || 0) + 1
    } else if (tier === 2) {
      acc[product.product[filterKey]] = (acc[product.product[filterKey]] || 0) + 1
    }
    return acc
  }, {})
}
