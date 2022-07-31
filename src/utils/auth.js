import Cookies from 'js-cookie'

const TokenKey = 'hrsass_ihrm_token'
const TimeKey = 'hrsass_ihrm_timeKey'
const UserInfo = 'hrsass_ihrm_userInfo'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function getUser () {
  return Cookies.get(UserInfo)
}

export function setUser (data) {
  return Cookies.set(UserInfo, data)
}

export function removeUser () {
  return Cookies.remove(UserInfo)
}
export function getTimeStamp () {
  return Cookies.get(TimeKey)
}

export function setTimeStamp () {
  return Cookies.set(TimeKey, Date.now())
}

