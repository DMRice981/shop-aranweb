<template>
  <div class="page">
    <div class="container">
      <h2>我的收货地址</h2>

      <div class="address-list">
        <div class="item" v-for="item in addressList" :key="item.id">
          <div class="line">
            <label>收件人：</label>
            <span>{{ item.name }}</span>
          </div>
          <div class="line">
            <label>电话：</label>
            <span>{{ item.phone }}</span>
          </div>
          <div class="line">
            <label>地址：</label>
            <span>{{ item.province }} {{ item.city }} {{ item.district }}</span>
          </div>
          <div class="line">
            <label>详细地址：</label>
            <span>{{ item.detail }}</span>
          </div>
          <div class="line" v-if="item.isDefault === 1">
            <span class="default-tag">默认地址</span>
          </div>
        </div>
      </div>

      <div class="add-form">
        <h3>新增地址</h3>
        <input v-model="form.name" placeholder="收件人" />
        <input v-model="form.phone" placeholder="手机号" />
        <input v-model="form.province" placeholder="省份" />
        <input v-model="form.city" placeholder="城市" />
        <input v-model="form.district" placeholder="区县" />
        <input v-model="form.detail" placeholder="详细地址" />
        <button @click="addAddress">保存地址</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const user = JSON.parse(localStorage.getItem('user'))

const addressList = ref([])
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
const getAddressList = async () => {
  const res = await fetch('/api/userAddress/list')
  const data = await res.json()
  addressList.value = data.filter(item => item.userId === user.id)
}

// 添加地址（调用你后端 /userAddress/add）
const addAddress = async () => {
  await fetch('/api/userAddress/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  })
  alert('添加成功')
  getAddressList()
  form.value = {
    userId: user.id,
    name: '', phone: '', province: '', city: '', district: '', detail: '', isDefault: 0
  }
}

onMounted(() => {
  getAddressList()
})
</script>

<style scoped>
.page { padding: 20px; max-width: 900px; margin: 0 auto; }
.container { background: #fff; padding: 24px; border-radius: 12px; }
.address-list { margin-bottom: 30px; }
.item { border: 1px solid #eee; padding: 16px; border-radius: 8px; margin-bottom: 12px; }
.line { margin-bottom: 6px; }
.default-tag { color: #1989fa; font-weight: bold; }
.add-form { border-top: 1px solid #eee; padding-top: 20px; }
input { width: 100%; margin-bottom: 10px; padding: 12px; border: 1px solid #ddd; border-radius: 6px; }
button { padding: 12px 20px; background: #1989fa; color: #fff; border: none; border-radius: 6px; }
</style>