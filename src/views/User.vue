<template>
  <div class="addr-wrap">
    <h2>我的收货地址</h2>
    <div class="addr-item" v-for="item in addrList" :key="item.id">
      <p>收件人：{{ item.name }}</p>
      <p>手机号：{{ item.phone }}</p>
      <p>地址：{{ item.province }} {{ item.city }} {{ item.district }} {{ item.detail }}</p>
      <p v-if="item.isDefault === 1">默认地址</p>
    </div>

    <div class="add-form">
      <h3>新增地址</h3>
      <input v-model="form.name" placeholder="收件人">
      <input v-model="form.phone" placeholder="手机号">
      <input v-model="form.province" placeholder="省份">
      <input v-model="form.city" placeholder="城市">
      <input v-model="form.district" placeholder="区县">
      <input v-model="form.detail" placeholder="详细地址">
      <button @click="addAddr">保存地址</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = JSON.parse(localStorage.getItem('user') || 'null')
const addrList = ref([])

const form = ref({
  userId: user.id,
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: 0
})

// 获取地址列表
const getList = async () => {
  const res = await fetch('/api/userAddress/list')
  const all = await res.json()
  addrList.value = all.filter(item => item.userId === user.id)
}

onMounted(() => {
  getList()
})

// 新增地址
const addAddr = async () => {
  await fetch('/api/userAddress/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  })
  alert('地址添加成功')
  getList()
  // 清空表单
  form.value = { userId: user.id, name: '', phone: '', province: '', city: '', district: '', detail: '', isDefault: 0 }
}
</script>

<style scoped>
.addr-wrap{max-width:900px;margin:40px auto;padding:0 20px;}
.addr-item{border:1px solid #eee;padding:15px;border-radius:8px;margin-bottom:15px;}
.add-form{margin-top:30px;border-top:1px solid #eee;padding-top:20px;}
input{display:block;width:100%;margin:8px 0;padding:10px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;}
button{padding:10px 20px;background:#409eff;color:#fff;border:none;border-radius:6px;}
</style>