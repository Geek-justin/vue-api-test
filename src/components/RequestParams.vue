<template>
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
</template>

<script>
import { defineComponent, reactive, watchEffect } from 'vue'
import ParamList from '../components/ParamList.vue'

export default defineComponent({
    components: {
        ParamList
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
        const state = reactive({
            urlParams: [],
            requestHeader: [],
            requestBody: [],
        })
        watchEffect(() => {
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
})
</script>

<style scoped>
.request-params {
    height: 100%;
    position: relative;
    background: #fff;
}
.request-params .el-tabs--border-card {
    height: calc(100% - 10px);
}
.request-params .el-tabs--border-card > .el-tabs__content {
    padding: 5px;
    width: calc(100% - 10px);
    height: calc(100% - 60px);
    overflow-y: auto;
    position: absolute;
}
</style>