const ApiGroup = (function () {
  let _render = `
<el-tabs v-if="apis.length > 0" v-model="tabActive" type="card" closable @edit="handleTabsEdit" @tab-click="handleTabClick">
  <el-tab-pane
    v-for="(item, index) in apis"
    :label="item.name"
    :name="'' + index"
    :key="index"
  >
    <api-request :key="item.ref.id" :parents="item.parents" :name="item.name" :api="item.config" @updateName="updateName" @updateConfig="saveConfig" />
  </el-tab-pane>
</el-tabs>
<el-empty v-else></el-empty>
`
  return Vue.defineComponent({
    name: 'ApiGroup',
    components: {
      ApiRequest,
    },
    template: _render,
    emits: ['activeApi', 'removeApi', 'updateName', 'saveConfig'],
    props: {
      apis: {
        type: Array,
        default: [],
      },
      active: {
        type: String,
      },
    },
    data() {
      return {
        tabActive: 0
      }
    },
    methods: {

    },
    setup(props, context) {
      const state = Vue.reactive({
        ActiveTab: 0,
      })
      Vue.watch(
        () => props.active,
        (_new, _old) => {
        setTimeout(function(){
          state.ActiveTab = _new
        }, 100)
      })
      function refreshActiveTab(tabIndex) {
        let last = props.apis.length - 1
        if (tabIndex > last) {
          state.ActiveTab = `${last}`
        } else {
          state.ActiveTab = `${tabIndex}`
        }
      }
      function handleTabClick(_instance) {
        let targetName = _instance.props.name
        let index = targetName
        context.emit('activeApi', index)
      }
      function handleTabsEdit(targetName, action) {
        if (action == 'add') {
          refreshActiveTab(10000)
        } else if (action == 'remove') {
          let current = state.ActiveTab
          let index = targetName
          if (current >= index) {
            current--
          }
          if (state.ActiveTab < 0) {
            state.ActiveTab = 0
          } 
          context.emit('removeApi', index)
          refreshActiveTab(current--)
        }
      }
      function updateName(payload) {
        let active = state.ActiveTab
        context.emit('updateName', {
          index: active,
          name: payload,
        })
      }
      function saveConfig(payload) {
        let active = state.ActiveTab
        context.emit('saveConfig', {
          index: active,
          config: payload,
        })
      }
      return {
        state,
        handleTabsEdit,
        handleTabClick,
        updateName,
        saveConfig,
      }
    },
  })
})()
