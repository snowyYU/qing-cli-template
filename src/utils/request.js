import axios from 'axios'
import { Message } from 'element-ui'

import portal from '@/utils/gateway'

const baseURL = process.env.VUE_APP_BASE_API

// create an axios instance
const service = axios.create({
  // baseURL: `${process.env.VUE_APP_BASE_API}`, // url = base url + request url
  // baseURL: process.env.NODE_ENV === 'development' ? '' : '',
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 100000 // request timeout
})

const authList = [
  '/sso/auth/anatomyToken',
  '/sso/auth/checkToken',
  '/smc/user/queryUserIdentityInfo',
  '/sso/auth/logout',
  '/smc/door/queryResourcesTreeBySystem',
  '/emergency/resource/member/queryLoginInfo'
]

// 白名单里的接口不会走判断 200 的逻辑，会直接将数据返回

const whiteList = [
  '/appendix/downloadResponseById',
  '/schoolClass/fileUpload',
  '/schoolStudent/fileUpload'
]

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (
      authList.includes(config.url) ||
      process.env.NODE_ENV !== 'development'
    ) {
      config.url = baseURL + config.url
    }

    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data || {}
    // 需要登出的状态码
    const logoutStatus = ['2100', '2101', '2102']
    // 未登录
    if (logoutStatus.includes(res.code)) {
      // 跳转到权限系统
      alert(res.msg)
      portal.goLogin()
    }
    if (res.code === '403') {
      // 没有权限
      Message.error('抱歉，你没有权限访问本系统')
      setTimeout(() => {
        portal.logout()
      }, 2000)
    }
    if (res.code === '0') {
      // 其他权限异常
      if (
        response.data.msg.indexOf('失效') > -1 ||
        response.data.msg.indexOf('无效') > -1 ||
        response.data.msg.indexOf('过期') > -1
      ) {
        portal.logout()
      } else {
        Message.error(response.data.msg)
      }
    }

    const matchResult = whiteList.find(item => {
      return response.config.url.includes(item)
    })
    if (matchResult) {
      return res
    }
    if (res.code !== '200') {
      Message({
        type: 'error',
        message: res.msg
      })
      return Promise.reject(res)
    } else {
      return res
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 10 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
