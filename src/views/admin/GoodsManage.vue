<template>
  <div class="goods-manage">
    <el-card class="manage-card" shadow="hover">
      <template #header>
        <div class="header">
          <span><el-icon><Goods /></el-icon> 商品管理</span>
          <div class="actions">
            <el-button type="primary" @click="openForm()">
              <el-icon><Plus /></el-icon> 新增商品
            </el-button>
            <el-button @click="getList()" :loading="loading">
              <el-icon><Refresh /></el-icon> 刷新
            </el-button>
          </div>
        </div>
      </template>
      
      <el-empty v-if="list.length === 0" description="暂无商品" />
      
      <el-table v-else :data="list" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="goodsName" label="商品名称" />
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">
            <span class="price">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="categoryId" label="分类ID" width="100" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="openForm(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="del(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog 
      v-model="showForm" 
      :title="editId ? '编辑商品' : '新增商品'" 
      width="400px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="form.goodsName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number 
            v-model="form.price" 
            :min="0" 
            :precision="2" 
            placeholder="请输入价格" 
            style="width: 100%" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number 
            v-model="form.stock" 
            :min="0" 
            placeholder="请输入库存" 
            style="width: 100%" />
        </el-form-item>
        <el-form-item label="分类ID">
          <el-input-number 
            v-model="form.categoryId" 
            :min="0" 
            placeholder="请输入分类ID" 
            style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showForm = false">取消</el-button>
        <el-button type="primary" @click="save" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const list = ref([])
const loading = ref(false)
const saving = ref(false)
const showForm = ref(false)
const editId = ref(null)
const form = ref({ goodsName: '', price: 0, stock: 0, categoryId: 0 })

const getList = async () => {
  loading.value = true
  try {
    const res = await fetch('/api/goods/list/all')
    const data = await res.json()
    list.value = data.data || (Array.isArray(data) ? data : [])
  } catch (e) {
    ElMessage.error('加载失败')
    list.value = []
  } finally {
    loading.value = false
  }
}

const openForm = (row = null) => {
  if (row) {
    editId.value = row.id
    form.value = { ...row }
  } else {
    editId.value = null
    form.value = { goodsName: '', price: 0, stock: 0, categoryId: 0 }
  }
  showForm.value = true
}

const save = async () => {
  if (!form.value.goodsName) {
    ElMessage.warning('请输入商品名称')
    return
  }

  saving.value = true
  try {
    if (editId.value) {
      await fetch('/api/goods/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      })
      ElMessage.success('修改成功')
    } else {
      await fetch('/api/goods/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      })
      ElMessage.success('添加成功')
    }
    showForm.value = false
    getList()
  } catch (e) {
    ElMessage.error('操作失败')
  } finally {
    saving.value = false
  }
}

const del = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await fetch(`/api/goods/delete/${id}`, { method: 'DELETE' })
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
.goods-manage {
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

.actions {
  display: flex;
  gap: 10px;
}

.price {
  color: #ff4757;
  font-weight: 600;
}
</style>
