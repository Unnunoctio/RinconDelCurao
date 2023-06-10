import { gql } from 'apollo-server'

const Inputs = gql`
  input FiltersInput {
    category: String!
  }
`

export {
  Inputs
}
