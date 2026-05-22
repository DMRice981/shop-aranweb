import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const routes = [
    // 前台用户页面
    { path: '/', redirect: '/index' },
    { path: '/index', component: () => import('@/views/Index.vue'), meta: { title: '首页' } },
    { path: '/login', component: () => import('@/views/Login.vue'), meta: { title: '用户登录' } },
    { path: '/register', component: () => import('@/views/Register.vue'), meta: { title: '用户注册' } },
    { path: '/user', component: () => import('@/views/User.vue'), meta: { requiresAuth: true, title: '用户中心' } },
    { path: '/goods/:id', component: () => import('@/views/GoodsDetail.vue'), meta: { title: '商品详情' } },
    { path: '/cart', component: () => import('@/views/Cart.vue'), meta: { requiresAuth: true, title: '购物车' } },
    { path: '/checkout', component: () => import('@/views/Checkout.vue'), meta: { requiresAuth: true, title: '结算' } },
    { path: '/address', component: () => import('@/views/Address.vue'), meta: { requiresAuth: true, title: '收货地址' } },
    { path: '/order', component: () => import('@/views/Order.vue'), meta: { requiresAuth: true, title: '我的订单' } },
    { path: '/after-sale', component: () => import('@/views/AfterSale.vue'), meta: { requiresAuth: true, title: '我的售后' } },
    { path: '/comment', component: () => import('@/views/Comment.vue'), meta: { requiresAuth: true, title: '评价' } },

    // 管理员后台页面
    { path: '/admin/login', component: () => import('@/views/admin/AdminLogin.vue'), meta: { title: '管理员登录' } },
    { path: '/admin/index', component: () => import('@/views/admin/AdminIndex.vue'), meta: { requiresAdmin: true, title: '管理后台' } },

    //商家
    {
        path: '/seller/login',
        component: () => import('@/views/seller/SellerLogin.vue'),
        meta: { title: '商家登录' }
    },
    {
        path: '/seller/register',
        component: () => import('@/views/seller/SellerRegister.vue'),
        meta: { title: '商家注册' }
    },
    {
        path: '/seller/index',
        component: () => import('@/views/seller/SellerIndex.vue'),
        meta: { requiresSeller: true, title: '商家中心' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    // 设置页面标题
    if (to.meta.title) {
        document.title = to.meta.title + ' - Aran Shop'
    }
    
    // 用户认证检查
    if (to.meta.requiresAuth) {
        const user = localStorage.getItem('user')
        if (!user) {
            ElMessage.warning('请先登录')
            next('/login')
            return
        }
    }
    
    // 管理员认证检查
    if (to.meta.requiresAdmin) {
        const admin = localStorage.getItem('adminInfo')
        if (!admin) {
            ElMessage.warning('请先登录管理员账号')
            next('/admin/login')
            return
        }
    }
    
    // 商家认证检查
    if (to.meta.requiresSeller) {
        const seller = localStorage.getItem('seller')
        if (!seller) {
            ElMessage.warning('请先登录商家账号')
            next('/seller/login')
            return
        }
    }
    
    next()
})

export default router