import requset from '@/utils/request'

/**
 *  获取员工的简单列表
 * **/
export function getEmployeeSimple () {
  return requset({
    url: '/sys/user/simple'
  })
}
