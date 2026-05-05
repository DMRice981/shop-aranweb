<template>
  <div class="page">
    <div class="card">
      <h2>注册</h2>
      <input v-model="username" placeholder="用户名" />
      <input v-model="password" type="password" placeholder="密码" />
      <input v-model="phone" placeholder="手机号" />
      <button @click="register">注册</button>
      <p @click="$router.push('/login')">已有账号 → 登录</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const username = ref('')
const password = ref('')
const phone = ref('')

const register = async () => {
  const res = await fetch('/api/user/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
      phone: phone.value,
      status: 1,
      isDelete: 0
    })
  })
  alert('注册成功')
  router.push('/login')
}
</script>

<style scoped>
.page{width:100%;height:100vh;display:flex;align-items:center;justify-content:center;background:#409eff;}
.card{background:#fff;padding:30px;border-radius:12px;width:360px;}
input{width:100%;margin:10px 0;padding:12px;border:1px solid #ddd;border-radius:8px;}
button{width:100%;background:#409eff;color:#fff;padding:12px;border:none;border-radius:8px;margin-top:10px;}
</style>