<template>
  <div class="user-manage">
    <el-card class="manage-card" shadow="hover">
      <template #header>
        <div class="header">
          <span><el-icon><User /></el-icon> 用户管理</span>
          <div class="actions">
            <el-button type="primary" @click="openForm()">
              <el-icon><Plus /></el-icon> 新增用户
            </el-button>
            <el-button @click="getList()" :loading="loading">
              <el-icon><Refresh /></el-icon> 刷新
            </el-button>
          </div>
        </div>
      </template>
      
      <el-empty v-if="list.length === 0" description="暂无用户" />
      
      <el-table v-else :data="list" stripe style="width: 100%">
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
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

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

const getList = async () => {
  loading.value = true
  try {
    const res = await fetch('/api/user/list')
    const data = await res.json()
    list.value = Array.isArray(data) ? data : []
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
      await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      })
      ElMessage.success('修改成功')
    } else {
      await fetch('/api/user/add', {
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
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await fetch(`/api/user/delete/${id}`, { method: 'DELETE' })
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
</style>
