<template>
  <v-layout v-show="layout.length" style="position: relative;">
    <div v-for="stream in layout" class="elevation-1" :key="stream.id" :style="{
      height: `${Math.round(stream.height)-10}px`,
      width: `${Math.round(stream.width)-10}px`,
      top: stream.y + 'px',
      left: stream.x + 'px',
      position: 'absolute',
      overflow: 'hidden',
      transition: 'all 300ms ease',
      }">
      <stream :stream="stream.rect.stream"></stream>
    </div>
  </v-layout>
</template>

<script>
  import stream from 'components/stream';
  import calcLayout from 'lib/calcLayout';
  import debounce from 'lodash/debounce';

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
      window.addEventListener('resize', this.resize);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize);
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
      resize: debounce(function () {
        this.width = this.$parent.$el.clientWidth;
        this.height = this.$parent.$el.clientHeight;
      }, 16, { trailing: true })
    },
    components: {
      stream,
    },
  }
</script>
