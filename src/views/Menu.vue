<template>
  <v-list>
    <router-link :to="item.route" v-for="item in listItems" :key="item.route">
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            {{ item.title }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </router-link>
    <v-subheader class="mt-3 grey--text text--darken-1">Stores</v-subheader>
    <router-link v-for="store in stores" :key="store.name" :to="{ path: '/', query: { store: store.name } }">
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>shopping_cart</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            {{ store.name }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </router-link>
  </v-list>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    methods: {
      navigate(item) {
        this.$router.push(item.route);
      },
    },
    asyncData({ store }) {
      return store.dispatch('getStores');
    },
    computed: {
      stores() {
        return this.$store.state.stores.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
      },
    },
    data() {
      return {
        listItems: [
          { icon: 'shopping_cart', title: 'Products', route: '/', },
          { icon: 'watch_later', title: 'Watching', route: '/watching', },
          { icon: 'dashboard', title: 'Boards', route: '/boards', },
          { icon: 'store', title: 'Stores', route: '/stores', }
        ],
      };
    },
  }
</script>
