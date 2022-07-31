import router from '@/router' // 引入路由组件实例
import store from '@/store' // 引入vuex 获取token

import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '404']

router.beforeEach(async (to, from, next) => {
  NProgress.start() // 开启进度条
  // 有token的情况下
  if (store.getters.token) {
    // 访问的是登录页面
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    // 没有token的情况
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})

router.afterEach(function () {
  NProgress.done() // 关闭进度条
})
