<template>
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
                <el-button
                    v-if="params.length > 1"
                    size="mini"
                    icon="el-icon-delete"
                    @click="removeItem(index)"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, reactive, toRaw, watch, watchEffect } from 'vue'

export default defineComponent({
    props: {
        params: {
            type: Array,
            default: [],
        },
    },
    emits: ['paramUpdate'],
    setup(props, context) {
        const state = reactive({
            inputParams: props.params ?? [],
        })
        watchEffect(() => {
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
            let p = toRaw(state.inputParams)
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
})
</script>

<style scoped>


.el-button--mini {
  padding: 5px 10px;
}
.params-list {
    font-size: 14px;
    border: 1px solid #ccc;
}
.param-item {
    border-bottom: 1px solid #ccc;
    height: 33px;
    position: relative;
}
.param-item:last-child {
    border-bottom: none;
}
.header > .param-key,
.param-value {
    padding-left: 10px;
    line-height: 30px;
}
.param-item > div {
    border-left: 1px solid #ccc;
    height: 29px;
    padding: 2px;
    line-height: 28px;
}
.param-item > div:first-child {
    border-left: none;
}
.param-item .param-ctrl {
    float: left;
    width: 35px;
    text-align: center;
}
.param-item .param-key {
    float: left;
    width: 120px;
}
.param-item .param-value {
    margin-left: 165px;
    width: calc(100% - 210px);
}
.param-item .param-operate {
    position: absolute;
    right: 10px;
    top: 0;
    width: 25px;
}
.param-item .param-operate .el-button {
    color: #f00;
    display: none;
    text-align: center;
}
.param-item:hover .el-button {
    display: block;
}
</style>