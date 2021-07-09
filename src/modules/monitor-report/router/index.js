import FirstLayout from '@/layout/FirstLayout'
import SecondLayout from '@/layout/SecondLayout'

const asyncRoutes = [
  {
    path: '/monitor-report',
    redirect: '/monitor-report/monitor-info-report',
    component: FirstLayout,
    meta: { title: '监测上报', icon: '', isModule: true },
    children: [
      {
        path: '/monitor-report/monitor-info-report',
        redirect: '/monitor-report/monitor-info-report/index',
        component: SecondLayout,
        meta: { title: '监测信息上报', icon: '' },
        children: [
          {
            name: 'monitor-info-report',
            path: '/monitor-report/monitor-info-report/index',
            component: () => import('../views/monitor-info-report/index.vue'),
            meta: { title: '监测信息上报', icon: '' }
          }
        ]
      },
      {
        path: '/monitor-report/zero-report',
        redirect: '/monitor-report/zero-report/index',
        component: SecondLayout,
        meta: { title: '零上报', icon: '' },
        children: [
          {
            name: 'zero-report',
            path: '/monitor-report/zero-report/index',
            component: () => import('../views/zero-report/index.vue'),
            meta: { title: '零上报', icon: '' }
          }
        ]
      },
      {
        path: '/monitor-report/report-info-confirm',
        redirect: '/monitor-report/report-info-confirm/index',
        component: SecondLayout,
        meta: { title: '上报信息确认', icon: '' },
        children: [
          {
            name: 'report-info-confirm',
            path: '/monitor-report/report-info-confirm/index',
            component: () => import('../views/report-info-confirm/index.vue'),
            meta: { title: '上报信息确认', icon: '' }
          }
        ]
      },
      {
        path: '/monitor-report/report-info-audit',
        redirect: '/monitor-report/report-info-audit/index',
        component: SecondLayout,
        meta: { title: '上报信息审核', icon: '' },
        children: [
          {
            path: '/monitor-report/report-info-audit/index',
            component: () => import('../views/report-info-audit/index.vue'),
            meta: { title: '上报信息审核', icon: '' }
          }
        ]
      },
      {
        path: '/monitor-report/lab-detection-input',
        redirect: '/monitor-report/lab-detection-input/index',
        component: SecondLayout,
        meta: { title: '实验室检测录入', icon: '' },
        children: [
          {
            path: '/monitor-report/lab-detection-input/index',
            component: () => import('../views/lab-detection-input/index.vue'),
            meta: { title: '实验室检测录入', icon: '' }
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
