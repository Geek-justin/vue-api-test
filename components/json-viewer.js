const JsonViewer = (function () {
  function getKind(value) {
    let kind = typeof value
    if (kind == 'object' && value instanceof Array) {
      kind = 'array'
    }
    return kind
  }
  function getValue(kind, value) {
    if (kind == 'object') {
      return getObject(value)
    } else if (kind == 'array') {
      return getArray(value)
    } else {
      return value.toString()
    }
  }

  function getArray(_array) {
    let _expand = []
    if (_array.length > 0) {
      _array.forEach((each, i) => {
        _expand.push({
          name: '',
          kind: getKind(each),
          value: each
        })
      })
    }
    return _expand
  }

  function getObject(_object) {
    let _expand = []
    for (k in _object) {
      _expand.push({
        name: k,
        kind: getKind(_object[k]),
        value: _object[k],
      })
    }
    return _expand
  }

  JsonNode = {
    name: 'JsonNode',
    template: `
<div class="json-node">
  <span v-if="!isEmpty">
    <span class="char-quotes">"</span>
    <span class="node-key">{{ dataSource.name }}</span>
    <span class="char-quotes">"</span>
    <span class="char-colon">:</span>
  </span>
  <span v-if="isObject" class="char-bracket">{</span><span v-else-if="isArray" class="char-bracket">[</span><span v-else class="char-quotes">"</span>
  <json-node v-if="hasChildren" v-for="child in value" :dataSource="child"></json-node><span v-else class="node-value">{{ value }}</span>
  <span v-if="isObject" class="char-bracket">}</span><span v-else-if="isArray" class="char-bracket">]</span><span v-else class="char-quotes">"</span>
  <span v-if="!isRoot" class="char-dot">,</span>
</div>    
    `,
    props: {
      dataSource: {
        type: Object,
      },
      isRoot: Boolean,
    },
    data() {
      let _object = Vue.toRaw(this.dataSource)
      console.log(getValue(_object.kind, _object.value))
      return {
        isEmpty: _object.name == '',
        isObject: _object.kind == 'object',
        isArray: _object.kind == 'array',
        hasChildren: _object.kind == 'object' || _object.kind == 'array',
        value: getValue(_object.kind, _object.value),
      }
    },
    watch: {
      dataSource(_object) {
        this.isEmpty = _object.name == ''
        this.isObject = _object.kind == 'object'
        this.isArray = _object.kind == 'array'
        this.hasChildren = this.isObject || this.isArray
        this.value = getValue(_object.kind, _object.value)
      },
    },
  }

  const _page = {
    name: 'JsonViewer',
    template: `<div class="json-viewer">
<div class="json-viewer-control">
  <el-radio-group v-model="viewType">
    <el-radio label="raw">原始数据</el-radio>
    <el-radio label="json">JSON</el-radio>
  </el-radio-group>
</div>
<json-node v-if="showJsonViewer" :dataSource="jsonSource" :isRoot="true"></json-node>
<el-input v-else
  type="textarea"
  :autosize="{minRows: 30}"
  placeholder="请输入内容"
  v-model="inputContent">
</el-input>

</div>`,
    props: {
      jsonContent: {
        type: String,
        default: '',
      },
    },
    components: {
      JsonNode,
    },
    data() {
      return {
        viewType: 'json',
        inputContent: this.jsonContent,
      }
    },
    computed: {
      showJsonViewer() {
        return this.viewType == 'json'
      },
      jsonSource() {
        let _value = JSON.parse(this.inputContent)
        let _kind = getKind(_value)
        return {
          name: '',
          kind: _kind,
          value: _value,
        }
      },
    },
    watch: {
      jsonContent(content) {
        this.inputContent = content
      },
    },
  }

  return _page
})()
