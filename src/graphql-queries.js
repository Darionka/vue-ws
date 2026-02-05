import { gql } from '@apollo/client/core'

//  для получения старых сообщений (HTTP)
export const GET_MESSAGES = gql`
  query GetMessages($limit: Int!) {
    messages(limit: $limit) {
      id
      text
      user {
        id
        name
      }
      createdAt
    }
  }
`

// мутация для отправки сообщения (HTTP)
export const SEND_MESSAGE = gql`
  mutation SendMessage($text: String!, $userId: ID!) {
    sendMessage(text: $text, userId: $userId) {
      id
      text
      user {
        id
        name
      }
      createdAt
    }
  }
`

// подписка на новые сообщения (WebSocket)
export const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageAdded {
    messageAdded {
      id
      text
      user {
        id
        name
      }
      createdAt
    }
  }
`