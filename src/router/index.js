import Vue from 'vue'
import Router from 'vue-router'
// import FirstLayout from '../layout/FirstLayout'
// import SecondLayout from '../layout/SecondLayout'
// import FullScreenLayout from '../layout/FullScreenLayout'

import monitorReport from '../modules/monitor-report/router'
import monitorWarning from '../modules/monitor-warning/router'
import schoolManage from '../modules/school-manage/router'


Vue.use(Router)

let routers

routers = {
  constantRoutes: [
    ...monitorReport.constantRoutes,
    ...monitorWarning.constantRoutes,
    ...schoolManage.constantRoutes,
  ],
  asyncRoutes: [
    ...monitorReport.asyncRoutes,
    ...monitorWarning.asyncRoutes,
    ...schoolManage.asyncRoutes,
  ]
}

export const constantRoutes = [
  ...routers.constantRoutes,

  {
    path: '/404',
    component: () => import('@/404'),
    hidden: true
  },
  {
    path: '*',
    component: () => import('@/404'),
    hidden: true
  }
]

export const asyncRoutes = [...routers.asyncRoutes]

const createRouter = (permissionRoutes = []) =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: [...constantRoutes, ...permissionRoutes]
  })

const router = createRouter()

export function resetRouter(permissionRoutes) {
  const newRouter = createRouter(permissionRoutes)
  router.matcher = newRouter.matcher // reset router
}

export default router
