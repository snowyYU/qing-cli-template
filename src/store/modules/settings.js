import defaultSettings from '@/settings'

const { showSettings, fixedHeader, sidebarLogo, title } = defaultSettings

const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  objectTitle: title
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.key) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
