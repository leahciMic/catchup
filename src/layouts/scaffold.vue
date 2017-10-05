<template>
  <v-app toolbar light>
    <div v-show="loading" style="position:fixed; top:0; left:0; right: 0; height: 3px; z-index: 100;">
      <v-progress-linear indeterminate height="3" style="margin:0;" warning></v-progress-linear>
    </div>

    <v-toolbar fixed class="white" light app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>

      <router-link to="/">
        <v-toolbar-title class="black--text">Catchup</v-toolbar-title>
      </router-link>

    </v-toolbar>

    <main>
      <v-content>
        <v-container fluid class="pa-0" :fill-height="fillHeight">
          <router-view></router-view>
        </v-container>
      </v-content>
    </main>
  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        drawer: false,
        loading: false,
      };
    },
    computed: {
      fillHeight() {
        return this.$route.name === 'Room';
      }
    }
  };
</script>
