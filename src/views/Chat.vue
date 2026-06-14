<template>
  <div class="chat-page">
    <ChatPanel v-if="user" user-type="USER" :user-id="user.id" title="我的消息" />
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ChatPanel from '@/components/ChatPanel.vue'

const router = useRouter()
const auth = inject('auth')
const user = ref(auth.getUser())

onMounted(() => {
  if (!user.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
  }
})
</script>

<style scoped>
.chat-page {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
