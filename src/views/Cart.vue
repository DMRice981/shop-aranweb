<template>
  <div class="cart-page">
    <div class="cart-container">
      <el-page-header @back="$router.push('/')" content="返回首页" class="page-header" />
      
      <el-card class="cart-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <h2><el-icon><ShoppingCart /></el-icon> 购物车</h2>
            <div class="total-info">
              <span>共 <strong>{{ totalCount }}</strong> 件商品</span>
              <span>总计：<strong class="price">¥{{ totalPrice.toFixed(2) }}</strong></span>
            </div>
          </div>
        </template>

        <el-empty v-if="list.length === 0" description="购物车空空如也，快去选购吧~">
          <el-button type="primary" @click="$router.push('/')">去购物</el-button>
        </el-empty>
        
        <div v-else class="cart-list">
          <el-checkbox v-model="allSelected" @change="handleAllSelect" class="select-all">
            全选
          </el-checkbox>
          
          <div v-for="(item, index) in list" :key="item.id" class="cart-item">
            <el-card class="item-card">
              <el-checkbox v-model="item.selected" @change="updateTotal" />
              <div class="item-icon">
                <el-icon :size="48" color="#667eea"><Box /></el-icon>
              </div>
              <div class="item-detail">
                <h4>商品 ID: {{ item.goodsId }}</h4>
                <p class="item-price">单价：¥{{ item.price || '0.00' }}</p>
              </div>
              <div class="quantity-control">
                <el-button size="small" @click="updateQuantity(item, -1)" :disabled="item.num <= 1">-</el-button>
                <el-input-number v-model="item.num" :min="1" :max="99" size="small" @change="updateTotal" />
                <el-button size="small" @click="updateQuantity(item, 1)">+</el-button>
              </div>
              <div class="item-total">
                <span class="price">¥{{ (item.price * item.num).toFixed(2) }}</span>
              </div>
              <div class="item-actions">
                <el-button type="danger" link @click="removeItem(item.id)">
                  <el-icon><Delete /></el-icon> 删除
                </el-button>
              </div>
            </el-card>
          </div>
        </div>

        <div v-if="list.length > 0" class="cart-actions">
          <el-button type="danger" link @click="clearSelected" :disabled="selectedCount === 0">
            删除选中
          </el-button>
          <div class="right-actions">
            <div class="total-preview">
              <span>已选 {{ selectedCount }} 件商品</span>
              <span class="total-price">合计：<strong>¥{{ selectedTotalPrice.toFixed(2) }}</strong></span>
            </div>
            <el-button type="primary" size="large" @click="goToCheckout" :disabled="selectedCount === 0">
              <el-icon><Document /></el-icon> 去结算
            </el-button>
            <el-button size="large" @click="$router.push('/')">
              <el-icon><ArrowLeft /></el-icon> 继续购物
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const list = ref([])
const goodsMap = ref({})

const allSelected = computed({
  get: () => list.value.length > 0 && list.value.every(item => item.selected),
  set: (val) => {
    list.value.forEach(item => item.selected = val)
  }
})

const totalCount = computed(() => list.value.reduce((sum, item) => sum + item.num, 0))
const totalPrice = computed(() => list.value.reduce((sum, item) => sum + (item.price || 0) * item.num, 0))

const selectedCount = computed(() => list.value.filter(item => item.selected).length)
const selectedTotalPrice = computed(() => 
  list.value.filter(item => item.selected).reduce((sum, item) => sum + (item.price || 0) * item.num, 0)
)

const getList = async () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  try {
    const [cartsRes, goodsRes] = await Promise.all([
      fetch(`/api/cart/list?userId=${user.id}`).then(r => r.json()),
      fetch('/api/goods/list').then(r => r.json())
    ])
    
    const goodsList = Array.isArray(goodsRes) ? goodsRes : (goodsRes.data || [])
    goodsMap.value = {}
    goodsList.forEach(g => {
      goodsMap.value[g.id] = g
    })
    
    const cartItems = cartsRes.data || cartsRes || []
    list.value = (Array.isArray(cartItems) ? cartItems : []).map(c => ({
      ...c,
      selected: true,
      price: goodsMap.value[c.goodsId]?.price || 0
    }))
  } catch (error) {
    ElMessage.error('加载购物车失败')
  }
}

const updateQuantity = async (item, delta) => {
  const newNum = item.num + delta
  if (newNum < 1 || newNum > 99) return
  
  item.num = newNum
  try {
    await fetch('/api/cart/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    })
    updateTotal()
  } catch (error) {
    ElMessage.error('更新数量失败')
    item.num -= delta
  }
}

const removeItem = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await fetch(`/api/cart/delete/${id}`, { method: 'DELETE' })
    list.value = list.value.filter(item => item.id !== id)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const clearSelected = async () => {
  try {
    await ElMessageBox.confirm('确定删除选中的商品？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const selectedIds = list.value.filter(item => item.selected).map(item => item.id)
    for (const id of selectedIds) {
      await fetch(`/api/cart/delete/${id}`, { method: 'DELETE' })
    }
    list.value = list.value.filter(item => !item.selected)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleAllSelect = () => {
  updateTotal()
}

const updateTotal = () => {
}

const goToCheckout = () => {
  const selectedItems = list.value.filter(item => item.selected)
  if (selectedItems.length === 0) {
    ElMessage.warning('请选择要购买的商品')
    return
  }
  
  localStorage.setItem('checkoutItems', JSON.stringify(selectedItems))
  router.push('/checkout')
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  padding: 20px;
}

.cart-container {
  max-width: 1100px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

:deep(.el-page-header__inner),
:deep(.el-page-header__title),
:deep(.el-page-header__content) {
  color: white;
}

.cart-card {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.98);
  border: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.card-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
}

.total-info {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: #666;
}

.total-info .price {
  color: #ff4757;
  font-size: 18px;
}

.select-all {
  margin-bottom: 16px;
  font-size: 14px;
}

.cart-list {
  padding: 10px 0;
}

.cart-item {
  margin-bottom: 16px;
}

.item-card {
  border-radius: 16px;
}

.item-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.item-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f3ff 0%, #e0e7ff 100%);
  border-radius: 12px;
  flex-shrink: 0;
}

.item-detail {
  flex: 1;
  min-width: 0;
}

.item-detail h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.item-price {
  margin: 0;
  color: #999;
  font-size: 14px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.item-total {
  flex-shrink: 0;
  text-align: right;
  min-width: 100px;
}

.item-total .price {
  color: #ff4757;
  font-size: 18px;
  font-weight: 700;
}

.item-actions {
  flex-shrink: 0;
}

.cart-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
  flex-wrap: wrap;
}

.right-actions {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.total-preview {
  display: flex;
  gap: 24px;
  align-items: center;
  font-size: 14px;
}

.total-price {
  font-size: 16px;
}

.total-price strong {
  color: #ff4757;
  font-size: 24px;
}

@media (max-width: 768px) {
  .item-card :deep(.el-card__body) {
    flex-wrap: wrap;
  }
  
  .item-detail {
    width: 100%;
  }
  
  .cart-actions {
    flex-direction: column;
  }
  
  .right-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .right-actions .el-button {
    width: 100%;
  }
}
</style>
