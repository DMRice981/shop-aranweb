<template>
  <div class="login-page">
    <div class="login-container">
      <el-card class="login-card" shadow="hover">
        <div class="login-header">
          <div class="logo-section">
            <el-icon :size="48" color="#667eea"><Setting /></el-icon>
            <h1>管理后台</h1>
          </div>
          <p>请登录以继续</p>
        </div>

        <el-form :model="form" class="login-form">
          <el-form-item>
            <el-input
              v-model="form.adminName"
              placeholder="请输入管理员账号"
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
  adminName: '',
  password: ''
})

const login = async () => {
  if (!form.value.adminName || !form.value.password) {
    ElMessage.warning('请输入账号和密码')
    return
  }

  loading.value = true
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const result = await res.json()
    
    if (result.code === 200) {
      localStorage.setItem('adminInfo', JSON.stringify(result.data))
      ElMessage.success('登录成功')
      router.push('/admin/index')
    } else {
      ElMessage.error(result.msg || '账号或密码错误')
    }
  } catch (error) {
    ElMessage.error('登录失败，请稍后重试')
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
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.login-button:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

.back-home {
  text-align: center;
  padding-top: 10px;
  padding-bottom: 20px;
}
</style>
