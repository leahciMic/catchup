import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import Vuetify from 'vuetify';

import Scaffold from 'layouts/scaffold.vue';
import createRouter from './router/index';
import createStore from './store/index';

Vue.use(Vuetify);

const router = createRouter();
const store = createStore();

sync(store, router);

const app = new Vue({ router, store, ...Scaffold });

app.$mount('#app');
