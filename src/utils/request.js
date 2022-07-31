import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
const TimeOut = 3600
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 环境变量切换基地址
  timeout: 5000
})

function isCheckTimeOut () {
  var currentTime = Date.now()
  var timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > TimeOut
}
// 请求拦截器   增加请求头
service.interceptors.request.use(config => {
  if (store.getters.token) {
    if (isCheckTimeOut()) {
      store.dispatch('user/loginOut') // 清除数据，登出操作
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    // 如果有token，在请求头上加上token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器  处理结果
service.interceptors.response.use(response => {
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    // 如果请求失败，提示错误，跳出then，进入catch
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, err => {
  if (err.response && err.response.data && err.response.data.code === 10000) {
    // 后端提示token超时,被动介入
    store.dispatch('user/loginOut')
    router.push('/login')
  } else {
    Message.error(err.message) // 提示错误信息
  }
  return Promise.reject(err) // 返回执行错误，让当前请求直接进入catch
})

export default service
