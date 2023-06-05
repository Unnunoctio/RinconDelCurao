import { ApolloServer, gql } from 'apollo-server'

const persons = [
  {
    name: 'Jose',
    phone: '9 4444 5555',
    street: 'calle falsa #123',
    city: 'Santiago',
    id: '5'
  }
]

const typeDefinitions = gql`
  type Person {
    name: String!
    phone: String
    street: String!
    city: String!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person]!
  }
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons
  }
}

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
