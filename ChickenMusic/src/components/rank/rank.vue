<template>
  <div class="rank" ref="rank">
    <scroll class="topList" :data="topList" ref="topList">
      <div>
        <ul v-for="(items, index1) in topList" :key="index1">
          <h2 class="topName">{{items.title}}</h2>
          <li class="item" v-for="(item, index2) in items.detail" :key="index2" @click="selectItem(item)">
            <div class="icon">
              <img width="100" height="100" v-lazy="item.src"/>
            </div>
            <ul class="title-box">
              <li class="title-detail">
                <span>{{item.name}}</span>
              </li>
              <li class="title-detail">
                <span>{{item.tip}}</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </scroll>
    <div class="loading-container" v-show="!topList.length">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import {_get} from '../../api/api'
import Scroll from '../../base/scroll/scroll'
import Loading from '../../base/loading/loading'
import {playlistMixin} from '../../common/js/mixin'
import {mapMutations} from 'vuex'

export default {
  name: 'rank',
  mixins: [playlistMixin],
  components: {
    Scroll,
    Loading
  },
  created () {
    this._getTopList()
  },
  data () {
    return {
      topList: []
    }
  },
  methods: {
    selectItem (item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
    },
    _getTopList () {
      _get('topList').then(response => {
        this.topList = response
      })
    },
    handlePlayList (playList) {
      const bottom = playList.length ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.topList.refresh()
    },
    ...mapMutations({
      setTopList: 'SET_TOPLIST'
    })
  }
}
</script>

<style scoped>
  @import "rank.css";
</style>
