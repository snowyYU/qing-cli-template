import request from '@/utils/request'

const baseUrl = process.env.NODE_ENV === 'development' ? '/tmp-api' : '/shm'

/**
 * 根据年级获取所有班级信息
 * @param {*} params
 */
export function queryAllClassByCondition(params) {
  return request({
    url: `${baseUrl}/schoolClass/queryAllClassByCondition`,
    method: 'GET',
    params
  })
}

/**
 * 根据病例id获取病例详情
 * @param {*} params
 */
export function getRepoDetailByRepoId(params) {
  return request({
    url: `${baseUrl}/monitor/detail/${params.id}`,
    method: 'GET'
  })
}

/**
 * 按类型编辑上报信息
 * @type 【1】修改 【2】续报 【3】确认 【4】审核 【5】结束
 * @param {*} data
 */
export function updateByType(data) {
  return request({
    url: `${baseUrl}/monitor/updateByType`,
    method: 'POST',
    data
  })
}

// 根据当前用户查询所有的区县选项
export function queryAreaList() {
  return request({
    url: `${baseUrl}/global/queryAreaList`,
    method: 'GET'
  })
}

// 获取当前用户可看的所有学校
export function querySchoolList(params) {
  return request({
    url: `${baseUrl}/global/querySchoolList`,
    method: 'POST',
    params
  })
}
