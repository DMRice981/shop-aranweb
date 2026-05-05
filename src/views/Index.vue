<template>
  <div class="home">
    <div class="header">
      <div class="logo">商城首页</div>
      <div class="nav">
        <button @click="$router.push('/')">首页</button>
        <button @click="$router.push('/cart')">购物车</button>

        <button v-if="!user" @click="$router.push('/login')">登录</button>
        <button v-if="!user" @click="$router.push('/register')">注册</button>

        <button v-if="user" @click="$router.push('/user')">个人中心</button>
        <button v-if="user" @click="logout">退出登录</button>
      </div>
    </div>

    <div class="banner">
      <h1>欢迎来到商城</h1>
    </div>

    <div class="title">商品列表</div>
    <div class="list">
      <div v-for="item in goods" :key="item.id" class="card">
        <img :src="item.goods_img" alt="商品图" />
        <h3>{{ item.goods_name }}</h3>
        <p class="price">¥{{ item.price }}</p>
        <button @click="$router.push(`/goods/${item.id}`)">查看详情</button>
      </div>
    </div>

    <!-- 后台入口 -->
    <div class="admin-entry">
      <button @click="$router.push('/admin/login')" class="admin-btn">
        管理员后台入口
      </button>

      <!-- 👇 这里是我加的 商家入口 -->
      <button @click="$router.push('/seller/login')" class="seller-btn">
        商家中心入口
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const goods = ref([])

onMounted(async () => {
  const res = await fetch('/api/goods/list')
  goods.value = await res.json()
})

const logout = () => {
  localStorage.removeItem('user')
  user.value = null
  router.push('/')
}
</script>

<style scoped>
.home { max-width: 1200px; margin: 0 auto; padding: 20px; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.logo { font-size: 24px; font-weight: bold; }
.nav button { margin-left: 10px; padding: 6px 12px; background: #409eff; color: #fff; border: none; border-radius: 4px; cursor: pointer; }

.banner { height: 240px; background: #409eff; color: #fff; display: flex; align-items: center; justify-content: center; border-radius: 12px; margin-bottom: 30px; font-size: 28px; }

.title { font-size: 20px; margin-bottom: 20px; font-weight: bold; }
.list { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; overflow: hidden; text-align: center; padding-bottom: 15px; }
.card img { width: 100%; height: 180px; object-fit: cover; }
.price { color: red; font-size: 18px; font-weight: bold; }

.admin-entry {
  margin-top: 40px;
  text-align: center;
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  gap: 20px;
}
.admin-btn {
  padding: 10px 25px;
  background: #222;
  color: #fff;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
}
.admin-btn:hover { background: #409eff; }

/* 商家按钮样式 */
.seller-btn {
  padding: 10px 25px;
  background: #00b42a;
  color: #fff;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
}
.seller-btn:hover { background: #009920; }
</style>