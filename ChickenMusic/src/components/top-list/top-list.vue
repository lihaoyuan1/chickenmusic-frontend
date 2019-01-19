<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from '../music-list/music-list'
import {mapGetters} from 'vuex'
import {_get} from '../../api/api'
import {createSong} from '../../common/js/song'

export default {
  name: 'top-list',
  components: {
    MusicList
  },
  data () {
    return {
      songs: [],
      rank: true
    }
  },
  computed: {
    title () {
      return this.topList.name
    },
    bgImage () {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'topList'
    ])
  },
  created () {
    this._getMusicList()
  },
  methods: {
    _getMusicList () {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      _get('topSong', {id: this.topList.id}).then(response => {
        this.songs = this._normalizeSongs(response)
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        ret.push(createSong(item))
      })
      return ret
    }
  }
}
</script>

<style scoped>
  @import "top-list.css";
</style>
