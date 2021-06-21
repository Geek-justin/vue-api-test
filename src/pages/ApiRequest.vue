<template>
  <api-test />
</template>

<script>
import { defineComponent, reactive } from "vue";
import ApiTest from '../components/ApiTest.vue';

export default defineComponent({
  components: {
    ApiTest
  },
  setup() {
    const state = reactive({
    })

    return {
      state
    }
  }
})
</script>

<style scoped>
</style>