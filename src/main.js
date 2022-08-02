import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
// 注册打印插件
import Print from 'vue-print-nb'
import Components from '@/components'
import * as directives from '@/directives'
import * as filters from '@/filters'
import '@/icons' // icon
import '@/permission' // permission control
import CheckPermission from '@/mixin/checkPermission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(Components)
Vue.use(ElementUI, { locale })
Vue.use(Print)
Vue.mixin(CheckPermission) // 所有组件都有这个方法
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 循环全部注册自定义指令
Object.keys(directives).forEach(item => {
  Vue.directive(item, directives[item])
})
// 注册过滤器
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
