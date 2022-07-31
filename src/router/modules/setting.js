// 公司设置路由规则

import Layout from '@/layout'
export default {
  path: '/setting',
  name: 'setting', // 给一级路由模块加一个name属性，做权限的时候会用到
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/setting'),
    // 路由的元信息
    meta: {
      title: '公司设置', // 左侧导航读取到这块的title属性
      icon: 'setting'
    }
  }]
}
