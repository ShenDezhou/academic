<template>
  <div class="one_stop_wrap main_wrap">
    <div class="content_wrap">
      <div class="header_wrap">
        <Publichead
          :activeIndex="headerArr.activeIndex"
          :logo_url="headerArr.logo_url"
          @handleSelect="handleSelect"
        ></Publichead>
      </div>
      <div class="content_main">
        <div class="header_search_wrap">
          <el-row>
            <div class="breadcrumb">
                    <span>
                        <a href="#/">首页</a>
                    </span>
              <span>
                        <i>></i>
                        <a href="#/lawsNew">法律法规</a>
                    </span>
              <span>
                        <i>></i>
                        <a href="#/lawsChange">法规变迁</a>
                    </span>
            </div>
          </el-row>
        </div>
        <div class="center_wrap">
          <el-container v-if="chlShow">
            <el-aside width="300px;" style="background-color:#fff;">
              <div v-for="(item, siderBarNum) in resData.sidebar" :key="siderBarNum">
                <sider-bar :siderData="item" :siderBarNum="siderBarNum" @secondmenu="secondMenu"></sider-bar>
              </div>
            </el-aside>
            <el-main class="center_el_main">
              <div id="textExample_faguiq">法规变迁</div>
              <div class="total_wrap">
                总共检索到
                <span class="total">{{totalNum}}</span>篇
                <el-input
                  v-model="queryWord.keyword"
                  size="mini"
                  placeholder="请输入检索内容"
                  @keyup.enter.native="searchOne"
                  @clear="searchOne"
                  clearable
                  style="margin-left:10px;width:250px">
                  <el-button slot="append" icon="el-icon-search" @click="searchOne"></el-button>
                </el-input>
              </div>
              <div id="content_wrap_main">
                <template >
                  <div v-if="totalNum==0">
                    <div class="no_data_wrap">
                      <img :src="no_data_logo" alt="未查询到相关数据">
                      <p class="one">未查询到相关数据</p>
                      <p class="two">建议您修改相关查询条件重新查询</p>
                    </div>
                  </div>
                  <div class="content_item_wrap" v-if="totalNum > 0" v-for="(item,index) in resDataTitle" :key="index">
                    <!-- {{item}} -->
                      <div class="exampleItemTitle_chkan" >
                        <template  v-if="item.RelatedLawsGidDic.length > 0">
                          <span @click="showChangeFigure(item,index)">
                            <span v-html="item.Title"></span>
                            <i title="查看变迁史" class="el-icon-date"></i>
                          </span>
                        </template>
                        <template  v-else>
                          <span>
                            <span v-html="item.Title"></span>
                          </span>
                        </template>
                      </div>
                      <ul class="change_ul_list">
                        <!-- <template v-if="RelatedLawsGidDic"></template> -->
                        <li class="item" v-for="(item1,index1) in item.RelatedLawsGidDic" :key="index1">
                          <a :href="'#/detail/'+'chl'+'/'+item1.gid" target="_blank">
                            {{index1+1}}、<span v-html="item.Title"></span> ({{ item1.name }})
                          </a>
                        </li>
                      </ul>
                  </div>
                  <template v-if="totalNum >0">
                    <div class="block" style="margin: 20px 0;">
                      <el-pagination style="text-align: center;"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[10,50,100,200,400]"
                        :page-size="10"
                        layout="prev, pager, next,sizes,jumper,->,total,slot"
                        :total="this.totalNum"
                        background
                      ></el-pagination>
                    </div>
                  </template>
                </template>
              </div>

              <!-- 图示展示 -->
              <div class="showChangeFigure_wrap">
                <el-dialog title="法规变迁图示" :visible.sync="showChangeFigureVisible" class="showChangeFigure_dialog_wrap">
                  <div class="changeFigure_main_wrap">
                    <ul class="ChangeFigure_wrap">
                      <template v-for="(itemFigure, indexFigure) in changeFigureData.relatedLawsGidDicList" >
                        <template v-if="itemFigure.type=='正本' || itemFigure.type=='整理版'">
                          <li class="item top" :key="indexFigure" :id="indexFigure" :style="{left:itemFigure.indexHistory*170+'px'}">
                            <a :href="'#/detail/'+'chl'+'/'+itemFigure.gid" target="_blank">{{itemFigure.name}}正本</a>
                            <span class="c-icon"></span>
                          </li>
                        </template>
                        <template v-if="itemFigure.type=='修正案'" :id="indexFigure" >
                          <li class="item bottom" :key="indexFigure" :style="{left:(itemFigure.indexFigueRe+1)*180+'px'}">
                            <a :href="'#/detail/'+'chl'+'/'+itemFigure.gid" target="_blank">{{itemFigure.name}}修改</a>
                          </li>
                        </template>
                      </template>
                      <template v-for="(itemc, indexc) in changeFigureData.changeHistoryList" >
                        <template>
                          <li class="item tips" :key="indexc" :style="{left:indexc*170+40 +'px'}">
                            <a :href="'#/detail/'+'chl'+'/'+itemc.startGid" target="_blank">{{itemc.name}}</a>
                            <div class="top-line">
                              <i class="el-icon-caret-left i-left-icon" ></i>
                              <i class="el-icon-caret-right i-right-icon"></i>
                            </div>
                          </li>
                        </template>
                      </template>
                    </ul>
                    <div class="ChangeFigure_wrap_hr" :style="{width:changeFigureData.allLength*120 +'px'}"  style="min-width:100%;">
                      <p class="one"></p>
                      <i class="el-icon-caret-right"></i>
                    </div>
                  </div>
                </el-dialog>
              </div>

            </el-main>

          </el-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import siderBar from "@/components/siderBar.vue";
  import cricaseSiderbar from "@/components/cricaseSiderBar.vue";
  import lawContent from "@/components/lawContent.vue";
  import lawNogroup from "@/components/lawNogroup.vue";
  import Publichead from "@/components/headerCommon";
  import { getZYLawSelect } from "../select_api";
  export default {
    name: "lawsChange",
    components: {
      siderBar,
      lawContent,
      lawNogroup,
      cricaseSiderbar,
      Publichead
    },
    data() {
      return {
        //变迁图示弹框
        showChangeFigureVisible: false,
        changeFigureData:{},
        resDataTitle:"",
        totalNum:10,
        total:0,
        pageSize:10,
        pagenum:1,
        no_data_logo:'../static/img/no_data.png',
        chlShow: true, //刑事法规显示
        danyuan:{
          name:'',
          items:[]
        },
        defalutNum: "-1",
        queryWord: {
          //刑事法规参数
          scope: "title", //顶部搜索框作用域
          sort: "date", //排序规则
          page: 1, //分页页码
          size: 10, //分页大小，
          index: "lbzlaw", //索引标识
          keyword: "", //顶部检索框字段值
          group: false, //是否分组查询(仅中央和地方)
          groupByIndex:2,//0:效力级别; 1:时效性; 2:不分组
          orderByIndex:0,//排序规则 0:发布日期倒序; 1:发布日期正序; 2:实施日期正序; 3:实施日期倒叙; 4:引用量倒叙(中央和地方可用)
          title: "", //右下侧结果中检索字段值
          filterList: [],
          tagJson:[],
          modules: [
            //需要返回数据模块
            1, //左侧聚类数据
            2, //上侧统计数据
            3 //右下侧结果列表
          ]
        },
        headerArr: {
          activeIndex: "",
          logo_url: "../../static/img/logoo.png"
        },
        tagJson: [],
        subChoseType: "lbzlaw",
        choseType:"",//默认选中
        keyword:"",//搜索关键字
        navbarVal: {
          cricase: "",
          cribookcontent: "",
          crilaw: "",
          crijournal: "",
          chl: "",
          lar: "",
          eagn: "",
          hkd: "",
          twd: ""
        },
        result:[

        ],
        searchType: false,
        resData:{
          maincontent: [],
          sidebar: [],
          navbar: {
            hkd: 20,
            twd: 41,
            cribookcontent: 5942,
            chl: 5817,
            lar: 35010,
            eagn: 133,
            cricase: 2222,
            crijournal: 322,
            crilaw: 4288
          }
        },//返回数据
      }

    },
    created() {
      // this.keyword = this.$route.params.keyword;
      this.choseType = "lbzlaw";
      document.title = this.$route.meta.title;
      this.searchMethod();
    },
    methods: {
      searchOne:function(){
        this.keyword = this.queryWord.keyword;
        this.searchMethod();
      },
      //搜索方法
      searchMethod: function()  {
        let data = this.queryWord;
        console.log('--------------法规变迁查询数据----------------------',data);
        this.axios.post(`/json`, data, {
          headers: { _api_name: "fb_criminal", _api_version: "1.0.0" }
        }).then(res => {
            console.log('-----------------法规变迁返回数据-------------------',res)
            if(res){
              this.resData = res.data;
              this.navbarVal = res.data.navbar;
              this.resDataTitle = res.data.maincontent[0].data;
              this.totalNum=res.data.maincontent[0].total;
              this.resDataTitle.forEach((ele,index)=>{
                console.log('-----------------类型-------------------',typeof ele.RelatedLawsGidDic)
                if(typeof ele.RelatedLawsGidDic == 'string'){
                  ele.RelatedLawsGidDic = [];
                }
              });
            //  console.log('-----------------法规变迁返回数据处理后-------------------',this.resDataTitle)
            }else{
              this.totalNum=0;
            }
          });
      },
      // 查看法规变迁图示
      showChangeFigure(item,index){
        console.log('图示接口参数---------------',item,index)

        this.axios.get(`/form?groupId=`+item.GroupId, {
          headers: {
            "Content-Type":"application/x-www-form-urlencoded",
            _api_name: "fb_xsfb_criminal_changeFigure",
             _api_version: "1.0.0"
          }
        }).then(res => {
          console.log('-----------------法规变迁图示返回数据-------------------',res)
          if(res.data.success){
            // this.changeFigureData = res.data.data;
            // this.changeFigureData =res.data.data.changeHistoryList.concat(res.data.data.relatedLawsGidDicList)
            // changeHistoryList
            // relatedLawsGidDicList
            // res.data.data.changeHistoryList.concat(res.data.data.relatedLawsGidDicList)

            // res.data.data.changeHistoryList.forEach((ele,index) => {
              let indexHistory = 0,indexFigueRe = 0;

              res.data.data.relatedLawsGidDicList.forEach((ele2,index2) => {
                if(ele2.type=="修正案"){
                  ele2.indexFigueRe = indexFigueRe;
                  indexFigueRe++;
                }else{
                  ele2.indexHistory = indexHistory;
                  indexHistory++;
                }
              });
            this.changeFigureData = res.data.data;
            this.changeFigureData.allLength = res.data.data.relatedLawsGidDicList.length;
            console.log('-----------------法规变迁图示返回数据修改-------------------',this.changeFigureData)
          }
        });
        // console.log(this.resDataTitle[index]);
        this.showChangeFigureVisible = true;
      },


      //二级菜单分类
      secondMenu: function(jueryData) {
        let filterList = this.filterList || [];
        for (let i in filterList) {
          if (jueryData.field == filterList[i].field) {
            filterList.splice(i, 1, jueryData);
            this.filterList = filterList;
            // this.queryWord.page = 1;
            this.searchMethod();
            return;
          }
        }
        filterList.push(jueryData);
        this.filterList = filterList;
        this.queryWord.filterList=this.filterList;
        this.searchMethod();
		  },
      handleSizeChange(val){
          this.pageSize=val;
          this.queryWord.page=this.pagenum;
          this.queryWord.size=val;
          this.searchMethod();
          $(document).scrollTop(0);
      },
      //分页
      handleCurrentChange(val){
        this.pagenum=val;
        this.queryWord.page=val;
        this.queryWord.size=this.pageSize;
        this.searchMethod();
        $(document).scrollTop(0);
      },
      //头部导航更改
			handleSelect(queryData) {
				console.log(queryData, "---------------------------------------------");
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .showChangeFigure_wrap{
    .showChangeFigure_dialog_wrap{
      .el-dialog{
        width: 780px;
      }
      .el-dialog__body{
        overflow: scroll;
      }
      .changeFigure_main_wrap{
        text-align: left;
        height: 300px;
        position: relative;
        .ChangeFigure_wrap{
          list-style: none;
          padding: 0;
          margin: 0;
          .item{
            height: 120px;
            text-align: center;
            display: inline-block;
            word-wrap: break-word;
            word-break: break-all;
            vertical-align: top;
            position: absolute;
            // position: relative;
            width: 20px;
            a{
              color: #333333;
            }
          }
          .item.top{
            margin: 0 10px 0 15px;
            .c-icon{
              display: inline-block;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              border: 1px solid #65beea;
              // margin-top: 17px;
              background-color: #fff;
              position: absolute;
              z-index: 999;
              left: 4px;
              bottom: -25px;
            }
          }
          .item.tips{
            height: auto;
            width: 140px;
            // position: absolute;
            // margin: 0 12px;
            margin-top: 35px;
            .top-line{
              border-bottom: 1px solid #65beea;
              width: 100%;
              // position: absolute;
              i{
                color: #65beea;
                // position: absolute;
                margin-top: -6px;

              }
              .i-left-icon{
                float: left;
                margin-left: -5px;
              }
              .i-right-icon{
                float: right;
                margin-right: -5px;
              }

            }
          }
          .item.bottom{
            margin-top: 160px;
            // margin-left: -30px;
          }
        }
        .ChangeFigure_wrap_hr{
          width: 100%;
          position: absolute;
          top: 140px;
          .one{
            border-bottom: 2px solid #65beea;
            // min-width: 740px;
            position: absolute;
            width: 99%;
            display: inline-block;
          }
          i{
            float: right;
            margin-top: -6px;
            z-index: 66;
            color: #65beea;
          }
        }
      }
    }
  }
  .red{
    color: #ff0000;
  }
</style>
<style scoped lang="less">

.center_el_main {
    padding: 0;
    margin-left: 10px;
    border: 1px solid #a9c4df;
  }
  .center_wrap {
    padding: 10px;
  }
  .total_wrap {
    color: #7a7a7a;
    font-size: 14px;
    text-align: left;
    border-bottom: 1px solid #a9c4df;
    padding: 10px;
  }
  .total_wrap span {
    color: #409eff;
  }
  .content_wrap {
    border: 1px solid #a9c4df;
    background-color: #ffffff;
    margin-bottom: 20px;
    /* max-width: 1460px; */
  }

  #textExample_faguiq {
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
  .exampleItemTitle_chkan{
    text-align: left;
    font-size: 16px;
    color:#333333;
    cursor: pointer;
  }
  .exampleItemTitle_chkan>span:hover,
  .change_ul_list li a:hover{
    color: #409eff;
  }
  #content_wrap_main{
    padding: 20px 30px;
    box-sizing: border-box;
  }
  .content_item_wrap{
    border-bottom: 1px dashed #a9c4df;
    padding: 10px;
  }
  .change_ul_list{
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .change_ul_list li{
    text-align: left;
    margin: 5px 5px 5px 5px;
    color: #879bba;
    font-size: 14px;
    text-indent: .5em;
    line-height: 160%;
  }
  .change_ul_list li a{
    color: #879bba;
    font-size: 14px;
  }
  .breadcrumb {
    clear: both;
    font-size: 12px;
    padding-left: 10px;
    height: 40px;
    line-height: 40px;
    color: #879bba;
    text-align: left;
    border-bottom: 1px solid #a9c4df;
  }
  .breadcrumb span {
    padding-left: 10px;
  }

  .breadcrumb a {
    cursor: pointer;
    color: #879bba;
    padding-left: 10px;
  }
  .breadcrumb a:hover {
    cursor: pointer;
    color: #218fc4;
  }
</style>
