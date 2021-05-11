const ParamList = (function () {
  const _page = {
    name: 'ParamList',
    template: `
  <div class="params-list">
    <div class="param-item header">
      <div class="param-ctrl">
        <el-button size="mini" style="margin: auto" icon="el-icon-plus" @click="addItem" />
      </div>
      <div class="param-key">Key</div>
      <div class="param-value">Value</div>
    </div>
    <div class="param-item" v-for="(each, index) in state.inputParams" :key="index">
      <div class="param-ctrl">
      <el-checkbox v-model="each.status" @change="paramsChanged" />
      </div>
      <div class="param-key">
        <el-input size="mini" v-model="each.key" @keyup="paramsChanged" />
      </div>
      <div class="param-value">
        <el-input size="mini" v-model="each.value" @keyup="paramsChanged" />
      </div>
      <div class="param-operate">
        <el-button v-if="params.length > 1" size="mini" icon="el-icon-delete" @click="removeItem(index)" />
      </div>
    </div>
  </div>
`,
    emits: ['paramUpdate'],
    props: {
      params: {
        type: Array,
        default: [],
      },
    },
    components: {},
    setup(props, context) {
      const state = Vue.reactive({
        inputParams: props.params ?? [],
      })
      Vue.watchEffect(() => {
        let _props = props.params ?? []
        if (_props.length > 0) {
          state.inputParams = _props
        } else {
          state.inputParams = [
            {
              status: true,
              key: '',
              value: '',
            },
          ]
        }
      })
      function paramsChanged() {
        context.emit('paramUpdate', state.inputParams)
      }

      function addItem() {
        state.inputParams.push({
          status: true,
          key: '',
          value: '',
        })
      }
      function removeItem(_index) {
        let p = Vue.toRaw(state.inputParams)
        const len = p.length
        if (len > 1) {
          state.inputParams.splice(_index, 1)
        }
        paramsChanged()
      }
      return {
        state,
        paramsChanged,
        addItem,
        removeItem,
      }
    },
  }

  return _page
})()
