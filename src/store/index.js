import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let vuexStore;

export default function createStore() {
  const mutations = { };
  const actions = { };

  vuexStore = new Vuex.Store({
    state: { },
    mutations,
    actions,
  });

  return vuexStore;
}
