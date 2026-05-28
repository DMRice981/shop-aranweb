const TOKEN_KEY = 'token'
const USER_KEY = 'user'
const ADMIN_KEY = 'admin'
const SELLER_KEY = 'seller'

export default {
  install(app) {
    const storage = {
      set(key, value) {
        if (value === null || value === undefined) {
          localStorage.removeItem(key)
          return
        }
        if (typeof value === 'object') {
          localStorage.setItem(key, JSON.stringify(value))
        } else {
          localStorage.setItem(key, value)
        }
      },
      get(key, defaultValue = null) {
        const value = localStorage.getItem(key)
        if (!value || value === 'null' || value === 'undefined' || value.trim() === '') {
          return defaultValue
        }
        try {
          const parsed = JSON.parse(value)
          if (parsed === null || parsed === undefined) {
            return defaultValue
          }
          return parsed
        } catch {
          return value
        }
      },
      remove(key) {
        localStorage.removeItem(key)
      },
      clear() {
        localStorage.clear()
      }
    }

    const auth = {
      setToken(token) {
        storage.set(TOKEN_KEY, token)
      },
      getToken() {
        return storage.get(TOKEN_KEY)
      },
      removeToken() {
        storage.remove(TOKEN_KEY)
      },
      
      setUser(user) {
        storage.set(USER_KEY, user)
      },
      getUser() {
        const user = storage.get(USER_KEY)
        // 验证用户对象是否有效
        if (user && typeof user === 'object' && user.id) {
          return user
        }
        return null
      },
      removeUser() {
        storage.remove(USER_KEY)
      },
      
      setAdmin(admin) {
        storage.set(ADMIN_KEY, admin)
      },
      getAdmin() {
        return storage.get(ADMIN_KEY)
      },
      removeAdmin() {
        storage.remove(ADMIN_KEY)
      },
      
      setSeller(seller) {
        storage.set(SELLER_KEY, seller)
      },
      getSeller() {
        return storage.get(SELLER_KEY)
      },
      removeSeller() {
        storage.remove(SELLER_KEY)
      },
      
      logout() {
        this.removeToken()
        this.removeUser()
        this.removeAdmin()
        this.removeSeller()
      }
    }

    // 初始化时清理无效的 user 数据
    const currentUser = auth.getUser()
    if (!currentUser) {
      storage.remove(USER_KEY)
    }

    app.config.globalProperties.$storage = storage
    app.config.globalProperties.$auth = auth
    
    app.provide('storage', storage)
    app.provide('auth', auth)
  }
}
