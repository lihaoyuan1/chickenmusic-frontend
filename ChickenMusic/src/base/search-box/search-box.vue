<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder"/>
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script>
import {debounce} from '../../common/js/utils'

export default {
  name: 'search-box',
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  created () {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  },
  methods: {
    clear () {
      this.query = ''
    },
    addQuery (query) {
      this.query = query
    },
    blur () {
      this.$refs.query.blur()
    }
  }
}
</script>

<style scoped>
  @import "search-box.css";
</style>
