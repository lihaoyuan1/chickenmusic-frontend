<template>
  <transition name="list-fade">
    <div class="play-list" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll :refresh-delay="refreshDelay" ref="listContent" class="list-content" :data="sequenceList">
          <transition-group name="list" tag="ul">
            <li ref="listItem" class="item" v-for="(item, index) in sequenceList" :key="item.id" @click="selectItem(item, index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm @confirm="confirmClear" ref="confirm" text="是否清空播放列表" confirm-btn-text="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import {mapActions} from 'vuex'
import Scroll from '../../base/scroll/scroll'
import {playMode} from '../../common/js/congif'
import Confirm from '../../base/confirm/confirm'
import {playerMixin} from '../../common/js/mixin'
import AddSong from '../../components/add-song/add-song'

export default {
  name: 'play-list',
  mixins: [playerMixin],
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  data () {
    return {
      showFlag: false,
      refreshDelay: 100
    }
  },
  computed: {
    modeText () {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
  },
  methods: {
    show () {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    getCurrentIcon (item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      }
      return ''
    },
    selectItem (item, index) {
      if (this.mode === playMode.random) {
        index = this.playList.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    scrollToCurrent (current) {
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
    },
    deleteOne (item) {
      this.deleteSong(item)
      if (!this.playList.length) {
        this.hide()
      }
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    confirmClear () {
      this.deleteSongList()
      this.hide()
    },
    addSong () {
      this.$refs.addSong.show()
    },
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      this.scrollToCurrent(newSong)
    }
  }
}
</script>

<style scoped>
  @import "play-list.css";
</style>
