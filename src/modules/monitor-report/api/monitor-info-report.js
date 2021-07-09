import request from '@/utils/request'

const baseUrl = process.env.NODE_ENV === 'development' ? '/tmp-api' : '/shm'

/**
 * 获取监测信息上报列表
 * @param {*} data
 */
export function monitorRepoPage(data) {
  return request({
    url: `${baseUrl}/monitor/page`,
    method: 'POST',
    data
    // headers: { Identity: '1402187734407319552' }
  })
}

/**
 * 获取当前角色下学生列表
 * @param {*} params
 */
export function schoolStudentPageList(params) {
  return request({
    url: `${baseUrl}/schoolStudent/pageList`,
    method: 'GET',
    params
  })
}

/**
 * 根据学生id获取病例详情
 * @param {*} params
 */
export function getRepoDetailByStuId(params) {
  return request({
    url: `${baseUrl}/monitor/stuDetail/${params.id}`,
    method: 'GET'
  })
}

/**
 * 新建病例
 * @param {*} data
 */
export function addRepo(data) {
  return request({
    url: `${baseUrl}/monitor/add`,
    method: 'POST',
    data
  })
}

/**
 * 续报病例
 * @param {*} data
 */
export function continueRepo(data) {
  return request({
    url: `${baseUrl}/monitor/continueRepo`,
    method: 'POST',
    data
  })
}

/**
 * 结束病例
 * @param {*} data
 */
export function endRepo(data) {
  return request({
    url: `${baseUrl}/monitor/endRepo`,
    method: 'POST',
    data
  })
}

/**
 * 编辑病例
 * @param {*} data
 */
export function updateRepo(data) {
  return request({
    url: `${baseUrl}/monitor/update`,
    method: 'POST',
    data
  })
}

/**
 * 删除病例
 * @param {*} params
 */
export function deleteRepo(params) {
  return request({
    url: `${baseUrl}/monitor/del/${params.id}`,
    method: 'DELETE'
  })
}

/**
 * 获取当前学年
 * @param {*} params
 */
export function queryCurSchoolYear() {
  return request({
    url: `${baseUrl}/schoolClass/queryCurSchoolYear`,
    method: 'GET'
  })
}
