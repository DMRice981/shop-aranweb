<template>
  <div class="order-page">
    <div class="order-container">
      <el-page-header @back="$router.push('/')" content="返回首页" class="page-header" />
      
      <el-card class="order-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span><el-icon><Document /></el-icon> 我的订单</span>
            <el-button type="primary" plain @click="loadOrderList" :loading="loading">
              <el-icon><Refresh /></el-icon> 刷新
            </el-button>
          </div>
        </template>

        <el-empty v-if="orderList.length === 0" description="暂无订单">
          <el-button type="primary" @click="$router.push('/')">去购物</el-button>
        </el-empty>
        
        <div v-else class="order-list">
          <div v-for="item in orderList" :key="item.id" class="order-item">
            <el-card>
              <div class="order-header">
                <span class="order-no">订单号: {{ item.orderNo }}</span>
                <div class="order-tags">
                  <el-tag :type="getPayStatusType(item.payStatus)" size="large">
                    {{ getPayStatusText(item.payStatus) }}
                  </el-tag>
                  <el-tag :type="getOrderStatusType(item.orderStatus)" size="large">
                    {{ getOrderStatusText(item.orderStatus) }}
                  </el-tag>
                </div>
              </div>
              
              <el-divider />
              
              <!-- 订单商品列表 -->
              <div class="order-goods">
                <div v-for="orderItem in getOrderItems(item.id)" :key="orderItem.id" class="order-goods-item">
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
                <div class="info-row" v-if="getAddress(item.addressId)">
                  <span class="label">收货信息:</span>
                  <span class="value">
                    {{ getAddress(item.addressId).name }} 
                    {{ getAddress(item.addressId).phone }}
                  </span>
                </div>
                <div class="info-row" v-if="getAddress(item.addressId)">
                  <span class="label">收货地址:</span>
                  <span class="value">
                    {{ getAddress(item.addressId).province }} 
                    {{ getAddress(item.addressId).city }} 
                    {{ getAddress(item.addressId).district }} 
                    {{ getAddress(item.addressId).detail }}
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
                  <span class="label">下单时间:</span>
                  <span class="value">{{ formatDate(item.createTime) }}</span>
                </div>
              </div>

              <div class="order-actions">
                <el-button v-if="item.payStatus !== 1 && item.orderStatus === 0" type="primary" @click="payOrder(item)">
                  <el-icon><CreditCard /></el-icon> 立即支付
                </el-button>
                <el-button v-if="item.orderStatus === 2" type="success" @click="confirmOrder(item)">
                  <el-icon><CircleCheck /></el-icon> 确认收货
                </el-button>
                <el-button type="danger" plain @click="cancelOrder(item)" v-if="item.orderStatus < 3 && item.orderStatus !== 4">
                  <el-icon><CircleClose /></el-icon> 取消订单
                </el-button>
                <el-button type="warning" @click="openAfterSaleDialog(item)" v-if="item.orderStatus >= 3">
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
        <el-form-item label="订单号">
          <el-input v-model="afterSaleForm.orderNo" disabled />
        </el-form-item>
        <el-form-item label="选择商品">
          <el-select v-model="afterSaleForm.goodsId" placeholder="请选择要售后的商品" style="width: 100%">
            <el-option
              v-for="item in afterSaleForm.orderItems"
              :key="item.id"
              :label="`${item.goodsName} × ${item.num}`"
              :value="item.goodsId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="售后原因">
          <el-input 
            v-model="afterSaleForm.reason" 
            type="textarea" 
            :rows="4" 
            placeholder="请详细描述您需要售后的原因" 
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
import { getOrderList as fetchOrderListAPI, payOrder as payOrderAPI, confirmOrder as confirmOrderAPI, cancelOrder as cancelOrderAPI } from '@/api/order'
import { getAddressList } from '@/api/userAddress'

const router = useRouter()
const orderList = ref([])
const orderItemsMap = ref({})
const addressMap = ref({})
const loading = ref(false)
const afterSaleDialogVisible = ref(false)
const afterSaleSubmitting = ref(false)
const afterSaleForm = ref({
  orderId: null,
  orderNo: '',
  orderItems: [],
  goodsId: null,
  reason: ''
})
const user = JSON.parse(localStorage.getItem('user') || 'null')

const getPayStatusText = (status) => {
  const map = {
    0: '待支付',
    1: '已支付'
  }
  return map[status] || '未知'
}

const getPayStatusType = (status) => {
  return status === 1 ? 'success' : 'warning'
}

const getOrderStatusText = (status) => {
  const map = {
    0: '待付款',   // 待发货 & 未支付
    1: '待发货',   // 待发货 & 已支付
    2: '已发货',   // 配送中
    3: '已完成',
    4: '已取消'
  }
  return map[status] || '未知状态'
}

const getOrderStatusType = (status) => {
  const types = {
    0: 'warning',  // 待付款 → 橙色警示
    1: 'primary',  // 待发货 → 蓝色
    2: 'info',     // 已发货 → 灰蓝
    3: 'success',  // 已完成 → 绿色
    4: 'danger'    // 已取消 → 红色
  }
  return types[status] || 'info'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getOrderItems = (orderId) => {
  return orderItemsMap.value[orderId] || []
}

const getAddress = (addressId) => {
  return addressMap.value[addressId] || null
}

const loadAddresses = async () => {
  try {
    const res = await getAddressList(user?.id)
    const addresses = res.data || res || []
    addresses.forEach(addr => {
      addressMap.value[addr.id] = addr
    })
  } catch (error) {
    console.error('加载地址失败', error)
  }
}

const loadOrderList = async () => {
  if (!user) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  loading.value = true
  try {
    const res = await fetchOrderListAPI(user.id)
    const orders = res.data || res || []
    orderList.value = Array.isArray(orders) ? orders : []

    // 加载每个订单的订单项
    for (const order of orderList.value) {
      try {
        const itemRes = await fetch(`/api/orderItem/list?orderId=${order.id}`)
        const itemResult = await itemRes.json()
        const items = itemResult.data || []
        orderItemsMap.value[order.id] = items
      } catch (e) {
        console.error(`加载订单 ${order.id} 的订单项失败`, e)
      }
    }
    
    await loadAddresses()
  } catch (error) {
    console.error('加载订单失败', error)
    ElMessage.error('加载订单失败')
  } finally {
    loading.value = false
  }
}

const payOrder = async (order) => {
  try {
    await ElMessageBox.confirm(`确认支付 ¥${order.payPrice || order.totalPrice} ?`, '支付确认', {
      confirmButtonText: '确认支付',
      cancelButtonText: '取消',
      type: 'info'
    })
    
    await payOrderAPI(order.id)
    ElMessage.success('支付成功')
    await loadOrderList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('支付失败', error)
      ElMessage.error('支付失败')
    }
  }
}

const confirmOrder = async (order) => {
  try {
    await ElMessageBox.confirm('确认收货？', '确认收货', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info'
    })
    
    await confirmOrderAPI(order.id)
    ElMessage.success('收货成功')
    await loadOrderList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('操作失败', error)
      ElMessage.error('操作失败')
    }
  }
}

const cancelOrder = async (order) => {
  try {
    await ElMessageBox.confirm('确定取消订单？此操作不可恢复', '取消订单', {
      confirmButtonText: '确定取消',
      cancelButtonText: '返回',
      type: 'warning'
    })
    
    await cancelOrderAPI(order.id)
    ElMessage.success('订单已取消')
    await loadOrderList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消失败', error)
      ElMessage.error('取消失败')
    }
  }
}

const openAfterSaleDialog = (order) => {
  afterSaleForm.value = {
    orderId: order.id,
    orderNo: order.orderNo,
    orderItems: getOrderItems(order.id),
    goodsId: null,
    reason: ''
  }
  afterSaleDialogVisible.value = true
}

const submitAfterSale = async () => {
  if (!afterSaleForm.value.goodsId) {
    ElMessage.warning('请选择要售后的商品')
    return
  }
  if (!afterSaleForm.value.reason) {
    ElMessage.warning('请输入售后原因')
    return
  }

  afterSaleSubmitting.value = true
  try {
    const orderItem = afterSaleForm.value.orderItems.find(item => item.goodsId === afterSaleForm.value.goodsId)
    
    const applyData = {
      orderId: afterSaleForm.value.orderId,
      userId: user.id,
      goodsId: afterSaleForm.value.goodsId,
      reason: afterSaleForm.value.reason
    }
    
    const res = await fetch('/api/after-sale/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applyData)
    })
    
    if (res.ok) {
      ElMessage.success('售后申请已提交')
      afterSaleDialogVisible.value = false
      router.push('/after-sale')
    } else {
      throw new Error('申请失败')
    }
  } catch (error) {
    console.error('售后申请失败', error)
    ElMessage.error('售后申请失败')
  } finally {
    afterSaleSubmitting.value = false
  }
}

onMounted(() => {
  loadOrderList()
})
</script>

<style scoped>
.order-page {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.order-container {
  max-width: 1000px;
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
  font-size: 18px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-item {
  transition: all 0.3s;
}

.order-item:hover {
  transform: translateY(-4px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.order-no {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  font-family: monospace;
}

.order-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-goods {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-goods-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f2ff 100%);
  border-radius: 12px;
  transition: all 0.2s;
}

.order-goods-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.order-goods-item .goods-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  flex-shrink: 0;
  overflow: hidden;
}

.order-goods-item .goods-info {
  flex: 1;
}

.order-goods-item .goods-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.order-goods-item .goods-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.order-goods-item .goods-subtotal {
  font-size: 20px;
  font-weight: 800;
  color: #ff4757;
  flex-shrink: 0;
}

.info-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.label {
  color: #666;
  font-size: 14px;
  min-width: 80px;
  font-weight: 500;
}

.value {
  color: #333;
  font-size: 14px;
  flex: 1;
}

.value.price {
  color: #ff4757;
  font-weight: 800;
  font-size: 20px;
}

.order-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px dashed #e5e7eb;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .order-page {
    padding: 12px;
  }
  
  .order-goods-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .order-goods-item .goods-image {
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
  }
  
  .order-actions {
    flex-direction: column;
  }
  
  .order-actions .el-button {
    width: 100%;
  }
}
</style>
