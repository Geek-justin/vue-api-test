const App = {
  components: {
    ApiRequest,
    JsonViewer,
  },
}

const app = Vue.createApp(App)
app.use(ElementPlus).mount('#wrapper')
