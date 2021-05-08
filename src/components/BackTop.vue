<template>
  <div class="pages-content-scroll">
    <el-backtop target=".pages-content-scroll"
                :visibility-height="visibleHeight"
                :right="rightPos"
                :bottom="bottomPos"></el-backtop>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'BackTop',
  data () {
    return {
      visibleHeight: 200,
      rightPos: 100,
      bottomPos: 100
    }
  }
}
</script>
<style scoped>
.pages-content-scroll {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: hidden;
}
</style>
