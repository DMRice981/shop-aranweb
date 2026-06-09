<template>
  <div class="seller-goods">
    <el-card class="goods-card" shadow="hover">
      <template #header>
        <div class="header">
          <span><el-icon><component :is="IconGoods" /></el-icon> 我的商品</span>
          <div class="header-actions">
            <el-button type="primary" @click="openAddDialog">
              <el-icon><component :is="IconPlus" /></el-icon> 新增商品
            </el-button>
            <el-button @click="loadList" :loading="loading">
              <el-icon><component :is="IconRefresh" /></el-icon> 刷新
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索框 -->
      <div class="filter-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索商品名称或描述..."
          size="default"
          style="width: 300px"
          clearable
          @keyup.enter="loadList"
          @clear="loadList"
        >
          <template #append>
            <el-button :icon="IconSearch" @click="loadList" />
          </template>
        </el-input>
      </div>
      
      <el-empty v-if="list.length === 0 && !loading" description="暂无商品" />
      
      <el-table v-else :data="list" stripe style="width: 100%" v-loading="loading">
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
              <el-icon><component :is="IconEdit" /></el-icon> 编辑
            </el-button>
            <el-button 
              type="success" 
              v-if="row.status !== 1" 
              size="small" 
              @click="setStatus(row.id, 1)">
              <el-icon><component :is="IconCircleCheck" /></el-icon> 上架
            </el-button>
            <el-button 
              type="warning" 
              v-else 
              size="small" 
              @click="setStatus(row.id, 0)">
              <el-icon><component :is="IconCircleClose" /></el-icon> 下架
            </el-button>
            <el-button 
              type="danger" 
              size="small" 
              @click="deleteGoods(row)">
              <el-icon><component :is="IconDelete" /></el-icon> 删除
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
import { ref, onMounted, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Goods as IconGoods,
  Plus as IconPlus,
  Refresh as IconRefresh,
  Search as IconSearch,
  Edit as IconEdit,
  CircleCheck as IconCircleCheck,
  CircleClose as IconCircleClose,
  Delete as IconDelete
} from '@element-plus/icons-vue'

const http = inject('http')

const list = ref([])
const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const seller = ref(null)

// 分页和搜索
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')

const form = ref({
  id: null,
  goodsName: '',
  price: 0,
  stock: 0,
  categoryId: 1,
  goodsImg: '',
  goodsDesc: ''
})

const loadList = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value || undefined
    }
    const data = await http.get('/goods/my/paged', params)
    if (data.code === 200) {
      list.value = data.data.list || []
      total.value = data.data.total || 0
    } else {
      ElMessage.error(data.msg || '加载失败')
      list.value = []
    }
  } catch (error) {
    ElMessage.error('加载失败')
    list.value = []
  } finally {
    loading.value = false
  }
}

const setStatus = async (id, status) => {
  try {
    const res = await http.post(`/goods/status?id=${id}&status=${status}`)
    const data = res
    if (data.code === 200) {
      ElMessage.success('操作成功')
      loadList()
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
      res = await http.put('/goods/update', form.value)
    } else {
      // 新增商品
      res = await http.post('/goods/add', form.value)
    }
    if (res.code === 200) {
      ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
      dialogVisible.value = false
      loadList()
    } else {
      ElMessage.error(res.msg || '操作失败')
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
    
    const res = await http.delete(`/goods/delete/${row.id}`)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadList()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  seller.value = JSON.parse(localStorage.getItem('seller') || '{}')
  loadList()
})
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

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
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
</style>
