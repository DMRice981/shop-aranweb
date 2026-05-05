<template>
  <div class="admin-layout">
    <div class="left-menu">
      <div class="title">管理后台</div>
      <div class="menu-item" @click="page = 0">用户管理</div>
      <div class="menu-item" @click="page = 1">分类管理</div>
      <div class="menu-item" @click="page = 2">商品管理</div>
      <div class="menu-item" @click="page = 3">轮播管理</div>
      <div class="menu-item" @click="page = 4">订单管理</div>
      <div class="menu-item exit" @click="$router.push('/')">退出前台</div>
    </div>

    <div class="main-content">
      <UserManage v-if="page===0"/>
      <CategoryManage v-if="page===1"/>
      <GoodsManage v-if="page===2"/>
      <BannerManage v-if="page===3"/>
      <OrderManage v-if="page===4"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserManage from './UserManage.vue'
import CategoryManage from './CategoryManage.vue'
import GoodsManage from './GoodsManage.vue'
import BannerManage from './BannerManage.vue'
import OrderManage from './OrderManage.vue'

const page = ref(0)
</script>

<style scoped>
.admin-layout {
  display: flex;
  width: 100vw;
  height: 100vh;
}
.left-menu {
  width: 200px;
  background: #2f3542;
  color: #fff;
  padding-top: 20px;
}
.title {
  text-align: center;
  font-size: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #555;
}
.menu-item {
  padding: 12px 20px;
  cursor: pointer;
}
.menu-item:hover {
  background: #409eff;
}
.exit {
  margin-top: 30px;
  color: #ff6b6b;
}
.main-content {
  flex: 1;
  padding: 20px;
  overflow: auto;
}
</style>