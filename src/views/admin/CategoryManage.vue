<template>
  <div class="category-manage">
    <el-card class="manage-card" shadow="hover">
      <template #header>
        <div class="header">
          <span><el-icon><Folder /></el-icon> 分类管理</span>
          <div class="actions">
            <el-button type="primary" @click="openForm()">
              <el-icon><Plus /></el-icon> 新增分类
            </el-button>
            <el-button @click="getList()" :loading="loading">
              <el-icon><Refresh /></el-icon> 刷新
            </el-button>
          </div>
        </div>
      </template>
      
      <el-empty v-if="list.length === 0" description="暂无分类" />
      
      <el-table v-else :data="list" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="pid" label="父ID" width="100" />
        <el-table-column prop="sort" label="排序" width="100" />
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
      :title="editId ? '编辑分类' : '新增分类'" 
      width="400px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="父分类ID">
          <el-input-number 
            v-model="form.pid" 
            :min="0" 
            placeholder="请输入父分类ID" 
            style="width: 100%" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number 
            v-model="form.sort" 
            :min="0" 
            placeholder="请输入排序" 
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
const form = ref({ name: '', pid: 0, sort: 0 })

const getList = async () => {
  loading.value = true
  try {
    const res = await fetch('/api/category/list')
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
    form.value = { name: '', pid: 0, sort: 0 }
  }
  showForm.value = true
}

const save = async () => {
  if (!form.value.name) {
    ElMessage.warning('请输入分类名称')
    return
  }

  saving.value = true
  try {
    if (editId.value) {
      await fetch('/api/category/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      })
      ElMessage.success('修改成功')
    } else {
      await fetch('/api/category/add', {
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
    await ElMessageBox.confirm('确定要删除该分类吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await fetch(`/api/category/delete/${id}`, { method: 'DELETE' })
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
.category-manage {
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
</style>
