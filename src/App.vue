<template>
  <div id="app">    
    <main style="padding: 20px;">
      <Chat />
    </main>
    
    <footer style="margin-top: 30px; padding: 20px; background: #f5f5f5; text-align: center; color: #666;">
      <div>Сервер: http://localhost:4000</div>
      <div>WebSocket: ws://localhost:4000/graphql</div>
    </footer>
  </div>
</template>

<script setup>
import Chat from './components/Chat.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

button {
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input:focus {
  outline: 2px solid #2196F3;
}
</style>