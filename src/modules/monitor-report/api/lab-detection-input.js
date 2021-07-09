import request from '@/utils/request'

const baseUrl = process.env.NODE_ENV === 'development' ? '/tmp-api' : '/shm'

/**
 * 根据实验室监测信息列表
 * @param {*} data
 */
export function labDetectionPage(data) {
  return request({
    url: `${baseUrl}/labMonitor/page`,
    method: 'POST',
    data
  })
}

/**
 * 实验室监测信息录入
 * @param {*} data
 */
export function inputRepo(data) {
  return request({
    url: `${baseUrl}/labMonitor/add`,
    method: 'POST',
    data
  })
}
