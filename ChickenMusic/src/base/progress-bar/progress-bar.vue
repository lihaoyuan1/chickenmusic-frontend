<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from '../../common/js/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  name: 'progress-bar',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      progressBarWidth: 0
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    progressTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.progressBarWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd (e) {
      this.touch.initiated = false
      this._triggerPercent()
    },
    progressClick (e) {
      /* getBoundingClientRect: **static/getBoundingClientRect.png** */
      const rect = this.$refs.progressBar.getBoundingClientRect()
      /* offsetWidth: real progress = stop position - rect */
      const offsetWidth = e.pageX - rect.left - progressBtnWidth / 2
      this._offset(offsetWidth)
      this._triggerPercent()
    },
    _triggerPercent () {
      const barWidth = this.progressBarWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },
    _offset (offsetWidth) {
      if (offsetWidth >= 0) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      }
    }
  },
  watch: {
    percent (newPercent) {
      if (!this.progressBarWidth) {
        this.progressBarWidth = this.$refs.progressBar.clientWidth
      }
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.progressBarWidth - progressBtnWidth
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style scoped>
  @import "progress-bar.css";
</style>
