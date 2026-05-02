import request from '@/utils/request'
export function getCommentList(){return request.get('/goodsComment/list')}
export function getCommentById(id){return request.get(`/goodsComment/get/${id}`)}
export function addComment(data){return request.post('/goodsComment/add',data)}
export function updateComment(data){return request.put('/goodsComment/update',data)}
export function delComment(id){return request.delete(`/goodsComment/delete/${id}`)}