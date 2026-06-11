<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#eb2f96',
        borderRadius: 8,
        wireframe: false,
      },
    }"
  >
    <div class="app-wrapper">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
      <!-- AI 造物管家：全局浮动聊天 -->
      <AIChatWidget />
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import AIChatWidget from './components/AIChatWidget.vue';
</script>

<style>
/* Global Resets & Styles */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f9f9f9;
}

.app-wrapper {
  min-height: 100vh;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #ffadd2;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #eb2f96;
}

/* Common Utility Classes */
.mt-24 { margin-top: 24px; }
.mb-24 { margin-bottom: 24px; }
.ml-16 { margin-left: 16px; }
.mr-16 { margin-right: 16px; }
</style>
