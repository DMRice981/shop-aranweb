<template>
  <div class="seller-after-sale">
    <el-card class="after-sale-card" shadow="hover">
      <template #header>
        <div class="header">
          <span><el-icon><Service /></el-icon> 售后管理</span>
          <el-button type="primary" @click="getList" :loading="loading">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
        </div>
      </template>
      
      <el-empty v-if="list.length === 0" description="暂无售后" />
      
      <el-table v-else :data="list" stripe style="width: 100%">
        <el-table-column prop="reason" label="原因" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 0 ? 'warning' : 'success'">
              {{ row.status === 0 ? '待处理' : '已处理' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              v-if="row.status === 0" 
              size="small" 
              @click="handle(row.id)">
              处理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const list = ref([])
const loading = ref(false)
const seller = JSON.parse(localStorage.getItem('seller')||'{}')

const getList = async () => {
  loading.value = true
  try {
    const res = await fetch(`/api/after-sale/list?sellerId=${seller.id}`)
    const data = await res.json()
    list.value = data.data || []
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const handle = async (id) => {
  try {
    await fetch(`/api/after-sale/handle?id=${id}`, { method: 'POST' })
    ElMessage.success('处理成功')
    getList()
  } catch (error) {
    ElMessage.error('操作失败')
  }
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
</style>
