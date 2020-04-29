<template>
  <!-- 法律法规侧边栏 -->
  <div id="siderbarWWarp" >
    <!-- {{dataAll}} -->
    <div id="label">
       <span class="minusorplus" @click="changeSiderBar">
        <i :class="elIconStyle"></i>
      </span> 
      <span>{{siderData.label}}</span>
      </div>
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
    <!-- {{currentTotalData.length}} -->
    <el-tree class="el-tree-ziding sideBarWrap"
      ref="viewTree"
      :data="currentTotalData"
      :props="defaultProps"
      :default-expand-all="true"
      node-key="id"
      :highlight-current="true"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
      v-if="isDispaly"
    ></el-tree>
    <el-button-group v-if="currentTotalNum!=1&&currentTotalNum>0" style="margin:10px;">
      <el-button size="mini">{{currentNum}}/{{currentTotalNum}}</el-button>
      <el-button type="primary" size="mini" @click="up">上页</el-button>
      <el-button type="primary" size="mini" @click="down">下页</el-button>
      <el-button type="primary" size="mini" @click="all">全部</el-button>
    </el-button-group>
      <el-button type="primary" size="mini" @click="packUp" v-if="currentTotalNum==1&&siderData.data.length>10" style="width:80%;margin:10px 10%;">收起</el-button>
  </div>
</template>

<script>
export default {
  name: "siderBar",
  props: ["siderData", "siderBarNum"],
  data() {
    return {
      currentTotalData: [],
      currentNum: "1",
      currentTotalNum: "4",
      defaultProps: {
        // label:'label,count'
        label: function(data, node) {
          return data.label + "(" + data.count + ")";
          //alert(JSON.stringify(data));
          // alert(JSON.stringify(node));
        }
      },
      chosen: "0", //默认选中的是哪个siderbar部分
      msg: "Welcome to Your Vue.js App",
      elIconStyle:'el-icon-minus',
      isDispaly:true,
    };
  },
   watch: {
    siderData: function (val) {
       this.packUp();
    }
  },
  mounted() {},
  created() {
  this.packUp();
  },
  methods: {
    changeSiderBar(){
      this.isDispaly= !this.isDispaly;
      if(this.isDispaly){
        this.elIconStyle="el-icon-minus";
      }else{
        this.elIconStyle="el-icon-plus";
      }
    },
    //packUp点击出现分页
    packUp: function() {
       let total = this.siderData.data.length;
    this.currentTotalNum = Math.ceil(total / 10); //总页数
    this.currentNum = "1";
    this.currentTotalData = this.doPagation(
      this.currentNum,
      this.siderData.data
    );
    },
    //up点击上页
    up: function() {
      this.currentNum = this.currentNum - 1;
      if (this.currentNum == 0) {
        this.currentNum = 1;
      }
      this.currentTotalData = this.doPagation(
        this.currentNum,
        this.siderData.data
      );
    },
    //down点击下页
    down: function() {
      this.currentNum = parseInt(this.currentNum) + 1;
      if (this.currentNum > this.currentTotalNum) {
        this.currentNum = 1;
      }
      this.currentTotalData = this.doPagation(
        this.currentNum,
        this.siderData.data
      );
    },
    //up点击上页
    all: function() {
       this.currentTotalData = this.siderData.data;
       this.currentTotalNum=1;
    },
    //获取当前的数组
    doPagation: function(num, data) {
      let arry = data.slice((num - 1) * 10, num * 10);
      return arry;
    },
    handleNodeClick: function(data) {
      const queryData = {
        name:data.label,
        field: this.siderData.value, //字段标识
        item: [data.value],
        type: "rank" //字段数据类型
      };
      this.$emit("secondmenu", queryData);
      this.$refs.viewTree.setCurrentKey(data.value);
      // alert(JSON.stringify(data))
    },
    chosenMenu: function(data) {
      const queryData = [
        {
          field: this.siderData.value, //字段标识
          item: [data],
          type: "rank" //字段数据类型
        }
      ];
      this.$emit("secondmenu", queryData);
    }
  }
};
</script>
<style>
#label .minusorplus i{
  color:#2d405e;
  cursor: pointer;
  font-size: 18px;
  font-weight: bolder;
}
.el-tree > div > div:nth-of-type(1) > span:nth-of-type(1) {
  /* color: #c0c4cc; */
	color: #5c79b0;
}

.el-aside{
  width: 250px !important;
}
.el-button-group .el-button--mini{
  padding: 5px 10px;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-tree {
  /* color: #333; */
	color: #4f5e7b;
}
#siderbarWWarp {
  border: 1px solid #a9c4df;
  margin-bottom: 10px;
}
#label {
  border-top: 2px solid #a8bdce;
  background-color: #daedfb;
  font-family: 'Microsoft YaHei',Arial,"Avenir", Helvetica,sans-serif;
  /* font-weight: bold; */
  font-style: normal;
  font-size: 16px;
  text-align: left;
  padding-left: 15px;
  height: 38px;
  line-height: 38px;
  color: #2d405e;
  
}
#subSider {
  text-align: left;
  padding-left: 50px;
  word-wrap: break-word;
}
</style>
