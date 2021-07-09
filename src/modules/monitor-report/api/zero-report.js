import request from '@/utils/request'

const baseUrl = process.env.NODE_ENV === 'development' ? '/tmp-api' : '/shm'

/**
 * 获取零上报列表
 * @param {*} data
 */
export function zeroRepoPage(data) {
  return request({
    url: `${baseUrl}/zeroMonitor/zeroRepoPage`,
    method: 'POST',
    data
  })
}

/**
 * 新增零上报
 * @param {*} data
 */
export function saveZeroRepo(data) {
  return request({
    url: `${baseUrl}/zeroMonitor/saveZeroRepo`,
    method: 'POST',
    data
  })
}

/**
 * 删除零上报
 * @param {*} params
 */
export function deleteZeroRepo(params) {
  return request({
    url: `${baseUrl}/zeroMonitor/delZeroRepo/${params.id}`,
    method: 'DELETE'
  })
}
