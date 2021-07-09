import request from '@/utils/request'

const baseUrl = process.env.NODE_ENV === 'development' ? '/tmp-api' : '/shm'

/**
 * 新增停课记录
 * @param {*} params
 */
export function addLessionStop(data) {
  return request({
    url: `${baseUrl}/schoolLessionStop/add`,
    method: 'POST',
    data
  })
}
/**
 * 删除停课记录
 * @param {*} params
 */
export function deleteLessionStop(data) {
  return request({
    url: `${baseUrl}/schoolLessionStop/delete/${data.id}`,
    method: 'DELETE'
  })
}
/**
 * 查询停课记录详情
 * @param {*} params
 */
export function queryLessionStopDetail(params) {
  return request({
    url: `${baseUrl}/schoolLessionStop/detail/${params.id}`,
    method: 'GET',
    params
  })
}
/**
 * 分页查询停课记录列表
 * @param {*} params
 */
export function queryLessionStopPage(params) {
  return request({
    url: `${baseUrl}/schoolLessionStop/pageList`,
    method: 'GET',
    params
  })
}

/**
 * 更新停课记录
 * @param {*} params
 */
export function updateLessionStop(data) {
  return request({
    url: `${baseUrl}/schoolLessionStop/update/${data.id}`,
    method: 'PUT',
    data
  })
}
