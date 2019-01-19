<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import Singer from '../../common/js/singer'
import ListView from '../../base/listview/listview'
import {mapMutations} from 'vuex'
import {_get} from '../../api/api'
import {playlistMixin} from '../../common/js/mixin'

const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'

export default {
  name: 'singer',
  mixins: [playlistMixin],
  data () {
    return {
      singers: []
    }
  },
  components: {
    ListView
  },
  created () {
    this._getSingerList()
  },
  methods: {
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    selectSinger (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _getSingerList () {
      _get('getSinger').then(res => {
        this.singers = this._normalizeSinger(res)
      })
    },
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.id,
            name: item.name,
            picture: item.picture
          }))
        }
        const key = item.key
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.id,
          name: item.name,
          picture: item.picture
        }))
      })
      // 为了得到有序列表，需要处理map
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style scoped>
  @import "singer.css";
</style>
