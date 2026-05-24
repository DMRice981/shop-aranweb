<template>
  <div class="detail-page">
    <div class="detail-container">
      <el-page-header @back="$router.push('/')" content="返回首页" class="page-header" />
      
      <div v-if="loading" class="loading-section">
        <div class="loading-spinner"></div>
        <p>正在加载商品详情...</p>
      </div>

      <div v-else class="detail-content animate-fadeInUp">
        <!-- 下架状态提示 -->
        <el-alert 
          v-if="info.status === 0" 
          title="该商品已下架" 
          type="warning" 
          :closable="false" 
          class="offline-alert"
        >
          <template #default>
            抱歉，该商品暂时无法购买，请查看其他商品吧！
          </template>
        </el-alert>

        <div class="image-section">
          <div class="image-wrapper">
            <div class="image-placeholder" v-if="!info.goodsImg && !info.goods_img">
              <el-icon :size="120"><Picture /></el-icon>
            </div>
            <img v-else :src="info.goodsImg || info.goods_img" :alt="info.goodsName || info.goods_name" />
          </div>
        </div>

        <div class="info-section">
          <div class="product-badges">
            <el-tag :type="info.status === 1 ? 'success' : 'info'" effect="dark" class="status-tag">
              {{ info.status === 1 ? '在售中' : '已下架' }}
            </el-tag>
            <el-tag type="warning" effect="light" class="quality-tag">品质保证</el-tag>
            <el-tag type="info" effect="light" v-if="info.sales > 100">热卖商品</el-tag>
          </div>

          <h1 class="product-title">{{ info.goodsName || info.goods_name || '精美商品' }}</h1>

          <div class="price-card">
            <div class="price-header">
              <span class="price-label">优惠价格</span>
              <div class="sales-badge" v-if="info.sales > 50">已售 {{ info.sales }}+</div>
            </div>
            <div class="price-main">
              <span class="currency">¥</span>
              <span class="price-value">{{ (info.price || 0).toFixed(2) }}</span>
              <span class="market-price" v-if="info.marketPrice && info.marketPrice > info.price">¥{{ info.marketPrice.toFixed(2) }}</span>
            </div>
            <div class="price-desc">限时特惠，品质好物</div>
          </div>

          <div class="info-cards">
            <div class="info-card">
              <div class="info-icon">
                <el-icon><Box /></el-icon>
              </div>
              <div class="info-content">
                <div class="info-label">库存状态</div>
                <div class="info-value" :class="{ 'in-stock': info.stock > 0, 'out-stock': info.stock <= 0 }">
                  {{ info.stock > 0 ? '仅剩 ' + info.stock + ' 件' : '暂时缺货' }}
                </div>
              </div>
            </div>
            <div class="info-card">
              <div class="info-icon">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="info-content">
                <div class="info-label">累计销量</div>
                <div class="info-value">{{ info.sales || 0 }} 件</div>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="description-section">
            <h3 class="section-title">
              <el-icon><Document /></el-icon>
              商品详情
            </h3>
            <div class="description-content">
              <p class="product-description">{{ info.goodsDesc || info.goods_desc || '这是一款高品质商品，为您带来极致体验。' }}</p>
            </div>
          </div>

          <div class="quantity-section" v-if="info.status === 1">
            <h3 class="section-title">
              <el-icon><Goods /></el-icon>
              购买数量
            </h3>
            <div class="quantity-control-wrapper">
              <div class="quantity-control">
                <el-button class="qty-btn" @click="decreaseQuantity" :disabled="quantity <= 1">
                  <el-icon><Minus /></el-icon>
                </el-button>
                <el-input-number v-model="quantity" :min="1" :max="info.stock || 99" size="large" class="qty-input" />
                <el-button class="qty-btn" @click="increaseQuantity" :disabled="quantity >= (info.stock || 99)">
                  <el-icon><Plus /></el-icon>
                </el-button>
              </div>
              <div class="stock-info">
                <el-icon><CircleCheck /></el-icon>
                <span>库存充足，放心购买</span>
              </div>
            </div>
          </div>

          <div class="action-buttons" v-if="info.status === 1">
            <el-button type="primary" size="large" class="add-cart-btn" @click="addCart">
              <el-icon><ShoppingCart /></el-icon>
              加入购物车
            </el-button>
            <el-button size="large" class="buy-now-btn" @click="buyNow">
              <el-icon><ShoppingBag /></el-icon>
              立即购买
            </el-button>
          </div>

          <div class="action-buttons" v-else>
            <el-button size="large" class="disabled-btn" disabled>
              <el-icon><ShoppingCart /></el-icon>
              商品已下架
            </el-button>
            <el-button size="large" class="disabled-btn" disabled>
              <el-icon><ShoppingBag /></el-icon>
              无法购买
            </el-button>
          </div>

          <div class="features-section">
            <h3 class="section-title">
              <el-icon><Shield /></el-icon>
              服务保障
            </h3>
            <div class="features">
              <div class="feature-item">
                <div class="feature-icon">
                  <el-icon><CircleCheck /></el-icon>
                </div>
                <span>正品保障</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <el-icon><Truck /></el-icon>
                </div>
                <span>极速发货</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <el-icon><SwitchButton /></el-icon>
                </div>
                <span>7天无理由</span>
              </div>
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
  if (info.value.status === 0) {
    ElMessage.warning('该商品已下架，无法加入购物车')
    return
  }

  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  if (quantity.value > (info.value.stock || 0)) {
    ElMessage.warning('库存不足')
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
  if (info.value.status === 0) {
    ElMessage.warning('该商品已下架，无法购买')
    return
  }

  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  if (quantity.value > (info.value.stock || 0)) {
    ElMessage.warning('库存不足')
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
  if (quantity.value < (info.value.stock || 99)) {
    quantity.value++
  }
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  padding: 32px 24px;
}

.detail-container {
  max-width: 1300px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 40px;
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160px 0;
  gap: 20px;
  color: var(--text-secondary);
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

.offline-alert {
  margin-bottom: 32px;
  border-radius: 16px;
}

.detail-content {
  display: grid;
  grid-template-columns: 480px 1fr;
  gap: 80px;
  background: white;
  padding: 56px;
  border-radius: 32px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
}

.image-section {
  position: relative;
}

.image-wrapper {
  position: relative;
  aspect-ratio: 1;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.image-wrapper:hover img {
  transform: scale(1.05);
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.product-badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.product-title {
  font-size: 36px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.3;
  margin: 0;
  letter-spacing: -0.5px;
}

.price-card {
  padding: 28px;
  background: linear-gradient(135deg, #fff5f5 0%, #fff0f0 100%);
  border-radius: 20px;
  border: 1px solid rgba(255, 107, 107, 0.1);
}

.price-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.price-label {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 600;
}

.sales-badge {
  padding: 4px 12px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  color: white;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 600;
}

.price-main {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.currency {
  font-size: 20px;
  font-weight: 700;
  color: var(--danger-color);
}

.price-value {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
}

.market-price {
  font-size: 18px;
  color: #adb5bd;
  text-decoration: line-through;
}

.price-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 12px;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.info-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border-radius: 12px;
  color: white;
  font-size: 22px;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.info-value.in-stock {
  color: var(--danger-color);
}

.info-value.out-stock {
  color: #adb5bd;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--border-color) 50%, transparent 100%);
  margin: 12px 0;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title .el-icon {
  color: var(--primary-color);
}

.description-section {
  padding: 0;
}

.description-content {
  padding: 24px;
  background: #f8f9fa;
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.product-description {
  color: var(--text-secondary);
  line-height: 1.9;
  font-size: 15px;
  margin: 0;
}

.quantity-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quantity-control-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quantity-control {
  display: flex;
  gap: 16px;
  align-items: center;
}

.qty-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 2px solid var(--border-color);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: rgba(102, 126, 234, 0.05);
}

.qty-input {
  width: 140px;
}

.qty-input :deep(.el-input__inner) {
  height: 44px;
  border-radius: 12px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
}

.stock-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--success-color);
  font-size: 14px;
  font-weight: 500;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 8px;
}

.add-cart-btn {
  height: 56px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 50px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border: none;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-cart-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
}

.buy-now-btn {
  height: 56px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 50px;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.buy-now-btn:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.disabled-btn {
  height: 56px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 50px;
  background: #e9ecef;
  color: #adb5bd;
  cursor: not-allowed;
  opacity: 1;
  border: 2px solid #dee2e6;
}

.features-section {
  padding-top: 12px;
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
}

.feature-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  color: var(--success-color);
  font-size: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

@media (max-width: 1200px) {
  .detail-content {
    grid-template-columns: 400px 1fr;
    gap: 56px;
  }
}

@media (max-width: 968px) {
  .detail-page {
    padding: 20px 16px;
  }

  .detail-content {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 32px 24px;
    border-radius: 24px;
  }

  .product-title {
    font-size: 28px;
  }

  .price-value {
    font-size: 36px;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }

  .info-cards {
    grid-template-columns: 1fr;
  }

  .features {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .detail-content {
    padding: 24px 16px;
  }

  .product-title {
    font-size: 24px;
  }

  .price-value {
    font-size: 32px;
  }

  .price-card {
    padding: 20px;
  }
}
</style>
