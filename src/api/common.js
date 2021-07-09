import request from '@/utils/request'

const baseUrl = '/smc'

const baseUrl2 = process.env.NODE_ENV === 'development' ? '/tmp-api' : '/shm'

/**
 * 获取区域信息
 * @param data
 * @returns {AxiosPromise}
 */
export function getProvinceList(data) {
  return request({
    url: `${baseUrl}/region/getProvinceList`,
    method: 'post',
    data
  })
}
/**
 * 上传图片
 * @param data
 * @returns {URL}
 */
export function uploadImg(data) {
  return request({
    url: `${baseUrl}/fastdfs/upload`,
    method: 'post',
    data
  })
}

/**
 * 获取指定用户选择身份下的门户应用信息
 * @param data
 * @returns {AxiosPromise}
 */
export function getDoorResourcesList() {
  return request({
    url: `${baseUrl}/api/queryDoorList`,
    method: 'GET'
  })
}
/**
 * 获取指定应用下的菜单信息
 * @param data
 * @returns {AxiosPromise}
 */
export function getDoorResourcesTreeBySystem(data) {
  return request({
    url: `${baseUrl}/door/queryResourcesTreeBySystem`,
    method: 'post',
    data
  })
}
/**
 * 根据分类查询所有字典信息
 * use (机构管理-卫生机构)
 * use (机构管理-联防联控机构)
 * use (人员管理-人员新增添加)
 * use (区域管理-地理信息)
 * @param data
 * @returns {AxiosPromise}
 */
export function queryDictInfoByCategory(params) {
  return request({
    url: `${baseUrl2}/dict/queryDictInfoByKey`,
    method: 'GET',
    params
  })
}
/**
 * 根据身份证获取出生日期和性别
 * use (人员管理-人员新增添加)
 * @param data
 * @returns {AxiosPromise}
 */
export function idNumberInfo(params) {
  return request({
    url: `${baseUrl2}/global/idNumberInfo`,
    method: 'GET',
    params
  })
}

/**
 * 获取省市区
 * use
 * @param data
 * @returns {AxiosPromise}
 */
export function getRegion(params) {
  return request({
    url: `${baseUrl2}/sysRegion/queryChildByParent`,
    method: 'GET',
    params
  })
}

/**
 * 文件上传
 * use (知识库-应急预案库)
 * @param data
 * @returns {AxiosPromise}
 */
export function uploadFile(data, onUploadProgress) {
  return request({
    url: `${baseUrl2}/appendix/uploadAppendix`,
    method: 'POST',
    data,
    onUploadProgress,
    header: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 文件删除
 * use (知识库-应急预案库)
 * @param data
 * @returns {AxiosPromise}
 */
export function deleteFile(data) {
  return request({
    url: `${baseUrl2}/appendix/removeAppendix`,
    method: 'DELETE',
    data
  })
}

/**
 * 获取成员基本信息--不存在则为空(涉及逻辑处理时使用)
 * use(事后评估-经济评估)
 * use(事件处置-会商决策)
 * @param {*} data
 */
export function getAccountInfo(data) {
  return request({
    url: `${baseUrl2}/resource/member/queryLoginInfo`,
    method: 'GET',
    data
  })
}

/**
 * 获取成员基本信息--不存在则抛异常提示(仅做提示)
 * @param {*} data
 */
export function getAccountInfoWithTips(data) {
  return request({
    url: `${baseUrl2}/resource/member/queryLoginInfoEx`,
    method: 'GET',
    data
  })
}

/**
 * 针对某个业务添加附件
 * @param {*} data
 */
export function addBizAppendixs(data) {
  return request({
    url: `${baseUrl2}/appendix/addBizAppendixs`,
    method: 'POST',
    data
  })
}

/**
 * 针对某个业务删除附件
 * @param {*} data
 */
export function removeAppendixs(data) {
  return request({
    url: `${baseUrl2}/appendix/removeAppendixs`,
    method: 'POST',
    data
  })
}
/**
 * 根据id下载文档(HttpServletResponse)
 * @param {*} params
 */
export function downloadResponseById(params) {
  return request({
    url: `${baseUrl2}/appendix/downloadResponseById`,
    method: 'GET',
    responseType: 'blob',
    params
  })
  // let url = `${baseUrl2}/appendix/downloadResponseById?id=${id}`
  // if (process.env.NODE_ENV === 'test') {
  //   url = process.env.VUE_APP_BASE_API + url
  // }
  // return url
}

//学年 querySchoolYearDictInfo

export function querySchoolYearDictInfo() {
  return request({
    url: `${baseUrl2}/dict/querySchoolYearDictInfo`,
    method: 'GET'
  })
}
//年级 queryGradeDictByGroup
export function queryGradeDictByGroup(params) {
  return request({
    url: `${baseUrl2}/dict/queryGradeDictByGroup`,
    method: 'GET',
    params
  })
}
//老师 queryCurSchoolTeachers
export function queryCurSchoolTeachers() {
  return request({
    url: `${baseUrl2}/schoolClass/queryCurSchoolTeachers`,
    method: 'GET'
  })
}
// 获取当前学年
export function queryCurSchoolYear() {
  return request({
    url: `${baseUrl2}/schoolClass/queryCurSchoolYear`,
    method: 'GET'
  })
}
// 获取当前用户所在的机构类型，groupCode
export function getSchoolType() {
  return request({
    url: `${baseUrl2}/sysRegion/getSchoolType`,
    method: 'GET'
  })
}
// 获取所有字典
export function queryAllDictInfo() {
  return request({
    url: `${baseUrl2}/dict/queryAllDictInfos`,
    method: 'GET'
  })
}
// 获取当前用户角色
export function getRoleType() {
  return request({
    url: `${baseUrl2}/global/getRoleType`,
    method: 'GET'
  })
}
// 获取当前用户机构信息
export function getOrgInfo() {
  return request({
    url: `${baseUrl2}/global/getCurrentUserOrgInfo`,
    method: 'GET'
  })
}

/**
 * 获取当前用户可看的所有学校
 * @param {*} data
 */
export function querySchoolList(params) {
  return request({
    url: `${baseUrl2}/global/querySchoolList`,
    method: 'POST',
    params
  })
}
// 根据当前用户查询所有的区县选项
export function queryAreaList() {
  return request({
    url: `${baseUrl2}/global/queryAreaList`,
    method: 'GET'
  })
}
// 校验身份证，&& 解析
export function parseIdCardInfo(params) {
  return request({
    url: `${baseUrl2}/global/parseIdCardInfo`,
    method: 'GET',
    params
  })
}
