<template>
  <div class="page">
    <div class="container">
      <h2>我的订单</h2>

      <div class="order-list">
        <div class="order-item" v-for="item in orderList" :key="item.id">
          <div class="line">
            <label>订单编号：</label>
            <span>{{ item.orderNo }}</span>
          </div>
          <div class="line">
            <label>订单金额：</label>
            <span>¥{{ item.totalPrice }}</span>
          </div>
          <div class="line">
            <label>实付金额：</label>
            <span>¥{{ item.payPrice }}</span>
          </div>
          <div class="line">
            <label>支付状态：</label>
            <span :class="item.payStatus === 1 ? 'paid' : 'unpaid'">
              {{ item.payStatus === 1 ? '已支付' : '未支付' }}
            </span>
          </div>
          <div class="line">
            <label>订单状态：</label>
            <span>{{ getStatusText(item.orderStatus) }}</span>
          </div>
          <div class="line">
            <label>创建时间：</label>
            <span>{{ item.createTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const user = JSON.parse(localStorage.getItem('user'))
const orderList = ref([])

const getOrderList = async () => {
  const res = await fetch('/api/order/list')
  const data = await res.json()
  orderList.value = data.filter(o => o.userId === user.id)
}

const getStatusText = (status) => {
  const map = ['待付款', '待发货', '待收货', '已完成', '已取消']
  return map[status] || '未知状态'
}

onMounted(() => {
  getOrderList()
})
</script>

<style scoped>
.page { padding: 20px; max-width: 900px; margin: 0 auto; }
.container { background: #fff; padding: 24px; border-radius: 12px; }
.order-item { border: 1px solid #eee; padding: 16px; border-radius: 8px; margin-bottom: 12px; }
.line { margin-bottom: 8px; }
.paid { color: #07c160; font-weight: bold; }
.unpaid { color: #ff4444; font-weight: bold; }
</style>