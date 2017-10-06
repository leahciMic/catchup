<template>
  <div>
    <v-parallax :src="require('../static/images/main-background.jpg')" class="mb-3" style="height: 400px;">
      <v-layout column align-center justify-center>
        <h1 class="white--text mt-5" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">Catchup</h1>
        <h4 class="white--text" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
          Catchup with friends, family, and loved ones.
        </h4>

        <v-layout class="mt-3" style="width:60%;">
          <v-flex xs12>
            <v-text-field
              ref="entry"
              class="input-group--solo"
              name="input-1"
              label="Room name"
              v-model="roomName"
              single-line
              prepend-icon="room"
              id="testing"
              @keyup.enter="join"
            ></v-text-field>
            <v-btn primary @click="join">Join</v-btn>
          </v-flex>
        </v-layout>

      </v-layout>
    </v-parallax>

    <v-layout row v-show="rooms.length">
      <v-flex xs12 sm4 offset-sm4>
        <v-card class="ma-2">
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Previous rooms</h3>
          </div>
        </v-card-title>
        <v-card-text>
          <v-list class="pa-0">
            <v-list-tile v-for="room in rooms" :key="room">
              <v-list-tile-action>
                <v-icon>star</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="room"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-container grid-list>
    <v-layout row>
      <v-flex xs12 sm3 offset-sm3>
        <v-card class="ma-2">
          <v-card-media :src="require('../static/images/security.png')" height="200px">
          </v-card-media>
          <v-card-title primary-title>
            <div>
              <h3 class="headline">World class security</h3>
              <div>You are safe with us. Audited and vetted by third parties, including financial institutions and industry experts. No user data is ever stored, and your video is encrypted end to end.</div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 sm3 fill>
        <v-card class="ma-2">
          <v-card-media :src="require('../static/images/speed.jpg')" height="200px">
          </v-card-media>
          <v-card-title primary-title>
            <div>
              <h3 class="headline">Fast</h3>
              <div>Our P2P video technology will provide the best possible experience to the device and network you are using. Our video quality automatically adjusts to the constraints of your network and device capabilities in realtime.</div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

    </v-layout>
    </v-container>

  </div>
</template>

<script>
  function getRooms() {
    try {
      return JSON.parse(localStorage.getItem('rooms'));
    } catch(e) {
      return [];
    }
  }
  export default {
    data() {
      return {
        roomName: '',
        rooms: getRooms() || [],
      };
    },
    mounted() {
      this.$refs.entry.focus();
    },
    methods: {
      join() {
        if (this.rooms.indexOf(this.roomName) === -1) {
          this.rooms.push(this.roomName);
          localStorage.setItem('rooms', JSON.stringify(this.rooms));
        }
        this.$router.push(`room/${this.roomName}`);
      }
    }
  }
</script>
