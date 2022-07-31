// 员工路由规则

import Layout from '@/layout'
export default {
  path: '/employees',
  name: 'employees', // 给一级路由模块加一个name属性，做权限的时候会用到
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/employees'),
    // 路由的元信息
    meta: {
      title: '员工管理', // 左侧导航读取到这块的title属性
      icon: 'people'
    }
  }]
}
