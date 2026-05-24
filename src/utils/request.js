import axios from 'axios'

const request = axios.create({
    baseURL: import.meta.env.VITE_API_PREFIX || '/api',
    timeout: parseInt(import.meta.env.VITE_REQUEST_TIMEOUT) || 10000
})

// 响应拦截器：自动解包后端 Result<T> 包装，提取 data 字段
request.interceptors.response.use(
    response => {
        const body = response.data
        // 如果后端返回了 { code, msg, data } 结构，直接取 data
        if (body && typeof body === 'object' && 'code' in body && 'data' in body) {
            return body.data ?? body
        }
        return body
    },
    error => {
        return Promise.reject(error)
    }
)

export default request
