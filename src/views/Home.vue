<template>
  <div>
    <v-parallax src="1.jpg" class="mb-3" style="height: 400px;">
      <v-layout column align-center justify-center>
        <h1 class="white--text mt-5" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">Catchup</h1>
        <h4 class="white--text" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
          Catchup with friends, family, and loved ones.
        </h4>

        <v-layout class="mt-3" style="width:60%;">
          <v-flex xs12>
            <v-text-field
              class="input-group--solo"
              name="input-1"
              label="Room name"
              v-model="roomName"
              single-line
              prepend-icon="room"
              id="testing"
            ></v-text-field>
            <v-btn primary @click="join">Join</v-btn>
          </v-flex>
        </v-layout>

      </v-layout>
    </v-parallax>

    <v-layout>
      <v-flex xs12 sm3>
        <v-card>
          <v-card-media src="2.jpg" height="200px">
          </v-card-media>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Kangaroo Valley Safari</h3>
              <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn flat class="orange--text">Share</v-btn>
            <v-btn flat class="orange--text">Explore</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        roomName: '',
      };
    },
    methods: {
      join() {
        this.$router.push(`room/${this.roomName}`);
      }
    }
  }
</script>
