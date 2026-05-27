<template>
  <div class="seller-goods">
    <el-card class="goods-card" shadow="hover">
      <template #header>
        <div class="header">
          <span><el-icon><Goods /></el-icon> 我的商品</span>
          <div class="header-actions">
            <el-button type="primary" @click="openAddDialog">
              <el-icon><Plus /></el-icon> 新增商品
            </el-button>
            <el-button @click="getList" :loading="loading">
              <el-icon><Refresh /></el-icon> 刷新
            </el-button>
          </div>
        </div>
      </template>
      
      <el-empty v-if="list.length === 0" description="暂无商品" />
      
      <el-table v-else :data="list" stripe style="width: 100%">
        <el-table-column prop="goodsName" label="商品名" />
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">
            <span class="price">¥{{ (row.price || 0).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="sales" label="销量" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="320">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              size="small" 
              @click="openEditDialog(row)">
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            <el-button 
              type="success" 
              v-if="row.status !== 1" 
              size="small" 
              @click="setStatus(row.id, 1)">
              <el-icon><CircleCheck /></el-icon> 上架
            </el-button>
            <el-button 
              type="warning" 
              v-else 
              size="small" 
              @click="setStatus(row.id, 0)">
              <el-icon><CircleClose /></el-icon> 下架
            </el-button>
            <el-button 
              type="danger" 
              size="small" 
              @click="deleteGoods(row)">
              <el-icon><Delete /></el-icon> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑商品对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? '编辑商品' : '新增商品'" 
      width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="商品名称">
          <el-input v-model="form.goodsName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number 
            v-model="form.price" 
            :min="0" 
            :precision="2" 
            :step="0.1" 
            style="width: 100%" 
            placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number 
            v-model="form.stock" 
            :min="0" 
            style="width: 100%" 
            placeholder="请输入库存" />
        </el-form-item>
        <el-form-item label="分类ID">
          <el-input-number 
            v-model="form.categoryId" 
            :min="1" 
            style="width: 100%" 
            placeholder="请输入分类ID" />
        </el-form-item>
        <el-form-item label="商品图片">
          <el-input v-model="form.goodsImg" placeholder="请输入图片URL" />
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input 
            v-model="form.goodsDesc" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入商品描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitGoods" :loading="submitLoading">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const list = ref([])
const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const seller = JSON.parse(localStorage.getItem('seller')||'{}')

const form = ref({
  id: null,
  goodsName: '',
  price: 0,
  stock: 0,
  categoryId: 1,
  goodsImg: '',
  goodsDesc: ''
})

const getList = async () => {
  loading.value = true
  try {
    const res = await fetch(`/api/goods/my`)
    const data = await res.json()
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

const setStatus = async (id, status) => {
  try {
    const res = await fetch(`/api/goods/status?id=${id}&status=${status}`, { method: 'POST' })
    const data = await res.json()
    if (data.code === 200) {
      ElMessage.success('操作成功')
      getList()
    } else {
      ElMessage.error(data.msg || '操作失败')
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const openAddDialog = () => {
  isEdit.value = false
  form.value = {
    id: null,
    goodsName: '',
    price: 0,
    stock: 0,
    categoryId: 1,
    goodsImg: '',
    goodsDesc: ''
  }
  dialogVisible.value = true
}

const openEditDialog = (row) => {
  isEdit.value = true
  form.value = {
    id: row.id,
    goodsName: row.goodsName,
    price: row.price,
    stock: row.stock,
    categoryId: row.categoryId,
    goodsImg: row.goodsImg,
    goodsDesc: row.goodsDesc
  }
  dialogVisible.value = true
}

const submitGoods = async () => {
  if (!form.value.goodsName) {
    ElMessage.warning('请输入商品名称')
    return
  }
  if (form.value.price <= 0) {
    ElMessage.warning('请输入有效价格')
    return
  }
  if (form.value.stock < 0) {
    ElMessage.warning('请输入有效库存')
    return
  }

  submitLoading.value = true
  try {
    let res
    if (isEdit.value) {
      // 编辑商品
      res = await fetch('/api/goods/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      })
    } else {
      // 新增商品 - 不需要传sellerId，后端从Session获取
      res = await fetch('/api/goods/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      })
    }
    const data = await res.json()
    if (data.code === 200) {
      ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
      dialogVisible.value = false
      getList()
    } else {
      ElMessage.error(data.msg || '操作失败')
    }
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

const deleteGoods = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除商品「${row.goodsName}」吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const res = await fetch(`/api/goods/delete/${row.id}`, {
      method: 'DELETE'
    })
    const data = await res.json()
    if (data.code === 200) {
      ElMessage.success('删除成功')
      getList()
    } else {
      ElMessage.error(data.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
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

.header-actions {
  display: flex;
  gap: 12px;
}

.price {
  color: #ff4757;
  font-weight: 600;
}
</style>
