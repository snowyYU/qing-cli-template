import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param paths
 * @param route
 */
function hasPermission(pathsFromApi, route) {
  return pathsFromApi.find(item => {
    if (item.url.indexOf('link:') > -1) {
      return (
        route.path ===
        window.location.origin +
          window.location.pathname +
          '#' +
          item.url.split(':')[1]
      )
    } else {
      return item.url === route.path
    }
  })
}

/**
 * Filter asynchronous routing tables by recursion
 * @param asyncRoutes asyncRoutes
 * @param paths  api返回的路由对象中的url组成的数组
 */
export function filterAsyncRoutes(asyncRoutes, pathsFromApi) {
  const res = []

  asyncRoutes.forEach(route => {
    // const tmp = { ...route }
    const matchApiItem = hasPermission(pathsFromApi, route)
    if (matchApiItem) {
      if (route.children) {
        route.children = filterAsyncRoutes(route.children, pathsFromApi)
      }
      res.push({
        ...route,
        resourceName: matchApiItem.resourcesName,
        icon: matchApiItem.httpUrl + matchApiItem.iccon,
        resourcesCode: matchApiItem.resourcesCode
      })
    }
  })

  return res
}

function modifyRedirect(routeModule) {
  if (routeModule.children && routeModule.children[0]) {
    routeModule.redirect = routeModule.children[0].path
    routeModule.children.forEach(item => {
      modifyRedirect(item)
    })
  }
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, paths) {
    const pathsFromApi = paths.filter(item => item.url)
    // 获取后端返回的第一个地址，用以匹配 / 的情况
    let redirectUrl = pathsFromApi[0].url
    constantRoutes.push({
      path: '/',
      redirect: redirectUrl
    })
    // 修改整个生成的路由的 redirect
    const finallyRoutes = filterAsyncRoutes(asyncRoutes, pathsFromApi)
    finallyRoutes.forEach(subModule => {
      // 先修改各子模块的一级路由
      modifyRedirect(subModule)
    })
    return new Promise(resolve => {
      let accessedRoutes = [...constantRoutes, ...finallyRoutes]
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
