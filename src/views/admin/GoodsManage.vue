<template>
  <div>
    <h2>商品管理</h2>
    <button @click="openForm()">新增商品</button>
    <button @click="getList()">刷新</button>

    <table border="1" cellpadding="6" cellspacing="0" style="width:100%;margin:15px 0;">
      <thead>
      <tr>
        <th>ID</th>
        <th>商品名</th>
        <th>价格</th>
        <th>库存</th>
        <th>分类ID</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in list" :key="item.id">
        <td>{{item.id}}</td>
        <td>{{item.goodsName}}</td>
        <td>{{item.price}}</td>
        <td>{{item.stock}}</td>
        <td>{{item.categoryId}}</td>
        <td>
          <button @click="openForm(item)">编辑</button>
          <button @click="del(item.id)">删除</button>
        </td>
      </tr>
      </tbody>
    </table>

    <div v-if="showForm" class="form-box">
      <h3>{{editId?'编辑':'新增'}}商品</h3>
      <input v-model="form.goodsName" placeholder="商品名称">
      <input v-model.number="form.price" placeholder="价格">
      <input v-model.number="form.stock" placeholder="库存">
      <input v-model.number="form.categoryId" placeholder="分类ID">
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
let form = ref({ goodsName: '', price: 0, stock: 0, categoryId: 0 })

const getList = async () => {
  try {
    const res = await fetch('/api/goods/list')
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
    form.value = { goodsName: '', price: 0, stock: 0, categoryId: 0 }
  }
  showForm.value = true
}

const save = async () => {
  try {
    if (editId.value) {
      await fetch('/api/goods/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      })
    } else {
      console.log('save===============')
      await fetch('/api/goods/add', {
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
    await fetch(`/api/goods/delete/${id}`, { method: 'DELETE' })
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