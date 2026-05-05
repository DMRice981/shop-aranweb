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

html,
body,
#app {
  width: 100%;
  height: 100%;
  font-family: "Microsoft YaHei", Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

/* 统一按钮样式 */
button {
  cursor: pointer;
  border: none;
  outline: none;
  transition: 0.2s;
}

button:hover {
  opacity: 0.9;
}

/* 统一输入框样式 */
input {
  border: 1px solid #ddd;
  outline: none;
}

input:focus {
  border-color: #409eff;
}
</style>