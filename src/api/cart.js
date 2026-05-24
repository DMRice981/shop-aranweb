import request from '@/utils/request'

export function getCartList(userId) {
  return request({
    url: '/cart/list',
    method: 'get',
    params: { userId }
  })
}

export function addCart(data) {
  return request({
    url: '/cart/add',
    method: 'post',
    data
  })
}

export function updateCart(data) {
  return request({
    url: '/cart/update',
    method: 'put',
    data
  })
}

export function delCart(id) {
  return request({
    url: '/cart/delete/' + id,
    method: 'delete'
  })
}

export function clearCart(userId) {
  return request({
    url: '/cart/clear',
    method: 'delete',
    params: { userId }
  })
}
