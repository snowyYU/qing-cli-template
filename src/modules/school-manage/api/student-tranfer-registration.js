import request from '@/utils/request'

const baseUrl = process.env.NODE_ENV === 'development' ? '/tmp-api' : '/shm'

/**
 * 新增学生转学登记
 * @param {*} params
 */
export function addStudentTran(data) {
  return request({
    url: `${baseUrl}/schoolStudentTran/add`,
    method: 'POST',
    data
  })
}
/**
 * 删除学生转学登记
 * @param {*} params
 */
export function deleteStudentTran(data) {
  return request({
    url: `${baseUrl}/schoolStudentTran/delete/${data.id}`,
    method: 'DELETE'
  })
}
/**
 * 查询学生转学登记详情
 * @param {*} params
 */
export function queryStudentTranDetail(params) {
  return request({
    url: `${baseUrl}/schoolStudentTran/detail/${params.id}`,
    method: 'GET',
    params
  })
}
/**
 * 分页查询学生转学登记列表
 * @param {*} params
 */
export function queryStudentTranPage(params) {
  return request({
    url: `${baseUrl}/schoolStudentTran/pageList`,
    method: 'GET',
    params
  })
}

/**
 * 更新学生转学登记
 * @param {*} params
 */
export function updateStudentTran(data) {
  return request({
    url: `${baseUrl}/schoolStudentTran/update/${data.id}`,
    method: 'PUT',
    data
  })
}
