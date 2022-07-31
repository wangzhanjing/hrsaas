// 考勤路由规则

import Layout from '@/layout'
export default {
  path: '/attendances',
  name: 'attendances', // 给一级路由模块加一个name属性，做权限的时候会用到
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/attendances'),
    // 路由的元信息
    meta: {
      title: '考勤管理', // 左侧导航读取到这块的title属性
      icon: 'skill'
    }
  }]
}
