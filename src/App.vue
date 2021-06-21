<template>
  <api-request />
</template>

<script>
import { defineComponent } from 'vue'
import ApiRequest from '@/pages/ApiRequest.vue'

export default defineComponent({
  name: 'App',
  components: {
    ApiRequest
  }

})

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
html, body { padding: 0; margin: 0; }
#app {
  font-family: system-ui, "PingFang SC", STHeiti, sans-serif;;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh
}
</style>
