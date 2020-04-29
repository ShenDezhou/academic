<template>
  <!-- 法律法规侧边栏 -->
  <div id="cricaseSiderBar">
    <!-- {{dataAll}} -->
    <div id="label">罪名</div>
    <!--三目运算，给定选定值 -->
    <!-- <el-menu
      :default-active="siderBarNum==chosen?'0':'-1'"
      class="el-menu-vertical-demo"
      background-color="#e3f1fa"
      text-color="#4f4f8a"
      active-text-color="#ffd04b"
    >
      <el-menu-item
        :index="index+''"
        v-for="(subItem, index) in siderData.data"
        :key="index"
        id="subSider"
        @click="chosenMenu(subItem.value)"
      >
        <i class="el-icon-caret-right"></i>
        <span slot="title">{{subItem.label}}({{subItem.count}})</span>
      </el-menu-item>
    </el-menu>-->
    <el-tree
      ref="viewTree"
      :data="siderData"
      :props="defaultProps"
      :default-expanded-keys="[dataItem]"
      node-key="value"
      :highlight-current="true"
      @node-click="handleNodeClick"
    ></el-tree>
  </div>
</template>

<script>
export default {
  name: "siderBar",
  props: ["siderData", "dataItem"],
  data() {
    return {
      defaultProps: {
        // label:'label,count'
        label: function(data, node) {
          return data.label + "(" + data.count + ")";
          //alert(JSON.stringify(data));
          // alert(JSON.stringify(node));
        }
      },
      chosen: "0", //默认选中的是哪个siderbar部分
      msg: "Welcome to Your Vue.js App"
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.viewTree.setCurrentKey(this.dataItem);
    });
  },
  created() {},
  methods: {
    handleNodeClick: function(data) {
      this.$emit("secondmenu", data.value);
      // this.$refs.viewTree.setCurrentKey(data.value);
      // alert(JSON.stringify(data))
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#cricaseSiderBar{
  border:1px solid #ccc;
 margin-bottom:10px;
}
#label {
  background-color: #cee3f8;
  font-family: 'Microsoft YaHei',Arial,"Avenir", Helvetica,sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  text-align: left;
  padding-left: 30px;
  height: 38px;
  line-height: 38px;
}
#subSider {
  text-align: left;
  padding-left: 50px;
  word-wrap: break-word;
}
</style>
