<template>
  <div class="login-page">
    <div class="login-container">
      <el-card class="login-card" shadow="hover">
        <div class="login-header">
          <div class="logo-section">
            <el-icon :size="48" color="#059669"><OfficeBuilding /></el-icon>
            <h1>商家中心</h1>
          </div>
          <p>欢迎回来，请登录</p>
        </div>

        <el-form :model="form" class="login-form">
          <el-form-item>
            <el-input
              v-model="form.username"
              placeholder="请输入账号"
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
              @keyup.enter="login"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="login-button"
              :loading="loading"
              @click="login"
            >
              <el-icon><User /></el-icon>
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-footer">
          <span>没有账号?</span>
          <el-link type="primary" @click="$router.push('/seller/register')">立即注册</el-link>
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
  password: ''
})

const login = async () => {
  if (!form.value.username || !form.value.password) {
    ElMessage.warning('请输入账号和密码')
    return
  }

  loading.value = true
  try {
    const res = await fetch('/api/seller/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const data = await res.json()
    
    if (data.code === 200) {
      localStorage.setItem('seller', JSON.stringify(data.data))
      ElMessage.success('登录成功')
      router.push('/seller/index')
    } else {
      ElMessage.error(data.msg || '登录失败')
    }
  } catch (error) {
    ElMessage.error('请求出错，请检查后端服务')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-card {
  border-radius: 24px;
  border: none;
  background: rgba(255, 255, 255, 0.98);
}

.login-header {
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

.login-header p {
  color: #666;
  font-size: 15px;
  margin: 0;
}

.login-form {
  padding: 0 20px;
}

.login-button {
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  border: none;
}

.login-button:hover {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
}

.login-footer {
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
</style>
