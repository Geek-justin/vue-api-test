<template>
    <el-tabs
        v-if="apis.length > 0"
        v-model="state.ActiveTab"
        type="card"
        closable
        @edit="handleTabsEdit"
        @tab-click="handleTabClick"
        class="api-group"
    >
        <el-tab-pane
            v-for="(item, index) in apis"
            :label="item.name"
            :name="'' + index"
            :key="index"
        >
            <api-request
                :key="item.ref.id"
                :parents="item.parents"
                :name="item.name"
                :api="item.config"
                @updateName="updateName"
                @updateConfig="saveConfig"
            />
        </el-tab-pane>
    </el-tabs>
    <el-empty v-else></el-empty>
</template>

<script>
import { defineComponent,reactive,watch } from "vue";
import ApiRequest from '../components/ApiRequest.vue';

export default defineComponent({
    name: 'ApiGroup',
    components: {
        ApiRequest
    },
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
    setup(props, context) {
        const state = reactive({
            ActiveTab: '0',
        })
        watch(
            () => props.active,
            (_new, _old) => {
                state.ActiveTab = _new
            }
        )
        function refreshActiveTab(tabIndex) {
            let last = props.apis.length - 1
            if (tabIndex > last) {
                tabIndex = last
            }
            if (tabIndex < 0) {
                tabIndex = 0
            }
            state.ActiveTab = `${tabIndex}`
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
    }
})
</script>

<style>
    .api-group {
        height: 100%;
    }

    .api-group .el-tabs__content {
        height: calc(100% - 56px);
    }
    .api-group .el-tabs__content .el-tab-pane {
        height: 100%;
    }

.global-ctrl {
  height: 40px;
  line-height: 40px;
}
.tree-wrapper {
  height: calc(100% - 80px);
  overflow-y: auto;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-tree-node .context-menu {
  display: none;
}
.custom-tree-node:hover .context-menu {
  display: flex;
}

.title-section {
  padding: 0 10px 10px;
}
.title-section .el-col:first-child {
  border: 1px solid #ccc;
  border-radius: 4px;
}
.title-section .el-col:last-child {
  padding-left: 10px;
}
.title-section .el-breadcrumb .el-button {
  display: none;
  margin-left: 5px;
}
.title-section .el-breadcrumb {
  height: 40px;
  line-height: 40px;
  margin-left: 5px;
}
.title-section .el-breadcrumb:hover .el-button {
  display: inline;
}
</style>