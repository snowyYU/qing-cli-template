import request from '@/utils/request'

export function validateToken(data) {
  return request({
    url: '/sso/auth/checkToken',
    method: 'get',
    data
  })
}
export function queryUserIdentityInfo(data) {
  return request({
    url: '/smc/user/queryUserIdentityInfo',
    method: 'get',
    data
  })
}
export function getAccountInfo(data) {
  return request({
    url: '/emergency/resource/member/queryLoginInfo',
    method: 'get',
    data
  })
}
