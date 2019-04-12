const store = new Vuex.Store({
  state: {
    bancos: []
  },
  mutations: {
    asignarBanco(state, banco) {
      var existe = false;
      state.bancos.forEach((bancoState, index) => {
        if (bancoState.nombre == banco.nombre) {
          existe = true;
          state.bancos[index] = banco;
        }
      });

      if (!existe) state.bancos.push(banco);

    }
  }
})