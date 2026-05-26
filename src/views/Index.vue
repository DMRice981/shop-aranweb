<template>
  <div class="home-page">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo animate-fadeInUp" @click="$router.push('/')">
          <el-icon :size="32"><Shop /></el-icon>
          <span class="logo-text">Aran Shop</span>
        </div>
        
        <!-- 搜索框 -->
        <div class="search-box animate-fadeInUp" style="animation-delay: 0.05s">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品..."
            size="large"
            class="search-input"
            @keyup.enter="handleSearch"
            clearable
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </div>
        
        <nav class="nav animate-fadeInUp" style="animation-delay: 0.1s">
          <el-button link class="nav-item active" @click="$router.push('/')">
            <el-icon><House /></el-icon> 首页
          </el-button>
          <el-button link class="nav-item" @click="$router.push('/cart')">
            <el-icon><ShoppingCart /></el-icon> 购物车
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </el-button>
          <el-button link class="nav-item" @click="$router.push('/order')">
            <el-icon><List /></el-icon> 我的订单
          </el-button>
        </nav>

        <div class="user-actions animate-fadeInUp" style="animation-delay: 0.2s">
          <template v-if="user">
            <el-dropdown @command="handleUserCommand">
              <el-button class="user-btn">
                <el-avatar :size="32" class="user-avatar">
                  {{ user.username?.charAt(0).toUpperCase() }}
                </el-avatar>
                <span>{{ user.username }}</span>
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="/user">
                    <el-icon><User /></el-icon> 个人中心
                  </el-dropdown-item>
                  <el-dropdown-item command="/order">
                    <el-icon><List /></el-icon> 我的订单
                  </el-dropdown-item>
                  <el-dropdown-item command="/after-sale">
                    <el-icon><Service /></el-icon> 我的售后
                  </el-dropdown-item>
                  <el-dropdown-item command="/address">
                    <el-icon><Location /></el-icon> 收货地址
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon> 退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button @click="$router.push('/login')">登录</el-button>
            <el-button type="primary" @click="$router.push('/register')">注册</el-button>
          </template>
        </div>
      </div>
    </header>

    <!-- 轮播图 -->
    <section class="banner-section" v-if="banners.length > 0">
      <el-carousel :interval="4000" type="card" height="400px" trigger="click">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <a :href="banner.linkUrl || 'javascript:void(0)'" target="_blank">
            <div class="banner-item">
              <img :src="banner.imgUrl" :alt="'Banner ' + banner.id" />
              <div class="banner-overlay">
                <div class="banner-content">
                  <h2>{{ banner.title || '精选好物' }}</h2>
                  <p>{{ banner.subtitle || '品质生活从这里开始' }}</p>
                </div>
              </div>
            </div>
          </a>
        </el-carousel-item>
      </el-carousel>
    </section>

    <!-- 分类导航 -->
    <section class="category-nav">
      <div class="category-container">
        <div class="category-list">
          <div 
            class="category-item" 
            :class="{ active: selectedCategory === null }"
            @click="filterByCategory(null)"
          >
            <el-icon><Grid /></el-icon> 全部商品
          </div>
          <div 
            v-for="category in topCategories" 
            :key="category.id"
            class="category-item"
            :class="{ active: selectedCategory === category.id }"
            @click="filterByCategory(category.id)"
          >
            <el-icon><Folder /></el-icon> {{ category.name }}
          </div>
        </div>
      </div>
    </section>

    <!-- 商品列表区 -->
    <main class="main-content">
      <div class="section-header animate-fadeInUp">
        <div class="section-tag">精选推荐</div>
        <h2 class="section-title">
          <el-icon><StarFilled /></el-icon> {{ selectedCategory ? currentCategoryName : '热销商品' }}
        </h2>
        <p class="section-subtitle">
          {{ searchKeyword ? `搜索结果: "${searchKeyword}"` : '发现您喜欢的商品，享受品质购物' }}
        </p>
      </div>

      <!-- 排序和筛选 -->
      <div class="filter-bar animate-fadeInUp">
        <div class="filter-left">
          <span class="total-count">共 {{ filteredGoods.length }} 件商品</span>
        </div>
        <div class="filter-right">
          <el-radio-group v-model="sortType" size="default">
            <el-radio-button value="default">综合</el-radio-button>
            <el-radio-button value="sales">销量优先</el-radio-button>
            <el-radio-button value="price-asc">价格升序</el-radio-button>
            <el-radio-button value="price-desc">价格降序</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载商品...</p>
      </div>

      <div v-else-if="filteredGoods.length > 0" class="goods-grid">
        <div 
          v-for="(item, index) in filteredGoods" 
          :key="item.id" 
          class="goods-card animate-fadeInUp"
          :style="{ animationDelay: `${index * 0.05 + 0.2}s` }"
          @click="$router.push(`/goods/${item.id}`)"
        >
          <div class="card-wrapper">
            <div class="card-image">
              <div class="image-placeholder" v-if="!item.goodsImg">
                <el-icon :size="64"><Picture /></el-icon>
              </div>
              <img v-else :src="item.goodsImg" :alt="item.goodsName" @error="handleImageError" />
              <div class="card-badges">
                <span class="badge hot" v-if="item.sales > 100">热卖</span>
                <span class="badge new" v-if="item.sales < 10">新品</span>
                <span class="badge offline" v-if="item.status === 0">已下架</span>
              </div>
              <div class="card-overlay">
                <el-button type="primary" class="quick-view" @click.stop="$router.push(`/goods/${item.id}`)">
                  <el-icon><View /></el-icon> 查看详情
                </el-button>
              </div>
            </div>
            <div class="card-body">
              <div class="card-category" v-if="getCategoryName(item.categoryId)">
                {{ getCategoryName(item.categoryId) }}
              </div>
              <h3 class="card-title">{{ item.goodsName || '精美商品' }}</h3>
              <p class="card-desc" v-if="item.goodsDesc">
                {{ item.goodsDesc.length > 50 ? item.goodsDesc.substring(0, 50) + '...' : item.goodsDesc }}
              </p>
              <div class="card-meta">
                <div class="sales-info">
                  <el-icon><TrendCharts /></el-icon>
                  <span>已售 {{ item.sales || 0 }}</span>
                </div>
                <div class="stock-info" :class="{ 'low-stock': item.stock <= 5 && item.stock > 0, 'out-stock': item.stock <= 0 }">
                  <el-icon><Box /></el-icon>
                  <span>{{ item.stock > 0 ? `库存 ${item.stock}` : '缺货' }}</span>
                </div>
              </div>
              <div class="card-footer">
                <div class="price-wrap">
                  <span class="currency">¥</span>
                  <span class="card-price">{{ (item.price || 0).toFixed(2) }}</span>
                  <span class="market-price" v-if="item.marketPrice && item.marketPrice > item.price">
                    ¥{{ item.marketPrice.toFixed(2) }}
                  </span>
                </div>
                <el-button 
                  type="primary" 
                  class="add-cart-btn" 
                  @click.stop="addToCart(item)"
                  :disabled="item.status === 0 || item.stock <= 0"
                >
                  <el-icon><ShoppingCart /></el-icon>
                  <span>加购</span>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <el-icon :size="80"><Box /></el-icon>
        <h3>{{ searchKeyword ? '未找到相关商品' : '暂无商品' }}</h3>
        <p>{{ searchKeyword ? '试试其他关键词吧' : '敬请期待更多好物上架' }}</p>
        <el-button v-if="searchKeyword" type="primary" @click="clearSearch">清除搜索</el-button>
      </div>
    </main>

    <!-- 功能入口 -->
    <section class="admin-section">
      <div class="section-header">
        <h2 class="section-title">
          <el-icon><Tools /></el-icon> 更多服务
        </h2>
      </div>
      <div class="admin-cards">
        <div class="admin-card animate-fadeInUp" style="animation-delay: 0.3s" @click="$router.push('/admin/login')">
          <el-icon :size="40"><Setting /></el-icon>
          <h3>管理后台</h3>
          <p>高效管理您的商城</p>
        </div>
        <div class="admin-card seller animate-fadeInUp" style="animation-delay: 0.4s" @click="$router.push('/seller/login')">
          <el-icon :size="40"><Shop /></el-icon>
          <h3>商家中心</h3>
          <p>开启您的创业之旅</p>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-brand">
          <el-icon :size="28"><Shop /></el-icon>
          <span>Aran Shop</span>
        </div>
        <div class="footer-links">
          <a href="javascript:void(0)" @click="$router.push('/')">关于我们</a>
          <span class="divider">|</span>
          <a href="javascript:void(0)" @click="$router.push('/')">联系我们</a>
          <span class="divider">|</span>
          <a href="javascript:void(0)" @click="$router.push('/')">帮助中心</a>
        </div>
        <p class="footer-text">© 2024 Aran Shop. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, ArrowDown, StarFilled, Grid, Folder } from '@element-plus/icons-vue'
import { getGoodsList } from '@/api/goods'
import { getCategoryList } from '@/api/category'
import { getBannerList } from '@/api/banner'
import { addCart, getCartList } from '@/api/cart'

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const goods = ref([])
const categories = ref([])
const banners = ref([])
const loading = ref(true)
const searchKeyword = ref('')
const selectedCategory = ref(null)
const sortType = ref('default')
const cartCount = ref(0)

const filteredGoods = computed(() => {
  let result = [...goods.value]
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(item => 
      item.goodsName?.toLowerCase().includes(keyword) ||
      item.goodsDesc?.toLowerCase().includes(keyword)
    )
  }
  
  if (selectedCategory.value !== null) {
    result = result.filter(item => item.categoryId === selectedCategory.value)
  }
  
  result = result.filter(item => item.status === 1)
  
  switch (sortType.value) {
    case 'sales':
      result.sort((a, b) => (b.sales || 0) - (a.sales || 0))
      break
    case 'price-asc':
      result.sort((a, b) => (a.price || 0) - (b.price || 0))
      break
    case 'price-desc':
      result.sort((a, b) => (b.price || 0) - (a.price || 0))
      break
    default:
      result.sort((a, b) => (b.sales || 0) - (a.sales || 0))
  }
  
  return result
})

const topCategories = computed(() => {
  return categories.value.filter(c => c.pid === 0 || c.pid === null)
})

const currentCategoryName = computed(() => {
  if (selectedCategory.value === null) return '全部商品'
  const category = categories.value.find(c => c.id === selectedCategory.value)
  return category?.name || '商品'
})

onMounted(async () => {
  await Promise.all([
    loadGoods(),
    loadCategories(),
    loadBanners()
  ])
  if (user.value) {
    await loadCartCount()
  }
})

const loadGoods = async () => {
  loading.value = true
  try {
    const res = await getGoodsList()
    goods.value = res.data || res || []
  } catch (error) {
    console.error('加载商品失败', error)
    ElMessage.error('加载商品失败')
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const res = await getCategoryList()
    categories.value = res.data || res || []
  } catch (error) {
    console.error('加载分类失败', error)
  }
}

const loadBanners = async () => {
  try {
    const res = await getBannerList()
    banners.value = res.data || res || []
  } catch (error) {
    console.error('加载轮播图失败', error)
  }
}

const loadCartCount = async () => {
  if (!user.value) return
  try {
    const res = await getCartList(user.value.id)
    const cartList = res.data || res || []
    cartCount.value = cartList.length
  } catch (error) {
    console.error('加载购物车失败', error)
  }
}

const filterByCategory = (categoryId) => {
  selectedCategory.value = categoryId
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category?.name || ''
}

const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
}

const clearSearch = () => {
  searchKeyword.value = ''
}

const handleUserCommand = (command) => {
  if (command === 'logout') {
    logout()
  } else {
    router.push(command)
  }
}

const logout = () => {
  localStorage.removeItem('user')
  user.value = null
  ElMessage.success('退出成功')
  router.push('/')
}

const addToCart = async (item) => {
  if (!user.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  if (item.status === 0) {
    ElMessage.warning('该商品已下架')
    return
  }
  
  if (item.stock <= 0) {
    ElMessage.warning('该商品库存不足')
    return
  }
  
  try {
    await addCart({
      userId: user.value.id,
      goodsId: item.id,
      num: 1
    })
    ElMessage.success('已加入购物车')
    await loadCartCount()
  } catch (error) {
    console.error('加入购物车失败', error)
    ElMessage.error('加入购物车失败')
  }
}

const handleImageError = (e) => {
  e.target.src = 'https://picsum.photos/400/300'
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  transition: transform 0.2s;
}

.logo:hover {
  transform: scale(1.02);
}

.search-box {
  flex: 1;
  max-width: 600px;
}

.search-input {
  border-radius: 50px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 50px 0 0 50px;
}

.search-input :deep(.el-input-group__append) {
  border-radius: 0 50px 50px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.nav {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nav-item {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-item:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.08);
}

.nav-item.active {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.cart-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #f0f3ff 0%, #e8ecff 100%);
  border-radius: 50px;
  padding: 8px 16px;
  border: none;
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
}

/* Banner Section */
.banner-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px 0;
}

.banner-section .el-carousel__item--card {
  border-radius: 16px;
}

.banner-item {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}

.banner-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.banner-content {
  text-align: center;
}

.banner-content h2 {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 12px;
}

.banner-content p {
  font-size: 18px;
  opacity: 0.9;
}

/* Category Navigation */
.category-nav {
  background: white;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 68px;
  z-index: 99;
}

.category-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.category-list {
  display: flex;
  gap: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.category-list::-webkit-scrollbar {
  display: none;
}

.category-item {
  padding: 16px 24px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  transition: all 0.2s;
}

.category-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s;
}

.category-item:hover {
  color: #667eea;
}

.category-item.active {
  color: #667eea;
  font-weight: 700;
}

.category-item.active::after {
  width: 100%;
}

/* Main Content */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 24px;
  flex: 1;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-tag {
  display: inline-block;
  padding: 6px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.section-title {
  font-size: 36px;
  font-weight: 800;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: 16px;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 16px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.total-count {
  font-size: 14px;
  color: var(--text-secondary);
}

.filter-right .el-radio-button__inner {
  border-radius: 8px;
  margin: 0 4px;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 0;
  gap: 20px;
}

.loading-spinner {
  width: 56px;
  height: 56px;
  border: 4px solid var(--border-color);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 100px 0;
  color: var(--text-secondary);
}

.empty-state h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 16px 0 8px;
  color: var(--text-primary);
}

.empty-state p {
  margin-bottom: 20px;
}

/* Goods Grid */
.goods-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.goods-card {
  background: transparent;
  border-radius: 0;
  overflow: visible;
  box-shadow: none;
  transition: all 0.3s;
  cursor: pointer;
}

.goods-card:hover {
  transform: translateY(-8px);
}

.card-wrapper {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-wrapper:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.card-image {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.card-wrapper:hover .card-image img {
  transform: scale(1.08);
}

.card-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.badge {
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 11px;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.badge.hot {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
}

.badge.new {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a3a0 100%);
}

.badge.offline {
  background: linear-gradient(135deg, #adb5bd 0%, #868e96 100%);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 24px;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 5;
}

.card-wrapper:hover .card-overlay {
  opacity: 1;
}

.quick-view {
  width: 100%;
  border-radius: 50px;
  height: 40px;
  font-weight: 600;
}

.card-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-category {
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}

.card-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0 0 16px;
  line-height: 1.5;
  flex: 1;
}

.card-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.sales-info,
.stock-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.sales-info .el-icon,
.stock-info .el-icon {
  color: #667eea;
}

.stock-info.low-stock {
  color: #ff9800;
}

.stock-info.low-stock .el-icon {
  color: #ff9800;
}

.stock-info.out-stock {
  color: #f56c6c;
}

.stock-info.out-stock .el-icon {
  color: #f56c6c;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.price-wrap {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.currency {
  font-size: 16px;
  font-weight: 600;
  color: #f56c6c;
}

.card-price {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.market-price {
  font-size: 13px;
  color: #adb5bd;
  text-decoration: line-through;
}

.add-cart-btn {
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 13px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.add-cart-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.add-cart-btn:disabled {
  background: #adb5bd;
  cursor: not-allowed;
}

/* Admin Section */
.admin-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.admin-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.admin-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.admin-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.admin-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 16px 0 8px;
  color: var(--text-primary);
}

.admin-card p {
  color: var(--text-secondary);
  font-size: 14px;
}

.admin-card.seller {
  background: linear-gradient(135deg, #e8ffef 0%, #d4f7df 100%);
}

.admin-card.seller h3 {
  color: #67c23a;
}

/* Footer */
.footer {
  background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
  color: white;
  padding: 60px 24px 40px;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
}

.footer-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
}

.footer-links {
  margin-bottom: 20px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: white;
}

.footer-links .divider {
  margin: 0 16px;
  color: rgba(255, 255, 255, 0.3);
}

.footer-text {
  opacity: 0.6;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 1200px) {
  .goods-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

@media (max-width: 968px) {
  .header-content {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .search-box {
    order: 3;
    max-width: 100%;
    width: 100%;
  }
  
  .nav {
    order: 4;
    width: 100%;
    justify-content: center;
    overflow-x: auto;
  }
  
  .banner-section .el-carousel__item--card {
    height: 280px !important;
  }
  
  .banner-content h2 {
    font-size: 24px;
  }
  
  .banner-content p {
    font-size: 14px;
  }
  
  .goods-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .admin-cards {
    grid-template-columns: 1fr;
  }
  
  .main-content {
    padding: 40px 16px;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .filter-bar {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 640px) {
  .goods-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .card-wrapper {
    border-radius: 16px;
  }
  
  .card-body {
    padding: 16px;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .category-nav {
    top: 120px;
  }
  
  .category-item {
    padding: 12px 16px;
  }
}
</style>
