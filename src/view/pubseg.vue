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
          <el-row class="search_inpu_one">
            <el-col :span="1" id="modelname" class="onestopSearch" style="margin-left: 10px;">
              <span class="onestoptxt">中文分词模型</span>
            </el-col>
            <el-col :span="1" id="model" class="onestopSearch" style="margin-left: 10px;">
              <el-select v-model="model" class="search_select_wrap" @change="(item)=>modelChange(item,'select')">
                <el-option label="默认pubseg模型" value="pubseg"></el-option>
                <el-option label="裁判文书CRF模型" value="crf"></el-option>
              </el-select>
            </el-col>
            <el-col :span="1" id="corpusname" class="onestopSearch" style="margin-left: 10px;">
              <span class="onestoptxt">常见语料</span>
            </el-col>
            <el-col :span="1" id="dropbox" class="onestopSearch" style="margin-left: 10px;">
              <el-select v-model="select" class="search_select_wrap" @change="(item)=>titleChange(item,'select')">
                <el-option label="默认" value="1"></el-option>
                <el-option label="ICWS2005训练集" value="training"></el-option>
                <el-option label="ICWS2005测试集" value="test"></el-option>
                <el-option label="裁判文书100合同集" value="case-contract"></el-option>
                <!-- <el-option label="文号" value="documentno"></el-option> -->
              </el-select>
            </el-col>
            <el-col :span="18" id="onestopSearch" class="onestopSearch">
              <el-input
                :placeholder="select == '1'? '请输入待分词内容':'请输入待分词内容'"
                clearable
                v-model="keyword"
                class="input-with-select search_input_wrap"
                prefix-icon="el-icon-search"
                @keyup.enter.native="getList"
                @clear="getList"
                :rows="15"
                type="textarea"
              >
              </el-input>
            </el-col>
            <el-col :span='1'>
              <el-button style="float:left" type="primary" class="primary-btn-main" @click="getList">开始分词</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="radio_main_wrap">
              <ul>
                <!-- <li class="radio_qing_mo">
                    <el-radio v-model="radio_fuzzy" label="1">精确</el-radio>
                    <el-radio v-model="radio_fuzzy" label="2">模糊</el-radio>
                </li> -->
              </ul>
            </el-col>
          </el-row>
          <el-row>
            <div class="breadcrumb">
                        <span>
                            <a href="#/">首页</a>
                        </span>
              <span>
                            <i>></i>
                            <a href="#/pubseg">pubseg中文分词</a>
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
                <!-- <div class="searchWhole">
                    <div class="searchWholeTitle">
                        全部
                    </div>
                    <ul class="catagoryWhole">
                        <li>
                            法律法规（{{total_law}}）
                        </li>
                        <li>
                            司法案例（{{total_exp}}）
                        </li>
                        <li>
                            法学期刊（{{total_jou}}）
                        </li>
                    </ul>
                </div> -->
                <el-timeline>
                  <el-timeline-item color="#4084f0" id="0">
                    全部
                  </el-timeline-item>
                  <el-timeline-item color="#4084f0" id="1">
                    中文分词
                    ({{navbarVal.chl ? navbarVal.chl + navbarVal.lar + navbarVal.protocol
                    + navbarVal.lawexplanation + navbarVal.whitebook + navbarVal.workreport
                    + navbarVal.legislation + navbarVal.eagn + navbarVal.iel + navbarVal.hkd
                    + navbarVal.aom + navbarVal.twd : 0}})
                  </el-timeline-item>
                  <!--                  <el-timeline-item color="#4084f0" id="2">-->
                  <!--                    司法案例-->
                  <!--                    ({{navbarVal.pfnl ? navbarVal.pfnl + navbarVal.payz + exampleNavbar.gac-->
                  <!--                    + navbarVal.bankruptcy + navbarVal.pal + navbarVal.atr : 0}})-->
                  <!--                  </el-timeline-item>-->
                  <!--                  <el-timeline-item color="#4084f0" id="3">-->
                  <!--                    法学期刊-->
                  <!--                    ({{navbarVal.qikan ? navbarVal.qikan : 0}})-->
                  <!--                  </el-timeline-item>-->
                </el-timeline>
              </div>
            </el-aside>
            <el-main class="onstopmain">
              <template>
                <div class="content_main_wrap">
                  <div class="lawsNew_wrap" id="lawsNew_wrap_main"
                       v-loading="lawsShowLoad"
                       element-loading-text="拼命加载中"
                       element-loading-spinner="el-icon-loading"
                       element-loading-background="rgba(0, 0, 0, 0)">
                    <div id="textExample">中文分词:请输入以空格分隔的分词标准或者原始文本，模型将去掉空格后、进行分词、返回分词结果</div>
                    <div class="nerong_wrap">
                      <!--                      <el-row class="tab_nav_wrap">-->
                      <!--                        <el-menu-->
                      <!--                          default-active="chl"-->
                      <!--                          class="el-menu-vertical-demo"-->
                      <!--                          background-color="#fff"-->
                      <!--                          text-color="#666"-->
                      <!--                          active-text-color="#065d9d"-->
                      <!--                          mode="horizontal"-->
                      <!--                          @select="selectIndex"-->
                      <!--                        >-->
                      <!--                          <el-menu-item index="chl">-->
                      <!--                            <span slot="title">中央法规({{navbarVal.chl}})</span>-->
                      <!--                          </el-menu-item>-->
                      <!--                          <el-menu-item index="lar">-->
                      <!--                            <span slot="title">地方法规({{navbarVal.lar}})</span>-->
                      <!--                          </el-menu-item>-->
                      <!--                          <el-submenu index="protocol">-->
                      <!--                            <template slot="title">立法资料</template>-->
                      <!--                            <el-menu-item index="protocol" style="color:#5c79b0;">草案({{navbarVal.protocol}})</el-menu-item>-->
                      <!--                            <el-menu-item index="lawexplanation" style="color:#5c79b0;">法规解读({{navbarVal.lawexplanation}})</el-menu-item>-->
                      <!--                            <el-menu-item index="whitebook" style="color:#5c79b0;">白皮书({{navbarVal.whitebook}})</el-menu-item>-->
                      <!--                            <el-menu-item index="workreport" style="color:#5c79b0;">工作报告({{navbarVal.workreport}})</el-menu-item>-->
                      <!--                          </el-submenu>-->
                      <!--                          <el-menu-item index="legislation">-->
                      <!--                            <span slot="title">立法计划({{navbarVal.legislation}})</span>-->
                      <!--                          </el-menu-item>-->
                      <!--                          <el-menu-item index="eagn">-->
                      <!--                            <span slot="title">中外条约({{navbarVal.eagn}})</span>-->
                      <!--                          </el-menu-item>-->
                      <!--                          <el-menu-item index="iel">-->
                      <!--                            <span slot="title">外国法规({{navbarVal.iel}})</span>-->
                      <!--                          </el-menu-item>-->
                      <!--                          <el-menu-item index="hkd">-->
                      <!--                            <span slot="title">香港法规({{navbarVal.hkd}})</span>-->
                      <!--                          </el-menu-item>-->
                      <!--                          <el-menu-item index="aom">-->
                      <!--                            <span slot="title">澳门法规({{navbarVal.aom}})</span>-->
                      <!--                          </el-menu-item>-->
                      <!--                          <el-menu-item index="twd">-->
                      <!--                            <span slot="title">台湾法规({{navbarVal.twd}})</span>-->
                      <!--                          </el-menu-item>-->
                      <!--                        </el-menu>-->
                      <!--                      </el-row>-->
                      <div class="list_wrap_main">
                        <template v-if="total_law == 0">
                          <div class="no_data_wrap">
                            <img :src="no_data_logo" alt="未查询到相关数据">
                            <p class="one">未查询到相关数据</p>
                            <p class="two">建议您修改相关查询条件重新查询</p>
                          </div>
                        </template>
                        <template v-if="total_law > 0">
                          <div class="content_mian_wrap_one" v-for="(item,index) in segsList.data.seg" :key="index">
                            <div class="circle"></div>
                            <div class="contentTitle_onestop">
                              {{originList[index]}}
                            </div>
                            <div class="contentCon">
                              {{item}}
                              <!--                              <template v-if="item.TimelinessDic">-->
                              <!--                                <span v-html="item.TimelinessDic"></span> /-->
                              <!--                              </template>-->
                              <!--                              <template v-if="item.DocumentNO">-->
                              <!--                                <span v-html="item.DocumentNO"></span> /-->
                              <!--                              </template>-->
                              <!--                              <template v-if="item.IssueDate">-->
                              <!--                                <span v-html="item.IssueDate"></span>发布-->
                              <!--                                <template v-if="item.ImplementDate"> / </template>-->
                              <!--                              </template>-->
                              <!--                              <template v-if="item.ImplementDate">-->
                              <!--                                <span v-html="item.ImplementDate"></span>实施-->
                              <!--                              </template>-->
                              <!-- <span v-if="item.DocumentNO && choseType_law != 'twd'">{{item.DocumentNO}} / </span>
                              <span v-if="item.DocumentNO && choseType_law == 'twd'">{{item.DocumentNO}} </span>
                              <span v-if="item.IssueDate">{{item.IssueDate}}发布 </span>
                              <span v-if="item.ImplementDate"> / {{item.ImplementDate}}实施</span> -->
                            </div>
                          </div>
                        </template>
                        <template v-if="total_law > 0 && !lawsShow">
                          <div class="clickMore">
                            <el-button type="primary" plain @click="clickMoreMethod">点击查看更多</el-button>
                          </div>
                        </template>
                        <template v-if="total_law > 0 && lawsShow">
                          <div class="pagination_onestop">
                            <el-pagination
                              @size-change="handleSizeChange"
                              @current-change="handleCurrentChange"
                              :current-page="lawsForm.page"
                              :page-sizes="[10, 50, 100, 200,400]"
                              :page-size="lawsForm.size"
                              layout="prev, pager, next,sizes,jumper,->,total,slot"
                              background
                              :total="lawsList.total"
                            ></el-pagination>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
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
        name: "pubseg",
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
                model:"pubseg",//分词模型
                keyword: "", //搜索框
                select: '1',//搜索范围选中
                no_data_logo: '../static/img/no_data.png',
                //是否模糊查询 2 模糊 1精确
                radio_fuzzy: "1",
                radio_type: "",
                headerArr: {
                    activeIndex: "",
                    logo_url: "../../static/img/logoo.png"
                },
                lawsList: [],
                originList: [],
                segsList: [],
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
            }
        },
        created: function () {
            document.title = this.$route.meta.title;
            this.keyword = this.$route.params.keyword;

            //360 搜索传词
            // 获取页面url
            var curUrl = window.location.href
            var curIndex = curUrl.lastIndexOf("?");
            if (curIndex != -1) {
                // 获取问号后面参数
                var targetData = curUrl.substring(curIndex + 1, curUrl.length)
                // 将问号后面参数转换成json
                var objJson = {}
                targetData.split("&").forEach((item) => {
                    objJson[item.split("=")[0]] = item.split("=")[1]
                })
                console.log('--------------搜索传参-----------------', objJson);
                for (let curItem in objJson) {
                    // console.log(curItem)
                }
                let curKeyword_360 = decodeURIComponent(objJson.q) == undefined ? "" : decodeURIComponent(objJson.q);
                this.keyword = curKeyword_360;
                sessionStorage.setItem("curKeyword_360", curKeyword_360);
                // localStorage.setItem("curKeyword_360", curKeyword_360);

                // maybe
                // // base64加密的数据
                // var Base64 = require('js-base64').Base64;
                // if (objJson.yhxx != undefined) {
                //     // 用户信息
                //     var token = objJson.yhxx;
                //     // console.log(token)
                //     if(token.lastIndexOf('/') == token.length - 1){
                //         token=token.substring(0,token.lastIndexOf('/'));
                //     }
                //     // console.log(token)
                //     var userInfo = JSON.parse(decodeURIComponent(Base64.decode(decodeURIComponent(token))));
                //     // 部门受案号
                //     var bmsah = decodeURIComponent(Base64.decode(decodeURIComponent(objJson.bmsah)));
                //     let tandu = {
                //         token: userInfo.dlrdwbm,//登录人单位编码
                //         userId: userInfo.rybm,//人员编码
                //         ryxm:userInfo.ryxm,//人员姓名
                //         dlrbmbm:userInfo.dlrbmbm,//登录人员部门编码
                //         bmsah:bmsah//案件部门受案号
                //     };
                //     sessionStorage.setItem("tandu", JSON.stringify(tandu));
                //     sessionStorage.setItem("obj", JSON.stringify(objJson));
                // }
            }

            // this.lawsForm.keyword=this.keyword;
            // this.exampleForm.keyword=this.keyword;
            // this.qikanForm.keyword=this.keyword;
            // this.searchMethod_law(this.lawsForm);
            // this.searchMethod_exp(this.exampleForm);
            // this.searchMethod_jou(this.qikanForm);
        },
        methods: {
            modelChange(val, type){
                this.model = val
            },
            //搜索范围更改
            titleChange(val, trpe) {

                if (val == "1" || val == 1) {
                    this.keyword = ''
                } else if (val == "training") {
                    this.keyword = '迈向  充满  希望  的  新  世纪  ——  一九九八年  新年  讲话  （  附  图片  １  张  ）  \n' +
                        '中共中央  总书记  、  国家  主席  江  泽民  \n' +
                        '（  一九九七年  十二月  三十一日  ）  \n' +
                        '１２月  ３１日  ，  中共中央  总书记  、  国家  主席  江  泽民  发表  １９９８年  新年  讲话  《  迈向  充满  希望  的  新  世纪  》  。  （  新华社  记者  兰  红光  摄  ）  \n' +
                        '同胞  们  、  朋友  们  、  女士  们  、  先生  们  ：  \n' +
                        '在  １９９８年  来临  之际  ，  我  十分  高兴  地  通过  中央  人民  广播  电台  、  中国  国际  广播  电台  和  中央  电视台  ，  向  全国  各族  人民  ，  向  香港  特别  行政区  同胞  、  澳门  和  台湾  同胞  、  海外  侨胞  ，  向  世界  各国  的  朋友  们  ，  致以  诚挚  的  问候  和  良好  的  祝愿  ！  \n' +
                        '１９９７年  ，  是  中国  发展  历史  上  非常  重要  的  很  不  平凡  的  一  年  。  中国  人民  决心  继承  邓  小平  同志  的  遗志  ，  继续  把  建设  有  中国  特色  社会主义  事业  推向  前进  。  中国  政府  顺利  恢复  对  香港  行使  主权  ，  并  按照  “  一国两制  ”  、  “  港人治港  ”  、  高度  自治  的  方针  保持  香港  的  繁荣  稳定  。  中国  共产党  成功  地  召开  了  第十五  次  全国  代表大会  ，  高举  邓小平理论  伟大  旗帜  ，  总结  百年  历史  ，  展望  新  的  世纪  ，  制定  了  中国  跨  世纪  发展  的  行动  纲领  。  \n' +
                        '在  这  一  年  中  ，  中国  的  改革  开放  和  现代化  建设  继续  向前  迈进  。  国民经济  保持  了  “  高  增长  、  低  通胀  ”  的  良好  发展  态势  。  农业  生产  再次  获得  好  的  收成  ，  企业  改革  继续  深化  ，  人民  生活  进一步  改善  。  对外  经济  技术  合作  与  交流  不断  扩大  。  民主  法制  建设  、  精神文明  建设  和  其他  各项  事业  都  有  新  的  进展  。  我们  十分  关注  最近  一个  时期  一些  国家  和  地区  发生  的  金融  风波  ，  我们  相信  通过  这些  国家  和  地区  的  努力  以及  有关  的  国际  合作  ，  情况  会  逐步  得到  缓解  。  总的来说  ，  中国  改革  和  发展  的  全局  继续  保持  了  稳定  。  \n' +
                        '在  这  一  年  中  ，  中国  的  外交  工作  取得  了  重要  成果  。  通过  高层  互访  ，  中国  与  美国  、  俄罗斯  、  法国  、  日本  等  大国  确定  了  双方  关系  未来  发展  的  目标  和  指导  方针  。  中国  与  周边  国家  和  广大  发展中国家  的  友好  合作  进一步  加强  。  中国  积极  参与  亚太经合  组织  的  活动  ，  参加  了  东盟  —  中  日  韩  和  中国  —  东盟  首脑  非正式  会晤  。  这些  外交  活动  ，  符合  和平  与  发展  的  时代  主题  ，  顺应  世界  走向  多极化  的  趋势  ，  对于  促进  国际  社会  的  友好  合作  和  共同  发展  作出  了  积极  的  贡献  。  \n' +
                        '１９９８年  ，  中国  人民  将  满怀信心  地  开创  新  的  业绩  。  尽管  我们  在  经济社会  发展  中  还  面临  不少  困难  ，  但  我们  有  邓小平理论  的  指引  ，  有  改革  开放  近  ２０  年  来  取得  的  伟大  成就  和  积累  的  丰富  经验  ，  还有  其他  的  各种  有利  条件  ，  我们  一定  能够  克服  这些  困难  ，  继续  稳步前进  。  只要  我们  进一步  解放思想  ，  实事求是  ，  抓住  机遇  ，  开拓进取  ，  建设  有  中国  特色  社会主义  的  道路  就  会  越  走  越  宽广  。  \n' +
                        '实现  祖国  的  完全  统一  ，  是  海内外  全体  中国  人  的  共同  心愿  。  通过  中  葡  双方  的  合作  和  努力  ，  按照  “  一国两制  ”  方针  和  澳门  《  基本法  》  ，  １９９９年  １２月  澳门  的  回归  一定  能够  顺利  实现  。  \n' +
                        '台湾  是  中国  领土  不可分割  的  一  部分  。  完成  祖国  统一  ，  是  大势所趋  ，  民心所向  。  任何  企图  制造  “  两  个  中国  ”  、  “  一中一台  ”  、  “  台湾  独立  ”  的  图谋  ，  都  注定  要  更  失败  。  希望  台湾  当局  以  民族  大义  为重  ，  拿  出  诚意  ，  采取  实际  的  行动  ，  推动  两岸  经济  文化  交流  和  人员  往来  ，  促进  两岸  直接  通邮  、  通航  、  通商  的  早日  实现  ，  并  尽早  回应  我们  发出  的  在  一个  中国  的  原则  下  两岸  进行  谈判  的  郑重  呼吁  。  \n' +
                        '环顾  全球  ，  日益  密切  的  世界  经济  联系  ，  日新月异  的  科技  进步  ，  正在  为  各国  经济  的  发展  提供  历史  机遇  。  但是  ，  世界  还  不  安宁  。  南北  之间  的  贫富  差距  继续  扩大  ；  局部  冲突  时有发生  ；  不  公正  不  合理  的  旧  的  国际  政治经济  秩序  还  没有  根本  改变  ；  发展中国家  在  激烈  的  国际  经济  竞争  中  仍  处于  弱势  地位  ；  人类  的  生存  与  发展  还  面临  种种  威胁  和  挑战  。  和平  与  发展  的  前景  是  光明  的  ，  ２１  世纪  将  是  充满  希望  的  世纪  。  但  前进  的  道路  不  会  也  不  可能  一帆风顺  ，  关键  是  世界  各国  人民  要  进一步  团结  起来  ，  共同  推动  早日  建立  公正  合理  的  国际  政治经济  新  秩序  。  \n' +
                        '中国  政府  将  继续  坚持  奉行  独立自主  的  和平  外交  政策  ，  在  和平共处  五  项  原则  的  基础  上  努力  发展  同  世界  各国  的  友好  关系  。  中国  愿意  加强  同  联合国  和  其他  国际  组织  的  协调  ，  促进  在  扩大  经贸  科技  交流  、  保护  环境  、  消除  贫困  、  打击  国际  犯罪  等  方面  的  国际  合作  。  中国  永远  是  维护  世界  和平  与  稳定  的  重要  力量  。  中国  人民  愿  与  世界  各国  人民  一道  ，  为  开创  持久  和平  、  共同  发展  的  新  世纪  而  不懈努力  ！  \n' +
                        '在  这  辞旧迎新  的  美好  时刻  ，  我  祝  大家  新年  快乐  ，  家庭  幸福  ！  \n' +
                        '谢谢  ！  （  新华社  北京  １２月  ３１日  电  ）  \n' +
                        '在  十五大  精神  指引  下  胜利  前进  ——  元旦  献辞  \n' +
                        '我们  即将  以  丰收  的  喜悦  送  走  牛年  ，  以  昂扬  的  斗志  迎来  虎年  。  我们  伟大  祖国  在  新  的  一  年  ，  将  是  充满  生机  、  充满  希望  的  一  年  。  \n' +
                        '刚刚  过去  的  一  年  ，  大气磅礴  ，  波澜壮阔  。  在  这  一  年  ，  以  江  泽民  同志  为  核心  的  党中央  ，  继承  邓  小平  同志  的  遗志  ，  高举  邓小平理论  的  伟大  旗帜  ，  领导  全党  和  全国  各族  人民  坚定不移  地  沿着  建设  有  中国  特色  社会主义  道路  阔步  前进  ，  写  下  了  改革  开放  和  社会主义  现代化  建设  的  辉煌  篇章  。  顺利  地  恢复  对  香港  行使  主权  ，  胜利  地  召开  党  的  第十五  次  全国  代表大会  ———  两  件  大事  办  得  圆满  成功  。  国民经济  稳中求进  ，  国家  经济  实力  进一步  增强  ，  人民  生活  继续  改善  ，  对外  经济  技术  交流  日益  扩大  。  在  国际  金融  危机  的  风浪  波及  许多  国家  的  情况  下  ，  我国  保持  了  金融  形势  和  整个  经济  形势  的  稳定  发展  。  社会主义  精神文明  建设  和  民主  法制  建设  取得  新  的  成绩  ，  各项  社会  事业  全面  进步  。  外交  工作  取得  可喜  的  突破  ，  我国  的  国际  地位  和  国际  威望  进一步  提高  。  实践  使  亿万  人民  对  邓小平理论  更加  信仰  ，  对  以  江  泽民  同志  为  核心  的  党中央  更加  信赖  ，  对  伟大  祖国  的  光辉  前景  更加  充满  信心  。  \n' +
                        '１９９８年  ，  是  全面  贯彻  落实  党  的  十五大  提  出  的  任务  的  第一  年  ，  各  条  战线  改革  和  发展  的  任务  都  十分  繁重  ，  有  许多  深  层次  的  矛盾  和  问题  有待  克服  和  解决  ，  特别  是  国有  企业  改革  已经  进入  攻坚  阶段  。  我们  必须  进一步  深入  学习  和  掌握  党  的  十五大  精神  ，  统揽全局  ，  精心  部署  ，  狠抓  落实  ，  团结  一致  ，  艰苦奋斗  ，  开拓  前进  ，  为  夺取  今年  改革  开放  和  社会主义  现代化  建设  的  新  胜利  而  奋斗  。  \n' +
                        '今年  是  党  的  十一  届  三中全会  召开  ２０  周年  ，  是  我们  党  和  国家  实现  伟大  的  历史  转折  、  进入  改革  开放  历史  新  时期  的  ２０  周年  。  在  新  的  一  年  里  ，  大力  发扬  十一  届  三中全会  以来  我们  党  所  恢复  的  优良  传统  和  在  新  的  历史  条件  下  形成  的  优良  作风  ，  对于  完成  好  今年  的  各项  任务  具有  十分  重要  的  意义  。  \n' +
                        '我们  要  更  好  地  坚持  解放思想  、  实事求是  的  思想  路线  。  解放思想  、  实事求是  ，  是  邓小平理论  的  精髓  。  实践  证明  ，  只有  解放思想  、  实事求是  ，  才  能  冲破  各种  不  切合  实际  的  或者  过时  的  观念  的  束缚  ，  真正  做到  尊重  、  认识  和  掌握  客观  规律  ，  勇于  突破  ，  勇于  创新  ，  不断  开创  社会主义  现代化  建设  的  新  局面  。  党  的  十五大  是  我们  党  解放思想  、  实事求是  的  新  的  里程碑  。  进一步  认真  学习  和  掌握  十五大  精神  ，  解放思想  、  实事求是  ，  我们  的  各项  事业  就  能  结  出  更加  丰硕  的  成果  。  \n' +
                        '我们  要  更  好  地  坚持  以  经济  建设  为  中心  。  各项  工作  必须  以  经济  建设  为  中心  ，  是  邓小平理论  的  基本  观点  ，  是  党  的  基本  路线  的  核心  内容  ，  近  ２０  年  来  的  实践  证明  ，  坚持  这个  中心  ，  是  完全  正确  的  。  今后  ，  我们  能否  把  建设  有  中国  特色  社会主义  伟大  事业  全面  推向  ２１  世纪  ，  关键  仍然  要  看  能否  把  经济  工作  搞  上去  。  各级  领导  干部  要  切实  把  精力  集中  到  贯彻  落实  好  中央  关于  今年  经济  工作  的  总体  要求  和  各项  重要  任务  上  来  ，  不断  提高  领导  经济  建设  的  能力  和  水平  。  \n' +
                        '我们  要  更  好  地  坚持  “  两手抓  、  两手  都  要  硬  ”  的  方针  。  在  坚持  以  经济  建设  为  中心  的  同时  ，  积极  推进  社会主义  精神文明  建设  和  民主  法制  建设  ，  是  建设  富强  、  民主  、  文明  的  社会主义  现代化  国家  的  重要  内容  。  实践  证明  ，  经济  建设  的  顺利  进行  ，  离  不  开  精神文明  建设  和  民主  法制  建设  的  保证  。  党  的  十五大  依据  邓小平理论  和  党  的  基本  路线  提  出  的  党  在  社会主义  初级阶段  经济  、  政治  、  文化  的  基本  纲领  ，  为  “  两手抓  、  两手  都  要  硬  ”  提供  了  新  的  理论  根据  ，  提  出  了  更  高  要求  ，  现在  的  关键  是  认真  抓好  落实  。  \n' +
                        '我们  要  更  好  地  发扬  求真务实  、  密切  联系  群众  的  作风  。  这  是  把  党  的  方针  、  政策  落到实处  ，  使  改革  和  建设  取得  胜利  的  重要  保证  。  在  当前  改革  进一步  深化  ，  经济  不断  发展  ，  同时  又  出现  一些  新  情况  、  新  问题  和  新  困难  的  形势  下  ，  更  要  发扬  这样  的  好  作风  。  要  尊重  群众  的  意愿  ，  重视  群众  的  首创  精神  ，  关心  群众  的  生活  疾苦  。  江  泽民  同志  最近  强调  指出  ，  要  大力  倡导  说实话  、  办  实事  、  鼓  实劲  、  讲  实效  的  作风  ，  坚决  制止  追求  表面文章  ，  搞  花架子  等  形式主义  ，  坚决  杜绝  脱离  群众  、  脱离  实际  、  浮躁  虚夸  等  官僚主义  。  这  是  非常  重要  的  。  因此  ，  各级  领导  干部  务必  牢记  全心全意  为  人民  服务  的  宗旨  ，  在  勤政廉政  、  艰苦奋斗  方面  以身作则  ，  当  好  表率  。  \n' +
                        '１９９８  ，  瞩目  中华  。  新  的  机遇  和  挑战  ，  催  人  进取  ；  新  的  目标  和  征途  ，  催  人  奋发  。  英雄  的  中国  人民  在  以  江  泽民  同志  为  核心  的  党中央  坚强  领导  和  党  的  十五大  精神  指引  下  ，  更  高  地  举起  邓小平理论  的  伟大  旗帜  ，  团结  一致  ，  扎实  工作  ，  奋勇前进  ，  一定  能够  创造  出  更加  辉煌  的  业绩  ！  \n' +
                        '北京  举行  新年  音乐会  \n' +
                        '江  泽民  李  鹏  乔  石  朱  镕基  李  瑞环  刘  华清  尉  健行  李  岚清  与  万  名  首都  各界  群众  和  劳动模范  代表  一起  辞旧迎新  （  附  图片  １  张  ）  \n' +
                        '党  和  国家  领导人  江  泽民  、  李  鹏  、  乔  石  、  朱  镕基  、  李  瑞环  、  刘  华清  、  尉  健行  、  李  岚清  等  与  万  名  首都  各界  群众  和  劳动模范  代表  一起  欣赏  了  ’９８  北京  新年  音乐会  的  精彩  节目  。  这  是  江  泽民  等  在  演出  结束  后  同  演出  人员  合影  。  \n' +
                        '（  新华社  记者  樊  如钧  摄  ）  \n' +
                        '本报  北京  １２月  ３１日  讯  新华社  记者  陈  雁  、  本报  记者  何  加正  报道  ：  在  度过  了  非凡  而  辉煌  的  １９９７年  ，  迈向  充满  希望  的  １９９８年  之际  ，  ’９８  北京  新年  音乐会  今晚  在  人民  大会堂  举行  。  党  和  国家  领导人  江  泽民  、  李  鹏  、  乔  石  、  朱  镕基  、  李  瑞环  、  刘  华清  、  尉  健行  、  李  岚清  与  万  名  首都  各界  群众  和  劳动模范  代表  一起  ，  在  激昂  奋进  的  音乐声  中  辞旧迎新  。  \n' +
                        '今晚  的  长安街  流光溢彩  ，  火树银花  ；  人民  大会堂  里  灯火辉煌  ，  充满  欢乐  祥和  的  喜庆  气氛  。  在  这  场  由  中共  北京  市委  宣传部  、  市政府  办公厅  等  单位  主办  的  题  为  “  世纪  携手  、  共  奏  华章  ”  的  新年  音乐会  上  ，  中国  三  个  著名  交响乐团  ———  中国  交响乐团  、  上海  交响乐团  、  北京  交响乐团  首  次  联袂  演出  。  著名  指挥家  陈  佐湟  、  陈  燮阳  、  谭  利华  分别  指挥  演奏  了  一  批  中外  名曲  ，  京  沪  两地  ２００  多  位  音乐家  组成  的  大型  乐队  以  饱满  的  激情  和  精湛  的  技艺  为  观众  奉献  了  一  台  高  水准  的  交响音乐会  。  \n' +
                        '音乐会  在  雄壮  的  管弦乐  《  红旗  颂  》  中  拉开  帷幕  ，  舒展  、  优美  的  乐曲声  使  人们  仿佛  看到  ：  五星红旗  在  天安门  城楼  上  冉冉  升起  ；  仿佛  听到  ：  在  红旗  的  指引  下  中国  人民  向  现代化  新  征程  迈进  的  脚步声  。  钢琴  与  管弦乐队  作品  《  东方  之  珠  》  ，  把  广大  听众  耳熟能详  的  歌曲  改编  为  器乐曲  ，  以  其  优美  感人  的  旋律  抒发  了  洗雪  百年  耻辱  的  香港  明天  会  更  好  的  情感  。  专程  回国  参加  音乐会  的  著名  女高音  歌唱家  迪里拜尔  演唱  的  《  春  之  声  》  ，  把  人们  带  到  了  万象更新  的  田野  和  山谷  ；  享誉  国际  乐坛  的  男高音  歌唱家  莫  华伦  演唱  了  著名  歌剧  《  图兰朵  》  选段  “  今夜  无  人  入睡  ”  ，  把  人们  带入  迷人  的  艺术  境地  。  音乐会  上  还  演奏  了  小提琴  协奏曲  《  梁  山伯  与  祝  英台  》  、  柴可夫斯基  的  《  第四  交响曲  ———  第四  乐章  》  、  交响诗  《  罗马  的  松树  》  等  中外  著名  交响曲  。  \n' +
                        '万  人  大会堂  今晚  座无虚席  ，  观众  被  艺术家  们  精湛  的  表演  深深  打动  ，  不断  报  以  经久不息  的  热烈  掌声  。  艺术家  们  频频  谢幕  ，  指挥家  依次  指挥  演出  返  场  曲目  ，  最后  音乐会  在  《  红色  娘子军  》  选曲  、  《  白毛女  》  选曲  、  《  北京  喜讯  到  边寨  》  等  乐曲声  中  达到  高潮  。  \n' +
                        '演出  结束  后  ，  江  泽民  等  党  和  国家  领导人  走  上  舞台  ，  亲切  会见  了  参加  演出  的  全体  人员  ，  祝贺  演出  成功  ，  并  与  他们  合影  留念  。  \n' +
                        '李  铁映  、  贾  庆林  、  曾  庆红  等  领导  同志  也  出席  了  今晚  音乐会  。  \n' +
                        '李  鹏  在  北京  考察  企业  \n' +
                        '向  广大  职工  祝贺  新年  ，  对  节日  坚守  岗位  的  同志  们  表示  慰问  \n' +
                        '新华社  北京  十二月  三十一日  电  （  中央  人民  广播  电台  记者  刘  振英  、  新华社  记者  张  宿堂  ）  今天  是  一九九七年  的  最后  一  天  。  辞旧迎新  之际  ，  国务院  总理  李  鹏  今天  上午  来到  北京  石景山  发电  总厂  考察  ，  向  广大  企业  职工  表示  节日  的  祝贺  ，  向  将要  在  节日  期间  坚守  工作  岗位  的  同志  们  表示  慰问  。  \n' +
                        '上午  九时  二十分  ，  李  鹏  总理  在  北京  市委  书记  、  市长  贾  庆林  的  陪同  下  ，  来到  位于  北京  西郊  的  北京  石景山  发电  总厂  。  始建  于  一九一九年  的  北京  石景山  发电  总厂  是  华北  电力  集团公司  骨干  发电  企业  ，  承担  着  向  首都  供电  、  供热  任务  ，  装机  总  容量  一百一十六点六万  千瓦  。  总厂  年发电量  四十五亿  千瓦时  ，  供热  能力  八百  百万大卡／小时  ，  现  供热  面积  已  达  八百  多  万  平方米  。  早  在  担任  华北  电管局  领导  时  ，  李  鹏  就  曾  多次  到  发电  总厂  检查  指导  工作  。  \n' +
                        '在  总厂  所  属  的  石景山  热电厂  ，  李  鹏  首先  向  华北  电管局  、  电厂  负责人  详细  询问  了  目前  电厂  生产  、  职工  生活  和  华北  电网  向  首都  供电  、  供热  的  有关  情况  。  随后  ，  他  又  实地  察看  了  发电机组  的  运行  情况  和  电厂  一号机  、  二号机  控制室  。  在  控制室  ，  李  鹏  与  职工  们  一一  握手  ，  向  大家  表示  慰问  。  他  说  ，  在  一九九八年  即将  到来之际  ，  有  机会  再次  回到  石景山  发电  总厂  ，  感到  十分  高兴  。  李  鹏  亲切  地  说  ：  『  今天  我  看到  了  许多  新  的  、  年轻  的  面孔  ，  这  说明  在  老  同志  们  作出  贡献  退  下来  后  ，  新  一代  的  年轻人  成长  起来  了  、  成熟  起来  了  ，  我  感到  十分  欣慰  。  』  \n' +
                        '（  Ａ  、  Ｂ  ）  \n' +
                        '李  鹏  说  ：  “  作为  首都  的  电力  工作者  ，  你们  为  首都  的  各项  重大  活动  的  顺利  进行  ，  为  保障  人民  群众  的  工作  、  生活  和  学习  ，  为  促进  首都  经济  的  发展  作出  了  自己  的  贡献  。  明天  就  是  元旦  ，  你们  还有  许多  同志  要  坚守  岗位  ，  我  向  你们  、  向  全体  电力  工作者  表示  感谢  。  现在  ，  我们  的  首都  已经  结束  了  拉  闸  限  电  的  历史  ，  希望  依靠  大家  ，  使  拉  闸  限  电  的  历史  永远  不再  重演  。  同时  ，  也  希望  你们  安全  生产  、  经济  调度  ，  实现  经济  增长  方式  的  转变  。  ”  李  鹏  最后  向  电业  职工  ，  向  全  北京市  的  人民  拜年  ，  向  大家  致以  新春  的  问候  ，  祝愿  电力  事业  取得  新  的  成绩  ，  祝愿  北京市  在  改革  、  发展  和  稳定  的  各项  工作  中  取得  新  的  成就  。  \n' +
                        '参观  工厂  结束  后  ，  李  鹏  又  来到  工厂  退休  职工  郭  树范  和  闫  戌麟  家  看望  慰问  ，  向  他们  拜年  。  曾经  是  高级  工程师  的  郭  树范  退休  前  一直  在  发电厂  从事  土建工程  建设  ，  退休  后  ，  与  老伴  一起  抚养  着  身体  欠佳  的  孙子  。  李  鹏  对  他们  倾心  照顾  下  一  代  表示  肯定  。  他  说  ：  “  人  老  了  ，  照顾  照顾  后代  也  是  一  件  可以  带来  快乐  的  事  ，  当然  ，  对  孩子  们  不  能  溺爱  ，  要  让  他们  健康  成长  。  ”  在  老工人  闫  戌麟  家  ，  当  李  鹏  了解  到  老闫  退休  前  一直  都  是  厂里  的  先进  工作者  、  曾经  被  评为  北京市  “  五好  职工  ”  ，  退休  后  仍然  为  改善  职工  的  住房  而  奔波  时  ，  十分  高兴  ，  对  他  为  工厂  建设  作出  的  贡献  表示  感谢  。  在  郭  家  和  闫  家  ，  李  鹏  都  具体  地  了解  了  他们  退休  后  的  生活  保障  问题  ，  并  与  一些  老  职工  一起  回忆  起  了  当年  建设  电厂  的  情景  。  李  鹏  说  ：  “  当年  搞  建设  ，  条件  比  现在  差  多  了  ，  大家  也  很  少  计较  什么  ，  只是  一心  想  着  把  电厂  建  好  。  现在  条件  好  了  ，  但  艰苦奋斗  、  无私奉献  的  精神  可  不  能  丢  。  ”  李  鹏  最后  祝  他们  新春  快乐  ，  身体  健康  ，  家庭  幸福  。  \n' +
                        '陪同  考察  企业  并  看望  慰问  职工  的  国务院  有关  部门  和  北京市  负责人  还有  ：  史  大桢  、  高  严  、  石  秀诗  、  阳  安江  等  。  \n' +
                        '挂  起  红灯  迎  新年  （  图片  ）  \n' +
                        '元旦  来临  ，  安徽省  合肥市  长江路  悬挂  起  ３３００  盏  大  红灯笼  ，  为  节日  营造  出  “  千  盏  灯笼  凌空  舞  ，  十  里  长街  别样  红  ”  的  欢乐  祥和  气氛  。  （  新华社  记者  戴  浩  摄  ）  \n' +
                        '（  传真  照片  ）  \n' +
                        '全总  致  全国  各族  职工  慰问信  \n' +
                        '勉励  广大  职工  发挥  工人阶级  主力军  作用  ，  为  企业  改革  发展  建功立业  \n' +
                        '本报  北京  １月  １日  讯  中华  全国  总工会  今日  发出  《  致  全国  各族  职工  慰问信  》  ，  向  全国  各族  职工  祝贺  新年  。  \n' +
                        '慰问信  说  ，  实现  党  的  十五大  提  出  的  宏伟  目标  ，  必须  依靠  工人阶级  和  全体  人民  的  长期  奋斗  。  工人阶级  是  我们  国家  的  领导  阶级  ，  是  先进  生产力  和  生产关系  的  代表  ，  是  两  个  文明  建设  的  主力军  ，  是  维护  社会  安定团结  的  中坚  力量  。  党  的  十五大  再次  强调  要  坚持  全心全意  依靠  工人阶级  的  方针  ，  具有  重大  的  意义  。  广大  职工  要  以  邓小平理论  和  党  的  基本  路线  为  指导  ，  坚持  党  的  基本  纲领  和  各项  方针  政策  ，  积极  投身  于  改革  和  建设  事业  。  要  坚持  站  在  改革  的  前列  ，  转变  思想  观念  ，  增强  市场  意识  、  竞争  意识  和  效益  意识  ，  以  实际  行动  促进  改革  的  不断  深化  。  要  发扬  工人阶级  的  首创  精神  ，  不断  为  企业  转机建制  、  调整  结构  、  加强  管理  、  提高  效益  献计献策  。  要  大力  开展  劳动  竞赛  、  合理化  建议  、  技术  革新  、  技术  协作  和  发明  创造  等  活动  ，  努力  提高  产品  质量  和  经济效益  ，  推动  企业  加快  技术  进步  ，  实现  增长  方式  的  根本  转变  ，  再  创  国有  企业  的  辉煌  。  要  正确  对待  企业  改革  和  发展  中  的  困难  和  问题  ，  树立  起  战胜  困难  的  勇气  和  信心  ，  锲而不舍  ，  迎难而上  ，  为  企业  的  改革  和  发展  建功立业  。  \n' +
                        '慰问信  指出  ，  广大  职工  要  以  主人翁  的  姿态  ，  积极  行使  当家作主  的  权利  。  要  不断  提高  自身  素质  ，  发扬  爱国  奉献  、  爱厂如家  、  爱岗敬业  的  精神  ，  学习  掌握  先进  科学  文化  知识  ，  成为  本职工作  的  行家里手  ，  迎接  新  世纪  面临  的  挑战  。  \n' +
                        '慰问信  最后  说  ，  让  我们  在  邓小平理论  和  党  的  基本  路线  指导  下  ，  更加  紧密  地  团结  在  以  江  泽民  同志  为  核心  的  党中央  周围  ，  统揽全局  ，  精心  部署  ，  狠抓  落实  ，  团结  一致  ，  艰苦奋斗  ，  开拓  前进  ，  在  两  个  文明  建设  中  充分  发挥  工人阶级  主力军  作用  ，  为  实现  跨  世纪  宏伟  目标  作出  新  的  更  大  的  贡献  。  \n' +
                        '忠诚  的  共产主义  战士  ，  久经考验  的  无产阶级  革命家  刘  澜涛  同志  逝世  \n' +
                        '（  附  图片  １  张  ）  \n' +
                        '新华社  北京  １２月  ３１日  电  忠诚  的  共产主义  战士  ，  久经考验  的  无产阶级  革命家  ，  我党  党务  工作  和  统一战线  工作  的  杰出  领导人  ，  原  中共中央  顾问  委员会  常务  委员会  委员  ，  中国  人民  政治  协商  会议  第四  、  五  、  六  届  全国  委员会  副  主席  刘  澜涛  同志  ，  因  病  医治  无效  ，  于  １９９７年  １２月  ３１日  １０时  ４４分  在  北京  逝世  ，  终年  ８８  岁  。  \n' +
                        '根据  刘  澜涛  同志  生前  遗愿  和  家属  的  意见  ，  刘  澜涛  同志  的  丧事  从简  ，  不  举行  仪式  、  不  保留  骨灰  。  \n' +
                        '党中央  国务院  关心  西藏  雪灾  救灾  工作  \n' +
                        '灾区  各级  政府  全力  组织  抗灾  力争  降低  灾害  损失  \n' +
                        '据  新华社  北京  １２月  ３０日  电  西藏  自治区  政府  副  主席  泽仁桑珠  今天  在  北京  接受  记者  采访  时  介绍  说  ，  西藏  部分  地区  发生  特大  雪灾  后  ，  党中央  、  国务院  十分  关心  西藏  的  灾情  和  救灾  工作  ，  指示  全力  做好  救灾  工作  。  自治区  各级  政府  正在  全力  组织  抗灾  ，  力争  降低  特大  雪灾  造成  的  损失  。  \n' +
                        '据  泽仁桑珠  介绍  ，  受  厄尔尼诺  现象  的  影响  ，  西藏  的  唐古拉山  、  喜马拉雅山  一  线  ９月  以来  提前  开始  降雪  ，  降雪  持续  不  断  。  １２月份  ，  受  南  支槽  云系  和  北部  冷空气  的  共同  影响  ，  那曲  、  阿里  、  日喀则  、  拉萨  、  山南  以及  昌都  等  ６  地  市  都  出现  了  不同  的  降雪  过程  ，  其中  一部分  地区  已经  成  重  灾  。  那曲  地区  自  ９月  以来  降雪  已  达  ４０  余  次  ，  包括  ５  次  强  降雪  ，  遭受  严重  雪灾  袭击  的  有  尼玛县  、  安多县  等  县  、  ５７  个  乡  。  １２月  ９日  起  ，  强  降雪  面积  进一步  扩大  到  阿里  地区  、  日喀则  地区  、  山南  地区  、  昌都  地区  的  一些  县  ，  有的  县  ２４  小时  降雪  ９５  毫米  ，  受灾  地区  扩大  到  ４０  个  县  ，  是  自  有  现代  气象  记录  以来  最  重  的  一  次  。  \n' +
                        '泽仁桑珠  说  ，  灾情  发生  后  ，  灾区  各级  党委  、  政府  全力  组织  救灾  工作  ，  大部分  干部  现  已  深入  到  抗救灾  第一线  ，  组织  和  指挥  抗救灾  工作  ，  把  粮食  、  燃料  和  冬衣  送  到  灾民  手中  ，  帮助  群众  加大  牲畜  出栏  ，  组诛  畜产品  的  收购  ，  工作  做  得  实实在在  ，  卓有成效  。  目前  ，  全区  已  形成  党政军民  总动员  支援  灾区  的  局面  。  目前  为止  ，  灾区  没有  一  人  因  冻  因  饿  死亡  ，  大部分  牲畜  也  没有  出  问题  。  西藏  自治区  党委  、  自治区  人民政府  现在  正  组织  和  带领  全区  人民  ，  奋力  进行  着  抗灾  救灾  工作  ，  组织  和  动员  各  方面  的  力量  ，  向  受灾  地区  调运  各种  急需  的  救助  物资  ，  坚定  灾区  人民  战胜  灾害  的  信心  。  泽仁桑珠  说  ，  有  党  的  领导  ，  有  全国  人民  作  坚强  后盾  ，  有  优越  的  社会主义  制度  ，  我们  有  信心  战胜  雪灾  。  \n' +
                        '明天  气象  预报  （  １９９８年  元月  １日  ２０时  —  元月  ２日  ２０时  ）  \n' +
                        '天气  趋势  分析  \n' +
                        '受  暖湿气流  影响  ，  今天  晚上  到  明天  ，  贵州  南部  、  江南  、  华南  西部  和  北部  将  有  小到中雨  。  受  较  强  冷空气  影响  ，  新疆  北部  、  甘肃  西部  、  青海  北部  、  宁夏  、  内蒙古  大部  有  ５  —  ６  级  偏  北风  ；  冷空气  前锋  过  后  上述  地区  的  气温  将  下降  ６  —  １２  摄氏度  ；  内蒙古  东部  、  黑龙江  西北部  有  小雪  。  \n' +
                        '国务院  侨办  发表  新年  贺词  \n' +
                        '本报  北京  １２月  ３０日  讯  新华社  记者  胡  晓梦  、  本报  记者  吴  亚明  报道  ：  新年  将  至  ，  国务院  侨务  办公室  主任  郭  东坡  今天  通过  新闻  媒介  ，  向  海外  同胞  和  国内  归侨  、  侨眷  、  侨务  工作者  发表  新年  贺词  。  他  代表  中华人民共和国  国务院  侨务  办公室  ，  向  广大  海外  同胞  和  国内  归侨  、  侨眷  、  侨务  工作者  ，  致以  亲切  的  问候  和  美好  的  祝愿  。  \n' +
                        '贺词  说  ，  即将  过去  的  １９９７年  是  我国  历史  发展  上  的  重要  一  年  。  我国  恢复  对  香港  行使  主权  ，  五星红旗  在  香港  庄严  升起  ，  饱受  屈辱  的  香港  终于  又  回到  了  祖国  的  怀抱  ；  ９月  ，  中国  共产党  第十五  次  全国  代表大会  胜利  召开  ，  大会  对  我国  改革  开放  和  现代化  建设  的  跨  世纪  发展  作出  了  战略  部署  ，  描绘  出  宏伟  蓝图  。  中国  人民  在  以  江  泽民  为  核心  的  中共中央  领导  下  ，  高举  邓小平理论  伟大  旗帜  ，  把  建设  有  中国  特色  的  社会主义  事业  全面  推向  ２１  世纪  。  对此  ，  我们  充满  豪情  和  信心  。  \n' +
                        '贺词  说  ，  长期以来  ，  广大  海外  爱国同胞  为  所在国  和  地区  的  经济  发展  、  社会  进步  做出  了  很  大  贡献  ，  为  促进  中国  与  所在国  的  友好  、  合作  、  交流  ，  促进  祖国  和平  统一  大业  ，  发挥  了  重要  作用  。  广大  归侨  、  侨眷  为  祖国  的  改革  开放  、  现代化  建设  事业  做出  了  显著  的  成绩  ；  广大  侨务  工作者  为  开创  我国  新  时期  侨务  工作  的  新  局面  ，  克服  困难  ，  努力  工作  。  在  此  ，  向  广大  海外  同胞  、  国内  归侨  、  侨眷  和  侨务  工作者  ，  表示  崇高  的  敬意  和  衷心  的  感谢  。  希望  海外  同胞  和  国内  归侨  、  侨眷  ，  继续  为  祖国  统一  ，  民族  团圆  ，  为  开创  中华民族  全面  振兴  的  新  世纪  ，  作出  更  大  的  贡献  。  \n' +
                        '我国  将  实行  播音员  主持人  持证  上岗  制度  \n' +
                        '李  铁映  等  向  第一  批  获得  资格  证书  的  代表  颁证  \n' +
                        '本报  北京  １２月  ３１日  讯  记者  陈  陆军  从  广播  电影  电视  部  获悉  ：  自  １９９８年  １月  １日  起  ，  我国  将  用  ３  年  时间  在  广播  影视  系统  陆续  实行  播音员  主持人  持证  上岗  制度  。  \n' +
                        '今天  上午  ，  中共中央  政治局  委员  李  铁映  与  广播  电影  电视  部  部长  孙  家正  、  国家  语委  主任  许  嘉璐  等  ，  向  第一  批  获得  《  播音员  主持人  资格  证书  》  的  中央  三  台  代表  颁证  。  \n' +
                        '据  介绍  ，  播音员  、  主持人  持证  上岗  工作  ，  是  在  １９９６年  全国  广播  影视  系统  语言  工作  会议  上  提  出来  的  ，  它  是  加强  宣传  队伍  建设  ，  促进  语言  文字  走向  标准化  、  规范化  的  重要  举措  。  播音员  、  主持人  只有  通过  汉语  普通话  水平  测试  和  政治  、  业务  考核  后  才  能  获得  上岗  资格  证书  。  \n' +
                        '李  铁映  在  颁证会  上  称赞  “  持证  上岗  ”  是  一个  好  制度  ，  是  广播  电视  事业  法制化  、  规范化  的  一个  很  大  的  进步  。  他  说  ，  播音员  、  主持人  “  责任  重大  ，  工作  神圣  ”  ，  一言一行  都  涉及  人民  的  根本  利益  和  国家  的  安稳  。  他  鼓励  广大  播音  主持  人员  ：  要  让  世界  人民  从  你们  的  言行  中  看到  中国  人民  走向  新  世纪  的  崭新  精神  风貌  。  \n' +
                        '颁证会  后  ，  李  铁映  同志  与  出席  会议  的  播音员  、  主持人  合影  留念  。  广播  电影  电视  部  副  部长  田  聪明  主持  了  今天  的  颁证会  。  \n' +
                        '温  家宝  在  贵州  农村  考察  时  指出  动员  全  社会  力量  打  好  扶贫  攻坚战  \n' +
                        '新华社  贵阳  １２月  ３１日  电  （  记者  刘  子富  ）  中共中央  政治局  委员  、  中央  书记处  书记  温  家宝  日前  在  贵州  农村  考察  扶贫  工作  时  指出  ，  到  本世纪  末  基本  解决  农村  贫困  人口  的  温饱  问题  ，  是  党  的  十五大  提  出  的  经济社会  发展  总体  部署  的  一  项  重要  任务  ，  有  重大  和  深远  的  意义  。  各级  领导  干部  要  从  全局  和  战略  的  高度  认识  和  对待  扶贫  工作  ，  切实  加强  对  扶贫  工作  的  领导  ，  坚持  开发  扶贫  的  方针  ，  加大  扶贫  攻坚  力度  ，  动员  全  社会  力量  ，  打  好  扶贫  攻坚战  。  \n' +
                        '１２月  ２７日  至  ３１日  ，  温  家宝  在  贵州  省委  书记  刘  方仁  等  陪同  下  ，  在  黔  东南  苗族  侗族  自治州  、  黔南  布依族  苗族  自治州  冒雨  考察  扶贫  工作  ，  看望  各族  干部  群众  ，  转达  党中央  、  国务院  的  亲切  关怀  和  问候  。  \n' +
                        '近年来  ，  贵州省  各级  党委  和  政府  把  扶贫  开发  工作  作为  农村  中心  任务  来  抓  ，  取得  很  大  成绩  ，  贫困  人口  大量  减少  ，  贫困  状况  明显  改善  。  温  家宝  在  农民  家中  详细  询问  他们  生产  生活  情况  ，  同  干部  群众  一起  研究  扶贫  开发  的  路子  。  他  说  ，  必须  坚持  开发  扶贫  的  方针  ，  通过  发展  经济  解决  贫困  人口  的  温饱  问题  。  要  把  农业  生产  尤其  是  粮食  生产  放  在  第一  位  ，  首先  解决  群众  吃饭  问题  。  同时  ，  面向  市场  需求  ，  充分  利用  当地  资源  ，  积极  发展  多种  经营  ，  增加  农民  收入  。  温  家宝  考察  了  农田水利  建设  工地  ，  他  说  ，  要  大  搞  农田  基本建设  ，  植树造林  ，  治水改土  ，  改善  生产  条件  和  生态  环境  ，  使  脱贫  建立  在  比较  坚实  的  物质  技术  基础  之上  。  \n' +
                        '温  家宝  在  黔南州  民族  干部  学校  ，  与  师生  亲切  交谈  。  他  说  ，  贫困  地区  要  改变  贫困  面貌  ，  必须  从  根本  上  改变  教育  、  科技  、  文化  落后  的  状况  ，  通过  义务教育  、  成人  教育  等  多种  形式  提高  群众  的  文化  水平  。  积极  推广  各种  实用  技术  ，  把  增产  增效  显著  ，  易于  掌握  的  技术  送给  农民  ，  用于  生产  实践  ，  增强  脱贫致富  的  能力  。  \n' +
                        '温  家宝  一  家  又  一  家  地  看望  了  贫困户  ，  与  各族  群众  促膝交谈  。  他  说  ，  扶贫  工作  进入  攻坚  阶段  ，  任务  十分  艰巨  。  贫困  地区  的  广大  干部  要  落实  责任  ，  加大  工作  力度  ，  切实  把  扶贫  工作  做  深  、  做  细  ，  做  到  村  、  做  到  户  ，  逐村逐户  落实  扶贫  政策  措施  ，  确定  生产  开发  项目  ，  搞好  科技  信息  服务  。  有  扶贫  任务  的  地方  、  部门  和  单位  ，  要  发扬  扶贫济困  的  优良  传统  ，  努力  搞好  对口  扶贫  。  贫困  地区  的  广大  群众  要  坚定  信心  ，  坚持  自力更生  、  艰苦创业  ，  用  自己  的  双手  改变  贫困  面貌  。  \n' +
                        '温  家宝  与  当地  乡  、  村  各族  干部  进行  了  座谈  ，  他  勉励  干部  要  牢记  党  的  全心全意  为  人民  服务  的  宗旨  ，  密切  联系  群众  ，  关心  群众  生活  ，  深入  基层  ，  帮助  群众  解决  实际  困难  和  问题  。  元旦  、  春节  到  了  ，  特别  要  安排  好  灾区  和  贫困  地区  群众  的  生产  和  生活  。  \n' +
                        '贵州  省委  副  书记  王  思齐  ，  省委  常委  、  副  省长  袁  荣贵  也  参加  了  考察  。  \n' +
                        '于  永波  会见  全军  和  武警  先进  典型  代表  时  指出  \n' +
                        '用  先进  典型  推动  部队  全面  建设  \n' +
                        '据  新华社  北京  １２月  ３１日  电  （  记者  罗  玉文  ）  中央军委  委员  、  总政治部  主任  于  永波  日前  在  会见  全军  和  武警  部队  先进  典型  代表  时  强调  ，  全军  要  认真  贯彻  落实  江  泽民  主席  最近  的  重要  指示  精神  ，  形成  学习  邓小平理论  的  新  高潮  ，  把  这  一  学习  提高  到  十五大  所  达到  的  新  水平  ，  进一步  加强  军队  的  革命化  、  现代化  、  正规化  建设  。  \n' +
                        '于  永波  等  在  同  应邀  参加  中宣部  召开  的  全国  先进  典型  座谈会  的  军队  代表  徐  洪刚  、  韩  素云  、  李  国安  、  邹  延龄  、  第四  军医  大学  学员  二  大队  代表  李  尔青  以及  武警  部队  国旗  护卫队  代表  王  建华  座谈  时  ，  称赞  他们  的  先进  事迹  是  中华民族  传统  美德  和  我党  我军  优良  传统  的  完美  结合  ，  体现  了  我党  我军  全心全意  为  人民  服务  的  宗旨  ，  体现  了  与  社会主义  市场经济  相  适应  的  时代  精神  。  \n' +
                        '于  永波  指出  ，  我军  是  一  支  英雄  模范  辈出  的  军队  ，  用  先进  典型  教育  部队  是  我军  政治  工作  的  优良  传统  。  他  说  ，  要  充分  发挥  先进  典型  的  示范  、  激励  、  感召  作用  ，  在  部队  营造  学习  先进  、  奋发向上  的  良好  风气  。  要  把  向  英雄  模范  学习  同  做好  部队  的  各项  工作  紧密  结合  起来  ，  爱岗敬业  ，  在  各自  的  岗位  上  为  军队  和  国防  建设  贡献  聪明才智  ，  按照  江  主席  “  五  句  话  ”  的  总  要求  ，  推动  部队  全面  建设  。  总政  副  主任  周  子玉  、  唐  天标  、  袁  守芳  等  参加  了  会见  。  \n' +
                        '沿  淮  工业  污染源  达标  排放  淮河  治污  第一  战役  告捷  \n' +
                        '本报  蚌埠  １月  １日  电  记者  黄  振中  、  白  剑峰  报道  ：  新年  的  钟声  刚刚  敲响  ，  千  里  淮河  传来  喜讯  ：  沿  淮  工业  污染源  实现  达标  排放  ，  削减  污染  负荷  ４０％  以上  ，  淮河  治  污  第一  战役  告捷  。  \n' +
                        '国家  环保局  局长  解  振华  庄重  宣布  ：  在  淮河  流域  １５６２  家  污染  企业  中  ，  已  有  １１３９  家  完成  治理  任务  ，  ２１５  家  正在  施工  停产  治理  ，  １９０  家  由于  其他  原因  停产  、  破产  、  转产  ，  １８  家  因  治理  无望  被  责令  关停  。  据  中国  环境  监测  总站  公布  的  最  新  数据  表明  ，  淮河  干流  和  一些  支流  水质  已  有  明显  改善  ，  但  支流  的  一些  断面  污染  仍  较  严重  。  \n' +
                        '从  昨天  开始  ，  １２  艘  水质  监测船  穿梭  在  淮河  的  各个  断面  ，  进行  最后  的  水样  分析  ；  ３０００  多  名  环境  监理  和  监测  人员  进入  各  大  污染  企业  ，  检查  达标  排放  情况  。  对于  治理  无望  的  企业  ，  沿  淮  ４  省政府  分别  下达  了  关停令  。  记者  随  执法  人员  到  安徽  大泽  酒厂  等  企业  ，  目睹  了  污染  车间  被  贴  上  封条  的  情景  。  许多  饱受  污染  之  苦  的  群众  自动  聚集  在  污染  企业  门口  ，  拍手称快  。  \n' +
                        '解  振华  说  ，  几  年  来  ，  沿  淮  ４  省政府  和  人民  为  治理  淮河  付出  了  巨大  的  努力  ，  投入  了  相当  的  人力  和  财力  。  下  一  步  要  巩固  治理  成果  ，  保证  治污  设备  正常  运转  ，  加强  监督  管理  ，  防止  反复  ，  进一步  削减  淮河  污染  负荷  。  今后  ３  年  沿  淮  要  建设  ５０  多  座  城市  生活  污水  处理厂  ，  同时  进一步  解决  农业  污染  问题  。  治理  淮河  今后  的  任务  仍  很  艰巨  ，  沿  淮  ４  省  要  脚踏实地  ，  团结  治污  。  \n' +
                        '九七  中国  旅游年  圆满  结束  九八  华夏  城乡游  隆重  启幕  罗  干  出席  开幕式  \n' +
                        '本报  苏州  １月  １日  电  记者  龚  雯  报道  ：  １９９７年  １２月  ３１日  子夜  ，  随着  苏州  寒山寺  钟声  撞  响  第１０８  下  ，  姑苏  城内  一  片  欢腾  ，  中共中央  政治局  委员  、  国务委员  罗  干  在  此  郑重  宣布  ：  ’９７  中国  旅游年  圆满  结束  ，  ’９８  华夏  城乡游  正式  开幕  。  \n' +
                        '国家  旅游局  局长  何  光  、  江苏  省政府  领导  等  以及  数千  名  中外  宾朋  参加  了  这  一  隆重  而  特别  的  仪式  。  \n' +
                        '’９７  中国  旅游年  是  一  次  国家级  的  宣传  促销  活动  ，  是  我国  “  九五  ”  期间  旅游  发展  的  重大  举措  ，  １９９７年  元旦  由  国家  主席  江  泽民  在  新年  致词  中  宣布  开幕  。  \n' +
                        '据  最  新  统计  ，  １９９７年  １月  至  １１月份  ，  来华  旅游  人数  达  ５２３６万  多  人次  ，  国际  旅游  收入  达  １１０．８亿  多  美元  ，  分别  较  上年  同期  增长  １２．３％  和  １８．７％  ，  预计  全年  来华  旅游  入境  人数  约  ５４００万  人次  ，  旅游  创汇  达  １１５亿  美元  ，  再  创  新  纪录  ，  国内  旅游  人数  及  收入  也  比  上年  有  大幅  增长  。  '
                } else if (val == 'test') {
                    this.keyword = '共同  创造  美好  的  新  世纪  ——  二○○一年  新年  贺词  \n' +
                        '（  二○○○年  十二月  三十一日  ）  （  附  图片  1  张  ）  \n' +
                        '女士  们  ，  先生  们  ，  同志  们  ，  朋友  们  ：  \n' +
                        '2001年  新年  钟声  即将  敲响  。  人类  社会  前进  的  航船  就要  驶入  21  世纪  的  新  航程  。  中国  人民  进入  了  向  现代化  建设  第三  步  战略  目标  迈进  的  新  征程  。  \n' +
                        '在  这个  激动人心  的  时刻  ，  我  很  高兴  通过  中国  国际  广播  电台  、  中央  人民  广播  电台  和  中央  电视台  ，  向  全国  各族  人民  ，  向  香港  特别  行政区  同胞  、  澳门  特别  行政区  同胞  和  台湾  同胞  、  海外  侨胞  ，  向  世界  各国  的  朋友  们  ，  致以  新  世纪  第一  个  新年  的  祝贺  ！  \n' +
                        '过去  的  一  年  ，  是  我国  社会主义  改革  开放  和  现代化  建设  进程  中  具有  标志  意义  的  一  年  。  在  中国  共产党  的  领导  下  ，  全国  各族  人民  团结  奋斗  ，  国民经济  继续  保持  较  快  的  发展  势头  ，  经济  结构  的  战略性  调整  顺利  部署  实施  。  西部  大  开发  取得  良好  开端  。  精神文明  建设  和  民主  法制  建设  进一步  加强  。  我们  在  过去  几  年  取得  成绩  的  基础  上  ，  胜利  完成  了  第九  个  五年计划  。  我国  已  进入  了  全面  建设  小康  社会  ，  加快  社会主义  现代化  建设  的  新  的  发展  阶段  。  \n' +
                        '面对  新  世纪  ，  世界  各国  人民  的  共同  愿望  是  ：  继续  发展  人类  以往  创造  的  一切  文明  成果  ，  克服  20  世纪  困扰  着  人类  的  战争  和  贫困  问题  ，  推进  和平  与  发展  的  崇高  事业  ，  创造  一个  美好  的  世界  。  \n' +
                        '我们  希望  ，  新  世纪  成为  各国  人民  共享  和平  的  世纪  。  在  20  世纪  里  ，  世界  饱受  各种  战争  和  冲突  的  苦难  。  时至今日  ，  仍  有  不少  国家  和  地区  的  人民  还  在  忍受  战火  的  煎熬  。  中国  人民  真诚  地  祝愿  他们  早日  过  上  和平  安定  的  生活  。  中国  人民  热爱  和平  与  自由  ，  始终  奉行  独立自主  的  和平  外交  政策  ，  永远  站  在  人类  正义  事业  的  一边  。  我们  愿  同  世界  上  一切  爱好  和平  的  国家  和  人民  一道  ，  为  促进  世界  多极化  ，  建立  和平  稳定  、  公正  合理  的  国际  政治  经济  新  秩序  而  努力  奋斗  。  \n' +
                        '我们  希望  ，  新  世纪  成为  各国  人民  共同  发展  的  世纪  。  在  20  世纪  里  ，  世界  的  生产力  和  科学技术  取得  了  惊人  的  成就  。  但是  ，  世界  上  仍  有  许多  人民  尚未  摆脱  贫穷  和  饥饿  ，  有的  甚至  连  基本  生存  条件  都  不  具备  ，  时刻  面临  着  死亡  的  威胁  。  经济  全球化  对  生产力  发展  的  新  推动  ，  科学技术  突飞猛进  带来  的  新  成果  ，  应该  造福  于  全人类  ，  特别  是  应该  用  来  促进  发展中国家  的  发展  ，  改善  极度  贫困  人口  的  生活  境遇  ，  使  他们  得以  具备  自我  发展  的  条件  。  中国  人民  将  坚持不懈  地  为此  作出  自己  的  贡献  。  \n' +
                        '我们  希望  ，  新  世纪  成为  各种  文明  共同  进步  的  世纪  。  世界  是  丰富多彩  的  。  世界  各国  的  文明  ，  都  是  人类  的  宝贵  财富  ，  应该  相互  尊重  、  相互  学习  。  历史  充分  证明  ，  各国  人民  自主  选择  各自  的  社会制度  和  发展  道路  ，  在  继承  和  发展  本  民族  文明  的  基础  上  吸取  其他  文明  的  精华  ，  按照  自己  的  意志  创造  并  享受  美好  的  生活  ，  是  世界  发展  的  重要  动力  。  只有  加强  各种  文明  之间  的  交流  ，  推动  各种  文明  共同  进步  ，  世界  和平  与  发展  的  崇高  事业  才  能  真正  实现  。  \n' +
                        '中国  人民  进入  新  世纪  的  主要  任务  ，  就  是  继续  推进  现代化  建设  ，  完成  祖国  统一  ，  维护  世界  和平  与  促进  共同  发展  。  中国  人民  将  坚持  以  邓小平理论  为  指导  ，  坚定不移  地  推进  改革  开放  和  经济  建设  ，  坚定不移  地  贯彻  “  和平  统一  、  一国两制  ”  方针  ，  坚定不移  地  奉行  独立自主  的  和平  外交  政策  ，  为  不断  推进  建设  有  中国  特色  社会主义  事业  ，  最终  实现  祖国  的  完全  统一  ，  实现  中华民族  的  伟大  复兴  而  不懈  奋斗  ，  争取  对  人类  作出  新  的  更  大  的  贡献  。  \n' +
                        '我  相信  ，  只要  全世界  人民  以及  所有  关心  人类  前途  和  命运  的  政治家  们  共同  努力  ，  携手  前进  ，  我们  居住  的  这个  星球  一定  能够  成为  各国  人民  共享  和平  、  共同  发展  和  共同  进步  的  美好  世界  ！  \n' +
                        '最后  ，  我  从  北京  祝  大家  新年  快乐  ！  \n' +
                        '谢谢  。  \n' +
                        '（  新华社  北京  12月  31日  电  ）  \n' +
                        '图片  ：  \n' +
                        '中共中央  总书记  、  国家  主席  、  中央军委  主席  江  泽民  发表  新年  贺词  。  \n' +
                        '（  新华社  记者  兰  红光  摄  ）  \n' +
                        '为  新  世纪  欢呼  （  图片  ）  \n' +
                        '2001年  1月  1日  零时  ，  随着  新  世纪  钟声  的  响起  ，  北京  中华  世纪坛  礼花  齐  放  ，  万民  欢腾  。  （  本报  记者  徐  烨  摄  ）  \n' +
                        '北京  新年  音乐会  展现  经典  魅力  尉  健行  李  岚清  与  数千  首都  观众  一起  欣赏  \n' +
                        '本报  北京  12月  31日  讯  新华社  记者  秦  杰  、  本报  记者  赵  川东  报道  ：  乐音  飞扬  ，  弦  歌  阵阵  。  党  和  国家  领导人  尉  健行  、  李  岚清  今晚  在  人民  大会堂  与  数千  名  首都  观众  一起  ，  欣赏  世纪  音乐  盛典  ———  2001年  北京  新年  音乐会  。  \n' +
                        '北京  新年  音乐会  是  首都  北京  的  标志性  文化  活动  ，  已  连续  成功  举办  了  4  届  。  主办  单位  文化部  ，  中共  北京  市委  、  北京市  人民政府  为  把  今年  的  新年  音乐会  办  成  具有  国际  水准  、  中国  气派  、  北京  特色  、  节日  气氛  的  音乐  盛会  ，  作  了  充分  的  准备  和  精心  的  安排  。  音乐会  汇集  了  强大  的  演出  阵容  ，  中央  歌剧舞剧院  交响乐团  、  北京  交响乐团  、  上海  交响乐团  共  160  人  的  管弦  乐团  和  中国  交响乐团  合唱团  、  中央  歌剧院  合唱团  共  200  人  组成  的  合唱团  ，  在  3  位  指挥家  汤  沐海  、  陈  燮阳  、  谭  利华  的  执  棒  下  ，  让  观众  领略  了  高雅  艺术  的  风采  。  大型  合唱  《  我  爱  你  ，  中国  》  和  经典  作品  威尔第  的  《  阿依达  凯旋  进行曲  》  ，  气势  恢宏  的  柴可夫斯基  《  1812  序曲  》  以  其  宏大  的  气势  震撼  了  观众  。  著名  旅  美  花腔  女高音  黄  英  和  著名  意大利  抒情  男高音  萨尔瓦多—费斯切拉  联袂  登台  ，  为  观众  献  上  了  威尔第  《  茶花女  》  选段  《  饮酒  歌  》  等  声乐  名曲  。  \n' +
                        '音乐会  在  器乐  演奏  方面  也  是  群星  荟萃  。  小提琴  协奏曲  《  梁祝  》  是  中国  观众  耳熟能详  的  经典  作品  ，  在  曾  获  意大利  帕格尼尼  小提琴  大赛  金奖  的  著名  小提琴家  吕  思清  演绎  下  更  感到  其  艺术  的  魅力  。  2000年  全美  肖邦  钢琴  比赛  第一  名  获得者  安  宁  演奏  的  柴可夫斯基  《  第一  钢琴  协奏曲  》  第三  乐章  ，  令  观众  赞叹  。  曾  在  1994年  第一  届  国际  达布雷申  打击乐  大赛  获  第二  名  的  李  飙  ，  登台  演出  了  著名  打击乐  作品  约瑟夫—施瓦特尔  《  打击乐  协奏曲  》  ，  其  快  节奏  的  旋律  令  人  仿佛  感到  了  时代  前进  的  脚步  。  \n' +
                        '演出  开始  前  ，  尉  健行  、  李  岚清  会见  了  参加  演出  的  主要  演员  。  \n' +
                        '贾  庆林  、  曾  庆红  、  何  鲁丽  、  肖  扬  、  孙  孚凌  、  万  国权  以及  中央  和  国家机关  、  北京市  有关  部门  的  负责  同志  观看  了  演出  。  40  多  个  国家  的  驻华  使节  及  夫人  也  应邀  出席  了  音乐会  。  \n' +
                        '北京  个人  所得税  增  二  成  五  \n' +
                        '本报  北京  12月  31日  讯  记者  吴  坤胜  报道  ：  记者  今天  从  北京市  地方  税务局  获悉  ，  截至  12月  30日  ，  北京市  个人  所得税  收入  达到  55.6亿  元  ，  同比  增收  11.1亿  元  ，  增长  25％  ，  成为  2000年  北京  增长  幅度  最  大  的  税种  。  \n' +
                        '据  权威  人士  分析  ，  国民经济  健康  稳定  发展  、  国家  扩大  内需  政策  的  成功  和  居民  收入  的  稳定  提高  ，  是  北京市  个人  所得税  继续  保持  增长  的  主要  原因  。  同时  ，  公民  纳税  意识  的  提高  和  税收  部门  加大  征管  检查  力度  ，  为  个人  所得税  的  收入  奠定  了  坚实  的  基础  。  2000年  北京  个人  所得税  仍然  以  工资  、  薪金  所得  项目  为主  ，  占  个人  所得税  总额  的  九  成  以上  ，  增收额  占  个人  所得税  增收  总额  的  七  成  以上  。  \n' +
                        '哈尔滨  国际  冰雪节  有  看头  \n' +
                        '本报  哈尔滨  12月  31日  电  记者  董  伟  、  胡  斌  、  夏  珺  报道  ：  今天  的  北国  冰城  哈尔滨  欢歌笑语  此起彼伏  。  第十七  届  哈尔滨  国际  冰雪节  在  欢呼声  中  于  松花江  畔  拉开  帷幕  ，  冰城  人  以  自己  特有  的  方式  喜  迎  新  世纪  的  到来  。  \n' +
                        '本届  冰雪节  不同  以往  ，  规模  为  历年  之  最  。  占  地  30万  平方米  的  冰雪  大世界  ，  已  成为  目前  世界  上  最  大  的  人工  冰雪  乐园  ，  从  斯大林  公园  到  江心  沙滩  ，  3000  余  件  大型  冰雕  雪  塑  组成  的  28  个  景区  气势磅礴  。  高  科技  手段  的  大量  采用  ，  使  本届  冰雪节  异彩  纷呈  。  \n' +
                        '本届  冰雪节  第一  次  升格  为  国际级  冰雪  盛会  ，  来自  20  多  个  国家  的  使节  云集  冰城  ；  盛会  还  吸引  了  美国  、  日本  、  俄罗斯  等  国  的  冰雪  爱好者  。  \n' +
                        '为  祖国  守岁  \n' +
                        '编者  的  话  \n' +
                        '当  我们  迎来  新  世纪  第一  缕  曙光  的  时候  ，  由  新华社  、  中央  人民  广播  电台  、  中央  电视台  、  解放军报  和  本报  联合  举办  的  “  世纪  初年  走  边关  ”  活动  也  正式  拉开  了  帷幕  。  这  一  组  发自  边关  的  报道  ，  将  力求  从  不同  的  角度  反映  戍边  官兵  守卫  边疆  、  建设  边疆  的  工作  、  学习  和  生活  情况  ，  展示  边疆  各族  人民  同  戍边  官兵  的  鱼水  深情  。  \n' +
                        '十二月  三十一日  夜  ，  记者  来到  祖国  西南  边境线  海拔  四千三百一十三  米  的  乃堆拉  哨所  ，  冒  着  零下  二十三  摄氏度  的  严寒  ，  与  边防  战士  一起  为  祖国  守岁  ，  喜  迎  新  世纪  的  到来  。  \n' +
                        '脚下  就  是  国境线  。  回首  望  去  ，  我军  的  哨所  营区  里  灯火  通明  ，  迎接  新  世纪  的  晚会  正在  举行  。  官兵  们  的  欢声笑语  在  静静的  山谷  间  回荡  。  \n' +
                        '一  支  巡逻  分队  踏  着  没  膝  的  积雪  走  了  过来  。  记者  紧  跟  上去  ，  参加  了  这次  二十  世纪  最后  的  边境  巡逻  。  狂风  卷  起  飞雪  ，  打  在  脸上  刀  割  般地  痛  。  我们  抖擞精神  ，  一步步  艰难  地  行进  ，  一会儿  就  感到  呼吸  困难  ，  两  腿  发  软  。  突然  ，  我们  中  的  一  位  脚下  一  滑  ，  险些  跌倒  。  排长  唐  晓国  大  喊  一  声  ：  “  小心  ！  ”  随手  一  把  将  人  揽  住  。  我们  低头  一  看  ，  不禁  倒  吸  一  口  凉气  ，  只见  积雪  纷纷  落入  黑黝黝  的  深渊  。  唐  排长  说  ：  “  当年  ，  指导员  穆  忠民  就  是  在  一  次  巡逻  中  从  这里  滑落  下去  的  。  本来  ，  他  已经  获准  回家  探亲  ，  第二  天  就要  离开  连队  ，  可  他  非  要  参加  巡逻  ，  谁知  ……  ”  听  了  唐  排长  的  介绍  ，  我们  的  心里  沉沉的  ，  对  边防  官兵  的  奉献  精神  ，  有  了  更  深  一  层  的  理解  。  \n' +
                        '巡逻  归来  ，  晚会  已  进入  高潮  。  \n' +
                        '屋内  炉火  正  旺  ，  彩灯  闪烁  ，  官兵  们  张张  笑脸  被  灯火  映  得  通红  。  \n' +
                        '“  太阳  和  月亮  是  一个  妈妈  的  女儿  ／  她们  的  妈妈  叫  光明  ／  藏族  和  汉族  是  一个  妈妈  的  女儿  ／  她们  的  妈妈  叫  中国  ……  ”  藏族  排长  扎西次仁  引吭高歌  ，  战士  们  翩翩起舞  。  \n' +
                        '应该  熄灯  了  。  指导员  董  平均  说  ：  “  今晚  例外  ，  给  家里  打电话  ，  每人  五  分钟  。  ”  哨所  的  电话  立即  成  了  热线  。  \n' +
                        '以  辛勤  的  劳动  和  汗水  迎接  新  世纪  （  图片  ）  \n' +
                        '12月  31日  夜  ，  长江  三峡  水利枢纽  工程  工地  像  往常  一样  灯火  通明  ，  一  片  繁忙  ，  万  余  名  三峡  工程  建设者  坚守  在  各自  的  岗位  上  ，  以  辛勤  的  劳动  和  汗水  迎接  新  世纪  的  到来  。  图  为  三峡  工程  厂房  坝段  连夜  施工  的  情景  。  （  新华社  记者  杜  华举  摄  ）  \n' +
                        '世纪  书  怀  （  调寄  沁园春  ）  \n' +
                        '极目  神州  ，  龙飞凤舞  ，  各族  悠悠  ，  看  新  临  世纪  ，  风云  形势  ，  时机  挑战  ，  共  济  同  舟  。  港澳  回归  ，  台湾  父老  ，  统一  人心  正义  稠  。  向前  瞻  ，  庆  光明  远大  ，  更上层楼  。  \n' +
                        '百年  往事  沉浮  ，  载  奋斗  英雄  史册  留  。  是  领导  英明  ，  辉煌  政策  ，  人民  力量  ，  功  著  千秋  ，  唤起  全球  ，  加强  团结  ，  发展  和  平定  五洲  。  诚  祷  愿  ，  达  康  强  祖国  ，  夫  复  何  求  。  \n' +
                        '二○○○年  十二月  \n' +
                        '（  作者  为  全国  政协  副  主席  、  澳门  中华  总商会  会长  ）  \n' +
                        '世纪  交接点  上  的  思索  \n' +
                        '站  在  两  个  世纪  的  交接点  上  ，  人们  在  思索  ：  新  世纪  的  曙光  带  给  这个  世界  的  是  些  什么  ？  明天  地球  上  将  发生  些  什么  事  ？  人类  的  生活  会  变  得  怎样  ？  \n' +
                        '为了  看  清楚  未来  ，  应该  回  过  头  看看  昨天  。  当  20  世纪  即将  到来  时  ，  世界  已经  被  几  个  首先  实现  工业化  的  国家  瓜分  完毕  。  “  世界  中心  ”  ———  欧洲  强国  要  重新  分配  利益  ，  于是  有  了  两  次  世界大战  ；  接着  ，  事物  朝着  相反  的  方向  发展  ———  过去  的  殖民地  纷纷  独立  ，  一个个  新  的  国家  堂而皇之  地  走  上  国际  舞台  。  当年  那种  把  黑人  像  沙丁鱼  一样  塞  在  船  里  贩卖  到  美洲  去  、  用  大炮  押送  鸦片  到  中国  来  的  事  不  能  再  干  了  。  这  可  真是  翻天覆地  的  变化  。  20  世纪  是  人类  历史  上  值得  大书特书  的  世纪  。  \n' +
                        '新  的  世纪  呢  ？  有些  人  说  科学技术  的  空前  发展  、  经济  全球化  像  是  不偏不倚  的  太阳  ，  将  照  得  世界  一  片  光明  灿烂  ———  明天  馅饼  就  会  从天而降  。  世上  哪  有  那么  便宜  的  事  ？  科技  、  财力  和  市场  ，  这  是  21  世纪  富国  合法  、  自由  、  “  公平  ”  地  盘剥  穷国  的  三  把  利器  。  \n' +
                        '中国  在  科技  和  经济  上  也  处于  劣势  。  但是  我们  却  敢于  迎  难  而  上  ，  积极  谋求  加入  WTO  。  因为  这  可以  发挥  20  年  改革  开放  、  经济  建设  所  积累  的  优势  ，  发展  外向型  经济  ；  更  多  地  借用  外资  以  发展  ，  同时  用  国际  通行  的  规则  深化  改革  ；  提高  我们  科学技术  等  各个  方面  的  创造性  ；  在  世界  贸易  领域  争取  发言权  。  这  都  有助于  我国  尽快  地  进入  更  高  层次  的  良性  循环  ，  完成  第三  步  战略  目标  。  \n' +
                        '敢于  这样  主动  迎接  挑战  的  国家  大概  不  多  。  我们  之所以  有  这样  的  胆略  ，  一  是  因为  有  一个  坚强  的  领导  核心  ———  中国  共产党  ；  二  是  有  正确  的  建设  发展  的  理论  和  道路  ；  三  是  全国  上下  （  包括  各个  参政党  ）  齐心协力  ；  四  是  有  20  年  的  经验  和  一定  的  实力  。  但是  ，  有  了  应有  的  条件  ，  只是  具备  了  可能性  ，  要  使  之  成为  现实  ，  还  需要  我们  做  极  大  的  努力  。  \n' +
                        '显然  ，  进入  21  世纪  ，  中国  人  会  生活  得  更为  忙碌  ，  思想  更为  解放  ，  环境  更为  宽松  和谐  ，  中华  文化  会  更为  灿烂  。  \n' +
                        '（  作者  为  全国  人大  常委会  副  委员长  、  民进  中央  主席  ）  \n' +
                        '北京  地区  天气  预报  \n' +
                        '2001年  1月  1日  \n' +
                        '星期一  \n' +
                        '庚辰  年  十二月  初七  \n' +
                        '白天  多云转晴  \n' +
                        '降水  概率  20％  \n' +
                        '风向  北  \n' +
                        '风力  三  、  四  级  转  五  、  六  级  \n' +
                        '夜间  晴  \n' +
                        '降水  概率  0％  \n' +
                        '风向  北  \n' +
                        '风力  四  、  五  级  转  二  、  三  级  \n' +
                        '温度  3  ℃  ／  －  8  ℃  \n' +
                        '喜  迎  新  世纪  （  图片  ）  \n' +
                        '2000年  12月  31日  晚  ，  天津  举行  了  “  世纪  颂  ”  大型  文艺  晚会  。  图  为  小朋友  与  82  岁  的  《  歌唱  祖国  》  的  作者  王  莘  喜  迎  新  世纪  。  （  本报  记者  陶  源明  陈  杰  摄  ）  \n' +
                        '世纪  宝宝  （  图片  ）  \n' +
                        '2000年  12月  31日  23时  12分  在  北京  妇产医院  降生  的  宝宝  赵  辰蠧  （  右  ）  和  2001年  1月  1日  零时  9分  23  秒  诞生  的  宝宝  韩  纪轮  （  左  ）  在  一起  。  （  本报  记者  孟  仁泉  摄  ）  \n' +
                        '太原  ：  万  人  长跑  助  申奥  \n' +
                        '本报  太原  2000年  12月  31日  电  记者  安  洋  报道  ：  今天  上午  9时  30分  ，  太原市  万  人  长跑  活动  从  五一  广场  起步  ，  同时  3000  只  信鸽  和  上万  个  气球  一齐  飞  向  天空  。  \n' +
                        '这次  “  支持  北京  申办  奥运会  ，  以  健康  的  体魄  迈进  新  世纪  ”  的  长跑  活动  声势浩大  ，  有  大学生  、  解放军  、  机关  干部  、  工人  、  农民  、  工商业者  等  30  个  方阵  1万  人  。  长跑者  身披  彩带  、  手持  彩旗  行进  在  熙熙攘攘  的  迎泽  大街  上  ，  表达  对  北京  申办  奥运会  的  支持  。  \n' +
                        '每逢  佳节  倍  思  廉  \n' +
                        '每逢  佳节  ，  亲朋  相聚  ，  不免  谈及  党风  廉政  建设  方面  的  人  和  事  ：  哪个  两袖清风  、  一  身  正气  ，  哪个  整日  吃吃喝喝  ，  哪个  与  大  案子  有  牵连  ，  甚至  哪个  被  “  双规  ”  了  。  \n' +
                        '我  不禁  想起  一  副  春联  ：  “  每逢  佳节  倍  思  廉  ，  且  把  年关  当  廉  关  。  ”  \n' +
                        '对联  贴  在  一个  平平常常  小村  的  村委会  门口  。  这  是  老百姓  对  各级  领导  干部  的  期盼  ，  火  烫  的  拳拳之心  跃然纸上  。  \n' +
                        '逢年过节  ，  红白喜事  ，  礼尚往来  ，  本  是  人们  表达  感情  的  民俗  传统  ，  然而  这些  年  来  却  被  某些  腐败  分子  变成  贪污  受贿  的  “  生财之道  ”  。  有些  日常  还  算  “  本分  ”  的  人  ，  会  在  这时  放松  警惕  ，  推  杯  换  盏  中  丧失  了  原则  ，  年关  成  了  “  贪  关  ”  。  据  报载  ，  原  海南省  东方市  市委  书记  戚  火贵  为官  13  年  ，  仅  在  过年  期间  收受  贿  款  即  达  500  多  万  元  。  原  安徽省  阜阳市  市长  肖  作新  ，  则  把  1000  多  万  不明  资产  中  的  几十万  ，  说  成  是  孩子  的  压岁钱  。  人们  担心  ，  每  过  一个  节日  ，  又  会  有  多少  腐败  分子  陷  得  更  深  ，  又  有  多少  人  下水  ，  腐败  分子  又  会  糟蹋  多少  人民  的  劳动  果实  。  \n' +
                        '思  廉  ，  熔铸  着  希望  和  想念  。  群众  需要  廉洁  自律  、  勤政  为  民  的  党员  干部  。  群众  更  会  记住  那些  时刻  把  人民  的  冷暖  挂  在  心上  ，  处处  为  人民  办  实事  、  办  好事  的  好  党员  好  干部  。  每当  群众  遇到  了  难处  ，  他们  总是  首先  想到  所  遇见  过  的  、  甚至  仅仅  是  听说  过  的  这样  的  好  干部  。  他们  相信  ，  从  那里  总是  能够  得到  帮助  和  关怀  。  他们  把  得到  无私  而  真诚  帮助  的  日子  ，  作为  自己  的  节日  。  雷  锋  、  焦  裕禄  、  李  向群  等  优秀  的  共产党员  ，  与其  说是  党  发现  的  ，  不如  说是  人民  树立  的  。  他们  是  群众  最  亲  的  亲人  。  人民  永远  忘  不  了  他们  。  \n' +
                        '思  ，  也  是  一  种  支持  。  人民  支持  党  开展  廉政  建设  和  反  腐败  斗争  。  群众  看到  了  从  陈  希同  到  成  克杰  等  一  批  大  贪  巨  蠹  的  被  严惩  ，  看到  了  中央  在  处理  湛江  走私案  、  厦门  远华  走私案  等  大案要案  中  的  决心  。  这样  的  斗争  ，  每  一个  成功  都  是  人民  值得  庆祝  的  节日  。  人民  相信  ，  我们  的  党  的确  是  代表  着  最  广大  人民  群众  的  根本  利益  并  为  之  不懈  奋斗  的  党  。  \n' +
                        '思  中  又  有  着  感谢  。  人民  感谢  党  实行  改革  开放  的  好  政策  ，  找到  了  一  条  建设  现代化  实现  国家  振兴  的  好  路子  。  人民  也  担心  有的  干部  不  能  真正  把  好  政策  落实  下去  ，  而  只是  照顾  自己  的  所谓  “  关系人  ”  ，  照顾  自己  的  亲人  好友  。  人民  希望  ，  党  永远  都  能够  坚定不移  地  反腐倡廉  、  从严  治党  ；  党  的  强  国  富民  的  政策  要  坚持  下去  ，  而且  坚持  使  最  大多数  人  受益  。  \n' +
                        '其实  ，  廉政  就  是  对  人民  的  最深  的  感情  的  体现  。  在  最近  召开  的  中央  纪委  第五  次  全体  会议  上  ，  江  泽民  同志  语重心长  地  强调  ，  要  深入  研究  在  发展  社会主义  市场经济  和  对外开放  的  条件  下  腐败  现象  产生  的  特点  与  规律  ，  加大  从  源头  上  预防  和  治理  腐败  的  力度  。  我们  说  ，  这  又  是  人民  的  一个  节日  。  \n' +
                        '迈进  光辉灿烂  的  新  世纪  ———  元旦  献辞  \n' +
                        '新  世纪  到来  了  ！  \n' +
                        '全世界  人民  张开  双臂  ，  迎接  人类  历史  的  又  一个  新纪元  。  抚今追昔  ，  我们  感慨万千  ；  展望  前程  ，  我们  心潮澎湃  。  \n' +
                        '刚刚  过去  的  20  世纪  ，  波澜壮阔  ，  风雷  激荡  。  这  是  殖民主义  体系  全面  崩溃  、  民族  独立  和  民族  解放  风起云涌  的  百年  ，  是  社会主义  诞生  、  发展  并  经历  曲折  斗争  的  百年  ，  是  科学技术  全面  发展  、  社会  生产力  突飞猛进  的  百年  。  上  半  个  世纪  ，  人类  经历  了  两  次  世界大战  ，  浩劫  空前  ；  下  半  个  世纪  ，  国际  形势  深刻  变化  ，  和平  与  发展  成为  时代  的  主题  。  全世界  人民  在  艰难  中  跋涉  ，  在  求索  中  奋进  ，  在  正义  与  邪恶  的  斗争  中  新生  ，  在  社会  变革  和  科技  革命  中  发展  ，  创造  了  以往  时代  无可比拟  的  新  的  文明  。  \n' +
                        '中国  作为  世界  上  最  古老  的  东方  大国  ，  从  积贫积弱  走向  繁荣富强  ，  谱写  了  人类  历史  上  悲壮  而  又  辉煌  的  篇章  。  从  1900年  八国联军  攻陷  北京  ，  中国  饱受  帝国主义  列强  蹂躏  践踏  ，  到  2000年  我国  实现  社会主义  现代化  建设  前  两  步  战略  目标  ，  100  年  间  ，  封建王朝  坍塌  ，  五四运动  爆发  ，  中国  共产党  诞生  ，  土地  革命  兴起  ，  抗日战争  胜利  ，  三座大山  倾覆  ，  新  中国  建立  ，  改革  开放  成功  ，  香港  、  澳门  回归  祖国  ，  神州  大地  发生  了  翻天覆地  的  变化  。  \n' +
                        '世纪  之  交  ，  放眼  祖国  万里河山  ，  一  片  欣欣向荣  ，  蒸蒸日上  。  新  中国  成立  以来  特别  是  改革  开放  以来  ，  我国  的  现代化  建设  取得  巨大  成就  ，  政治  稳定  ，  经济  发展  ，  民族  团结  ，  社会  进步  ，  人民  生活  不断  得到  改善  。  我们  正  沿着  有  中国  特色  社会主义  的  康庄大道  豪情  满怀  、  昂首阔步  走  进  新  时代  。  此时此刻  ，  我们  不会  忘记  在  百年  峥嵘岁月  中  祖国  经历  的  三  次  历史性  巨大  变化  。  我们  不会  忘记  孙  中山  、  毛  泽东  、  邓  小平  这  三  位  站  在  时代  前列  的  伟大  人物  。  他们  代表  着  中国  历史  前进  的  三  个  时代  ，  他们  的  伟大  思想  、  崇高  品德  和  不朽  业绩  永远  镌刻  在  历史  的  丰碑  上  ，  激励  着  亿万  人民  继续  奋发  前进  。  我们  也  不会  忘记  为了  救亡图存  、  振兴  中华  而  英勇  奋斗  、  为国捐躯  的  无数  革命  先烈  和  志士仁人  。  他们  的  奋斗  牺牲  与  20  世纪  中国  人民  气壮山河  的  斗争  、  光耀  千秋  的  伟业  同在  。  20  世纪  ，  中国  人民  在  革命  、  建设  和  改革  中  取得  的  巨大  成功  ，  是  马克思主义  的  一个  了不起  的  胜利  ，  是  科学  社会主义  的  一个  了不起  的  胜利  ，  是  中国  人民  的  一个  了不起  的  胜利  。  \n' +
                        '百年  沧桑  ，  三  次  巨变  ，  得出  一个  根本  结论  ：  只有  中国  共产党  才  能  领导  中国  人民  取得  民族  独立  、  人民  解放  和  社会主义  的  胜利  ，  才  能  开创  建设  有  中国  特色  社会主义  的  道路  ，  实现  民族  复兴  、  国家  富强  和  人民  幸福  。  \n' +
                        '新  世纪  到来  的  时候  ，  我们  所  处  的  世界  正在  深刻  的  变化  中  。  综观  国际  国内  形势  ，  继续  推进  现代化  建设  、  完成  祖国  统一  、  维护  世界  和平  与  促进  共同  发展  ，  是  我们  进入  新  世纪  必须  抓好  的  三  大  任务  。  在  这  三  大  任务  中  ，  现代化  建设  是  核心  。  到  21  世纪  中叶  ，  基本  实现  现代化  是  我们  的  总  目标  。  大力  发展  社会  生产力  ，  不断  增强  综合  国力  ，  是  社会主义  的  根本  任务  ，  也  是  我们  实现  祖国  和平  统一  ，  更  多  地  在  国际  事务  中  发挥  作用  的  首要  条件  。  我们  正  面对  世界  经济  和  科技  前所未有  的  大  发展  ，  面对  前所未有  的  激烈  的  国际  竞争  ，  这  是  一  场  全球  范围  的  大  竞争  。  一切  取决  于  首先  要  把  我们  自己  的  事情  干  好  。  抓住  机遇  ，  加快  发展  ，  开拓进取  ，  赢得  主动  ，  实现  中华民族  的  伟大  复兴  ，  这  是  中国  共产党  和  中国  人民  在  新  世纪  的  历史  责任  。  \n' +
                        '我们  一定  要  毫不动摇  地  坚持  党  的  基本  理论  、  基本  路线  和  基本  纲领  。  邓小平理论  以及  根据  这  一  理论  形成  的  “  一个  中心  、  两  个  基本点  ”  的  基本  路线  和  党  在  社会主义  初级阶段  的  政治  、  经济  、  文化  建设  的  基本  纲领  ，  是  马克思主义  理论  同  中国  现代化  建设  实践  相  结合  的  产物  ，  是  社会主义  建设  和  发展  规律  的  总结  ，  是  亿万  人民  长远  利益  的  体现  ，  是  我们  克服  困难  夺取  胜利  的  根本  保障  。  我国  社会主义  建设  的  历史  经验  证明  ，  一定  要  全面  理解  和  正确  处理  “  一个  中心  、  两  个  基本点  ”  的  关系  。  我们  的  经济  建设  ，  是  以  四  项  基本  原则  为  政治  保证  ，  以  改革  开放  为  强大  动力  的  ；  我们  的  改革  开放  ，  是  以  进一步  解放  和  发展  生产力  ，  巩固  和  发展  社会主义  制度  为  目的  的  ；  我们  的  四  项  基本  原则  ，  是  保证  改革  开放  和  经济  建设  沿着  正确  方向  前进  ，  同时  又  从  新  的  实践  中  不断  吸取  新  的  经验  来  丰富  和  发展  的  。  任何  时候  我们  都  要  全面  把握  党  的  基本  路线  的  全部  内容  ，  把  “  一个  中心  ”  和  “  两  个  基本点  ”  统一  于  建设  有  中国  特色  社会主义  伟大  实践  ，  贯穿  于  现代化  建设  的  全  过程  。  \n' +
                        '我们  一定  要  正确  处理  改革  、  发展  和  稳定  的  关系  ，  解决  好  经济  和  社会  发展  中  一  系列  关乎  全局  的  重大  问题  ，  促进  社会  全面  发展  和  进步  。  改革  是  一  场  深刻  的  社会  变革  ，  是  推进  社会主义  现代化  建设  的  重要  动力  。  20  多  年  的  改革  实践  为  我们  进一步  深化  改革  创造  了  很  好  的  基础  。  继续  推进  改革  难度  会  更  大  ，  工作  会  更  复杂  。  我们  必须  拿  出  一往无前  的  勇气  ，  在  体制  创新  方面  取得  重大  进展  。  任何  改革  都  要  进行  利益  关系  的  调整  ，  因此  我们  必须  善于  把  改革  的  力度  、  发展  的  速度  和  社会  可  承受  的  程度  协调  统一  起来  。  在  政治  稳定  中  推进  改革  、  发展  ，  在  改革  发展  中  保持  社会  稳定  。  社会主义  现代化  是  一个  完整  的  目标  ，  既  要  保持  国民经济  持续  快速  健康  发展  ，  又  要  推进  社会主义  民主  法制  建设  和  精神文明  建设  。  无论  什么  时候  我们  都  要  坚持  两手  抓  ，  两手  都  要  硬  。  \n' +
                        '我们  一定  要  振奋  精神  ，  扎实  工作  ，  全面  贯彻  落实  党  的  十五大  和  十五  届  五中全会  精神  ，  实现  新  世纪  的  良好  开局  ，  为  实现  第三  步  战略  目标  打下  坚实  基础  。  2001年  是  实施  “  十五  ”  计划  的  第一  年  。  做好  今年  的  工作  对  今后  五  年  到  十  年  的  发展  关系  重大  。  要  按照  党中央  的  部署  ，  以  发展  为  主题  ，  以  结构  调整  为  主线  ，  以  改革  开放  和  科技  进步  为  动力  ，  以  提高  人民  生活  水平  为  根本  出发点  ，  全面  推进  经济  发展  和  社会  进步  。  “  十五  ”  开局  ，  大政方针  已  定  ，  最  重要  的  就  是  要  真  抓  实干  ，  开拓进取  。  要  善于  把  中央  的  精神  同  本  地区  、  本  部门  的  实际  结合  起来  ，  缜密  规划  ，  认真  部署  ，  带领  广大  干部  群众  不断  开创  各项  工作  的  新  局面  。  \n' +
                        '我们  一定  要  按照  江  泽民  同志  “  三  个  代表  ”  的  重要  思想  ，  全面  加强  党  的  建设  。  实现  新  世纪  三  大  任务  ，  党  的  建设  是  根本  保证  。  我们  党  有  6300  多  万  党员  ，  是  领导  现代化  建设  的  核心  力量  。  党  的  状况  如何  ，  面貌  如何  ，  对  国家  的  各项  事业  的  发展  起  着  关键性  作用  。  要  坚持  用  马列主义  、  毛泽东思想  、  邓小平理论  武装  全党  ，  不断  开拓  理论  和  实践  的  新  境界  。  要  努力  提高  党  的  凝聚力  和  战斗力  ，  始终  保持  党  和  人民  群众  的  密切  联系  。  要  坚持  解放思想  、  实事求是  的  思想  路线  ，  大胆  探索  ，  与时俱进  ，  使  我们  党  永葆青春  活力  。  要  坚持  党  要  管  党  、  从严  治党  的  方针  ，  解决  好  市场经济  条件  下  拒腐防变  的  问题  ，  大力  改进  思想  作风  、  学风  和  工作  作风  ，  使  我们  党  在  思想  上  高度  统一  ，  组织  上  日益  巩固  。  党  的  各级  领导  干部  要  不断  提高  思想  政治  水平  ，  不断  提高  驾驭  复杂  局势  的  能力  。  全党  同志  要  坚持  用  马克思主义  的  宽广  眼界  观察  世界  ，  用  当代  最  新  知识  丰富  头脑  ，  更  深刻  更  全面  地  认识  当代  中国  与  当今  世界  ，  更加  清醒  和  主动  地  掌握  我们  自己  发展  的  命运  。  \n' +
                        '毛  泽东  同志  在  半  个  世纪  前  就  预言  ，  中国  的  命运  一经  操  在  人民  自己  的  手里  ，  中国  就  将  如  太阳  升起  在  东方  那样  ，  以  自己  的  辉煌  的  光焰  普照  大地  ，  建设  起  一个  崭新  的  强盛  的  名副其实  的  人民  共和国  。  邓  小平  同志  坚定  地  指出  ，  我们  干  的  事业  是  全新  的  事业  ，  如果  从  建国  起  ，  用  100  年  的  时间  把  我国  建设  成  中等  水平  的  发达国家  ，  那  就  很  了不起  。  江  泽民  同志  面向  新  世纪  豪迈  地  说  ，  中国  的  社会主义  现代化  ，  中华民族  的  伟大  复兴  ，  已  是  跃  出  东方  地平线  的  一  轮  绚丽  的  红日  ，  这  轮  红日  是  注定  要  高高  升  起来  的  。  这些  预言  和  论断  充分  表达  了  亿万  中国  人民  和  海外  同胞  的  共同  心声  ，  展现  了  中国  发展  的  壮丽  前景  。  让  我们  更  高  地  举起  邓小平理论  的  伟大  旗帜  ，  更  紧密  地  团结  在  以  江  泽民  同志  为  核心  的  党中央  周围  ，  以  新  的  奋斗  、  新  的  创造  、  新  的  成就  迈进  新  的  世纪  ，  迎接  中华民族  的  伟大  复兴  。  '

                } else if(val=='case-contract'){
                    this.keyword='成都市 武侯区 人民 法院\n' +
                        '民事 裁定书\n' +
                        '（ 2015 ） 武侯 民初 字 第7043 号\n' +
                        '原告 王某 ， 。 住 成都市 武侯区 。\n' +
                        '委托 代理人 潘锡某 ， 系 北京 万商 天勤 （ 成都 ） 律师 事务所 律师 。\n' +
                        '被告 唐某 ， 住 成都市 青羊区 。\n' +
                        '被告 周某 ， 住 成都市 青羊区 。\n' +
                        '被告 唐某 ， 住 成都市 青羊区 。\n' +
                        '本院 在 审理 原告 王某 诉 被告 唐某 、 被告 周某 、 被告 唐某 民间 借贷 纠纷 一案 中 ， 原告 王某 于 2015年 8月 12日 申请 撤诉 。\n' +
                        '本院 认为 ， 原告 王某 的 撤诉 申请 系 其 真实 意思 表示 ， 理由 正当 、 合法 ， 应 予 支持 。 依照 《 中华 人民 共和国 民事 诉讼法 》 第一百四十五 条 第一 款 之 规定 ， 裁定 如下 ：\n' +
                        '准予 原告 王某 撤回 对 被告 唐某 、 被告 周某 、 被告 唐某 的 起诉 。\n' +
                        '案件 受理费 40330 元 ， 予以 免收 。\n' +
                        '审判员 赵阳\n' +
                        '二0一五年 八月 十二日\n' +
                        '书记员 梁新玉 ，\n' +
                        '成都市 锦江区 人民 法院\n' +
                        '民事 裁定书\n' +
                        '（ 2012 ） 锦江 民初 字 第3908 号\n' +
                        '原告 蔡丹红 。\n' +
                        '委托 代理人 胡磊 ， 四川 迪杨 律师 事务所 律师 。\n' +
                        '委托 代理人 岳萍 ， 四川迪杨 律师 事务所 律师 。\n' +
                        '被告 刘明生 。\n' +
                        '被告 赵玉芳 。\n' +
                        '本院 在 审理 原告 蔡丹红 与 被告 刘明生 、 赵玉芳 民间 借贷 纠纷 一案 中 ， 原告 蔡丹红 于 2012年 11月 15日 向 本院 申请 撤回 起诉 。\n' +
                        '本院 认为 ， 原告 蔡丹红 申请 撤回 对 被告 刘明生 、 赵玉芳 的 起诉 ， 不 影响 国家 、 集体 和 第三 人 的 利益 ， 符合 法律 规定 ， 应 予 准许 。 据 此 ， 依照 《 中华 人民 共和国 民事 诉讼法 》 第一百三十一 条 第一 款 、 第一百四十 条 第一 款 （ 五 ） 项 的 规定 ， 裁定 如下 ：\n' +
                        '准许 原告 蔡丹红 撤回 起诉 。\n' +
                        '审判员 龚晓明\n' +
                        '二〇一二年 十一月 十五日\n' +
                        '书记员 张莉 ，\n' +
                        '成都市 成华区 人民 法院\n' +
                        '民事 裁定书\n' +
                        '（ 2014 ） 成华 民初 字 第3634 号\n' +
                        '原告 蔡某某 。\n' +
                        '委托 代理人 陈杰 ， 四川 致高 守民 律师 事务所 律师 ， 特别 授权 。\n' +
                        '被告 曾某某 。\n' +
                        '被告 雅安市 兴康通 汽车 销售 服务 有限 公司 。\n' +
                        '法定 代表人 曾某某 。\n' +
                        '本院 在 审理 原告 蔡某某 与 被告 曾某某 、 雅安市 兴康通 汽车 销售 服务 有限 公司 民间 借贷 纠纷 一案 中 ， 原告 蔡某某 于 2014年 10月 13日 向 本院 提出 撤诉 申请 。\n' +
                        '本院 认为 ， 原告 蔡某某 的 撤诉 申请 符合 有关 法律 的 规定 。 依照 《 中华 人民 共和国 民事 诉讼法 》 第一百四十五 条 的 规定 ， 裁定 如下 ：\n' +
                        '准许 原告 蔡某某 撤回 起诉 。\n' +
                        '案件 受理费 10050 元 ， 原告 已 预交 至 本院 ， 退还 原告 10050 元 。\n' +
                        '代理 审判员 陈玲\n' +
                        '二〇一四年 十月 十三日\n' +
                        '书记员 薛素 ，\n' +
                        '南充市 顺庆区 人民 法院\n' +
                        '民事 裁定书\n' +
                        '（ 2015 ） 顺庆 民初 字 第2308 号\n' +
                        '原告 蔡军 。\n' +
                        '被告 冉海林 。\n' +
                        '本院 在 审理 原告 蔡军 诉 被告 冉海林 民间 借贷 纠纷 一案 中 ， 原告 于 2015年 7月 10日 向 本院 提出 撤诉 申请 。\n' +
                        '本院 认为 ： 原告 自愿 撤回 起诉 ， 符合 有关 法律 规定 。 依照 《 中华 人民 共和国 民事 诉讼法 》 第十三 条 、 第一百四十五 条 第一 款 、 第一百五十四 条 第 （ 五 ） 项 ， 裁定 如下 ：\n' +
                        '准许 原告 蔡军 撤回 起诉 。\n' +
                        '本案 受理费 79 元 ， 由 原告 蔡军 负担 。\n' +
                        '审判员 梁媛\n' +
                        '二〇一五年 七月 十日\n' +
                        '书记员 任芷函 ，\n' +
                        '成都市 金牛区 人民 法院\n' +
                        '民事 裁定书\n' +
                        '（ 2015 ） 金牛 执裁 字 第44 号\n' +
                        '申请 执行人 蔡某某 ， 男 ， 汉族 ， 1971年 3月 4日 出生 ， 住 成都市 金牛区 。\n' +
                        '委托 代理人 蔡勇 ， 四川 君合 律师 事务所 律师 。\n' +
                        '被执行人 安徽 创联 路桥 工程 有限 责任 公司 。 住所地 ： 安徽省 庐江县 。\n' +
                        '法定 代表人 梁满意 ， 董事长 。\n' +
                        '被执行人 施某某 ， 男 ， 汉族 ， 1983 年 3月 17日 出生 ， 住 安徽省 蚌埠市 禹会区 。\n' +
                        '案外人 王某某 ， 男 ， 汉族 ， 1989年 2月 13日 出生 ， 住 安徽省 桐城市 。\n' +
                        '委托 代理人 刘爱民 ， 安徽 潜川 律师 事务所 律师 。\n' +
                        '蔡雷明 与 安徽 创联 路桥 工程 有限 责任 公司 （ 以下 简称 安徽 创联 路桥 公司 ） 以及 施某某 民间 借贷 纠纷 一案 ， 蔡雷明 依据 本院 （ 2014 ） 金牛 民初 字 第3896 号 民事 调解书 向 本院 申请 强制 执行 。 在 执行 中 ， 本院 裁定 扣划 了 安徽 创联 路桥 公司 银行 存款 156.5万 元 。 嗣后 ， 案外人 王某某 向 本院 提出 异议 申请 。 本院 受理 后 ， 依法 组成 合议庭 进行 了 审查 ， 现 已 审查 完毕 。\n' +
                        '案外人 王某某 异议 称 ， “ 桐城市 2014 农村 公路 大中修 工程 （ 第二 批 ） ” 是 王某某 挂靠 安徽 创联 路桥 公司 的 资质 ， 从 安徽省 交通 主管 部门 承包 并 实际 施工 的 工程 。 2015年 2月 9日 ， 王某某 与 安徽 创联 路桥 公司 签订 《 内部 责任 承包 合同书 》 ， 该 合同 约定 ， 由 王某某 施工 的 上述 工程款 ， 必须 汇入 安徽 创联 路桥 公司 开设 在 中国 工商 银行 合肥 庐江 支行 账户 内 。 2015年 2月 17日 桐城市 财政 国库 支付 中心 将 王某某 施工 的 工程款 80万 元 汇入 上述 账户 。 同日 ， 安徽 创联 路桥 公司 将 其中 698654 元 回给 了 王某某 ， 余款 101346 元 工程款 暂时 存放 在 上述 账户 。 可 就 在 王某某 准备 将 办理 上述 余款 的 支取 手续 时 ， 2015年 3月 18日 ， 成都市 金牛区 人民 法院 从 上述 账户 扣划 156.5万 元 ， 其中 就 有 王某某 的 101346 元 工程款 。 综上 ， 请求 法院 依法 裁定 中止 对 上述 101346 元 的 执行 并 将 该 款 退回 给 王某某 。\n' +
                        '王某某 向 本院 提交 了 以下 证据 ： 《 内部 责任 承包 合同书 》 1 份 ， 中国 工商 银行 股份 有限 公司 合肥 庐江 支行 业务 回单 （ 付款 ） 1 份 ， 中国 工商 银行 股份 有限 公司 合肥 庐江 支行 业务 回单 （ 收款 ） 1 份 。\n' +
                        '蔡雷明 辩称 ， 从 王某某 与 安徽 创联 路桥 公司 签订 《 内部 责任 承包 合同书 》 可以 看出 ， 安徽 创联 路桥 公司 将 “ 桐城市 2014 农村 公路 大中修 工程 （ 第二 批 ） ” 非法 转包 给 了 王某某 ， 该 转包 行为 不 受 法律 保护 。 即使 王某某 与 安徽 创联 路桥 公司 之间 存在 挂靠 关系 ， 王某某 借用 安徽 创联 路桥 公司 的 资质 承包 工程 ， 但 挂靠 合同 与 安徽 创联 路桥 公司 的 中标 合同 是 不 同 的 法律 关系 ， 也 构成 不 同 的 法律 债权 债务 关系 。 王某某 提交 的 银行 业务 回单 也 清楚 表明 ， 付款人 不 是 王某某 ， 而 是 项目 的 业主方 。 该 款项 到账 后 ， 安徽 创联 路桥 公司 有 实际 支配 和 控制 的 权利 ， 也 就 是 说 该 笔 款项 支付 给 谁 ， 安徽 创联 路桥 公司 拥有 决定权 。 本案 查封 的 账户 记载 的 权利人 是 安徽 创联 路桥 公司 ， 账户 里 的 资金 属于 货币 资金 ， 法律 上 讲 属于 种类物 ， 不 是 特定 物权 的 载体 ， 法院 查封 扣划 安徽 创联 路桥 公司 单位 账户 资金 没有 法律 义务 去 审查 其 资金 来源 ， 根据 公示 原则 应当 认定 账户 资金 应 归属 于 安徽 创联 路桥 公司 。 挂靠 协议 作为 内部 约定 ， 不 对 外 产生 抗辩 效力 ， 王某某 仅有 的 权利 只能 是 向 安徽 创联 路桥 公司 主张 不当 得利 返还 。 王某某 提出 的 执行 异议 ， 没有 法律 依据 ， 请求 法院 依法 驳回 。\n' +
                        '经 审查 查明 ， 蔡雷明 与 安徽 创联 路桥 公司 以及 施某某 民间 借贷 纠纷 一案 ， 双方 当事人 在 本院 主持 下 达成 了 以下 调解 协议 ： “ 安徽 创联 路桥 公司 欠 蔡雷明 借款 本金 196万 元 ， 利息 27万 元 ， 共计 223万 元 ， 于 2014年 4月 25日 前 支付 25万 元 ， 余款 198万 元 于 2014年 5月 30日 前 一次性 付清 。 施某某 对 上述 款项 承担 连带 清偿 责任 等 ” 。 本院 于 2014年 4月 21日 出具 （ 2014 ） 金牛 民初 字 第3896 号 民事 调解书 ， 对 上述 协议 予以 确认 。 由于 安徽 创联 路桥 公司 以及 施某某 未 履行 上述 民事 调解书 上 所 确认 的 还款 义务 ， 蔡雷明 向 本院 申请 强制 执行 。 在 执行 过程 中 ， 本院 于 2015年 3月 18 日 出具 （ 2015 ） 金牛 执字 第609 号 执行 裁定书 ， 裁定 ： “ 冻结 （ 划拨 ） 安徽 创联 路桥 公司 银行 存款 215万 元 ” ， 并 于 当月 18日 向 中国 工商 银行 合肥 庐江 支行 发出 《 协助 扣划 存款 通知书 》 ， 扣划 安徽 创联 路桥 公司 在 上述 银行 账户 存款 156.5万 元 至 本院 账户 。\n' +
                        '另 查明 ， 王某某 提交 的 《 内部 责任 承包 合同书 》 上 载明 ： 王某某 与 安徽 创联 路桥 公司 于 2015年 2月 6日 签订 上述 合同 ， 就 “ 桐城市 2014 农村 公路 大中修 工程 （ 第二 批 ） ” ， 安徽 创联 路桥 公司 暂 按照 合同价 的 3% 收取 技术 服务费 ， 该 费用 在 第一 批 工程款 中 扣除 等 。 王某某 提交 的 银行 回单 上 载明 ： 2015年 2月 17日 桐城市 财政 国库 支付 中心 向 安徽 创联 路桥 公司 账户 内 转款 80万 元 ， 同日 ， 安徽 创联 路桥 公司 账户 向 王某某 转款 698654 元 ， 摘要 为 工程款 。\n' +
                        '本院 认为 ， 本院 裁定 将 安徽 创联 路桥 公司 在 中国 工商 银行 合肥 庐江 支行 账户 上 的 款项 予以 扣划 ， 并不 违反 法律 的 规定 。 至于 王某某 提出 上述 账户 上 101346 元 工程款 的 权属 问题 ， 属于 王某某 与 安徽 创联 路桥 公司 之间 的 法律 关系 ， 应当 通过 诉讼 或者 其他 合法 途径 予以 确认 。 据 此 ， 依照 《 中华 人民 共和国 民事 诉讼法 》 第二百二十七 条 的 规定 ， 裁定 如下 ：\n' +
                        '驳回 案外人 王某某 的 异议 。\n' +
                        '如 不 服 本 裁定 ， 可以 自 裁定 送达 之 日 起 十五 日 内 向 成都市 金牛区 人民 法院 提起 诉讼 。\n' +
                        '审判长 徐燕华\n' +
                        '审判员 游永\n' +
                        '审判员 廖群艳\n' +
                        '二o一五年 七月 二日\n' +
                        '书记员 邵霜\n' +
                        '相关 法律 条文 ：\n' +
                        '《 中华 人民 共和国 民事 诉讼法 》 ( 2007 修正 )\n' +
                        '第二百零四 条 执行 过程 中 ， 案外人 对 执行标 的 提出 书面 异议 的 ， 人民 法院 应当 自 收到 书面 异议 之 日 起 十五 日 内 审查 ， 理由 成立 的 ， 裁定 中止 对 该 标 的 的 执行 ； 理由 不 成立 的 ， 裁定 驳回 。 案外人 、 当事人 对 裁定 不 服 ， 认为 原 判决 、 裁定 错误 的 ， 依照 审判 监督 程序 办理 ； 与 原 判决 、 裁定 无关 的 ， 可以 自 裁定 送达 之 日 起 十五 日 内 向 人民 法院 提起 诉讼 。\n' +
                        '《 中华 人民 共和国 民事 诉讼法 》 ( 2012 修正 )\n' +
                        '第二百二十七 条 执行 过程 中 ， 案外人 对 执行标 的 提出 书面 异议 的 ， 人民 法院 应当 自 收到 书面 异议 之 日 起 十五 日 内 审查 ， 理由 成立 的 ， 裁定 中止 对 该 标 的 的 执行 ； 理由 不 成立 的 ， 裁定 驳回 。 案外人 、 当事人 对 裁定 不 服 ， 认为 原 判决 、 裁定 错误 的 ， 依照 审判 监督 程序 办理 ； 与 原 判决 、 裁定 无关 的 ， 可以 自 裁定 送达 之 日 起 十五 日 内 向 人民 法院 提起 诉讼 。\n' +
                        '最高 人民 法院 关于 适用 《 中华 人民 共和国 民事 诉讼法 》 执行 程序 若干 问题 的 解释 （ 法释 〔 2008 〕 13 号 ）\n' +
                        '第十七 条 案外人 依照 民事 诉讼法 第二百零四 条 规定 提起 诉讼 ， 对 执行标 的 主张 实体 权利 ， 并 请求 对 执行标 的 停止 执行 的 ， 应当 以 申请 执行人 为 被告 ； 被执行人 反对 案外人 对 执行标 的 所 主张 的 实体 权利 的 ， 应当 以 申请 执行人 和 被执行人 为 共同 被告 。\n' +
                        '第十八 条 案外人 依照 民事 诉讼法 第二百零四 条 规定 提起 诉讼 的 ， 由 执行 法院 管辖 。\n' +
                        '第二十一 条 申请 执行人 依照 民事 诉讼法 第二百零四 条 规定 提起 诉讼 ， 请求 对 执行标 的 许可 执行 的 ， 应当 以 案外人 为 被告 ； 被执行人 反对 申请 执行人 请求 的 ， 应当 以 案外人 和 被执行人 为 共同 被告 。\n' +
                        '第二十二 条 申请 执行人 依照 民事 诉讼法 第二百零四 条 规定 提起 诉讼 的 ， 由 执行 法院 管辖 。 ，\n' +
                        '德阳市 旌阳区 人民 法院\n' +
                        '民事 判决书\n' +
                        '（ 2014 ） 旌民 初字 第2857 号\n' +
                        '原告 蔡礼俊 ， 男 ， 汉族 。\n' +
                        '被告 李刚 ， 男 ， 汉族 。\n' +
                        '被告 许艳华 ， 女 ， 汉族 。\n' +
                        '委托 代理人 王小敏 ， 四川 维扬 律师 事务所 律师 。\n' +
                        '原告 蔡礼俊 与 李刚 、 徐艳华 民间 借贷 纠纷 一案 ， 本院 立案 受理 后 ， 依法 由 审判员 周永宏 适用 担任 审判长 ， 与 审判员 宾志君 、 人民 陪审员 刘芳 组成 合议庭 ， 公开 开庭 进行 了 审理 。 原告 蔡礼俊 ， 被告 徐艳华 的 委托 代理人 王小敏 到庭 参加 诉讼 。 被告 李刚 经 本院 公告 送达 起诉状 副本 未 到庭 参加 诉讼 。 本案 依法 缺席 审理 ， 现 已 审理 终结 。\n' +
                        '原告 蔡礼俊 诉称 ： 2014年 7月 14日 及 2014年 7月 29日 ， 二 被告 分 两 次 从 原告 处 借款 共计 40万 元 ， 约定 借款 期限 1 个 月 。 借款 到期 后 ， 经 与 被告 协商 ， 被告 以 各种 理由 推脱 。 被告 用于 抵押 的 奔驰 轿车 也 被 其 转移 。 事后 原告 多次 向 被告 催收 借款 ， 被告 拒 不 偿还 。 为 此 ， 原告 为 维护 其 合法 权益 ， 特 将 该 纠纷 诉 至 法院 ， 请求 判令 ： 1 . 二 被告 共同 偿还 借款 40万 元 ； 2 . 本案 诉讼费 、 保全费 由 被告 全部 承担 。\n' +
                        '被告 李刚 未 作 答辩 。'
                }

                // if(val == "1" || val == 1){
                //     this.typeScope="title";
                // }else{
                //     this.typeScope=val;
                // }
                // if(this.keyword=="" || this.keyword==undefined){
                //     return;
                // }
                // this.lawsForm.scope=this.typeScope;
                // this.exampleForm.scope=this.typeScope;
                // this.qikanForm.scope=this.typeScope;
                // this.lawsForm.keyword=this.keyword;
                // this.exampleForm.keyword=this.keyword;
                // this.qikanForm.keyword=this.keyword;
                // this.searchMethod_law(this.lawsForm);
                // this.searchMethod_exp(this.exampleForm);
                // this.searchMethod_jou(this.qikanForm);
            },
            //搜索
            getList() {
                // this.searchMethod();
                // var url = this.$route.path;
                // addSearch(this.keyword, url);

                // this.lawsForm.keyword=this.keyword;
                // this.exampleForm.keyword=this.keyword;
                // this.qikanForm.keyword=this.keyword;
                this.searchGetSegments(this.keyword);
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
                for (var word  of  rawdata){
                    if(word.split(" ").join("").trim().length>1019){
                        var segs = word.split("。").map(x=>x+"。")
                        preprocess.concat(segs);
                    }else{
                        preprocess.push(word);
                    }
                }
                //过滤空串
                this.originList = preprocess.filter(word => word.trim().length > 0 &&  word.trim()!="。");
                //构造字典
                this.rawsentences.sents = this.originList.map(word=>word.split(" ").join(""));
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
        },
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
