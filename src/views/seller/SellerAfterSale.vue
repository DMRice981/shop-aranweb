<template>
  <div class="seller-after-sale">
    <el-card class="after-sale-card" shadow="hover">
      <template #header>
        <div class="header">
          <span><el-icon><component :is="IconService" /></el-icon> 售后管理</span>
          <div class="header-stats">
            <el-tag type="warning" size="large">
              待处理: {{ pendingCount }}
            </el-tag>
            <el-tag type="success" size="large">
              已处理: {{ handledCount }}
            </el-tag>
          </div>
          <el-button type="primary" @click="getList" :loading="loading">
            <el-icon><component :is="IconRefresh" /></el-icon> 刷新
          </el-button>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="待处理" name="pending">
          <el-empty v-if="pendingList.length === 0" description="暂无待处理的售后" />
          <div v-else class="after-sale-list">
            <el-card 
              v-for="item in pendingList" 
              :key="item.afterSale.id" 
              class="after-sale-item"
              shadow="hover">
              <div class="after-sale-content">
                <div class="goods-section">
                  <el-image 
                    v-if="item.goods"
                    :src="item.goods.goodsImg" 
                    fit="cover" 
                    class="goods-image"
                    :preview-src-list="item.goods ? [item.goods.goodsImg] : []" />
                  <div class="goods-info">
                    <h4>{{ item.goods?.goodsName || '商品已下架' }}</h4>
                    <p class="order-no">订单号: {{ item.afterSale.orderNo || '-' }}</p>
                  </div>
                </div>
                
                <div class="reason-section">
                  <el-descriptions :column="1" size="small">
                    <el-descriptions-item label="用户ID">
                      {{ item.afterSale.userId || '-' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="申请时间">
                      {{ formatDate(item.afterSale.createTime) }}
                    </el-descriptions-item>
                    <el-descriptions-item label="售后原因">
                      <div class="reason-content">
                        {{ item.afterSale.reason || '-' }}
                      </div>
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
                
                <div class="action-section">
                  <el-button type="primary" size="large" @click="handleAfterSale(item)">
                    <el-icon><component :is="IconCheck" /></el-icon> 处理售后
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="已处理" name="handled">
          <el-empty v-if="handledList.length === 0" description="暂无已处理的售后" />
          
          <el-table v-else :data="handledList" stripe style="width: 100%">
            <el-table-column label="售后ID" width="100">
              <template #default="{ row }">
                {{ row.afterSale.id }}
              </template>
            </el-table-column>
            <el-table-column label="订单号" width="180">
              <template #default="{ row }">
                {{ row.afterSale.orderNo || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="商品信息" min-width="200">
              <template #default="{ row }">
                <div v-if="row.goods" class="goods-info-cell">
                  <el-image 
                    :src="row.goods.goodsImg" 
                    fit="cover" 
                    class="goods-image-small"
                    :preview-src-list="[row.goods.goodsImg]" />
                  <span>{{ row.goods.goodsName }}</span>
                </div>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="用户ID" width="100">
              <template #default="{ row }">
                {{ row.afterSale.userId || '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="afterSale.reason" label="售后原因" min-width="150" show-overflow-tooltip />
            <el-table-column prop="afterSale.createTime" label="申请时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.afterSale.createTime) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button type="info" link size="small" @click="viewDetail(row)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="全部" name="all">
          <el-empty v-if="list.length === 0" description="暂无售后记录" />
          
          <el-table v-else :data="list" stripe style="width: 100%">
            <el-table-column label="售后ID" width="100">
              <template #default="{ row }">
                {{ row.afterSale.id }}
              </template>
            </el-table-column>
            <el-table-column label="订单号" width="180">
              <template #default="{ row }">
                {{ row.afterSale.orderNo || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="商品信息" min-width="200">
              <template #default="{ row }">
                <div v-if="row.goods" class="goods-info-cell">
                  <el-image 
                    :src="row.goods.goodsImg" 
                    fit="cover" 
                    class="goods-image-small"
                    :preview-src-list="[row.goods.goodsImg]" />
                  <span>{{ row.goods.goodsName }}</span>
                </div>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="用户ID" width="100">
              <template #default="{ row }">
                {{ row.afterSale.userId || '-' }}
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
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button 
                  type="primary" 
                  link 
                  size="small" 
                  v-if="row.afterSale.status === 0"
                  @click="handleAfterSale(row)">
                  处理
                </el-button>
                <el-button type="info" link size="small" @click="viewDetail(row)">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 处理售后对话框 -->
    <el-dialog v-model="handleDialogVisible" title="处理售后" width="500px">
      <div v-if="currentItem" class="handle-content">
        <el-alert
          title="确认处理此售后申请？"
          type="info"
          :closable="false"
          show-icon />
        
        <el-divider />
        
        <el-descriptions :column="1" border>
          <el-descriptions-item label="售后ID">
            {{ currentItem.afterSale.id }}
          </el-descriptions-item>
          <el-descriptions-item label="订单号">
            {{ currentItem.afterSale.orderNo || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="商品名称">
            {{ currentItem.goods?.goodsName || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="用户ID">
            {{ currentItem.afterSale.userId || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="申请时间">
            {{ formatDate(currentItem.afterSale.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="售后原因">
            <div class="reason-text">
              {{ currentItem.afterSale.reason || '-' }}
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="handleDialogVisible = false">取消</el-button>
        <el-button type="success" @click="confirmHandle" :loading="handleLoading">
          <el-icon><component :is="IconCheck" /></el-icon> 确认处理
        </el-button>
      </template>
    </el-dialog>

    <!-- 售后详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="售后详情" width="500px">
      <div v-if="currentItem" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="售后ID">
            {{ currentItem.afterSale.id }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentItem.afterSale.status === 0 ? 'warning' : 'success'">
              {{ currentItem.afterSale.status === 0 ? '待处理' : '已处理' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="订单号" :span="2">
            {{ currentItem.afterSale.orderNo || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="用户ID">
            {{ currentItem.afterSale.userId || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="申请时间">
            {{ formatDate(currentItem.afterSale.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="商品名称" :span="2">
            {{ currentItem.goods?.goodsName || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="商品图片" :span="2">
            <el-image 
              v-if="currentItem.goods"
              :src="currentItem.goods.goodsImg" 
              fit="cover" 
              style="width: 100px; height: 100px; border-radius: 8px;"
              :preview-src-list="[currentItem.goods.goodsImg]" />
            <span v-else>-</span>
          </el-descriptions-item>
          <el-descriptions-item label="售后原因" :span="2">
            <div class="reason-text">
              {{ currentItem.afterSale.reason || '-' }}
            </div>
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
import { ref, computed, onMounted, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Service as IconService,
  Refresh as IconRefresh,
  Check as IconCheck
} from '@element-plus/icons-vue'

const http = inject('http')
const list = ref([])
const loading = ref(false)
const handleLoading = ref(false)
const activeTab = ref('pending')
const handleDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const currentItem = ref(null)
const seller = JSON.parse(localStorage.getItem('seller') || '{}')

const pendingList = computed(() => {
  return list.value.filter(item => item.afterSale.status === 0)
})

const handledList = computed(() => {
  return list.value.filter(item => item.afterSale.status === 1)
})

const pendingCount = computed(() => pendingList.value.length)
const handledCount = computed(() => handledList.value.length)

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
    const data = await http.get('/after-sale/list', { sellerId: seller.id })
    if (data.code === 200) {
      list.value = data.data || []
    } else {
      ElMessage.error(data.msg || '加载失败')
    }
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const handleTabChange = (tabName) => {
  console.log('切换到', tabName)
}

const handleAfterSale = (item) => {
  currentItem.value = item
  handleDialogVisible.value = true
}

const confirmHandle = async () => {
  if (!currentItem.value) return
  
  handleLoading.value = true
  try {
    const result = await http.post(`/after-sale/handle?id=${currentItem.value.afterSale.id}`)
    
    if (result.code === 200) {
      ElMessage.success('处理成功')
      handleDialogVisible.value = false
      getList()
    } else {
      ElMessage.error(result.msg || '处理失败')
    }
  } catch (error) {
    ElMessage.error('处理失败，请稍后重试')
  } finally {
    handleLoading.value = false
  }
}

const viewDetail = (item) => {
  currentItem.value = item
  detailDialogVisible.value = true
}

onMounted(getList)
</script>

<style scoped>
.seller-after-sale {
  padding: 20px;
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

.header-stats {
  display: flex;
  gap: 12px;
}

.after-sale-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.after-sale-item {
  border-radius: 12px;
  border: 1px solid #ebeef5;
}

.after-sale-content {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.goods-section {
  display: flex;
  gap: 16px;
  flex: 0 0 300px;
}

.goods-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  flex-shrink: 0;
}

.goods-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.goods-info h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.order-no {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.reason-section {
  flex: 1;
}

.reason-content {
  padding: 8px;
  background: #f5f7fa;
  border-radius: 6px;
  line-height: 1.6;
}

.action-section {
  display: flex;
  align-items: center;
  flex: 0 0 150px;
}

.goods-info-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.goods-image-small {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  flex-shrink: 0;
}

.handle-content {
  padding: 10px 0;
}

.reason-text {
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 6px;
  line-height: 1.6;
  margin: 0;
}

.detail-content {
  padding: 10px 0;
}

@media (max-width: 768px) {
  .after-sale-content {
    flex-direction: column;
  }
  
  .goods-section {
    flex: none;
    width: 100%;
  }
  
  .action-section {
    flex: none;
    width: 100%;
  }
}
</style>
