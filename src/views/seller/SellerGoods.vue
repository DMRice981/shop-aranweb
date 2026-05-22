<template>
  <div class="seller-goods">
    <el-card class="goods-card" shadow="hover">
      <template #header>
        <div class="header">
          <span><el-icon><Goods /></el-icon> 我的商品</span>
          <el-button type="primary" @click="getList" :loading="loading">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
        </div>
      </template>
      
      <el-empty v-if="list.length === 0" description="暂无商品" />
      
      <el-table v-else :data="list" stripe style="width: 100%">
        <el-table-column prop="goodsName" label="商品名" />
        <el-table-column prop="price" label="价格">
          <template #default="{ row }">
            <span class="price">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              v-if="row.status !== 1" 
              size="small" 
              @click="set(row.id, 1)">
              上架
            </el-button>
            <el-button 
              type="warning" 
              v-else 
              size="small" 
              @click="set(row.id, 0)">
              下架
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
    const res = await fetch(`/api/goods/my?sellerId=${seller.id}`)
    const data = await res.json()
    list.value = data.data || []
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const set = async (id, status) => {
  try {
    await fetch(`/api/goods/status?id=${id}&status=${status}`, { method: 'POST' })
    ElMessage.success('操作成功')
    getList()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

onMounted(getList)
</script>

<style scoped>
.seller-goods {
  padding: 20px;
}

.goods-card {
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
