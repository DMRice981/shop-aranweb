<template>
  <!-- 路由出口：所有页面都会在这里显示 -->
  <router-view />
</template>

<script setup>
// 根组件无需业务逻辑
</script>

<style lang="css">
/* 全局样式重置 + 基础布局 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #667eea;
  --primary-dark: #5a67d8;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
  --success-color: #00b42a;
  --danger-color: #ff4757;
  --warning-color: #ff9f43;
  --text-primary: #1a1a2e;
  --text-secondary: #666;
  --text-light: #999;
  --bg-primary: #f8f9fa;
  --bg-white: #ffffff;
  --border-color: #e8e8e8;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 40px rgba(0, 0, 0, 0.12);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}

html,
body,
#app {
  width: 100%;
  min-height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  color: var(--text-primary);
  line-height: 1.6;
}

/* 统一按钮样式 */
button {
  cursor: pointer;
  border: none;
  outline: none;
  transition: var(--transition-fast);
  font-family: inherit;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

button:active {
  transform: translateY(0);
}

/* 统一输入框样式 */
input {
  border: 1px solid var(--border-color);
  outline: none;
  transition: var(--transition-fast);
  font-family: inherit;
}

input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--secondary-color) 100%);
}

/* 选择文字样式 */
::selection {
  background: var(--primary-color);
  color: white;
}

/* 动画类 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease forwards;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
