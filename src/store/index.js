import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    api: "",
    currentUser: "",
    detail: "",
    devmode: false,
    errorPrompt: "",
    filters: {
      date: "",
      teamId: "",
      userId: ""
    },
    refresh: "",
    searchState: {
      queued: "",
      active: "",
      finished: ""
    },
    users: ""
  },
  mutations: {
    updateApi(state, blob) {
      state.api = blob;
    },
    updateUsers(state, blob) {
      state.users = blob;
    },
    updateCurrentUser(state, blob) {
      state.currentUser = blob;
    },
    updateErrorPrompt(state, val) {
      state.errorPrompt = val;
    },
    updateFilters(state, blob) {
      state.filters = blob;
    },
    updateRefresh(state, val) {
      state.refresh = val;
    },
    updateSearchStateQueued(state, val) {
      state.searchState.queued = val;
    },
    updateSearchStateActive(state, val) {
      state.searchState.active = val;
    },
    updateSearchStateFinished(state, val) {
      state.searchState.finished = val;
    },
    toggleDevMode(state) {
      state.devmode = !state.devmode;
    }
  },
  getters: {
    api: state => state.api,
    currentUser: state => state.currentUser,
    detail: state => state.detail,
    devmode: state => state.devmode,
    errorPrompt: state => (state && state.errorPrompt ? state.errorPrompt : ""),
    refresh: state => (state && state.refresh ? state.refresh : ""),
    sdState: state => state,
    searchStateQueued: state => state.searchState.queued,
    searchStateActive: state => state.searchState.active,
    searchStateFinished: state => state.searchState.finished,
    users: state => state.users
  },
  actions: {}
});
