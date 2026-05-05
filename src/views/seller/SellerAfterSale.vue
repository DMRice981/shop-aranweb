<template>
  <div>
    <h3>售后管理</h3>
    <button @click="getList">刷新</button>
    <table border="1" width="100%" cellpadding="6" style="margin-top:10px;">
      <tr><th>原因</th><th>状态</th><th>操作</th></tr>
      <tr v-for="s in list" :key="s.id">
        <td>{{s.reason}}</td>
        <td>{{s.status===0?'待处理':'已处理'}}</td>
        <td><button v-if="s.status===0" @click="handle(s.id)">处理</button></td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const list = ref([])
const seller = JSON.parse(localStorage.getItem('seller')||'{}')

const getList = async () => {
  const res = await fetch(`/api/after-sale/list?sellerId=${seller.id}`)
  const data = await res.json()
  list.value = data.data || []
}

const handle = async (id) => {
  await fetch(`/api/after-sale/handle?id=${id}`,{method:'POST'})
  getList()
}

onMounted(getList)
</script>