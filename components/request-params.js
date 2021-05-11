const RequestParams = (function () {
  
  const _page = {
    name: 'RequestParams',
    template: `
<div class="request-params">
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane name="params" label="Params">
        <param-list :params="state.urlParams" @paramUpdate="paramsChanged" />
      </el-tab-pane>
      <el-tab-pane name="header" label="Headers">
        <param-list :params="state.requestHeader" />
      </el-tab-pane>
      <el-tab-pane name="body" label="Body">
        <param-list :params="state.requestBody" />
      </el-tab-pane>
    </el-tabs>
  </div>
`,
    components: {
      ParamList,
    },
    props: {
      params: {
        type: Array,
        default: [],
      },
      auth: {
        type: Array,
        default: [],
      },
      headers: {
        type: Array,
        default: [],
      },
      body: {
        type: Array,
        default: [],
      },
    },
    emits: ['paramsUpdate'],
    data() {
      return {
        activeTab: 'body',
      }
    },
    setup(props, context) {
      const state = Vue.reactive({
        urlParams: [],
        requestHeader: [],
        requestBody: [],
      })
      Vue.watchEffect(() => {
        state.urlParams = props.params ?? []
        state.requestHeader = props.headers ?? []
        state.requestBody = props.body ?? []
      })
      function paramsChanged(payload) {
        context.emit('paramsUpdate', payload)
      }
      return {
        state,
        paramsChanged,
      }
    },
  }
  return _page
})()
