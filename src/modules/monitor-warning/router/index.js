import FirstLayout from '@/layout/FirstLayout'
import SecondLayout from '@/layout/SecondLayout'

const asyncRoutes = [
  {
    path: '/monitor-warning',
    redirect: '/monitor-warning/warning-info-track',
    component: FirstLayout,
    meta: { title: '监测预警', icon: '', isModule: true },
    children: [
      {
        path: '/monitor-warning/warning-info-track',
        redirect: '/monitor-warning/warning-info-track/index',
        component: SecondLayout,
        meta: { title: '预警信息追踪', icon: '' },
        children: [
          {
            name: 'warning-info-track',
            path: '/monitor-warning/warning-info-track/index',
            component: () => import('../views/warning-info-track/index.vue'),
            meta: { title: '预警信息追踪', icon: '' }
          }
        ]
      },

      {
        path: '/monitor-warning/rules-config',
        redirect: '/monitor-warning/rules-config/index',
        component: SecondLayout,
        meta: { title: '预警规则设置', icon: '' },
        children: [
          {
            path: '/monitor-warning/rules-config/index',
            component: () => import('../views/rules-config/index.vue'),
            meta: { title: '预警规则设置', icon: '' }
          }
        ]
      }
    ]
  }
]
const constantRoutes = []

export default {
  constantRoutes,
  asyncRoutes
}
