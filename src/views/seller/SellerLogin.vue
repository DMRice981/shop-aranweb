<template>
  <div class="login-page">
    <div class="box">
      <h2>商家登录</h2>
      <input v-model="username" placeholder="账号" />
      <input v-model="password" type="password" placeholder="密码" />
      <button @click="login">登录</button>
      <div class="tip">
        没有账号？
        <span @click="$router.push('/seller/register')">注册</span>
      </div>
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
  const res = await fetch('/api/seller/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username.value, password: password.value })
  })
  const data = await res.json()
  if (data.code === 200) {
    localStorage.setItem('seller', JSON.stringify(data.data))
    router.push('/seller/index')
  } else {
    alert(data.msg || '登录失败')
  }
}
</script>

<style scoped>
.login-page{width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f5f5;}
.box{width:360px;background:#fff;padding:30px;border-radius:8px;}
input{width:100%;padding:10px;margin:8px 0;box-sizing:border-box;}
button{width:100%;padding:10px;background:#409eff;color:#fff;border:none;margin-top:10px;}
.tip{text-align:center;margin-top:15px;font-size:14px;}
.tip span{color:#409eff;cursor:pointer;}
</style>