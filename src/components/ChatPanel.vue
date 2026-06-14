<template>
  <div class="chat-panel">
    <aside class="conversation-list">
      <div class="panel-header">
        <div>
          <h2>{{ title }}</h2>
          <p>{{ connected ? '实时连接中' : '正在连接...' }}</p>
        </div>
        <el-button type="primary" :icon="IconPlus" circle @click="contactDialogVisible = true" />
      </div>

      <el-input v-model="conversationKeyword" placeholder="搜索会话" clearable class="search-input" />

      <div class="conversation-items" v-loading="loadingConversations">
        <div
          v-for="item in filteredConversations"
          :key="item.id"
          class="conversation-item"
          :class="{ active: currentConversation?.id === item.id }"
          @click="selectConversation(item)"
        >
          <div class="avatar">{{ getInitial(item.targetName) }}</div>
          <div class="conversation-info">
            <div class="conversation-title">
              <span>{{ item.targetName }}</span>
              <el-badge v-if="item.unreadCount" :value="item.unreadCount" class="unread-badge" />
            </div>
            <div class="conversation-meta">
              <span>{{ getRoleText(item.targetType) }}</span>
              <span :class="item.online ? 'online' : 'offline'">{{ item.online ? '在线' : '离线' }}</span>
            </div>
            <div class="last-message">{{ item.lastMessage || '暂无消息' }}</div>
          </div>
        </div>
        <el-empty v-if="filteredConversations.length === 0 && !loadingConversations" description="暂无会话" />
      </div>
    </aside>

    <main class="message-area">
      <template v-if="currentConversation">
        <div class="message-header">
          <div class="avatar large">{{ getInitial(currentConversation.targetName) }}</div>
          <div>
            <h3>{{ currentConversation.targetName }}</h3>
            <p>{{ getRoleText(currentConversation.targetType) }} · {{ currentConversation.online ? '在线' : '离线' }}</p>
          </div>
        </div>

        <div class="message-list" ref="messageListRef" v-loading="loadingMessages">
          <div
            v-for="message in messages"
            :key="message.id"
            class="message-row"
            :class="isSelf(message) ? 'self' : 'other'"
          >
            <div class="message-bubble">
              <div class="message-content">{{ message.content }}</div>
              <div class="message-time">{{ message.createTime }}</div>
            </div>
          </div>
        </div>

        <div class="message-input">
          <el-input
            v-model="messageText"
            type="textarea"
            :rows="3"
            resize="none"
            placeholder="输入消息，Ctrl + Enter 发送"
            @keydown.ctrl.enter.prevent="sendMessage"
          />
          <el-button type="primary" :icon="IconPosition" :loading="sending" @click="sendMessage">发送</el-button>
        </div>
      </template>
      <el-empty v-else description="请选择或新建一个会话" />
    </main>

    <el-dialog v-model="contactDialogVisible" title="选择联系人" width="520px">
      <el-input v-model="contactKeyword" placeholder="搜索用户、商家或管理员" clearable @keyup.enter="loadContacts">
        <template #append>
          <el-button :icon="IconSearch" @click="loadContacts" />
        </template>
      </el-input>
      <div class="contact-list" v-loading="loadingContacts">
        <div v-for="contact in contacts" :key="`${contact.userType}-${contact.userId}`" class="contact-item" @click="startConversation(contact)">
          <div class="avatar">{{ getInitial(contact.displayName) }}</div>
          <div>
            <div class="contact-name">{{ contact.displayName }}</div>
            <div class="contact-extra">{{ getRoleText(contact.userType) }} {{ contact.extra ? `· ${contact.extra}` : '' }}</div>
          </div>
        </div>
        <el-empty v-if="contacts.length === 0 && !loadingContacts" description="暂无联系人" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus as IconPlus, Search as IconSearch, Position as IconPosition } from '@element-plus/icons-vue'

const props = defineProps({
  userType: { type: String, required: true },
  userId: { type: Number, required: true },
  title: { type: String, default: '消息中心' }
})

const route = useRoute()
const http = inject('http')
const chatSocket = inject('chatSocket')

const conversations = ref([])
const messages = ref([])
const contacts = ref([])
const currentConversation = ref(null)
const conversationKeyword = ref('')
const contactKeyword = ref('')
const messageText = ref('')
const contactDialogVisible = ref(false)
const loadingConversations = ref(false)
const loadingMessages = ref(false)
const loadingContacts = ref(false)
const sending = ref(false)
const connected = ref(false)
const messageListRef = ref(null)
let offMessage = null
let offStatus = null
let offConnection = null

const filteredConversations = computed(() => {
  const keyword = conversationKeyword.value.trim()
  if (!keyword) return conversations.value
  return conversations.value.filter(item => item.targetName?.includes(keyword) || item.lastMessage?.includes(keyword))
})

const loadConversations = async () => {
  loadingConversations.value = true
  try {
    const res = await http.get('/chat/conversations', { userType: props.userType, userId: props.userId })
    conversations.value = res.data || []
  } finally {
    loadingConversations.value = false
  }
}

const loadMessages = async () => {
  if (!currentConversation.value) return
  loadingMessages.value = true
  try {
    const res = await http.get('/chat/messages', { conversationId: currentConversation.value.id, pageNum: 1, pageSize: 100 })
    messages.value = res.data?.list || []
    await http.put(`/chat/read/${currentConversation.value.id}?userType=${props.userType}&userId=${props.userId}`)
    await loadConversations()
    scrollToBottom()
  } finally {
    loadingMessages.value = false
  }
}

const loadContacts = async () => {
  loadingContacts.value = true
  try {
    const res = await http.get('/chat/contacts', { userType: props.userType, userId: props.userId, keyword: contactKeyword.value })
    contacts.value = res.data || []
  } finally {
    loadingContacts.value = false
  }
}

const selectConversation = async (conversation) => {
  currentConversation.value = conversation
  await loadMessages()
}

const startConversation = async (contact) => {
  const res = await http.post('/chat/conversation', {
    userType: props.userType,
    userId: props.userId,
    targetType: contact.userType,
    targetId: contact.userId
  })
  if (res.code !== 200) {
    ElMessage.error(res.msg || '创建会话失败')
    return
  }
  contactDialogVisible.value = false
  await loadConversations()
  const conversation = conversations.value.find(item => item.id === res.data.id)
  if (conversation) {
    await selectConversation(conversation)
  }
}

const sendMessage = async () => {
  if (!currentConversation.value) return
  const content = messageText.value.trim()
  if (!content) {
    ElMessage.warning('请输入消息内容')
    return
  }
  sending.value = true
  try {
    chatSocket.sendMessage({
      conversationId: currentConversation.value.id,
      receiverType: currentConversation.value.targetType,
      receiverId: currentConversation.value.targetId,
      messageType: 'TEXT',
      content
    })
    messageText.value = ''
  } catch (e) {
    ElMessage.error(e.message || '发送失败')
  } finally {
    sending.value = false
  }
}

const handleIncomingMessage = async (message) => {
  if (currentConversation.value && message.conversationId === currentConversation.value.id) {
    if (!messages.value.some(item => item.id === message.id)) {
      messages.value.push(message)
      scrollToBottom()
    }
    await http.put(`/chat/read/${currentConversation.value.id}?userType=${props.userType}&userId=${props.userId}`)
  }
  await loadConversations()
}

const handleStatus = (status) => {
  conversations.value = conversations.value.map(item => {
    if (item.targetType === status.userType && item.targetId === status.userId) {
      return { ...item, online: status.online }
    }
    return item
  })
  if (currentConversation.value?.targetType === status.userType && currentConversation.value?.targetId === status.userId) {
    currentConversation.value = { ...currentConversation.value, online: status.online }
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

const getInitial = (name) => {
  return name ? name.slice(0, 1).toUpperCase() : '?'
}

const getRoleText = (type) => {
  const map = { USER: '用户', SELLER: '商家', ADMIN: '管理员' }
  return map[type] || type
}

const isSelf = (message) => {
  return message.senderType === props.userType && message.senderId === props.userId
}

watch(contactDialogVisible, (visible) => {
  if (visible) loadContacts()
})

onMounted(async () => {
  chatSocket.connect({ userType: props.userType, userId: props.userId })
  offMessage = chatSocket.onMessage(handleIncomingMessage)
  offStatus = chatSocket.onStatus(handleStatus)
  offConnection = chatSocket.onConnection(value => connected.value = value)
  await loadConversations()
  const targetType = route.query.targetType
  const targetId = Number(route.query.targetId)
  if (targetType && targetId) {
    await startConversation({ userType: String(targetType).toUpperCase(), userId: targetId })
  }
})

onBeforeUnmount(() => {
  if (offMessage) offMessage()
  if (offStatus) offStatus()
  if (offConnection) offConnection()
})
</script>

<style scoped>
.chat-panel {
  height: calc(100vh - 40px);
  display: grid;
  grid-template-columns: 320px 1fr;
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
}

.conversation-list {
  border-right: 1px solid #edf0f5;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

.panel-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h2,
.message-header h3 {
  margin: 0;
  color: #1f2937;
}

.panel-header p,
.message-header p {
  margin: 6px 0 0;
  color: #909399;
  font-size: 13px;
}

.search-input {
  padding: 0 16px 16px;
}

.conversation-items,
.contact-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px 16px;
}

.conversation-item,
.contact-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.conversation-item:hover,
.contact-item:hover,
.conversation-item.active {
  background: #eef2ff;
}

.avatar {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.avatar.large {
  width: 52px;
  height: 52px;
  flex-basis: 52px;
}

.conversation-info {
  min-width: 0;
  flex: 1;
}

.conversation-title {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-weight: 700;
  color: #1f2937;
}

.conversation-meta,
.contact-extra,
.last-message {
  color: #909399;
  font-size: 12px;
  margin-top: 4px;
}

.conversation-meta {
  display: flex;
  gap: 8px;
}

.last-message {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.online {
  color: #67c23a;
}

.offline {
  color: #c0c4cc;
}

.message-area {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.message-header {
  height: 76px;
  padding: 12px 20px;
  border-bottom: 1px solid #edf0f5;
  display: flex;
  align-items: center;
  gap: 12px;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.message-row {
  display: flex;
  margin-bottom: 14px;
}

.message-row.self {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 62%;
  padding: 12px 14px;
  border-radius: 16px;
  background: #eef2ff;
  color: #1f2937;
}

.message-row.self .message-bubble {
  background: #667eea;
  color: #fff;
}

.message-content {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
}

.message-time {
  margin-top: 6px;
  font-size: 11px;
  opacity: 0.72;
  text-align: right;
}

.message-input {
  padding: 16px;
  border-top: 1px solid #edf0f5;
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.contact-list {
  max-height: 420px;
  margin-top: 16px;
}

.contact-name {
  font-weight: 700;
  color: #1f2937;
}

@media (max-width: 900px) {
  .chat-panel {
    grid-template-columns: 1fr;
    height: auto;
    min-height: calc(100vh - 24px);
  }

  .conversation-list {
    border-right: none;
    border-bottom: 1px solid #edf0f5;
    max-height: 360px;
  }

  .message-list {
    min-height: 420px;
  }
}
</style>
