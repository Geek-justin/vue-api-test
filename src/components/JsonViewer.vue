<template>
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
                <json-viewer
                    v-for="(item, index) in state.children"
                    :key="index"
                    :name="item.name"
                    :kind="item.kind"
                    :value="item.value"
                ></json-viewer>
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
</template>

<script>

import { defineComponent, reactive, toRaw, watch, watchEffect } from "vue";

export default defineComponent({
    props: {
        root: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: ''
        },
        kind: {
            type: String,
            default: 'object'
        },
        value: {
            type: [Array, Object, Number, String, Boolean],
            require: true
        }
    },
    setup(props) {
        const state = reactive({
            nodeValue: toRaw(props.value),
            hasChildren: false,
            nodeOpen: true,
            children: []
        })

        watch(
            () => props.value,
            (_new, _old) => {
                state.nodeValue = _new
            }
        )
        watchEffect(() => {
            parseChild(state.nodeValue)
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
        return {
            state
        }
    }
})

</script>

<style scoped>
.json-root {
    position: relative;
    padding-left: 20px;
}
.json-node {
    position: relative;
    padding-left: 20px;
    border-left: 1px dotted #ccc;
}
.node-ctrl {
    position: absolute;
    left: 6px;
    color: #999;
    cursor: pointer;
}
.node-placeholder {
    color: #ccc;
    padding: 0 3px;
    display: inline;
}
.node-remark {
    color: #ccc;
    margin-left: 10px;
}
.json-node .node-key {
    color: #933;
}
.json-node .node-value {
    color: #333;
}
.json-node .node-bracket {
    color: #963;
}
.json-node .node-dot {
    color: #ccc;
}
.json-node .node-quotes {
    color: #963;
}
.json-node .node-colon {
    color: #333;
    padding: 0 2px;
}
</style>