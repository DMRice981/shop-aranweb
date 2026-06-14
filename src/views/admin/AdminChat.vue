<template>
  <div class="admin-chat-page">
    <ChatPanel v-if="admin" user-type="ADMIN" :user-id="admin.id" title="消息管理" />
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ChatPanel from '@/components/ChatPanel.vue'

const router = useRouter()
const auth = inject('auth')
const admin = ref(auth.getAdmin())

onMounted(() => {
  if (!admin.value) {
    ElMessage.warning('请先登录管理员账号')
    router.push('/admin/login')
  }
})
</script>

<style scoped>
.admin-chat-page {
  min-height: 100%;
}
</style>
