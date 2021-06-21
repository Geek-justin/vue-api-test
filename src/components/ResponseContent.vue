<template>
    <div class="response-content" id="t">
        <el-tabs type="border-card" v-model="state.viewType">
            <el-tab-pane name="json" label="Json" class="json-content-viewer">
                <json-viewer :root="true" :kind="state.jsonKind" :value="state.jsonObject"></json-viewer>
            </el-tab-pane>
            <el-tab-pane name="raw" label="Raw">
                <el-input
                    type="textarea"
                    v-model="state.inputContent"
                    placeholder="请输入JSON文本"
                    :autosize="{ minRows: 40 }"
                />
            </el-tab-pane>
            <el-tab-pane name="preview" label="Preview">
                <div v-html="state.jsonObject"></div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { defineComponent, reactive, toRaw, watch, watchEffect } from 'vue'
import JsonViewer from '../components/JsonViewer.vue'

export default defineComponent({
    components: {
        JsonViewer
    },
    props: {
        content: {
            type: String,
            default: '{}'
        }
    },
    setup(props) {
        const state = reactive({
            inputContent: props.content,
            jsonObject: {},
            jsonKind: 'object',
            viewType: 'json'
        })

        watch(
            () => props.content,
            (_new, _old) => {
                state.inputContent = _new
            }
        )

        watchEffect(() => {
            parseInput(toRaw(state.inputContent))
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
        return {
            state
        }
    },
})
</script>

<style>
.response-content {
    height: 100%;
    position: relative;
    background: #fff;
}
.response-content .el-tabs--border-card {
    height: calc(100% - 10px);
}
.response-content .el-tabs--border-card > .el-tabs__content {
    padding: 5px;
    width: calc(100% - 10px);
    height: calc(100% - 60px);
    overflow-y: auto;
    position: absolute;
}
</style>