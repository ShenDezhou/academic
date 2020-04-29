<template>
  <div id="index" class="index_main_wrap">
    <el-row class="topNav">
      <!-- <el-col :span="6" :offset="18">
        <span class="nav">
          <a href="javascript:void(0);" @click="isHasUserMsg($event)" url="#/personal/collect">
            <span url="#/personal/collect">收藏</span>
          </a>
        </span>
        <span class="nav">
          <a href="javascript:void(0);" @click="isHasUserMsg($event)" url="#/personal/note">
            <span url="#/personal/note">笔记</span>
          </a>
        </span>
        <span class="nav">
          <a href="javascript:void(0);" @click="isHasUserMsg($event)" url="#/personal/history">
            <span url="#/personal/history">历史</span>
          </a>
        </span>
      </el-col> -->
    </el-row>
    <div class="main">
      <div class="title">
        <img src="../assets/logo44.png">
      </div>
			<template v-if="select == 1">
				<el-row class="navSub">
					<ul class="nav_sub_ul" @click="changeSelected">
						<li class="item" :class="tabSelect=='lawsNew'? 'active' : ''" url="lawsNew">法律法规</li>
						<li class="item" :class="tabSelect=='example'? 'active' : ''" url="example">司法案例</li>
						<li class="item" :class="tabSelect=='journalLaw'? 'active' : ''" url="journalLaw">法学期刊</li>
					</ul>
				</el-row>
      </template>
      <template v-if="select == 6">
        <el-row class="navSub">
          <ul class="nav_sub_ul" @click="changeSelected"  >
            <!--http://143.3.119.223:19410/#/working/guidance-->
            <li class="item" :class="tabSelect=='guidingCeses'? 'active' : ''" url="guidingCeses" jslx="zdal">指导案例</li>
            <li class="item" :class="tabSelect=='boutiqueQandA'? 'active' : ''" url="boutiqueQandA" jslx="jpwd">精品问答</li>
            <li class="item" :class="tabSelect=='guidance'? 'active' : ''" url="guidance" jslx="zjzy">证据指引</li>
          </ul>
        </el-row>
      </template>
      <template v-if="select == 2">
        <el-row class="navSub" >
          <ul class="nav_sub_ul" @click="changeSelected"  >
            <li class="item" :class="tabSelect=='law_hy'? 'active' : ''" url="law_hy" jslx="flfg">法律法规</li>
            <li class="item" :class="tabSelect=='example_hy'? 'active' : ''" url="example_hy" jslx="sfal">司法案例</li>
          </ul>
        </el-row>
      </template>
      <template v-if="select == 3">
        <el-row class="navSub">
          <ul class="nav_sub_ul" @click="changeSelected" >
            <li class="item" :class="tabSelect=='flfg_zw'? 'active' : ''" url="flfg_zw" jslx="flfg">法律法规</li>
            <li class="item" :class="tabSelect=='flal_zw'? 'active' : ''" url="flal_zw" jslx="flal">法律案例</li>
            <li class="item" :class="tabSelect=='fllw_zw'? 'active' : ''" url="fllw_zw" jslx="fllw">法律论文</li>
            <li class="item" :class="tabSelect=='ywzs_zw'? 'active' : ''" url="ywzs_zw" jslx="ywzs">业务助手</li>
          </ul>
        </el-row>
      </template>
      <template v-if="select == 4">
        <el-row class="navSub">
          <ul class="nav_sub_ul fx_nav_sub_ul" @click="changeSelected" >
            <li class="item" :class="tabSelect=='fxdg_fx'? 'active' : ''"  url="fxdg_fx" jslx="fxdg">法信大纲</li>
            <li class="item" :class="tabSelect=='fl_fx'? 'active' : ''"  url="fl_fx" jslx="fl">法律</li>
            <li class="item" :class="tabSelect=='al_fx'? 'active' : ''"  url="al_fx" jslx="al">案例</li>
            <li class="item" :class="tabSelect=='gd_fx'? 'active' : ''"  url="gd_fx" jslx="gd">观点</li>
            <li class="item" :class="tabSelect=='ts_fx'? 'active' : ''"  url="ts_fx" jslx="ts">图书</li>
            <li class="item" :class="tabSelect=='qklw_fx'? 'active' : ''"  url="qklw_fx" jslx="qklw">期刊论文</li>
            <!-- <li class="item" :class="tabSelect=='flws_fx'? 'active' : ''"  url="flws_fx" jslx="flws">法律文书</li> -->
           <li class="item" :class="tabSelect=='lajs_fx'? 'active' : ''"  url="lajs_fx" jslx="lajs">类案</li>
          </ul>
        </el-row>
      </template>
      <!--    <template v-if="select == 5">
                   <el-row class="navSub">
                       <ul class="nav_sub_ul fx_nav_sub_ul" @click="changeSelected" url="http://143.3.119.239/#/">
                           <li class="item" :class="tabSelect=='sfal_fyy'? 'active' : ''"  url="sfal_fyy" jslx="sfal">司法案例</li>
                       </ul>
                   </el-row>
               </template> -->
      <el-row id="indexInput">
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="18">
          <el-input
            id="indexInput1"
            :placeholder="select == 1 ? '请输入关键词搜索 多个关键词以空格间隔......' : '请输入关键词搜索'"
            v-model="searchWord"
            class="input-with-select"
            @keyup.enter.native="dosearch"
          >
            <el-select v-model="select" slot="prepend" class="indexInput2" id="indexInput2" @change="(item)=>titleChange(item)">
              <el-option label="北大法宝" value="1"></el-option>
            </el-select>
            <el-button slot="append" @click="dosearch" id="indexInput3">搜  索</el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        searchWord: "",
        msg: "Welcome to Your Vue.js App",
        input3: "",
        input4: "",
        input5: "",
        select: "1",
        tabSelect:"",
        collect:'javascript:void(0);',
        note:"javascript:void(0);",
        yhxx:{
          rybm:"",
          ryxm:"",
          dlrbmbm:"",
          dlrdwbm:"",
          jslx:'flfg',
          jsgjz:"",
        },
        jslx:"",
        aimUrl:"http://143.3.119.224:8081/#/oneStopSearch",//目标路径
        UrlObject:{
          "1":"http://143.3.119.224:8081/#/oneStopSearch",
          "2":"http://143.3.119.187:8330/zgjcy/s/all",
          "3":"http://143.3.119.238/clkd/#/doSearch",
          "4":"http://143.3.119.202:88/api/FaxinSearchGetYhxx.aspx",
          "6":"http://143.3.119.223:19410/ecp-web-mall/"},
        gotoCaseGuidArr:[
          {
            name:'第十四批指导性案例',
            value:14
          }
        ]
      };
    },
    created: function() {
      document.title = this.$route.meta.title;
    },
    methods: {
      titleChange(val){
        this.aimUrl=this.UrlObject[val];
        console.log(this.aimUrl);
      },
      dosearch() {
        let select = this.select;
        let jslx = this.jslx;
        let keyword = this.searchWord;
        if(select == '6'){
          if(!jslx){
            //指导案例
            window.location.href="http://143.3.119.223:19410/#/case/guidingCeses?keyword="+keyword
          }else if(jslx == 'zdal'){
            //指导案例
            window.location.href="http://143.3.119.223:19410/#/case/guidingCeses?keyword="+keyword
          }else if(jslx == 'jpwd'){
            //精品问答
            window.location.href="http://143.3.119.223:19410/#/boutique/boutiqueQandA?keyword="+keyword
          }else if(jslx == 'zjzy'){
            //证据指引
            window.location.href="http://143.3.119.223:19410/#/working/guidance"
          }
        }else{
            if(this.tabSelect == 'lawsNew' || this.tabSelect == 'example' || this.tabSelect == 'journalLaw'){
              this.$router.push({ name: this.tabSelect, params: { keyword: this.searchWord } });
            }else if(this.tabSelect == "" || !this.tabSelect){
              this.$router.push({ name: 'oneStopSearch', params: { keyword: this.searchWord } });
            }
            // else{
            //     this.getBase64Stringify(this.jslx,this.searchWord,this.aimUrl);
            // }

        }
      },
      changeSelected(e){
        this.tabSelect=$(e.target).attr('url');
        this.jslx=$(e.target).attr('jslx');
      },
      getBase64Stringify(jslx,searchWord,openUrl){
        if(openUrl == "" || openUrl == undefined || openUrl== null){
          this.$message({
            type: 'warning',
            message: '此功能暂未开放！'
          });
          return;
        }
        if(jslx==null||jslx==undefined||jslx==""){
          window.open(openUrl+"?"+"q="+searchWord, "_blank");
        }else{
          window.open(openUrl+"?"+"q="+searchWord+"&jslx="+jslx, "_blank");
        }

      },
      isHasUserMsg(e){
        if(sessionStorage.getItem('tandu') == undefined || sessionStorage.getItem('tandu') == null){
          this.$message({
            type: 'error',
            message: '未获取到您的用户信息，请登录！'
        });
        }else if($(e.target).attr('url') == '#/personal/collect'){

          window.open(window.location.origin+$(e.target).attr('url'),'_blank');
        }else{
          window.open(window.location.origin+$(e.target).attr('url'),'_blank');
        }

      },
      gotoCaseGuid(muluId){
        this.$router.push({ name:'guidingCeses',params: { muluId: muluId }});
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .fx_nav_sub_ul{

  }
.nav{
  padding-top: 10px;
}
.nav span {
  padding: 25px 30px 0 0;
}

body {
  font-family: 'Microsoft YaHei',Arial,"Avenir", Helvetica,sans-serif;
}
#question {
  position: absolute;
  left: 25%;
  bottom: 0;
}
#question span {
  display: inline-block;
  padding-left: 45px;
  padding-right: 50px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  background: gray;
  color: #999;
}
#question span:hover {
  cursor: pointer;
  color: #4da0fb;
}
#question span:last-child {
  background: url(../assets/question.png) no-repeat left center;
  background-size: 28px 34px;
}
#question span:first-child {
  background: url(../assets/compass.png) no-repeat left center;
  background-size: 33px 33px;
}
#index .el-select .el-input {
  width: 206px;
  font-size:20px;
  color: #4084F0;
}
#index .input-with-select .el-input-group__prepend {
  background-color: #fff;
}
#index .el-select-dropdown__item{
  font-size: 20px;
}
#index .row-bg {
  padding: 15px 0;
}
#indexInput{
  font-size:20px;
}
#index .el-select .el-option{
  font-size: 20px;
  color: white;
}
#indexInput .el-input-group__prepend {
  font-size:20px;
  height:58px;
  background: #fff;
  box-shadow: 0px 15px 33px rgba(57, 153, 251, 0.18);
}
/* #indexInput .el-input-group__append {
  background: #fff;
  position: relative;
  left: -15px;
  box-shadow: 0px 15px 33px rgba(57, 153, 251, 0.18);
} */
#indexInput1 {
  box-shadow: 0px 15px 33px rgba(57, 153, 251, 0.18);
  height: 60px;
  font-size: 20px;
  color: #BAC9DF;
}
.indexInput2{
  font-size: 20px;
  color:white;
  text-align: center;
}
 #index .el-input-group__append button.el-button,
 #index .el-input-group__append div.el-select .el-input__inner,
 #index .el-input-group__append div.el-select:hover .el-input__inner,
 #index .el-input-group__prepend button.el-button,
 #index .el-input-group__prepend div.el-select .el-input__inner,
 #index .el-input-group__prepend div.el-select:hover .el-input__inner{
    text-align: center;
}
	#index ul {
		padding: 0;
		margin: 0;
		list-style: none;
	}
</style>
<style scoped>
	ul.nav_sub_ul{
		margin: 0 !important;
	}
	ul.nav_sub_ul li{
		display: inline-block;
		font-size: 20px;
    line-height: 20px;
		color: white;
    padding: 12px 30px;
    cursor: pointer;
		/* margin: 0 5px; */
	}
	.navSub{
		width: 100%;
	}
ul.nav_sub_ul li.active{
    color: #ffffff;
    border-radius: 40px;
    background-color: #399afb;
}
#index a{
  display: flex;
  flex-direction: column;
}
#index span i {
  font-size: 20px;
}
#index {
  /* width: 100%;
  height: 100%;
  background: url(../assets/bj.png) no-repeat center center;
  background-size: cover;
  z-index: -1; */
}
#index.index_main_wrap{
  width: 100%;
  height: 100%;
  min-height: 912px;
  min-width: 1000px;
  background: url(../assets/bj.png) no-repeat center center;
  background-size: cover;
}
#index .iconzy{
   /* margin-left:560px; */
   margin-left: 22%;
}
#index .iconzy li{
  cursor: pointer;
  list-style:none;
  display: flex;
  flex-direction: column;
  margin-right:5%;
  width: 120px;
  height: 108px;
}
#index .iconzy li img{
  width:70px;
  height: 70px;
  padding-bottom: 18px;
  margin: 0 auto;
}
#index .iconzy li span{
  font-size: 20px;
  font-weight: Regular;
  line-height: 20px;
  color: white;
}
#index .iconjc{
  /* margin-left:560px; */
   margin-left: 22%;
}
#index .iconjc li{
  cursor: pointer;
  list-style:none;
  display: flex;
  flex-direction: column;
  margin-right:5%;
  width: 120px;
  height: 108px;
}
#index .iconjc li img{
  width:70px;
  height: 70px;
  padding-bottom: 18px;
  margin: 0 auto;
}
#index .iconjc li span{
  font-size: 20px;
  line-height: 20px;
  font-weight: Regular;
  color: white;
}
#index .topNav {
  padding-top: 10px;
  text-align: right;
}
.navSub {
  padding-bottom: 20px;
}
.nav {
  text-align: left;
  display: inline-block;
}
.nav a {
  padding-right: 10px;
  color: #fff;
  font-size: 20px;
}
#index .title {
  margin: 0 auto;
  padding:130px 0 83px 0;
}
#index .title img{
  width: 472px;
  height: 95px;
}
#index .bg-purple {
  text-align: center;
  /* font-weight: 300; */
  font-style: normal;
  font-size: 14px;
  /* color: #999999; */
  color: #399afb;
  cursor: pointer;
}
#index .bg-purple:hover{
	color: #399afb;
	font-weight: bold;
}
#index .bg-purple span.active{
	display: inline-block;
    padding: 8px 17px;
    border-radius: 19px;
    background-color: #399afb;
    color: #ffffff;
  }
  .bg-purple a {
    text-align: center;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    color: #999999;
  }
  .bg-purple a:hover {
    text-align: center;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    color: #4da0fb;
  }
  #indexInput .pick:hover {
    color: #4da0fb;
  }
  #index .pick {
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    color: #999999;
    line-height: 40px;
    height: 40px;
  }
  #index .pickLeft {
    text-align: center;
  }

#indexInput3 {
  width: 132px;
  background: #399afb;
  color: #fff;
  font-size: 20px;
  height: 58px;
}
#indexInput {
  border-right: 0;
}
#index .right_nav_wrap_index{
  width: 30%;
  /* float: right; */
  position: fixed;
  right: 1%;
  top: 25%;
}
#index .right_nav_wrap_index .index_right_nav_list{
  list-style: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
.right_nav_wrap_index .index_right_nav_list li{
  float: left;
  width: 50%;
  margin: 20px 0;
  text-align: left;
}
.right_nav_wrap_index .index_right_nav_list li.last_more_len{
  width: 100%;
}
.right_nav_wrap_index .index_right_nav_list a{
  color: #2d7eec;
  font-size: 20px;
  font-weight: bold;
}
</style>
