import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    // 前台用户页面
    { path: '/', redirect: '/index' },
    { path: '/index', component: () => import('@/views/Index.vue') },
    { path: '/login', component: () => import('@/views/Login.vue') },
    { path: '/register', component: () => import('@/views/Register.vue') },
    { path: '/user', component: () => import('@/views/User.vue') },
    { path: '/goods/:id', component: () => import('@/views/GoodsDetail.vue') },
    { path: '/cart', component: () => import('@/views/Cart.vue') },
    { path: '/address', component: () => import('@/views/Address.vue') },
    { path: '/order', component: () => import('@/views/Order.vue') },
    { path: '/comment', component: () => import('@/views/Comment.vue') },

    // 管理员后台页面
    { path: '/admin/login', component: () => import('@/views/admin/AdminLogin.vue') },
    { path: '/admin/index', component: () => import('@/views/admin/AdminIndex.vue') },

    //商家
    {
        path: '/seller/login',
        component: () => import('@/views/seller/SellerLogin.vue')
    },
    {
        path: '/seller/register',
        component: () => import('@/views/seller/SellerRegister.vue')
    },
    {
        path: '/seller/index',
        component: () => import('@/views/seller/SellerIndex.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router