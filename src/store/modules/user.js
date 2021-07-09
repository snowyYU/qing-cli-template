import { queryUserIdentityInfo, getAccountInfo } from '@/api/user'
import { getParamByURL } from '@/utils/index'
import { getToken } from '@/utils/auth'
import portal from '@/utils/gateway'
import request from '@/utils/request'
import {
  getDoorResourcesTreeBySystem,
  querySchoolYearDictInfo,
  queryGradeDictByGroup,
  queryCurSchoolTeachers,
  queryAllDictInfo,
  getSchoolType,
  queryCurSchoolYear,
  getRoleType,
  getOrgInfo,
  querySchoolList,
  queryAreaList
} from '@/api/common'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    username: '', // 登陆账号
    identityList: [], // 身份信息列表
    selectedIdentity: {
      // 当前选中的身份信息列表
      value: '',
      label: '',
      code: ''
    },
    permissionRouters: [],
    accountInfo: {}, // 当前账户基本信息，用户名等
    schoolYearList: [], // 获取学年列表
    schoolGradeList: [], // 获取年级列表
    schoolTeacherList: [], // 获取所有老师
    dict: {}, // 获取所有字典
    curSchoolYear: '', // 获取当前学年
    curUserRole: '', // 获取当前用户角色
    curUserOrg: {}, // 获取当前用户机构信息
    curUserSchoolList: [], // 获取当前用户学校列表
    curAreaList: [] // 获取当前用户地区列表
  }
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_IDENTITYLIST: (state, identityList) => {
    state.identityList = identityList
  },
  SET_SELECTEDIDENTITY: (state, selectedIdentity) => {
    state.selectedIdentity = selectedIdentity
  },
  SET_PERMISSIONROUTERS: (state, permissionRouters) => {
    state.permissionRouters = permissionRouters
  },
  SET_ACCOUNTINFO: (state, accountInfo) => {
    state.accountInfo = accountInfo
  },
  SET_SCHOOLYEARLIST: (state, schoolYearList) => {
    state.schoolYearList = schoolYearList
  },
  SET_SCHOOLGRADELIST: (state, schoolGradeList) => {
    state.schoolGradeList = schoolGradeList === null ? [] : schoolGradeList
  },
  SET_SCHOOLTEACHERLIST: (state, schoolTeacherList) => {
    state.schoolTeacherList = schoolTeacherList
  },
  SET_DICT: (state, dict) => {
    state.dict = dict
  },
  SET_CURSCHOOLYEAR: (state, curSchoolYear) => {
    state.curSchoolYear = curSchoolYear
  },
  SET_CURUSERROLE: (state, curUserRole) => {
    state.curUserRole = curUserRole
  },
  SET_CURUSERORG: (state, curUserOrg) => {
    state.curUserOrg = curUserOrg
  },
  SET_CURUSERSCHOOLLIST: (state, curUserSchoolList) => {
    state.curUserSchoolList = curUserSchoolList
  },
  SET_CURAREALIST: (state, curAreaList) => {
    state.curAreaList = curAreaList
  }
}

const state = getDefaultState()

const actions = {
  // 获取或更新用户信息
  async updateUserInfo({ commit }) {
    if (!request.defaults.headers.common['Identity']) {
      return queryUserIdentityInfo().then(async res => {
        const { username, nickName, identityList } = res.data
        commit('SET_NAME', nickName)
        commit('SET_USERNAME', username)

        // 获取默认身份，如果地址栏附带身份信息就使用地址栏的，如果没有就取身份列表的默认值，如果没有设置默认值就取第一个
        let defaultIdentity =
          identityList.find(e => e.isDefault === 1) || identityList[0] || {}
        const identityCodeByUrl = getParamByURL('identityCode')
        if (identityCodeByUrl) {
          defaultIdentity = identityList.find(
            e => e.identityCode === identityCodeByUrl
          )
        }

        // 设置身份信息
        commit('SET_IDENTITYLIST', identityList)
        commit('SET_SELECTEDIDENTITY', {
          value: defaultIdentity.id,
          label: defaultIdentity.identityName,
          code: defaultIdentity.identityCode
        })
        // 设置请求头
        request.defaults.headers.common['Identity'] =
          defaultIdentity.identityCode
        // request.defaults.headers.common['Identity'] = '1410773473726435328'
      })
    }
  },

  /**
   * 获取当前登录用户信息
   */
  getAccountInfo({ commit }) {
    return getAccountInfo().then(res => {
      commit('SET_ACCOUNTINFO', res.data)
    })
  },

  /**
   * 获取指定用户关联身份下的信息
   */
  getDoorResourcesTreeBySystem({ commit }) {
    const code = getParamByURL('applyId')
    const data = {
      resourcesCode: code ? code : '0048'
    }
    return getDoorResourcesTreeBySystem(data).then(response => {
      // 设置身份信息
      commit('SET_PERMISSIONROUTERS', response.data)
      return response.data
    })
  },

  // user logout
  logout(_, needCallBack = true) {
    portal.logout(needCallBack)
  },

  // 获取学年列表
  getSchoolYearList({ commit }) {
    return querySchoolYearDictInfo().then(res => {
      commit('SET_SCHOOLYEARLIST', res.data)
    })
  },
  // 获取年级列表
  getSchoolGradeList({ commit }) {
    return getSchoolType()
      .then(res => {
        return res.data
      })
      .then(gradeGroup => {
        queryGradeDictByGroup({ gradeGroup }).then(res => {
          commit('SET_SCHOOLGRADELIST', res.data)
        })
      })
  },
  // 获取所有老师
  getSchoolTeacherList({ commit }) {
    return queryCurSchoolTeachers().then(res => {
      commit('SET_SCHOOLTEACHERLIST', res.data)
    })
  },
  // 获取所有字典
  queryAllDictInfo({ commit }) {
    return queryAllDictInfo().then(res => {
      commit('SET_DICT', res.data)
    })
  },
  // 获取当前学年
  queryCurSchoolYear({ commit }) {
    return queryCurSchoolYear().then(res => {
      commit('SET_CURSCHOOLYEAR', res.data)
    })
  },
  // 获取当前用户角色
  getRoleType({ commit }) {
    return getRoleType().then(res => {
      commit('SET_CURUSERROLE', res.data)
    })
  },
  // 获取当前用户机构信息 && 学校列表
  getOrgInfo({ commit }) {
    return getOrgInfo().then(res => {
      commit('SET_CURUSERORG', res.data)
      querySchoolList({ countyCode: res.data.region }).then(res => {
        commit('SET_CURUSERSCHOOLLIST', res.data)
      })
    })
  },
  // 获取当前用户地区列表
  queryAreaList({ commit }) {
    return queryAreaList().then(res => {
      let areaList = res.data.areaCodes.map((value, index) => {
        return { label: res.data.areaCodesName[index], value }
      })
      commit('SET_CURAREALIST', areaList)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
