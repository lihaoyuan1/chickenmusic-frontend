<template>
  <ul class="switches">
    <li class="switch-item" v-for="(item, index) in switches" :key="index" :class="{'active': currentIndex === index}" @click="switchItem(index)">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'switches',
  props: {
    switches: {
      type: Array,
      default: null
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchItem (index) {
      this.$emit('switch', index)
    }
  }
}
</script>

<style scoped>
  @import "switches.css";
</style>
