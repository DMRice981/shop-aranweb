<template>
  <div class="detail-page">
    <div class="detail-container">
      <el-page-header @back="$router.push('/')" content="返回首页" class="page-header" />
      
      <div v-if="loading" class="loading-section">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else class="detail-content animate-fadeInUp">
        <div class="image-section">
          <div class="main-image">
            <img :src="info.goodsImg || info.goods_img || 'https://images.unsplash.com/photo-1523275335684-37898b5b8fae?w=600&h=600&fit=crop'" :alt="info.goodsName || info.goods_name" />
          </div>
        </div>

        <div class="info-section">
          <div class="product-badge">
            <el-tag type="success" effect="dark">热销</el-tag>
            <el-tag type="warning" effect="light">品质保证</el-tag>
          </div>

          <h1 class="product-title">{{ info.goodsName || info.goods_name || '精美商品' }}</h1>

          <div class="price-section">
            <span class="price-label">价格</span>
            <span class="price-value">¥{{ info.price || '0.00' }}</span>
          </div>

          <div class="divider"></div>

          <div class="description-section">
            <h3 class="section-title">商品详情</h3>
            <p class="product-description">{{ info.goodsDesc || info.goods_desc || '这是一款高品质商品，为您带来极致体验。' }}</p>
          </div>

          <div class="quantity-section">
            <h3 class="section-title">数量</h3>
            <div class="quantity-control">
              <el-button @click="decreaseQuantity" :disabled="quantity <= 1">
                <el-icon><Minus /></el-icon>
              </el-button>
              <el-input-number v-model="quantity" :min="1" :max="99" size="large" />
              <el-button @click="increaseQuantity">
                <el-icon><Plus /></el-icon>
              </el-button>
            </div>
          </div>

          <div class="action-buttons">
            <el-button type="primary" size="large" class="add-cart-btn" @click="addCart">
              <el-icon><ShoppingCart /></el-icon>
              加入购物车
            </el-button>
            <el-button size="large" class="buy-now-btn" @click="buyNow">
              <el-icon><ShoppingBag /></el-icon>
              立即购买
            </el-button>
          </div>

          <div class="features">
            <div class="feature-item">
              <el-icon><CircleCheck /></el-icon>
              <span>正品保障</span>
            </div>
            <div class="feature-item">
              <el-icon><Truck /></el-icon>
              <span>极速发货</span>
            </div>
            <div class="feature-item">
              <el-icon><SwitchButton /></el-icon>
              <span>7天无理由</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const info = ref({})
const loading = ref(true)
const quantity = ref(1)

onMounted(async () => {
  try {
    const res = await fetch(`/api/goods/get/${route.params.id}`)
    info.value = await res.json()
  } catch (error) {
    ElMessage.error('加载商品失败')
  } finally {
    loading.value = false
  }
})

const addCart = async () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  try {
    await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        goodsId: route.params.id,
        num: quantity.value
      })
    })
    ElMessage.success('加入购物车成功')
  } catch (error) {
    ElMessage.error('加入购物车失败')
  }
}

const buyNow = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  ElMessage.info('正在前往结算...')
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  if (quantity.value < 99) {
    quantity.value++
  }
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 24px;
}

.detail-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 0;
  gap: 16px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
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

.detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  background: white;
  padding: 48px;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.image-section {
  position: relative;
}

.main-image {
  aspect-ratio: 1;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-badge {
  display: flex;
  gap: 12px;
}

.product-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  margin: 0;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(135deg, #fff5f5 0%, #fff0f0 100%);
  border-radius: var(--radius-lg);
}

.price-label {
  font-size: 16px;
  color: var(--text-secondary);
  font-weight: 500;
}

.price-value {
  font-size: 40px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.divider {
  height: 1px;
  background: var(--border-color);
  margin: 8px 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.product-description {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 15px;
  margin: 0;
}

.quantity-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quantity-control {
  display: flex;
  gap: 12px;
  align-items: center;
}

.quantity-control .el-input-number {
  width: 140px;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 8px;
}

.add-cart-btn {
  height: 52px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 50px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border: none;
}

.add-cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.buy-now-btn {
  height: 52px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 50px;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.features {
  display: flex;
  gap: 32px;
  margin-top: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 14px;
}

.feature-item .el-icon {
  color: var(--success-color);
  font-size: 18px;
}

@media (max-width: 968px) {
  .detail-content {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 32px 24px;
  }

  .product-title {
    font-size: 24px;
  }

  .price-value {
    font-size: 32px;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }

  .features {
    flex-wrap: wrap;
    gap: 16px;
  }
}
</style>
