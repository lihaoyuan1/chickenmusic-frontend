<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches @switch="switchItem" :switches="switches" :current-index="currentIndex"></switches>
        <div class="list-wrapper">
          <scroll ref="songList" class="list-scroll" v-if="currentIndex === 0" :data="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll :refresh-delay="refreshDelay" ref="searchList" class="list-scroll" v-if="currentIndex === 1" :data="searchHistory">
            <div class="list-inner">
              <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :show-singer="showSinger" @select="selectSuggest" @listScroll="blurInput"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import SearchBox from '../../base/search-box/search-box'
import Suggest from '../../components/suggest/suggest'
import {searchMixin} from '../../common/js/mixin'
import Switches from '../../base/switches/switches'
import Scroll from '../../base/scroll/scroll'
import {mapGetters, mapActions} from 'vuex'
import SongList from '../../base/song-list/song-list'
import searchList from '../../base/search-list/search-list'
import TopTip from '../../base/top-tip/top-tip'
import Song from '../../common/js/song'

export default {
  name: 'add-song',
  mixins: [searchMixin],
  data () {
    return {
      showFlag: false,
      showSinger: false,
      currentIndex: 0,
      switches: [
        {name: '最近播放'},
        {name: '搜索历史'}
      ],
      refreshDelay: 100
    }
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    searchList,
    TopTip
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  methods: {
    show () {
      this.showFlag = true
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh()
        } else {
          this.$refs.searchList.refresh()
        }
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    selectSuggest () {
      this.$refs.topTip.show()
      this.saveSearchHistory(this.query)
    },
    switchItem (index) {
      this.currentIndex = index
    },
    selectSong (song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song))
        this.showTip()
      }
    },
    showTip () {
      this.$refs.topTip.show()
    },
    ...mapActions([
      'insertSong'
    ])
  }
}
</script>

<style scoped>
  @import "add-song.css";
</style>
