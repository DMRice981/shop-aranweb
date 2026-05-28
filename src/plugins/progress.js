class ProgressBar {
  constructor() {
    this.status = 'idle'
    this.bar = null
  }
  
  start() {
    this.status = 'loading'
    this.createBar()
    if (this.bar) {
      this.bar.style.width = '0%'
      setTimeout(() => {
        if (this.bar) {
          this.bar.style.width = '30%'
        }
      }, 50)
    }
  }
  
  set(value) {
    if (this.bar) {
      this.bar.style.width = `${value * 100}%`
    }
  }
  
  inc() {
    if (this.bar) {
      const current = parseFloat(this.bar.style.width) || 0
      this.bar.style.width = `${Math.min(current + 10, 90)}%`
    }
  }
  
  done() {
    if (this.bar) {
      this.bar.style.width = '100%'
      setTimeout(() => {
        this.removeBar()
      }, 300)
    }
    this.status = 'idle'
  }
  
  createBar() {
    this.removeBar()
    const bar = document.createElement('div')
    bar.id = 'custom-progress-bar'
    document.body.appendChild(bar)
    this.bar = bar
  }
  
  removeBar() {
    if (this.bar) {
      this.bar.remove()
      this.bar = null
    }
  }
}

const progressBar = new ProgressBar()

export default {
  install(app) {
    app.config.globalProperties.$progress = progressBar
    app.provide('progress', progressBar)
  }
}
