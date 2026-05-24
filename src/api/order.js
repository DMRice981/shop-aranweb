import request from '@/utils/request'

export function getOrderList(userId) {
  return request({
    url: '/order/list',
    method: 'get',
    params: { userId }
  })
}

export function getOrderListAll(userId) {
  return request({
    url: '/order/list/all',
    method: 'get',
    params: { userId }
  })
}

export function getOrderById(id) {
  return request({
    url: '/order/get/' + id,
    method: 'get'
  })
}

export function createOrder(data) {
  return request({
    url: '/order/create',
    method: 'post',
    data
  })
}

export function updateOrder(data) {
  return request({
    url: '/order/update',
    method: 'put',
    data
  })
}

export function payOrder(id) {
  return request({
    url: '/order/pay/' + id,
    method: 'post'
  })
}

export function sendOrder(id) {
  return request({
    url: '/order/send/' + id,
    method: 'post'
  })
}

export function confirmOrder(id) {
  return request({
    url: '/order/confirm/' + id,
    method: 'post'
  })
}

export function cancelOrder(id) {
  return request({
    url: '/order/cancel/' + id,
    method: 'post'
  })
}

export function deleteOrder(id) {
  return request({
    url: '/order/delete/' + id,
    method: 'delete'
  })
}
