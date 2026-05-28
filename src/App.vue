<template>
  <router-view />
</template>

<script setup>
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

/* 自定义路由进度条样式 */
#router-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 99999;
  background: rgba(102, 126, 234, 0.1);
  overflow: hidden;
}

#router-progress-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  transition: width 0.4s ease;
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
input, textarea, select {
  border: 1px solid var(--border-color);
  outline: none;
  transition: var(--transition-fast);
  font-family: inherit;
}

input:focus, textarea:focus, select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Element Plus 主题定制 */
.el-button--primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border: none;
}

.el-button--primary:hover {
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--secondary-color) 100%);
}

.el-button--primary:focus {
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--secondary-color) 100%);
}

.el-card {
  border-radius: var(--radius-lg);
  border: none;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}

.el-card:hover {
  box-shadow: var(--shadow-md);
}

.el-input__wrapper {
  border-radius: var(--radius-sm);
  box-shadow: 0 0 0 1px var(--border-color) inset !important;
}

.el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1px var(--primary-color) inset !important;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
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

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease forwards;
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease forwards;
}

.animate-slideInLeft {
  animation: slideInLeft 0.5s ease forwards;
}

.animate-slideInRight {
  animation: slideInRight 0.5s ease forwards;
}

.animate-scaleIn {
  animation: scaleIn 0.4s ease forwards;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-shake {
  animation: shake 0.5s ease;
}

/* 过渡类名 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 工具类 */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cursor-pointer {
  cursor: pointer;
}

.user-select-none {
  user-select: none;
}

/* 加载骨架屏动画 */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
