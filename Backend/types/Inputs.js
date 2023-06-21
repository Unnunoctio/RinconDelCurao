import { gql } from 'apollo-server'

const Inputs = gql`
  input FiltersInput {
    category: String!
    sub_category: [String]
    brand: [String]
    content: Int
    pack_unit: PackUnit
    quantity: Int
    package: [String]

    grade_min: Float
    grade_max: Float
    price_min: Int
    price_max: Int
  }

  input WebsiteInput {
    name: String!
    url: String!
    price: Int!
    best_price: Int!
    last_hash: String!
  }

  input DataInput {
    title: String!
    brand: String!
    alcoholic_grade: Float!
    content: Int!
    package: String!
    quantity: Int!
    image_url: String!
  }
`

export {
  Inputs
}
