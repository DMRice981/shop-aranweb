import request from '@/utils/request'

// 登录
export function login(data) {
    return request.post('/user/login', data)
}

// 注册
export function register(data) {
    return request.post('/user/register', data)
}

// 获取当前用户信息
export function getInfo() {
    return request.get('/user/info')
}

// 退出登录
export function logout() {
    return request.post('/user/logout')
}

// 用户列表
export function getUserList() {
    return request.get('/user/list')
}

export function getUserById(id) {
    return request.get(`/user/get/${id}`)
}

export function addUser(data) {
    return request.post('/user/add', data)
}

export function updateUser(data) {
    return request.put('/user/update', data)
}

export function delUser(id) {
    return request.delete(`/user/delete/${id}`)
}