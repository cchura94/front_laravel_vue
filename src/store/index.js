import { createStore } from 'vuex'

export default createStore({
  state: {
    // datos
    contador: 0,
    auth: null
  },
  mutations: {
    // modifica los estado (state)
    actualizaAuth(state, datUser){
      state.auth = datUser
    }
  },
  actions: {
    // ejecutar un mutatation
    loginVuex(context, datos_usuario){
      context.commit("actualizaAuth", datos_usuario)
    }
  },
  getters: {
  },
  modules: {
  }
})
