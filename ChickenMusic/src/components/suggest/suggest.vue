<template>
  <scroll ref="suggest" class="suggest" :data="result" :beforeScroll="beforeScroll" @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text" v-html="item.name"></p>
        </div>
      </li>
    </ul>
    <div class="no-result-wrapper" v-show="err">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import {_get} from '../../api/api'
import {createSong} from '../../common/js/song'
import Scroll from '../../base/scroll/scroll'
import {mapActions} from 'vuex'
import NoResult from '../../base/no-result/no-result'

export default {
  name: 'suggest',
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Scroll,
    NoResult
  },
  data () {
    return {
      result: [],
      err: false,
      beforeScroll: true
    }
  },
  methods: {
    selectItem (item) {
      this.insertSong(item)
      this.$emit('select')
    },
    search () {
      if (!this.query) {
        return
      }
      _get('search', {msg: this.query}).then(response => {
        if (response.error) {
          this.result = []
          this.err = true
          return
        }
        this.err = false
        this.result = this._normalizeSongs(response)
      })
    },
    refresh () {
      this.$refs.suggest.refresh()
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        ret.push(createSong(item))
      })
      return ret
    },
    ...mapActions([
      'insertSong'
    ]),
    listScroll () {
      this.$emit('listScroll')
    }
  },
  watch: {
    query () {
      this.search()
    }
  }
}
</script>

<style scoped>
  @import "suggest.css";
</style>
