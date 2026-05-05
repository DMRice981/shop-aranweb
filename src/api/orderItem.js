import request from '@/utils/request'

export function getOrderItemList(orderId) {
    return request.get(`/orderItem/list?orderId=${orderId}`)
}