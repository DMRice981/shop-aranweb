<template>
  <div class="comment-wrap">
    <h2>商品评价</h2>
    <div class="c-item" v-for="item in commentList" :key="item.id">
      <p>评分：{{ item.score }} 星</p>
      <p>评价内容：{{ item.content }}</p>
      <p>评价时间：{{ item.createTime }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const commentList = ref([])

onMounted(async () => {
  const res = await fetch('/api/comment/list')
  const result = await res.json()
  commentList.value = result.data || result
})
</script>

<style scoped>
.comment-wrap{max-width:900px;margin:40px auto;}
.c-item{border-bottom:1px solid #eee;padding:15px 0;}
</style>