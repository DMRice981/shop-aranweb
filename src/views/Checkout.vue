<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <el-page-header @back="$router.push('/cart')" content="返回购物车" class="page-header" />
      
      <el-row :gutter="24">
        <el-col :xs="24" :lg="16">
          <!-- 地址选择 -->
          <el-card class="address-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span><el-icon><Location /></el-icon> 收货地址</span>
                <el-button type="primary" link @click="showAddressDialog = true">
                  <el-icon><Plus /></el-icon> 添加地址
                </el-button>
              </div>
            </template>
            
            <el-empty v-if="addressList.length === 0" description="暂无收货地址，请先添加" />
            
            <el-radio-group v-else v-model="selectedAddressId" class="address-list">
              <el-radio-button 
                v-for="addr in addressList" 
                :key="addr.id" 
                :value="addr.id"
                class="address-item"
              >
                <div class="address-content">
                  <div class="address-header">
                    <span class="name">{{ addr.name }}</span>
                    <span class="phone">{{ addr.phone }}</span>
                    <el-tag v-if="addr.isDefault === 1" type="primary" size="small">默认</el-tag>
                  </div>
                  <p class="detail">{{ addr.province }} {{ addr.city }} {{ addr.district }} {{ addr.detail }}</p>
                </div>
              </el-radio-button>
            </el-radio-group>
          </el-card>

          <!-- 商品列表 -->
          <el-card class="goods-card" shadow="hover" style="margin-top: 20px;">
            <template #header>
              <span><el-icon><ShoppingBag /></el-icon> 商品清单</span>
            </template>
            
            <div v-for="item in checkoutItems" :key="item.id" class="goods-item">
              <div class="goods-icon">
                <el-icon :size="40" color="#667eea"><Box /></el-icon>
              </div>
              <div class="goods-info">
                <h4>商品 ID: {{ item.goodsId }}</h4>
                <p>数量：{{ item.num }}</p>
              </div>
              <div class="goods-price">
                <span>¥{{ (item.price * item.num).toFixed(2) }}</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :lg="8">
          <!-- 订单摘要 -->
          <el-card class="summary-card" shadow="hover">
            <template #header>
              <span><el-icon><Document /></el-icon> 订单摘要</span>
            </template>
            
            <div class="summary-item">
              <span>商品件数</span>
              <span>{{ totalCount }} 件</span>
            </div>
            <div class="summary-item">
              <span>商品总价</span>
              <span>¥{{ totalPrice.toFixed(2) }}</span>
            </div>
            <div class="summary-item">
              <span>运费</span>
              <span class="free">免运费</span>
            </div>
            
            <el-divider />
            
            <div class="summary-item total">
              <span>应付金额</span>
              <span class="total-price">¥{{ totalPrice.toFixed(2) }}</span>
            </div>
            
            <el-button 
              type="primary" 
              size="large" 
              class="submit-btn"
              :loading="submitting"
              :disabled="!selectedAddressId"
              @click="submitOrder"
            >
              <el-icon><ShoppingCart /></el-icon>
              提交订单
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 添加地址对话框 -->
    <el-dialog v-model="showAddressDialog" title="添加收货地址" width="500px">
      <el-form :model="addressForm" label-width="80px">
        <el-form-item label="收件人">
          <el-input v-model="addressForm.name" placeholder="请输入收件人姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addressForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="addressForm.province" placeholder="请输入省份" />
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="addressForm.city" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="区县">
          <el-input v-model="addressForm.district" placeholder="请输入区县" />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="addressForm.detail" type="textarea" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="设为默认">
          <el-switch v-model="addressForm.isDefault" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddressDialog = false">取消</el-button>
        <el-button type="primary" @click="saveAddress">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const checkoutItems = ref([])
const addressList = ref([])
const selectedAddressId = ref(null)
const showAddressDialog = ref(false)
const submitting = ref(false)

const user = JSON.parse(localStorage.getItem('user') || 'null')

const addressForm = ref({
  userId: user?.id,
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: 0
})

const totalCount = computed(() => 
  checkoutItems.value.reduce((sum, item) => sum + item.num, 0)
)

const totalPrice = computed(() => 
  checkoutItems.value.reduce((sum, item) => sum + (item.price || 0) * item.num, 0)
)

const loadCheckoutItems = () => {
  const items = JSON.parse(localStorage.getItem('checkoutItems') || '[]')
  if (items.length === 0) {
    ElMessage.warning('请先选择要购买的商品')
    router.push('/cart')
    return
  }
  checkoutItems.value = items
}

const loadAddressList = async () => {
  if (!user) return
  
  try {
    const res = await fetch('/api/userAddress/list')
    const data = await res.json()
    addressList.value = data.filter(item => item.userId === user.id)
    
    if (addressList.value.length > 0) {
      const defaultAddr = addressList.value.find(a => a.isDefault === 1)
      selectedAddressId.value = defaultAddr ? defaultAddr.id : addressList.value[0].id
    }
  } catch (error) {
    ElMessage.error('加载地址失败')
  }
}

const saveAddress = async () => {
  if (!addressForm.value.name || !addressForm.value.phone) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  try {
    await fetch('/api/userAddress/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressForm.value)
    })
    
    ElMessage.success('添加成功')
    showAddressDialog.value = false
    addressForm.value = {
      userId: user?.id,
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      isDefault: 0
    }
    loadAddressList()
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

const submitOrder = async () => {
  if (!selectedAddressId.value) {
    ElMessage.warning('请选择收货地址')
    return
  }
  
  submitting.value = true
  try {
    const selectedAddress = addressList.value.find(a => a.id === selectedAddressId.value)
    const orderNo = Date.now().toString() + Math.random().toString(36).substr(2, 6).toUpperCase()
    
    const orderData = {
      userId: user.id,
      orderNo: orderNo,
      totalPrice: totalPrice.value,
      payPrice: totalPrice.value,
      payStatus: 0,
      orderStatus: 0,
      address: `${selectedAddress.province} ${selectedAddress.city} ${selectedAddress.district} ${selectedAddress.detail}`,
      name: selectedAddress.name,
      phone: selectedAddress.phone,
      createTime: new Date().toISOString()
    }
    
    const res = await fetch('/api/order/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })
    
    if (res.ok) {
      for (const item of checkoutItems.value) {
        await fetch(`/api/cart/delete/${item.id}`, { method: 'DELETE' })
      }
      
      localStorage.removeItem('checkoutItems')
      ElMessage.success('订单提交成功')
      router.push('/order')
    } else {
      ElMessage.error('订单提交失败')
    }
  } catch (error) {
    ElMessage.error('订单提交失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (!user) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  loadCheckoutItems()
  loadAddressList()
})
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  padding: 20px;
}

.checkout-container {
  max-width: 1200px;
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

.address-card,
.goods-card,
.summary-card {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.98);
  border: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address-item {
  width: 100%;
  margin: 0;
}

.address-item :deep(.el-radio-button__inner) {
  width: 100%;
  text-align: left;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
}

.address-item.is-active :deep(.el-radio-button__inner) {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.address-content {
  padding-left: 28px;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.address-header .name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.address-header .phone {
  color: #666;
}

.detail {
  margin: 0;
  color: #999;
  font-size: 14px;
}

.goods-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.goods-item:last-child {
  border-bottom: none;
}

.goods-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f3ff 0%, #e0e7ff 100%);
  border-radius: 12px;
  flex-shrink: 0;
}

.goods-info {
  flex: 1;
}

.goods-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.goods-info p {
  margin: 0;
  color: #999;
  font-size: 13px;
}

.goods-price {
  font-size: 18px;
  font-weight: 700;
  color: #ff4757;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  color: #666;
}

.summary-item.total {
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.free {
  color: #00b42a;
  font-weight: 600;
}

.total-price {
  font-size: 24px;
  color: #ff4757;
  font-weight: 800;
}

.submit-btn {
  width: 100%;
  margin-top: 20px;
  font-size: 16px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

@media (max-width: 768px) {
  .checkout-page {
    padding: 12px;
  }
}
</style>
