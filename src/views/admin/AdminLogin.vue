<template>
  <div class="login-page">
    <div class="login-box">
      <h2>管理员登录</h2>
      <input v-model="adminName" placeholder="管理员账号">
      <input v-model="password" type="password" placeholder="密码">
      <button @click="login">登录后台</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const adminName = ref('')
const password = ref('')

const login = async () => {
  const res = await fetch('/api/admin/list')
  const list = await res.json()
  const admin = list.find(a => a.adminName === adminName.value && a.password === password.value)
  if(admin){
    localStorage.setItem('adminInfo', JSON.stringify(admin))
    router.push('/admin/index')
  }else{
    alert('账号密码错误')
  }
}
</script>

<style scoped>
.login-page{width:100%;height:100vh;background:#222;display:flex;align-items:center;justify-content:center;}
.login-box{width:350px;background:#fff;padding:30px;border-radius:8px;}
input{width:100%;margin:10px 0;padding:12px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;}
button{width:100%;padding:12px;background:#1989fa;color:#fff;border:none;border-radius:6px;}
</style>