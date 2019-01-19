<template>
  <transition name="drop">
    <div class="top-tip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'top-tip',
  props: {
    delay: {
      type: Number,
      default: 2000
    }
  },
  data () {
    return {
      showFlag: false
    }
  },
  methods: {
    show () {
      this.showFlag = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hide()
      }, this.delay)
    },
    hide () {
      this.showFlag = false
    }
  }
}
</script>

<style scoped>
  @import "top-tip.css";
</style>
