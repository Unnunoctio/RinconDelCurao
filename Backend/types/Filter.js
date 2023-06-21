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
    range_grade: [Float]
  }
`

const Filter = {
  sub_category: (root) => Object.entries(root.sub_category).map(([key, value]) => { return { label: `${key} (${value})`, value: key } }),
  range_grade: (root) => [root.grade_min, root.grade_max]
}

export {
  typeFilter,
  Filter
}
