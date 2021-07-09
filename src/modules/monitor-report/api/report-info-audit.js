import request from '@/utils/request'

const baseUrl = process.env.NODE_ENV === 'development' ? '/tmp-api' : '/shm'

/**
 * 获取监测信息审核列表
 * @param {*} data
 */
export function examineRepoPage(data) {
  return request({
    url: `${baseUrl}/monitor/examineRepoPage`,
    method: 'POST',
    data
  })
}

/**
 * 上报信息审核
 * @param {*} data
 */
export function auditRepo(data) {
  return request({
    url: `${baseUrl}/monitor/examine`,
    method: 'POST',
    data
  })
}

/**
 * 上报信息批量审核
 * @param {*} data
 */
export function auditAllRepo(data) {
  return request({
    url: `${baseUrl}/monitor/examineAll`,
    method: 'POST',
    data
  })
}
