<template>
  <v-layout v-show="layout.length" v-resize="resize" style="position: relative;">
    <div v-for="stream in layout" :key="stream.id" :style="{
      height: stream.height + 'px',
      width: stream.width + 'px',
      top: stream.y + 'px',
      left: stream.x + 'px',
      position: 'absolute',
      overflow: 'hidden',
      }">
      <stream :stream="stream.rect.stream"></stream>
    </div>
  </v-layout>
</template>

<script>
  import stream from 'components/stream';
  import calcLayout from 'lib/calcLayout';

  export default {
    props: ['streams'],
    data() {
      return {
        width: 0,
        height: 0,
      };
    },
    mounted() {
      this.width = this.$parent.$el.clientWidth;
      this.height = this.$parent.$el.clientHeight;
    },
    computed: {
      layout() {
        if (!this.streams.length) {
          return [];
        }
        // console.log(this.height);
        const d = calcLayout(this.width, this.height, this.streams, 0.1);
        console.log('layout', d);
        return d;
      }
    },
    methods: {
      resize() {
        this.width = this.$parent.$el.clientWidth;
        this.height = this.$parent.$el.clientHeight;
      }
    },
    components: {
      stream,
    },
  }
</script>
