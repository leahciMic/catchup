import Vue from 'vue';
import Router from 'vue-router';

import Home from 'views/Home.vue';
import Room from 'views/Room.vue';

Vue.use(Router);

export default function createRouter() {
  const router = new Router({
    mode: 'hash',
    routes: [
      {
        path: '/',
        component: Home,
        name: 'Home',
      },
      {
        path: '/room/:roomName',
        component: Room,
        name: 'Room',
      },
    ],
    // scrollBehavior(to, from, savedPosition) {
    //   if (savedPosition) {
    //     return savedPosition;
    //   }

    //   return { x: 0, y: 0 };
    // },
  });

  router.beforeEach((to, from, next) => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    next();
  });

  return router;
}

