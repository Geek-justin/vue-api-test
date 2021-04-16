const App = {
  components: {
    ApiTest,
  },
}

const app = Vue.createApp(App)
app.use(ElementPlus).mount('#wrapper')