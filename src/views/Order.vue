<template>
  <div class="order-page">
    <div class="order-container">
      <el-page-header @back="$router.push('/')" content="返回首页" class="page-header" />
      
      <el-card class="order-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span><el-icon><Document /></el-icon> 我的订单</span>
            <el-button type="primary" plain @click="getOrderList" :loading="loading">
              <el-icon><Refresh /></el-icon> 刷新
            </el-button>
          </div>
        </template>

        <el-empty v-if="orderList.length === 0" description="暂无订单" />
        
        <div v-else class="order-list">
          <div v-for="item in orderList" :key="item.id" class="order-item">
            <el-card>
              <div class="order-header">
                <span class="order-no">订单号: {{ item.orderNo }}</span>
                <el-tag :type="item.payStatus === 1 ? 'success' : 'warning'" size="large">
                  {{ item.payStatus === 1 ? '已支付' : '待支付' }}
                </el-tag>
              </div>
              
              <el-divider />
              
              <!-- 订单商品列表 -->
              <div class="order-goods">
                <div v-for="orderItem in orderItemsMap[item.orderNo] || []" :key="orderItem.id" class="order-goods-item">
                  <el-image 
                    v-if="orderItem.goodsImg" 
                    :src="orderItem.goodsImg" 
                    fit="cover"
                    class="goods-image"
                  />
                  <el-icon v-else :size="32" color="#667eea"><Box /></el-icon>
                  <div class="goods-info">
                    <h4>{{ orderItem.goodsName }}</h4>
                    <p>数量: {{ orderItem.num }} × ¥{{ (orderItem.price || 0).toFixed(2) }}</p>
                  </div>
                  <div class="goods-subtotal">
                    ¥{{ ((orderItem.price || 0) * orderItem.num).toFixed(2) }}
                  </div>
                </div>
              </div>
              
              <el-divider />
              
              <div class="order-info">
                <div class="info-row" v-if="addressMap[item.addressId]">
                  <span class="label">收货信息:</span>
                  <span class="value">
                    {{ addressMap[item.addressId].name }} 
                    {{ addressMap[item.addressId].phone }}
                  </span>
                </div>
                <div class="info-row" v-if="addressMap[item.addressId]">
                  <span class="label">收货地址:</span>
                  <span class="value">
                    {{ addressMap[item.addressId].province }} 
                    {{ addressMap[item.addressId].city }} 
                    {{ addressMap[item.addressId].district }} 
                    {{ addressMap[item.addressId].detail }}
                  </span>
                </div>
                <div class="info-row">
                  <span class="label">订单金额:</span>
                  <span class="value price">¥{{ (item.totalPrice || 0).toFixed(2) }}</span>
                </div>
                <div class="info-row">
                  <span class="label">实付金额:</span>
                  <span class="value price">¥{{ (item.payPrice || 0).toFixed(2) }}</span>
                </div>
                <div class="info-row">
                  <span class="label">订单状态:</span>
                  <span class="value">{{ getStatusText(item.orderStatus) }}</span>
                </div>
                <div class="info-row">
                  <span class="label">创建时间:</span>
                  <span class="value">{{ item.createTime || '-' }}</span>
                </div>
              </div>

              <div class="order-actions">
                <el-button v-if="item.payStatus !== 1" type="primary" @click="payOrder(item)">
                  <el-icon><CreditCard /></el-icon> 立即支付
                </el-button>
                <el-button v-if="item.orderStatus === 0 && item.payStatus === 1" type="primary" @click="confirmOrder(item)">
                  <el-icon><CircleCheck /></el-icon> 确认收货
                </el-button>
                <el-button type="danger" plain @click="cancelOrder(item)" v-if="item.orderStatus === 0 && item.payStatus === 0">
                  <el-icon><CircleClose /></el-icon> 取消订单
                </el-button>
                <el-button type="warning" @click="openAfterSaleDialog(item)">
                  <el-icon><Service /></el-icon> 申请售后
                </el-button>
              </div>
            </el-card>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 申请售后对话框 -->
    <el-dialog v-model="afterSaleDialogVisible" title="申请售后" width="500px">
      <el-form :model="afterSaleForm" label-width="100px">
        <el-form-item label="订单ID">
          <el-input-number 
            v-model="afterSaleForm.orderId" 
            disabled
            style="width: 100%" 
          />
        </el-form-item>
        <el-form-item label="商品ID">
          <el-input-number 
            v-model="afterSaleForm.goodsId" 
            :min="1" 
            style="width: 100%" 
            placeholder="请输入要售后的商品ID" 
          />
        </el-form-item>
        <el-form-item label="卖家ID">
          <el-input-number 
            v-model="afterSaleForm.sellerId" 
            :min="1" 
            style="width: 100%" 
            placeholder="请输入卖家ID" 
          />
        </el-form-item>
        <el-form-item label="售后原因">
          <el-input 
            v-model="afterSaleForm.reason" 
            type="textarea" 
            :rows="4" 
            placeholder="请输入售后原因" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="afterSaleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAfterSale" :loading="afterSaleSubmitting">
          提交申请
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const orderList = ref([])
const orderItemsMap = ref({})
const addressMap = ref({})
const loading = ref(false)
const afterSaleDialogVisible = ref(false)
const afterSaleSubmitting = ref(false)
const afterSaleForm = ref({
  orderId: null,
  goodsId: null,
  sellerId: null,
  reason: ''
})
const user = JSON.parse(localStorage.getItem('user') || 'null')

const getStatusText = (status) => {
  const map = ['待付款', '待发货', '待收货', '已完成', '已取消']
  return map[status] || '未知状态'
}

const getOrderItems = async (orderNo) => {
  if (orderItemsMap.value[orderNo]) {
    return orderItemsMap.value[orderNo]
  }
  
  try {
    const res = await fetch('/api/orderItem/list')
    const data = await res.json()
    const items = data.filter(item => item.orderNo === orderNo)
    orderItemsMap.value[orderNo] = items
    return items
  } catch (error) {
    console.error('加载订单项失败', error)
    return []
  }
}

const getAddress = async (addressId) => {
  if (addressMap.value[addressId]) {
    return addressMap.value[addressId]
  }
  
  try {
    const res = await fetch('/api/userAddress/list')
    const data = await res.json()
    const address = data.find(a => a.id === addressId)
    if (address) {
      addressMap.value[addressId] = address
    }
    return address
  } catch (error) {
    console.error('加载地址失败', error)
    return null
  }
}

const getOrderList = async () => {
  if (!user) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  loading.value = true
  try {
    const res = await fetch('/api/order/list')
    const data = await res.json()
    orderList.value = data.filter(o => o.userId === user.id)
    
    // 预加载订单项和地址
    for (const order of orderList.value) {
      await getOrderItems(order.orderNo)
      if (order.addressId) {
        await getAddress(order.addressId)
      }
    }
  } catch (error) {
    ElMessage.error('加载订单失败')
  } finally {
    loading.value = false
  }
}

const payOrder = async (order) => {
  try {
    await ElMessageBox.confirm(`确认支付 ¥${order.payPrice} ?`, '提示', {
      confirmButtonText: '确认支付',
      cancelButtonText: '取消',
      type: 'info'
    })
    
    order.payStatus = 1
    await fetch('/api/order/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    })
    
    ElMessage.success('支付成功')
    getOrderList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('支付失败')
    }
  }
}

const confirmOrder = async (order) => {
  try {
    await ElMessageBox.confirm('确认收货？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info'
    })
    
    order.orderStatus = 3
    await fetch('/api/order/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    })
    
    ElMessage.success('收货成功')
    getOrderList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const cancelOrder = async (order) => {
  try {
    await ElMessageBox.confirm('确定取消订单？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    order.orderStatus = 4
    await fetch('/api/order/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    })
    
    ElMessage.success('订单已取消')
    getOrderList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('取消失败')
    }
  }
}

const openAfterSaleDialog = (order) => {
  afterSaleForm.value = {
    orderId: order.id,
    goodsId: null,
    sellerId: null,
    reason: ''
  }
  afterSaleDialogVisible.value = true
}

const submitAfterSale = async () => {
  if (!afterSaleForm.value.goodsId) {
    ElMessage.warning('请输入商品ID')
    return
  }
  if (!afterSaleForm.value.sellerId) {
    ElMessage.warning('请输入卖家ID')
    return
  }
  if (!afterSaleForm.value.reason) {
    ElMessage.warning('请输入售后原因')
    return
  }

  afterSaleSubmitting.value = true
  try {
    const applyData = {
      ...afterSaleForm.value,
      userId: user.id
    }
    await fetch('/api/after-sale/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applyData)
    })
    ElMessage.success('售后申请成功')
    afterSaleDialogVisible.value = false
    router.push('/after-sale')
  } catch (error) {
    ElMessage.error('售后申请失败')
  } finally {
    afterSaleSubmitting.value = false
  }
}

onMounted(() => {
  getOrderList()
})
</script>

<style scoped>
.order-page {
  min-height: 100vh;
  padding: 20px;
}

.order-container {
  max-width: 900px;
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

.order-card {
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

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  transition: all 0.3s;
}

.order-item:hover {
  transform: translateY(-2px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-no {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-goods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-goods-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.order-goods-item .goods-image {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  flex-shrink: 0;
}

.order-goods-item .goods-info {
  flex: 1;
}

.order-goods-item .goods-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.order-goods-item .goods-info p {
  margin: 0;
  font-size: 13px;
  color: #666;
}

.order-goods-item .goods-subtotal {
  font-size: 16px;
  font-weight: 700;
  color: #ff4757;
  flex-shrink: 0;
}

.info-row {
  display: flex;
  gap: 12px;
}

.label {
  color: #666;
  font-size: 14px;
  min-width: 80px;
}

.value {
  color: #333;
  font-size: 14px;
  flex: 1;
}

.value.price {
  color: #ff4757;
  font-weight: 700;
  font-size: 18px;
}

.order-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

@media (max-width: 768px) {
  .order-page {
    padding: 12px;
  }
}
</style>
