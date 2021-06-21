import { createApp } from "vue";
import App from "./App.vue";
import { 
    ElRow, 
    ElCol, 
    ElButton,
    ElTabPane,
    ElTabs,
    ElInput,
    ElCheckbox,
    ElBreadcrumb,ElBreadcrumbItem,
    ElDialog,ElSelect,ElOption,
    ElMessage,
    ElEmpty,
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
    ElTree,
} from "element-plus";
import "element-plus/packages/theme-chalk/src/base.scss";

const app = createApp(App);
app.use(ElRow);
app.use(ElCol);
app.use(ElButton);
app.use(ElTabPane);
app.use(ElTabs);
app.use(ElInput);
app.use(ElCheckbox);
app.use(ElBreadcrumb);
app.use(ElBreadcrumbItem);
app.use(ElDialog);
app.use(ElSelect);
app.use(ElOption);
app.use(ElEmpty);
app.use(ElMessage);
app.use(ElDropdown);
app.use(ElDropdownItem);
app.use(ElDropdownMenu);
app.use(ElTree);
app.mount("#app");
