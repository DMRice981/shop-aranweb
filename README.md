# Aran Shop 前端项目文档

## 📁 项目结构

```
shop-aran/
├── src/
│   ├── api/              # API 接口定义
│   │   ├── admin.js      # 管理员相关接口
│   │   ├── banner.js     # 轮播图接口
│   │   ├── cart.js       # 购物车接口
│   │   ├── category.js   # 分类接口
│   │   ├── goods.js      # 商品接口
│   │   ├── goodsComment.js   # 商品评论接口
│   │   ├── goodsImg.js   # 商品图片接口
│   │   ├── order.js      # 订单接口
│   │   ├── orderItem.js  # 订单项接口
│   │   ├── user.js       # 用户接口
│   │   └── userAddress.js    # 用户地址接口
│   │
│   ├── assets/           # 静态资源
│   │   ├── base.css      # 基础样式
│   │   └── main.css      # 全局样式
│   │
│   ├── plugins/          # Vue 插件系统
│   │   ├── index.js      # 插件入口
│   │   ├── progress.js   # 路由进度条插件
│   │   ├── element.js    # Element Plus 增强插件
│   │   ├── auth.js       # 认证管理插件
│   │   └── request.js    # HTTP 请求封装插件
│   │
│   ├── router/           # 路由配置
│   │   └── index.js      # 路由定义和守卫
│   │
│   ├── utils/            # 工具函数
│   │   ├── format.js     # 格式化工具
│   │   ├── debounce.js   # 防抖节流
│   │   └── valid.js      # 验证工具
│   │
│   ├── views/            # 页面组件
│   │   ├── admin/        # 管理员页面
│   │   │   ├── AdminIndex.vue      # 管理员首页
│   │   │   ├── AdminLogin.vue      # 管理员登录
│   │   │   ├── BannerManage.vue    # 轮播图管理
│   │   │   ├── CategoryManage.vue   # 分类管理
│   │   │   ├── GoodsManage.vue     # 商品管理（含商家信息）
│   │   │   ├── OrderManage.vue     # 订单管理
│   │   │   └── UserManage.vue      # 用户管理
│   │   │
│   │   ├── seller/       # 商家页面
│   │   │   ├── SellerIndex.vue     # 商家中心首页
│   │   │   ├── SellerLogin.vue     # 商家登录
│   │   │   ├── SellerRegister.vue  # 商家注册
│   │   │   ├── SellerGoods.vue     # 商品管理
│   │   │   ├── SellerOrder.vue     # 订单管理（含发货）
│   │   │   └── SellerAfterSale.vue # 售后处理
│   │   │
│   │   ├── Index.vue     # 首页
│   │   ├── Login.vue      # 用户登录
│   │   ├── Register.vue   # 用户注册
│   │   ├── User.vue       # 用户中心
│   │   ├── GoodsDetail.vue    # 商品详情
│   │   ├── Cart.vue       # 购物车
│   │   ├── Checkout.vue   # 结算页面
│   │   ├── Order.vue      # 订单管理
│   │   ├── Address.vue    # 地址管理
│   │   ├── AfterSale.vue  # 售后申请
│   │   └── Comment.vue    # 评论页面
│   │
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
│
├── public/               # 公共资源
├── .env                  # 环境变量
├── .env.example          # 环境变量模板
├── vite.config.js       # Vite 配置
└── package.json         # 依赖配置
```

## 🎨 插件系统

### 1. auth.js - 认证管理

```javascript
// 获取认证插件
const auth = inject('auth')

// 设置用户信息
auth.setUser({ id: 1, username: 'test' })

// 获取用户信息
const user = auth.getUser()

// 获取管理员信息
const admin = auth.getAdmin()

// 获取商家信息
const seller = auth.getSeller()

// 登出（清除所有认证信息）
auth.logout()

// 检查是否已登录
auth.isLoggedIn()
```

### 2. http 插件 - HTTP 请求

```javascript
// 获取 http 插件
const http = inject('http')

// GET 请求
const data = await http.get('/goods/list')
const data = await http.get('/goods/list', { categoryId: 1 })

// POST 请求
const result = await http.post('/cart/add', { userId: 1, goodsId: 1, num: 1 })

// PUT 请求
await http.put('/goods/update', formData)

// DELETE 请求
await http.delete('/goods/delete/1')
```

### 3. msg 插件 - 消息提示

```javascript
// 获取消息插件
const msg = inject('msg')

// 成功提示
msg.success('操作成功')

// 错误提示
msg.error('操作失败')

// 警告提示
msg.warning('请注意')

// 信息提示
msg.info('这是一条信息')
```

## 📱 页面路由

### 用户路由

| 路径 | 组件 | 说明 | 需要登录 |
|------|------|------|----------|
| `/` | Index.vue | 首页 | 否 |
| `/login` | Login.vue | 登录 | 否 |
| `/register` | Register.vue | 注册 | 否 |
| `/goods/:id` | GoodsDetail.vue | 商品详情 | 否 |
| `/cart` | Cart.vue | 购物车 | 是 |
| `/checkout` | Checkout.vue | 结算 | 是 |
| `/order` | Order.vue | 订单列表 | 是 |
| `/address` | Address.vue | 地址管理 | 是 |
| `/user` | User.vue | 个人中心 | 是 |
| `/after-sale` | AfterSale.vue | 售后申请 | 是 |
| `/comment` | Comment.vue | 商品评论 | 是 |

### 商家路由

| 路径 | 组件 | 说明 | 需要登录 |
|------|------|------|----------|
| `/seller/login` | SellerLogin.vue | 商家登录 | 否 |
| `/seller/register` | SellerRegister.vue | 商家注册 | 否 |
| `/seller` | SellerIndex.vue | 商家中心 | 是 |
| `/seller/goods` | SellerGoods.vue | 商品管理 | 是 |
| `/seller/order` | SellerOrder.vue | 订单管理 | 是 |
| `/seller/after-sale` | SellerAfterSale.vue | 售后处理 | 是 |

### 管理员路由

| 路径 | 组件 | 说明 | 需要登录 |
|------|------|------|----------|
| `/admin/login` | AdminLogin.vue | 管理员登录 | 否 |
| `/admin` | AdminIndex.vue | 管理后台 | 是 |
| `/admin/goods` | GoodsManage.vue | 商品管理 | 是 |
| `/admin/category` | CategoryManage.vue | 分类管理 | 是 |
| `/admin/banner` | BannerManage.vue | 轮播图管理 | 是 |
| `/admin/order` | OrderManage.vue | 订单管理 | 是 |
| `/admin/user` | UserManage.vue | 用户管理 | 是 |

## 🎯 开发规范

### 1. 组件开发规范

```vue
<template>
  <div class="component-name">
    <!-- 模板内容 -->
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { IconName } from '@element-plus/icons-vue'

// 依赖注入
const http = inject('http')
const auth = inject('auth')

// 响应式数据
const loading = ref(false)
const dataList = ref([])

// 计算属性
const totalCount = computed(() => dataList.value.length)

// 生命周期
onMounted(() => {
  loadData()
})

// 方法
const loadData = async () => {
  try {
    const result = await http.get('/api/endpoint')
    dataList.value = result.data || []
  } catch (error) {
    ElMessage.error('加载失败')
  }
}
</script>

<style scoped>
.component-name {
  /* 组件样式 */
}
</style>
```

### 2. API 调用规范

```javascript
// ✅ 推荐：使用 http 插件
const result = await http.get('/goods/list')

// ❌ 不推荐：直接使用 fetch
const res = await fetch('/api/goods/list')
const data = await res.json()
```

### 3. 状态管理规范

```javascript
// ✅ 推荐：使用 auth 插件
const user = auth.getUser()

// ❌ 不推荐：直接操作 localStorage
const user = JSON.parse(localStorage.getItem('user'))
```

### 4. 图标使用规范

```javascript
// 在 script setup 中导入
import { Search, Plus, Delete } from '@element-plus/icons-vue'

// 在模板中使用
<el-icon><Search /></el-icon>
<el-icon><Plus /></el-icon>
<el-icon><Delete /></el-icon>
```

## 📊 订单状态说明

| 状态值 | 名称 | 说明 | 可执行操作 |
|--------|------|------|------------|
| 0 | 待支付 | 用户创建订单，等待支付 | 支付、取消 |
| 1 | 待发货 | 用户已支付，等待商家发货 | 商家发货 |
| 2 | 已发货 | 商家已发货，配送中 | 确认收货 |
| 3 | 已完成 | 用户确认收货，订单完成 | 申请售后、评价 |
| 4 | 已取消 | 订单被取消 | 无 |

## 🔧 常用工具函数

### 格式化工具 (utils/format.js)

```javascript
import { formatPrice, formatTime, formatTimeAgo, formatSales } from '@/utils/format'

formatPrice(99.9)      // "¥99.90"
formatTime(new Date())  // "2024-01-01 12:00:00"
formatTimeAgo(date)     // "1分钟前"
formatSales(15000)     // "1.5万+"
```

### 防抖节流 (utils/debounce.js)

```javascript
import { debounce, throttle } from '@/utils/debounce'

// 防抖：300ms 后执行
const handleSearch = debounce((keyword) => {
  console.log('搜索:', keyword)
}, 300)

// 节流：200ms 内最多执行一次
const handleScroll = throttle(() => {
  console.log('滚动')
}, 200)
```

### 验证工具 (utils/valid.js)

```javascript
import { isPhone, isEmail, isPassword, isNotEmpty } from '@/utils/valid'

isPhone('13800138000')          // true
isEmail('test@example.com')     // true
isPassword('Password123!')      // true
isNotEmpty('hello')             // true
```

## 📝 样式规范

### 1. CSS 变量

```css
:root {
  --primary-color: #667eea;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
  --text-primary: #303133;
  --text-secondary: #909399;
  --border-color: #dcdfe6;
}
```

### 2. 响应式断点

```css
/* 超大屏幕 */
@media (max-width: 1200px) { }

/* 大屏幕 */
@media (max-width: 968px) { }

/* 平板 */
@media (max-width: 768px) { }

/* 手机 */
@media (max-width: 640px) { }
```

### 3. 组件样式隔离

```vue
<style scoped>
/* 使用 scoped 确保样式只作用于当前组件 */
.component {
  padding: 20px;
}

/* 使用 :deep() 修改子组件样式 */
:deep(.el-button) {
  border-radius: 8px;
}
</style>
```

## 🚀 性能优化

### 1. 图片懒加载

```vue
<el-image 
  :src="imageUrl" 
  lazy 
  style="width: 200px; height: 200px;" 
/>
```

### 2. 列表虚拟滚动

```vue
<el-table-v2
  :data="largeDataList"
  :columns="columns"
  :width="800"
  :height="400"
/>
```

### 3. 路由懒加载

```javascript
// router/index.js
const routes = [
  {
    path: '/goods/:id',
    component: () => import('@/views/GoodsDetail.vue')
  }
]
```

## 📚 相关文档

- [开发指南](../springboot/DEVELOPMENT_GUIDE.md) - 详细的开发文档
- [Element Plus 文档](https://element-plus.org/) - UI 组件库文档
- [Vue 3 文档](https://vuejs.org/) - Vue 官方文档
- [Vite 文档](https://vitejs.dev/) - 构建工具文档

## 🤝 贡献指南

1. 遵循项目代码规范
2. 使用 `npm run format` 格式化代码
3. 添加必要的组件注释
4. 确保功能测试通过
5. 提交前检查无编译错误

---

**Happy Coding! 🚀**
