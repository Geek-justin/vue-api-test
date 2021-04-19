const App = {
  components: {
    ApiTest,
    JsonViewer,
  },
}

const app = Vue.createApp(App)
app.use(ElementPlus).mount('#wrapper')
