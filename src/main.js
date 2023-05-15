// import 'babel-polyfill'
import promise from 'es6-promise'
import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

promise.polyfill()
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount('#app')
