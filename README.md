# vue-api-test
Api test

本项目为Vue3构建的Chrome插件，目标是实现postman基本功能

## 实现阶段

- 返回数据的展示`JsonViewer`
    - 格式化的展示组件
    - 原生结构的展示
    - 动态切换控制
- 请求参数组件的参数`RequestParams`
    - 绑定数据的动态展示
    - 增减参数
    - 自组件向上通知更新动作
- 请求组件的关联`ApiRequest`
    - URL的解析
    - 参数的绑定数据自动生成URL的QueryString部分
    - 请求动作，并返回结果绑定到`JsonViewer`
- 多组活动请求组件`ApiGroup`
    - 动态的打开、关闭、激活
    - 通过key保证Tab关闭时，TabPane内组件的正确更新
    - 增加上报事件修改名称、保存配置
    - 增加上报事件打开tab、关闭tab、激活tab
- 请求列表组件`ApiTest`
    - 树形结构展示目录及请求
    - 点击时间更新数据，通过属性激活新的请求组件
    - 接收上报事件，同步修改数据
    - 引入storage机制，持久化保存数据
    - 通过属性，联动激活的Api和Tab