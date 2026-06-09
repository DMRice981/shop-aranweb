<template>
  <div class="after-sale-page">
    <div class="after-sale-container">
      <el-page-header @back="$router.back()" content="返回" class="page-header" />
      
      <el-card class="after-sale-card" shadow="hover">
        <template #header>
          <div class="header">
            <span><el-icon><component :is="IconService" /></el-icon> 我的售后</span>
            <div class="header-actions">
              <el-button type="primary" @click="openApplyDialog">
                <el-icon><component :is="IconPlus" /></el-icon> 申请售后
              </el-button>
              <el-button @click="getList" :loading="loading">
                <el-icon><component :is="IconRefresh" /></el-icon> 刷新
              </el-button>
            </div>
          </div>
        </template>
        
        <el-empty v-if="list.length === 0" description="暂无售后记录" />
        
        <el-table v-else :data="list" stripe style="width: 100%">
          <el-table-column prop="afterSale.id" label="售后ID" width="80" />
          <el-table-column label="订单号" width="180">
            <template #default="{ row }">
              {{ row.afterSale.orderNo || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="商品信息" min-width="200">
            <template #default="{ row }">
              <div v-if="row.goods" class="goods-info">
                <el-image 
                  :src="row.goods.goodsImg" 
                  fit="cover" 
                  class="goods-image"
                  :preview-src-list="[row.goods.goodsImg]"
                />
                <span class="goods-name">{{ row.goods.goodsName }}</span>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="afterSale.reason" label="售后原因" min-width="150" show-overflow-tooltip />
          <el-table-column prop="afterSale.status" label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="row.afterSale.status === 0 ? 'warning' : 'success'">
                {{ row.afterSale.status === 0 ? '待处理' : '已处理' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="afterSale.createTime" label="申请时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.afterSale.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <el-button 
                type="primary" 
                link 
                size="small" 
                @click="viewDetail(row)">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 申请售后对话框 -->
    <el-dialog v-model="dialogVisible" title="申请售后" width="600px" destroy-on-close>
      <el-form :model="form" label-width="100px">
        <el-form-item label="选择订单">
          <el-select 
            v-model="form.orderId" 
            placeholder="请选择订单" 
            style="width: 100%"
            filterable
            @change="handleOrderChange">
            <el-option
              v-for="order in orderList"
              :key="order.id"
              :label="`订单号: ${order.orderNo} - 总价: ¥${order.totalPrice}`"
              :value="order.id">
              <div class="order-option">
                <span>订单号: {{ order.orderNo }}</span>
                <span class="order-price">¥{{ order.totalPrice }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="选择商品" v-if="orderGoods.length > 0">
          <el-select 
            v-model="form.goodsId" 
            placeholder="请选择商品" 
            style="width: 100%"
            filterable>
            <el-option
              v-for="goods in orderGoods"
              :key="goods.goodsId"
              :label="goods.goodsName"
              :value="goods.goodsId">
              <div class="goods-option">
                <el-image :src="goods.goodsImg" fit="cover" class="goods-thumb" />
                <span>{{ goods.goodsName }}</span>
                <span class="goods-price">¥{{ goods.price }} × {{ goods.num }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="售后原因">
          <el-input 
            v-model="form.reason" 
            type="textarea" 
            :rows="4" 
            placeholder="请详细描述您申请售后的原因，我们将尽快为您处理"
            maxlength="500"
            show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitApply" :loading="submitLoading">
          提交申请
        </el-button>
      </template>
    </el-dialog>

    <!-- 售后详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="售后详情" width="500px">
      <div v-if="currentDetail" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="售后ID">{{ currentDetail.afterSale.id }}</el-descriptions-item>
          <el-descriptions-item label="订单号">{{ currentDetail.afterSale.orderNo || '-' }}</el-descriptions-item>
          <el-descriptions-item label="售后状态">
            <el-tag :type="currentDetail.afterSale.status === 0 ? 'warning' : 'success'">
              {{ currentDetail.afterSale.status === 0 ? '待处理' : '已处理' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="申请时间">
            {{ formatDate(currentDetail.afterSale.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="商品名称" :span="2">
            {{ currentDetail.goods?.goodsName || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="售后原因" :span="2">
            {{ currentDetail.afterSale.reason || '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Service as IconService,
  Plus as IconPlus,
  Refresh as IconRefresh
} from '@element-plus/icons-vue'

const router = useRouter()
const auth = inject('auth')
const user = ref(auth.getUser())
const list = ref([])
const orderList = ref([])
const orderGoods = ref([])
const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const currentDetail = ref(null)

const form = ref({
  orderId: null,
  goodsId: null,
  reason: ''
})

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

const getList = async () => {
  loading.value = true
  try {
    const res = await fetch(`/api/after-sale/list?userId=${user.value?.id}`)
    const data = await res.json()
    list.value = data.data || []
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const getOrderList = async () => {
  try {
    const res = await fetch(`/api/order/list?userId=${user.value?.id}`)
    const data = await res.json()
    if (data.code === 200) {
      orderList.value = data.data || []
    }
  } catch (error) {
    console.error('获取订单列表失败', error)
  }
}

const handleOrderChange = async (orderId) => {
  form.value.goodsId = null
  if (!orderId) {
    orderGoods.value = []
    return
  }
  
  try {
    const res = await fetch(`/api/order/get/${orderId}`)
    const data = await res.json()
    if (data.code === 200 && data.data.orderItems) {
      orderGoods.value = data.data.orderItems
    }
  } catch (error) {
    ElMessage.error('获取订单详情失败')
  }
}

const openApplyDialog = async () => {
  form.value = {
    orderId: null,
    goodsId: null,
    reason: ''
  }
  orderGoods.value = []
  dialogVisible.value = true
  await getOrderList()
}

const submitApply = async () => {
  if (!form.value.orderId) {
    ElMessage.warning('请选择订单')
    return
  }
  if (!form.value.goodsId) {
    ElMessage.warning('请选择商品')
    return
  }
  if (!form.value.reason) {
    ElMessage.warning('请输入售后原因')
    return
  }
  if (form.value.reason.length < 10) {
    ElMessage.warning('售后原因请至少输入10个字符')
    return
  }

  submitLoading.value = true
  try {
    const applyData = {
      userId: user.value?.id,
      orderId: form.value.orderId,
      goodsId: form.value.goodsId,
      reason: form.value.reason
    }
    
    const res = await fetch('/api/after-sale/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applyData)
    })
    const result = await res.json()
    
    if (result.code === 200) {
      ElMessage.success('申请成功，我们会尽快处理您的售后请求')
      dialogVisible.value = false
      getList()
    } else {
      ElMessage.error(result.msg || '申请失败')
    }
  } catch (error) {
    ElMessage.error('申请失败，请稍后重试')
  } finally {
    submitLoading.value = false
  }
}

const viewDetail = (row) => {
  currentDetail.value = row
  detailDialogVisible.value = true
}

onMounted(() => {
  if (!user.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  getList()
})
</script>

<style scoped>
.after-sale-page {
  min-height: 100vh;
  padding: 20px;
}

.after-sale-container {
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

.after-sale-card {
  border-radius: 16px;
  border: none;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.goods-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.goods-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  flex-shrink: 0;
}

.goods-name {
  font-size: 14px;
  color: #333;
}

.order-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}

.order-price {
  color: #f56c6c;
  font-weight: 600;
}

.goods-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.goods-thumb {
  width: 40px;
  height: 40px;
  border-radius: 6px;
}

.goods-price {
  color: #999;
  font-size: 12px;
  margin-left: auto;
}

.detail-content {
  padding: 10px 0;
}
</style>
