<template>
  <div class="goods-manage">
    <el-card class="manage-card" shadow="hover">
      <template #header>
        <div class="header">
          <span><el-icon><component :is="IconGoods" /></el-icon> 商品管理</span>
          <div class="actions">
            <el-button type="primary" @click="openForm()">
              <el-icon><component :is="IconPlus" /></el-icon> 新增商品
            </el-button>
            <el-button @click="loadList()" :loading="loading">
              <el-icon><component :is="IconRefresh" /></el-icon> 刷新
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索和筛选 -->
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
        <el-select v-model="filterStatus" placeholder="商品状态" clearable style="width: 150px" @change="loadList">
          <el-option label="全部" value="" />
          <el-option label="上架" :value="1" />
          <el-option label="下架" :value="0" />
        </el-select>
      </div>
      
      <el-empty v-if="list.length === 0 && !loading" description="暂无商品" />
      
      <el-table v-else :data="list" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="goodsName" label="商品名称" />
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">
            <span class="price">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column label="分类" width="120">
          <template #default="{ row }">
            {{ getCategoryName(row.categoryId) || '未分类' }}
          </template>
        </el-table-column>
        <el-table-column label="商家" width="180">
          <template #default="{ row }">
            <div v-if="row.sellerId">
              <div class="seller-info">
                <span class="shop-name">{{ row.shopName || '未知店铺' }}</span>
                <span class="seller-name">@{{ row.sellerName || '未知商家' }}</span>
              </div>
            </div>
            <span v-else class="no-seller">无商家</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'warning'">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
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

    <el-dialog 
      v-model="showForm" 
      :title="editId ? '编辑商品' : '新增商品'" 
      width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="商品名称">
          <el-input v-model="form.goodsName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model="form.goodsDesc" placeholder="请输入商品描述" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="商品图片">
          <el-input v-model="form.goodsImg" placeholder="请输入商品图片URL" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number 
            v-model="form.price" 
            :min="0" 
            :precision="2" 
            placeholder="请输入价格" 
            style="width: 100%" />
        </el-form-item>
        <el-form-item label="市场价">
          <el-input-number 
            v-model="form.marketPrice" 
            :min="0" 
            :precision="2" 
            placeholder="请输入市场价" 
            style="width: 100%" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number 
            v-model="form.stock" 
            :min="0" 
            placeholder="请输入库存" 
            style="width: 100%" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.categoryId" placeholder="请选择分类">
            <el-option label="未分类" :value="0" />
            <el-option 
              v-for="category in categoryList" 
              :key="category.id" 
              :label="category.name" 
              :value="category.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商家">
          <el-select v-model="form.sellerId" placeholder="请选择商家">
            <el-option label="无商家" :value="0" />
            <el-option 
              v-for="seller in sellerList" 
              :key="seller.id" 
              :label="seller.shopName || seller.username" 
              :value="seller.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
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
import { ref, onMounted, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Goods as IconGoods,
  Plus as IconPlus,
  Refresh as IconRefresh,
  Search as IconSearch
} from '@element-plus/icons-vue'

const http = inject('http')

const list = ref([])
const categoryList = ref([])
const sellerList = ref([])
const loading = ref(false)
const saving = ref(false)
const showForm = ref(false)
const editId = ref(null)
const form = ref({ goodsName: '', goodsDesc: '', goodsImg: '', price: 0, marketPrice: 0, stock: 0, categoryId: 0, sellerId: 0, status: 1 })

// 分页和搜索
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')
const filterStatus = ref('')

const loadList = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value || undefined,
      status: filterStatus.value !== '' ? filterStatus.value : undefined
    }
    const data = await http.get('/goods/list/all/paged', params)
    if (data.code === 200) {
      list.value = data.data.list || []
      total.value = data.data.total || 0
    } else {
      ElMessage.error(data.msg || '加载失败')
      list.value = []
    }
  } catch (e) {
    ElMessage.error('加载失败')
    list.value = []
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const data = await http.get('/category/list')
    categoryList.value = data.data || (Array.isArray(data) ? data : [])
  } catch (e) {
    console.error('加载分类失败', e)
  }
}

const loadSellers = async () => {
  try {
    const data = await http.get('/seller/list')
    sellerList.value = data.data || (Array.isArray(data) ? data : [])
  } catch (e) {
    console.error('加载商家失败', e)
  }
}

const getCategoryName = (categoryId) => {
  const category = categoryList.value.find(c => c.id === categoryId)
  return category?.name || ''
}

const openForm = (row = null) => {
  if (row) {
    editId.value = row.id
    form.value = { 
      ...row, 
      categoryId: row.categoryId || 0,
      sellerId: row.sellerId || 0,
      status: row.status !== undefined ? row.status : 1
    }
  } else {
    editId.value = null
    form.value = { goodsName: '', goodsDesc: '', goodsImg: '', price: 0, marketPrice: 0, stock: 0, categoryId: 0, sellerId: 0, status: 1 }
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
      await http.put('/goods/update', form.value)
      ElMessage.success('修改成功')
    } else {
      await http.post('/goods/add', form.value)
      ElMessage.success('添加成功')
    }
    showForm.value = false
    loadList()
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
    await http.delete(`/goods/delete/${id}`)
    ElMessage.success('删除成功')
    loadList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(async () => {
  await loadCategories()
  await loadSellers()
  await loadList()
})
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

.seller-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.shop-name {
  font-weight: 600;
  color: #667eea;
  font-size: 14px;
}

.seller-name {
  font-size: 12px;
  color: #909399;
}

.no-seller {
  color: #909399;
  font-style: italic;
}
</style>
