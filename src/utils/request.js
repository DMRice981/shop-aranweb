import axios from 'axios'

const request = axios.create({
    baseURL: import.meta.env.VITE_API_PREFIX || '/api',
    timeout: parseInt(import.meta.env.VITE_REQUEST_TIMEOUT) || 5000
})

export default request