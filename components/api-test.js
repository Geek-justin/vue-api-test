const ApiTest = (function () {
  const _template = `<div>
  {{ state.count }}
  <el-button type="primary" @click="addCount">计数器</el-button>
  </div>`
  const _page = {
    props: {},
    template: _template,
    setup() {
      const state = Vue.reactive({
        count: 0,
      })
      function addCount() {
        state.count++
      }
      return {
        state,
        addCount,
      }
    },
  }

  return _page
})()
