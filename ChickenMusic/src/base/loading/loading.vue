<template>
  <div class="loading">
    <img width="24px" height="24px" src="./loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>

<style scoped>
  @import "loading.css";
</style>
