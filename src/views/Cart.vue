<template>
  <div class="cart">
    <h2>购物车</h2>
    <div v-for="item in list" :key="item.id" class="item">
      <div>{{ item.goodsId }}</div>
      <div>x{{ item.num }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const list = ref([])

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const all = await fetch('/api/cart/list').then(r => r.json())
  list.value = all.filter(c => c.userId === user.id)
})
</script>

<style scoped>
.cart{max-width:1000px;margin:50px auto;}
.item{padding:10px;border-bottom:1px solid #eee;}
</style>