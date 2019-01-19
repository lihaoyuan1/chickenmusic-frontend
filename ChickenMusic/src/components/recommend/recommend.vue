<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" ref="scroll" :data="discList" :pullup="pullup" @scrollToEnd="more">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="(item, index) in recommends" :key="index">
              <div class="img-box" @click="selectItem(item)">
                <img :src="item.picture"/>
              </div>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <div class="list-title">
            <span class="cat">当前分类：</span>
            <span>{{this.cat}}</span>
            <span class="icon-more" @click="category">更多</span>
          </div>
          <ul>
            <li @click="selectItem(item)" class="item" v-for="item in discList" :key="item.id">
              <div class="icon">
                <img v-lazy="item.picture">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.name"></h2>
                <p class="desc" v-html="item.title"></p>
              </div>
            </li>
          </ul>
        </div>
        <div ref="loadingMore" class="loading-more"  v-show="loading">
          <loading title="正在加载..."></loading>
        </div>
      </div>
    </scroll>
    <div class="loading-container" v-show="!discList.length">
      <loading></loading>
    </div>
    <category @select="selectCat" ref="category"></category>
    <router-view></router-view>
  </div>
</template>

<script>
import Slider from '../../base/slider/slider'
import Scroll from '../../base/scroll/scroll'
import Loading from '../../base/loading/loading'
import {_get} from '../../api/api'
import {playlistMixin} from '../../common/js/mixin'
import {mapMutations} from 'vuex'
import Category from '../../base/category/category'

export default {
  name: 'recommend',
  mixins: [playlistMixin],
  components: {
    Loading,
    Slider,
    Scroll,
    Category
  },
  data () {
    return {
      cat: '全部',
      recommends: [],
      discList: [],
      pullup: true,
      page: 1,
      loading: false
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    category () {
      this.$refs.category.show()
    },
    selectCat (cat) {
      this.cat = cat
      this.page = 1
      this._getDiscList()
    },
    selectItem (item) {
      this.$router.push({
        path: `/recommend/${item.id}`
      })
      this.setDisc(item)
    },
    _getRecommend () {
      _get('getSlider').then(response => {
        this.recommends = response
      })
    },
    _getDiscList () {
      _get('getDisc', {cat: this.cat, offset: (this.page - 1) * 35}).then(response => {
        this.discList = response
      })
    },
    more () {
      this.loading = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.scroll.refresh()
        this.$refs.scroll.scrollToElement(this.$refs.loadingMore)
      }, 20)
      this.page++
      _get('getDisc', {cat: this.cat, offset: (this.page - 1) * 35}).then(response => {
        this.loading = false
        this.discList = this.discList.concat(response)
      })
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  watch: {
    recommends () {
      this.timer = setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 500)
    }
  },
  destroyed () {
    clearTimeout(this.timer)
  }
}
</script>

<style scoped>
  @import "recommend.css";
</style>
