<template>
  <div class="detail">
    <img :src="info.goods_img" />
    <h2>{{ info.goods_name }}</h2>
    <p class="price">¥{{ info.price }}</p>
    <p>{{ info.goods_desc }}</p>
    <button @click="addCart">加入购物车</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const info = ref({})

onMounted(async () => {
  const res = await fetch(`/api/goods/get/${route.params.id}`).then(r => r.json())
  info.value = res
})

const addCart = async () => {
  const user = JSON.parse(localStorage.getItem('user'))
  await fetch('/api/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user.id,
      goodsId: route.params.id,
      num: 1
    })
  })
  alert('加入成功')
}
</script>

<style scoped>
.detail{max-width:900px;margin:50px auto;}
img{width:100%;max-height:400px;object-fit:cover;border-radius:12px;}
.price{color:red;font-size:24px;font-weight:bold;}
button{background:#409eff;color:#fff;border:none;padding:12px 24px;border-radius:8px;margin-top:20px;}
</style>