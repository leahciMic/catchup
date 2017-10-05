<template>
  <v-card>
    <v-card-title primary-title>
      <v-progress-circular indeterminate class="primary--text mr-3" style="display: inline-block;"></v-progress-circular>
      <div>
        <div class="headline">{{ heading }}</div>
        <span class="grey--text">{{ description }}</span>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
  export default {
    props: ['heading', 'description']
  }
</script>
