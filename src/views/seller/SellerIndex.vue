<template>
  <div class="layout">
    <div class="menu">
      <div class="title">商家中心</div>
      <div class="item" :class="{active:page===0}" @click="page=0">商品管理</div>
      <div class="item" :class="{active:page===1}" @click="page=1">售后管理</div>
      <div class="item logout" @click="res.json()logout">退出</div>
    </div>
    <div class="content">
      <SellerGoods v-if="page===0" />
      <SellerAfterSale v-if="page===1" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SellerGoods from './SellerGoods.vue'
import SellerAfterSale from './SellerAfterSale.vue'
const router = useRouter()
const page = ref(0)

const logout = () => {
  localStorage.removeItem('seller')
  router.push('/seller/login')
}
</script>

<style scoped>
.layout{display:flex;height:100vh;}
.menu{width:200px;background:#2f3542;color:#fff;padding:20px;}
.title{text-align:center;font-size:18px;margin-bottom:20px;}
.item{padding:12px;cursor:pointer;}
.item.active{background:#409eff;}
.logout{margin-top:30px;color:#ff6b6b;}
.content{flex:1;padding:20px;overflow:auto;}
</style>