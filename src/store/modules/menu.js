const state = {
  menusTreeBySystem: []
}

const mutations = {
  SET_MENUSTREEBYSYSTEM: (state, payload) => {
    state.menusTreeBySystem = payload
  }
}

const actions = {
  // 请这里写获取菜单列表权限列表的接口
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
