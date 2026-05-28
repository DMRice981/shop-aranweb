# Vue 插件说明文档

## 📦 已安装的插件

### 1. Progress Plugin (`nprogress`)
页面加载进度条，提供流畅的加载体验。

### 2. Element Plus 增强插件
简化常用方法的调用，提供更友好的消息提示和确认框。

### 3. Auth Plugin
统一的用户认证和本地存储管理。

### 4. HTTP Request Plugin
简化 API 请求的封装。

---

## 🚀 使用指南

### 一、消息提示 (`msg`)

#### 基础用法

```vue
<script setup>
import { inject } from 'vue'

const msg = inject('msg')

// 成功提示
msg.success('操作成功')

// 错误提示
msg.error('操作失败')

// 警告提示
msg.warning('请注意')

// 信息提示
msg.info('提示信息')
</script>
```

#### 自定义时长

```javascript
msg.success('操作成功', 3000)  // 3秒后消失
```

---

### 二、确认框 (`confirm`)

```vue
<script setup>
import { inject } from 'vue'

const confirm = inject('confirm')

const handleDelete = async () => {
  try {
    await confirm('确定要删除这条数据吗？', '警告')
    // 用户点击了确定
    console.log('用户确认删除')
  } catch {
    // 用户点击了取消
    console.log('用户取消')
  }
}
</script>
```

---

### 三、通知 (`notify`)

```vue
<script setup>
import { inject } from 'vue'

const notify = inject('notify')

// 成功通知
notify('下单成功', '您的订单已提交，正在处理中', 'success')

// 错误通知
notify('支付失败', '请重新尝试支付', 'error')

// 信息通知
notify('新消息', '您有一条新消息', 'info')

// 警告通知
notify('库存不足', '部分商品库存紧张', 'warning')
</script>
```

---

### 四、HTTP 请求 (`http`)

#### 基础方法

```vue
<script setup>
import { inject } from 'vue'

const http = inject('http')

// GET 请求
const getData = async () => {
  const result = await http.get('/goods/list', { page: 1, size: 10 })
  console.log(result)
}

// POST 请求
const postData = async () => {
  const result = await http.post('/goods/add', { 
    name: '商品名称',
    price: 100
  })
  console.log(result)
}

// PUT 请求
const updateData = async () => {
  const result = await http.put('/goods/update', { 
    id: 1,
    name: '更新后的名称'
  })
  console.log(result)
}

// DELETE 请求
const deleteData = async () => {
  const result = await http.delete('/goods/delete/1')
  console.log(result)
}
</script>
```

---

### 五、认证管理 (`auth`)

#### 用户相关

```vue
<script setup>
import { inject } from 'vue'

const auth = inject('auth')

// 保存用户信息
auth.setUser({ id: 1, username: 'test' })

// 获取用户信息
const user = auth.getUser()

// 删除用户信息
auth.removeUser()
```

#### 管理员相关

```javascript
// 保存管理员信息
auth.setAdmin({ id: 1, username: 'admin' })

// 获取管理员信息
const admin = auth.getAdmin()

// 删除管理员信息
auth.removeAdmin()
```

#### 商家相关

```javascript
// 保存商家信息
auth.setSeller({ id: 1, username: 'seller' })

// 获取商家信息
const seller = auth.getSeller()

// 删除商家信息
auth.removeSeller()
```

#### 通用方法

```javascript
// 退出登录（清除所有认证信息）
auth.logout()
```

---

### 六、本地存储 (`storage`)

```vue
<script setup>
import { inject } from 'vue'

const storage = inject('storage')

// 保存数据（支持对象和字符串）
storage.set('key', 'value')
storage.set('objectKey', { name: 'test' })

// 获取数据
const value = storage.get('key')
const objectValue = storage.get('objectKey')

// 获取数据（带默认值）
const data = storage.get('notExistKey', 'defaultValue')

// 删除数据
storage.remove('key')

// 清空所有数据
storage.clear()
</script>
```

---

### 七、进度条 (`progress`)

```vue
<script setup>
import { inject } from 'vue'

const progress = inject('progress')

// 开始加载
progress.start()

// 设置进度（0-1）
progress.set(0.5)

// 完成加载
progress.done()

// 手动增加进度
progress.inc()
</script>
```

---

### 八、工具函数 (`utils`)

#### 格式化工具

```javascript
import { formatPrice, formatTime, formatTimeAgo, formatSales } from '@/utils/format'

// 价格格式化
formatPrice(99.9)  // "¥99.90"

// 时间格式化
formatTime(new Date())  // "2024-01-01 12:00:00"

// 相对时间
formatTimeAgo(new Date(Date.now() - 60000))  // "1分钟前"

// 销量格式化
formatSales(12345)  // "12345+"
formatSales(15000)  // "1.5万+"
```

#### 防抖与节流

```javascript
import { debounce, throttle } from '@/utils/debounce'

// 防抖：延迟执行，多次调用只执行最后一次
const handleSearch = debounce((keyword) => {
  console.log('搜索:', keyword)
}, 300)

// 节流：限制频率，多次调用按固定时间间隔执行
const handleScroll = throttle(() => {
  console.log('滚动事件')
}, 200)
```

#### 验证工具

```javascript
import { isPhone, isEmail, isPassword, isNotEmpty } from '@/utils/valid'

// 手机号验证
isPhone('13800138000')  // true

// 邮箱验证
isEmail('test@example.com')  // true

// 密码验证（至少6位）
isPassword('123456')  // true

// 非空验证
isNotEmpty('')  // false
isNotEmpty(null)  // false
isNotEmpty([])  // false
isNotEmpty('test')  // true
```

---

## 🎨 CSS 工具类

### 动画类

| 类名 | 效果 |
|------|------|
| `.animate-fadeIn` | 淡入动画 |
| `.animate-fadeInUp` | 向上淡入动画 |
| `.animate-slideInLeft` | 从左侧滑入 |
| `.animate-slideInRight` | 从右侧滑入 |
| `.animate-scaleIn` | 缩放进入 |
| `.animate-float` | 悬浮动画 |
| `.animate-shake` | 抖动动画 |

### 文本截断

| 类名 | 效果 |
|------|------|
| `.text-truncate` | 单行文本截断 |
| `.text-ellipsis-2` | 两行文本截断 |

### 其他工具类

| 类名 | 效果 |
|------|------|
| `.cursor-pointer` | 鼠标指针样式 |
| `.user-select-none` | 禁止文本选择 |
| `.skeleton` | 骨架屏样式 |

---

## 📁 目录结构

```
src/
├── plugins/
│   ├── index.js          # 插件入口
│   ├── progress.js       # 进度条插件
│   ├── element.js        # Element Plus 增强
│   ├── auth.js           # 认证插件
│   └── request.js        # HTTP 请求插件
└── utils/
    ├── format.js         # 格式化工具
    ├── debounce.js       # 防抖节流
    └── valid.js          # 验证工具
```

---

## 💡 最佳实践

1. **使用 `inject` 而不是 `getCurrentInstance`**
   ```javascript
   // ✅ 推荐
   const msg = inject('msg')
   
   // ❌ 不推荐
   const { proxy } = getCurrentInstance()
   const msg = proxy.$msg
   ```

2. **合理使用进度条**
   - 页面路由切换已自动处理
   - 长时间的异步操作可手动显示进度条

3. **统一的错误处理**
   ```javascript
   try {
     const result = await http.get('/api/data')
     if (result.code === 200) {
       msg.success('获取成功')
     } else {
       msg.error(result.msg)
     }
   } catch (error) {
     msg.error('网络错误，请稍后重试')
   }
   ```

4. **使用工具函数减少重复代码**
   ```javascript
   // ✅ 使用工具函数
   formatPrice(item.price)
   
   // ❌ 不要重复写
   `¥${(item.price || 0).toFixed(2)}`
   ```
