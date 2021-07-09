import request from '@/utils/request'

const baseUrl = process.env.NODE_ENV === 'development' ? '/tmp-api' : '/shm'

/**
 * 新增班级
 * @param {*} params
 */
export function addClass(data) {
  return request({
    url: `${baseUrl}/schoolClass/addBatch`,
    method: 'POST',
    data
  })
}

/**
 * 删除班级
 * @param {*} params
 */
export function deleteClass(id) {
  return request({
    url: `${baseUrl}/schoolClass/delete/${id}`,
    method: 'DELETE'
  })
}
/**
 * 查询班级详情
 * @param {*} params
 */
export function queryClassDetail(params) {
  return request({
    url: `${baseUrl}/schoolClass/detail/${params.id}`,
    method: 'GET',
    params
  })
}
/**
 * 分页查询班级管理列表
 * @param {*} params
 */

export function queryClassPage(params) {
  return request({
    url: `${baseUrl}/schoolClass/pageList`,
    method: 'GET',
    params
  })
}

/**
 * 更新班级
 * @param {*} params
 */
export function updateClass(data) {
  return request({
    url: `${baseUrl}/schoolClass/update/${data.id}`,
    method: 'PUT',
    data
  })
}
/**
 * 更新班级
 * @param {*} params
 */
export function upgrade(data) {
  return request({
    url: `${baseUrl}/schoolClass/upgrade/${data.id}`,
    method: 'PUT',
    data
  })
}

// 查询字典
// 查询年级所有的班级信息
export function queryAllClassByGradeCode(params) {
  return request({
    url: `${baseUrl}/queryAllClassByGradeCode/${params.gradeCode}`,
    method: 'GET'
  })
}

/**
 * 上传
 */

export function fileUpload(data, onUploadProgress) {
  return request({
    url: `${baseUrl}/schoolClass/fileUpload`,
    method: 'POST',
    data,
    onUploadProgress,
    header: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 下载模版
export function downloadClassTemplateExcel() {
  return `${baseUrl}/schoolClass/downloadClassTemplateExcel`
}
