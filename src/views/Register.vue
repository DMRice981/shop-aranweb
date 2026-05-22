<template>
  <div class="register-page">
    <div class="register-container">
      <el-card class="register-card" shadow="hover">
        <div class="register-header">
          <div class="logo-section">
            <el-icon :size="48" color="#667eea"><Shop /></el-icon>
            <h1>Aran Shop</h1>
          </div>
          <p>创建账号，开启购物之旅</p>
        </div>

        <el-form :model="form" class="register-form">
          <el-form-item>
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              size="large"
              prefix-icon="User"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号"
              size="large"
              prefix-icon="Phone"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="register-button"
              :loading="loading"
              @click="register"
            >
              <el-icon><EditPen /></el-icon>
              注册
            </el-button>
          </el-form-item>
        </el-form>

        <div class="register-footer">
          <span>已有账号？</span>
          <el-link type="primary" @click="$router.push('/login')">立即登录</el-link>
        </div>

        <div class="back-home">
          <el-button link @click="$router.push('/')">
            <el-icon><ArrowLeft /></el-icon>
            返回首页
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const form = ref({
  username: '',
  password: '',
  phone: '',
  status: 1,
  isDelete: 0
})

const register = async () => {
  if (!form.value.username || !form.value.password) {
    ElMessage.warning('请填写用户名和密码')
    return
  }

  loading.value = true
  try {
    const res = await fetch('/api/user/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    
    if (res.ok) {
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    } else {
      ElMessage.error('注册失败')
    }
  } catch (error) {
    ElMessage.error('注册失败，请稍后重试')
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
}

.register-container {
  width: 100%;
  max-width: 420px;
}

.register-card {
  border-radius: 24px;
  border: none;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.register-button:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
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
  box-shadow: 0 0 0 1px #667eea inset;
}
</style>
