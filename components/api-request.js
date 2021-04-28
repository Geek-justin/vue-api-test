const ApiRequest = (function () {
  let _render = `
<el-row class="title-section">
  <el-col :span="22">
    <el-breadcrumb separator="/" v-show="!state.nameEditMode">
      <el-breadcrumb-item v-for="item in state.parents">{{ item.name }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{state.name}} <el-button type="text" @click="editName" icon="el-icon-edit"></el-button></el-breadcrumb-item>
    </el-breadcrumb>
    <el-input ref="inputElement" v-model="state.name" v-show="state.nameEditMode" @blur="saveName" placeholder="Enter api name" />
  </el-col>
  <el-col :span="2">
    <el-button type="primary" @click="saveConfig">Save</el-button>
  </el-col>
</el-row>
<el-row class="info-section">
  <el-col :span="24">
    <div class="url-request">
        <el-input v-model="state.rawUrl" placeholder="Enter request url"
          class="url-raw"
          @focus="state.rawEditMode = true"
          @blur="state.rawEditMode = false"
          @keyup="parseUrlRaw"
        >
        <template #prepend>
            <el-select v-model="state.method" style="width: 120px">
            <el-option label="Get" value="GET"></el-option>
            <el-option label="Post" value="POST"></el-option>
            </el-select>
        </template>
        <template #append>
            <el-button type="primary" @click="sendApiRequest">Send</el-button>
        </template>
        </el-input>
    </div>
  </el-col>
</el-row>
<el-row class="func-section">
  <el-col :span="12">
  <request-params
      :params="state.url.query"
      :headers="state.headers"
      :body="state.body"
      @paramsUpdate="updateUrlRaw"
    ></request-params>
  </el-col>
  <el-col :span="12">
    <json-viewer :content="state.responseContent"></json-viewer>
  </el-col>
</el-row>`

  return Vue.defineComponent({
    name: 'ApiRequest',
    components: {
      RequestParams,
      JsonViewer,
    },
    template: _render,
    emits: ['updateName', 'updateConfig'],
    props: {
      parents: {
        type: Array,
        default: [],
      },
      name: {
        type: String,
        default: '',
      },
      api: {
        type: Object,
        default: {
          url: '',
        },
      },
    },
    setup(props, context) {
      const inputElement = Vue.ref(null)
      const state = Vue.reactive({
        parents: [],
        name: '',
        nameEditMode: false,
        rawUrl: props.api.url,
        rawEditMode: false,
        url: {
          protocol: 'http:',
          host: [],
          path: [],
          query: [],
        },
        method: '',
        headers: [],
        body: [],
        responseContent: '{"code":0}',
      })

      initDefaultOptions()
      function initDefaultOptions() {
        let _name = props.name
        if (_name == '') {
          _name = 'New Api'
        }
        state.name = _name
        let _parents = []
        if (props.parents.length > 0) {
          props.parents.forEach((item) => {
            _parents.push(item)
          })
        }
        state.parents = _parents
        state.method = props.api.method ?? 'GET'

        let _body = props.api.body ?? [{ status: true, key: '', value: '' }]
        if (_body.length == 0) {
          _body.push({ status: true, key: '', value: '' })
        }
        state.body = _body
        let _header = props.api.headers ?? [
          { status: true, key: '', value: '' },
        ]
        if (_header.length == 0) {
          _header.push({ status: true, key: '', value: '' })
        }
        state.headers = _header
        parseUrlRaw()
      }

      function parseUrlRaw() {
        let raw = '',
          host = [],
          path = [],
          query = []
        raw = state.rawUrl.trim().toLowerCase()
        if (raw.trim() != '') {
          if (raw.substr(0, 4) != 'http') {
            raw = 'http://' + raw
          }
          try {
            let _url = new URL(raw)
            state.url.protocol = _url.protocol
            host = _url.host.split('.')
            if (_url.pathname.length > 0) {
              path = _url.pathname.substr(1).split('/')
            }
            if (_url.search.length > 0) {
              let _queryString = _url.search.substr(1)
              let _arr = _queryString.split('&')
              _arr.forEach((each) => {
                let _tmp = each.split('=')
                if (_tmp[0].trim() != '') {
                  let _value = typeof _tmp[1] == 'undefined' ? '' : _tmp[1]
                  _value = decodeURIComponent(_value)
                  query.push({
                    status: true,
                    key: _tmp[0],
                    value: _value,
                  })
                }
              })
            }
          } catch (error) {}
        }
        if (query.length == 0) {
          query.push({ status: true, key: '', value: '' })
        }
        state.url.host = host
        state.url.path = path
        state.url.query = query
      }

      function updateUrlRaw(payload) {
        if (state.rawEditMode) {
          return false
        }
        let _url = `${state.url.protocol}//`
        _url += state.url.host.join('.')
        if (state.url.path.length > 0) {
          _url += '/' + state.url.path.join('/')
        }
        if (state.url.query.length > 0) {
          _url += '?'
          let params = []
          state.url.query.forEach((each) => {
            if (each['status'] && each['key'] != '') {
              params.push(`${each['key']}=${each['value']}`)
            }
          })
          _url += params.join('&')
        }
        state.rawUrl = _url
      }
      function editName() {
        state.nameEditMode = true
        setTimeout(function () {
          inputElement.value.focus()
        }, 500)
      }
      function saveName() {
        state.nameEditMode = false
        context.emit('updateName', state.name)
      }
      function saveConfig() {
        let config = {
          url: state.rawUrl,
          method: state.method,
          headers: Vue.toRaw(state.headers),
          body: Vue.toRaw(state.body),
        }
        context.emit('updateConfig', config)
      }

      function sendApiRequest() {
        let _url = '',
          _protocol = Vue.toRaw(state.url.protocol),
          _domain = '',
          _path = '/',
          _method = Vue.toRaw(state.method),
          _headers = {},
          _body = {},
          _params = {}

        if (state.url.host.length > 0) {
          _domain = Vue.toRaw(state.url.host).join('.')
        }
        if (state.url.path.length > 0) {
          _path += Vue.toRaw(state.url.path).join('/')
        }
        _url = `${_protocol}//${_domain}${_path}`
        if (state.url.query.length > 0) {
          _url += '?'
          state.url.query.forEach((item) => {
            if (item['status'] && item['key'] != '') {
              _url += `${item['key']}=${item['value']}&`
            }
          })
          _url = _url.substr(0, _url.length - 1)
        }
        if (state.headers.length > 0) {
          state.headers.forEach((item) => {
            if (item['status'] && item['key'] != '') {
              _headers[item['key']] = item['value']
            }
          })
        }
        if (state.body.length > 0) {
          state.body.forEach((item) => {
            if (item['status'] && item['key'] != '') {
              _body[item['key']] = item['value']
            }
          })
        }
        const client = axios.create()
        const options = {
          baseURL: _domain,
          url: _url,
          headers: _headers,
          method: _method,
          data: _body,
        }
        try {
          client(options)
            .then((res) => {
              state.responseContent = JSON.stringify(res.data)
            })
            .catch((err) => {
              ElementPlus.ElMessage(err.message)
            })
        } catch (err) {
          console.log(err)
        }
      }
      return {
        state,
        inputElement,
        editName,
        saveName,
        saveConfig,
        updateUrlRaw,
        parseUrlRaw,
        sendApiRequest,
      }
    },
  })
})()
