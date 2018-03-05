import { stat } from "fs";
import axios from '~/plugins/axios'

export const state = () => ({
  layout: {
    drawerLeft: true,
    drawerRight: false,
    subDrawerLeft: false,
    subDrawerRight: false,
    stale: false,
  },
  project: '',
  projects: [],
  sources: [],
  projectsPromise: null,
  sourcesPromise: null,
  source: {
    content: ''
  },
})

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
  loadingProjects(state, promise) {
    state.projectsPromise = promise;
  },
  loadedProjects(state, projects) {
    state.projects = projects;
  },
  loadingSources(state, promise) {
    state.sourcesPromise = promise;
  },
  loadedSource(state, sources) {
    state.sources = sources;
  },
  changeProject(state, projectName) {
    state.project = projectName;
  },
  loadSource(state, source) {
    state.source = state.sources.find(({name}) => name == source);
  },
  flushSources(state) {
    state.sourcesPromise = null;
  }
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
  },
  async loadProjects({ state, commit , dispatch}) {
    // Workaround for store value not being initiaized properly on route change,
    // due to axios promise not being serializable by Vuex.
    const hasPromise = state.projectsPromise && state.projectsPromise.then;
    if(hasPromise) {
      return state.projectsPromise;
    }
    const path = `${process.env.baseUrl}/api/project`
    const promise = axios.get(path).then(({data})=> {
      commit('loadedProjects', data.projects)
      return data.projects
    });
    commit('loadingProjects', promise);
    return promise;
  },
  async loadSources({ state, commit, dispatch }, projectName) {
    // Workaround for store value not being initiaized properly on route change,
    // due to axios promise not being serializable by Vuex.
    const hasPromise = state.sourcesPromise && state.sourcesPromise.then
    if(hasPromise) {
      return state.sourcesPromise;
    }
    return dispatch('loadProjects').then((projects) => {
      const projectId = projects.find(({name}) => name === projectName).id;
      const path = `${process.env.baseUrl}/api/project/${projectId}/source`
      const promise = axios.get(path).then(({data}) => {
        commit('loadedSource', data.sources);
      });
      commit('loadingSources', promise);
      return promise;
    });
  },
  async selectProject({ state, commit , dispatch }, projectName: string) {
    return dispatch('loadProjects').then(() => {
      commit('changeProject', projectName);
      commit('flushSources');
    });
  },
  async selectSource({ state, commit , dispatch}, {projectId, sourceId}) {
    return dispatch('loadSources', projectId).then(() => {
      commit('loadSource', sourceId);
    })
  },
}