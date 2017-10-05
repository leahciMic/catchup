<template>
  <div>
    <video ref="video"></video>
  </div>
</template>

<style>
  video {
    width: 100%;
    height: 100%;
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
