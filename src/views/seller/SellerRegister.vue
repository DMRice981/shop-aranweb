<template>
  <div class="register-page">
    <div class="register-container">
      <el-card class="register-card" shadow="hover">
        <div class="register-header">
          <div class="logo-section">
            <el-icon :size="48" color="#059669"><component :is="IconOfficeBuilding" /></el-icon>
            <h1>商家注册</h1>
          </div>
          <p>创建您的商家账号</p>
        </div>

        <el-form :model="form" class="register-form">
          <el-form-item>
            <el-input 
              v-model="form.username" 
              placeholder="请输入账号" 
              size="large" 
              :prefix-icon="IconUser" />
          </el-form-item>
          <el-form-item>
            <el-input 
              v-model="form.password" 
              type="password" 
              placeholder="请输入密码" 
              size="large" 
              :prefix-icon="IconLock" 
              show-password />
          </el-form-item>
          <el-form-item>
            <el-input 
              v-model="form.shopName" 
              placeholder="请输入店铺名" 
              size="large" 
              :prefix-icon="IconShop" />
          </el-form-item>
          <el-form-item>
            <el-input 
              v-model="form.phone" 
              placeholder="请输入电话" 
              size="large" 
              :prefix-icon="IconPhone" />
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              size="large" 
              class="register-button" 
              :loading="loading" 
              @click="register">
              <el-icon><component :is="IconEditPen" /></el-icon>
              注册
            </el-button>
          </el-form-item>
        </el-form>

        <div class="register-footer">
          <span>已有账号？</span>
          <el-link type="primary" @click="$router.push('/seller/login')">立即登录</el-link>
        </div>

        <div class="back-home">
          <el-button link @click="$router.push('/')">
            <el-icon><component :is="IconArrowLeft" /></el-icon>
            返回首页
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  OfficeBuilding as IconOfficeBuilding,
  EditPen as IconEditPen,
  ArrowLeft as IconArrowLeft,
  User as IconUser,
  Lock as IconLock,
  Shop as IconShop,
  Phone as IconPhone
} from '@element-plus/icons-vue'

const router = useRouter()
const http = inject('http')
const loading = ref(false)
const form = ref({
  username: '',
  password: '',
  shopName: '',
  phone: ''
})

const register = async () => {
  if (!form.value.username || !form.value.password) {
    ElMessage.warning('账号和密码不能为空')
    return
  }

  loading.value = true
  try {
    const data = await http.post('/seller/register', form.value)
    
    if (data.code === 200) {
      ElMessage.success('注册成功，请登录')
      router.push('/seller/login')
    } else {
      ElMessage.error(data.msg || '注册失败')
    }
  } catch (error) {
    ElMessage.error('请求出错，请检查后端服务是否启动')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.register-container {
  width: 100%;
  max-width: 420px;
}

.register-card {
  border-radius: 24px;
  border: none;
  background: rgba(255, 255, 255, 0.98);
}

.register-header {
  text-align: center;
  padding: 20px 0 30px;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}

.logo-section h1 {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.register-header p {
  color: #666;
  font-size: 15px;
  margin: 0;
}

.register-form {
  padding: 0 20px;
}

.register-button {
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  border: none;
}

.register-button:hover {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
}

.register-footer {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
}

.back-home {
  text-align: center;
  padding-top: 10px;
  padding-bottom: 20px;
}

:deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 0 0 1px #e0e0e0 inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #059669 inset;
}
</style>
