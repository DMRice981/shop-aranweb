<template>
  <div>
    <h2>轮播管理</h2>
    <button @click="openForm()">新增轮播</button>
    <button @click="getList()">刷新</button>

    <table border="1" cellpadding="6" cellspacing="0" style="width:100%;margin:15px 0;">
      <thead>
      <tr>
        <th>ID</th>
        <th>图片地址</th>
        <th>排序</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in list" :key="item.id">
        <td>{{item.id}}</td>
        <td>{{item.imgUrl}}</td>
        <td>{{item.sort}}</td>
        <td>
          <button @click="openForm(item)">编辑</button>
          <button @click="del(item.id)">删除</button>
        </td>
      </tr>
      </tbody>
    </table>

    <div v-if="showForm" class="form-box">
      <h3>{{editId?'编辑':'新增'}}轮播</h3>
      <input v-model="form.imgUrl" placeholder="图片链接">
      <input v-model.number="form.sort" placeholder="排序">
      <button @click="save">保存</button>
      <button @click="showForm=false">取消</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
let list = ref([])
let showForm = ref(false)
let editId = ref(null)
let form = ref({ imgUrl: '', sort: 0 })

const getList = async () => {
  try {
    const res = await fetch('/api/banner/list')
    const data = await res.json()
    list.value = Array.isArray(data) ? data : []
  } catch (e) {
    list.value = []
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
  try {
    if (editId.value) {
      await fetch('/api/banner/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      })
    } else {
      await fetch('/api/banner/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      })
    }
    showForm.value = false
    getList()
  } catch (e) {
    alert('操作失败')
  }
}

const del = async (id) => {
  if (!confirm('确定删除？')) return
  try {
    await fetch(`/api/banner/delete/${id}`, { method: 'DELETE' })
    getList()
  } catch (e) {
    alert('删除失败')
  }
}

onMounted(getList)
</script>

<style scoped>
.form-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px;
  border: 1px solid #ccc;
}
input {
  display: block;
  margin: 8px 0;
  padding: 8px;
  width: 260px;
}
button {
  margin: 4px;
  padding: 5px 10px;
}
</style>