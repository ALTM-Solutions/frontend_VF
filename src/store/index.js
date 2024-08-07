import { createStore } from 'vuex'

export default createStore({
  state: {
    id:null,
    password:null,
    email:null,
    token:null,
    expire:null,
    role:null,
    isConnected: false,
  },
  getters: {
  },
  mutations: {
    setConnectionStatus(state, status) {
      state.isConnected = status;
    },
  },
  actions: {
  },
  modules: {
  }
})