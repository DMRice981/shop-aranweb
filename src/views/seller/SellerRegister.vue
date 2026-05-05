<template>
  <div class="register-page">
    <div class="box">
      <h2>商家注册</h2>
      <input v-model="username" placeholder="账号" />
      <input v-model="password" placeholder="密码" type="password" />
      <input v-model="shopName" placeholder="店铺名" />
      <input v-model="phone" placeholder="电话" />
      <button @click="register">注册</button>
      <div class="tip">
        已有账号？
        <span @click="$router.push('/seller/login')">去登录</span>
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
const shopName = ref('')
const phone = ref('')

const register = async () => {
  if (!username.value || !password.value) {
    alert('账号和密码不能为空')
    return
  }

  try {
    const res = await fetch('/api/seller/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        shopName: shopName.value,
        phone: phone.value
      })
    })
    const data = await res.json()
    if (data.code === 200) {
      alert('注册成功，请登录')
      router.push('/seller/login')
    } else {
      alert(data.msg || '注册失败')
    }
  } catch (err) {
    console.error(err)
    alert('请求出错，请检查后端服务是否启动')
  }
}
</script>

<style scoped>
.register-page{
  width:100vw;
  height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#f5f5f5;
}
.box{
  width:360px;
  background:#fff;
  padding:30px;
  border-radius:8px;
}
input{
  width:100%;
  padding:10px;
  margin:8px 0;
  box-sizing:border-box;
}
button{
  width:100%;
  padding:10px;
  background:#409eff;
  color:#fff;
  border:none;
  margin-top:10px;
  border-radius:4px;
}
.tip{
  text-align:center;
  margin-top:15px;
  font-size:14px;
}
.tip span{
  color:#409eff;
  cursor:pointer;
}
</style>