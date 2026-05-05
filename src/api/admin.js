import request from '@/utils/request'

export function getAdminList() {
    return request.get('/admin/list')
}

export function getAdminById(id) {
    return request.get(`/admin/get/${id}`)
}

export function addAdmin(data) {
    return request.post('/admin/add', data)
}

export function updateAdmin(data) {
    return request.put('/admin/update', data)
}

export function delAdmin(id) {
    return request.delete(`/admin/delete/${id}`)
}