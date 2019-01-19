<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from '../music-list/music-list'
import {mapGetters} from 'vuex'
import {_get} from '../../api/api'
import {createSong} from '../../common/js/song'

export default {
  name: 'disc',
  components: {
    MusicList
  },
  data () {
    return {
      songs: []
    }
  },
  created () {
    this._getSongList()
  },
  computed: {
    title () {
      return this.disc.title
    },
    bgImage () {
      return this.disc.picture
    },
    ...mapGetters([
      'disc'
    ])
  },
  methods: {
    _getSongList () {
      if (!this.disc.id) {
        this.$router.push('/recommend')
        return
      }
      _get('playList', {id: this.disc.id}).then(response => {
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
  @import "disc.css";
</style>
