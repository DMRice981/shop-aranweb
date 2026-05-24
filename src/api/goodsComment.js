import request from '@/utils/request'

export function getCommentList(goodsId) {
    return request.get(`/comment/list?goodsId=${goodsId}`)
}

export function addComment(data) {
    return request.post('/comment/add', data)
}

export function delComment(id) {
    return request.delete(`/comment/delete/${id}`)
}
