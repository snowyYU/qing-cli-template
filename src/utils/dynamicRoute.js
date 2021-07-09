import routerMap from '@/router/routerMap'
import store from './store'
/* Layout */
import Layout from '@/layout'
import { resetRouter, constantRoutes } from './router'
const notFoundRoutes = [
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
const emptyRedirectRoutes = [
  {
    path: '/'
  }
]

export function dynamicRouterAdd(to, next) {
  if (!store.getters.menus || store.getters.menus.length === 0) {
    // 需要在vuex的menu写获取权限的方法
    const menuTree = store.state.menu.treeBySystem
      ? store.state.user.treeBySystem
      : []
    // const appRegx = /display_pc/gim
    // const currentApp = menuTree.filter(item => appRegx.test(item.url))[0]
    const dyRoutes = []
    if (menuTree.length === 0) {
      next()
      return
    }
    handleRouter(menuTree.children || [], dyRoutes)
    // 设置 默认路径重定向地址
    emptyRedirectRoutes[0].redirect = `${dyRoutes[0].path}/${dyRoutes[0].redirect}`
    // 合并路由表
    const routes = Object.values(dyRoutes)
      .concat(emptyRedirectRoutes)
      .concat(notFoundRoutes)

    // const inroutes = constantRoutes.concat(routes)
    resetRouter(routes)
    store.commit('menu/SET_MENUSTREEBYSYSTEM', routes)
    next({ ...to, replace: true })
  } else {
    next()
  }
}

function handleRouter(list, routes) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].state === 0) {
      let obj = {
        path: list[i].url,
        component: Layout,
        meta: {
          title: list[i].resourcesName,
          icon: list[i]['icon'] ? list[i]['icon'] : 'form'
        },
        children: []
      }
      if (list[i].children) {
        obj = changeChildTreeObj(list[i].children, obj)
        obj.redirect =
          obj.children.length > 0 ? obj.children[0].path : list[i].children.url
      } else {
        // 处理一级菜单，将路由信息作为自己的children，重定向到index
        const routesInfo = routerMap[list[i].url]
        routesInfo.meta = {
          title: list[i]['resourcesName'],
          icon: list[i]['icon'] ? list[i]['icon'] : 'form'
        }
        obj.children.push(routesInfo)
        obj.redirect = routesInfo.path
      }
      routes.push(obj)
    }
  }
}
function changeChildTreeObj(list, father) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].state === 0) {
      if (!routerMap[list[i].url]) continue
      const objTree = routerMap[list[i].url]
      objTree.meta = {
        title: list[i]['resourcesName'],
        icon: list[i]['icon'] ? list[i]['icon'] : 'form'
      }
      father.children.push(objTree)
      if (list[i].children && list[i].children.length > 0) {
        objTree.children = []
        changeChildTreeObj(list[i].children, objTree.children)
      }
    }
  }
  return father
}
