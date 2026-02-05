import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { createHttpLink } from '@apollo/client/link/http'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { split } from '@apollo/client/core'
import { getMainDefinition } from '@apollo/client/utilities'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql'
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
    connectionParams: () => ({
      timestamp: new Date().toISOString()
    })
  })
)

// Разделяем: подписки через WebSocket, остальное через HTTP
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

// Создаем клиент Apollo
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only'
    }
  }
})

export default client