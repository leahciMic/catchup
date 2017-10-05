<template>
  <video ref="video"></video>
</template>

<style>
  video {
    width: 160px;
    height: 120px;
    display: block;
    object-fit: cover;
  }
</style>

<script>
  export default {
    props: ['stream'],
    mounted() {
      console.log(this.stream);
      this.$refs.video.srcObject = this.stream;
      this.$refs.video.play();
    }
  }
</script>
