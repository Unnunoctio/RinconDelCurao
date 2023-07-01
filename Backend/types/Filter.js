import { gql } from 'apollo-server'

const typeFilter = gql`
  type ObjectString {
    label: String!,
    value: String!
  }

  type ObjectNumber {
    label: String!,
    value: Int!
  }

  type Filter {
    sub_category: [ObjectString]
    brand: [ObjectString]
    content: [ObjectNumber]
    quantity: [ObjectNumber]
    package: [ObjectString]
    range_grade: [Float]
    range_price: [Int]
  }
`

const Filter = {
  sub_category: (root) => Object.entries(root.sub_category).map(([key, value]) => { return { label: `${key} (${value})`, value: key } }).sort((a, b) => a.value.localeCompare(b.value)),
  brand: (root) => Object.entries(root.brand).map(([key, value]) => { return { label: `${key} (${value})`, value: key } }).sort((a, b) => a.value.localeCompare(b.value)),
  content: (root) => Object.entries(root.content).map(([key, value]) => { return { label: (parseInt(key) > 1000 ? `${(parseInt(key) / 1000).toFixed(1)}L (${value})` : `${parseInt(key)}cc (${value})`), value: parseInt(key) } }).sort((a, b) => a - b),
  // pack_unit: (root) => Object.entries(root.pack_unit).map(([key, value]) => { return { label: `${key} (${value})`, value: key } }),
  quantity: (root) => Object.entries(root.quantity).map(([key, value]) => { return { label: `${key} ${(parseInt(key) > 1) ? 'Unidades' : 'Unidad'} (${value})`, value: parseInt(key) } }).sort((a, b) => a - b),
  package: (root) => Object.entries(root.package).map(([key, value]) => { return { label: `${key} (${value})`, value: key } }).sort((a, b) => a.value.localeCompare(b.value)),
  range_grade: (root) => [root.grade_min, root.grade_max],
  range_price: (root) => [root.price_min, root.price_max]
}

export {
  typeFilter,
  Filter
}