import request from '@/utils/request'

const baseUrl = process.env.NODE_ENV === 'development' ? '/tmp-api' : '/shm'

/**
 * 新增休退学登记
 * @param {*} params
 */
export function addStudentQuit(data) {
  return request({
    url: `${baseUrl}/schoolStudentQuit/add`,
    method: 'POST',
    data
  })
}
/**
 * 删除休退学登记
 * @param {*} params
 */
export function deleteStudentQuit(data) {
  return request({
    url: `${baseUrl}/schoolStudentQuit/delete/${data.id}`,
    method: 'DELETE'
  })
}
/**
 * 查询休退学登记详情
 * @param {*} params
 */
export function queryStudentQuitDetail(params) {
  return request({
    url: `${baseUrl}/schoolStudentQuit/detail/${params.id}`,
    method: 'GET',
    params
  })
}
/**
 * 分页查询休退学登记列表
 * @param {*} params
 */
export function queryStudentQuitPage(params) {
  return request({
    url: `${baseUrl}/schoolStudentQuit/pageList`,
    method: 'GET',
    params
  })
}

/**
 * 更新休退学登记
 * @param {*} params
 */
export function updateStudentQuit(data) {
  return request({
    url: `${baseUrl}/schoolStudentQuit/update/${data.id}`,
    method: 'PUT',
    data
  })
}
