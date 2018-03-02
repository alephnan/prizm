import { stat } from "fs";

export const state = () => ({
  layout: {
    drawerLeft: true,
    subDrawerLeft: false,
    subDrawerRight: false,
    drawerRight: false,
    stale: false,
  },
})

let timeout;

export const mutations = {
  toggleDrawerLeft(state) {
    state.layout.drawerLeft = !state.layout.drawerLeft;
  },
  toggleDrawerRight(state) {
    state.layout.drawerRight = !state.layout.drawerRight;
  },
  toggleSubDrawerLeft(state) {
    state.layout.subDrawerLeft = !state.layout.subDrawerLeft;
  },
  toggleSubDrawerRight(state) {
    state.layout.subDrawerRight = !state.layout.subDrawerRight;
  },
  refreshEditor(state) {
    state.layout.stale = false;
  },
  setLayoutStale(state) {
    state.layout.stale = true;
  },
}

export const actions = {
  async toggleLeftDrawer({ commit}) {
    commit("toggleDrawerLeft");
  },
  async toggleLeftSubDrawer({ commit}) {
    commit("toggleSubDrawerLeft");
  },
  async toggleRightDrawer({ commit }) {
    commit("toggleDrawerRight");
  },
  async toggleRightSubDrawer({ commit}) {
    commit("toggleSubDrawerRight");
  },
  async refreshEditor({ commit }) {
    commit('refreshEditor')
  },
  async requestLayoutRefresh({ commit }) {
    commit('setLayoutStale');
  }
}