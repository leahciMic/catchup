<template>
  <div :style="{
      height: dest ? dest.height + 'px' : '100%',
      width: dest ? dest.width + 'px' : '100%',
      top: dest ? dest.y + 'px' : '',
      left: dest ? dest.x + 'px' : '',
      position: 'absolute',
      overflow: 'hidden',
    }">
    <video ref="video" :style="blur ? 'filter: blur(125px)' : ''"></video>
  </div>
</template>

<style>
  video {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    position: absolute;
    left: 0;
    top: 0;
  }
</style>

<script>
  export default {
    props: ['stream', 'dest', 'blur'],
    mounted() {
      console.log(this.stream);
      this.$refs.video.srcObject = this.stream;
      this.$refs.video.play();
    }
  }
</script>
