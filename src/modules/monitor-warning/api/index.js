import request from '@/utils/request'
const baseUrl = process.env.NODE_ENV === 'development' ? '/tmp-api' : '/shm'
import querystring from 'querystring'

/**
 * 获取列表数据
 * @param {*} data
 */
export function getAllData(data) {
  return request({
    url: `${baseUrl}/resource/data/getAllData`,
    method: 'POST',
    data
  })
}

/**
 * 获取详情数据
 * @param {*} data
 */
export function getDetailData(data) {
  return request({
    url: `${baseUrl}/resource/data/getDetailData`,
    method: 'POST',
    data
  })
}

/**
 * 添加
 * @param {*} data
 */
export function createData(data) {
  return request({
    url: `${baseUrl}/resource/data/createData`,
    method: 'POST',
    data
  })
}

/**
 * 修改
 * @param {*} data
 */
export function editData(data) {
  return request({
    url: `${baseUrl}/resource/data/editData`,
    method: 'POST',
    data
  })
}

/**
 * 删除
 * @param {*} data
 */
export function deleteData(data) {
  return request({
    url: `${baseUrl}/resource/data/deleteData`,
    method: 'POST',
    data
  })
}

/**
 * 病例个案信息
 * @param {*} data
 */
export function getAllCase(data) {
  return request({
    url: `${baseUrl}/resource/data/getAllCase`,
    method: 'POST',
    data
  })
}

/**
 * 任务信息
 * @param {*} data
 */
export function getAllTask(data) {
  return request({
    url: `${baseUrl}/resource/data/getAllTask`,
    method: 'POST',
    data
  })
}

/**
 * 任务参与人员
 * @param {*} data
 */
export function getAllStaff(data) {
  return request({
    url: `${baseUrl}/resource/data/getAllStaff`,
    method: 'POST',
    data
  })
}

/**
 * 行动轨迹
 * @param {*} data
 */
export function getAllTrack(data) {
  return request({
    url: `${baseUrl}/resource/data/getAllTrack`,
    method: 'POST',
    data
  })
}

/**
 * 分页检索规则列表
 * @param {*} data
 */
export function getRuleList(data) {
  return request({
    url: `${baseUrl}/rule/queryRulePage`,
    method: 'POST',
    data
  })
}

/**
 * 根据 id 查询规则信息
 * @param {*} data
 */
export function getRuleDetail(data) {
  return request({
    url: `${baseUrl}/rule/queryRuleById`,
    method: 'POST',
    data
  })
}

/**
 * 新增或者编辑规则
 * @param {*} data
 */
export function saveOrUpdateRule(data) {
  return request({
    url: `${baseUrl}/rule/saveOrUpdateRule`,
    method: 'POST',
    data
  })
}

/**
 * 删除规则
 * @param {*} data
 */
export function deleteRule(data) {
  return request({
    url: `${baseUrl}/rule/removeRuleByIds`,
    method: 'POST',
    data
  })
}

/**
 * 预警类型下拉列表
 */
export function getWarnTypeList() {
  return request({
    url: `${baseUrl}/warn/warningRule/queryWarnTypeList`,
    method: 'POST'
  })
}

/**
 * 获取检验下拉列表
 */
export function getExamList() {
  return request({
    url: `${baseUrl}/warn/warningRule/qeuryExam`,
    method: 'POST'
  })
}

/**
 * 获取体征下拉列表
 */
export function getBodySignList() {
  return request({
    url: `${baseUrl}/warn/warningRule/queryBodySignList`,
    method: 'POST'
  })
}

/**
 * 获取症状下拉列表
 */
export function getStateList() {
  return request({
    url: `${baseUrl}/warn/warningRule/queryStateList`,
    method: 'POST'
  })
}

/**
 * 查询传染病字典树
 */
export function getInfectiousTypeInfo() {
  return request({
    url: `${baseUrl}/warn/warningRule/queryInfectiousTypeInfo`,
    method: 'POST'
  })
}

/**
 * 查询症候群字典树
 */
export function getSyndromeTypeInfo() {
  return request({
    url: `${baseUrl}/warn/warningRule/querySyndromeTypeInfo`,
    method: 'POST'
  })
}

/**
 * 查询指标字典树
 */
export function getKpiDictTree() {
  return request({
    url: `${baseUrl}/warn/warningRule/queryKpiDictTree`,
    method: 'POST'
  })
}

/**
 * 查询监控范围字典树
 */
export function getMonitorRangeInfo() {
  return request({
    url: `${baseUrl}/warn/warningRule/queryMonitorRangeInfo`,
    method: 'POST'
  })
}

/**
 * 获取监测指标-指标类型下拉列表
 */
export function getParentTypeList() {
  return request({
    url: `${baseUrl}/warn/warningRule/queryParentTypeList`,
    method: 'POST'
  })
}

/**
 * 预警结果审核
 */
export function requestExamine(params, data) {
  return request({
    url: `${baseUrl}/warn/warningResult/examine?${querystring.stringify(
      params
    )}`,
    method: 'POST',
    data
  })
}

/**
 * 根据id查询预警结果信息
 */
export function getWarningResultById(params) {
  return request({
    url: `${baseUrl}/warn/warningResult/queryById`,
    method: 'GET',
    params
  })
}

/**
 * 根据id查询预警相关的个案信息
 */
export function getCaseInfoList(data) {
  return request({
    url: `${baseUrl}/warn/warningResult/queryCaseInfoList`,
    method: 'POST',
    data
  })
}

/**
 * 查询预警操作纪录
 */
export function getLogsById(params) {
  return request({
    url: `${baseUrl}/bizLog/queryLogsById`,
    method: 'GET',
    params
  })
}

/**
 * 根据id查询预警相关的任务信息
 */
export function getTaskInfoList(params) {
  return request({
    url: `${baseUrl}/warn/warningResult/queryTaskInfoList`,
    method: 'GET',
    params
  })
}

/**
 * 预警列表分页检索
 */
export function getWarningResultList(data) {
  return request({
    url: `${baseUrl}/warn/warningResult/queryWarningResultPageList`,
    method: 'POST',
    data
  })
}

/**
 * 发布/下架任务
 */
export function updateWarningResult(data) {
  return request({
    url: `${baseUrl}/warn/warningResult/queryWarningResultPageList`,
    method: 'POST',
    data
  })
}

/**
 * 根据个案id查询所有个案信息
 * @param {*} params
 */
export function getCaseAllInfo(params) {
  return request({
    url: `${baseUrl}/warn/warningIndividualCase/queryAllInfoById`,
    method: 'GET',
    params
  })
}

/**
 * 个案信息根据id查询
 * @param {*} params
 */
export function getCaseBasicInfo(params) {
  return request({
    url: `${baseUrl}/warn/warningIndividualCase/queryById`,
    method: 'GET',
    params
  })
}

/**
 * 根据id查询个案诊疗信息
 * @param {*} params
 */
export function getCaseMedicalRecord(params) {
  return request({
    url: `${baseUrl}/warn/warningIndividualCase/queryDiagnosisById`,
    method: 'GET',
    params
  })
}

/**
 * 根据不同模块的业务id查询个案列表
 * @param {*} data
 */
export function c(data) {
  return request({
    url: `${baseUrl}/warn/warningIndividualCase/queryListByBizId`,
    method: 'POST',
    data
  })
}

/**
 * 个案信息分页查询
 * @param {*} data
 */
export function d(data) {
  return request({
    url: `${baseUrl}/warn/warningIndividualCase/queryPageByParams`,
    method: 'POST',
    data
  })
}

/**
 * 根据id查询个案行动轨迹
 * @param {*} params
 */
export function getCaseTrack(params) {
  return request({
    url: `${baseUrl}/warn/warningIndividualCase/queryTravelById`,
    method: 'GET',
    params
  })
}

/**
 * 个案信息批量删除
 * @param {*} data
 */
export function f(data) {
  return request({
    url: `${baseUrl}/warn/warningIndividualCase/removeByIds`,
    method: 'POST',
    data
  })
}

/**
 * 保存个案信息
 * @param {*} data
 */
export function saveCaseInvestigation(data) {
  return request({
    url: `${baseUrl}/warn/warningIndividualCase/saveIndiCase`,
    method: 'POST',
    data
  })
}

/**
 * 编辑个案信息
 * @param {*} data
 */
export function editCaseInvestigation(data) {
  return request({
    url: `${baseUrl}/warn/warningIndividualCase/editIndiCase`,
    method: 'POST',
    data
  })
}

/**
 * 任务成员
 * @param {*} params
 */
export function getTaskInfoById(params) {
  return request({
    url: `${baseUrl}/warn/warningTask/queryById`,
    method: 'GET',
    params
  })
}

/**
 * 根据id查询任务信息
 * @param {*} params
 */
export function getMemberInfoById(params) {
  return request({
    url: `${baseUrl}/warn/warningTask/queryMembersById`,
    method: 'GET',
    params
  })
}

/**
 * 获取事件场所字典树
 * @param {*} params
 */
export function queryEventPlaceTree(params) {
  return request({
    url: `${baseUrl}/warn/warningEventReport/queryEventPlaceTree`,
    method: 'GET',
    params
  })
}

/**
 * 获取事件场所字典树
 * @param {*} data
 */
export function releaseTask(data) {
  return request({
    url: `${baseUrl}/warn/warningResult/releaseTask`,
    method: 'POST',
    data
  })
}

/**
 * 根据不同业务类型获取成员树
 * @param {*} data
 * @returns
 */
export function queryMemTree(data) {
  return request({
    url: `${baseUrl}/global/queryMemTree`,
    method: 'POST',
    data
  })
}

/**
 * 查询任务反馈内容
 * @param {*} data
 * @returns
 */
export function queryFeedback(data) {
  return request({
    url: `${baseUrl}/warn/warningResult/queryFeedback`,
    method: 'POST',
    data
  })
}

/**
 * 查询事件列表
 * @param {*} data
 * @returns
 */
export function queryHomePageEvent(data) {
  return request({
    url: `${baseUrl}/homePage/queryHomePageEvent`,
    method: 'POST',
    data
  })
}

/**
 * 审核预警信息
 * @param {*} data
 * @returns
 */
export function examineTrace(data) {
  return request({
    url: `${baseUrl}/rule/examineTrace`,
    method: 'POST',
    data
  })
}

/**
 * 预警信息生成(后台自测用)
 * @param {*} data
 * @returns
 */
// export function genAlertTrace(data) {
//   return request({
//     url: `${baseUrl}/rule/genAlertTrace`,
//     method: 'POST',
//     data
//   })
// }

/**
 * 分页检索预警信息
 * @param {*} data
 * @returns
 */
export function queryTracePage(data) {
  return request({
    url: `${baseUrl}/rule/queryTracePage`,
    method: 'POST',
    data
  })
}

/**
 * 根据 id 查询追踪信息
 * @param {*} data
 * @returns
 */
export function queryTraceById(data) {
  return request({
    url: `${baseUrl}/rule/queryTraceById`,
    method: 'POST',
    data
  })
}

/**
 * 根据 id 查询相关个案
 * @param {*} data
 * @returns
 */
export function queryTraceCasesByTraceId(data) {
  return request({
    url: `${baseUrl}/rule/queryTraceCasesByTraceId`,
    method: 'POST',
    data
  })
}

/**
 * 监测信息上报==详情
 * @param {*} params
 * @returns
 */
export function queryMonitorDetail(params) {
  return request({
    url: `${baseUrl}/monitor/detail/${params.id}`,
    method: 'GET'
  })
}

/**
 * 监测信息上报==编辑
 * @param {*} data
 * @returns
 */
export function queryMonitorUpdate(data) {
  return request({
    url: `${baseUrl}/monitor/update`,
    method: 'POST',
    data
  })
}
