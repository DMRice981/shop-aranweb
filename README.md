# Aran Shop 前端项目说明

这是 Aran Shop 的 Vue 3 前端项目，使用 Vite、Element Plus、Vue Router 和插件化封装实现用户端、商家端、管理员端页面。当前版本已接入 WebSocket 实时聊天第一阶段能力。

---

## 1. 技术栈

| 类型 | 技术 |
| --- | --- |
| 框架 | Vue 3 |
| 构建工具 | Vite 8 |
| UI 组件 | Element Plus |
| 路由 | Vue Router 4 |
| 图标 | @element-plus/icons-vue |
| 实时通信 | 浏览器原生 WebSocket |
| Node 版本 | Node.js 20.19+ |

---

## 2. 运行命令

### 2.1 安装依赖

```powershell
cd C:\Users\Lenovo\Desktop\cxode\shop-aran
npm install
```

### 2.2 开发运行

```powershell
npm run dev
```

默认访问：

```text
http://localhost:5173
```

### 2.3 生产构建

```powershell
npm run build
```

当前验证结果：

```text
✓ built in 1.99s
```

---

## 3. 环境变量

前端环境变量文件：

- [.env](file:///C:/Users/Lenovo/Desktop/cxode/shop-aran/.env)
- [.env.example](file:///C:/Users/Lenovo/Desktop/cxode/shop-aran/.env.example)

推荐配置：

```env
VITE_API_BASE_URL=http://localhost:8081
VITE_API_PREFIX=/api
VITE_REQUEST_TIMEOUT=5000
```

WebSocket 插件会根据 `VITE_API_BASE_URL` 自动把：

```text
http://localhost:8081
```

转换为：

```text
ws://localhost:8081/ws/chat
```

---

## 4. 项目结构

```text
shop-aran/
├── src/
│   ├── components/
│   │   └── ChatPanel.vue
│   ├── plugins/
│   │   ├── index.js
│   │   ├── auth.js
│   │   ├── element.js
│   │   ├── progress.js
│   │   ├── request.js
│   │   └── websocket.js
│   ├── router/
│   │   └── index.js
│   ├── utils/
│   │   ├── debounce.js
│   │   ├── format.js
│   │   └── valid.js
│   ├── views/
│   │   ├── admin/
│   │   │   ├── AdminChat.vue
│   │   │   ├── AdminIndex.vue
│   │   │   ├── AdminLogin.vue
│   │   │   ├── BannerManage.vue
│   │   │   ├── CategoryManage.vue
│   │   │   ├── GoodsManage.vue
│   │   │   ├── OrderManage.vue
│   │   │   └── UserManage.vue
│   │   ├── seller/
│   │   │   ├── SellerAfterSale.vue
│   │   │   ├── SellerChat.vue
│   │   │   ├── SellerGoods.vue
│   │   │   ├── SellerIndex.vue
│   │   │   ├── SellerLogin.vue
│   │   │   ├── SellerOrder.vue
│   │   │   └── SellerRegister.vue
│   │   ├── Address.vue
│   │   ├── AfterSale.vue
│   │   ├── Cart.vue
│   │   ├── Chat.vue
│   │   ├── Checkout.vue
│   │   ├── Comment.vue
│   │   ├── GoodsDetail.vue
│   │   ├── Index.vue
│   │   ├── Login.vue
│   │   ├── Order.vue
│   │   ├── Register.vue
│   │   └── User.vue
│   ├── App.vue
│   └── main.js
├── vite.config.js
└── package.json
```

---

## 5. 插件系统

所有插件在 [plugins/index.js](file:///C:/Users/Lenovo/Desktop/cxode/shop-aran/src/plugins/index.js) 中统一注册。

| 插件 | 文件 | 作用 |
| --- | --- | --- |
| 认证插件 | `plugins/auth.js` | 管理用户、商家、管理员登录态 |
| 请求插件 | `plugins/request.js` | 统一 HTTP 请求与参数过滤 |
| WebSocket 插件 | `plugins/websocket.js` | 聊天连接、重连、消息分发、在线状态 |
| Element Plus 插件 | `plugins/element.js` | 注册 UI 组件能力 |
| 进度条插件 | `plugins/progress.js` | 路由切换进度条 |

### 5.1 HTTP 插件

在页面中使用：

```javascript
const http = inject('http')
```

GET 请求会自动过滤以下参数：

- `null`
- `undefined`
- `''`

这样可以避免后端收到字符串 `"null"` 导致 Integer 转换失败。

示例：

```javascript
const list = await http.get('/goods/list/all/paged', {
  pageNum: 1,
  pageSize: 10,
  keyword: searchKeyword.value || undefined,
  status: filterStatus.value !== '' ? filterStatus.value : undefined
})
```

### 5.2 WebSocket 插件

在页面中使用：

```javascript
const chatSocket = inject('chatSocket')
```

连接：

```javascript
chatSocket.connect({ userType: 'USER', userId: 1 })
```

发送文本消息：

```javascript
chatSocket.sendMessage({
  conversationId: 1,
  receiverType: 'SELLER',
  receiverId: 1,
  messageType: 'TEXT',
  content: '你好，请问这个商品还有库存吗？'
})
```

监听实时消息：

```javascript
const offMessage = chatSocket.onMessage(message => {
  console.log(message)
})
```

监听在线状态：

```javascript
const offStatus = chatSocket.onStatus(status => {
  console.log(status)
})
```

组件卸载时取消监听：

```javascript
offMessage()
offStatus()
```

---

## 6. 实时聊天页面

聊天 UI 由 [ChatPanel.vue](file:///C:/Users/Lenovo/Desktop/cxode/shop-aran/src/components/ChatPanel.vue) 复用实现。

三端页面：

| 页面 | 文件 | 角色 |
| --- | --- | --- |
| 用户聊天 | `views/Chat.vue` | USER |
| 商家聊天 | `views/seller/SellerChat.vue` | SELLER |
| 管理员聊天 | `views/admin/AdminChat.vue` | ADMIN |

当前支持：

- WebSocket 实时文本消息
- 会话列表
- 历史消息
- 选择联系人弹窗
- 未读数展示
- 在线/离线状态
- 自己和对方消息气泡区分
- Ctrl + Enter 快捷发送

聊天入口：

| 入口 | 说明 |
| --- | --- |
| `/chat` | 用户消息中心 |
| `/seller/chat` | 商家消息中心 |
| `/admin/chat` | 管理员消息管理 |
| 用户中心 | “我的消息”入口 |
| 商家后台 | “消息中心”入口 |
| 管理后台 | “消息管理”入口 |
| 商品详情页 | “联系商家”按钮 |

商品详情页联系商家会跳转到：

```text
/chat?targetType=SELLER&targetId=商家ID
```

---

## 7. 路由说明

路由定义在 [router/index.js](file:///C:/Users/Lenovo/Desktop/cxode/shop-aran/src/router/index.js)。

### 用户路由

| 路径 | 页面 | 说明 |
| --- | --- | --- |
| `/` | Index.vue | 首页 |
| `/login` | Login.vue | 用户登录 |
| `/register` | Register.vue | 用户注册 |
| `/goods/:id` | GoodsDetail.vue | 商品详情 |
| `/cart` | Cart.vue | 购物车 |
| `/checkout` | Checkout.vue | 结算 |
| `/order` | Order.vue | 我的订单 |
| `/address` | Address.vue | 地址管理 |
| `/after-sale` | AfterSale.vue | 售后申请 |
| `/comment` | Comment.vue | 商品评价 |
| `/user` | User.vue | 用户中心 |
| `/chat` | Chat.vue | 我的消息 |

### 商家路由

| 路径 | 页面 | 说明 |
| --- | --- | --- |
| `/seller/login` | SellerLogin.vue | 商家登录 |
| `/seller/register` | SellerRegister.vue | 商家注册 |
| `/seller/index` | SellerIndex.vue | 商家中心 |
| `/seller/chat` | SellerChat.vue | 商家消息 |

### 管理员路由

| 路径 | 页面 | 说明 |
| --- | --- | --- |
| `/admin/login` | AdminLogin.vue | 管理员登录 |
| `/admin/index` | AdminIndex.vue | 管理后台 |
| `/admin/chat` | AdminChat.vue | 消息管理 |

---

## 8. 图标规范

Element Plus 图标统一使用别名导入，避免和组件或原生标签冲突。

推荐写法：

```javascript
import { Search as IconSearch, Plus as IconPlus } from '@element-plus/icons-vue'
```

模板中使用动态组件：

```vue
<el-icon><component :is="IconSearch" /></el-icon>
```

注意：

- 不要使用包中不存在的图标名，例如 `Shield`、`Truck`
- 可替换为 `Medal`、`Van` 等真实存在的图标
- `el-option` 的“全部”选项使用 `value=""`，不要使用 `:value="null"`

---

## 9. 常见问题

### 9.1 聊天连接失败

检查：

1. 后端是否运行在 `http://localhost:8081`
2. 前端 `.env` 中 `VITE_API_BASE_URL` 是否正确
3. 当前用户、商家或管理员是否已登录
4. 浏览器控制台是否有 WebSocket 连接错误
5. 数据库是否已经创建 `chat_conversation` 和 `chat_message`

### 9.2 列表接口出现 `For input string: "null"`

原因是 URL 参数中出现字符串 `"null"`。当前 `http.get()` 已过滤空参数，页面筛选项应使用：

```javascript
const filterStatus = ref('')
```

而不是：

```javascript
const filterStatus = ref(null)
```

### 9.3 前端构建 chunk 过大警告

`npm run build` 可能提示部分 chunk 超过 500KB。这是构建警告，不是错误。当前项目已使用路由懒加载，后续可继续拆分 Element Plus 或大型页面依赖。

---

## 10. 当前验证状态

| 验证项 | 命令 | 状态 |
| --- | --- | --- |
| 前端生产构建 | `npm run build` | 通过 |
| 后端 JDK 25 编译 | `mvn clean compile -DskipTests` | 通过 |
| 聊天页面构建 | `/chat`、`/seller/chat`、`/admin/chat` | 已纳入构建 |

---

## 11. 后续扩展

实时聊天后续可扩展：

1. 图片消息
2. 商品卡片消息
3. 订单卡片消息
4. 消息发送失败重试
5. 已读回执
6. 最近联系人排序优化
