<template>
  <div class="home-page">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo animate-fadeInUp">
          <el-icon :size="32"><Shop /></el-icon>
          <span class="logo-text">Aran Shop</span>
        </div>
        
        <nav class="nav animate-fadeInUp" style="animation-delay: 0.1s">
          <el-button link class="nav-item" @click="$router.push('/')">
            <el-icon><House /></el-icon> 首页
          </el-button>
          <el-button link class="nav-item" @click="$router.push('/cart')">
            <el-icon><ShoppingCart /></el-icon> 购物车
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </el-button>
        </nav>

        <div class="user-actions animate-fadeInUp" style="animation-delay: 0.2s">
          <template v-if="user">
            <el-button @click="$router.push('/user')" class="user-btn">
              <el-avatar :size="32" class="user-avatar">
              </el-avatar>
              <span>{{ user.username }}</span>
            </el-button>
            <el-button @click="logout" type="danger" text>
              <el-icon><SwitchButton /></el-icon> 退出
            </el-button>
          </template>
          <template v-else>
            <el-button @click="$router.push('/login')">登录</el-button>
            <el-button type="primary" @click="$router.push('/register')">注册</el-button>
          </template>
        </div>
      </div>
    </header>

    <!-- Hero Banner -->
    <section class="hero-section">
      <div class="hero-content animate-fadeInUp">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="gradient-text">探索精选好物</span>
            <br />
            开启品质生活
          </h1>
          <p class="hero-subtitle">
            精选全球优质商品，为您带来极致购物体验
          </p>
          <div class="hero-actions">
              <el-button type="primary" size="large" class="cta-button">
                <el-icon><ShoppingCart /></el-icon> 立即选购
              </el-button>
              <el-button size="large" class="cta-secondary">
                <el-icon><Compass /></el-icon> 了解更多
              </el-button>
            </div>
        </div>
        <div class="hero-visual">
          <div class="floating-card card-1">
            <el-icon :size="48"><ShoppingBag /></el-icon>
          </div>
          <div class="floating-card card-2">
            <el-icon :size="40"><Present /></el-icon>
          </div>
          <div class="floating-card card-3">
            <el-icon :size="44"><Star /></el-icon>
          </div>
        </div>
      </div>
    </section>

    <!-- 商品列表区 -->
    <main class="main-content">
      <div class="section-header animate-fadeInUp">
        <div class="section-tag">精选推荐</div>
        <h2 class="section-title">
          <el-icon><Fire /></el-icon> 热销商品
        </h2>
        <p class="section-subtitle">发现您喜欢的商品，享受品质购物</p>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载商品...</p>
      </div>

      <div v-else class="goods-grid">
        <div 
          v-for="(item, index) in goods" 
          :key="item.id" 
          class="goods-card animate-fadeInUp"
          :style="{ animationDelay: `${index * 0.08 + 0.3}s` }"
          @click="$router.push(`/goods/${item.id}`)"
        >
          <div class="card-wrapper">
            <div class="card-image">
              <div class="image-placeholder" v-if="!item.goodsImg">
                <el-icon :size="64"><Picture /></el-icon>
              </div>
              <img v-else :src="item.goodsImg" :alt="item.goodsName" />
              <div class="card-badges">
                <span class="badge hot" v-if="item.sales > 100">热卖</span>
                <span class="badge new" v-if="item.sales < 10">新品</span>
              </div>
              <div class="card-overlay">
                <el-button type="primary" class="quick-view" @click.stop="$router.push(`/goods/${item.id}`)">
                  <el-icon><View /></el-icon> 立即查看
                </el-button>
              </div>
            </div>
            <div class="card-body">
              <div class="card-category">品质好物</div>
              <h3 class="card-title">{{ item.goodsName || '精美商品' }}</h3>
              <p class="card-desc" v-if="item.goodsDesc">{{ item.goodsDesc.length > 40 ? item.goodsDesc.substring(0, 40) + '...' : item.goodsDesc }}</p>
              <div class="card-meta">
                <div class="sales-info">
                  <el-icon><TrendCharts /></el-icon>
                  <span>已售 {{ item.sales || 0 }}</span>
                </div>
                <div class="stock-info">
                  <el-icon><Box /></el-icon>
                  <span>库存 {{ item.stock || 0 }}</span>
                </div>
              </div>
              <div class="card-footer">
                <div class="price-wrap">
                  <span class="currency">¥</span>
                  <span class="card-price">{{ (item.price || 0).toFixed(2) }}</span>
                  <span class="market-price" v-if="item.marketPrice && item.marketPrice > item.price">¥{{ item.marketPrice.toFixed(2) }}</span>
                </div>
                <el-button type="primary" class="add-cart-btn" @click.stop="addToCart(item)">
                  <el-icon><ShoppingCart /></el-icon>
                  <span>加入购物车</span>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="!loading && goods.length === 0" class="empty-state">
        <el-icon :size="80"><Box /></el-icon>
        <h3>暂无商品</h3>
        <p>敬请期待更多好物上架</p>
      </div>
    </main>

    <!-- 功能入口 -->
    <section class="admin-section">
      <div class="admin-cards">
        <div class="admin-card animate-fadeInUp" style="animation-delay: 0.4s" @click="$router.push('/admin/login')">
          <el-icon :size="40"><Setting /></el-icon>
          <h3>管理后台</h3>
          <p>高效管理您的商城</p>
        </div>
        <div class="admin-card seller animate-fadeInUp" style="animation-delay: 0.5s" @click="$router.push('/seller/login')">
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
        <p class="footer-text">© 2024 Aran Shop. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const goods = ref([])
const loading = ref(true)

const cartCount = computed(() => {
  return 0
})

onMounted(async () => {
  loadGoods()
})

const loadGoods = async () => {
  loading.value = true
  try {
    const res = await fetch('/api/goods/list')
    goods.value = await res.json()
  } catch (error) {
    console.error('加载商品失败', error)
    ElMessage.error('加载商品失败')
  } finally {
    loading.value = false
  }
}

const logout = () => {
  localStorage.removeItem('user')
  user.value = null
  ElMessage.success('退出成功')
  router.push('/')
}

const addToCart = (item) => {
  if (!user.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  ElMessage.success('已加入购物车')
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
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
  border-bottom: 1px solid var(--border-color);
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
}

.nav-item:hover {
  color: var(--primary-color);
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -8px;
  background: var(--danger-color);
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
}

.user-avatar {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
}

/* Hero Section */
.hero-section {
  padding: 80px 24px 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}

.hero-content {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-text {
  color: white;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 24px;
}

.gradient-text {
  background: linear-gradient(135deg, #fff 0%, #f0f3ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 20px;
  opacity: 0.95;
  margin-bottom: 40px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.cta-button {
  height: 52px;
  padding: 0 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 50px;
  background: white;
  color: var(--primary-color);
  border: none;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.cta-secondary {
  height: 52px;
  padding: 0 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.cta-secondary:hover {
  background: rgba(255, 255, 255, 0.25);
}

.hero-visual {
  position: relative;
  height: 400px;
}

.floating-card {
  position: absolute;
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.card-1 {
  top: 40px;
  left: 60px;
  animation: float 4s ease-in-out infinite;
}

.card-2 {
  top: 150px;
  right: 40px;
  animation: float 4s ease-in-out infinite 0.8s;
}

.card-3 {
  bottom: 40px;
  left: 140px;
  animation: float 4s ease-in-out infinite 1.6s;
}

/* Main Content */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 24px;
  flex: 1;
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-tag {
  display: inline-block;
  padding: 6px 16px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
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
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

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
  transition: var(--transition-normal);
  cursor: pointer;
}

.goods-card:hover {
  transform: translateY(0);
  box-shadow: none;
}

.card-wrapper {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  transition: var(--transition-normal);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-wrapper:hover {
  transform: translateY(-12px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
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
  transition: var(--transition-slow);
}

.card-wrapper:hover .card-image img {
  transform: scale(1.08);
}

.card-badges {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.badge {
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 12px;
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
  transition: var(--transition-normal);
  z-index: 5;
}

.card-wrapper:hover .card-overlay {
  opacity: 1;
}

.quick-view {
  width: 100%;
  border-radius: 50px;
  height: 44px;
  font-weight: 600;
}

.card-body {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-category {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}

.card-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 20px;
  line-height: 1.6;
  flex: 1;
}

.card-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
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
  color: var(--primary-color);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.price-wrap {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.currency {
  font-size: 16px;
  font-weight: 600;
  color: var(--danger-color);
}

.card-price {
  font-size: 30px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.market-price {
  font-size: 14px;
  color: #adb5bd;
  text-decoration: line-through;
}

.add-cart-btn {
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
  height: 42px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.add-cart-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

/* Admin Section */
.admin-section {
  max-width: 1280px;
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
  border-radius: var(--radius-lg);
  text-align: center;
  cursor: pointer;
  transition: var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.admin-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.admin-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 16px 0 8px;
  color: var(--text-primary);
}

.admin-card p {
  color: var(--text-secondary);
}

.admin-card.seller {
  background: linear-gradient(135deg, #e8ffef 0%, #d4f7df 100%);
}

.admin-card.seller h3 {
  color: var(--success-color);
}

/* Footer */
.footer {
  background: var(--text-primary);
  color: white;
  padding: 40px 24px;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
}

.footer-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.footer-text {
  opacity: 0.7;
  font-size: 14px;
}

@media (max-width: 1200px) {
  .goods-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

@media (max-width: 968px) {
  .hero-content {
    grid-template-columns: 1fr;
  }

  .hero-visual {
    display: none;
  }

  .hero-title {
    font-size: 36px;
  }

  .admin-cards {
    grid-template-columns: 1fr;
  }

  .goods-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .main-content {
    padding: 60px 16px;
  }

  .section-title {
    font-size: 28px;
  }

  .card-price {
    font-size: 24px;
  }

  .header-content {
    flex-wrap: wrap;
    gap: 16px;
  }

  .nav {
    order: 3;
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .goods-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .card-wrapper {
    border-radius: 20px;
  }

  .card-body {
    padding: 20px;
  }

  .section-title {
    font-size: 24px;
  }

  .hero-title {
    font-size: 28px;
  }

  .add-cart-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
