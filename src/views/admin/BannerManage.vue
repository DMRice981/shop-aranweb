<template>
  <div class="banner-manage">
    <el-card class="manage-card" shadow="hover">
      <template #header>
        <div class="header">
          <span><el-icon><component :is="IconPicture" /></el-icon> 轮播管理</span>
          <div class="actions">
            <el-button type="primary" @click="openForm()">
              <el-icon><component :is="IconPlus" /></el-icon> 新增轮播
            </el-button>
            <el-button @click="getList()" :loading="loading">
              <el-icon><component :is="IconRefresh" /></el-icon> 刷新
            </el-button>
          </div>
        </div>
      </template>
      
      <el-empty v-if="list.length === 0" description="暂无轮播图" />
      
      <el-table v-else :data="list" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="imgUrl" label="图片地址" show-overflow-tooltip />
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
      :title="editId ? '编辑轮播' : '新增轮播'" 
      width="400px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="图片链接">
          <el-input v-model="form.imgUrl" placeholder="请输入图片链接" />
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
import { ref, onMounted, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Picture as IconPicture,
  Plus as IconPlus,
  Refresh as IconRefresh
} from '@element-plus/icons-vue'

const http = inject('http')

const list = ref([])
const loading = ref(false)
const saving = ref(false)
const showForm = ref(false)
const editId = ref(null)
const form = ref({ imgUrl: '', sort: 0 })

const getList = async () => {
  loading.value = true
  try {
    const data = await http.get('/banner/list')
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
    form.value = { imgUrl: '', sort: 0 }
  }
  showForm.value = true
}

const save = async () => {
  if (!form.value.imgUrl) {
    ElMessage.warning('请输入图片链接')
    return
  }

  saving.value = true
  try {
    if (editId.value) {
      await http.put('/banner/update', form.value)
      ElMessage.success('修改成功')
    } else {
      await http.post('/banner/add', form.value)
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
    await ElMessageBox.confirm('确定要删除该轮播吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await http.delete(`/banner/delete/${id}`)
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
.banner-manage {
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
