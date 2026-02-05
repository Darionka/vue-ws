<template>
  <div style="max-width: 600px; margin: 0 auto;">
    <h2> GraphQL + WebSocket Чат</h2>
    
    <div style="margin: 10px 0; padding: 10px; background: #f0f0f0;">
      Статус: 
      <span v-if="loading">🔄 Загрузка...</span>
      <span v-else-if="wsConnected" style="color: green;">✅ Онлайн</span>
      <span v-else style="color: orange;">⚠️ Загрузка WS...</span>
      
      <button @click="loadMessages" style="margin-left: 10px;">Обновить</button>
    </div>
    
    <div style="height: 400px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; background: white;">
      <div v-if="messages.length === 0 && !loading">Нет сообщений. Будь первым!</div>
      
      <div v-for="msg in messages" :key="msg.id" 
           style="margin: 8px 0; padding: 10px; border-left: 4px solid #2196F3; background: #E3F2FD;">
        <div style="display: flex; justify-content: space-between;">
          <strong>{{ msg.user }}</strong>
          <small style="color: #666;">ID: {{ msg.id }}</small>
        </div>
        <div style="margin-top: 5px;">{{ msg.text }}</div>
      </div>
    </div>
    
    <div style="margin-top: 15px; display: flex; gap: 10px;">
      <input 
        v-model="newMessage" 
        @keyup.enter="send"
        placeholder="Введите сообщение..."
        style="flex: 1; padding: 10px; border: 1px solid #ccc;"
      />
      <button @click="send" 
              :disabled="!newMessage.trim() || sending"
              style="padding: 10px 20px; background: #2196F3; color: white; border: none;">
        <span v-if="sending">Отправка...</span>
        <span v-else>Отправить</span>
      </button>
    </div>
    
    <div style="margin-top: 20px; padding: 10px; background: #E8F5E9; color: #2E7D32;">
      <div>Техническая информация:</div>
      <div>HTTP: {{ httpStatus }}</div>
      <div>WebSocket: {{ wsStatus }}</div>
      <div>Сообщений: {{ messages.length }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuery, useMutation, useSubscription } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

// GraphQL запросы
const GET_MESSAGES = gql`
  query GetMessages {
    messages {
      id
      text
      user
    }
  }
`

const SEND_MESSAGE = gql`
  mutation SendMessage($text: String!, $user: String!) {
    sendMessage(text: $text, user: $user) {
      id
      text
      user
    }
  }
`

const NEW_MESSAGE = gql`
  subscription NewMessage {
    newMessage {
      id
      text
      user
    }
  }
`

const newMessage = ref('')
const wsConnected = ref(false)
const sending = ref(false)
const username = ref('Пользователь' + Math.floor(Math.random() * 1000))

const { 
  result: messagesResult, 
  loading, 
  error, 
  refetch 
} = useQuery(GET_MESSAGES)

const { onResult: onNewMessage, onError: onWsError } = useSubscription(NEW_MESSAGE)

const { mutate: sendMessage, error: sendError } = useMutation(SEND_MESSAGE)

const messages = computed(() => {
  return messagesResult.value?.messages || []
})

const httpStatus = computed(() => {
  if (loading.value) return 'Загрузка...'
  if (error.value) return 'Ошибка HTTP'
  return '✅ Работает'
})

const wsStatus = computed(() => {
  return wsConnected.value ? '✅ Подключен' : '⏳ Подключение...'
})

async function loadMessages() {
  try {
    await refetch()
    console.log('Сообщения загружены через HTTP:', messages.value.length)
  } catch (e) {
    console.error('Ошибка загрузки через HTTP:', e)
  }
}

async function send() {
  if (!newMessage.value.trim()) return
  
  sending.value = true
  const text = newMessage.value
  newMessage.value = ''
  
  try {
    await sendMessage({
      text,
      user: username.value
    })
    console.log('Сообщение отправлено через HTTP GraphQL')
  } catch (e) {
    console.error('Ошибка отправки через HTTP:', e)
    
    alert('Не удалось отправить сообщение. Проверьте подключение к серверу.')
  } finally {
    sending.value = false
  }
}

onNewMessage((result) => {
  console.log('📨 Получено новое сообщение через WebSocket:', result.data?.newMessage)
  wsConnected.value = true
  loadMessages()
})

onWsError((error) => {
  console.warn('Ошибка WebSocket подписки:', error.message)
  wsConnected.value = false
})

onMounted(() => {
  console.log('Чат инициализирован')
  
  setInterval(() => {
    if (!wsConnected.value) {
      console.log('Проверка WebSocket подключения...')
    }
  }, 5000)
})
</script>