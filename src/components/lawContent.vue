<template xmlns:float="http://www.w3.org/1999/xhtml">
  <!-- 法律法规内容区（有排序） -->
  <div style="padding:0 15px 15px;">
    <div class="label">
      <span>{{maincontent.label}}({{maincontent.total}})</span>
      <a style="float: right" class="clickMoreBtn_wrap" @click="clickMore(index)" v-if="maincontent.total>10">更多</a>
    </div>


    <!--三目运算，给定选定值 -->
    <template v-if="contentIndex=='chl'||contentIndex=='lar'">
      <div class="content laws" v-for="(item,index) in maincontent.data" :key="index">
        <!-- <div class="content_shuju_left"> -->
        <div class="contentTitle">
          <!-- <span class="numb_sort_checkall">
            <el-checkbox v-model="checkAllList[(dataIndex)*pagesize + (index)].status" :id="item.Gid" @change="checkedItem($event,item,index)"></el-checkbox>
          </span> -->
          <p class="numb_sort_checkall_p">
            <span class="numb_sort_checkall_sort">
              {{(pagecount-1)*pagesize + (index+1)}}.
            </span>
            <a :href="'#/detail/'+contentIndex+'/'+item.Gid" target="_blank">
              <span v-html="item.Title"></span>
            </a>
          </p>
        </div>
        <!-- <template v-if="item.DocumentNO==null">
        <div class="contentCon">{{item.IssueDate}}发布/{{item.ImplementDate}}实施</div>
        </template>
        <template v-else>
        <div class="contentCon">{{item.DocumentNO}}/{{item.IssueDate}}发布/{{item.ImplementDate}}实施</div>
        </template> -->
        <template>
          <div class="contentCon">
            <template v-if="item.TimelinessDic">
              <span v-html="item.TimelinessDic"></span> / 
            </template>
            <template v-if="item.DocumentNO">
              <span v-html="item.DocumentNO"></span> /
            </template>
            <template v-if="item.IssueDate">
              <span v-html="item.IssueDate"></span>发布 
              <template v-if="item.ImplementDate"> / </template>
            </template>
            <template v-if="item.ImplementDate">
              <span v-html="item.ImplementDate"></span>实施  
            </template>
          </div>
        </template>
        <div class="contentCon fbcy_wrap">
          <!-- <span class="fbcy">法宝词云：</span>中国人民共和国法 -->
        </div>
        <div class="highlightFullText_wrap" v-if="item.hitTimes != '0' && select=='fulltext'">
          <div class="highlightFullText_wrap_hidden">
            <p class="ckxq_wrap-guanj_minz">
              <span class="minzhong-cishu">命中次数：</span>
              <span class="oblique-cishu">{{keyword}} <span class="one">({{item.hitTimes}})</span></span>
            </p>
            <p class="ckxq_wrap">
              <!-- <a :href="'#/detail/'+contentIndex+'/'+item.Gid+'/'+keyword" target="_blank">
                查看详情
              </a> -->
              <a href="javascript:void(0);" @click="openAllFullText($event,item.Gid,index)" v-show="!mingzongArr[item.Gid]">
                展开命中
              </a>
              <a href="javascript:void(0);" @click="openAllFullText($event,item.Gid,index)" v-show="mingzongArr[item.Gid]">
                收起命中
              </a>
            </p>
            <ul class="highlightFullText_wrap_ul">
              <div id="hidden_highLighter" style="display:none;">
                <li v-for="(item01,index01) in highLighter[index]" :key="index01">
                  <span v-html="item01" v-if="index01 < 5"></span>
                </li>
                <div class="fenye" v-if="item.highLighter.length > 5">
                  <el-pagination style="text-align: right;"
                    background
                    @current-change="handleCurrentChangeFll($event,item.highLighter,index)"
                    :page-size="fulltextPageSize"
                    :current-page.sync="currentPageFulltext[index]"
                    layout="prev,pager,next,slot"
                    :total="currentFulltextTotal[index]"
                  ></el-pagination>
                </div>
              </div>
              <div id="play_highLighter">
                <li v-for="(item01,index01) in item.highLighter" :key="index01">
                  <span v-html="item01" v-if="index01 < 1"></span>
                </li>
              </div>
            </ul>
          </div>
        </div>
        <!-- <div class="contentCon">
          <ul class="about_wrap">
            <li>相关案例</li>
            <li>相关论文</li>
          </ul>
        </div> -->
        <!-- </div> -->
        <!-- <div class="opeartion_wrap">
          <p><i class="el-icon-caret-bottom"></i>操作</p>
          <div class="opeartion_wrap_list">
            <p>下载</p>
            <p>收藏</p>
          </div>
        </div> -->
      </div>
    </template>


    <template v-if="contentIndex=='pfnl' || contentIndex=='payz' ||  contentIndex=='gac'">
      <div class="content" v-for="(item,index) in maincontent.data" :key="index">
        <div class="contentTitle">
          <!-- <span class="numb_sort_checkall">
            <el-checkbox v-model="checkAllList[(dataIndex)*pagesize + (index)].status" :id="item.Gid" @change="checkedItem($event,item,index)"></el-checkbox>
          </span> -->
          <p class="numb_sort_checkall_p">
            <span class="numb_sort_checkall_sort">
              {{(pagecount-1)*pagesize + (index+1)}}.
            </span>
            <a :href="'#/detail/'+contentIndex+'/'+item.Gid" target="_blank">
              <span v-html="item.Title"></span>
            </a>
          </p>
        </div>
        <div class="contentConcricase">
          <!-- <template v-if="item.Category">案由：</template>  -->
          <!-- <span class="clore" v-for="(item2,index2) in item.Category">{{item2}}</span> -->
          <!-- <div class="contentCon">
            <span v-for="(item2,index2) in item.Category">{{item.Category.length == 1 ? item2  : item2 + '/'}}</span>
          </div> -->
          <template>
            <div class="contentCon">
              <template v-if="contentIndex=='payz'">
                 规则日期：
                <template v-if="item.LastInstanceDate">
                    <span v-html="item.LastInstanceDate"></span>
                </template>
              </template>
              <template v-else> 
                <template v-if="item.TrialStep">
                  <template v-for="(item01, index01) in item.TrialStep">
                    <span v-html="item01" :key="index01" v-if="item01"></span>
                  </template>
                </template>
                <!-- <template v-if="item.DocumentAttr">
                  <template v-for="(item01, index01) in item.DocumentAttr">
                    <span v-html="item01" :key="index01" v-if="item01"></span>
                    <template v-if="item01"> / </template>
                  </template>
                </template> -->
                <template v-if="item.DocumentAttr">
                  <span v-html="item.DocumentAttr"></span> /
                </template>
                <template v-if="item.LastInstanceCourt">
                  <template v-for="(item01, index01) in item.LastInstanceCourt">
                    <span v-html="item01" :key="index01" v-if="item01 && index01 == (item.LastInstanceCourt.length-1)"></span>
                    <template v-if="item01 && index01 == (item.LastInstanceCourt.length-1)"> / </template>
                  </template>
                </template>
                <template v-if="item.CaseFlag">
                  <span v-html="item.CaseFlag"></span> /
                </template>
                <template v-if="item.LastInstanceDate">
                  <span v-html="item.LastInstanceDate"></span>
                </template>
              </template>
             
              
            </div>
          </template>

          <div class="highlightFullText_wrap" v-if="item.hitTimes != '0' && select=='fulltext'">
            <div class="highlightFullText_wrap_hidden">
              <p class="ckxq_wrap-guanj_minz">
                <span class="minzhong-cishu">命中次数：</span>
                <span class="oblique-cishu">{{keyword}} <span class="one">({{item.hitTimes}})</span></span>
              </p>
              <p class="ckxq_wrap">
                <!-- <a :href="'#/detail/'+contentIndex+'/'+item.Gid+'/'+keyword" target="_blank">
                  查看详情
                </a> -->
                <a href="javascript:void(0);" @click="openAllFullText($event,item.Gid,index)" v-show="!mingzongArr[item.Gid]">
                  展开命中
                </a>
                <a href="javascript:void(0);" @click="openAllFullText($event,item.Gid,index)" v-show="mingzongArr[item.Gid]">
                  收起命中
                </a>
              </p>
              <ul class="highlightFullText_wrap_ul">
                <div id="hidden_highLighter" style="display:none;">
                  <li v-for="(item01,index01) in highLighter[index]" :key="index01">
                    <span v-html="item01" v-if="index01 < 5"></span>
                  </li>
                  <div class="fenye" v-if="item.highLighter.length > 5">
                    <el-pagination style="text-align: right;"
                      background
                      @current-change="handleCurrentChangeFll($event,item.highLighter,index)"
                      :page-size="fulltextPageSize"
                      :current-page.sync="currentPageFulltext[index]"
                      layout="prev,pager,next,slot"
                      :total="currentFulltextTotal[index]"
                    ></el-pagination>
                  </div>
                </div>
                <div id="play_highLighter">
                  <li v-for="(item01,index01) in item.highLighter" :key="index01">
                    <span v-html="item01" v-if="index01 < 1"></span>
                  </li>
                </div>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </template>


    <template v-if="contentIndex=='cricase'">
      <div class="content" v-for="(item,index) in maincontent.data" :key="index">
        <div class="contentTitle">
          <!-- <span class="numb_sort_checkall">
            <el-checkbox v-model="checkAllList[(dataIndex)*pagesize + (index)].status" :id="item.Gid" @change="checkedItem($event,item,index)"></el-checkbox>
          </span> -->
          <p class="numb_sort_checkall_p">
            <span class="numb_sort_checkall_sort">
              {{(pagecount-1)*pagesize + (index+1)}}.
            </span>
            <a :href="'#/detail/'+contentIndex+'/'+item.Gid" target="_blank">
              <span v-html="item.Title"></span>
            </a>
          </p>
        </div>
        <div class="contentConcricase">
          <template v-if="item.CriJudgmentRule">裁判规则：</template>
          <span class="clore">{{item.CriJudgmentRule}}</span>
        </div>

        <div class="contentConcricase">
          <template v-if="item.CriAuthority"> 权威引导：</template>
          <span class="clore">{{item.CriAuthority}}</span>
        </div>
      </div>
    </template>
    <template v-if="contentIndex=='crilaw'">
      <div class="content" v-for="(item,index) in maincontent.data" :key="index">
        <div class="circle">
        	<input type="checkbox" class="checkbox" name="recordList" value="10cf06930cf5187ebdfb">
        	<span >{{index+1}}.</span>
        </div>
        <div class="contentTitle">
          <a :href="'#/detail/'+contentIndex+'/'+item.Gid" target="_blank">
            <span v-html="item.CriTitle"></span>
          </a>
        </div>
        <div class="contentCon">
            <template v-if="item.TimelinessDic">
              <span v-html="item.TimelinessDic"></span> / 
            </template>
            <template v-if="item.DocumentNO">
              <span v-html="item.DocumentNO"></span> / 
            </template>
            <template v-if="item.IssueDate">
              <span v-html="item.IssueDate"></span>发布 /
            </template>
            <template v-if="item.ImplementDate">
              <span v-html="item.ImplementDate"></span>实施 /
            </template>
        </div>

        <div class="contentCon">
          <span v-html="item.CriFullText"></span>
        </div>
      </div>
    </template>
    <!-- {{defalutNum}} -->
    <div class v-if="defalutNum>=0">
      <div class="pagination_wrap">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagecount"
          :page-sizes="[10, 50, 100, 200,400]"
          :page-size="pagesize"
          layout="prev, pager, next,sizes,jumper,->,total,slot"
          :total="maincontent.total"
          background
        ></el-pagination>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: "lawContent",
    props: [
      "maincontent",
      "contentIndex",
      "index",
      "pagesize",
      "pagecount",
      "defalutNum",
      "select",
      "keyword",
      "checkAllState",
      "checkAllList",
      "dataIndex",
    ],
    data() {
      return {
        // checkAllList:[],//全选
        checkAllListArr:[],
        // 有关命中分页的参数
        currentFulltextTotal:[],
				currentPageFulltext:[],
				currentFulltextData:[],
				fulltextPageSize:5,
				highLighter:[],
				mingzongArr:{},


        paginationShow: false,
        openAllFullTextFlag: false,
        msg: "Welcome to Your Vue.js App",
        openOrClose: "展开"
      };
    },
    created: function () {
      // if(this.select == "fulltext"){
      //   if(this.queryWord.groupByIndex != 2){
      //     this.resData.maincontent[0].group.forEach(function(item,index){
      //       item.data.forEach(function(item2,index2){
      //         let arrCurrentLen=item2.highlightFullText.split("hitclass").length;
      //         item2.arrCurrentLen=arrCurrentLen-1;
      //       });
      //     });
      //   }else{
      //     this.resData.maincontent[0].data.forEach(function(item3,index3){
      //       let arrCurrentLen=item3.highlightFullText.split("hitclass").length;
      //       item3.arrCurrentLen=arrCurrentLen-1;
      //     });
      //   }
      // }
      this.checkAllListArr = this.checkAllList;

    },
    methods: {
      // 点个选择
      checkedItem(val,item,index){
          let _this = this;
          // console.log('--------------单个选择-------------',val,this.checkAllList,item,index);
          this.checkAllList.forEach((ele,index)=>{
            if(ele.Gid == item.Gid){
              ele.status = val;
            }
          });
          this.$emit("isCheckOne", this.checkAllList);
      },
      // 全文分页
			packUp(){
				// currentFulltextTotal
				let _this = this;
				_this.currentFulltextTotal =[];
				_this.currentPageFulltext=[],
				_this.highLighter = [];
				// console.log(_this.maincontent.data,'-------------packUp-------------------')
				_this.maincontent.data.forEach((ele,index)=>{
					// hitTimes
					_this.currentFulltextTotal.push(ele.highLighter.length);
					_this.currentPageFulltext.push(1);
					_this.highLighter.push(ele.highLighter);
				});
				// console.log(_this.currentFulltextTotal,this.highLighter);
			},
			// 全文分页
			handleCurrentChangeFll(val,data,index) {
				// this.highLighter[index] = this.doPagation(val,data);
				this.$set(this.highLighter, index, this.doPagation(val,data));
				// console.log('--------quanwenfeny------',val,index,this.highLighter[index],this.highLighter);
			},
			//获取当前的数组
			doPagation: function(num, data) {
				let arry = data.slice((num - 1) * 5, num * 5);
				return arry;
			},



      openAllFullText(e,currentId,index) {

        // console.log($(e.target),'4444444444444444444444444444444444444')
        this.packUp();
				if(this.mingzongArr[currentId] == true){
					this.$set(this.mingzongArr, currentId, false);
					// console.log('4444444444对444444444444444444444444444',this.mingzongArr[currentId])
					$(e.target).parents(".highlightFullText_wrap_hidden").find("#hidden_highLighter").css("display", "none");
					$(e.target).parents(".highlightFullText_wrap_hidden").find("#play_highLighter").css("display", "block");

        }else{
          // 展开命中显示
					this.$set(this.mingzongArr, currentId, true);
					// console.log('4444444444错444444444444444444444444444',this.mingzongArr[currentId])
					$(e.target).parents(".highlightFullText_wrap_hidden").find("#hidden_highLighter").css("display", "block");
					$(e.target).parents(".highlightFullText_wrap_hidden").find("#play_highLighter").css("display", "none");
        }
			},
      clickMore: function (index) {
        // console.log($(e.target),'-------------------gengduo-------------')
        //index控制显示组，index从父及传过来，在反传回去
        // $(".clickMoreBtn_wrap").css("display","none");
        const queryData = [
          {
            field: this.maincontent.field, //字段标识
            item: [this.maincontent.value],
            type: "rank" //字段数据类型
          },
          index
        ];
        this.paginationShow = true;
        this.$emit("compareNum", queryData);
        this.checkAllList.forEach((ele,index)=>{
          // console.log(ele)
          ele.status = false;
        });
      },
      handleSizeChange: function (val) {
        // let flfg = document.querySelector('.flfgContent').offsetTop
        // window.scrollTo(0, flfg);
        const queryData = {
          size: val, //字段标识
          page: this.currentpage,
          index: this.index
        };
        this.$emit("changePagination", queryData);
        $(".highlightFullText_wrap_hidden").find("#hidden_highLighter").css("display", "none");
        $(".highlightFullText_wrap_hidden").find("#play_highLighter").css("display", "block");
        this.mingzongArr={};
      },
      handleCurrentChange: function (val) {
        // let flfg = document.querySelector('.flfgContent').offsetTop
        // window.scrollTo(0, flfg);
        const queryData = {
          size: this.pagesize, //字段标识
          page: val,
          index: this.index
        };
        this.$emit("changePagination", queryData);
        $(".highlightFullText_wrap_hidden").find("#hidden_highLighter").css("display", "none");
        $(".highlightFullText_wrap_hidden").find("#play_highLighter").css("display", "block");
        this.mingzongArr={};
      }
    },
    watch:{
      checkAllState:function(newValue,oldValue){
        // console.log(this.checkAllList,'---------------子组状态件里面01----------------',newValue,oldValue);
        let _this = this;
        let flag_c=false,flaf_b=false;
        for(let xy = 0; xy < this.checkAllList.length;xy++){
          if(_this.checkAllList[xy].status){
            flag_c=true;
            break;
          }
        }
        // 取消全选 flaf_b false 数组里面全是true
        for(let xy = 0; xy < this.checkAllList.length;xy++){
          if(!_this.checkAllList[xy].status){
            flaf_b=true;
            break;
          }
        }
        if(flag_c && !this.checkAllState && flaf_b){
          return;
        }

        this.checkAllListArr=[];
        this.checkAllListArr = this.checkAllList;

        this.checkAllList.forEach((ele,index)=>{
          // console.log(ele)
          ele.status = this.checkAllState;
        });
        //  console.log(this.checkAllList,'---------------子组状态件里面顺利通行----------------',newValue,oldValue);
      },
      checkAllList:function(){
        // console.log(this.checkAllList,'---------------子组件里面----------------')
        this.checkAllListArr=[];
        this.checkAllListArr = this.checkAllList;
        // this.$set(_this.checkAllListArr, ele.Gid, true);
        let _this = this;
        this.checkAllList.forEach((ele,index)=>{
          // console.log(ele)
          ele.status = false;
        });
        // console.log(this.checkAllList,this.checkAllListArr,'---------------子组件里面信息----------------')
      },
    }
  };
</script>
<style>
  .highlightFullText_wrap {
    width: 100%;
    /* height: 40px; */
    overflow: hidden;
    color: #879bba;
    padding: 10px;
    background-color: #f3f6fb;
    text-align: left;

  }

  .highlightFullText_wrap_ul li {
    margin-bottom: 10px;
  }

  .highlightFullText_wrap .highlightFullText_wrap_hidden {
    /* display: none; */
    font-size: 14px;
  }

  .highlightFullText_wrap_play {
    font-size: 14px;
  }

  .oblique {
    font-style: oblique;
  }

  .minzong {
    margin: 0;
    text-align: right;
  }

  .highlightFullText_wrap_hidden .keyword {
    color: red;
  }

  .hitclass {
    color: red;
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
  .opeartion_wrap_list {
    border: 1px solid #a9c4df;
    border-radius: 2px;
    text-align: center;
    display: none;
  }

  .opeartion_wrap_list p {
    padding: 0;
    margin: 0;
    padding: 10px 0;
    cursor: pointer;
    color: #5C79B0;
    font-size: 14px;
  }

  .opeartion_wrap_list p:hover {
    background-color: #ebf4fe;
  }

  .opeartion_wrap, .content_shuju_left {
    display: inline-block;
    width: 10%;
    vertical-align: text-top;
  }

  .opeartion_wrap > p {
    cursor: pointer;
    color: #5C79B0;
    font-size: 14px;
    display: inline;
  }

  .opeartion_wrap:hover .opeartion_wrap_list {
    display: block;
  }

  .content_shuju_left {
    width: 89%;
  }

  .pagination_wrap {
    margin: 20px 0;
  }

  .contentCon .fbcy {
    color: #409EFF;
  }

  .contentConcricase {
    color: #219CD4;
  }

  .contentConcricase span {
    /* color:#999; */
  }

  .about_wrap li {
    display: inline-block;
    color: #879bba;
    font-size: 13px;
    padding: 3px 10px;
    background-color: #ebf4fe;
    border-radius: 3px;
    border: 1px solid #a9c4df;
    cursor: pointer;
    margin-right: 10px;
  }

  .about_wrap li:hover {
    border: 1px solid #78aecb;
    color: #78aecb;
  }

  .contentCon {
    color: #879bba;
    font-size: 14px;
    margin: 10px 0;
  }

  .contentTitle a:visited {
    /* color: #fc9b81; */
    /* color: #4f5e7b; */
  }

  .clore {
    color: #666;
  }

  .pagination {
    text-align: left;
    padding-top: 20px;
    padding-left: 15px;
  }

  .label {
    position: relative;
    box-sizing: border-box;
    padding-left: 20px;
    width: 100%;
    height: 40px;
    color: #2d405e;
    font-weight: bold;
    line-height: 40px;
    text-align: left;
  }

  .label::before {
    width: 5px;
    height: 16px;
    background: #3684d6;
    content: "";
    position: absolute;
    left: 0px;
    top: 12px;
  }

  .label span {
    padding-left: 20px;
    color: #666;
    font-weight: normal;
  }

  .label span:hover {
    cursor: pointer;
  }

  .content {
    padding: 20px 60px 20px 30px;
    box-sizing: border-box;
    border-bottom: 1px dashed #a9c4df;
    text-align: left;
    position: relative;
  }

   .circle {
    position: absolute;
    left: -5px;
    top: 25px;
    display: block;

  }

  .contentTitle {
    line-height: 30px;
    color: #4f5e7b;
    /* text-indent: 15px; */
  }

  .content a {
    text-decoration: none;
    color: #3c3c3c;
    text-align: left;
    outline: none;
  }

  #subSider {
    text-align: left;
    padding-left: 50px;
    word-wrap: break-word;
  }
</style>
<style scoped lang="less">
  .numb_sort_checkall{
    display: inline-block;
    float: left;
  }
  .numb_sort_checkall_p{
    // margin-left: 25px;
  }
</style>
