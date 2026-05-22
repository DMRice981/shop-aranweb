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
              
              <div class="order-info">
                <div class="info-row">
                  <span class="label">收货信息:</span>
                  <span class="value">{{ item.name }} {{ item.phone }}</span>
                </div>
                <div class="info-row">
                  <span class="label">收货地址:</span>
                  <span class="value">{{ item.address }}</span>
                </div>
                <div class="info-row">
                  <span class="label">订单金额:</span>
                  <span class="value price">¥{{ item.totalPrice }}</span>
                </div>
                <div class="info-row">
                  <span class="label">实付金额:</span>
                  <span class="value price">¥{{ item.payPrice }}</span>
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
              </div>
            </el-card>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const orderList = ref([])
const loading = ref(false)

const getStatusText = (status) => {
  const map = ['待付款', '待发货', '待收货', '已完成', '已取消']
  return map[status] || '未知状态'
}

const getOrderList = async () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
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
