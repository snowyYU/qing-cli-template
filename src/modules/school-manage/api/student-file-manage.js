import request from '@/utils/request'

const baseUrl = process.env.NODE_ENV === 'development' ? '/tmp-api' : '/shm'

/**
 * 新增学生档案
 * @param {*} params
 */
export function addStudent(data) {
  return request({
    url: `${baseUrl}/schoolStudent/addBatch`,
    method: 'POST',
    data
  })
}
/**
 * 删除学生档案
 * @param {*} params
 */
export function deleteStudent(data) {
  return request({
    url: `${baseUrl}/schoolStudent/delete/${data.id}`,
    method: 'DELETE'
  })
}
/**
 * 查询学生档案详情
 * @param {*} params
 */
export function queryStudentDetail(params) {
  return request({
    url: `${baseUrl}/schoolStudent/detail/${params.id}`,
    method: 'GET',
    params
  })
}
/**
 * 分页查询学生档案管理列表
 * @param {*} params
 */
export function queryStudentPage(params) {
  return request({
    url: `${baseUrl}/schoolStudent/pageList`,
    method: 'GET',
    params
  })
}
/**
 * 根据年级查询所有班级信息
 * @param {*} params
 */
export function queryAllClassByGradeId(params) {
  return request({
    url: `${baseUrl}/schoolClass/queryAllClassByCondition`,
    method: 'GET',
    params
  })
}

/**
 * 更新学生档案
 * @param {*} params
 */
export function updateStudent(data) {
  return request({
    url: `${baseUrl}/schoolStudent/update/${data.id}`,
    method: 'PUT',
    data
  })
}
/**
 * 更新学生档案
 * @param {*} params
 */
export function transferClass(data) {
  return request({
    url: `${baseUrl}/schoolStudent/transferClass/${data.id}`,
    method: 'PUT',
    data
  })
}

/**
 * 上传
 */

export function fileUpload(data, onUploadProgress) {
  return request({
    url: `${baseUrl}/schoolStudent/fileUpload`,
    method: 'POST',
    data,
    onUploadProgress,
    header: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 下载模版
export function downloadTemplateExcel() {
  return `${baseUrl}/schoolStudent/downloadStudentTemplateExcel`
}
