export default {
  install(app) {
    let socket = null
    let reconnectTimer = null
    let currentUser = null
    const messageListeners = new Set()
    const statusListeners = new Set()
    const connectionListeners = new Set()

    const getWsBaseUrl = () => {
      // 开发环境使用当前页面的协议和主机，让 Vite proxy 转发 WebSocket
      const wsHost = window.location.host
      return `ws://${wsHost}`
    }

    const notifyConnection = (connected) => {
      connectionListeners.forEach(listener => listener(connected))
    }

    const connect = ({ userType, userId }) => {
      if (!userType || !userId) return
      currentUser = { userType, userId }
      if (socket && socket.readyState === WebSocket.OPEN) return
      if (socket) socket.close()

      const wsUrl = `${getWsBaseUrl()}/ws/chat?userType=${encodeURIComponent(userType)}&userId=${encodeURIComponent(userId)}`
      socket = new WebSocket(wsUrl)

      socket.onopen = () => {
        notifyConnection(true)
      }

      socket.onmessage = (event) => {
        const payload = JSON.parse(event.data)
        if (payload.type === 'CHAT_MESSAGE') {
          messageListeners.forEach(listener => listener(payload.data))
        }
        if (payload.type === 'ONLINE_STATUS') {
          statusListeners.forEach(listener => listener(payload.data))
        }
      }

      socket.onclose = () => {
        notifyConnection(false)
        if (currentUser) {
          clearTimeout(reconnectTimer)
          reconnectTimer = setTimeout(() => connect(currentUser), 3000)
        }
      }

      socket.onerror = () => {
        notifyConnection(false)
      }
    }

    const disconnect = () => {
      currentUser = null
      clearTimeout(reconnectTimer)
      if (socket) {
        socket.close()
        socket = null
      }
      notifyConnection(false)
    }

    const sendMessage = (message) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        throw new Error('聊天连接未建立')
      }
      socket.send(JSON.stringify({ type: 'CHAT_MESSAGE', ...message }))
    }

    const chatSocket = {
      connect,
      disconnect,
      sendMessage,
      onMessage(listener) {
        messageListeners.add(listener)
        return () => messageListeners.delete(listener)
      },
      onStatus(listener) {
        statusListeners.add(listener)
        return () => statusListeners.delete(listener)
      },
      onConnection(listener) {
        connectionListeners.add(listener)
        return () => connectionListeners.delete(listener)
      },
      isConnected() {
        return socket && socket.readyState === WebSocket.OPEN
      }
    }

    app.config.globalProperties.$chatSocket = chatSocket
    app.provide('chatSocket', chatSocket)
  }
}
