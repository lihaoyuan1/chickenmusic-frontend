<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image"/>
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd">
          <div class="middle-l" ref="middle_l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image"/>
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{getP}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text"
                   :class="{'current': currentLineNum === index}"
                   v-for="(line, index) in currentLyric"
                   :key="index">
                  {{line.text}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar @percentChange="onProgressBarChange" :percent="percent"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-play" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls"  width="40" height="40" :src="currentSong.image"/>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniPlayIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playList"></play-list>
    <audio ref="audio" :src="currentSong.url" @ended="end" @canplay="ready" @error="error" @timeupdate="updateTime"></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from '../../common/js/dom'
import ProgressBar from '../../base/progress-bar/progress-bar'
import ProgressCircle from '../../base/progress-circle/progress-circle'
import Scroll from '../../base/scroll/scroll'
import PlayList from '../../components/play-list/play-list'
import {playerMixin} from '../../common/js/mixin'
import {playMode} from '../../common/js/congif'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  name: 'player',
  mixins: [playerMixin],
  data () {
    return {
      radius: 32,
      songReady: false,
      currentTime: 0,
      count: 10,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd'
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    PlayList
  },
  computed: {
    getP () {
      if (this.currentLyric) {
        return this.currentLyric[this.currentLineNum].text
      }
      return ''
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniPlayIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    ...mapGetters([
      'fullScreen',
      'playing',
      'currentIndex'
    ]),
    percent () {
      return this.currentTime / this.currentSong.duration
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    showPlayList () {
      this.$refs.playList.show()
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_LIST'
    }),
    open () {
      this.setFullScreen(true)
    },
    back () {
      this.setFullScreen(false)
    },
    enter (el, done) {
      const {x, y, scale} = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter () {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    togglePlaying () {
      if (this.count >= 0) {
        this.setPlayState(!this.playing)
      }
      this.count--
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
      this.currentLineNum = 0
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
    },
    next () {
      if (this.playList.length === 1) {
        return
      }
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    prev () {
      if (this.playList.length === 1) {
        return
      }
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    ready () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.audio.play()
        this.songReady = true
        this.count = 10
        this.savePlayHistory(this.currentSong)
      }, 1000)
    },
    error () {
      if (this.count) {
        this.$refs.audio.load()
        this.count--
      } else {
        this.songReady = true
        this.togglePlaying()
      }
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
      if (this.currentLineNum + 1 >= this.currentLyric.length) {
        return
      }
      if (parseInt(this.currentTime) === this.currentLyric[this.currentLineNum + 1].time) {
        this.currentLineNum++
        if (this.currentLineNum > 5) {
          let lineEl = this.$refs.lyricLine[this.currentLineNum - 5]
          this.$refs.lyricList.scroll.scrollToElement(lineEl, 1000)
        }
      }
    },
    format (interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    onProgressBarChange (percent) {
      let current = this.currentSong.duration * percent
      this.$refs.audio.currentTime = current
      for (let i = 0; i < this.currentLyric.length; i++) {
        if (this.currentLyric[i].time > current) {
          this.currentLineNum = i - 1
          let lineEl = this.$refs.lyricLine[this.currentLineNum - 5]
          this.$refs.lyricList.scroll.scrollToElement(lineEl, 1000)
          return
        }
      }
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    getLyric () {
      this.currentSong.getLyric().then(response => {
        this.currentLyric = this.parserLyric(response)
        this.$refs.lyricList.scrollTo(0, 1000)
      })
    },
    parserLyric (text) {
      let regex = /\[(\d{1,2}):(\d{1,2}).(\d{1,3})\]/g
      let lyric = []
      let lrc = text.split('\n')
      lrc.forEach((item) => {
        let prev = item.match(regex)
        if (prev) {
          let line = {}
          let arr = prev[0].match(/\d{2,3}/g)
          line.time = parseInt((parseInt(arr[0]) * 60000 + parseInt(arr[1]) * 1000 + parseInt(arr[2])) / 1000)
          line.text = item.replace(regex, '')
          lyric.push(line)
        }
      })
      return lyric
    },
    middleTouchStart (e) {
      this.touch.initiated = true
      this.touch.moved = false
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      this.touch.moved = true
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const width = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(width / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${width}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middle_l.style.opacity = 1 - this.touch.percent
      this.$refs.middle_l.style[transitionDuration] = 0
    },
    middleTouchEnd () {
      if (!this.touch.moved) {
        return
      }
      let width
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          width = -window.innerWidth
          this.currentShow = 'lyric'
          opacity = 0
        } else {
          width = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          width = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          width = -window.innerWidth
          opacity = 0
        }
      }
      this.$refs.lyricList.$el.style[transform] = `translate3d(${width}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 300 + 'ms'
      this.$refs.middle_l.style.opacity = opacity
      this.$refs.middle_l.style[transitionDuration] = 300 + 'ms'
    },
    _pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    _getPosAndScale () {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {x, y, scale}
    },
    ...mapActions([
      'savePlayHistory'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!newSong.id) {
        return
      }
      if (newSong.id === oldSong.id) {
        return
      }
      this.currentLineNum = 0
      this.count = 10
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getLyric()
      }, 1000)
    },
    playing (newPlaying) {
      if (this.songReady) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    }
  }
}
</script>

<style scoped>
  @import "player.css";
</style>
