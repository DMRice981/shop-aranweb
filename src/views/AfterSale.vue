<template>
  <div class="after-sale-page">
    <div class="after-sale-container">
      <el-page-header @back="$router.back()" content="返回" class="page-header" />
      
      <el-card class="after-sale-card" shadow="hover">
        <template #header>
          <div class="header">
            <span><el-icon><Service /></el-icon> 我的售后</span>
            <div class="header-actions">
              <el-button type="primary" @click="openApplyDialog">
                <el-icon><Plus /></el-icon> 申请售后
              </el-button>
              <el-button @click="getList" :loading="loading">
                <el-icon><Refresh /></el-icon> 刷新
              </el-button>
            </div>
          </div>
        </template>
        
        <el-empty v-if="list.length === 0" description="暂无售后记录" />
        
        <el-table v-else :data="list" stripe style="width: 100%">
          <el-table-column prop="id" label="售后ID" width="100" />
          <el-table-column prop="orderId" label="订单ID" width="100" />
          <el-table-column prop="goodsId" label="商品ID" width="100" />
          <el-table-column prop="reason" label="原因" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="row.status === 0 ? 'warning' : 'success'">
                {{ row.status === 0 ? '待处理' : '已处理' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="申请时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.createTime) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 申请售后对话框 -->
    <el-dialog v-model="dialogVisible" title="申请售后" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="订单ID">
          <el-input-number 
            v-model="form.orderId" 
            :min="1" 
            style="width: 100%" 
            placeholder="请输入订单ID" />
        </el-form-item>
        <el-form-item label="商品ID">
          <el-input-number 
            v-model="form.goodsId" 
            :min="1" 
            style="width: 100%" 
            placeholder="请输入商品ID" />
        </el-form-item>
        <el-form-item label="卖家ID">
          <el-input-number 
            v-model="form.sellerId" 
            :min="1" 
            style="width: 100%" 
            placeholder="请输入卖家ID" />
        </el-form-item>
        <el-form-item label="售后原因">
          <el-input 
            v-model="form.reason" 
            type="textarea" 
            :rows="4" 
            placeholder="请输入售后原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitApply" :loading="submitLoading">
          提交申请
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const list = ref([])
const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const user = JSON.parse(localStorage.getItem('user')||'{}')

const form = ref({
  orderId: null,
  goodsId: null,
  sellerId: null,
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
    const res = await fetch(`/api/after-sale/my?userId=${user.id}`)
    const data = await res.json()
    list.value = data.data || []
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const openApplyDialog = () => {
  form.value = {
    orderId: null,
    goodsId: null,
    sellerId: null,
    reason: ''
  }
  dialogVisible.value = true
}

const submitApply = async () => {
  if (!form.value.orderId) {
    ElMessage.warning('请输入订单ID')
    return
  }
  if (!form.value.goodsId) {
    ElMessage.warning('请输入商品ID')
    return
  }
  if (!form.value.sellerId) {
    ElMessage.warning('请输入卖家ID')
    return
  }
  if (!form.value.reason) {
    ElMessage.warning('请输入售后原因')
    return
  }

  submitLoading.value = true
  try {
    const applyData = {
      ...form.value,
      userId: user.id
    }
    await fetch('/api/after-sale/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applyData)
    })
    ElMessage.success('申请成功')
    dialogVisible.value = false
    getList()
  } catch (error) {
    ElMessage.error('申请失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(getList)
</script>

<style scoped>
.after-sale-page {
  min-height: 100vh;
  padding: 20px;
}

.after-sale-container {
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
</style>
