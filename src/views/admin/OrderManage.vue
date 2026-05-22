<template>
  <div class="order-manage">
    <el-card class="manage-card" shadow="hover">
      <template #header>
        <div class="header">
          <span><el-icon><Document /></el-icon> 订单管理</span>
          <el-button @click="getList()" :loading="loading">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
        </div>
      </template>
      
      <el-empty v-if="list.length === 0" description="暂无订单" />
      
      <el-table v-else :data="list" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="orderNo" label="订单号" />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="totalPrice" label="总价" width="120">
          <template #default="{ row }">
            <span class="price">¥{{ row.totalPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="支付状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.payStatus === 1 ? 'success' : 'warning'">
              {{ row.payStatus === 1 ? '已支付' : '未支付' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="del(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const list = ref([])
const loading = ref(false)

const getList = async () => {
  loading.value = true
  try {
    const res = await fetch('/api/order/list')
    const data = await res.json()
    list.value = Array.isArray(data) ? data : []
  } catch (e) {
    ElMessage.error('加载失败')
    list.value = []
  } finally {
    loading.value = false
  }
}

const del = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await fetch(`/api/order/delete/${id}`, { method: 'DELETE' })
    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(getList)
</script>

<style scoped>
.order-manage {
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

.price {
  color: #ff4757;
  font-weight: 600;
}
</style>
