import request from '@/utils/request'
export function getCartList(){return request.get('/cart/list')}
export function getCartById(id){return request.get(`/cart/get/${id}`)}
export function addCart(data){return request.post('/cart/add',data)}
export function updateCart(data){return request.put('/cart/update',data)}
export function delCart(id){return request.delete(`/cart/delete/${id}`)}