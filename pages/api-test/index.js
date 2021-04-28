const App = {
  components: {
    ApiTest,
    ApiGroup
  },
}

const app = Vue.createApp(App)
app.use(ElementPlus).mount('#wrapper')
