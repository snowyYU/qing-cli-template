import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let routers = {
  constantRoutes: [
    
  ],
  asyncRoutes: [
    
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
