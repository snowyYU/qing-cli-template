import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import portal from '@/utils/gateway'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = [''] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  // 获取当前cookie 中的token字段
  const token = getToken()
  if (token) {
    await store.dispatch('user/updateUserInfo', {})
    if (store.getters.permission_routes.length) {
      next()
    } else {
      const routes = await store.dispatch('user/getDoorResourcesTreeBySystem')

      // *******************设置应用启动后需要更新的 vuex start
      
      // *******************设置应用启动后需要更新的 vuex end

      const accessRoutes = await store.dispatch(
        'permission/generateRoutes',
        routes
      )

      // replace old route map
      // toDo 这个部分的代码有问题
      router.options.routes.splice(0, router.options.routes.length)
      accessRoutes.forEach(item => {
        router.options.routes.push(item)
      })

      router.addRoutes(accessRoutes)

      // todo 优化更新路由的方法

      next({
        ...to,
        replace: true
      })
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      portal.goLogin()
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
