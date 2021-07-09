import request from '@/utils/request'

const baseUrl = process.env.NODE_ENV === 'development' ? '/tmp-api' : '/shm'

/**
 * 新增死亡登记
 * @param {*} params
 */
export function addStudentDead(data) {
  return request({
    url: `${baseUrl}/schoolStudentDead/add`,
    method: 'POST',
    data
  })
}
/**
 * 删除死亡登记
 * @param {*} params
 */
export function deleteStudentDead(data) {
  return request({
    url: `${baseUrl}/schoolStudentDead/delete/${data.id}`,
    method: 'DELETE'
  })
}
/**
 * 查询死亡登记详情
 * @param {*} params
 */
export function queryStudentDeadDetail(params) {
  return request({
    url: `${baseUrl}/schoolStudentDead/detail/${params.id}`,
    method: 'GET',
    params
  })
}
/**
 * 分页查询死亡登记列表
 * @param {*} params
 */
export function queryStudentDeadPage(params) {
  return request({
    url: `${baseUrl}/schoolStudentDead/pageList`,
    method: 'GET',
    params
  })
}

/**
 * 更新死亡登记
 * @param {*} params
 */
export function updateStudentDead(data) {
  return request({
    url: `${baseUrl}/schoolStudentDead/update/${data.id}`,
    method: 'PUT',
    data
  })
}
