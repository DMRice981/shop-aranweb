import request from '@/utils/request'

export function getCategoryList() {
    return request.get('/category/list')
}

export function getCategoryById(id) {
    return request.get(`/category/get/${id}`)
}

export function addCategory(data) {
    return request.post('/category/add', data)
}

export function updateCategory(data) {
    return request.put('/category/update', data)
}

export function delCategory(id) {
    return request.delete(`/category/delete/${id}`)
}