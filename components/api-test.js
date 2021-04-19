const ApiTest = (function () {
  const _template = `<div class="request-area">
  <el-input
    placeholder="请输入接口地址"
    v-model="state.url"
    class="input-with-select"
  >
    <template #prepend>
      <el-select v-model="state.method" placeholder="请选择">
        <el-option label="Get" value="GET"></el-option>
        <el-option label="Post" value="POST"></el-option>
      </el-select>
    </template>
    <template #append>
      <el-button @click="doRequest">Send</el-button>
    </template>
  </el-input>
  <div class="response-area">
    <json-viewer :jsonContent="state.response"></json-viewer>
  </div>
  </div>`
  const _page = {
    props: {},
    template: _template,
    components: {
      JsonViewer,
    },
    setup() {
      const state = Vue.reactive({
        count: 0,
        method: 'GET',
        url: 'https://movie.douban.com/j/search_subjects?type=movie&tag=%E6%9C%80%E6%96%B0&page_limit=100&page_start=0',
        response: JSON.stringify({
          code: 0,
          data: null,
          msg: 'success',
        }),
      })
      function doRequest() {
        const client = axios.create()
        let url = new URL(state.url)
        let domain = url.origin
        let path = url.href.replace(domain, '')
        const options = {
          baseURL: domain,
          url: path,
          method: state.method,
        }
        client(options)
          .then((res) => {
            console.log(res)
            state.response = JSON.stringify(res.data)
          })
          .catch((err) => console.log(err))
      }
      return {
        state,
        doRequest,
      }
    },
  }

  return _page
})()
