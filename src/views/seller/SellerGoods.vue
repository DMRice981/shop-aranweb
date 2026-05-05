<template>
  <div>
    <h3>我的商品</h3>
    <button @click="getList">刷新</button>
    <table border="1" width="100%" cellpadding="6" style="margin-top:10px;">
      <tr><th>商品名</th><th>价格</th><th>状态</th><th>操作</th></tr>
      <tr v-for="g in list" :key="g.id">
        <td>{{g.goodsName}}</td>
        <td>{{g.price}}</td>
        <td>{{g.status===1?'上架':'下架'}}</td>
        <td>
          <button @click="set(g.id,1)">上架</button>
          <button @click="set(g.id,0)">下架</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const list = ref([])
const seller = JSON.parse(localStorage.getItem('seller')||'{}')

const getList = async () => {
  const res = await fetch(`/api/goods/my?sellerId=${seller.id}`)
  const data = await res.json()
  list.value = data.data || []
}

const set = async (id,status) => {
  await fetch(`/api/goods/status?id=${id}&status=${status}`,{method:'POST'})
  getList()
}

onMounted(getList)
</script>