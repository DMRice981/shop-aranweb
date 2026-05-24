import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function getUserList() {
  return request({
    url: '/user/list',
    method: 'get'
  })
}

export function getUserById(id) {
  return request({
    url: '/user/get/' + id,
    method: 'get'
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/delete/' + id,
    method: 'delete'
  })
}

export function updateUserStatus(id, status) {
  return request({
    url: '/user/status',
    method: 'post',
    params: { id, status }
  })
}
