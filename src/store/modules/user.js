import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetialById } from '@/api/user'
const state = {
  token: getToken(), // 设置token初始状态   token持久化 => 放到缓存中
  userInfo: {} // 定义一个空对象，为什么呢？
}
const mutations = {
  setToken (state, token) {
    state.token = token // 讲数据设置给vuex
    setToken(token) // 讲token同步给缓存
  },
  removeToken (state) {
    state.token = null
    removeToken()
  },
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo // 直接赋值对象是响应式
  },
  removeUserInfo (state) {
    state.userInfo = {}
  }
}
const actions = {
  async login (context, data) {
    // 调用api接口
    const res = await login(data)
    // 已经在请求拦截器处理错误情况和返回数据格式
    console.log(res)
    // 保存token
    context.commit('setToken', res)
    // 设置时间戳
    setTimeStamp()
  },
  async getUserInfo (context) {
    // 获取用户基本信息
    const res = await getUserInfo()
    // 获取用户详情信息
    const detial = await getUserDetialById(res.userId)
    const allInFo = { ...res, ...detial }
    context.commit('setUserInfo', allInFo)
    return allInFo // 为什么要return呢,给后期做权限的时候做伏笔
  },
  loginOut (context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

