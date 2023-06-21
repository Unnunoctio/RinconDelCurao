import { gql } from 'apollo-server'

const Enums = gql`
  enum OrderByEnum {
    SCORE_DESC
    PRICE_DESC
    PRICE_ASC
    NAME_ASC
    NAME_DESC
  }

  enum PackUnit {
    PACK
    UNIT
  }
`

export {
  Enums
}
