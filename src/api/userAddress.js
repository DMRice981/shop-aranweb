import request from '@/utils/request'

export function getAddressList(userId) {
    return request.get(`/address/list?userId=${userId}`)
}

export function addAddress(data) {
    return request.post('/address/add', data)
}

export function updateAddress(data) {
    return request.put('/address/update', data)
}

export function delAddress(id) {
    return request.delete(`/address/delete/${id}`)
}