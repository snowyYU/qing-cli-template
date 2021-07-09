const state = {
  moduleType: '', //publicHealthEvent  emergencyRescue
  eventId: sessionStorage.getItem('eventId')
    ? sessionStorage.getItem('eventId')
    : '', // 事件id
  disposeManageStatus: 'list', // list   tabs 两种状态
  eventDisposeStatus: 'detail', // detail  edit 两种状态
  baseInfo: {} // 基本信息
}

const mutations = {
  SET_MODULETYPE(state, type) {
    sessionStorage.setItem('moduleType', type)
    state.moduleType = type
  },
  SET_EVENTID(state, id) {
    sessionStorage.setItem('eventId', id)
    state.eventId = id
  },
  SET_BASEINFO(state, baseInfo) {
    sessionStorage.setItem('baseInfo', baseInfo)
    state.baseInfo = baseInfo
  },
  SET_DISPOSEMANAGESTATUS(state, status) {
    state.disposeManageStatus = status
  },
  SET_EVENTDISPOSESTATUS(state, status) {
    state.eventDisposeStatus = status
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions: {}
}
