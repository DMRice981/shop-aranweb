const BASE_URL = '/api'

export default {
  install(app) {
    const request = async (url, options = {}) => {
      const fullUrl = url.startsWith('http') ? url : BASE_URL + url
      
      const config = {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      }

      try {
        const response = await fetch(fullUrl, config)
        const data = await response.json()
        return data
      } catch (error) {
        console.error('Request failed:', error)
        throw error
      }
    }

    const http = {
      get(url, params = {}) {
        // 过滤 null/undefined/空字符串参数，避免后端把 null 被转成字符串 "null"
        const cleanParams = {}
        Object.keys(params).forEach(key => {
          const value = params[key]
          if (value !== null && value !== undefined && value !== '') {
            cleanParams[key] = value
          }
        })
        const queryString = Object.keys(cleanParams).length > 0
          ? new URLSearchParams(cleanParams).toString()
          : ''
        const fullUrl = queryString ? `${url}?${queryString}` : url
        return request(fullUrl, { method: 'GET' })
      },
      
      post(url, data = {}) {
        return request(url, {
          method: 'POST',
          body: JSON.stringify(data)
        })
      },
      
      put(url, data = {}) {
        return request(url, {
          method: 'PUT',
          body: JSON.stringify(data)
        })
      },
      
      delete(url) {
        return request(url, { method: 'DELETE' })
      }
    }

    app.config.globalProperties.$http = http
    app.provide('http', http)
  }
}
