import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

export function getUserInfo () {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}
// 根据用户id获取用户详情
export function getUserDetialById (id) {
  return request({
    method: 'GET',
    url: `/sys/user/${id}`
  })
}
