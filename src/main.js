import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // 必须有这一行！

const app = createApp(App)
app.use(router)  // 必须有这一行！
app.mount('#app')