import request from '@/utils/request'

export function getGoodsImgList(goodsId) {
    return request.get(`/goodsImg/list?goodsId=${goodsId}`)
}

export function addGoodsImg(data) {
    return request.post('/goodsImg/add', data)
}

export function delGoodsImg(id) {
    return request.delete(`/goodsImg/delete/${id}`)
}