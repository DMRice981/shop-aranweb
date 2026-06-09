<template>
  <div class="user-manage">
    <el-card class="manage-card" shadow="hover">
      <template #header>
        <div class="header">
          <span><el-icon><component :is="IconUser" /></el-icon> 用户管理</span>
          <div class="actions">
            <el-button type="primary" @click="openForm()">
              <el-icon><component :is="IconPlus" /></el-icon> 新增用户
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
          placeholder="搜索用户名或手机号..."
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
        <el-select v-model="filterStatus" placeholder="用户状态" clearable style="width: 150px" @change="loadList">
          <el-option label="全部" value="" />
          <el-option label="正常" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </div>
      
      <el-empty v-if="list.length === 0 && !loading" description="暂无用户" />
      
      <el-table v-else :data="list" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="password" label="密码" show-overflow-tooltip />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '禁用' }}
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
      :title="editId ? '编辑用户' : '新增用户'" 
      width="400px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="请输入密码" 
            show-password />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
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
  User as IconUser,
  Plus as IconPlus,
  Refresh as IconRefresh,
  Search as IconSearch
} from '@element-plus/icons-vue'

const http = inject('http')

const list = ref([])
const loading = ref(false)
const saving = ref(false)
const showForm = ref(false)
const editId = ref(null)
const form = ref({
  username: '', 
  password: '', 
  phone: '', 
  status: 1, 
  isDelete: 0
})

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
    const data = await http.get('/user/list/paged', params)
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

const openForm = (row = null) => {
  if (row) {
    editId.value = row.id
    form.value = { ...row }
  } else {
    editId.value = null
    form.value = { 
      username: '', 
      password: '', 
      phone: '', 
      status: 1, 
      isDelete: 0 
    }
  }
  showForm.value = true
}

const save = async () => {
  if (!form.value.username) {
    ElMessage.warning('请输入用户名')
    return
  }

  saving.value = true
  try {
    if (editId.value) {
      await http.put('/user/update', form.value)
      ElMessage.success('修改成功')
    } else {
      await http.post('/user/add', form.value)
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
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await http.delete('/user/delete/' + id)
    ElMessage.success('删除成功')
    loadList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(loadList)
</script>

<style scoped>
.user-manage {
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
</style>
