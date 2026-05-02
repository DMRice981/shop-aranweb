import request from '@/utils/request'
export function getGoodsImgList(){return request.get('/goodsImg/list')}
export function getGoodsImgById(id){return request.get(`/goodsImg/get/${id}`)}
export function addGoodsImg(data){return request.post('/goodsImg/add',data)}
export function updateGoodsImg(data){return request.put('/goodsImg/update',data)}
export function delGoodsImg(id){return request.delete(`/goodsImg/delete/${id}`)}