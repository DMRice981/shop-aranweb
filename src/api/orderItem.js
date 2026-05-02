import request from '@/utils/request'
export function getOrderItemList(){return request.get('/orderItem/list')}
export function getOrderItemById(id){return request.get(`/orderItem/get/${id}`)}
export function addOrderItem(data){return request.post('/orderItem/add',data)}
export function updateOrderItem(data){return request.put('/orderItem/update',data)}
export function delOrderItem(id){return request.delete(`/orderItem/delete/${id}`)}