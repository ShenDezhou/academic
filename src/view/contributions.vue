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
                            <a href="#/2020">2020年总结</a>
                        </span>
            </div>
          </el-row>
        </div>
        <div class="center_wrap">
          <el-container>
            <el-aside width="210px">
              <div class="nav_left_wrap onstopSearch_left_nav"
                   :style="navBarFixed ? 'position: fixed;top: 150px;z-index: 666;' : ''"
                   @click="goToAim($event)">
                <div data-v-21e53028 id="label_daohang">导航</div>
                <el-timeline>
                  <el-timeline-item color="#4084f0" id="0">
                    2022年科学技术总结
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-aside>
            <el-main class="onstopmain">
              <div class="content_main_wrap">
                <div v-html="inner_content_2022"></div>
              </div>
            </el-main>
          </el-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Publichead from "@/components/headerCommon";
import {getZYLawSelect} from "../select_api";
import {getAggs, getCases, addSearch, getJSON, getCollectList} from "../api";

export default {
  name: "models",
  components: {
    Publichead
  },
  data() {
    return {
      navbarVal: {
        lawsTotal: 0,
        exampleTotal: 0,
        journalTotal: 0
      },
      scroll: '',// 是否滚动
      navBarFixed: false,
      model: "pubseg",//分词模型
      keyword: "", //搜索框
      select: '1',//搜索范围选中
      no_data_logo: '../static/img/no_data.png',
      //是否模糊查询 2 模糊 1精确
      radio_fuzzy: "1",
      radio_type: "",
      headerArr: {
        activeIndex: "",
        logo_url: "../../static/img/logo.png"
      },
      lawsList: [],
      originList: [],
      segsList: [],
      newslist: [],
      cocafamilies: [],
      exampleList: [],
      journalList: [],
      journalNavbar: {},
      lawsNavbar: {},
      exampleNavbar: {},
      rawsentences: {
        sents: '',
        model: ''
      },
      lawsForm: {
        scope: "default", //顶部搜索框作用域
        sort: "date", //排序规则
        page: 1, //分页页码
        size: 10, //分页大小，
        index: "chl", //索引标识
        keyword: "", //顶部检索框字段值
        group: false, //是否分组查询(仅中央和地方)
        title: "", //右下侧结果中检索字段值
        orderByIndex: 0,
        groupByIndex: 2,
        filterList: [],
        modules: [
          1,
          2,
          3 //右下侧结果列表
        ],
        tagJson: [],
      },
      exampleForm: {
        scope: "title", //顶部搜索框作用域
        sort: "date", //排序规则
        page: 1, //分页页码
        size: 10, //分页大小，
        index: "pfnl", //索引标识
        keyword: "", //顶部检索框字段值
        group: false, //是否分组查询(仅中央和地方)
        title: "", //右下侧结果中检索字段值
        orderByIndex: 0,
        groupByIndex: 2,
        filterList: [],
        modules: [
          1,
          2,
          3 //右下侧结果列表
        ],
        tagJson: [],
      },
      qikanForm: {
        scope: "title", //顶部搜索框作用域
        sort: "date", //排序规则
        page: 1, //分页页码
        size: 10, //分页大小，
        index: "qikan", //索引标识
        keyword: "", //顶部检索框字段值
        group: false, //是否分组查询(仅中央和地方)
        title: "", //右下侧结果中检索字段值
        orderByIndex: 0,
        groupByIndex: 2,
        filterList: [],
        modules: [
          1,
          2,
          3 //右下侧结果列表
        ],
        tagJson: [],
      },
      choseType_law: 'chl',
      choseType_ex: 'pfnl',
      choseType_jou: 'qikan',
      total_law: -1,
      total_exp: -1,
      total_jou: -1,
      lawsShow: true,//默认分页不显示
      jouralShow: true,
      exampleShow: true,
      //加载
      lawsShowLoad: false,
      jouralShowLoad: true,
      exampleShowLoad: true,
      typeScope: 'title',
      //分库数量
      total_eagn: 0,
      total_iel: 0,
      total_hkd: 0,
      total_aom: 0,
      total_legislation: 0,
      total_twd: 0,
      total_protocol: 0,
      total_lawexplanation: 0,
      total_whitebook: 0,
      total_workreport: 0,
      total_chl: 0,
      total_lar: 0,
      total_pfnl: 0,
      total_payz: 0,
      total_gac: 0,
      total_bankruptcy: 0,
      total_pal: 0,
      total_atr: 0,
      inner_content_2022:""

    }
  },
  created: function () {
    document.title = this.$route.meta.title;
    this.keyword = this.$route.params.keyword;
    //
    // //360 搜索传词
    // // 获取页面url
    // var curUrl = window.location.href
    // var curIndex = curUrl.lastIndexOf("?");
    // if (curIndex != -1) {
    //     // 获取问号后面参数
    //     var targetData = curUrl.substring(curIndex + 1, curUrl.length)
    //     // 将问号后面参数转换成json
    //     var objJson = {}
    //     targetData.split("&").forEach((item) => {
    //         objJson[item.split("=")[0]] = item.split("=")[1]
    //     })
    //     console.log('--------------搜索传参-----------------', objJson);
    //     for (let curItem in objJson) {
    //         // console.log(curItem)
    //     }
    //     let curKeyword_360 = decodeURIComponent(objJson.q) == undefined ? "" : decodeURIComponent(objJson.q);
    //     this.keyword = curKeyword_360;
    //     sessionStorage.setItem("curKeyword_360", curKeyword_360);
    //     // localStorage.setItem("curKeyword_360", curKeyword_360);
    //
    //     // maybe
    //     // // base64加密的数据
    //     // var Base64 = require('js-base64').Base64;
    //     // if (objJson.yhxx != undefined) {
    //     //     // 用户信息
    //     //     var token = objJson.yhxx;
    //     //     // console.log(token)
    //     //     if(token.lastIndexOf('/') == token.length - 1){
    //     //         token=token.substring(0,token.lastIndexOf('/'));
    //     //     }
    //     //     // console.log(token)
    //     //     var userInfo = JSON.parse(decodeURIComponent(Base64.decode(decodeURIComponent(token))));
    //     //     // 部门受案号
    //     //     var bmsah = decodeURIComponent(Base64.decode(decodeURIComponent(objJson.bmsah)));
    //     //     let tandu = {
    //     //         token: userInfo.dlrdwbm,//登录人单位编码
    //     //         userId: userInfo.rybm,//人员编码
    //     //         ryxm:userInfo.ryxm,//人员姓名
    //     //         dlrbmbm:userInfo.dlrbmbm,//登录人员部门编码
    //     //         bmsah:bmsah//案件部门受案号
    //     //     };
    //     //     sessionStorage.setItem("tandu", JSON.stringify(tandu));
    //     //     sessionStorage.setItem("obj", JSON.stringify(objJson));
    //     // }
    // }
    this.axios({
      method: 'GET',
      url: '../../static/2022.html',
      params: {}
    }).then(res => {
      console.log('-----------------01返回数据-------------------', JSON.stringify(res.data));
      this.inner_content_2022 = res.data
      // this.navbarVal = res.data.navbar;
      // this.lawsNavbar = res.data.navbar;
    });
    // this.newslist.push({title:'2020', content:'2020年5月，本人独立完成的论文Lower Bounds on Rate of Convergence of Matrix ProduLcts in All Pairs Shortest Path of Social Network向NeurIPS 2020提交，NeurIPS是人工智能与机器学习顶级会议。'})
    // this.lawsForm.keyword=this.keyword;
    // this.exampleForm.keyword=this.keyword;
    // this.qikanForm.keyword=this.keyword;
    // this.searchMethod_law(this.lawsForm);
    // this.searchMethod_exp(this.exampleForm);
    // this.searchMethod_jou(this.qikanForm);
  },
  methods: {
    modelChange(val, type) {
      this.model = val
    },
    //搜索范围更改
    titleChange(val, trpe) {
    },
    //搜索
    getList() {
      // this.searchMethod();
      // var url = this.$route.path;
      // addSearch(this.keyword, url);

      // this.lawsForm.keyword=this.keyword;
      // this.exampleForm.keyword=this.keyword;
      // this.qikanForm.keyword=this.keyword;
      // this.searchGetSegments(this.keyword);
      // this.cocafamilies = cocaFamily(this.keyword)
      // this.searchMethod_exp(this.exampleForm);
      // this.searchMethod_jou(this.qikanForm);
    },
    //头补选中
    handleSelect(queryData) {
      // console.log(queryData, "----------------------------------------	-----");
    },
    searchGetSegments(data) {
      //预处理超过1019字的句子
      var rawdata = data.split('\n');
      var preprocess = [];
      for (var word of rawdata) {
        if (word.split(" ").join("").trim().length > 1019) {
          var segs = word.split("。").map(x => x + "。")
          preprocess.concat(segs);
        } else {
          preprocess.push(word);
        }
      }
      //过滤空串
      this.originList = preprocess.filter(word => word.trim().length > 0 && word.trim() != "。");
      //构造字典
      this.rawsentences.sents = this.originList.map(word => word.split(" ").join(""));
      this.rawsentences.model = this.model;
      this.lawsShowLoad = true;
      this.axios.post(`http://192.168.4.250:8090/segment`, this.rawsentences, {
        headers: {_api_name: "fb_criminal", _api_version: "1.0.0", 'Access-Control-Allow-Origin': '*'}
      }).then(res => {
        console.log('-----------------01返回数据-------------------', res);
        this.lawsShowLoad = false;
        if (res.data.data.seg.length > 0) {

          this.segsList = res.data;
          this.total_law = 1;
        } else {
          this.total_law = 0;
        }
      });
    },
    searchMethod_law(data) {
      this.lawsShowLoad = true;
      this.axios.post(`/json`, data, {
        headers: {_api_name: "fb_criminal", _api_version: "1.0.0"}
      }).then(res => {
        // console.log('-----------------01返回数据-------------------',res);
        this.lawsShowLoad = false;
        if (res.data.maincontent.length > 0) {
          this.lawsList = res.data.maincontent[0];
          this.total_law = res.data.maincontent[0].total;
          if (res.data.maincontent[0].pathToResult) {
            this.total_law = 0;
          }
        } else {
          this.total_law = 0;
        }
        this.navbarVal = res.data.navbar;
        this.lawsNavbar = res.data.navbar;
      });
    },
    searchMethod_exp(data) {
      this.exampleShowLoad = true;
      // console.log('-----------------02参数-------------------',data);
      this.axios.post(`/json`, data, {
        headers: {_api_name: "fb_criminal", _api_version: "1.0.0"}
      }).then(res => {
        console.log('-----------------02返回数据-------------------', res);
        this.exampleShowLoad = false;
        if (res.data.maincontent.length > 0) {
          this.exampleList = res.data.maincontent[0];
          this.total_exp = res.data.maincontent[0].total;
          if (res.data.maincontent[0].pathToResult) {
            this.total_exp = 0;
          }
        } else {
          this.total_exp = 0;
        }
        this.navbarVal = res.data.navbar;
        this.exampleNavbar = res.data.navbar;
      });
    },
    searchMethod_jou(data) {
      this.jouralShowLoad = true;
      this.axios.post(`/json`, data, {
        headers: {_api_name: "fb_criminal", _api_version: "1.0.0"}
      }).then(res => {
        console.log('-----------------03返回数据-------------------', res);
        this.jouralShowLoad = false;
        if (res.data.maincontent.length > 0) {
          this.journalList = res.data.maincontent[0];
          this.total_jou = res.data.maincontent[0].total;
          if (res.data.maincontent[0].pathToResult) {
            this.total_jou = 0;
          }
        } else {
          this.total_jou = 0;
        }
        this.navbarVal = res.data.navbar;
        this.journalNavbar = res.data.navbar;

      });
    },

    selectIndex(index) {
      this.choseType_law = index;
      this.lawsForm.index = index;
      this.lawsForm.page = 1;
      this.searchMethod_law(this.lawsForm);
    },
    selectIndex_ex(index) {
      this.choseType_ex = index;
      this.exampleForm.index = index;
      this.exampleForm.page = 1;
      this.searchMethod_exp(this.exampleForm);
    },
    selectIndex_jou(index) {
      console.log(111111111111111111),
        this.choseType_jou = index;
      this.qikanForm.index = index;
      this.qikanForm.page = 1;
      this.searchMethod_jou(this.qikanForm);
    },
    handleSizeChange(val) {
      //一页几条
      this.lawsForm.size = val;
      this.searchMethod_law(this.lawsForm);
      $(document).scrollTop($("#lawsNew_wrap_main").offset().top);
    },
    handleCurrentChange(val) {
      //页码更改
      this.lawsForm.page = val;
      this.searchMethod_law(this.lawsForm);
      $(document).scrollTop($("#lawsNew_wrap_main").offset().top);
    },
    handleSizeChange_exp(val) {
      //一页几条
      this.exampleForm.size = val;
      this.searchMethod_exp(this.exampleForm);
      $(document).scrollTop($("#example_wrap_main").offset().top);
    },
    handleCurrentChange_exp(val) {
      //页码更改
      this.exampleForm.page = val;
      this.searchMethod_exp(this.exampleForm);
      $(document).scrollTop($("#example_wrap_main").offset().top);
    },
    handleSizeChange_jou(val) {
      //一页几条
      this.qikanForm.size = val;
      this.searchMethod_jou(this.qikanForm);
      $(document).scrollTop($("#journal_wrap_main").offset().top);
    },
    handleCurrentChange_jou(val) {
      //页码更改
      this.qikanForm.page = val;
      this.searchMethod_jou(this.qikanForm);
      $(document).scrollTop($("#journal_wrap_main").offset().top);
    },
    clickMoreMethod() {
      //点击查看更多
      this.lawsShow = true;
    },
    clickMoreMethod_exp() {
      this.exampleShow = true;
    },
    clickMoreMethod_jou() {
      this.jouralShow = true;
    },
    menu() {
      this.scroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (this.scroll > 230) {
        // console.log(this.scroll,'ddddddddddd')
        this.navBarFixed = true;
      } else {
        // console.log(this.scroll,'juli')
        this.navBarFixed = false;
      }
      // console.log(this.scroll,'距离变化')
      let oneTop = $("#lawsNew_wrap_main").offset().top - 10;
      let twoTop = $("#example_wrap_main").offset().top - 10;
      let threeTop = $("#journal_wrap_main").offset().top - 10;
      // console.log(oneTop,twoTop,threeTop)
      if (this.scroll >= oneTop && this.scroll < twoTop) {
        $("#1").addClass('active').siblings().removeClass('active');
      } else if (this.scroll >= twoTop && this.scroll < threeTop) {
        $("#2").addClass('active').siblings().removeClass('active');
      } else if (this.scroll >= threeTop) {
        $("#3").addClass('active').siblings().removeClass('active');
      } else {
        $("#0").addClass('active').siblings().removeClass('active');
      }
    },
    goToAim(e) {
      if ($(e.target).attr('class') == 'el-timeline-item__content') {
        let val = $(e.target).parents(".el-timeline-item").attr('id');
        $(e.target).parents(".el-timeline-item").addClass('active').siblings().removeClass('active');
        if (val == '1') {
          $(document).scrollTop($("#lawsNew_wrap_main").offset().top);
        } else if (val == '2') {
          $(document).scrollTop($("#example_wrap_main").offset().top);
        } else if (val == '3') {
          $(document).scrollTop($("#journal_wrap_main").offset().top);
        } else {
          $(document).scrollTop(0);
        }
      }
    },
  },
  watch: {},
  mounted() {
    window.addEventListener('scroll', this.menu);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.onstopSearch_left_nav {
  border: 1px solid #a9c4df;
  width: 208px;
}

.nav_left_wrap.onstopSearch_left_nav .el-timeline-item.active .el-timeline-item__content {
  color: #165ac6 !important;
}

.nav_left_wrap.onstopSearch_left_nav .el-timeline-item__tail {
  position: absolute;
  left: 20px;
  height: 120%;
  border-left: 2px solid #4084f0;
}

.nav_left_wrap.onstopSearch_left_nav .el-timeline-item__content {
  text-align: left;
  padding-left: 10px;
  font-size: 16px;
  color: #2d405e;
  cursor: pointer;
}

.nav_left_wrap.onstopSearch_left_nav .el-timeline-item__content:hover {
  color: #165ac6;
}

.nav_left_wrap.onstopSearch_left_nav .el-timeline-item__node--normal {
  left: 15px;
  width: 12px;
  height: 12px;
  top: 2px;
}

.nav_left_wrap.onstopSearch_left_nav .el-timeline {
  margin: 20px 0;
}


#label_daohang {
  border-top: 2px solid #a8bdce;
  background-color: #daedfb;
  /* font-weight: bold; */
  font-style: normal;
  font-size: 16px;
  text-align: left;
  padding-left: 15px;
  height: 38px;
  line-height: 38px;
  color: #2d405e;
}

.onstopmain {
  padding: 0 !important;
  margin-left: 20px;
}

.nerong_wrap {
  min-height: 200px;
}

.content_main_wrap .lawsNew_wrap,
.content_main_wrap .example_wrap,
.content_main_wrap .journal_wrap {
  border: 1px solid #a9c4df;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.clickMore {
  margin: 20px 0 0 0;
}

.clickMore button {
  width: 300px;
}

.list_wrap_main {
  padding: 0 20px 20px 20px;
}

.onestoptxt {
  margin-right: 5px;
  display: inline-block;
  height: 100%;
  /* vertical-align: text-bottom;
   */
  line-height: 40px;
  float: left;
}

.fagui_bian_wrap_lin {
  display: inline-block;
  font-weight: 400;
  font-style: normal;
  font-size: 13px;
  color: #879bba;
  line-height: 40px;
  height: 40px;
  display: inline-block;
  cursor: pointer;
  margin-left: 15px;
}

.fagui_bian_wrap_lin a {
  font-size: 13px;
  color: #879bba;
}

.fagui_bian_wrap_lin a:hover {
  color: #4da0fb;
}

.no_data_wrap {
  padding: 50px;
  box-sizing: border-box;
}

.no_data_wrap img {

}

.no_data_wrap .one {

}

.no_data_wrap .two {
  color: #879bba;
  font-size: 13px;
}

/* 模态框 */
.el-dialog__header {
  padding: 0;
  height: 40px;
  background-color: #4084f0;
  line-height: 40px;
  color: #ffffff;
  text-align: left;
  padding-left: 15px;
}

.el-dialog__header span {
  color: #ffffff;
  font-size: 16px;
}

.el-dialog__header .el-dialog__headerbtn {
  top: 0;
  width: 40px;
  height: 40px;
  right: 0;
}

.el-dialog__header .el-dialog__headerbtn:hover {
  background-color: #f5b923;
  color: #ffffff;
}

.el-dialog__headerbtn:hover .el-dialog__close {
  color: #ffffff;
}

.el-dialog {
  border-radius: 5px;
  overflow: hidden;
}

.el-dialog__header .el-dialog__headerbtn i {
  font-size: 14px;
  color: #c4dcf4;
}

/* 模态框 */
.jians_conditions {
  color: #5c79b0;
  font-size: 14px;
  width: 96%;
  margin: 0 auto;
  /* margin-bottom: 5px; */
  margin-top: 10px;
  overflow: hidden;
}

.center_el_main {
  padding: 0;
  margin-left: 10px;
  border: 1px solid #a9c4df;
}

.jians_conditions_wrap {
  min-height: 32px;
  border-bottom: 1px solid #a9c4df;
}

.conditions_left,
.conditions_icon_clean,
.conditions_right {
  float: left;
}

.conditions_left {
  width: 6%;
  text-align: left;
}

.conditions_right {
  width: 88%;
  text-align: left;
}

.conditions_right li {
  display: inline-block;
  color: #879bba;
  font-size: 12px;
  border: 1px solid #879bba;
  border-radius: 4px;
  padding: 3px 10px;
  margin-right: 5px;
  margin-bottom: 8px;
}

.conditions_right li .error_item {
  margin-left: 5px;
  font-size: 14px;
  cursor: pointer;
}

.conditions_icon_clean {
  width: 5%;
  cursor: pointer;
  font-size: 13px;
  color: #409eff;
}

.center_wrap {
  padding: 10px;
}

ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

.radio_main_wrap ul {
  text-align: left;
  padding-left: 120px;
  margin-bottom: 10px;
}

.radio_main_wrap ul li {
  display: inline-block;
}

.radio_qing_mo a {
  color: #879bba;
  font-size: 13px;
}

.radio_main_wrap ul li.fuzzy_wrap {
  height: 17px;
  border-right: 1px solid #cad0d7;
  margin: 0 15px;
}

.el-radio {
  color: #879bba !important;
  margin-right: 20px;
}

#onestopSearch .search_input_wrap {
  width: 89% !important;
}

#onestopSearch .search_select_wrap {
  width: 110px;
  background-color: #ffffff !important;
  /* border: 1px solid #a9c4df; */
  margin: 0;
}

#onestopSearch .el-input-group__prepend {
  padding: 0;
  border-radius: 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  overflow: hidden;
  /* border: 1px solid #a9c4df; */
}

#onestopSearch .search_select_wrap .el-input__inner {
  padding: 0 10px;
  text-align: center;
  height: 38px;
  /* border: none; */
}

.el-input__inner {
  /* border: 1px solid #a9c4df; */
  color: #879bba !important;
}

.el-select-dropdown__item {
  color: #879bba !important;
}

.el-tree-node__content {
  padding-right: 20px;
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

.search_inpu_one {
  margin: 20px 0;
}

.el-menu--horizontal li.is-active {
  color: #4084f0 !important;
}

.el-menu-vertical-demo.el-menu--horizontal.el-menu li {
  height: 40px !important;
  line-height: 40px !important;
  color: #5c79b0 !important;
}

.el-menu-vertical-demo.el-menu--horizontal.el-menu li .el-submenu__title, .el-menu-vertical-demo.el-menu--horizontal.el-menu li .el-submenu__title i {
  height: 40px;
  line-height: 43px;
  border-bottom: none !important;
  color: #5c79b0 !important;
  font-size: 16px;
}

.el-menu-vertical-demo.el-menu--horizontal.el-menu li.is-active {
  color: #165ac6 !important;
  border-bottom: 2px solid #165ac6 !important;
}

.content_wrap {
  border: 1px solid #a9c4df;
  background-color: #ffffff;
  margin-bottom: 20px;
  /* max-width: 1460px; */
}

#filerSelect {
  padding: 15px 10px;
  text-align: left;
  border-bottom: 1px solid #a9c4df;
  font-size: 14px;
  color: #879bba;
}

#filerSelect .el-select {
  padding-right: 18px;
  margin-bottom: 10px;
}

#textExample {
  border-top: 2px solid #a8bdce;
  background-color: #daedfb;

  /* font-weight: bold; */
  font-style: normal;
  font-size: 16px;
  text-align: left;
  padding-left: 15px;
  height: 38px;
  line-height: 38px;
  color: #2d405e;
}

#lawsNew .el-select .el-input {
  width: 130px;
}

#lawsNew .input-with-select .el-input-group__prepend {
  background-color: #fff;
}

#lawsNew .row-bg {
  padding: 15px 0;
}

.tab_nav_wrap .el-menu--horizontal {
  padding: 0 10px;
  border-bottom: solid 1px #a9c4df;
}

#lawsNew .el-container {
  height: 100%;
}

#lawsNew .el-row .el-row {
  text-align: left;
  margin-left: 10px;
  margin-top: 48px;
}

#lawsNew .el-container .el-header {
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  height: 200px !important;
}

#lawsNew .el-header #lawsNewDiv {
  color: #333;
  text-align: left;
  line-height: 40px;
  height: 40px;
  border-bottom: 1px solid #a8a9aa;
  padding-left: 10px;
  box-sizing: border-box;
  margin-bottom: 10px;
}

#lawsNewDiv span {
  display: inline-block;
  padding: 10px 10px 0;
  height: 40px;
  border-bottom: 2px solid #0171b1;
  font-weight: 700;
  font-style: normal;
  font-size: 18px;
  color: #0171b1;
  text-align: center;
  box-sizing: border-box;
}

#onestopSearch .el-aside {
  background-color: #e3f1fa;
  color: #4f4f8a;
  text-align: left;
  height: calc(100% - 20px);
  width: calc(100% - 20px);
  margin: 10px;
}

#onestopSearch .el-main {
  color: #4f4f8a;
  height: calc(100% - 20px);
  width: calc(100% - 20px);
  margin: 10px 0;
  border: 1px solid #ccc;
}


.filerSelect_ul {
  overflow: hidden;
}

.filerSelect_ul li {
  float: left;
}

.filerSelect_ul li .el-select {
  margin-bottom: 0px !important;
  width: 120px;
}

.filerSelect_ul li .el-select .el-input__inner {
  height: 35px;
  line-height: 35px;
}

.filerSelect_ul li .el-select .el-input__icon {
  line-height: 35px;
}

#dialog-two .el-form-item label {
  width: 115px !important;
}

#dialog-two .eagn_label label {
  width: 80px !important;
}
</style>
<style scoped>
.breadcrumb {
  clear: both;
  font-size: 12px;
  padding-left: 10px;
  height: 40px;
  line-height: 40px;
  color: #879bba;
  text-align: left;
  border-bottom: 1px solid #a9c4df;
  border-top: 1px solid #a9c4df;
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

#lawsNew {
  width: 100%;
  min-height: 100%;
  border: 1px solid #797979;
  background-color: #fff;
  box-sizing: border-box;
}

#lawsNewWrap {
  width: 100%;
  height: 100%;
  padding: 2%;
  box-sizing: border-box;
}

.advancedRetrieval {
  font-weight: 400;
  font-style: normal;
  font-size: 13px;
  color: #879bba;
  line-height: 40px;
  height: 40px;
  display: inline-block;
  cursor: pointer;
}

.advancedRetrieval:hover {
  color: #4da0fb;
}

#advancedRetrieval {
  float: right;
  text-align: right;
  padding-right: 20px;
}

.ckxq_wrap {
  text-align: right;
  margin: 0;
  margin-bottom: 10px;
}

.ckxq_wrap a {
  color: #82a6df !important;
}

.ckxq_wrap a:hover {
  color: #4f5e7b !important;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.contentTitle_onestop a {
  color: #4f5e7b;
}

.contentCon {
  color: #879bba;
  font-size: 14px;
  margin: 10px 0;
}

.contentConcrijournal {
  color: #219CD4;
}

.contentConcrijournal span {
  color: #999;
}

.pagination_onestop {
  text-align: center;
  padding-top: 40px;
  margin-bottom: 20px;
  padding-left: 15px;
}

.red {
  color: red;
}

.content_mian_wrap_one {
  padding: 20px 60px 20px 30px;
  box-sizing: border-box;
  border-bottom: 1px dashed #a9c4df;
  text-align: left;
  position: relative;
}

.circle {
  position: absolute;
  left: 15px;
  top: 30px;
  display: block;
  width: 8px;
  height: 8px;
  border: 1px solid #a7a7a7;
  border-radius: 50%;
}

.contentTitle_onestop {
  line-height: 30px;
}

.content_mian_wrap_one a {
  text-decoration: none;
  color: #4f5e7b;
  text-align: left;
  outline: none;
}

.contentCon_display {
  display: inline-block;
}
</style>
<style scoped>
.textarea >>> .el-textarea__inner {
  font-family: "Microsoft" !important;
  font-size: 20px !important;
}
</style>
