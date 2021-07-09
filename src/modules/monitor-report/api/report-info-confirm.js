import request from '@/utils/request'

const baseUrl = process.env.NODE_ENV === 'development' ? '/tmp-api' : '/shm'

/**
 * 获取监测信息确认列表
 * @param {*} data
 */
export function confirmRepoPage(data) {
  return request({
    url: `${baseUrl}/monitor/confirmRepoPage`,
    method: 'POST',
    data
  })
}

/**
 * 上报信息确认
 * @param {*} data
 */
export function confirmRepo(data) {
  return request({
    url: `${baseUrl}/monitor/confirm`,
    method: 'POST',
    data
  })
}
