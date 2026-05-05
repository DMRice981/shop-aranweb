<template>
  <div>
    <h2>订单管理</h2>
    <button @click="getList()">刷新</button>

    <table border="1" cellpadding="6" cellspacing="0" style="width:100%;margin:15px 0;">
      <thead>
      <tr>
        <th>ID</th>
        <th>订单号</th>
        <th>用户ID</th>
        <th>总价</th>
        <th>支付状态</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in list" :key="item.id">
        <td>{{item.id}}</td>
        <td>{{item.orderNo}}</td>
        <td>{{item.userId}}</td>
        <td>{{item.totalPrice}}</td>
        <td>{{item.payStatus===1?'已支付':'未支付'}}</td>
        <td>
          <button @click="del(item.id)">删除</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
let list = ref([])

const getList = async () => {
  try {
    const res = await fetch('/api/order/list')
    const data = await res.json()
    list.value = Array.isArray(data) ? data : []
  } catch (e) {
    list.value = []
  }
}

const del = async (id) => {
  if (!confirm('确定删除订单？')) return
  try {
    await fetch(`/api/order/delete/${id}`, { method: 'DELETE' })
    getList()
  } catch (e) {
    alert('删除失败')
  }
}

onMounted(getList)
</script>