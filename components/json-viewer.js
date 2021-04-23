const JsonViewer = (function () {
  JsonNode = {
    name: 'JsonNode',
    template: `
<div :class="root ? 'json-root' : 'json-node'">
    <span v-if="state.hasChildren" class="node-ctrl">
      <span v-if="state.nodeOpen" @click="state.nodeOpen = false">-</span>
      <span v-else @click="state.nodeOpen = true">+</span>
    </span>
    <span v-if="name != ''">
      <span class="node-quotes">"</span>
      <span class="node-key">{{ name }}</span>
      <span class="node-quotes">"</span>
      <span class="node-colon">:</span>
    </span>
    <span v-if="state.hasChildren">
      <span v-if="kind == 'array'" class="node-bracket">[</span>
      <span v-else class="node-bracket">{</span>
    </span>

    <template v-if="state.hasChildren">
      <div class="node-children" v-if="state.nodeOpen">
        <json-node
          v-for="(item, index) in state.children"
          :key="index"
          :name="item.name"
          :kind="item.kind"
          :value="item.value"
        ></json-node>
      </div>
      <div v-else class="node-placeholder" @click="state.nodeOpen = true">...</div>
    </template>
    <template v-else>
      <template v-if="typeof value == 'string'">
        <span class="node-quotes">"</span>
        <span class="node-value">{{ value }}</span>
        <span class="node-quotes">"</span>
      </template>
      <template v-else-if="typeof value == 'boolean'">
        <span class="node-value" style="color: red; font-weight: bold">{{ value }}</span>
      </template>
      <template v-else>
        <span class="node-value" style="color: blue">{{ value }}</span>
      </template>
    </template>

    <span v-if="state.hasChildren">
      <span v-if="kind == 'array'" class="node-bracket">]</span>
      <span v-else class="node-bracket">}</span>
      <span v-if="!state.nodeOpen" class="node-remark">// {{ state.children.length }} nodes</span>
    </span>

    <span v-if="!root">,</span>
  </div>
    `,
    props: {
      root: {
        type: Boolean,
        default: false,
      },
      name: {
        type: String,
        default: '',
      },
      kind: {
        type: String,
        default: 'object',
      },
      value: {
        type: [Array, Object, Number, String, Boolean],
        require: true,
      },
    },
    setup(props) {
      const state = Vue.reactive({
        nodeValue: Vue.toRaw(props.value),
        hasChildren: false,
        nodeOpen: true,
        children: [],
      })

      function getKind(_value) {
        let _kind = typeof _value
        if (_kind == 'object' && _value instanceof Array) {
          _kind = 'array'
        }
        return _kind
      }
      function parseChild(value) {
        let children = []
        if (typeof value == 'object') {
          state.hasChildren = true
          let flag = value instanceof Array
          for (let k in value) {
            let _value = value[k]
            let child = {
              name: flag ? '' : k,
              kind: getKind(_value),
              value: _value,
            }
            children.push(child)
          }
        } else {
          state.hasChildren = false
        }
        state.children = children
      }
      Vue.watch(
        () => props.value,
        (_new, _old) => {
          state.nodeValue = _new
        }
      )
      Vue.watchEffect(() => {
        parseChild(state.nodeValue)
      })
      return {
        state,
      }
    },
  }

  const _page = {
    name: 'JsonViewer',
    template: `
<div class="json-viewer">
  <el-tabs type="border-card" v-model="state.viewType">
    <el-tab-pane name="json" label="Json" class="tab-content">
      <json-node :root="true" :kind="state.jsonKind" :value="state.jsonObject"></json-node>
    </el-tab-pane>
    <el-tab-pane name="raw" label="Raw">
      <el-input
        type="textarea"
        v-model="state.inputContent"
        placeholder="请输入JSON文本"
        :autosize="{ minRows: 20 }"
      />
    </el-tab-pane>
  </el-tabs>
</div>
`,
    components: { JsonNode },
    props: {
      content: {
        type: String,
        default: '{}',
      },
    },
    setup(props) {
      const state = Vue.reactive({
        inputContent: props.content,
        jsonObject: {},
        jsonKind: 'object',
        viewType: 'json',
      })

      function parseInput(_input) {
        try {
          let _value = JSON.parse(_input)
          state.jsonObject = _value
          let kind = typeof _value
          if (kind == 'object' && _value instanceof Array) {
            kind = 'array'
          }
          state.jsonKind = kind
        } catch (error) {
          console.log(error.message)
        }
      }

      Vue.watch(
        () => props.content,
        (_new, _old) => {
          state.inputContent = _new
        }
      )

      Vue.watchEffect(() => {
        parseInput(Vue.toRaw(state.inputContent))
      })

      return {
        state,
      }
    },
  }

  return _page
})()
