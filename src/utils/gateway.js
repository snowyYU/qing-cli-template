import server from '@/utils/request'

const portal = {
  goLogin() {
    // 返回单点登陆
    if (process.env.NODE_ENV === 'development') {
      // 如果是本地开发
      // 区卫的登录地址
      // window.location.href = `http://healthdev.com:19000/login/#/login?callbackUrl=${window.location.href}`
      // 公卫的登录地址ph_login
      window.location.href = `http://healthdev.com:19000/ph_login/#/login?callbackUrl=${window.location.href}`
    } else {
      // 如果是线上环境
      // window.location.href = `${getSchemeHostPortByURL}/login/#/login?callbackUrl=${window.location.href}`
      // 区卫的登录地址
      //  window.location.href = `/login/#/login?callbackUrl=${window.location.href}`
      //公卫的登录地址
      window.location.href = `/ph_login/#/login?callbackUrl=${window.location.href}`
    }
  },
  goLoginWithoutCallback() {
    // 返回单点登陆
    if (process.env.NODE_ENV === 'development') {
      // 如果是本地开发
      //区卫的登录地址
      // window.location.href = `http://healthdev.com:19000/login`
      //公卫的登录地址ph_login
      window.location.href = `http://healthdev.com:19000/ph_login`
    } else {
      // 如果是线上环境
      // window.location.href = `${getSchemeHostPortByURL}/login/#/login?callbackUrl=${window.location.href}`
      //区卫的登录地址
      // window.location.href = `/login`
      //公卫的登录地址ph_login
      window.location.href = `/ph_login`
    }
  },
  logout(needCallBack) {
    // 退出登陆
    server.post(`/sso/auth/logout`).then(res => {
      if (res.code === '200') {
        setTimeout(() => {
          if (needCallBack) {
            portal.goLogin()
          } else {
            portal.goLoginWithoutCallback()
          }
        }, 1500)
      }
    })
  }
}

export default portal
