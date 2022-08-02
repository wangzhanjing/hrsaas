import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  routes: constantRoutes // 路由表，表示当前用户所拥有的所有路由表
}
const mutations = {
  setRoutes (state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 筛选权限路由  第二个参数为用户所拥有的的菜单权限
  // menus:['settings','premission']
  filterRoutes (context, menus) {
    const newRoutes = []
    menus.forEach(key => {
      newRoutes.push(...asyncRoutes.filter(route => route.name === key))
    })
    context.commit('setRoutes', newRoutes) // state数据是用来显示菜单用的
    return newRoutes // return是用来addRouters用的
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
