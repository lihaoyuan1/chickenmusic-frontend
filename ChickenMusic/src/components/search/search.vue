<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll :refresh-delay="refreshDelay" ref="shortcut" class="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="addQuery(item.k)" class="item" v-for="(item, index) in hotKey" :key="index">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
          <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list @select="addQuery" @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
        </div>
        </div>
      </scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="query">
      <suggest ref="suggest" @select="saveSearch" @listScroll="blurInput" :query="this.query"></suggest>
    </div>
    <confirm text="是否清空所有搜索历史" ref="confirm" confirm-btn-text="清空" @confirm="clearSearchHistory"></confirm>
  </div>
</template>

<script>
import SearchBox from '../../base/search-box/search-box'
import {getHotKey} from '../../api/api'
import Suggest from '../suggest/suggest'
import Scroll from '../../base/scroll/scroll'
import {mapActions} from 'vuex'
import SearchList from '../../base/search-list/search-list'
import Confirm from '../../base/confirm/confirm'
import {playlistMixin, searchMixin} from '../../common/js/mixin'

export default {
  name: 'search',
  mixins: [playlistMixin, searchMixin],
  components: {
    Scroll,
    Suggest,
    SearchBox,
    SearchList,
    Confirm
  },
  data () {
    return {
      hotKey: [],
      refreshDelay: 100
    }
  },
  computed: {
    shortcut () {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  created () {
    this._getHotKey()
  },
  methods: {
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.suggest.refresh()
    },
    _getHotKey () {
      getHotKey().then(response => {
        if (response.code === 0) {
          this.hotKey = response.data.hotkey.slice(0, 10)
        }
      })
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  }
}
</script>

<style scoped>
  @import "search.css";
</style>
