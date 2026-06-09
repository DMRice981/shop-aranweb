<template>
  <div class="seller-order">
    <el-card class="manage-card" shadow="hover">
      <template #header>
        <div class="header">
          <span><el-icon><component :is="IconDocument" /></el-icon> 订单管理</span>
          <div class="filter-buttons">
            <el-button-group>
              <el-button :type="statusFilter === null ? 'primary' : ''" @click="statusFilter = null; loadList()">全部</el-button>
              <el-button :type="statusFilter === 0 ? 'primary' : ''" @click="statusFilter = 0; loadList()">待支付</el-button>
              <el-button :type="statusFilter === 1 ? 'primary' : ''" @click="statusFilter = 1; loadList()">待发货</el-button>
              <el-button :type="statusFilter === 2 ? 'primary' : ''" @click="statusFilter = 2; loadList()">已发货</el-button>
              <el-button :type="statusFilter === 3 ? 'primary' : ''" @click="statusFilter = 3; loadList()">已完成</el-button>
            </el-button-group>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索订单号..."
              size="default"
              style="width: 200px"
              clearable
              @keyup.enter="loadList"
              @clear="loadList"
            >
              <template #append>
                <el-button :icon="IconSearch" @click="loadList" />
              </template>
            </el-input>
            <el-button @click="loadList()" :loading="loading">
              <el-icon><component :is="IconRefresh" /></el-icon> 刷新
            </el-button>
          </div>
        </div>
      </template>

      <el-empty v-if="list.length === 0 && !loading" description="暂无订单" />

      <el-table v-else :data="list" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="orderNo" label="订单号" width="200" />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="totalPrice" label="总价" width="120">
          <template #default="{ row }">
            <span class="price">¥{{ row.totalPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="支付状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.payStatus === 1 ? 'success' : 'warning'">
              {{ row.payStatus === 1 ? '已支付' : '未支付' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.orderStatus)">
              {{ getStatusText(row.orderStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button v-if="row.orderStatus === 1" type="primary" size="small" @click="handleSend(row)">
              <el-icon><component :is="IconVan" /></el-icon> 发货
            </el-button>
            <el-button type="info" size="small" @click="viewDetail(row)">
              <el-icon><component :is="IconView" /></el-icon> 详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination" v-if="total > 0">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadList"
          @current-change="loadList"
        />
      </div>
    </el-card>

    <el-dialog v-model="detailVisible" title="订单详情" width="700px">
      <div v-if="currentOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ currentOrder.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(currentOrder.orderStatus)">
              {{ getStatusText(currentOrder.orderStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="支付状态">
            <el-tag :type="currentOrder.payStatus === 1 ? 'success' : 'warning'">
              {{ currentOrder.payStatus === 1 ? '已支付' : '未支付' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="订单总价">
            <span class="price">¥{{ currentOrder.totalPrice }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ currentOrder.createTime }}</el-descriptions-item>
          <el-descriptions-item label="支付时间">{{ currentOrder.payTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="发货时间">{{ currentOrder.sendTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="确认时间">{{ currentOrder.confirmTime || '-' }}</el-descriptions-item>
        </el-descriptions>

        <h4 style="margin-top: 20px; margin-bottom: 10px;">商品明细</h4>
        <el-table :data="orderItems" style="width: 100%">
          <el-table-column prop="goodsName" label="商品名称" />
          <el-table-column prop="goodsImg" label="商品图片" width="100">
            <template #default="{ row }">
              <el-image :src="row.goodsImg" fit="cover" style="width: 60px; height: 60px;" />
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" width="100">
            <template #default="{ row }">¥{{ row.price }}</template>
          </el-table-column>
          <el-table-column prop="num" label="数量" width="80" />
          <el-table-column label="小计" width="100">
            <template #default="{ row }">¥{{ (row.price * row.num).toFixed(2) }}</template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button v-if="currentOrder && currentOrder.orderStatus === 1" type="primary" @click="handleSend(currentOrder)">
          <el-icon><component :is="IconVan" /></el-icon> 发货
        </el-button>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Document as IconDocument,
  Refresh as IconRefresh,
  Van as IconVan,
  View as IconView,
  Search as IconSearch
} from '@element-plus/icons-vue'

const http = inject('http')
const list = ref([])
const loading = ref(false)
const statusFilter = ref(null)
const detailVisible = ref(false)
const currentOrder = ref(null)
const orderItems = ref([])

// 分页和搜索
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')
const seller = ref(null)

const getStatusText = (status) => {
  const map = {
    0: '待支付',
    1: '待发货',
    2: '已发货',
    3: '已完成',
    4: '已取消'
  }
  return map[status] || '未知'
}

const getStatusType = (status) => {
  const map = {
    0: 'warning',
    1: 'primary',
    2: 'info',
    3: 'success',
    4: 'danger'
  }
  return map[status] || 'info'
}

const loadList = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      status: statusFilter.value,
      keyword: searchKeyword.value || undefined,
      sellerId: seller.value?.id
    }
    const data = await http.get('/order/list/all/paged', params)
    if (data.code === 200) {
      list.value = data.data.list || []
      total.value = data.data.total || 0
    } else {
      ElMessage.error(data.msg || '加载失败')
      list.value = []
    }
  } catch (e) {
    console.error('加载失败', e)
    ElMessage.error('加载失败')
    list.value = []
  } finally {
    loading.value = false
  }
}

const viewDetail = async (row) => {
  try {
    const data = await http.get('/order/get/' + row.id)
    if (data.code === 200) {
      currentOrder.value = data.data.order
      orderItems.value = data.data.orderItems || []
      detailVisible.value = true
    } else {
      ElMessage.error(data.msg || '获取详情失败')
    }
  } catch (e) {
    ElMessage.error('获取详情失败')
  }
}

const handleSend = async (row) => {
  try {
    await ElMessageBox.confirm('确定要发货吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const data = await http.post('/order/send/' + row.id)
    if (data.code === 200) {
      ElMessage.success('发货成功')
      detailVisible.value = false
      loadList()
    } else {
      ElMessage.error(data.msg || '发货失败')
    }
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('发货失败')
    }
  }
}

onMounted(() => {
  seller.value = JSON.parse(localStorage.getItem('seller') || '{}')
  loadList()
})
</script>

<style scoped>
.seller-order {
  padding: 20px;
}

.manage-card {
  border-radius: 16px;
  border: none;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.price {
  color: #ff4757;
  font-weight: 600;
}

.order-detail {
  padding: 10px 0;
}
</style>
