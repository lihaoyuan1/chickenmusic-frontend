<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li @click="selectItem(item)" class="search-item" v-for="(item) in searches" :key="item">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'search-list',
  props: {
    searches: {
      type: Array,
      default: null
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    deleteOne (item) {
      this.$emit('delete', item)
    }
  }
}
</script>

<style scoped>
  @import "search-list.css";
</style>
