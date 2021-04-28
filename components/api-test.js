const ApiTest = (function () {
  const _page = {
    name: 'ApiTest',
    components: {
      ApiGroup,
    },
    template: `
    <el-row>
      <el-col :span="4">
        <el-input placeholder="输入关键字进行过滤" v-model="state.searchText"></el-input>
        <el-tree
          class="filter-tree"
          :data="state.data"
          @node-click="nodeClick"
          default-expand-all
          :expand-on-click-node="false"
          ref="tree">
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ data.label }}</span>
              <span class="context-menu" v-if="!data.config">
                <el-dropdown trigger="click" size="small">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more"></i>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="addFolder(node, data)">Add folder</el-dropdown-item>
                      <el-dropdown-item @click="addRequest(node, data)">Add request</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </span>
            </span>
          </template>
        </el-tree>
      </el-col>
      <el-col :span="20">
        <api-group 
          :apis="state.apis"
          :active="state.active"
          @activeApi="handleActiveApi"
          @removeApi="handleRemoveApi"
          @updateName="handleUpdateName"
          @saveConfig="handleSaveConfig"
        ></api-group>
      </el-col>
    </el-row>
    `,
    setup() {
      const state = Vue.reactive({
        apis: [],
        active: '0',
        openedList: [],
        searchText: '',
        data: [],
      })
      initDatabase()
      function initDatabase() {
        let api = ApiDB.getStorage('api')
        if (!api) {
          console.log('初始化DB' + api)
          api = [{ id: 1, label: 'Home' }]
          ApiDB.setStorage('api', api)
        }
        state.data = api
      }
      function syncUpdateDatabase() {
        let api = Vue.toRaw(state.data)
        ApiDB.setStorage('api', api)
      }
      function addFolder(_node, _object) {
        if (typeof _object['config'] == 'undefined') {
          if (typeof _object['children'] == 'undefined') {
            _object['children'] = []
          }

          ElementPlus.ElMessageBox.prompt('Input folder name', '', {})
            .then(({ value }) => {
              if (value) {
                _object.children.push({ id: uuid(), label: value.trim() })
                syncUpdateDatabase()
              }
            })
            .catch((e) => {})
        }
      }
      function addRequest(_node, _object) {
        if (typeof _object['config'] == 'undefined') {
          if (typeof _object['children'] == 'undefined') {
            _object['children'] = []
          }
          _object.children.push({
            id: uuid(),
            label: 'New Request',
            config: { url: '' },
          })
          syncUpdateDatabase()
        }
      }

      function nodeClick(_object, _node, _element) {
        let _api = Vue.toRaw(_object)
        if (typeof _api.config != 'undefined') {
          let parents = []
          let parent = _node.parent
          while (parent) {
            let _parent = Vue.toRaw(parent)
            if (
              typeof parent['data'] != 'undefined' &&
              typeof parent['data']['label'] != 'undefined'
            ) {
              parents.unshift({
                id: parent['data']['id'],
                name: parent['data']['label'],
              })
            }
            if (_parent['data']['id'] == 1) break
            parent = parent.parent ?? false
          }
          handleAddApi(_object, parents)
        }
      }
      function handleActiveApi(payload) {
          state.active = `${payload}`
          console.log(`Curr ${state.active}`)
      }
      function handleAddApi(_object, parents) {
        let _api = Vue.toRaw(_object)
        if (state.openedList.indexOf(_api.id) == -1) {
          state.apis.push({
            ref: _object,
            name: _api.label,
            parents: parents,
            config: _api.config,
          })
          let last = state.apis.length - 1
          if (last < 0) {
            last = 0
          }
          state.active = `${last}`
          state.openedList.push(_api.id)
        }
      }
      function handleRemoveApi(payload) {
        let target = state.apis[payload]
        let id = target['ref']['id']
        let pos = state.openedList.indexOf(id)
        if (pos != -1) {
          state.openedList.splice(pos, 1)
        }
        state.apis.splice(payload, 1)

        let active = (current = Vue.toRaw(state.active))
        if (current >= payload) {
          active--
        }
        if (active < 0) {
          active = 0
        }
        state.active = `${active}`
      }
      function handleUpdateName(payload) {
        let index = payload['index']
        let name = payload['name']
        let target = state.apis[index]
        target['ref']['label'] = name
        target['name'] = name
        syncUpdateDatabase()
      }
      function handleSaveConfig(payload) {
        let index = payload['index']
        let config = Vue.toRaw(payload['config'])
        let target = state.apis[index]
        target['ref']['config'] = config
        syncUpdateDatabase()
      }
      function uuid() {
        var s = []
        var hexDigits = '0123456789abcdef'
        for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
        }
        s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = '-'

        var uuid = s.join('')
        return uuid
      }

      return {
        state,
        nodeClick,
        addFolder,
        addRequest,
        handleActiveApi,
        handleRemoveApi,
        handleUpdateName,
        handleSaveConfig,
      }
    },
  }

  return Vue.defineComponent(_page)
})()
