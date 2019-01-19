<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {createSong} from '../../common/js/song'
import MusicList from '../music-list/music-list'
import {_get} from '../../api/api'

export default {
  name: 'singer-detail',
  components: {
    MusicList
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.picture
    },
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getDetail()
  },
  methods: {
    _getDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      _get('getSongs', {id: this.singer.id}).then(response => {
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
  @import "singer-detail.css";
</style>
