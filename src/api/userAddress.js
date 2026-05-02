import request from '@/utils/request'
export function getAddressList(){return request.get('/userAddress/list')}
export function getAddressById(id){return request.get(`/userAddress/get/${id}`)}
export function addAddress(data){return request.post('/userAddress/add',data)}
export function updateAddress(data){return request.put('/userAddress/update',data)}
export function delAddress(id){return request.delete(`/userAddress/delete/${id}`)}