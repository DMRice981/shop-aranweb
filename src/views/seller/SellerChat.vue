<template>
  <div class="seller-chat-page">
    <ChatPanel v-if="seller" user-type="SELLER" :user-id="seller.id" title="商家消息" />
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ChatPanel from '@/components/ChatPanel.vue'

const router = useRouter()
const auth = inject('auth')
const seller = ref(auth.getSeller())

onMounted(() => {
  if (!seller.value) {
    ElMessage.warning('请先登录商家账号')
    router.push('/seller/login')
  }
})
</script>

<style scoped>
.seller-chat-page {
  min-height: 100%;
}
</style>
