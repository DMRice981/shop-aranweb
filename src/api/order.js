import request from '@/utils/request'
export function getOrderList(){return request.get('/order/list')}
export function getOrderById(id){return request.get(`/order/get/${id}`)}
export function addOrder(data){return request.post('/order/add',data)}
export function updateOrder(data){return request.put('/order/update',data)}
export function delOrder(id){return request.delete(`/order/delete/${id}`)}