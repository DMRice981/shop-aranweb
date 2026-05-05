import request from '@/utils/request'

export function getOrderList(userId) {
    return request.get(`/order/list?userId=${userId}`)
}

export function getOrderById(id) {
    return request.get(`/order/get/${id}`)
}

export function addOrder(data) {
    return request.post('/order/add', data)
}

export function updateOrder(data) {
    return request.put('/order/update', data)
}

export function delOrder(id) {
    return request.delete(`/order/delete/${id}`)
}

export function payOrder(orderId) {
    return request.post('/order/pay', { orderId })
}