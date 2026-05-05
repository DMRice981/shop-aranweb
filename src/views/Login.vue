<template>
  <div class="page">
    <div class="card">
      <h2>登录</h2>
      <input v-model="username" placeholder="用户名" />
      <input v-model="password" type="password" placeholder="密码" />
      <button @click="login">登录</button>
      <p @click="$router.push('/register')">注册</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const username = ref('')
const password = ref('')

const login = async () => {
  const list = await fetch('/api/user/list').then(r => r.json())
  const user = list.find(u => u.username === username.value && u.password === password.value)
  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
    router.push('/')
  } else {
    alert('账号密码错误')
  }
}
</script>

<style scoped>
.page{width:100%;height:100vh;display:flex;align-items:center;justify-content:center;background:#409eff;}
.card{background:#fff;padding:30px;border-radius:12px;width:360px;}
input{width:100%;margin:10px 0;padding:12px;border:1px solid #ddd;border-radius:8px;}
button{width:100%;background:#409eff;color:#fff;padding:12px;border:none;border-radius:8px;margin-top:10px;}
</style>