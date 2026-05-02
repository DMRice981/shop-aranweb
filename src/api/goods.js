import request from '@/utils/request'
export function getGoodsList(){return request.get('/goods/list')}
export function getGoodsById(id){return request.get(`/goods/get/${id}`)}
export function addGoods(data){return request.post('/goods/add',data)}
export function updateGoods(data){return request.put('/goods/update',data)}
export function delGoods(id){return request.delete(`/goods/delete/${id}`)}