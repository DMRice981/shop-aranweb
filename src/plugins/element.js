import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

export default {
  install(app) {
    const msgSuccess = (message, duration = 2000) => {
      return ElMessage({
        message,
        type: 'success',
        duration,
        showClose: true
      })
    }
    
    const msgError = (message, duration = 3000) => {
      return ElMessage({
        message,
        type: 'error',
        duration,
        showClose: true
      })
    }
    
    const msgWarning = (message, duration = 2500) => {
      return ElMessage({
        message,
        type: 'warning',
        duration,
        showClose: true
      })
    }
    
    const msgInfo = (message, duration = 2500) => {
      return ElMessage({
        message,
        type: 'info',
        duration,
        showClose: true
      })
    }
    
    const confirm = (message, title = '提示', options = {}) => {
      return ElMessageBox.confirm(message, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true,
        ...options
      })
    }
    
    const notify = (title, message, type = 'info', duration = 4500) => {
      return ElNotification({
        title,
        message,
        type,
        duration,
        position: 'top-right',
        showClose: true
      })
    }

    app.config.globalProperties.$msg = {
      success: msgSuccess,
      error: msgError,
      warning: msgWarning,
      info: msgInfo
    }
    
    app.config.globalProperties.$confirm = confirm
    app.config.globalProperties.$notify = notify
    
    app.provide('msg', {
      success: msgSuccess,
      error: msgError,
      warning: msgWarning,
      info: msgInfo
    })
    
    app.provide('confirm', confirm)
    app.provide('notify', notify)
  }
}
