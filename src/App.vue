<template>
  <div id="app">
    <backtop>
      <router-view />
    </backtop>
  </div>
</template>

<script>
import BackTop from '@/components/BackTop'

export default {
  name: "App",
  components: {
    'backtop': BackTop
  },
  data() {
    return {
      cookies:'',
    }
  },
  mounted() {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
      window.addEventListener(
        "hashchange",
        () => {
          let currentPath = window.location.hash.slice(1);
          console.log(currentPath,'...............................')
          if (this.$route.path !== currentPath) {
            this.$router.push(currentPath);
          }
        },
        false
      );
    }

    // 360 获取cookie 接口
    let _this =this;
    external.AppCmd(external.GetSID(window),'','getUnion2Cookie','','',function(code,data) {
      console.log(code,data,'-----------------cookie获取到了吗------------------------')
      if(code == 0 ){
        // 解析 以 ; 解析
        var Base64 = require('js-base64').Base64;
        this.cookies = data;
        var cookiesArr = JSON.parse(data);
        // console.log(cookiesArr,'///////////////////////////////')
        // let curCookies = data.replace(/\s*/g,"").split(';');
        // // console.log("curCookies:",curCookies);
        // let cookiesArr = {}
        // curCookies.forEach((item) => {
        //   cookiesArr[item.split("=")[0]] = item.split("=")[1];
        // });
        // // console.log("cookiesArr:",cookiesArr);

        // if(cookiesArr.yhxx.lastIndexOf('/') == cookiesArr.yhxx.length - 1){
        //   cookiesArr.yhxx=cookiesArr.yhxx.substring(0,cookiesArr.yhxx.lastIndexOf('/'));
        // }
        if(cookiesArr.yhxx){
          let cookiesJson = JSON.parse(decodeURIComponent(Base64.decode(decodeURIComponent(cookiesArr.yhxx))));
          // console.log(cookiesJson,'///////////////////////////////')
          let dwmc = unescape(cookiesArr.dwmc);
          // console.log(cookiesJson,'uesringo')
          // console.log(dwmc,'dwmc');
          let tandu = {
            token: cookiesJson.dlrdwbm,//登录人单位编码
            userId: cookiesJson.rybm,//人员编码
            ryxm:cookiesJson.ryxm,//人员姓名
            dlrbmbm:cookiesJson.dlrbmbm[0],//登录人员部门编码
            // bmsah:bmsah,//案件部门受案号
            jsbm:cookiesJson.jsbm[0],
            dlbm:cookiesJson.dlbm,
            dwbm:cookiesArr.dwbm,//单位编码
            dwmc:dwmc
          };
          sessionStorage.setItem("tandu", JSON.stringify(tandu));
          _this.$cookies.set("tandu",JSON.stringify(tandu));
        }else{
          console.log('cookies暂未获取到有用信息!请重新获取！');
        }
      }else{
        console.log('cookies暂未获取到!请重新获取！');
      }
    });
// var jslx=getQueryVariable("jslx");
// var q=getQueryVariable("q");
//       console.log(jslx);
//       if(jslx=="flfg"){
//     this.$router.push({ name: "lawsNew", params: { keyword: q} });
// }else if(jslx=="sfal"){
//     this.$router.push({ name: "example", params: { keyword: q} });
// }else if(jslx=="fxqk"){
//     this.$router.push({ name: "journalLaw", params: { keyword: q} });
//       }


  //   // 获取页面url
  //  var url = window.location.href
  //  var index = url.lastIndexOf("?");
  //  // 获取问号后面参数
  //  var target = url.substring(index + 1,url.length)
  //  // 将问号后面参数转换成json
  //  var obj = {}
  //  target.split("&").forEach((item) => {
  //    obj[item.split("=")[0]] = item.split("=")[1]
  //  })
  //  // base64加密的数据
  //  var Base64 = require('js-base64').Base64;

  //   if (obj.yhxx != undefined) {
	// 		// 用户信息
	// 		var token = obj.yhxx;
	// 		// console.log(token)
	// 		if(token.lastIndexOf('/') == token.length - 1){
	// 			token=token.substring(0,token.lastIndexOf('/'));
	// 		}
	// 		// console.log(token)
  //     var userInfo = JSON.parse(decodeURIComponent(Base64.decode(decodeURIComponent(token))));
  //     // console.log(userInfo,'uesringo')
  //     // 部门受案号
  //     var bmsah = decodeURIComponent(Base64.decode(decodeURIComponent(obj.bmsah)));
  //     let tandu = {
  //       token: userInfo.dlrdwbm,//登录人单位编码
  //       userId: userInfo.rybm,//人员编码
	// 			ryxm:userInfo.ryxm,//人员姓名
	// 			dlrbmbm:userInfo.dlrbmbm,//登录人员部门编码
  //       bmsah:bmsah//案件部门受案号
  //     };
  //     // console.log(tandu,'-----------tandu--------',obj)
  //     sessionStorage.setItem("tandu", JSON.stringify(tandu));
  //     sessionStorage.setItem("obj", JSON.stringify(obj));


      // 调用接口
      // let data = {
      //   "bmsah": [
      //     // "东检刑诉受[2019]00137号"
      // 		bmsah
      //   ]
      // }
      // this.axios.post("/ajfw-service/api/interface/hqAjhzrrjbxxlb",data).then((res) => {
      //   console.log(res)
      // })
    // }
  }
};
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
</script>

<style lang="less">
  .el-main{
    padding: 0 !important;
  }
  .main_wrap {
    max-width: 100%;
    min-width:1200px;
    height: 100%;
    padding: 2% 5%;
    box-sizing: border-box;
    background-color: transparent;
    /* overflow: hidden; */
  }
  .search_inpu_one.el-row .el-col.el-col-21 .el-button.primary-btn-main.el-button--primary{
    float: right;
    margin-right: 20px;
  }
  .search_inpu_one.el-row .el-col.el-col-21 .searchInput .el-button.primary-btn-main.el-button--primary{
    float: right;
    margin-right: 0px;
  }
#app {
  font-family: 'Microsoft YaHei',Arial,"Avenir", Helvetica,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #4f5e7b;
  height: 100%;
  position: relative;
  font-size: 16px;
  min-height: 912px;
}
a:hover {
  cursor: pointer;
  color: #165ac6;
}
a {
  color: #0193d2;
  text-decoration: none;
}
.el-tree-node{
  white-space: normal;
  outline: 0;
  text-align: left;
}
.el-tree-node__content{
  min-height: 26px;
  height: auto;
}
.el-aside{
  width: 210px;
}
.el-dialog__body{
  padding: 15px 20px !important;
}
.el-form-item{
  margin-bottom: 20px;
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
.no_data_wrap{
  padding: 50px;
  box-sizing: border-box;
}
.no_data_wrap img{

}
.no_data_wrap .one{

}
.no_data_wrap .two{
  color: #879bba;
    font-size: 13px;
}
.content_wrap {
    border: 1px solid #a9c4df;
    background-color: #ffffff;
    overflow: hidden;
    width: 100%;
    margin: 0 auto;
    margin-bottom: 20px;
    /* max-width: 1460px; */
  }
/* 模态框 */
.el-dialog__header{
  padding: 0 !important;
  height: 40px;
  background-color: #4084f0;
  line-height: 40px;
  color: #ffffff;
  text-align: left;
  padding-left: 15px !important;
}
.el-dialog__header span{
  color: #ffffff;
  font-size: 16px;
}
.el-dialog__header .el-dialog__headerbtn{
  top: 0;
  width: 40px;
  height: 40px;
  right: 0;
}
.el-dialog__header .el-dialog__headerbtn:hover{
  background-color: #f5b923;
  color: #ffffff;
}
.el-dialog__headerbtn:hover .el-dialog__close{
  color: #ffffff;
}
.el-dialog{
  border-radius: 5px;
  overflow: hidden;
}
.el-dialog__header .el-dialog__headerbtn i{
  font-size: 14px;
  color: #c4dcf4;
}
.el-button--primary{
    color: #FFF;
    background-color: #1b9cff;
    border-color: #1b9cff;
}
.el-button--primary:hover{
  opacity: .9;
  color: #FFF;
    background-color: #1b9cff;
    border-color: #1b9cff;
}
.el-form--inline .el-form-item{
  margin-right:45px;
}
.gaoji_search_dialog .el-button{
  width: 110px;
  height: 34px;
  font-size: 14px;
  line-height: 34px;
  padding:0;
}
.el-dialog__footer{
  padding: 15px;
  background-color: #ebf4fe;
}
.advanced_form{
  text-align: left;
}
.gaoji_search_dialog .el-button--default{
    color: #5c79b0;
    background-color: #c4dcf4;
    border-color: #c4dcf4;
}
.gaoji_search_dialog .el-button--default:hover{
 opacity: .9;
}
/* 模态框 */
/* ::-webkit-scrollbar{
  widows: 8px;
  background-color: #78a1cb;
} */
.el-popover ::-webkit-scrollbar{
  width: 8px;
  background-color: #f3f6fb;
}
.el-popover ::-webkit-scrollbar-thumb{
  border-radius: 5px;
  background-color: #78a1cb;
}
.highlightFullText_wrap{
  width: 100%;
  /* height: 40px; */
  overflow: hidden;
  color: #879bba;
  padding: 10px;
  background-color: #f3f6fb;
  text-align: left;

}
.highlightFullText_wrap_ul li{
  margin-bottom: 10px;
}
.highlightFullText_wrap .highlightFullText_wrap_hidden{
  /* display: none; */
  font-size: 14px;
}
.highlightFullText_wrap_play{
  font-size: 14px;
}
.oblique{
  font-style: oblique;
}
.minzong{
  margin: 0;
  text-align: right;
}
.highlightFullText_wrap_hidden .keyword{
  color: red;
}
.hitclass{
  color: red;
}
.ckxq_wrap{
  text-align: right;
  margin: 0;
  margin-bottom: 10px;
}
.ckxq_wrap a{
  color: #82a6df !important;
}
.ckxq_wrap a:hover{
  color: #4f5e7b !important;
}
.el-loading-spinner{
  font-size: 24px;
  top: 20% !important;
}
.el-loading-spinner .el-loading-text{
  font-size: 24px;
}
.el-tree-node__label{
  font-size: 16px;
}
.el-menu-item{
  font-size: 16px;
}
.el-menu-item span{
  font-size: 16px !important;
}
 ::-webkit-scrollbar{
  width: 8px;
  background-color: #f3f6fb;
}
::-webkit-scrollbar-thumb{
  border-radius: 5px;
  background-color: #78a1cb;
}
.nav_left_wrap .el-menu-item.is-active{
  color: #165ac6 !important;
}
.TiaoNoA{
  color: #2d405e;
  cursor: default;
}
.guiding_list_item_wrap .list_item_title .txtx em,
.yaozhi_content_wrap span em {
  color: #ff0000;
}
.zhengwen_wrap .detailHeaderTxt{
    border-left: 5px solid #0066FF;
    padding-left: 10px;
    font-size: 18px;
    color: #252525;
    text-indent:inherit !important;
    margin: 10px 0;
}
.zhengwen_wrap .MsoNormal{
    text-indent: 2em;
}
.zhengwen_wrap .total_header_txt{
  font-size: 22px;
  color: #252525;
  text-align: center;
  font-weight: bold;
}
.zhengwen_wrap .seconed_hesder{
  font-size: 20px;
  color: #353535;
  text-align: center;
  font-weight: bold;
}
.statute-detail-content-piece-title{
  font-size: 22px;
  color: #252525;
  font-weight: bold;
}
.statute-detail-content-chapter-title{
  font-size: 20px;
  color: #353535;
  font-weight: bold;
}
.statute-detail-content-part-title{
  font-size: 18px;
  color: #454545;
  font-weight: bold;
}
.statute-detail-content-part-content,
.MsoBodyTextIndent{
  text-indent: 2em;
}
.statute-detail-second-content{
  line-height: 240%;
}
.el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
    background-color: #fff !important;
    border: 1px solid #DCDFE6 !important;
}
.el-pagination.is-background .el-pager li:not(.disabled).active{
    background-color: #409EFF !important;
    color: #FFF !important;
}
p{
  margin: 0;
}
.statute-detail-catalog-piece-content a,
.statute-detail-catalog-piece-title{
    font-size: 16px;
    color: #353535;
}
.statute-detail-catalog-piece-content a:hover,
.statute-detail-catalog-piece-title:hover{
  color: #409EFF;
}
.el-tooltip__popper.is-light{
  border: 1px solid #b2c6ed !important;
  color: #353535 !important;
}
.guiding_main_wrap,.boutique_main_wrap{
    background-color: #f8f8f8;
    overflow: hidden;
}
.main_guiding_conten_wrap{
    width: 85%;
    margin: 0 auto;
}
/* 内部检索 */
 .jiansuo_right_ul{
      list-style: none;
      padding: 0;
      margin: 0;
      overflow: hidden;
  }
  .jiansuo_left_wrap,.jiansuo_right_wrap{
      float: left;
  }
  .jiansuo_left_wrap{
      font-size: 16px;
      color: #666666;
      text-align: left;
      line-height: 30px;
  }
  .case_jiansuo_wrap{
      overflow: hidden;
      padding: 0 10px;
      box-sizing: border-box;
      margin: 20px 0;
  }
  .jiansuo_right_ul li{
      border: 1px solid #1181f9;
      /* padding: 3px 12px; */
      color: #1181f9;
      border-radius: 3px;
  }
  .jiansuo_right_ul li span.iclose{
      border-left: 1px solid #1181f9;
      cursor: pointer;
      padding: 4px 6px;
  }
  .jiansuo_right_ul li span{
      padding: 4px 10px;
      display: inline-block;
  }
  /* 内部检索 */
  /* media queries start */
  @media only screen and (max-width: 1279px) {
    .common_detail_content_wrap {
      width: 980px;
    }
    .cases_header_wrap .nav_ul_wrap{
    }
  }
  @media only screen and (min-width: 1279px) and (max-width: 1900px){
    .common_detail_content_wrap {
      width: 1200px;
    }
    .cases_header_wrap .nav_ul_wrap{

    }
  }
  @media only screen and (min-width: 1900px){
    .common_detail_content_wrap {
      width: 1592px;
    }
    .cases_header_wrap .nav_ul_wrap{

    }
  }
  /* media queries end */
  .personalCenter_main_wrap{
    margin: 0px auto;
  }
  .personalCenter_content_wrap{
    margin: 20px 0;
  }
  .breadcrumb_wrap{
    border-bottom: 2px solid #A9C4DF;
    padding-bottom: 10px;
  }
  .breadcrumb_wrap .el-breadcrumb__inner.is-link{
    font-size: 16px;
    color: #879BBA;
  }
  .breadcrumb_wrap .basePath-url a,.breadcrumb_wrap .basePath-url i{
      color: #879BBA;
  }
  .breadcrumb_wrap .aim-url .el-breadcrumb__inner{
      color:#4084F0;
      font-size: 16px;
  }
  .breadcrumb_wrap .el-breadcrumb__inner{
      cursor: default;
  }
  .breadcrumb_wrap .el-breadcrumb__item .el-breadcrumb__inner:hover{
      color:#4084F0;
  }
  .ckxq_wrap-guanj_minz{
		padding: 0;
		margin: 0;
		padding: 5px 10px;
		box-sizing: border-box;
		border-bottom: 1px solid #cde2f3;
		margin-bottom: 8px;
		.minzhong-cishu{

		}
		.oblique-cishu{
			.one{
				color: #ff0000;
			}
		}
  }
  .red{
    color: #ff0000;
  }
  .lawslishiorothertips_item{
  cursor: pointer;
  padding: 5px 15px;
  box-sizing: border-box;
}
.lawslishiorothertips_item:hover{
  background-color: #daedfb;
}

</style>
