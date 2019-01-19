<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script>
export default {
  name: 'no-result',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
  @import "no-result.css";
</style>
