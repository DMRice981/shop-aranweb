import request from '@/utils/request'

export function getGoodsList(categoryId, keyword) {
  return request({
    url: '/goods/list',
    method: 'get',
    params: { categoryId, keyword }
  })
}

export function getGoodsById(id) {
  return request({
    url: '/goods/get/' + id,
    method: 'get'
  })
}

export function addGoods(data) {
  return request({
    url: '/goods/add',
    method: 'post',
    data
  })
}

export function updateGoods(data) {
  return request({
    url: '/goods/update',
    method: 'put',
    data
  })
}

export function delGoods(id) {
  return request({
    url: '/goods/delete/' + id,
    method: 'delete'
  })
}

export function searchGoods(keyword) {
  return request({
    url: '/goods/search',
    method: 'get',
    params: { keyword }
  })
}

export function updateGoodsStatus(id, status) {
  return request({
    url: '/goods/status',
    method: 'post',
    params: { id, status }
  })
}

export function getMyGoods(sellerId) {
  return request({
    url: '/goods/my',
    method: 'get',
    params: { sellerId }
  })
}

export function getAllGoods(params) {
  return request({
    url: '/goods/list/all',
    method: 'get',
    params
  })
}
