<template>
  <v-layout fill-height>
    <v-layout row justify-center align-center v-show="state === 'connecting'">
      <v-flex xs9 sm7 lg4>
        <loading heading="Connecting" description="Please wait while we connect you"></loading>
      </v-flex>
    </v-layout>

    <div v-if="myStream" class="elevation-1" style="position: absolute; top: 32px; right: 32px; width: 160px; height: 120px;  z-index:100;">
      <stream :stream="myStream"> </stream>
    </div>

    <streamLayout :streams="remoteStreams"></streamLayout>
  </v-layout>
</template>

<script>
  import Session from 'lib/session.js';
  import { mapState } from 'vuex';
  import loading from 'components/loading';
  import stream from 'components/stream';
  import streamLayout from 'components/streamLayout';

  export default {
    beforeRouteUpdate(to, from, next) {
      if (this.session) {
        this.session.destroy();
        this.remoteStreams = [];
        this.myStream = undefined;
        this.subscribe();
      }
      next();
    },
    beforeRouteLeave(to, from, next) {
      this.session.destroy();
      next();
    },
    computed: {
      roomName() {
        return this.$store.state.route.params.roomName;
      }
    },
    data() {
      return {
        state: '',
        myStream: undefined,
        remoteStreams: [],
      };
    },
    methods: {
      subscribe() {
        this.session = new Session({ room: this.roomName });
        this.state = this.session.state;

        this.session.on('statechange', state => this.state = state);
        this.session.on('connected', async () => {
          const stream = await this.session.getStream();
          this.myStream = stream;
          this.session.publish(stream);
        });
        this.session.on('stream', async ({ id, width, height }) => {
          const stream = await this.session.subscribe(id);
          this.remoteStreams.push({
            id,
            width,
            height,
            stream
          });
        });
        this.session.on('streamDestroyed', ({ id }) => {
          for (let i = 0; i < this.remoteStreams.length; i += 1) {
            if (this.remoteStreams[i].id === id) {
              this.remoteStreams.splice(i, 1);
              break;
            }
          }
        });
      }
    },
    created()  {
      this.subscribe();
    },
    components: {
      loading,
      stream,
      streamLayout,
    },
  }
</script>
