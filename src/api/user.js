import request from '@/utils/request'
export function getUserList(){return request.get('/user/list')}
export function getUserById(id){return request.get(`/user/get/${id}`)}
export function addUser(data){return request.post('/user/add',data)}
export function updateUser(data){return request.put('/user/update',data)}
export function delUser(id){return request.delete(`/user/delete/${id}`)}