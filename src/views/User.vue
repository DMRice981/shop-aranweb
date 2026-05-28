<template>
  <div class="user-page">
    <div class="user-container">
      <el-page-header @back="$router.push('/')" content="返回首页" class="page-header" />
      
      <el-card class="user-card" shadow="hover">
        <div class="user-info">
          <div class="avatar">
            <el-icon :size="64"><User /></el-icon>
          </div>
          <div class="info">
            <h3>{{ user?.username || '用户' }}</h3>
            <p>欢迎回来</p>
          </div>
        </div>
        <el-divider />
        <div class="quick-menu">
          <div class="menu-item" @click="$router.push('/order')">
            <el-icon :size="28"><Document /></el-icon>
            <span>我的订单</span>
          </div>
          <div class="menu-item" @click="$router.push('/after-sale')">
            <el-icon :size="28"><Service /></el-icon>
            <span>我的售后</span>
          </div>
          <div class="menu-item" @click="$router.push('/address')">
            <el-icon :size="28"><Location /></el-icon>
            <span>收货地址</span>
          </div>
          <div class="menu-item" @click="$router.push('/cart')">
            <el-icon :size="28"><ShoppingCart /></el-icon>
            <span>我的购物车</span>
          </div>
        </div>
        <el-divider />
        <el-button type="danger" class="logout-btn" @click="logout">
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-button>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const auth = inject('auth')
const user = ref(auth.getUser())

const logout = () => {
  auth.logout()
  user.value = null
  ElMessage.success('退出成功')
  // 使用 reload 来确保所有组件状态都被重置
  window.location.href = '/login'
}

onMounted(() => {
  if (!user.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
  }
})
</script>

<style scoped>
.user-page {
  min-height: 100vh;
  padding: 20px;
}

.user-container {
  max-width: 600px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

:deep(.el-page-header__inner),
:deep(.el-page-header__title),
:deep(.el-page-header__content) {
  color: white;
}

.user-card {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.98);
  border: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
}

.avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.info h3 {
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 700;
}

.info p {
  margin: 8px 0 0 0;
  color: #666;
  font-size: 16px;
}

.quick-menu {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 20px 0;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  background: linear-gradient(135deg, #f0f3ff 0%, #e0e7ff 100%);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-item:hover {
  transform: translateY(-4px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.menu-item span {
  font-size: 14px;
  font-weight: 600;
}

.logout-btn {
  width: 100%;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .user-page {
    padding: 12px;
  }
  
  .quick-menu {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
