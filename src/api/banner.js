import request from '@/utils/request'
export function getBannerList(){return request.get('/banner/list')}
export function getBannerById(id){return request.get(`/banner/get/${id}`)}
export function addBanner(data){return request.post('/banner/add',data)}
export function updateBanner(data){return request.put('/banner/update',data)}
export function delBanner(id){return request.delete(`/banner/delete/${id}`)}