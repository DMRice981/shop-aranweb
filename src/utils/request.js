import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
    baseURL: import.meta.env.VITE_API_PREFIX || '/api',
    timeout: parseInt(import.meta.env.VITE_REQUEST_TIMEOUT) || 10000
})

request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

request.interceptors.response.use(
    response => {
        const body = response.data
        if (body && typeof body === 'object') {
            if (body.code === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                ElMessage.error('登录已失效，请重新登录')
                setTimeout(() => {
                    window.location.href = '/login'
                }, 1500)
                return Promise.reject(new Error('登录已失效'))
            }
            if (body.code !== 200 && body.msg) {
                ElMessage.error(body.msg)
                return Promise.reject(new Error(body.msg))
            }
            if ('code' in body && 'data' in body) {
                return body.data ?? body
            }
        }
        return body
    },
    error => {
        const message = error.response?.data?.msg || error.message || '网络请求失败'
        ElMessage.error(message)
        return Promise.reject(error)
    }
)

export default request
