<template>
  <div>
    <h1>用户列表</h1>
    <table border="1" width="100%">
      <tr>
        <th>ID</th>
        <th>用户名</th>
        <th>手机号</th>
      </tr>
      <tr v-for="item in list" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.username }}</td>
        <td>{{ item.phone }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUserList } from '@/api/user'

const list = ref([])
onMounted(async () => {
  const res = await getUserList()
  list.value = res.data
})
</script>