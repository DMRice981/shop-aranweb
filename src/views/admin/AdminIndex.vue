<template>
  <el-container class="admin-layout">
    <el-aside width="240px" class="aside">
      <div class="logo">
        <el-icon :size="32"><Setting /></el-icon>
        <span>管理后台</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="menu"
        @select="handleSelect"
        background-color="#1f2937"
        text-color="#9ca3af"
        active-text-color="#fff"
      >
        <el-menu-item index="1">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon><Folder /></el-icon>
          <span>分类管理</span>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon><Goods /></el-icon>
          <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><Picture /></el-icon>
          <span>轮播管理</span>
        </el-menu-item>
        <el-menu-item index="5">
          <el-icon><Document /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="0" @click="$router.push('/')">
          <el-icon><SwitchButton /></el-icon>
          <span>退出前台</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-main class="main">
      <UserManage v-if="page === 1" />
      <CategoryManage v-if="page === 2" />
      <GoodsManage v-if="page === 3" />
      <BannerManage v-if="page === 4" />
      <OrderManage v-if="page === 5" />
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import UserManage from './UserManage.vue'
import CategoryManage from './CategoryManage.vue'
import GoodsManage from './GoodsManage.vue'
import BannerManage from './BannerManage.vue'
import OrderManage from './OrderManage.vue'

const page = ref(1)
const activeMenu = ref('1')

const handleSelect = (index) => {
  activeMenu.value = index
  if (index === '0') return
  page.value = parseInt(index)
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}

.aside {
  background-color: #1f2937;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 20px;
  font-weight: 700;
  border-bottom: 1px solid #374151;
}

.menu {
  flex: 1;
  border: none;
}

.main {
  background-color: #f3f4f6;
  padding: 24px;
  overflow-y: auto;
}
</style>
