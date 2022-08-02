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
        // 获取用户登录信息
        const { roles } = await store.dispatch('user/getUserInfo')
        // 获取动态路由权限
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        console.log('当前动态权限路由', routes)
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        // 执行完addRouters之后，要使用next(to.path) 跳转到相应的地址，相当于多做一次跳转，直接调用next()的话路由表还没有设置好
        next(to.path)
      } else {
        next()
      }
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
