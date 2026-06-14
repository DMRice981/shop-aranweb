<template>
  <div class="address-page">
    <div class="address-container">
      <el-page-header @back="$router.push('/user')" content="返回用户中心" class="page-header" />
      
      <el-card class="address-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span><el-icon><component :is="IconLocation" /></el-icon> 我的收货地址</span>
            <el-button type="primary" @click="showAddDialog = true">
              <el-icon><component :is="IconPlus" /></el-icon> 新增地址
            </el-button>
          </div>
        </template>

        <el-empty v-if="addressList.length === 0" description="暂无收货地址" />
        
        <div v-else class="address-list">
          <div v-for="item in addressList" :key="item.id" class="address-item">
            <el-card>
              <div class="address-content">
                <div class="address-header">
                  <span class="name">{{ item.name }}</span>
                  <span class="phone">{{ item.phone }}</span>
                  <el-tag v-if="item.isDefault === 1" type="primary" size="small">默认地址</el-tag>
                </div>
                <p class="detail">{{ item.province }} {{ item.city }} {{ item.district }} {{ item.detail }}</p>
                <div class="address-actions">
                  <el-button type="primary" link @click="setDefault(item.id)" v-if="item.isDefault !== 1">
                    <el-icon><component :is="IconStar" /></el-icon> 设为默认
                  </el-button>
                  <el-button type="primary" link @click="openEditDialog(item)">
                    <el-icon><component :is="IconEdit" /></el-icon> 编辑
                  </el-button>
                  <el-button type="danger" link @click="deleteAddress(item.id)">
                    <el-icon><component :is="IconDelete" /></el-icon> 删除
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 添加/编辑地址对话框 -->
    <el-dialog v-model="showAddDialog" :title="editId ? '编辑收货地址' : '添加收货地址'" width="500px">
      <el-form :model="addressForm" label-width="80px">
        <el-form-item label="收件人">
          <el-input v-model="addressForm.name" placeholder="请输入收件人姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addressForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="addressForm.province" placeholder="请输入省份" />
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="addressForm.city" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="区县">
          <el-input v-model="addressForm.district" placeholder="请输入区县" />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="addressForm.detail" type="textarea" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="设为默认">
          <el-switch v-model="addressForm.isDefault" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveAddress">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Location as IconLocation,
  Plus as IconPlus,
  Star as IconStar,
  Edit as IconEdit,
  Delete as IconDelete
} from '@element-plus/icons-vue'

const router = useRouter()
const auth = inject('auth')
const user = ref(auth.getUser())
const addressList = ref([])
const showAddDialog = ref(false)
const editId = ref(null)

const addressForm = ref({
  userId: user.value?.id,
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: 0
})

const http = inject('http')

const getAddressList = async () => {
  try {
    const result = await http.get('/address/list', { userId: user.value?.id })
    addressList.value = result.data || result
  } catch (error) {
    ElMessage.error('加载地址失败')
  }
}

const openEditDialog = (item) => {
  editId.value = item.id
  addressForm.value = { ...item }
  showAddDialog.value = true
}

const saveAddress = async () => {
  if (!addressForm.value.name || !addressForm.value.phone) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  try {
    if (editId.value) {
      await http.put('/address/update', addressForm.value)
      ElMessage.success('修改成功')
    } else {
      await http.post('/address/add', addressForm.value)
      ElMessage.success('添加成功')
    }
    
    showAddDialog.value = false
    resetForm()
    getAddressList()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const setDefault = async (id) => {
  try {
    const addr = addressList.value.find(a => a.id === id)
    if (addr) {
      addr.isDefault = 1
      await http.put('/address/update', addr)
      
      for (const item of addressList.value) {
        if (item.id !== id && item.isDefault === 1) {
          item.isDefault = 0
          await http.put('/address/update', item)
        }
      }
      
      ElMessage.success('设置成功')
      getAddressList()
    }
  } catch (error) {
    ElMessage.error('设置失败')
  }
}

const deleteAddress = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该地址吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await http.delete(`/address/delete/${id}`)
    ElMessage.success('删除成功')
    getAddressList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const resetForm = () => {
  editId.value = null
  addressForm.value = {
    userId: user.value?.id,
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: 0
  }
}

onMounted(() => {
  if (!user.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  getAddressList()
})
</script>

<style scoped>
.address-page {
  min-height: 100vh;
  padding: 20px;
}

.address-container {
  max-width: 900px;
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

.address-card {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.98);
  border: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.address-item {
  transition: all 0.3s;
}

.address-item:hover {
  transform: translateY(-2px);
}

.address-content {
  position: relative;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.address-header .name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.address-header .phone {
  color: #666;
}

.detail {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
}

.address-actions {
  display: flex;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

@media (max-width: 768px) {
  .address-page {
    padding: 12px;
  }
}
</style>
