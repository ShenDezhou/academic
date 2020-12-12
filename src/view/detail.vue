<template xmlns:v-contextmenu="http://www.w3.org/1999/xhtml">
  <div class="one_stop_wrap main_wrap" ref="domm">
    <!-- 自定义右键事件 -->
    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="getNote">笔记</v-contextmenu-item>
      <!-- 右键点击事件 -->
      <v-contextmenu-item @click="copyNote">复制</v-contextmenu-item>
    </v-contextmenu>
    <div class="content_wrap">
      <div class="header_wrap">
        <Publichead :activeIndex="headerArr.activeIndex" :logo_url="headerArr.logo_url" @handleSelect="handleSelect"></Publichead>
      </div>
      <div class="content_main">
        <div class="header_search_wrap">
          <div class="operation_wrap" id="yes_operation_wrap">
            <ul class="operation_ul">
              <li class="item icon_wrap" v-if="NavCatalog != undefined && NavCatalog != null && NavCatalog != ''">
                <el-popover class="popover_this_wrap" placement="top-start" title="" width="260" trigger="hover">

                  <template v-if="type == 'pfnl' || type == 'gac'">
                    <div class="popover_wrap">
                      <p class="header_txt_popo">
                        <!-- <span @click="openAllMethod" v-html="openAllHtml" ></span> -->
                      </p>
                      <div class="zhang_one">
                        <dl>
                          <dt v-for="(item,index) in NavCatalog" class="expand zhang_expand">

                            <a href="javascript:void(0);" @click="toTegional(item.name)">{{item.title}}</a>
                          </dt>
                        </dl>
                      </div>
                    </div>
                  </template>
                  <template v-if="type != 'pfnl' && type != 'gac'">
                    <div class="popover_wrap">
                      <p class="header_txt_popo">
                        <span @click="openAllMethod" v-html="openAllHtml" v-if="NavCatalog[0].tier == '2' || NavCatalog[0].tier == '1'"></span>
                      </p>
                      <div class="zhang_one">
                        <dl>
                          <template v-for="(item,index) in NavCatalog">
                            <dt  :key="index" v-if="(item.tier =='2' || item.tier == '4') && NavCatalog[0].tier == '2'" :class="item.tier =='2' ? 'expand zhang_expand' : openAll == true ? 'expand tiao_expand': 'expand tiao_expand expand_hidden'">
                              <a href="javascript:void(0);" @click="toTegional(item.name)">{{item.title}}</a>
                            </dt>
                          </template>
                          <template v-for="(item,index) in NavCatalog">
                            <dt :key="index" v-if="(item.tier =='2' || item.tier == '4') && NavCatalog[0].tier == '4'" class="expand tiao_expand">
                              <a href="javascript:void(0);" @click="toTegional(item.name)">{{item.title}}</a>
                            </dt>
                          </template>
                          <template v-for="(item,index) in NavCatalog">
                              <dt :key="index" v-if="!item.tier" class="expand tiao_expand">
                                <a href="javascript:void(0);" @click="toTegional(item.name)">{{item.title}}</a>
                              </dt>
                          </template>
                          <template v-for="(item,index) in NavCatalog">
                            <dt :key="index"   v-if="(item.tier =='2' || item.tier == '4') && NavCatalog[0].tier == '1'" :class="item.tier =='2' ? 'expand zhang_expand' : openAll == true ? 'expand tiao_expand': 'expand tiao_expand expand_hidden'">
                              <a href="javascript:void(0);" @click="toTegional(item.name)">{{item.title}}</a>
                            </dt>
                          </template>
                          <template v-for="(item,index) in NavCatalog" >
                            <dt :key="index" v-if="item.tier == '4.0'">
                              <a href="javascript:void(0);" @click="toTegional(item.name)">{{item.title}}</a>
                            </dt>
                          </template>
                        </dl>
                      </div>
                    </div>
                  </template>

                  <!-- <el-button slot="reference" icon="el-icon-tickets">目录</el-button> -->
                </el-popover>
              </li>
              <li class="item" style="line-height: inherit;"
              v-if="type != 'qikan' && type != 'protocol' && type != 'legislation' && type != 'eagn' && type != 'iel'
              && type != 'hkd' && type != 'aom' && type != 'payz'  && type != 'twd' && type != 'atr' && type != 'workreport'
              && type != 'bankruptcy' && type != 'pal' && type != 'whitebook' && type != 'lawexplanation'">
                <div class="tab-lang">
                  <a href="javascript:void(0);" @click="versionChangeo" :class="[versionChange == '1'?'lang_btn fb_version active':'lang_btn fb_version']" value="1">法宝版</a>
                  <a href="javascript:void(0);" @click="versionChangeo" :class="[versionChange == '2'?'lang_btn chun_version active':'lang_btn chun_version']" value="2">纯净版</a>
                </div>
              </li>
              <li class="item">
                <el-checkbox v-model="checked_biaoliang">标亮</el-checkbox>
                <label class="hit">命中：<span class="sign_now">/</span><span class="sign_total"></span>次</label>
                <div style="display:none">
                  <el-input size="mini" v-model="search_keyword_num"></el-input>,
                  <el-input size="mini" disabled v-model="all_num"></el-input>
                </div>
              </li>
              <li class="item">
                <el-checkbox v-model="checked_juming">聚焦命中</el-checkbox>
              </li>
              <li class="item">
                <el-checkbox v-model="checked_fbwIndow">法宝之窗</el-checkbox>
              </li>
              <li class="item btn_wrap">
                <label for="">查找：</label>
                <el-input placeholder="请输入内容" v-model="search_keyword" @change="confirmStatus()" class="input-with-select">
                  <el-button slot="append" icon="el-icon-arrow-down" class="next_btn" @click="downKeyWord()"></el-button>
                  <el-button slot="append" icon="el-icon-arrow-up" class="pre_btn" @click="upKeyWord()"></el-button>
                </el-input>
              </li>
              <li class="item find_wrap_num" v-if="isShowTotal">
                <label class="">{{search_keyword_num}}/{{all_num}}</label>
              </li>
              <li class="item zhuan_wrap" v-if="NavCatalog != undefined && NavCatalog != null && NavCatalog != ''">
								<span v-if="zhuan">转第
								<el-input size="mini" v-model="search_keyword_number" @change="dump" @input="dump" @keyup.enter.native="dump"></el-input>条
								</span>
              </li>
              <li class="item operatio_xia">
                <span class="handle_list_1" @click="down">下载</span>
                <span class="handle_list_2" @click="showCollectDia">收藏</span>
                <!--<span class="handle_list_2" @click="getNote('全局')">笔记</span>-->
              </li>
            </ul>
          </div>
          <div :class="navBarFixed == true ? 'operation_wrap_bar operation_wrap' : 'operation_wrap'" id="display_operation_wrap" style="display: none;">
            <ul class="operation_ul">
              <li class="item icon_wrap" v-if="NavCatalog != undefined && NavCatalog != null && NavCatalog != ''">
                <el-popover class="popover_this_wrap" placement="top-start" title="" width="260" trigger="hover">
                  <template v-if="type == 'pfnl' || type == 'gac'">
                    <div class="popover_wrap">
                      <p class="header_txt_popo">
                        <!-- <span @click="openAllMethod" v-html="openAllHtml" ></span> -->
                      </p>
                      <div class="zhang_one">
                        <dl>
                          <dt v-for="(item,index) in NavCatalog" class="expand zhang_expand">
                            <a href="javascript:void(0);" @click="toTegional(item.name)">{{item.title}}</a>
                          </dt>
                        </dl>
                      </div>
                    </div>
                  </template>
                  <template v-if="type != 'pfnl' && type != 'gac'">
                    <div class="popover_wrap">
                      <p class="header_txt_popo">
                        <span @click="openAllMethod" v-html="openAllHtml" v-if="NavCatalog[0].tier == '2' || NavCatalog[0].tier == '1'"></span>
                      </p>
                      <div class="zhang_one">
                        <dl>
                          <template v-for="(item,index) in NavCatalog">
                            <dt  :key="index" v-if="(item.tier =='2' || item.tier == '4') && NavCatalog[0].tier == '2'" :class="item.tier =='2' ? 'expand zhang_expand' : openAll == true ? 'expand tiao_expand': 'expand tiao_expand expand_hidden'">
                              <a href="javascript:void(0);" @click="toTegional(item.name)">{{item.title}}</a>
                            </dt>
                          </template>
                          <template v-for="(item,index) in NavCatalog">
                            <dt :key="index" v-if="(item.tier =='2' || item.tier == '4') && NavCatalog[0].tier == '4'" class="expand tiao_expand">
                              <a href="javascript:void(0);" @click="toTegional(item.name)">{{item.title}}</a>
                            </dt>
                          </template>
                          <template v-for="(item,index) in NavCatalog">
                              <dt :key="index" v-if="!item.tier" class="expand tiao_expand">
                                <a href="javascript:void(0);" @click="toTegional(item.name)">{{item.title}}</a>
                              </dt>
                          </template>
                          <template v-for="(item,index) in NavCatalog">
                            <dt :key="index"   v-if="(item.tier =='2' || item.tier == '4') && NavCatalog[0].tier == '1'" :class="item.tier =='2' ? 'expand zhang_expand' : openAll == true ? 'expand tiao_expand': 'expand tiao_expand expand_hidden'">
                              <a href="javascript:void(0);" @click="toTegional(item.name)">{{item.title}}</a>
                            </dt>
                          </template>
                          <template v-for="(item,index) in NavCatalog" >
                            <dt :key="index" v-if="item.tier == '4.0'">
                              <a href="javascript:void(0);" @click="toTegional(item.name)">{{item.title}}</a>
                            </dt>
                          </template>
                        </dl>
                      </div>
                    </div>
                  </template>

                  <!-- <el-button slot="reference" icon="el-icon-tickets">目录</el-button> -->
                </el-popover>
              </li>
              <li class="item" style="line-height: inherit;"
              v-if="type != 'qikan' && type != 'protocol' && type != 'legislation' && type != 'eagn' && type != 'iel'
              && type != 'hkd' && type != 'aom' && type != 'payz'  && type != 'twd' && type != 'atr' && type != 'workreport'
              && type != 'bankruptcy' && type != 'pal' && type != 'whitebook' && type != 'lawexplanation'">
                <div class="tab-lang">
                  <a href="javascript:void(0);" @click="versionChangeo" :class="[versionChange == '1'?'lang_btn fb_version active':'lang_btn fb_version']" value="1">法宝版</a>
                  <a href="javascript:void(0);" @click="versionChangeo" :class="[versionChange == '2'?'lang_btn chun_version active':'lang_btn chun_version']" value="2">纯净版</a>
                </div>
              </li>
              <li class="item">
                <el-checkbox v-model="checked_biaoliang">标亮</el-checkbox>
                <label class="hit">命中：<span class="sign_now">/</span><span class="sign_total"></span>次</label>
                <div style="display:none">
                  <el-input size="mini" v-model="search_keyword_num"></el-input>,
                  <el-input size="mini" disabled v-model="all_num"></el-input>
                </div>
              </li>
              <li class="item">
                <el-checkbox v-model="checked_juming">聚焦命中</el-checkbox>
              </li>
              <li class="item">
                <el-checkbox v-model="checked_fbwIndow">法宝之窗</el-checkbox>
              </li>
              <li class="item btn_wrap">
                <label for="">查找：</label>
                <el-input placeholder="请输入内容" v-model="search_keyword" @change="confirmStatus()" class="input-with-select">
                  <el-button slot="append" icon="el-icon-arrow-down" class="next_btn" @click="downKeyWord()"></el-button>
                  <el-button slot="append" icon="el-icon-arrow-up" class="pre_btn" @click="upKeyWord()"></el-button>
                </el-input>
              </li>
              <li class="item find_wrap_num" v-if="isShowTotal">
                <label class="">{{search_keyword_num}}/{{all_num}}</label>
              </li>
              <li class="item zhuan_wrap" v-if="NavCatalog != undefined && NavCatalog != null && NavCatalog != ''">
								<span v-if="zhuan">转第
								<el-input size="mini" v-model="search_keyword_number" @change="dump" @input="dump" @keyup.enter.native="dump"></el-input>条
							    </span>
              </li>
              <li class="item operatio_xia">
                <span class="handle_list_1" @click="down">下载</span>
                <span class="handle_list_2" @click="showCollectDia">收藏</span>
               <!-- <span class="handle_list_2" @click="getNote('全局')">笔记</span>-->
              </li>
            </ul>
          </div>
          <div class="breadcrumb ">
						<span>
              <a href="#/">首页</a>
            </span>
            <span>
              <i>></i>
              <a :href="secondNameUrl">{{secondName}}</a>
            </span>
            <span>
              <i>></i>
              <a href="javascript:void(0);">正文阅览</a>
            </span>
          </div>
        </div>
        <div class="center_wrap" v-contextmenu:contextmenu
          v-loading="fullscreenLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0)">
          <div class="detail_wrap" :style="versionChange == '1' ? 'width: 78%;' : 'width: 100%;'">
            <template v-if="versionChange == '2'">
              <!-- dddddddddddddddd纯净版 -->
              <div v-if="!chunFlag">
                <p style="color: #2d405e;font-size: 18px;margin:20px;text-align: center;">数据加载中......</p>
              </div>
              <div v-if="chunFlag" class="chunjing_wrap">
                <span v-for="(item, index) in chunJingData" :key="index" class="chunjing_wrap_span">
                  <span v-html="item" :class="index == 0 ? 'txt_header_wrap' : 'txt_header_wrap_no'"></span>
                </span>
              </div>
            </template>
            <template v-if="versionChange == '1'">
              <template v-if="type=='pfnl'">
                <div class="detail-content">
                  <p class="header-txt">{{datapfnl.Title}}</p>
                  <div class="detail-header-txt_wrap">
                    <ul class="header-ul">
                      <li class="item row" v-if="datapfnl.Category != ''">
                        <span class="fansi_span_sb">案由：</span>
                        <span  class="item_txt">
                          <span v-for="(item,index) in datapfnl.Category" :key="index">
                            {{item}} &nbsp;&nbsp;
                          </span>
                        </span>
                      </li>
                      <li class="item" v-if="datapfnl.CaseFlag != '' && datapfnl.CaseFlag != null">
                        <span class="fansi_span_sb">案件字号：</span>
                        <span class="item_txt">{{datapfnl.CaseFlag}}</span>
                      </li>
                      <li class="item" v-if="datapfnl.Judge">
                        <span class="fansi_span_sb">审理法官：</span>
                        <span class="item_txt">{{datapfnl.Judge}}</span>
                      </li>
                      <div class="toggle_main_wrap">
                        <!-- <li class="item" v-if="datapfnl.DocumentAttr">
                          <span class="fansi_span_sb">文书类型：</span>
                          <span class="item_txt" >
                            <span v-for="(item, index) in datapfnl.DocumentAttr" :key="index">
                              {{item}} &nbsp;&nbsp;
                            </span>
                          </span>
                        </li> -->
                        <li class="item" v-if="datapfnl.DocumentAttr">
                          <span class="fansi_span_sb">文书类型：</span>
                          <span class="item_txt" >
                              {{datapfnl.DocumentAttr}}
                          </span>
                        </li>
                        <li class="item" v-if="datapfnl.LastInstanceDate">
                          <span class="fansi_span_sb">审结日期：</span>
                          <span class="item_txt">{{datapfnl.LastInstanceDate}}</span>
                        </li>
                        <li class="item" v-if="datapfnl.LastInstanceCourt">
                          <span class="fansi_span_sb">审理法院：</span>
                          <span class="item_txt">
                            <span v-for="(item, index) in datapfnl.LastInstanceCourt" :key="index">
                              {{item}} &nbsp;&nbsp;
                            </span>
                          </span>
                        </li>
                        <li class="item" v-if="datapfnl.TrialStep">
                          <span class="fansi_span_sb">审理程序：</span>
                          <span class="item_txt">
                            <span v-for="(item, index) in datapfnl.TrialStep" :key="index">
                              {{item}} &nbsp;&nbsp;
                            </span>
                          </span>
                        </li>
                        <li class="item row" v-if="datapfnl.GuidingCaseDoc">
                          <span class="fansi_span_sb">案例发文：</span>
                          <span class="item_txt" >
                            <span v-for="(item, index) in datapfnl.GuidingCaseDoc" :key="index">
                              {{item.title}} &nbsp;&nbsp;
                            </span>
                          </span>
                        </li>
                        <li class="item" v-if="datapfnl.GuidingCaseNO">
                          <span class="fansi_span_sb">案例编号：</span>
                          <span class="item_txt">{{datapfnl.GuidingCaseNO}}</span>
                        </li>
                        <li class="item" v-if="datapfnl.IssueDate">
                          <span class="fansi_span_sb">发布日期：</span>
                          <span class="item_txt">{{datagac.IssueDate}}</span>
                        </li>
                        <li class="item row" v-if="datapfnl.RightKeywrod">
                          <span class="fansi_span_sb">权责关键词：</span>
                          <span class="item_txt">
                            <span v-for="(item, index) in datapfnl.RightKeywrod" :key="index">
                              {{item}} &nbsp;&nbsp;
                            </span>
                          </span>
                        </li>
                      </div>
                    </ul>
                  </div>
                </div>

              </template>
              <template v-if="type=='payz'">
                <!--              <div id="textExample">{{secondName}}</div>-->
                <div class="detail-content">
                  <p class="header-txt">{{datapayz.Title}}</p>
                  <div class="detail-header-txt">
                    <ul class="header-ul">
                      <li class="item" v-if="datapayz.CaseGrade != '' && datapayz.CaseGrade != null">
                        <span class="fansi_span_sb">规则分类：</span><span v-for="(item,index) in datapayz.CaseGrade">
                        {{datapayz.CaseGrade.length == 1 ? item  : item }} &nbsp;&nbsp;
                        </span></li>
                      <li class="item" v-if="datapayz.LastInstanceDate != '' && datapayz.LastInstanceDate !=null">
                        <span class="fansi_span_sb">规则日期：</span><span>{{datapayz.LastInstanceDate}}</span></li>
                    </ul>
                  </div>
                </div>
              </template>
              <template v-if="type=='gac'">
                <!--              <div id="textExample">{{secondName}}</div>-->
                <div class="detail-content">
                  <p class="header-txt">{{datagac.Title}}</p>
                  <div class="detail-header-txt_wrap">
                    <ul class="header-ul">
                      <li class="item row" v-if="datagac.Category != ''">
                        <span class="fansi_span_sb">案由：</span>
                        <span  class="item_txt">
                          <span v-for="(item,index) in datagac.Category" :key="index">
                            {{item}} &nbsp;&nbsp;
                          </span>
                        </span>
                      </li>
                      <li class="item" v-if="datagac.CaseFlag != '' && datagac.CaseFlag != null">
                        <span class="fansi_span_sb">案件字号：</span>
                        <span class="item_txt">{{datagac.CaseFlag}}</span>
                      </li>
                      <li class="item" v-if="datagac.Judge">
                        <span class="fansi_span_sb">审理法官：</span>
                        <span class="item_txt">{{datagac.Judge}}</span>
                      </li>
                      <div class="toggle_main_wrap" style="display:none;">
                        <!-- <li class="item" v-if="datagac.DocumentAttr">
                          <span class="fansi_span_sb">文书类型：</span>
                          <span class="item_txt" >
                            <span v-for="(item, index) in datagac.DocumentAttr" :key="index">
                              {{item}} &nbsp;&nbsp;
                            </span>
                          </span>
                        </li> -->
                        <li class="item" v-if="datagac.DocumentAttr">
                          <span class="fansi_span_sb">文书类型：</span>
                          <span class="item_txt" >
                              {{datagac.DocumentAttr}}
                          </span>
                        </li>
                        <li class="item" v-if="datagac.LastInstanceDate">
                          <span class="fansi_span_sb">审结日期：</span>
                          <span class="item_txt">{{datagac.LastInstanceDate}}</span>
                        </li>
                        <li class="item" v-if="datagac.LastInstanceCourt">
                          <span class="fansi_span_sb">审理法院：</span>
                          <span class="item_txt">
                            <span v-for="(item, index) in datagac.LastInstanceCourt" :key="index">
                              {{item}} &nbsp;&nbsp;
                            </span>
                          </span>
                        </li>
                        <li class="item" v-if="datagac.TrialStep">
                          <span class="fansi_span_sb">审理程序：</span>
                          <span class="item_txt">
                            <span v-for="(item, index) in datagac.TrialStep" :key="index">
                              {{item}} &nbsp;&nbsp;
                            </span>
                          </span>
                        </li>
                        <li class="item row" v-if="datagac.GuidingCaseDoc">
                          <span class="fansi_span_sb">案例发文：</span>
                          <span class="item_txt" >
                            <span v-for="(item, index) in datagac.GuidingCaseDoc" :key="index">
                              {{item.title}} &nbsp;&nbsp;
                            </span>
                          </span>
                        </li>
                        <li class="item" v-if="datagac.GuidingCaseNO">
                          <span class="fansi_span_sb">案例编号：</span>
                          <span class="item_txt">{{datagac.GuidingCaseNO}}</span>
                        </li>
                        <li class="item" v-if="datagac.IssueDate">
                          <span class="fansi_span_sb">发布日期：</span>
                          <span class="item_txt">{{datagac.IssueDate}}</span>
                        </li>
                        <li class="item row" v-if="datagac.RightKeywrod">
                          <span class="fansi_span_sb">权责关键词：</span>
                          <span class="item_txt">
                            <span v-for="(item, index) in datagac.RightKeywrod" :key="index">
                              {{item}} &nbsp;&nbsp;
                            </span>
                          </span>
                        </li>
                        <!-- <div class="isUser_wrap">
                          <li class="item row">
                            <span class="fansi_span_sb">被应用情况：</span>
                            <span class="item_txt">未被应用</span>
                          </li>
                        </div> -->
                      </div>
                    </ul>
                    <div class="header_ul_zksq_wrap" >
                      <p class="header_ul_zksq_btn" @click="detailToggleMsg()">
                        <template v-if="isTopZSHtml">
                          <i class="el-icon-caret-top"></i><span class="one">收起</span>
                        </template>
                        <template v-else>
                          <i class="el-icon-caret-bottom"></i><span class="one">展开</span>
                        </template>
                      </p>
                    </div>

                  </div>
                </div>
              </template>
              <template v-if="type=='bankruptcy'">
                <div class="detail-content">
                  <p class="header-txt">{{databankruptcy.Title}}</p>
                  <div class="detail-header-txt">
                    <ul class="header-ul">
                      <li class="item" v-if="databankruptcy.CaseFlag != '' && databankruptcy.CaseFlag != null"><span class="fansi_span_sb">案件字号：</span><span>{{databankruptcy.CaseFlag}}</span></li>

                      <template v-if="Array.isArray(databankruptcy.Category)">
                        <li class="item" v-if="databankruptcy.Category"><span class="fansi_span_sb">案由：</span><span v-for="(item,index) in databankruptcy.Category">
                          {{databankruptcy.Category.length == 1 ? item  : databankruptcy.Category.length-1 == index ? item : item + ' /'}}
                        </span></li>
                      </template>
                      <template v-else>
                        <li class="item" v-if="databankruptcy.Category"><span class="fansi_span_sb">案由：</span><span>{{databankruptcy.Category}}</span></li>
                      </template>

                      <template v-if="Array.isArray(databankruptcy.CorporateProperty)">
                        <li class="item" v-if="databankruptcy.CorporateProperty"><span class="fansi_span_sb">企业性质：</span><span v-for="(item,index) in databankruptcy.CorporateProperty">
                          {{databankruptcy.CorporateProperty.length == 1 ? item  : databankruptcy.CorporateProperty.length-1 == index ? item : item + ' /'}}
                        </span></li>
                      </template>
                      <template v-else>
                        <li class="item" v-if="databankruptcy.CorporateProperty"><span class="fansi_span_sb">企业性质：</span><span>{{databankruptcy.CorporateProperty}}</span></li>
                      </template>

                      <li class="item" v-if="databankruptcy.Court != ''"><span class="fansi_span_sb">审理法院：</span><span>
                        {{databankruptcy.Court}}
                      </span></li>

                      <template v-if="Array.isArray(databankruptcy.CourtGrade)">
                        <li class="item" v-if="databankruptcy.CourtGrade"><span class="fansi_span_sb">法院级别：</span><span v-for="(item,index) in databankruptcy.CourtGrade">
                            {{databankruptcy.CourtGrade.length == 1 ? item  : databankruptcy.CourtGrade.length-1 == index ? item : item + ' /'}}
                          </span></li>
                      </template>
                      <template v-else>
                        <li class="item" v-if="databankruptcy.CourtGrade"><span class="fansi_span_sb">法院级别：</span><span>{{databankruptcy.CourtGrade}}</span></li>
                      </template>

                      <template v-if="Array.isArray(databankruptcy.DocumentAttr)">
                        <li class="item" v-if="databankruptcy.DocumentAttr"><span class="fansi_span_sb">文书类型：</span><span v-for="(item,index) in databankruptcy.DocumentAttr">
                            {{databankruptcy.DocumentAttr.length == 1 ? item  : databankruptcy.DocumentAttr.length-1 == index ? item : item + ' /'}}
                          </span></li>
                      </template>
                      <template v-else>
                        <li class="item" v-if="databankruptcy.DocumentAttr"><span class="fansi_span_sb">文书类型：</span><span>{{databankruptcy.DocumentAttr}}</span></li>
                      </template>

                      <template v-if="Array.isArray(databankruptcy.IndustryClassify)">
                        <li class="item" v-if="databankruptcy.IndustryClassify"><span class="fansi_span_sb">行业分类：</span><span v-for="(item,index) in databankruptcy.IndustryClassify">
                          {{databankruptcy.IndustryClassify.length == 1 ? item  : databankruptcy.IndustryClassify.length-1 == index ? item : item + ' /'}}
                        </span></li>
                      </template>
                      <template v-else>
                        <li class="item" v-if="databankruptcy.IndustryClassify"><span class="fansi_span_sb">行业分类：</span><span>{{databankruptcy.IndustryClassify}}</span></li>
                      </template>

                      <template v-if="Array.isArray(databankruptcy.InstrumentType)">
                        <li class="item" v-if="databankruptcy.InstrumentType"><span class="fansi_span_sb">文书样式：</span><span v-for="(item,index) in databankruptcy.InstrumentType">
                          {{databankruptcy.InstrumentType.length == 1 ? item  : databankruptcy.DocumentAttr.length-1 == index ? item : item + ' /'}}
                        </span></li>
                      </template>
                      <template v-else>
                        <li class="item" v-if="databankruptcy.InstrumentType"><span class="fansi_span_sb">文书样式：</span><span>{{databankruptcy.InstrumentType}}</span></li>
                      </template>
                      <li class="item" v-if="databankruptcy.IssueDate != '' && databankruptcy.IssueDate != null"><span class="fansi_span_sb">发布日期：</span><span>
                        {{databankruptcy.IssueDate}}
                      </span></li>
                    </ul>
                  </div>
                </div>
              </template>
              <template v-if="type=='pal'">
                <div class="detail-content">
                  <p class="header-txt">{{datapal.Title}}</p>
                  <div class="detail-header-txt">
                    <ul class="header-ul">
                      <li class="item" v-if="datapal.IssueDate != '' && datapal.IssueDate != null"><span class="fansi_span_sb">发布日期：</span><span>{{datapal.IssueDate}}</span></li>
                      <li class="item" v-if="datapal.Category != ''"><span class="fansi_span_sb">案由：</span><span v-for="(item,index) in datapal.Category">
                        {{datapal.Category.length == 1 ? item  : item }} &nbsp;&nbsp;
                      </span></li>
                    </ul>
                  </div>
                </div>
              </template>
              <template v-if="type=='atr'">
                <div class="detail-content">
                  <p class="header-txt">{{dataatr.Title}}</p>
                  <div class="detail-header-txt">
                    <ul class="header-ul">
                      <li class="item" v-if="dataatr.IssueDate != '' && dataatr.IssueDate != null"><span class="fansi_span_sb">发布日期：</span><span>{{dataatr.IssueDate}}</span></li>
                      <li class="item" v-if="dataatr.Category != ''"><span class="fansi_span_sb">仲裁分类：</span><span v-for="(item,index) in dataatr.Category">
                        {{dataatr.Category.length == 1 ? item  : item }} &nbsp;&nbsp;
                      </span></li>
                      <li class="item" v-if="dataatr.IssueDepartment != '' && dataatr.IssueDepartment != null"><span class="fansi_span_sb">裁决机构：</span><span>{{dataatr.IssueDepartment}}</span></li>
                    </ul>
                  </div>
                </div>
              </template>

              <template v-if="type=='hkd'">
                <div class="detail-content">
                  <p class="header-txt">{{datahkd.Title}}</p>
                  <div class="detail-header-txt">
                    <ul class="header-ul">
                      <li class="item" v-if="datahkd.Category != '' && datahkd.Category != null"><span class="fansi_span_sb">法规分类：</span><span>{{datahkd.Category}}</span></li>
                      <li class="item" v-if="datahkd.TimelinessDic != '' && datahkd.TimelinessDic != null"><span class="fansi_span_sb">时效性：</span><span>{{datahkd.TimelinessDic}}</span></li>
                    </ul>
                  </div>
                </div>
              </template>
              <template v-if="type=='aom'">
                <div class="detail-content">
                  <p class="header-txt">{{dataaom.Title}}</p>
                  <div class="detail-header-txt">
                    <ul class="header-ul">
                      <li class="item" v-if="dataaom.Category != '' && dataaom.Category != null"><span class="fansi_span_sb">类别：</span><span>{{dataaom.Category}}</span></li>
                      <li class="item" v-if="dataaom.IssueDate != '' && dataaom.IssueDate != null"><span class="fansi_span_sb">刊登日期：</span><span>{{dataaom.IssueDate}}</span></li>
                    </ul>
                  </div>
                </div>
              </template>
              <template v-if="type=='twd'">
                <div class="detail-content">
                  <p class="header-txt">{{datatwd.Title}}</p>
                  <div class="detail-header-txt">
                    <ul class="header-ul">
                      <li class="item" v-if="datatwd.Category != '' && datatwd.Category != null"><span class="fansi_span_sb">法规类别：</span><span>{{datatwd.Category}}</span></li>
                      <li class="item" v-if="datatwd.IssueDate != '' && datatwd.IssueDate != null"><span class="fansi_span_sb">刊登日期：</span><span>{{datatwd.IssueDate}}</span></li>
                      <li class="item" v-if="datatwd.Department != ''">
                        <span class="fansi_span_sb">发文单位：</span>
                        <span v-for="(item,index) in datatwd.Department">
                          {{datatwd.Department.length == 1 ? item  : item}} &nbsp;&nbsp;
                        </span>
                      </li>
                      <li class="item" v-if="datatwd.DocumentNO != ''&& datatwd.DocumentNO != null"><span class="fansi_span_sb">发文字号：</span><span>{{datatwd.DocumentNO}}</span></li>
                      <li class="item" v-if="datatwd.ReleaseDate != ''"><span class="fansi_span_sb">发布日期：</span><span>{{datatwd.ReleaseDate}}</span></li>
                    </ul>
                  </div>
                </div>
              </template>
              <template v-if="type=='chl' || type=='lar' || type=='protocol' || type=='whitebook' || type=='workreport'
              || type=='lawexplanation' || type=='eagn' || type=='legislation' || type=='iel'">
                <div class="detail-content">
                  <p class="header-txt">{{datachl.Title}}</p>
                  <div class="detail-header-txt">
                    <ul class="header-ul">
                         <li class="item" v-if="datachl.IssueDepartment != ''"><span class="fansi_span_sb">发布部门：</span><span v-for="(item,index) in datachl.IssueDepartment">
                        {{datachl.IssueDepartment.length == 1 ? item  : item }} &nbsp;&nbsp;
                      </span></li>
                      <template v-if="datachl.DocumentNO">
                        <li class="item"><span class="fansi_span_sb" style="display:block;">发文字号：</span><span style="float: left;margin-left: 80px;margin-top: -20px;">{{datachl.DocumentNO}}</span></li>
                      </template>


                      <template v-if="datachl.RatifyDate">
                        <li class="item"  v-if="type == 'lar'"><span class="fansi_span_sb">批准日期：</span><span >{{datachl.RatifyDate}}</span></li>
                      </template>

                      <li class="item" v-if="datachl.IssueDate != '' && datachl.IssueDate"><span class="fansi_span_sb">发布日期：</span><span>{{datachl.IssueDate}}</span></li>
                      <template v-if="type != 'protocol' && type != 'lawexplanation' && type != 'whitebook' && type != 'workreport'">
                        <li class="item" v-if="datachl.ImplementDate != '' && datachl.ImplementDate !=null"><span class="fansi_span_sb">实施日期：</span><span>{{datachl.ImplementDate}}</span></li>
                        <template v-if="type != 'legislation'">
                          <li class="item" v-if="datachl.TimelinessDic != ''"><span class="fansi_span_sb">时效性：</span><span>{{datachl.TimelinessDic}}</span></li>
                        </template>
                      </template>
                    <template v-if="type != 'lar' && type != 'whitebook' && type != 'workreport' &&
                        type !='legislation' && type !='eagn'">
                        <li class="item" v-if="datachl.EffectivenessDic != ''"><span class="fansi_span_sb">效力级别：</span><span v-for="(item,index) in datachl.EffectivenessDic">
                            {{datachl.EffectivenessDic.length == 1 ? item  : item }} &nbsp;&nbsp;
                        </span></li>
                      </template>
                      <li class="item" v-if="datachl.Category != ''"><span class="fansi_span_sb">法规类别：</span><span v-for="(item,index) in datachl.Category">
                        {{datachl.Category.length == 1 ? item  : item }} &nbsp;&nbsp;
                      </span></li>

                    </ul>
                  </div>
                </div>
              </template>

              <!-- {{dataqikan}} -->
              <template v-if="type=='qikan'">
                <div class="detail-content">
                  <p class="header-txt" v-if="dataqikan.InfoTitle">{{dataqikan.InfoTitle}}</p>
                  <p class="header-txt" v-else>{{dataqikan.InfoTitleEn}}</p>

                  <div class="detail-header-txt">
                    <ul class="header-ul">
                      <li class="item" v-if="dataqikan.JournalId != '' && dataqikan.JournalId != null">
                        <span class="fansi_span_sb">期刊名称：</span><span>{{dataqikan.JournalId}}</span></li>
                        <li class="item" v-if="dataqikan.JournalYear != '' && dataqikan.JournalYear != null">
                        <span class="fansi_span_sb">期刊年份：</span><span>{{dataqikan.JournalYear}}</span></li>

                        <li class="item" style="display:block;width:95%;" v-if="dataqikan.InfoSummary != '' && dataqikan.InfoSummary != null">
                        <span class="fansi_span_sb" >摘&nbsp;&nbsp;要：</span>
                        <span style="display: block;float: left;margin-left: 80px;margin-top: -20px;margin-bottom: 20px;">{{dataqikan.InfoSummary}}</span>
                        </li>

                      <li class="item" v-if="dataqikan.InfoAuthor != '' && dataqikan.InfoAuthor != null">
                        <span class="fansi_span_sb">作&nbsp;&nbsp;者：</span><span>{{dataqikan.InfoAuthor}}</span></li>
                      <li class="item" v-if="dataqikan.AuthorUnit != '' && dataqikan.AuthorUnit != null">
                        <span class="fansi_span_sb">作者单位：</span><span>{{dataqikan.AuthorUnit}}</span></li>
                      <li class="item" v-if="dataqikan.JournalIssue != '' && dataqikan.JournalIssue != null">
                        <span class="fansi_span_sb">期&nbsp;&nbsp;号：</span><span>{{dataqikan.JournalIssue}}</span></li>
                        <li class="item" v-if="dataqikan.InfoPage != '' && dataqikan.InfoPage != null">
                        <span class="fansi_span_sb">页&nbsp;&nbsp;码：</span><span>{{dataqikan.InfoPage}}</span></li>

                    </ul>
                  </div>
                </div>
              </template>
              <!--本法变迁--开始-->
            <div class="aim_law_change referenceThisLaw_main_wrap" v-if="lawChangeDetail.length > 0">
              <p class="change_header referenceThisLaw_header">
                <span class="one">本法变迁</span>
                <span class="change_icon referenceThisLaw_icon shouqi" @click="slowUp_change($event,'referenceThisLaw_center_wrap_change')">
                  收起<i class="el-icon-arrow-up"></i>
                </span>
              </p>
              <div class="change_content_wrap referenceThisLaw_center_wrap referenceThisLaw_center_wrap_change">
                  <div>
                      <el-timeline>
                        <el-timeline-item
                          v-for="(item, index) in lawChangeDetail"
                          :key="index"
                          :timestamp="item.time"
                          placement="top"
                          color="#0bbd87">
                          <p style="text-align:left;padding:4px;font-size: 14px;color: #218fc4;">
                            <a :href="'#/detail/'+type+'/'+item.Gid" target="_blank">{{item.name}}</a>
                          </p>
                        </el-timeline-item>
                      </el-timeline>
                  </div>
              </div>
            </div>
            <!--本法变迁--结束-->
            <!-- 引用本法 -->
            <div class="aim_law_change referenceThisLaw_main_wrap" v-if="referenceThisLaw.length > 0">
              <p class="change_header referenceThisLaw_header">
                <span class="one">引用本法</span>
                <span class="change_icon referenceThisLaw_icon shouqi" @click="slowUp_change($event,'referenceThisLaw_center_wrap_yinyong')">
						收起<i class="el-icon-arrow-up"></i>
					</span>
              </p>
              <div class="change_content_wrap referenceThisLaw_center_wrap referenceThisLaw_center_wrap_yinyong">
                <p class="referenceThisLaw_p">
						<span v-for="(itemLaw, indexLaw) in referenceThisLaw" :key="indexLaw">
							{{itemLaw}}
						</span>
                </p>
              </div>
            </div>

            <div class="detail_content_wrap" @mouseover="showDiglog($event)">
              <template v-if="type=='chl' || type=='lar' || type=='protocol' || type=='whitebook' || type=='workreport'
              || type=='lawexplanation' || type=='eagn' || type=='legislation' || type=='iel'">
                <div v-html="datachl.FullText" @click="getSelWord"></div>
              </template>

              <template v-if="type=='hkd'">
                <div v-html="datahkd.FullText" @click="getSelWord"></div>
              </template>
              <template v-if="type=='aom'">
                <div v-html="dataaom.FullText" @click="getSelWord"></div>
              </template>
              <template v-if="type=='twd'">
                <div v-html="datatwd.FullText" @click="getSelWord"></div>
              </template>

              <template v-if="type=='pfnl'">
                <div v-html="datapfnl.FullText" @click="getSelWord"></div>
              </template>
              <template v-if="type=='gac'">
                <div v-html="datagac.FullText" @click="getSelWord"></div>
              </template>
              <template v-if="type=='bankruptcy'">
                <div v-html="databankruptcy.FullText" @click="getSelWord"></div>
              </template>
              <template v-if="type=='pal'">
                <div v-html="datapal.FullText" @click="getSelWord"></div>
              </template>
              <template v-if="type=='atr'">
                <div v-html="dataatr.FullText" @click="getSelWord"></div>
              </template>
              <template v-if="type=='payz'">
                <div v-html="datapayz.FullText" @click="getSelWord"></div>
              </template>
              <template v-if="type=='qikan'">
                <div v-html="dataqikan.InfoSummary" @click="getSelWord"></div>
                <div v-html="dataqikan.ContentTxt" @click="getSelWord"></div>
              </template>

            </div>
            </template>


            <el-dialog
              title="法宝之窗"
              :visible.sync="dialogVisible"
              width="30%"
              :before-close="handleClose">
              <div class="fbzc_wrap">
                <template v-if="!fbWindowArr">
                  <p class="onload_fbwindows">
                    正在加载中......
                  </p>
                </template>
                <ul class="fbzc_wrap_ul" v-if="fbWindowArr">
                  <li class="item block_item" v-if="fbWindow.title">
                    <span class="block_item_title">标题:</span>
                    <span class="block_item_txt">{{fbWindow.title}}</span>
                  </li>
                  <li class="item block_item" v-if="fbWindow.issueDepartment">
                    <span class="block_item_title">发布部门:</span>
                    <span class="block_item_txt">{{fbWindow.issueDepartment}}</span>
                  </li>
                  <li class="item block_item" v-if="fbWindow.documentNO">
                    <span class="block_item_title">发文字号:</span>
                    <span class="block_item_txt">{{fbWindow.documentNO}}</span>
                  </li>
                  <li class="item" v-if="fbWindow.issueDate">
                    <span class="item_title">发布日期:</span>
                    <span class="item_txt">{{fbWindow.issueDate}}</span>
                  </li>
                  <li class="item" v-if="fbWindow.implementDate">
                    <span class="item_title">实施日期:</span>
                    <span class="item_txt">{{fbWindow.implementDate}}</span>
                  </li>
                  <li class="item"  v-if="fbWindow.effectivenessDic">
                    <span class="item_title">效力级别:</span>
                    <span class="item_txt">{{fbWindow.effectivenessDic}}</span>
                  </li>
                  <li class="item"  v-if="fbWindow.category">
                    <span class="item_title">法规类别:</span>
                    <span class="item_txt">{{fbWindow.category}}</span>
                  </li>
                  <li class="item" v-if="fbWindow.timelinessDic">
                    <span class="item_title">时效性:</span>
                    <span class="item_txt">{{fbWindow.timelinessDic}}</span>
                  </li>
                  <li class="item" v-if="fbWindow.fbm">
                    <span class="item_title">法宝引证码:</span>
                    <span class="item_txt">{{fbWindow.fbm}}</span>
                  </li>
                </ul>
              </div>
              <span slot="footer" class="dialog-footer">
              </span>
            </el-dialog>


          </div>
          <div class="fb_lian_wrap" v-if="versionChange == '1'">
            <!-- {{listFblian}} -->
            <div id="textExample">法宝联想</div>
           <!-- magicWeaponLenovo-->
          <!-- hhhhh {{magicWeaponLenovo.hasLenovo}} -->
            <template v-if="magicWeaponLenovo.hasLenovo">
              <!-- 法宝联想数据展示区域 -->
              <!--  -->
              <template v-if="type == 'chl'">
                <div class="ul-list" v-if="magicWeaponLenovo.backgroundData">
                  <p class="lian_header">背景资料</p>
                  <template v-for="(item01,key01, index01) in magicWeaponLenovo.backgroundData">
                    <div class="lian_list_ul_wrap" :key="index01">
                      <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_01_01')">
                          <i class="el-icon-minus"></i><span>立法草案</span>
                        </span>
                      </p>
                      <ul class="lian_list_ul lian_list_ul_chl_01_01">
                        <li class="item" v-for="(item001, index001) in item01" :key="index001">
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item001.index+'/'+item001.gid)" >{{item001.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>

                </div>
                <div class="ul-list" v-if="magicWeaponLenovo.ReferenceArticleGidTiaoNum && magicWeaponLenovo.ReferenceFlag">
                  <p class="lian_header">本篇引用的法规</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.ReferenceArticleGidTiaoNum" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_02_'+index02)">
                          <i class="el-icon-minus"></i>
                          <template v-if="key02 == 'chl'">
                            <span>中央法规</span>
                          </template>
                          <template v-if="key02 == 'lar'">
                            <span>地方法规</span>
                          </template>
                          <template v-if="key02 == 'protocol'">
                            <span>草案</span>
                          </template>
                          <template v-if="key02 == 'lawexplanation'">
                            <span>法规解读</span>
                          </template>
                          <template v-if="key02 == 'whitebook'">
                            <span>白皮书</span>
                          </template>
                          <template v-if="key02 == 'workreport'">
                            <span>工作报告</span>
                          </template>
                          <template v-if="key02 == 'legislation'">
                            <span>立法计划</span>
                          </template>
                          <template v-if="key02 == 'eagn'">
                            <span>中外条约</span>
                          </template>
                          <template v-if="key02 == 'iel'">
                            <span>外国法规</span>
                          </template>
                          <template v-if="key02 == 'hkd'">
                            <span>香港法规</span>
                          </template>
                          <template v-if="key02 == 'aom'">
                            <span>澳门法规</span>
                          </template>
                          <template v-if="key02 == 'twd'">
                            <span>台湾法规</span>
                          </template>
                        </span>
                      </p>
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_02_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>

                <div class="ul-list" v-if="magicWeaponLenovo.BeReferenceArticleGidTiaoNum && magicWeaponLenovo.BeReferenceFlag">
                  <p class="lian_header">引用本篇的法规 案例 论文</p>
                  <template v-for="(item03,key03,index03) in magicWeaponLenovo.BeReferenceArticleGidTiaoNum" >
                    <div class="lian_list_ul_wrap" :key="index03">
                      <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_03_'+index03)">
                          <i class="el-icon-minus"></i><span>{{key03}}</span>
                        </span>
                      </p>
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_03_'+index03">
                        <li class="item" v-for="(item003, index003) in item03" :key="index003">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item003.index+'/'+item003.gid)">{{item003.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
              </template>
              <template v-if="type == 'lar'">
                <div class="ul-list" v-if="magicWeaponLenovo.ReferenceArticleGidTiaoNum && magicWeaponLenovo.ReferenceFlag">
                  <p class="lian_header">本篇引用的法规</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.ReferenceArticleGidTiaoNum" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_01_'+index02)">
                          <i class="el-icon-minus"></i>
                          <template v-if="key02 == 'chl'">
                            <span>中央法规</span>
                          </template>
                          <template v-if="key02 == 'lar'">
                            <span>地方法规</span>
                          </template>
                          <template v-if="key02 == 'protocol'">
                            <span>草案</span>
                          </template>
                          <template v-if="key02 == 'lawexplanation'">
                            <span>法规解读</span>
                          </template>
                          <template v-if="key02 == 'whitebook'">
                            <span>白皮书</span>
                          </template>
                          <template v-if="key02 == 'workreport'">
                            <span>工作报告</span>
                          </template>
                          <template v-if="key02 == 'legislation'">
                            <span>立法计划</span>
                          </template>
                          <template v-if="key02 == 'eagn'">
                            <span>中外条约</span>
                          </template>
                          <template v-if="key02 == 'iel'">
                            <span>外国法规</span>
                          </template>
                          <template v-if="key02 == 'hkd'">
                            <span>香港法规</span>
                          </template>
                          <template v-if="key02 == 'aom'">
                            <span>澳门法规</span>
                          </template>
                          <template v-if="key02 == 'twd'">
                            <span>台湾法规</span>
                          </template>
                        </span>
                      </p>
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_01_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
              </template>
              <template v-if="type == 'lawexplanation'">
                <div class="ul-list" v-if="magicWeaponLenovo.ReferenceArticleGidTiaoNum && magicWeaponLenovo.ReferenceFlag">
                  <p class="lian_header">相关法规</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.ReferenceArticleGidTiaoNum" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_01_'+index02)">
                          <i class="el-icon-minus"></i>
                          <template v-if="key02 == 'chl'">
                            <span>中央法规</span>
                          </template>
                          <template v-if="key02 == 'lar'">
                            <span>地方法规</span>
                          </template>
                          <template v-if="key02 == 'protocol'">
                            <span>草案</span>
                          </template>
                          <template v-if="key02 == 'lawexplanation'">
                            <span>法规解读</span>
                          </template>
                          <template v-if="key02 == 'whitebook'">
                            <span>白皮书</span>
                          </template>
                          <template v-if="key02 == 'workreport'">
                            <span>工作报告</span>
                          </template>
                          <template v-if="key02 == 'legislation'">
                            <span>立法计划</span>
                          </template>
                          <template v-if="key02 == 'eagn'">
                            <span>中外条约</span>
                          </template>
                          <template v-if="key02 == 'iel'">
                            <span>外国法规</span>
                          </template>
                          <template v-if="key02 == 'hkd'">
                            <span>香港法规</span>
                          </template>
                          <template v-if="key02 == 'aom'">
                            <span>澳门法规</span>
                          </template>
                          <template v-if="key02 == 'twd'">
                            <span>台湾法规</span>
                          </template>
                        </span>
                      </p>
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_01_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
              </template>
              <template v-if="type == 'eagn'">
                <div class="ul-list" v-if="magicWeaponLenovo.sameTreaty">
                  <p class="lian_header">相同国家或国际组织的条约</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.sameTreaty" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <!-- <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_02_'+index02)">
                          <i class="el-icon-minus"></i><span>相同国家或国际组织的条约</span>
                        </span>
                      </p> -->
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_01_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
                <div class="ul-list" v-if="magicWeaponLenovo.sameTypeTreaty">
                  <p class="lian_header">相同分类其它条约</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.sameTypeTreaty" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <!-- <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_02_'+index02)">
                          <i class="el-icon-minus"></i><span>相同分类其它条约</span>
                        </span>
                      </p> -->
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_02_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
              </template>
              <template v-if="type == 'pfnl'">
                <div class="ul-list" v-if="magicWeaponLenovo.BeReferenceArticleGidTiaoNum && magicWeaponLenovo.BeReferenceFlag">
                  <p class="lian_header">本案法律依据</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.BeReferenceArticleGidTiaoNum" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <!-- <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_02_'+index02)">
                          <i class="el-icon-minus"></i><span>{{key02 == 'chl' ? '中央法规' : '地方法规'}}</span>
                        </span>
                      </p> -->
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_03_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
                <div class="ul-list" v-if="magicWeaponLenovo.importantCase">
                  <p class="lian_header">本法院同类案例</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.importantCase" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <!-- <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_02_'+index02)">
                          <i class="el-icon-minus"></i><span>{{key02 == 'chl' ? '中央法规' : '地方法规'}}</span>
                        </span>
                      </p> -->
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_04_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
                <div class="ul-list" v-if="magicWeaponLenovo.similarCase">
                  <p class="lian_header">同案由重要案例</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.similarCase" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <!-- <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_02_'+index02)">
                          <i class="el-icon-minus"></i><span>{{key02 == 'chl' ? '中央法规' : '地方法规'}}</span>
                        </span>
                      </p> -->
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_05_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
                <div class="ul-list" v-if="magicWeaponLenovo.casePapers">
                  <p class="lian_header">相关论文</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.casePapers" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <!-- <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_02_'+index02)">
                          <i class="el-icon-minus"></i><span>{{key02 == 'chl' ? '中央法规' : '地方法规'}}</span>
                        </span>
                      </p> -->
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_06_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.cgid)">{{item002.infoTitle}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
              </template>
              <template v-if="type == 'gac'">
                <div class="ul-list" v-if="magicWeaponLenovo.BeReferenceArticleGidTiaoNum && magicWeaponLenovo.BeReferenceFlag">
                  <p class="lian_header">本案法律依据</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.BeReferenceArticleGidTiaoNum" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <!-- <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_02_'+index02)">
                          <i class="el-icon-minus"></i><span>{{key02 == 'chl' ? '中央法规' : '地方法规'}}</span>
                        </span>
                      </p> -->
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_01_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
                <div class="ul-list" v-if="magicWeaponLenovo.importantCase">
                  <p class="lian_header">本法院同类案例</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.importantCase" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <!-- <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_02_'+index02)">
                          <i class="el-icon-minus"></i><span>{{key02 == 'chl' ? '中央法规' : '地方法规'}}</span>
                        </span>
                      </p> -->
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_02_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
                <div class="ul-list" v-if="magicWeaponLenovo.similarCase">
                  <p class="lian_header">同案由重要案例</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.similarCase" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <!-- <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_02_'+index02)">
                          <i class="el-icon-minus"></i><span>{{key02 == 'chl' ? '中央法规' : '地方法规'}}</span>
                        </span>
                      </p> -->
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_03_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
                <div class="ul-list" v-if="magicWeaponLenovo.casePapers">
                  <p class="lian_header">相关论文</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.casePapers" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <!-- <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_02_'+index02)">
                          <i class="el-icon-minus"></i><span>{{key02 == 'chl' ? '中央法规' : '地方法规'}}</span>
                        </span>
                      </p> -->
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_04_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.cgid)">{{item002.infoTitle}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
              </template>
              <template v-if="type == 'bankruptcy'">
                <div class="ul-list" v-if="magicWeaponLenovo.ReferenceArticleGidTiaoNum && magicWeaponLenovo.ReferenceFlag">
                  <p class="lian_header">本案法律依据</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.ReferenceArticleGidTiaoNum" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <!-- <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_02_'+index02)">
                          <i class="el-icon-minus"></i><span>{{key02 == 'chl' ? '中央法规' : '地方法规'}}</span>
                        </span>
                      </p> -->
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_01_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
                <div class="ul-list" v-if="magicWeaponLenovo.relatedCase">
                  <p class="lian_header">相关案例</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.relatedCase" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <!-- <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_02_'+index02)">
                          <i class="el-icon-minus"></i><span>{{key02 == 'chl' ? '中央法规' : '地方法规'}}</span>
                        </span>
                      </p> -->
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_02_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
              </template>
              <template v-if="type == 'pal'">
                <div class="ul-list" v-if="magicWeaponLenovo.ReferenceArticleGidTiaoNum && magicWeaponLenovo.ReferenceFlag">
                  <p class="lian_header">本篇引用的法规</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.ReferenceArticleGidTiaoNum" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_01_'+index02)">
                          <i class="el-icon-minus"></i>
                          <template v-if="key02 == 'chl'">
                            <span>中央法规</span>
                          </template>
                          <template v-if="key02 == 'lar'">
                            <span>地方法规</span>
                          </template>
                          <template v-if="key02 == 'protocol'">
                            <span>草案</span>
                          </template>
                          <template v-if="key02 == 'lawexplanation'">
                            <span>法规解读</span>
                          </template>
                          <template v-if="key02 == 'whitebook'">
                            <span>白皮书</span>
                          </template>
                          <template v-if="key02 == 'workreport'">
                            <span>工作报告</span>
                          </template>
                          <template v-if="key02 == 'legislation'">
                            <span>立法计划</span>
                          </template>
                          <template v-if="key02 == 'eagn'">
                            <span>中外条约</span>
                          </template>
                          <template v-if="key02 == 'iel'">
                            <span>外国法规</span>
                          </template>
                          <template v-if="key02 == 'hkd'">
                            <span>香港法规</span>
                          </template>
                          <template v-if="key02 == 'aom'">
                            <span>澳门法规</span>
                          </template>
                          <template v-if="key02 == 'twd'">
                            <span>台湾法规</span>
                          </template>
                        </span>
                      </p>
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_01_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
                <div class="ul-list" v-if="magicWeaponLenovo.similarCase">
                  <p class="lian_header">相关案例</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.similarCase" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <!-- <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_02_'+index02)">
                          <i class="el-icon-minus"></i><span>{{key02 == 'chl' ? '中央法规' : '地方法规'}}</span>
                        </span>
                      </p> -->
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_02_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
              </template>
              <template v-if="type == 'atr'">
                <div class="ul-list" v-if="magicWeaponLenovo.ReferenceArticleGidTiaoNum && magicWeaponLenovo.ReferenceFlag">
                  <p class="lian_header">引用法规</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.ReferenceArticleGidTiaoNum" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_01_'+index02)">
                          <i class="el-icon-minus"></i>
                          <template v-if="key02 == 'chl'">
                            <span>中央法规</span>
                          </template>
                          <template v-if="key02 == 'lar'">
                            <span>地方法规</span>
                          </template>
                          <template v-if="key02 == 'protocol'">
                            <span>草案</span>
                          </template>
                          <template v-if="key02 == 'lawexplanation'">
                            <span>法规解读</span>
                          </template>
                          <template v-if="key02 == 'whitebook'">
                            <span>白皮书</span>
                          </template>
                          <template v-if="key02 == 'workreport'">
                            <span>工作报告</span>
                          </template>
                          <template v-if="key02 == 'legislation'">
                            <span>立法计划</span>
                          </template>
                          <template v-if="key02 == 'eagn'">
                            <span>中外条约</span>
                          </template>
                          <template v-if="key02 == 'iel'">
                            <span>外国法规</span>
                          </template>
                          <template v-if="key02 == 'hkd'">
                            <span>香港法规</span>
                          </template>
                          <template v-if="key02 == 'aom'">
                            <span>澳门法规</span>
                          </template>
                          <template v-if="key02 == 'twd'">
                            <span>台湾法规</span>
                          </template>
                        </span>
                      </p>
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_01_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
              </template>
              <template v-if="type == 'qikan'">
                <div class="ul-list" v-if="magicWeaponLenovo.Professional">
                  <p class="lian_header">相似文献</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.Professional" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <!-- <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_02_'+index02)">
                          <i class="el-icon-minus"></i><span>{{key02 == 'chl' ? '中央法规' : '地方法规'}}</span>
                        </span>
                      </p> -->
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_01_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
                <div class="ul-list" v-if="magicWeaponLenovo.authorOtherBooks">
                  <p class="lian_header">作者其他文献</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.authorOtherBooks" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <!-- <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_02_'+index02)">
                          <i class="el-icon-minus"></i><span>{{key02 == 'chl' ? '中央法规' : '地方法规'}}</span>
                        </span>
                      </p> -->
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_02_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>

                <div class="ul-list" v-if="magicWeaponLenovo.ReferenceArticleGidTiaoNum && magicWeaponLenovo.ReferenceFlag">
                  <p class="lian_header">引用法规</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.ReferenceArticleGidTiaoNum" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_03_'+index02)">
                          <i class="el-icon-minus"></i>
                          <template v-if="key02 == 'chl'">
                            <span>中央法规</span>
                          </template>
                          <template v-if="key02 == 'lar'">
                            <span>地方法规</span>
                          </template>
                          <template v-if="key02 == 'protocol'">
                            <span>草案</span>
                          </template>
                          <template v-if="key02 == 'lawexplanation'">
                            <span>法规解读</span>
                          </template>
                          <template v-if="key02 == 'whitebook'">
                            <span>白皮书</span>
                          </template>
                          <template v-if="key02 == 'workreport'">
                            <span>工作报告</span>
                          </template>
                          <template v-if="key02 == 'legislation'">
                            <span>立法计划</span>
                          </template>
                          <template v-if="key02 == 'eagn'">
                            <span>中外条约</span>
                          </template>
                          <template v-if="key02 == 'iel'">
                            <span>外国法规</span>
                          </template>
                          <template v-if="key02 == 'hkd'">
                            <span>香港法规</span>
                          </template>
                          <template v-if="key02 == 'aom'">
                            <span>澳门法规</span>
                          </template>
                          <template v-if="key02 == 'twd'">
                            <span>台湾法规</span>
                          </template>
                        </span>
                      </p>
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_03_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
                <div class="ul-list" v-if="magicWeaponLenovo.sameLawLiterature">
                  <p class="lian_header">共引文献</p>
                  <template v-for="(item02,key02,index02) in magicWeaponLenovo.sameLawLiterature" >
                    <div class="lian_list_ul_wrap" :key="index02">
                      <!-- <p class="lian_list_ul_header">
                        <span @click="isShowAll($event,'lian_list_ul_chl_02_'+index02)">
                          <i class="el-icon-minus"></i><span>{{key02 == 'chl' ? '中央法规' : '地方法规'}}</span>
                        </span>
                      </p> -->
                      <!-- {{item02}} -->
                      <ul :class="'lian_list_ul lian_list_ul_chl_04_'+index02">
                        <li class="item" v-for="(item002, index002) in item02" :key="index002">
                          <!-- {{item002}} -->
                          <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item002.index+'/'+item002.gid)">{{item002.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
              </template>
            </template>
            <template v-if="(!magicWeaponLenovo.hasLenovo)">
              <div class="ul-list" >
                <p style="text-align: center;">未查询到相关数据</p>
              </div>
            </template>
            <template v-else-if="(!magicWeaponLenovo.BeReferenceFlag && !magicWeaponLenovo.ReferenceFlag && magicWeaponLenovo.hasLenovo) ">
              <template v-if ="!(magicWeaponLenovo.sameTreatyFlag && magicWeaponLenovo.sameTypeTreatyFlag)">
                <div class="ul-list" >
                  <p style="text-align: center;">未查询到相关数据</p>
                </div>
              </template>
            </template>
           <!-- <template v-if="magicWeaponLenovo.hasLenovo">
            <div class="ul-list" v-if="magicWeaponLenovo.legalBasis">
              <p class="lian_header">法律法规</p>
              <ul class="lian_list_ul">
                <li class="item" v-for="(item,index) in magicWeaponLenovo.legalBasis">
                  <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item.index+'/'+item.gid)">{{item.title}}</a>
                </li>
              </ul>
            </div>

            <div class="ul-list" v-if="magicWeaponLenovo.similarCase">
              <p class="lian_header">相似案件</p>
              <ul class="lian_list_ul">
                <li class="item" v-for="(item,index) in magicWeaponLenovo.similarCase">
                  <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item.index+'/'+item.gid)">{{item.title}}</a>
                </li>
              </ul>
            </div>

            <div class="ul-list" v-if="magicWeaponLenovo.importantCase">
              <p class="lian_header">引用案件</p>
              <ul class="lian_list_ul">
                <li class="item" v-for="(item,index) in magicWeaponLenovo.importantCase">
                  <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item.index+'/'+item.gid)">{{item.title}}</a>
                </li>
              </ul>
            </div>

            <div class="ul-list" v-if="magicWeaponLenovo.importantCase">
              <p class="lian_header">相关论文</p>
              <ul class="lian_list_ul">
                <li class="item" v-for="(item,index) in magicWeaponLenovo.importantCase">
                  <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item.index+'/'+item.gid)">{{item.title}}</a>
                </li>
              </ul>
            </div>

            <div class="ul-list" v-if="magicWeaponLenovo.ReferenceArticleGidTiaoNum">
              <p class="lian_header">参考文献</p>
              <ul class="lian_list_ul">
                <li class="item" v-for="(item,index) in magicWeaponLenovo.ReferenceArticleGidTiaoNum">
                  <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item.index+'/'+item.gid)">{{item.title}}</a>
                </li>
              </ul>
            </div>

            <div class="ul-list" v-if="magicWeaponLenovo.authorOtherBooks &&  magicWeaponLenovo.authorOtherBooks.qikan">
              <p class="lian_header">作者作品</p>
              <ul class="lian_list_ul">
                <li class="item" v-for="(item,index) in magicWeaponLenovo.authorOtherBooks.qikan">
                  <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item.index+'/'+item.gid)">{{item.title}}</a>
                </li>
              </ul>
            </div>

            <div class="ul-list" v-if="magicWeaponLenovo.sameLawLiterature">
              <p class="lian_header">相关法规</p>
              <ul class="lian_list_ul">
                <li class="item" v-for="(item,index) in magicWeaponLenovo.sameLawLiterature">
                  <a href="javascript:void(0)" @click="toDetail('/#/detail/'+item.index+'/'+item.gid)">{{item.title}}</a>
                </li>
              </ul>
            </div>
            </template> -->
            <!-- <div class="ul-list" v-if="!magicWeaponLenovo.hasLenovo">
              <p style="text-align: center;">未查询到相关数据</p>
            </div> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 笔记 -->
    <el-dialog title="笔记" :visible.sync="noteVisible" class="">
      <div style="text-align: left; margin-bottom: 10px;">
        <el-select v-model="noteCategory" placeholder="请选择分类">
          <el-option v-for="item in noteCategories" :key="item.directoryId" :label="item.directoryName" :value="item.directoryId">
          </el-option>
        </el-select>
      </div>
      <el-input style="margin-bottom: 10px" type="textarea" :disabled="true" :rows="5" v-model="selVal">
      </el-input>
      <el-input type="textarea" :rows="5" placeholder="请输入笔记内容" v-model="noteVal">
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noteArticleDes">取 消</el-button>
        <el-button type="primary" @click="noteArticle">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 收藏 -->
    <el-dialog title="收藏" :visible.sync="collectVisible" width="257px" class="shoucang">
      <div style="text-align: left; margin-bottom: 10px;">
        <el-input v-model="collectName" placeholder="请输入收藏的名字"></el-input>
        <el-select v-model="collectCategory" placeholder="请选择收藏夹">
          <el-option v-for="item in collectCategories" :key="item.directoryId" :label="item.directoryName" :value="item.directoryId">
          </el-option>
        </el-select>
        <div class="collectAddBtn">
          <el-button type="primary" @click="collectArticle" style="width: 100%;">确 定</el-button>
        </div>
      </div>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div> -->
    </el-dialog>
    <!--<div :model="list">
			<p>标题：{{navbarVal.title}}</p>
		</div>-->
  </div>

</template>

<script>
  import {  showfbThink,getCollectCategory, addCollectValue, getNoteCategory, addNoteVal ,showfbWindow} from "../api.js"
  import {Download } from "../select_api.js"
  import Publichead from "@/components/headerCommon";
  import $ from 'jquery';
  export default {
    components: {
      Publichead
    },
    props: [],
    data() {
      return {
        chunJingData:[],//纯净数据
        chunFlag:true,
        mousePosition :{ x:null,y:null },
        fullscreenLoading:false,
        topZSHtml:'<i class="el-icon-caret-bottom"></i><span class="one">展开</span>',
        isTopZSHtml:false,//默认展开
        lawChangeDetail: [],
        magicWeaponLenovo: {
          hasLenovo:true,
          ReferenceFlag:true,
          BeReferenceFlag:true,
          sameTreatyFlag:true,
          sameTypeTreatyFlag:true,
        } ,
        fbWindow:{},
        fbWindowArr:false,
        dialogVisible: false,
        list:{
          gid:true,
          library:true,
          category:'', //库名（索引）
          specialtopic: "", //专题
          implementDate: "", //实施时间
          documentNO: "", //发文字号
          issueDate: "", //发布日期
          timelinessDic: "", //时效性
          understandNum: "", //理解与适用文章数量
          lawReferNum: "", //法规引用量
          protocolNum: "", //草案文章数量
          caseReferNum: "", //案例引用量
          otherReferNum: "", //其他引用量
          title: "", //标题
          lawexplanationNum: "", //法规解读数量
          journalReferNum: "", //期刊引用量
          issueDepartment: "", //发布部门
          effectivenessDic: "" //效力级别
        },
        zhuan: true,
        isShowTotal: false, //是否显示命中次数
        activeName: "1",
        change_icon: "el-icon-arrow-up",
        change_txt: "收起",
        scroll: "", //是否滚动
        navBarFixed: false, //shifou xifu
        ifFirst: true,
        bujiflag: false,
        secondNameUrl: '#/lawsNew',
        openAllHtml: "<i class='el-icon-arrow-up'></i>展开全部",
        openAll: false, //默认隐藏
        search_keyword: '',
        search_keyword_num: '',
        search_keyword_number: '',
        all_num: '',
        // 标亮
        checked_biaoliang: true,
        checked_juming: false,
        checked_juming_allText:null,
        num_sign: 1,
        checked_fbwIndow: true,
        versionChange: "1",
        checkList: [],
        secondName: "法律法规",
        headerArr: {
          activeIndex: "",
          logo_url: "../../static/img/logoo.png"
        },
        //搜索input
        searchKeyword: "",
        // 笔记
        // 笔记的内容
        noteVal: "",
        // 笔记的弹窗
        noteVisible: false,
        // 笔记的分类
        noteCategory: "",
        noteCategories: [],
        // 选中的文字
        selVal: "",
        // 是否是局部笔记，局部笔记会显示选中的文字
        isSelNote: true,
        // 收藏的弹窗
        collectVisible: false,
        // 收藏的名字
        collectName: "",
        // 收藏的分类
        collectCategory: "",
        collectCategories: [],

        type: "",
        currentTitle: "",
        NavCatalog: [],
        tandu: {},
        datachl: {
          "IssueDepartment": "",
          "TimelinessDic": "",
          "Category": [],
          "EffectivenessDic": [],
          "ImplementDate": "",
          "NavCatalog": [],
          "Title": "",
          "IssueDate": "",
          "FullText": "",
           lawChange:[]
        },
        datacricase: {
          "Accusation": ["间谍罪"],
          "LastInstanceDate": "1986/8/20 0:00:00",
          "CriFullText": "",
          "TrialStep": "",
          "CriTitle": "卢顺序、宁念慈、俞德孚特务案",
          "DisputedIssues": "1.外国人受间谍组织派遣，为间谍组织发展成员，勾结中国公民进行特务活动，为间谍组织提供军事情报，能否以间谍罪定罪？\n2.未参加间谍组织，但协助间谍组织成员收集情报的，是否构成特务罪？",
          "LastInstanceCourt": ["北京市高级人民法院"],
          "Criminal": "以特务罪判处卢顺序有期徒刑十二年；\n以特务罪判处宁念慈有期徒刑十年，剥夺政治权利三年；\n以特务罪判处俞德孚有期徒刑三年，剥夺政治权利一年。",
          "RightKeywrod": ["民事", "管辖", "管辖权转移", "", "", "选择管辖", "", "", "", "", "基本原则", "", "", "", "", "级别管辖", "", "", "", "", "", "", "处分原则", ""],
          "CriAuthority": "《最高人民法院公报》 1986年第4号(总:8号)",
          /*          "CriCode": "CLI.C.66619",
					 */
          "CriAccusation": ["危害国家安全罪", "间谍罪"],
          "Core": "外国人#参加间谍组织#间谍",
          "DocumentAttr": ""
        },
        datacribook: {
          BookCatalog: "",
          HtmContent: ""
        },
        datacrijournal: {
          "ContentTxt": "",
          "JournalIssue": 4,
          "JournalId": "政治与法律",
          /*          "CriCode": "CLI.A.1211996",
					 */
          "CriFullText": "",
          "CriAccusation": ["侵犯财产罪", "侵占罪"],
          "JournalYear": 2016,
          "CriTitle": "侵占罪和职务侵占罪的区分",
          "InfoAuthor": "陈兴良"
        },
        datacrilaw: {
          "IssueDepartment": "",
          "DocumentNO": null,
          "TimelinessDic": "现行有效",
          "Category": null,
          "ImplementDate": null,
          /*          "CriCode":"CLI.1.252610",
					 */
          "CriFullText": "第二十六条规定的程序上报。",
          "CriEffectivenessDic": ["法律"],
          "CriAccusation": ["妨害社会管理秩序罪", "危害公共卫生罪", "妨害动植物防疫、检疫罪1"],
          "IssueDate": null,
          "CriTitle": "中华人民共和国动物防疫法(2015修正)　第二十六条"
        },
        dataeagn: {
          "IssueDepartment": ["比利时"],
          "TimelinessDic": "时效性",
          "Category": "刑事",
          "SaveDepartment": null,
          "ImplementDate": null,
          "Kind": "条约",
          "NavCatalog": "[]",
          "Title": "中华人民共和国和比利时王国关于刑事司法协助的条约",
          "IssueDate": "2014.03.31",
          "FullText": "",
          "ConcludeAddress": "布鲁塞尔"
        },
        datatwd: {
          AbolitionDate: null,
          Category: "",
          Department: "司法院",
          DocumentNO: "院台厅刑一字第1020020409号",
          FullText: "",
          NavCatalog: null,
          RegulationOrder: "法规命令",
          ReleaseDate: "2012.12.05",
          ReviseDate: "2013.08.01",
          Title: "侦查不公开作业办法",
          ValidState: "现行"
        },
        datahkd: {
          Category: "文康娱乐",
          FullText: "41A16374DF34DF7F62BA0C628E2B32E5309A65DDDC7AF9F4E3",
          FullTextEn: "",
          Title: "第132BN章 公众殡仪厅规例",
          TitleEn: "CAP 132BN  PUBLIC FUNERAL HALLS REGULATION"
        },
        dataaom: {},
        currentUrl: "",
        datapfnl: {}, //司法案例第一个
        datapayz: {}, //裁判规则
        datagac: {}, //指导性案例与应用
        databankruptcy: {}, //破产信息：
        datapal: {}, // 案例报道：index：
        dataatr: {}, //仲裁案例：index:
        dataqikan: {}, //期刊
        articleTitle: "", //笔记标题
        datalbzlaw: {}, //法规变迁
        fblian: [
          "chl#279345#4#2",
          "chl#256298#5#7",
          "chl#281856#4#2",
        ], //法宝联想接口数据
        listFblian: [{
          url: '#/detail/chl/281856',
          title: '国务院关于出境入境管理法执行情况的报告'
        }], //法宝宝列表
        listFBwindow:[{
          url:"/xsfb/criminal/fbwindow",
          title:"123"
        }],
        referenceThisLaw:[],//引用本法
      }
    },
    created() {

      //this.AJI('16842590')
      //this.search_keyword=this.$route.params.keyword;
      this.search_keyword_number = this.$route.params.keyword > 0 ? this.$route.params.keyword : "";
      let tandu = JSON.parse(sessionStorage.getItem('tandu'));
      this.tandu = tandu;
      //请求接口，返回数据（暂时未处理跨域问题）/xsfb/criminal/search
      this.type = this.$route.params.type;
      let gid = this.$route.params.gid;
      let cid = this.$route.params.cid;
      let url = '';
      let dataCurrent;
      if(this.type == "cribook") {
        url = "/form?type=" + this.type + "&gid=" + gid + "&contentid=" + cid;
        dataCurrent = {
          type: this.type,
          gid: gid,
          contentid: cid
        };
      } else {
        url = "/form?type=" + this.type + "&gid=" + gid;
        dataCurrent = {
          type: this.type,
          gid: gid
        }
      }

      this.fullscreenLoading = true;
      this.axios.get(url, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          _api_name: "fb_charge_detail",
          _api_version: "1.0.0",
        }
      }).then((res) => {
        console.log(res, '--------------详情数据whq---------------------');
         this.fullscreenLoading = false;
        //标签超链接去除--开始
        //var a = res.data.data.FullText;
        //var content = a.replace(/onmouseover/g,'@click');
        // res.data.data.FullText = content;
        //标签超链接去除---结束

        if(this.type == 'chl' || this.type == 'lar' || this.type == 'protocol' ||
          this.type == 'whitebook' || this.type == 'workreport' || this.type == 'lawexplanation' ||
          this.type == 'legislation' || this.type == 'iel' || this.type == 'eagn') {
          this.NavCatalog = eval(res.data.data.NavCatalog);
          console.log('目录数据0----------------------------',this.NavCatalog)
          //全文
          this.datachl = res.data.data;
          this.currentTitle = res.data.data.Title;
          document.title = res.data.data.Title;
          this.articleTitle = res.data.data.Title;
          this.fblian = res.data.data.ReferenceArticleGidTiaoNum;
          console.log("全文","--------------------全文++++++++++++++++++")
          // console.log(res.data.data);

          // console.log(res.data.data.lawChange);
          // console.log(this.lawChangeDetail);
         if(res.data.data.lawChange){
           let newdata = jQuery.parseJSON(res.data.data.lawChange);
          console.log(this.lawChangeDetail == 0);
          if(this.lawChangeDetail.length == 0){

            newdata.forEach(res => {
            // console.log(res.SubTitle,"_______________________________nihao ______")
            let data = {
              name:res.OriginalTitle,
              time:res.Fdate,
              Gid:res.Gid,
            }
            this.lawChangeDetail.push(data);
            })
          }
         }


          // this.getLian();
        } else if(this.type == 'twd') {
          this.NavCatalog = res.data.data.NavCatalog;
          this.currentTitle = res.data.data.Title;
          this.datatwd = res.data.data;
          document.title = res.data.data.Title;
          this.articleTitle = res.data.data.Title;
          this.fblian = res.data.data.ReferenceArticleGidTiaoNum;
          // this.getLian();
        } else if(this.type == 'hkd') {
          this.datahkd = res.data.data;
          document.title = res.data.data.Title;
          this.currentTitle = res.data.data.Title;
          this.articleTitle = res.data.data.Title;
          this.fblian = res.data.data.ReferenceArticleGidTiaoNum;
          // this.getLian();
        } else if(this.type == 'cricase') {
          this.datacricase = res.data.data;
          document.title = res.data.data.CriTitle;
          this.currentTitle = res.data.data.Title;
          this.fblian = res.data.data.ReferenceArticleGidTiaoNum;
          // this.getLian();
        } else if(this.type == 'crijournal') {
          this.datacrijournal = res.data.data;
          document.title = res.data.data.CriTitle;
          this.currentTitle = res.data.data.Title;
          this.fblian = res.data.data.ReferenceArticleGidTiaoNum;
          // this.getLian();
        } else if(this.type == 'cribook') {
          this.NavCatalog = eval(res.data.data.BookCatalog);
          this.currentTitle = res.data.data.Title;
          this.datacribook = res.data.data;
          this.fblian = res.data.data.ReferenceArticleGidTiaoNum;
          // this.getLian();
          document.title = "专家精释";
        } else if(this.type == 'crilaw') {
          this.datacrilaw = res.data.data;
          this.currentTitle = res.data.data.Title;
          document.title = res.data.data.CriTitle;
          // this.getLian();
        } else if(this.type == 'aom') {
          this.dataaom = res.data.data;
          this.currentTitle = res.data.data.Title;
          document.title = res.data.data.Title;
          this.articleTitle = res.data.data.Title;
          this.fblian = res.data.data.ReferenceArticleGidTiaoNum;
          // this.getLian();

        } else if(this.type == 'pfnl') {
          // console.log(res.data.data.FullText);
          this.datapfnl = res.data.data;
          this.currentTitle = res.data.data.Title;
          document.title = res.data.data.Title;
          this.articleTitle = res.data.data.Title;
          this.NavCatalog = eval(res.data.data.NavCatalog)
          this.fblian = res.data.data.ReferenceArticleGidTiaoNum;
          // this.getLian();
        } else if(this.type == 'payz') {
          this.datapayz = res.data.data;
          this.currentTitle = res.data.data.Title;
          document.title = res.data.data.Title;
          this.articleTitle = res.data.data.Title;
          this.NavCatalog = eval(res.data.data.NavCatalog)
          this.fblian = res.data.data.ReferenceArticleGidTiaoNum;
          // this.getLian();
        } else if(this.type == 'gac') {
          this.datagac = res.data.data;
          this.currentTitle = res.data.data.Title;
          document.title = res.data.data.Title;
          this.articleTitle = res.data.data.Title;
          this.NavCatalog = eval(res.data.data.NavCatalog)
          this.fblian = res.data.data.ReferenceArticleGidTiaoNum;
          // this.getLian();
        } else if(this.type == 'bankruptcy') {
          this.databankruptcy = res.data.data;
          this.currentTitle = res.data.data.Title;
          document.title = res.data.data.Title;
          this.articleTitle = res.data.data.Title;
          this.NavCatalog = eval(res.data.data.NavCatalog)
          this.fblian = res.data.data.ReferenceArticleGidTiaoNum;
          // this.getLian();
        } else if(this.type == 'pal') {
          this.datapal = res.data.data;
          this.currentTitle = res.data.data.Title;
          document.title = res.data.data.Title;
          this.articleTitle = res.data.data.Title;
          this.NavCatalog = eval(res.data.data.NavCatalog)
          this.fblian = res.data.data.ReferenceArticleGidTiaoNum;
          // this.getLian();
        } else if(this.type == 'atr') {
          this.dataatr = res.data.data;
          this.currentTitle = res.data.data.Title;
          document.title = res.data.data.Title;
          this.articleTitle = res.data.data.Title;
          this.NavCatalog = eval(res.data.data.NavCatalog)
          this.fblian = res.data.data.ReferenceArticleGidTiaoNum;
          // this.getLian();
        } else if(this.type == 'qikan') {
          this.dataqikan = res.data.data;
          this.currentTitle = res.data.data.Title;
          document.title = res.data.data.InfoTitle == undefined ? res.data.data.InfoTitleEn : res.data.data.InfoTitle;
          this.articleTitle = res.data.data.InfoTitle;
          this.NavCatalog = eval(res.data.data.NavCatalog)
          this.fblian = res.data.data.ReferenceArticleGidTiaoNum;
          // this.getLian();
        } else if(this.type == 'lbzlaw') {
          this.datalbzlaw = res.data.data;
          this.currentTitle = res.data.data.Title;
          document.title = res.data.data.InfoTitle;
          this.articleTitle = res.data.data.InfoTitle;
          this.NavCatalog = eval(res.data.data.NavCatalog)
          this.fblian = res.data.data.ReferenceArticleGidTiaoNum;
          // this.getLian();
        }
      }).then(() => {
        this.dump();
      });

      if(this.type == 'twd' || this.type == 'aom' || this.type == 'hkd' || this.type == 'iel' ||
        this.type == 'eagn' || this.type == 'legislation' || this.type == 'workreport' ||
        this.type == 'whitebook' || this.type == 'lawexplanation' || this.type == 'protocol' ||
        this.type == 'lar' || this.type == 'chl') {
        this.secondName = "法律法规";
        this.secondNameUrl = "#/lawsNew";
      } else if(this.type == 'atr' || this.type == 'pal' || this.type == 'bankruptcy' ||
        this.type == 'gac' || this.type == 'payz' || this.type == 'pfnl') {
        this.secondName = "司法案例";
        this.secondNameUrl = "#/example";
        this.zhuan = !this.zhuan;
      } else if(this.type == 'qikan') {
        this.secondName = "法学期刊";
        this.secondNameUrl = "#/journalLaw";
      }

      // 引用本法调用
      this.getReferenceThisLaw(gid,this.type);
       //法宝联想
      showfbThink(this.$route.params.gid,this.type ).then(res =>{
        console.log(res,"法宝联想返回的数据-----------------------------------");
        if(res.data.success){

          if(!$.isEmptyObject(res.data.data)){
            console.log('非空-----------------------')
            // BeReferenceArticleGidTiaoNum
            this.magicWeaponLenovo = res.data.data.magicWeaponLenovo;
            this.magicWeaponLenovo.hasLenovo = true;
            if($.isEmptyObject(this.magicWeaponLenovo.ReferenceArticleGidTiaoNum)){
              this.magicWeaponLenovo.ReferenceFlag=false;
            }else{
              this.magicWeaponLenovo.ReferenceFlag=true;
            }
            if($.isEmptyObject(this.magicWeaponLenovo.BeReferenceArticleGidTiaoNum)){
              this.magicWeaponLenovo.BeReferenceFlag=false;
            }else{
              this.magicWeaponLenovo.BeReferenceFlag=true;
            }

            if(this.type == 'eagn'){
              if($.isEmptyObject(this.magicWeaponLenovo.sameTypeTreaty)){
                this.magicWeaponLenovo.sameTypeTreatyFlag=false;
              }else{
                this.magicWeaponLenovo.sameTypeTreatyFlag=true;
              }
              if($.isEmptyObject(this.magicWeaponLenovo.sameTreaty)){
                this.magicWeaponLenovo.sameTreatyFlag=false;
              }else{
                this.magicWeaponLenovo.sameTreatyFlag=true;
              }
            }
            console.log('-------联想数据更改后-----------------',this.magicWeaponLenovo)
          }else{
            console.log('kong------------------------')
            this.magicWeaponLenovo.hasLenovo = false;
          }
        }


      });



      // 获取我的收藏分类
      getCollectCategory().then((res) => {
        console.log(res,'----------------获取我的收藏分类-----------------------');
        if(res.data.code == "0") {
          this.collectCategories = res.data.item
        }
      });
      // 获取我的笔记分类
      getNoteCategory().then((res) => {
        console.log(res,'----------------获取我的笔记分类-----------------------');
        if(res.data.code == "0") {
          this.noteCategories = res.data.item
        }
      });
      window.onscroll = () => {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      }

   },
    mounted() {
      window.addEventListener('scroll', this.menu);
    },
    watch: {
      searchKeyword: function() {},
      /*search_keyword_number:function(){
			  console.log(this.search_keyword_number);
			  var a = this.search_keyword_number;//tiao_3_kuan_1
			  $(document).scrollTop($("a[name=tiao_"+a+"_kuan_1]").offset().top);
			},*/
      /*标亮*/
      //点击标亮事件
      checked_biaoliang: function() {
        console.log("标亮");
        console.log(this.checked_biaoliang);
        let text = document.querySelector('.detail_content_wrap').innerText
        if(!this.search_keyword) {
          // this.$message({
          //   type: 'warn',
          //   message: '请输入您要查找的内容！'
          // });
          return false
        } else if(text.indexOf(this.search_keyword) == -1) {
          this.$message({
            type: 'error',
            message: '没有找到您要查找的内容'
          });
          return false
        } else {
          if(this.checked_biaoliang) {
            console.log(this.search_keyword);
            var tips = this.search_keyword;
            if(tips != '') {
              var b = new RegExp(tips, "g");
              console.log("b",b)

              $('.detail_content_wrap').html(function(i, oldHTML) {
                return oldHTML.replace(b, '<font class="point">' + tips + '</font>');

              });
              this.search_keyword_num = 1;
              this.all_num = $('.point').length;
              console.log("长度" + this.all_num);


              //进入标记
              console.log(this.ifFirst, 'crate////////////////////////////');
              if(this.ifFirst) {
                for(var i = 1; i <= $('.point').length; i++) {
                  $('font').eq(i - 1).attr('id', 'sk' + i);


                }
                this.ifFirst = false;
              } else {
                for(var i = 1; i <= $('.point').length; i++) {

                  $('font').eq(i - 1).attr('id', 'sk' + i);
                }
              }

              $(document).scrollTop($("#sk1").offset().top - 65);
            }
            this.isShowTotal = true;

          } else {
            // window.location.reload();
            $('.detail_content_wrap').html(function(i, oldHTML) {
              return oldHTML.replace(/<\/?font[^><]*>/g, '');
            });
            this.search_keyword_num = 1;
          }
        }
      },
      /*聚焦命中*/

      checked_juming: function(key) {
        console.log("聚焦命中");
        console.log(this.checked_juming);
        //获取全文

        if(this.checked_juming){
        var ctext = $('.detail_content_wrap').html();
          this.checked_juming_allText =ctext;
        console.log("全文",ctext)
         ctext = ctext.replace(new RegExp("<div class=\"tiao-wrap\">", "ig"), "<br><div class=\"tiao-wrap\">");
        console.log("替换",ctext)
        var inx = $(".point").length;
        console.log("inx",inx)
        if (inx == 0) return false;
        ctext = ctext.replace(new RegExp("<TABLE[^>]*>|<TD[^>]*>|<TR[^>]*>|</TABLE>|</TD>|</TR>|<TBODY[^>]*>|</TBODY>|</THEAD>|<THEAD[^>]*>|</TFOOT>|<TFOOT[^>]*>|<TABLE(.|\\r|\\n)+?</TABLE>", "ig"), "");
        var ret = /<br *\/{0,1}>/ig;
         var ctexts = "";
         var matchResult = ctext.match(ret);
         if (matchResult) {
           ctexts = ctext.split(/<br *\/{0,1}>|\r\n|\n/ig);
         } else {
          ctexts = ctext.split(/<div *\/{0,1}>/ig);
        }
         console.log("结果信息",ctexts);
        var reg = /(point)/i;//此处不加g  加了g就会导致最后一个匹配不到
         var rctexts = [];
         for (var i = 0; i < ctexts.length; i++) {
           if (reg.test(ctexts[i])) {
             rctexts.push(ctexts[i].replace(new RegExp("align=\"center\"", "ig"), ""));//聚焦命中的时候都靠左对齐
           }
         }
         var res_text = rctexts.join("<br /><hr /><br />");
          $('.detail_content_wrap').html(res_text)
        }else{
          $('.detail_content_wrap').html(this.checked_juming_allText)
        }






        this.all_num = $('.point').length;

        for(var i = 0; i <= $('.point').length; i++) {
          $('font').eq(i).removeClass('active');
        }
        this.isShowTotal = true;
        if(this.checked_juming) {
          this.search_keyword_num = 1;
          if(this.bujiflag) {

          }
          $("#sk1").addClass('active');

          $(document).scrollTop($("#sk1").offset().top - 65);
        } else {

          this.all_num = $('.point').length;

          for(var i = 0; i <= $('.point').length; i++) {
            $('font').eq(i).removeClass('active');
          }
        }

      },
      /* /!*数值变化*!/
			 search_keyword_num:function () {
			     console.log("1111");
			     console.log(this.search_keyword_num);
			     //window.location.href="#"+1;
			 }*/

    },
    computed: {},
    methods: {
      // 法宝联想
      isShowAll(e,aim){
        // 默认
        if($('.'+aim).prev().find("i").attr("class") == "el-icon-plus"){
          $('.'+aim).prev().find("i").removeClass("el-icon-plus").addClass("el-icon-minus");
        }else{
          $('.'+aim).prev().find("i").removeClass("el-icon-minus").addClass("el-icon-plus");
        }
        $('.'+aim).toggle();
        console.log($('.'+aim).prev().find("i").attr("class"),$('.'+aim),'eeeeeeeeeeeeeeeeeeeeee')
      },
      // 详情tips展开收起
      detailToggleMsg(){
        $(".toggle_main_wrap").toggle();
        // 默认 false 展开
        if(!this.isTopZSHtml){
          // 展开
          this.isTopZSHtml = true;
        }else{
          this.isTopZSHtml = false;
        }
      },
      // 调用本法 referenceThisLaw
      getReferenceThisLaw(gid,type){
        this.axios.get("/form?articleGid="+ gid +"&library="+ type, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            _api_name: "fb_xsfb_fbreference_referenceThisLaw",
            _api_version: "1.0.0",
          }
        }).then((res) => {
          console.log('-----------------------引用本法返回数据----------------',res);
          if(res.data.success){
            this.referenceThisLaw = res.data.data;
          }
        }).catch(error => {

        });
      },

      handleClose(done) {
        done();
        /* this.$confirm('确认关闭？')
           .then(_ => {
             done();
           })
           .catch(_ => {

           });*/
      },
      // 点击详情
      goDetail(event) {
        console.log(event,'---------------点击详情----------------------')
        if(event.target.nodeName == 'a' || event.target.nodeName == 'A') {
          let href = $(event.target).attr("href");
          let len = href.split("SLC")[1].length - 2;
          let gid = href.split("SLC")[1].substr(1, len);
          let finalLen = 0;
          if(gid.indexOf(",") != -1) {
            gid = gid.split(",");
            finalLen = gid.length;
          }
          if(finalLen > 1) {
            //有，
            let type = this.AJI(gid[0])[0];
            window.open(window.location.origin + "/#/detail/" + type + "/" + gid[0] + "/" + gid[1], '_blank');
          } else {
            let type = this.AJI(gid)[0];
            window.open(window.location.origin + "/#/detail/" + type + "/" + gid, '_blank');
          }
        }
      },
      //悬浮法宝之窗---whq--01
      showDiglog(e){
        this.mousePosition.x = e.clientX;
        this.mousePosition.y = e.clientY;
        let showsType = false;



        console.log($(e.target),"-------------------------法宝之窗-------------",sessionStorage.getItem("AJICurtId"),sessionStorage.getItem("AJICurtTiao"));
        let curtId = sessionStorage.getItem("AJICurtId"),
        curtTiao = sessionStorage.getItem("AJICurtTiao");
        if($(e.target)[0].nodeName == 'A'){
      //    this.dialogVisible = true;
          this.fbWindowArr = false;
          this.axios.get("/form?gid="+ curtId +"&library=chl", {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              _api_name: "fb_xsfb_criminal_fbwindow",
              _api_version: "1.0.0",
            }
          }).then((res) => {
            console.log('------------------------------法宝之窗信息----------',res)
            if(res.data.success){
              this.fbWindowArr = true;
              this.fbWindow = res.data.data[0];
              showsType = true
            }else{
              // this.$message({
              //     type: 'info',
              //     message: res.data.message,
              // });
              // this.dialogVisible = false;
              $(".onload_fbwindows").html(res.data.message);
            }
          }).catch(error => {

          });
        }
        var _this = this;
        setTimeout(function () {
          // console.log(e,"------------------------------结束位置---------------------------------")
          if( _this.mousePosition.x  - e.clientX < 5 &&  e.clientX  - _this.mousePosition.x < 5 &&
            _this.mousePosition.y - e.clientY < 5 &&  e.clientY - _this.mousePosition.y < 5){
            // console.log("大满贯")
            if(showsType && _this.checked_fbwIndow){
              _this.dialogVisible = true
            }

          }
        },1000)




      },
      toDetail(url) {
        // console.log(url);
        window.open(url, "_blank");
      },
      toDetailNew(type,gid) {
        // console.log(type)
        // console.log(gid)

       /* window.open(url, "_blank");*/
      },

      getLian() {
        //获取法宝联想
        // console.log(typeof this.fblian,'eeeeeeeeeeeeeeeeeeeeeeeeeerrrrrrrrrrrrrrrrrrreeeeeeeeeeeeeeeeeee')
        if(this.fblian == null || this.fblian == "") {
          return;
        }
        if(this.fblian.length > 0 && typeof this.fblian == "object") {

          // 去重
          this.fblian = this.fblian.sort();
          for(let ii = 0; ii < this.fblian.length - 1; ii++) {
            if(this.fblian[ii].split("#")[1] == this.fblian[ii + 1].split("#")[1]) {
              this.fblian.splice(ii, 1);
              ii--;
            }
          }
          this.listFblian = [];
          this.fblian.forEach((item, index) => {
            let itemCurr = item.split("#");
            let url = "#/detail/" + itemCurr[0] + "/" + itemCurr[1];
            //console.log(url,'lianxnaglujing------------------------------------')
            this.axios.get("/form?type=" + itemCurr[0] + "&gid=" + itemCurr[1], {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                _api_name: "fb_charge_detail",
                _api_version: "1.0.0",
              }
            }).then((res) => {
              let title = res.data.data.Title ? res.data.data.Title : res.data.data.InfoTitle;
              let current = {
                url: url,
                title: title
              }
              this.listFblian.push(current);
            });
          });
          // console.log(this.listFblian,'listFblianlistFblianlistFblianlistFblianlistFblianlistFb')
        } else if(typeof this.fblian == "string") {
          let itemCurr = this.fblian.split("#");
          let url = "#/detail/" + itemCurr[0] + "/" + itemCurr[1];
          this.axios.get("/form?type=" + itemCurr[0] + "&gid=" + itemCurr[1], {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              _api_name: "fb_charge_detail",
              _api_version: "1.0.0",
            }
          }).then((res) => {
            let title = res.data.data.Title ? res.data.data.Title : res.data.data.InfoTitle;
            let current = {
              url: url,
              title: title
            }
            this.listFblian.push(current);
          });
        } else {
          this.listFblian.push({
            url: "",
            title: "暂无数据"
          });
        }
      },
      slowUp_change(e,type) {
        // 默认收起  收起<i class="el-icon-arrow-up"></i>
        let shouqi = '收起<i class="el-icon-arrow-up"></i>';
        let zhankai = '展开<i class="el-icon-arrow-down"></i>'
        let _current = $(e.target);
        if($(e.target)[0].nodeName == "I"){
          _current = $(e.target).parent(".referenceThisLaw_icon");
        }
        if(_current.hasClass('shouqi')){
          _current.html(zhankai).removeClass('shouqi').addClass('zhankai');
        }else{
          _current.html(shouqi).removeClass('zhankai').addClass('shouqi');
        }
        $("."+type).toggle();
      },
      handleChange(val) {
        // genggai收起 展开
      },
      menu() {
        this.scroll = document.documentElement.scrollTop || document.body.scrollTop;
        if(this.scroll > 83) {
          // console.log('ddddddddddd')
          this.navBarFixed = true;
        } else {
          // console.log(this.scroll,'juli')
          this.navBarFixed = false;
        }

      },
      confirmStatus() {
        $('.detail_content_wrap').html(function(i, oldHTML) {
          return oldHTML.replace(/<\/?font[^><]*>/g, '');
        });

        this.search_keyword_num = 1;
        console.log("字段确认");
        if(this.checked_biaoliang || this.checked_juming) {
          this.checked_biaoliang = true;
          console.log(this.search_keyword);
          var tips = this.search_keyword;
          if(tips != '') {
            var b = new RegExp(tips, "g");
            console.log("b",b)
            $('.detail_content_wrap').html(function(i, oldHTML) {
              return oldHTML.replace(b, '<font class="point">' + tips + '</font>');
            });
            this.search_keyword_num = this.num_sign;
            this.all_num = $('.point').length;
            console.log("长度" + this.all_num);
            for(var i = 1; i <= $('.point').length; i++) {
              $('font').eq(i - 1).attr('id', 'sk' + i);
              if(i == 1){
                $('font').eq(0).attr('class', 'point ' + ' active');
              }

            }
            $(document).scrollTop($("#sk1").offset().top - 65);
            if(this.checked_juming) {
              console.log("我要标亮");
              $("#sk1").addClass('active');
            }
            this.isShowTotal = true;
          } else if(tips == '' || tips == undefined) {
            this.isShowTotal = false;
          }
          return;
        }

      },
      dump() {
        if(this.search_keyword_number != "" && this.search_keyword_number != undefined) {
          if($("a[name=tiao_" + this.search_keyword_number + "_kuan_1]").length != 0) {
            $(document).scrollTop($("a[name=tiao_" + this.search_keyword_number + "_kuan_1]").offset().top - 65);
          } else if($("a[name=tiao_" + this.search_keyword_number + "]").length != 0) {
            $(document).scrollTop($("a[name=tiao_" + this.search_keyword_number + "]").offset().top - 65);
          }
        } else {
          // $(document).scrollTop(0);
        }
      },

      upKeyWord() {
        // console.log(this.all_num);
        // console.log(this.search_keyword_num);
        this.isShowTotal = true;
        $("#sk" + this.search_keyword_num).removeClass('active');
        if(this.search_keyword_num - 1 > 0) {
          $("#sk" + this.search_keyword_num).removeClass('active');
          this.search_keyword_num = this.search_keyword_num - 1;
          $(document).scrollTop($("#sk" + this.search_keyword_num).offset().top - 65);

          $("#sk" + this.search_keyword_num).addClass('active')

        } else {
          console.log("else");
          // var length =$('.point').length;
          $("#sk" + this.search_keyword_num).removeClass('active');
          $("#sk" + this.all_num).addClass('active');
          this.search_keyword_num = this.all_num;
          $(document).scrollTop($("#sk" + this.all_num).offset().top - 65);
        }

      },
      downKeyWord() {
        this.isShowTotal = true;
        if(this.search_keyword_num < this.all_num) {
          $("#sk" + this.search_keyword_num).removeClass('active');
          this.search_keyword_num = this.search_keyword_num + 1;
          $(document).scrollTop($("#sk" + this.search_keyword_num).offset().top - 65);
          $("#sk" + this.search_keyword_num).addClass('active')

        } else {
          $("#sk" + this.search_keyword_num).removeClass('active');
          $("#sk1").addClass('active');
          this.search_keyword_num = 1;
          $(document).scrollTop($("#sk1").offset().top - 65);
        }
      },

      noteArticleDes() {
        this.noteVisible = false;
        this.noteVal = ''
      },
      openAllMethod() {
        if(this.openAll == false) {
          this.openAll = true;
          this.openAllHtml = "<i class='el-icon-arrow-down'></i>收起全部";
        } else {
          this.openAll = false;
          this.openAllHtml = "<i class='el-icon-arrow-up'></i>展开全部";
        }
      },
      toTegional(name) {
        $(document).scrollTop($("a[name=" + name + "]").offset().top - 65);
      },

      versionChangeo(val) {
        this.versionChange = $(val.target).attr('value');
        console.log('---------------版本切换------------------------',this.versionChange)
        if(this.versionChange == "2"){
          // 纯净版
          this.chunFlag = false;
          this.axios.get("/form?library=" + this.$route.params.type + "&gid=" + this.$route.params.gid, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              _api_name: "fb_getpurefulltext",
              _api_version: "1.0.0",
            }
          }).then((res) => {
            console.log('纯净版-------------',res)
            this.chunFlag = true;
            if(res.data.success){
              this.chunJingData=res.data.data;
            }
          });

        }else if(this.versionChange == "1"){
          // 法宝版

        }
      },
      //头补选中
      handleSelect(queryData) {
        console.log(queryData, "---------------------------------------------");
      },
      operation(val) {
        console.log(val)
      },
      request(parm, config) {
        const req = new XMLHttpRequest();
        req.open(config.method, config.url, true);
        req.responseType = 'blob';
        req.setRequestHeader('dsb-api-name', 'fabao01');
        req.setRequestHeader('dsb-api-version', '1.0');
        req.onload = function() {
          if(req.readyState == 4 && req.status == 200) {
            const data = req.response;
            const blob = new Blob([data]);
            const blobUrl = window.URL.createObjectURL(blob);
            const name = config.data.title + ".doc";
            const a = document.createElement('a');
            a.style.display = 'none';
            a.download = name;
            a.href = blobUrl;
            a.click();
            if(a.parentNode) {
              a.parentNode.removeChild(a);
            }
          }
        };
        req.send(parm);
      },
      // DownLoad(options) {
      //   var config = $.extend(true, {
      //     method: 'post'
      //   }, options);
      //   var form = new FormData();
      //   form.append("title", config.data.title);
      //   form.append("content", config.data.content);
      //   form.append("gid", config.data.gid);
      //   form.append("index", config.data.index);
      //   this.request(form, config)
      // },
      //下载
      down() {
        var gid = this.$route.params.gid;
        // var title = $('.tips').html();
        // if(title == '' || title == null || title == undefined) {
        //   title = $('.detail_content .title1').html();
        // }
        // if(this.type == 'cribook') {
        //   title = $('h2.title').html();
        // }
        // var temporary = $('.detail_content').html();
        // var temporary = temporary.replace(/<span class="reference_btn">[\s\S]*?<\/div>[\s\t\r\n]*<\/span>/, "")
        // var content = '<div class="detail_content" id="detail_content">' + temporary + '</div>';
        var index = this.$route.params.type;
        // console.log({
        //         title: (title ? title : ""),
        //         content: content,
        //         gid: gid,
        //         index: index
        //       })    /xsfb/criminal/BatchDownloadFulltext
        Download({
          // data: {
            library: index,
            curLib: index,
            gids: gid,
            keepFields: "false",
            downloadType:"word"
          // }
        })
      },
      // 显示笔记弹窗
      getNote(key) {
        console.log(key);

        console.log("----------------------------------------------------------------")
        console.log(this.currentTitle)
        if(key == "全局") {
          this.selVal = this.currentTitle
        } else {
          this.selVal == "" ? this.selVal = this.currentTitle : ""
        }
        this.noteVisible = true
      },
      //复制
      copyNote() {
        // console.log(this.selVal,'-------------------xuanzhong-------------')
        var Input = document.createElement('input');
        Input.value = this.selVal;
        document.body.appendChild(Input);
        Input.select();
        document.execCommand("copy");
        Input.className = 'Input';
        Input.style.display = 'none';
        // console.log(event,window,$)
      },
      // 添加笔记内容
      noteArticle() {
        if(this.noteCategory == '') {
          this.$message({
            type: 'error',
            message: '请选择分类！'
          });
        } else if(this.noteVal == '') {
          this.$message({
            type: 'error',
            message: '请输入内容！'
          });
        } else {
          // console.log(this.noteCategory,'---------------------------------')
          var url = this.$route.path
          var absolutePath = window.location.href;
          var index = url.lastIndexOf("\/");
          var articleId = url.substring(index + 1, url.length);
          //处理路径 当含有过长参数时 路徑不規範時
          // var needUrl = window.location.origin + "/#" + url;
          // absolutePath = needUrl;
          let data = {
            userId: this.tandu.userId,
            token: 100001,
            articleId,
            articleTitle: this.articleTitle,
            url: absolutePath,
            directoryId: this.noteCategory,
            noteContent: this.noteVal,
            selectContent: this.selVal
          }
          if(data.selectContent.length > 252) {
            this.$message({
              type: 'warning',
              message: '笔记选中内容过长，请再次选择！'
            });
            return;
          }
          console.log("----------添加笔记参数---------------", data)
          addNoteVal(data).then((res) => {
            console.log("---------------添加笔记返回参数----------", res)
            if(res.data.code == "0") {
              this.$message({
                type: 'success',
                message: '文章添加笔记成功!'
              });
              this.noteVisible = false
              this.noteVal = ''
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              });
            }
          })
        }
      },
      // 获取选中的文字
      getSelWord() {
        this.selVal = window.getSelection().toString()
        console.log(1111);
      },
      // 收藏弹窗
      showCollectDia() {
        this.collectVisible = true
      },
      // 确定收藏
      collectArticle() {
        var url = this.$route.path
        var index = url.lastIndexOf("\/");
        var articleId = url.substring(index + 1, url.length)
        var absolutePath = window.location.href;
        //处理路径 当含有过长参数时 路徑不規範時
        // var needUrl = window.location.origin + "/#" + url;
        // absolutePath = needUrl;
        let data = {
          userId: this.tandu.userId,
          token: 100001,
          url: absolutePath,
          directoryId: this.collectCategory,
          collectionName: this.collectName,
          articleId
        }
        // console.log(data,'--------------收藏参数------------------------------')
        addCollectValue(data).then((res) => {
          // console.log(res,'-----------收藏返回参数----------------------')
          if(res.data.code == "0") {
            this.$message({
              type: 'success',
              message: '文章收藏成功!'
            });
            this.collectVisible = false
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
        })
      }
    }
  }
  let that = this;
  window.SLC=function(curtId,curtTiao){
      console.log('---------跳转详情-------------',curtId,curtTiao);
       //有，
      let type = AJIType(curtId)[0];
      console.log('---------跳转详情type-------------',type);
      if(curtTiao){
        window.open(window.location.origin + "/#/detail/" + type + "/" + curtId + "/" + curtTiao, '_blank');
      }else{
        window.open(window.location.origin + "/#/detail/" + type + "/" + curtId, '_blank');
      }
  }
  window.AJI=function(curtId,curtTiao) {
    sessionStorage.setItem("AJICurtId", curtId);
    sessionStorage.setItem("AJICurtTiao", curtTiao);
  }
  window.MLK=function(target,current) {

    let currentArr= current.split(";");
    sessionStorage.setItem("AJICurtId", currentArr[0].split(",")[0]);
    // sessionStorage.setItem("AJICurtTiao", curtTiao);
    console.log(target,current,currentArr,currentArr[0].split(",")[0])
  }

  //詳情
  window.AJIType=function(gid) {
    var lib = "lar";
    var model = "Law";
    gid = parseInt(gid);
    gid = 0xff000000 & gid;
    switch(gid) {
      case 0x00000000: //中央库
        lib = "chl";
        model = "Law";
        break;
      case 0x01000000: //地方库
        lib = "lar";
        model = "Law";
        break;
      case 0x02000000: //判例库
        lib = "pcas";
        model = "Case";
        break;
      case 0x04000000: //国际条约库
        lib = "iel";
        model = "Law";
        break;
      case 0x06000000: //条约库
        lib = "eagn";
        model = "Law";
        break;
      case 0x07000000: //裁判文书库
        lib = "pfnl";
        model = "Case";
        break;
      case 0x0e000000: //仲裁文书库
        lib = "atr";
        model = "Case";
        break;
      case 0x10000000: //合同范本库
        lib = "cont";
        model = "Law";
        break;
      case 0x11000000: //法律文书库
        lib = "fmt";
        model = "Law";
        break;
      case 0x14000000: //法学文献库
        lib = "art";
        model = "Reference";
        break;
      case 0x41000000: //立法背景_ lfbj wgd
        lib = "lfbj";
        model = "Law";
        break;
      case 0x4b000000: //案例报道
        lib = "pal";
        model = "Case";
        break;
      case 0x5a000000: //期刊文献数据库0x32000000
        lib = "qikan";
        model = "Journal";
        break;
    }
    return [lib, model];
  }
</script>
<style lang="less" >
  .chunjing_wrap{
      color: #2d405e;
      font-size: 18px;
      padding: 40px 65px;
      line-height: 190%;
      a{
        color: #2d405e !important;
        cursor: default;
      }
    .chunjing_wrap_span{
      display: block;
      .txt_header_wrap{
        text-align: center;
        display: block;
        border-bottom: 2px solid #a9c4df;
        padding-bottom: 10px;
        margin-bottom: 10px;
        box-sizing: border-box;
      }
      .txt_header_wrap_no{
        text-align: left;
        display: block;
      }
    }
  }
</style>
<style lang="less" scoped>
  .referenceThisLaw_main_wrap{
    .change_header.referenceThisLaw_header{
      color: #4f5e78;
      font-size: 16px;
      .one{

      }

    }
    .referenceThisLaw_icon:hover{
      color: #4084f0;
    }
    .referenceThisLaw_center_wrap{
      text-align: left;
      font-size: 16px;
      color: #4f5e78;
      margin: 20px;
      overflow: hidden;
      overflow-y: scroll;
      .referenceThisLaw_p{
        line-height: 200%;
        span{
          display: inline-block;
          margin-right: 20px;
          cursor: default;
          color: #4084f0;
        }
      }
    }
  }
</style>
<style >
  .el-row {
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #FFF;
  }
  .bg-purple {
    background: #FFF;
  }
  .bg-purple-light {
    background: #FFF;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .fansi_span_sb {
    color: #4f5e78 !important;
    display: inline-block;
    width: 78px;
    text-align: right;
  }

  .change_content_wrap .el-collapse-item__wrap {
    width: 50%;
    margin: 40px auto;
    padding: 10px;
    border: none;
  }

  .change_content_wrap .el-timeline-item__tail {
    position: absolute;
    left: 5px;
    height: 200%;
    /* border: 2px dashed; */
    border-left: 1px dashed #879bba;
  }

  .change_content_wrap .el-timeline-item__node--normal {
    left: 0;
  }

  .change_content_wrap .el-timeline-item__timestamp {
    text-align: left;
    color: #879bba;
    /* font-size: 14px; */
  }

  .change_content_wrap .el-card__body {
    padding: 15px;
    box-sizing: border-box;
    color: #879bba;
    font-size: 14px;
    text-align: left;
    /* border:1px solid rgb(92, 121, 176); */
  }

  .change_content_wrap .el-card.is-always-shadow {
    -webkit-box-shadow: 0 2px 12px 0 rgba(92, 121, 176, .3);
    box-shadow: 0 2px 12px 0 rgba(92, 121, 176, .3);
    border: 1px solid rgba(92, 121, 176, .3);
    border-radius: 3px;
  }

  .change_content_wrap .el-collapse-item__header {
    border-top: 2px solid #a8bdce;
    background-color: #daedfb;
    font-size: 14px;
    text-align: left;
    padding-left: 15px;
    height: 38px;
    line-height: 38px;
    color: #2d405e;
    padding-right: 15px;
  }

  .change_content_wrap .el-collapse-item__header.focusing:focus:not(:hover) {
    color: #2d405e;
  }

  .find_wrap_num {
    margin-left: -45px;
    font-size: 13px;
    color: #879bba;
  }

  .shoucang .el-dialog__body .el-input {
    margin-bottom: 20px;
    width: 217px;
  }

  .shoucang .el-dialog__body .el-select {
    width: 217px;
  }

  .item.operatio_xia {
    float: right;
  }

  .item.operatio_xia span {
    cursor: pointer;
    color: #2d405e;
    font-size: 13px;
    margin: 0 8px;
  }

  .item.operatio_xia span:hover {
    color: #4084f0;
  }

  .popover_this_wrap {}

  .chun_quan_wrap {
    border: 1px solid #a9c4df;
  }

  .detail_content_wrap {
    color: #2d405e;
    font-size: 18px;
    padding: 40px 65px;
    text-align: left;
    line-height: 190%;
  }

  .el-popover {
    padding: 0px;
    /* height: 150px; */
    overflow: hidden;
    box-shadow: 0 0 10px 1px #ebf4fe;
  }

  .popover_wrap {
    background-color: #ecf1fa;
  }

  .popover_wrap .zhang_one {
    /* padding: 0 15px; */
    background-color: #fff;
    height: 280px;
    overflow-y: auto;
  }

  .popover_wrap .zhang_one .tiao_expand {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .popover_wrap .zhang_one .tiao_expand a {
    margin-left: 10px;
  }

  .expand_hidden {
    display: none;
  }

  .popover_wrap .zhang_one a {
    width: 100%;
    height: 100%;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .zhang_one dl dt a,
  .zhang_one dl dd a {
    font-size: 16px;
    color: #4f5e7b;
    height: 35px;
  }

  .zhang_one dl dt,
  .zhang_one dl dd {
    font-size: 16px;
    color: #4f5e7b;
    height: 35px;
    padding: 0 15px;
    line-height: 35px;
  }

  .zhang_one dl dt:hover,
  .zhang_one dl dd:hover {
    background-color: #d7e5f9;
    color: #4084f0;
  }

  .header_txt_popo {
    width: 100%;
    height: 35px;
    font-size: 12px;
    color: #879bba;
    text-align: right;
    background-color: #ecf1fa;
    line-height: 35px;
    padding: 0 15px;
    box-sizing: border-box;
  }

  .header_txt_popo i {
    color: #879bba;
  }

  .header_txt_popo span {
    cursor: pointer;
  }

  .icon_wrap button {
    border: none;
    padding: 0;
    padding: 5px 8px;
  }

  .aim_law_change {
    border: 1px solid #a9c4df;
    margin: 10px;
  }

  .aim_law_change .change_header {
    border-top: 2px solid #a8bdce;
    background-color: #daedfb;
    font-size: 14px;
    text-align: left;
    padding-left: 15px;
    height: 38px;
    line-height: 38px;
    color: #2d405e;
    padding-right: 15px;
  }

  .aim_law_change .change_header .change_icon {
    float: right;
    cursor: pointer;
  }

  .aim_law_change .change_header .change_icon i {
    font-size: 18px;
    vertical-align: baseline;
  }

  .detail-content {
    padding: 20px 10px;
  }

  .detail-content .header-txt {
    color: #2d405e;
    /* font-size: 18px; */
    font-size: 20px;
    /* color: #000; */
    font-weight: bold;
    text-align: center;
    margin-bottom: 15px;
    position: relative;
  }

  .detail-content .detail-header-txt {
    margin-top: 15px;
    background-color: #ecf1fa;
    padding: 20px 40px;
    text-align: left;
    padding-bottom: 0px;
  }

  .detail-content .detail-header-txt .header-ul li {
    display: inline-block;
    width: 45%;
    text-align: left;
    color: #4f5e78;
    font-size: 15px;
    margin-bottom: 20px;
  }

  .detail-content .detail-header-txt .header-ul li span {
    color: #4084f0;
  }

  .fb_lian_wrap .ul-list {
    /* margin-bottom: 20px; */
    text-align: left;
    padding: 10px 20px;
    font-size: 14px;
  }

  .fb_lian_wrap .ul-list .lian_header {
    color: #4f5e78;
    padding-left: 10px;
    border-left: 2px solid #4084f0;
    font-size: 15px;
  }
  .fb_lian_wrap .lian_list_ul_wrap{
    margin-top: 10px;
    margin-left: 10px;
  }
  .fb_lian_wrap .lian_list_ul_wrap ul.lian_list_ul{
    margin-left: 10px;
  }
  .fb_lian_wrap .lian_list_ul_wrap .lian_list_ul_header{
    margin: 0;
    padding: 0;
    margin-bottom: -5px;
  }
  .fb_lian_wrap .lian_list_ul_wrap .lian_list_ul_header span{
    cursor: pointer;
  }

  .lian_list_ul li {
    list-style: disc;
    margin: 15px;
    color: #879bba;
  }

  .lian_list_ul li a {
    color: #879bba;
    font-size: 14px;
  }

  #textExample {
    border-top: 2px solid #a8bdce;
    background-color: #daedfb;
    font-family: 'Microsoft YaHei', Arial, "Avenir", Helvetica, sans-serif;
    /* font-weight: bold; */
    font-style: normal;
    font-size: 16px;
    text-align: left;
    padding-left: 15px;
    height: 38px;
    line-height: 38px;
    color: #2d405e;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .center_wrap {
    overflow: hidden;
    padding: 20px 10px;
  }

  .detail_wrap {
    width: 78%;
  }

  .fb_lian_wrap {
    width: 20%;
    float: right !important;
  }

  .fb_lian_wrap,
  .detail_wrap {
    border: 1px solid #a9c4df;
    /* border-top: 1px solid #a8bdce; */
    float: left;
  }

  .operation_wrap_bar {
    display: block !important;
    position: fixed;
    top: 0;
    z-index: 999;
    background-color: #fff;
    width: 90%;
    /* width: 1460px; */
  }

  @media screen and (max-width:1530px) {
    /* .operation_wrap_bar{
      width: 1300px;
    } */
  }

  .header_search_wrap {
    width: 100%;
  }

  .operation_wrap {
    box-sizing: border-box;
    border-bottom: 1px solid #a9c4df;
    text-align: left;
    padding: 10px 30px;
    font-size: 13px;
  }

  .operation_wrap ul.operation_ul li {
    display: inline-block;
    margin-right: 20px;
    height: 100%;
    line-height: 32px;
  }

  .operation_wrap ul.operation_ul {
    height: 32px;
    overflow: hidden;
  }

  .operation_wrap ul.operation_ul li .el-checkbox__label {
    font-size: 13px;
    color: #2d405e;
    padding-left: 5px;
  }

  .operation_wrap ul.operation_ul .tab-lang {
    font-size: 13px;
  }

  .operation_wrap ul.operation_ul .tab-lang a {
    /* display: inline-block; */
    padding: 5px 12px;
    border: 1px solid #eaeaea;
    float: left;
  }

  .operation_wrap ul.operation_ul .tab-lang a.active,
  .operation_wrap ul.operation_ul .tab-lang a:hover {
    background-color: #4084f0;
    color: #fff;
  }

  .operation_wrap ul.operation_ul .tab-lang a.fb_version {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }

  .operation_wrap ul.operation_ul .tab-lang a.chun_version {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }

  .operation_wrap ul.operation_ul li .el-checkbox__inner {
    width: 12px;
    height: 12px;
  }

  .operation_wrap ul.operation_ul li .el-checkbox__inner::after {
    height: 5px;
    left: 3px;
  }

  .btn_wrap {
    color: #879bba !important;
    /* line-height: inherit !important; */
  }

  .btn_wrap ::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #879bba;
    font-size: 13px;
  }

  .btn_wrap ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #879bba;
    font-size: 13px;
  }

  .btn_wrap :-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #879bba;
    font-size: 13px;
  }

  .btn_wrap .el-input-group {
    width: 70%;
    color: #879bba;
  }

  .btn_wrap .el-input-group input {
    height: 30px;
    font-size: 13px;
    line-height: 30px;
  }

  .btn_wrap label {
    vertical-align: top;
  }

  .btn_wrap .el-input-group .el-input-group__append {
    padding: 0;
    width: 60px;
    height: 28px;
    background-color: transparent;
    /* border: none; */
  }

  .btn_wrap .el-input-group .el-input-group__append button {
    width: 50%;
    height: 100%;
    padding: 0;
    display: inline-block;
    margin: 0;
    /* border: 1px solid #DCDFE6; */
  }

  .btn_wrap .el-input-group .el-input-group__append button i {
    font-size: 16px;
    font-weight: bold;
    color: #879bba;
  }

  .zhuan_wrap {
    color: #879bba;
  }

  .btn_wrap .el-input-group .el-input-group__append button:hover i {
    color: #4084f0;
  }

  .btn_wrap .el-input-group .el-input-group__append button.next_btn {
    border-right: 1px solid #DCDFE6;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  .operation_ul .icon_wrap span {
    font-size: 13px;
    color: #2d405e;
    cursor: pointer;
  }

  .operation_ul .icon_wrap span i {
    font-size: 16px;
    color: #4084f0;
    font-weight: bold;
    vertical-align: text-top;
    margin-right: 3px;
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

  .zhuan_wrap .el-input {
    width: 50px;
    margin: 0 5px;
  }

  .zhuan_wrap .el-input input {
    padding: 0;
    text-align: center;
    /* width: 50px; */
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

  .collectAddBtn {
    margin-top: 10px
  }

  .collectAddBtn button {
    width: 100%
  }

  .tips {
    color: #333;
  }

  .head {
    position: fixed;
    top: 0;
    z-index: 999;
    padding: 3px 1%;
    border-color: #1c3664;
  }

  .article_nav {
    line-height: 38px;
    width: 100px;
    height: 38px;
    position: relative;
    left: 12px;
    top: -12px;
    background-color: #218fc4;
    z-index: 99;
    text-align: center;
    color: #fff;
    font-weight: 900;
  }
  /*基本样式设置*/

  u {
    text-decoration: none;
  }

  body {
    background-color: #EEEEEE;
  }

  input {
    outline: none;
  }

  .header_box {
    height: 50px;
    width: 100%;
  }

  .foot {
    position: fixed;
  }

  .detail {
    width: 1200px;
    margin: 0 auto;
    background-color: #eeeeee;
    clear: none;
    overflow-y: hidden;
    height: auto;
    padding-bottom: 80px;
  }

  .detail .crumbs {
    width: 100%;
    height: 48px;
    line-height: 48px;
    box-sizing: border-box;
    padding-left: 20px;
    font-size: 12px;
  }

  .detail .crumbs .hide {
    display: none;
  }

  .crumbs a {
    color: #333;
  }

  .detail .article {
    width: 100%;
    padding-bottom: 50px;
    background-color: #FFFFFF;
  }

  .detail .article_lef {
    box-sizing: border-box;
    width: 290px;
    float: left;
    height: auto;
    overflow-y: hidden;
    padding-left: 20px;
    padding-top: 30px
  }

  .article_rgh {
    width: 880px;
    padding-right: 20px;
    float: right;
    height: auto;
    overflow-y: hidden;
  }

  .detail .article_handle {
    width: 880px;
    height: 44px;
    text-align: center;
    background-color: #fff;
    -webkit-box-shadow: 0 2px 3px #ebebeb;
    box-shadow: 0 2px 3px #ebebeb;
    z-index: 9;
  }
  /*文章主体样式*/

  .article {
    clear: both;
    overflow-y: hidden;
    height: auto;
    background-color: #FFFFFF;
  }

  .title1 {
    padding-top: 20px;
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    border-bottom: 3px solid #b6c6cd;
  }
  /*文章操作部分样式*/

  .handle_lef {
    height: 100%;
    float: left;
    color: #000;
    vertical-align: middle;
    line-height: 44px;
    font-size: 12px;
    width: 530px;
  }

  .handle_lef label {
    float: left;
    padding-left: 10px;
  }

  .handle_lef label input {
    vertical-align: middle;
    margin-right: 5px;
  }

  .handle_lef label.key {
    box-sizing: border-box;
    height: 24px;
    margin-top: 10px;
    line-height: 24px;
  }

  .handle_lef label.key div {
    border: 1px solid #cccccc;
    float: right;
    width: 155px;
    height: 24px;
  }

  .handle_lef label.key span {
    float: left;
    border-left: 1px solid #ccc;
    width: 24px;
    height: 100%;
  }

  .handle_lef label.key input {
    float: left;
    width: 147px;
    height: 100%;
    border: none;
    padding-left: 5px;
  }

  .handle_rgh {
    float: right;
    color: #218fc4;
    padding-top: 10px;
    font-size: 12px;
    position: relative;
  }

  .handle_rgh span {
    float: left;
    width: 44px;
    height: 22px;
    text-align: center;
    line-height: 22px;
    border: 1px solid #218fc4;
    margin-right: 10px;
  }

  .handle_rgh span:hover {
    background-color: #218fc4;
    color: #FFFFFF;
    cursor: pointer;
  }
  /*基本信息部分样式*/

  .basic {
    padding: 20px;
    font-size: 14px;
    line-height: 26px;
    color: #333;
    background-color: #f7f7f7;
    overflow: hidden;
    margin-top: 20px;
  }

  .basic ul li {
    position: relative;
    float: left;
    margin-right: 1%;
    width: 28%;
    padding-left: 130px;
    line-height: 26px;
    vertical-align: top;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: #666666;
  }

  .basic ul li strong {
    position: absolute;
    width: 130px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    left: 0;
    top: 0;
    text-align: right;
    color: #999999;
  }

  .basic ul .row {
    width: 84%;
    overflow: inherit;
    white-space: normal;
  }

  .basic ul .row span {
    float: left;
    margin-left: 10px;
  }

  h4,
  h3 {
    clear: both;
    display: inline-block;
  }

  .reference {
    font-size: 16px;
    color: #333;
    margin-top: 26px;
    padding-bottom: 20px;
  }

  .reference a {
    color: #333;
  }

  .detaile_article {
    color: #333;
    padding-top: 20px;
    font-size: 16px;
    line-height: 32px;
  }

  .detaile_article.s {
    font-size: 16px;
    line-height: 30px;
  }

  .title {
    text-align: center;
    clear: both;
    height: 100px;
    line-height: 100px;
  }

  .sub-title {
    text-align: center;
  }

  .point {
    color: red;
  }

  .point.active {
    color: #FFFFFF;
    background-color: red;
  ;
  }

  .active11 {
    color: #FFFFFF;
    background-color: red;
  ;
  }

  .hit {
    display: none;
  }

  .MTitle {
    color: #2d405e;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
  }

  .MTitle .alink {
    /* color: #4084f0; */
    color: #2d405e;
    /* font-size: 18px; */
    margin-bottom: 10px;
  }

  .MTitle .alink:hover {
    color: #165ac6;
  }

  .fb_lian_wrap #textExample {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    padding: 0 0 0 55px;
    background: #2a94c6 url('../../static/img/lenovo.png') no-repeat 15px center;
  }

  .reference_btn {
    display: inline-block;
  }
  /*转发部分样式*/

  .transpond {
    padding-top: 20px;
    position: fixed;
    top: 110px;
    right: 4%;
    width: 600px;
    height: 517px;
    box-shadow: 0 0 30px #888888;
    background-color: #FFFFFF;
    z-index: 99;
    font-size: 14px;
    display: none;
  }

  .transpond_box {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
  }

  .transpond i {
    position: absolute;
    right: -15px;
    top: -15px;
    display: block;
    width: 28px;
    height: 28px;
    border-radius: 14px;
    background-color: #FFFFFF;
  }

  .transpond i:hover {
    cursor: pointer;
    background-color: #218fc4;
  }

  .transpond_list .transpond_lists {
    padding-bottom: 10px;
    overflow: hidden;
  }

  .transpond_option {
    float: left;
    width: 170px;
    text-align: right;
    line-height: 28px;
    color: #666;
  }

  .transpond_blank {
    float: left;
  }

  .transpond_blank input {
    box-sizing: border-box;
    border: 1px solid #cccccc;
    display: block;
    width: 365px;
    height: 28px;
    padding-left: 10px;
  }

  .transpond_blank textarea {
    display: block;
    width: 363px;
    height: 239px;
    border: 1px solid #ccc;
  }

  .transpond_btns {
    clear: both;
    padding-top: 34px;
    padding-bottom: 34px;
    overflow: hidden;
  }

  .transpond_btns_1 {
    float: left;
    width: 150px;
    height: 40px;
    background-color: #06a9ee;
    color: #FFFFFF;
    margin-left: 100px;
    text-align: center;
    line-height: 40px;
  }

  .transpond_btns_2 {
    float: left;
    width: 150px;
    height: 40px;
    background-color: #bfbfbf;
    color: #FFFFFF;
    margin-left: 50px;
    text-align: center;
    line-height: 40px;
  }

  .transpond_btns_1:hover {
    cursor: pointer;
    background-color: #218fc4;
  }

  .transpond_btns_2:hover {
    cursor: pointer;
    background-color: #999999;
  }

  h4,
  h3 {
    height: 30px;
    margin-bottom: 10px;
  }

  li {
    list-style: none;
    margin: 0;
    vertical-align: top;
  }

  .directory-nav {
    position: absolute;
    padding: 12px 0 20px 0;
    display: block;
    margin-top: 20px;
    max-height: 510px;
    /*overflow-y: scroll;*/
    width: 200px
  }

  .directory-nav .lift {
    padding: 12px 0 20px 30px;
  }

  .directory-nav li {
    position: relative;
  }

  .directory-nav li p {
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .directory-nav li[levelpath="1"] p {
    font-weight: 900;
    color: #000;
  }

  .directory-nav li[levelpath="2"] p {
    margin-left: 10px;
  }

  .directory-nav li[tier="2"] p {
    font-weight: 900;
    color: #000;
  }

  .directory-nav li[tier="3"] p {
    font-weight: 700;
    color: #333;
    margin-left: 10px;
  }

  .directory-nav li[tier="4"] p {
    margin-left: 20px;
  }

  .directory-nav li .dot {
    position: absolute;
    left: -19px;
    top: 4px;
    display: block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    border: 1px solid #218fc4;
    z-index: 3;
    background-color: #218fc4;
  }

  .directory-nav li p:hover {
    height: auto;
    line-height: 20px;
    overflow: initial;
    white-space: initial;
    text-overflow: initial;
    cursor: pointer;
    color: red;
  }

  .directory-nav li:hover a {
    color: #000;
  }

  .directory-nav .l1 {
    font-weight: 900;
  }

  .directory-nav .l2 {
    text-indent: 0.6em;
  }

  .directory-nav .l1 a {
    font-size: 16px;
    cursor: pointer
  }

  .directory-nav .l2 a {
    font-size: 14px;
  }

  .directory-nav,
  .directory-nav a {
    color: #666;
    font-size: 14px;
  }

  .directory-nav .cur a {
    color: red;
  }

  .directory-nav .cur {
    color: red;
  }

  .directory-nav .line {
    position: absolute;
    left: 15px;
    top: 5px;
    bottom: 5px;
    z-index: 1;
    width: 2px;
    background: #ddd;
  }

  .directory-nav .c-top,
  .directory-nav .c-bottom {
    position: absolute;
    left: 11px;
    z-index: 2;
    display: block;
    width: 10px;
    height: 10px;
    font-size: 0;
    line-height: 0;
    background: url(/resource/xsfb/images/directory-nav.png) no-repeat 0 -69px;
  }

  .directory-nav .c-dot {
    position: absolute;
    left: -19px;
    top: 50%;
    z-index: 2;
    margin-top: -5px;
    display: block;
    width: 10px;
    height: 10px;
    font-size: 0;
    line-height: 0;
    /*background: url(/resource/xsfb/images/directory-nav.png) no-repeat -275px 0;*/
    background-color: #218fc4;
    border-radius: 50%;
  }

  .directory-nav .c-top {
    top: 0
  }

  .directory-nav .c-bottom {
    bottom: 0
  }

  .directory-nav .cur-tag {
    position: absolute;
    left: 9px;
    top: 30px;
    z-index: 5;
    margin-top: -6px;
    display: block;
    width: 19px;
    height: 13px;
    font-size: 0;
    line-height: 0;
    background: url(/resource/xsfb/images/directory-nav.png) no-repeat -271px -37px;
    -webkit-transition: top .3s ease 0s;
    transition: top .3s ease 0s;
  }

  .article_nav {
    line-height: 38px;
    width: 100px;
    height: 38px;
    position: relative;
    left: 12px;
    top: -12px;
    background-color: #218fc4;
    z-index: 99;
    text-align: center;
    color: #fff;
    font-weight: 900;
  }

  .article_nav i {
    position: absolute;
    display: block;
    right: -19px;
    top: 0;
    background-color: #218fc4;
    border-radius: 50%;
    z-index: 999;
    width: 38px;
    height: 38px;
  }

  .directory-nav ul li:first-child {}
  /*基本样式设置*/

  u {
    text-decoration: none;
  }

  body {
    background-color: #EEEEEE;
  }

  input {
    outline: none;
  }

  .header_box {
    height: 50px;
    width: 100%;
  }

  .foot {
    position: fixed;
  }

  .detail {
    text-align: left;
    width: 1200px;
    margin: 0 auto;
    background-color: #eeeeee;
    clear: none;
    overflow-y: hidden;
    height: auto;
    padding-bottom: 80px;
  }

  .detail .crumbs {
    width: 100%;
    height: 48px;
    line-height: 48px;
    box-sizing: border-box;
    padding-left: 20px;
    font-size: 12px;
  }

  .detail .crumbs .hide {
    display: none;
  }

  .crumbs a {
    color: #333;
  }

  .detail .article {
    width: 100%;
    padding-bottom: 50px;
    background-color: #FFFFFF;
  }

  .detail .article_lef {
    box-sizing: border-box;
    width: 290px;
    float: left;
    height: auto;
    overflow-y: hidden;
    padding-left: 20px;
    padding-top: 30px
  }

  .article_rgh {
    width: 880px;
    padding-right: 20px;
    float: right;
    height: auto;
    overflow-y: hidden;
  }

  .detail .article_handle {
    width: 880px;
    height: 44px;
    text-align: center;
    background-color: #fff;
    -webkit-box-shadow: 0 2px 3px #ebebeb;
    box-shadow: 0 2px 3px #ebebeb;
    z-index: 9;
  }
  /*文章主体样式*/

  .article {
    clear: both;
    overflow-y: hidden;
    height: auto;
    background-color: #FFFFFF;
  }

  .title1 {
    padding-top: 20px;
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    border-bottom: 3px solid #b6c6cd;
  }
  /*文章操作部分样式*/

  .handle_lef {
    height: 100%;
    float: left;
    color: #000;
    vertical-align: middle;
    line-height: 44px;
    font-size: 12px;
    width: 530px;
  }

  .handle_lef label {
    float: left;
    padding-left: 10px;
  }

  .handle_lef label input {
    vertical-align: middle;
    margin-right: 5px;
  }

  .handle_lef label.key {
    box-sizing: border-box;
    height: 24px;
    margin-top: 10px;
    line-height: 24px;
  }

  .handle_lef label.key div {
    border: 1px solid #cccccc;
    float: right;
    width: 150px;
    height: 24px;
  }

  .handle_lef label.key span {
    float: left;
    border-left: 1px solid #ccc;
    width: 24px;
    height: 100%;
  }

  .handle_lef label.key input {
    float: left;
    width: 147px;
    height: 100%;
    border: none;
    padding-left: 5px;
  }

  .handle_rgh {
    float: right;
    color: #218fc4;
    padding-top: 10px;
    font-size: 12px;
    position: relative;
  }

  .handle_rgh span {
    float: left;
    width: 44px;
    height: 22px;
    text-align: center;
    line-height: 22px;
    border: 1px solid #218fc4;
    margin-right: 10px;
  }

  .handle_rgh span:hover {
    background-color: #218fc4;
    color: #FFFFFF;
    cursor: pointer;
  }
  /*基本信息部分样式*/

  .basic {
    padding: 20px;
    font-size: 14px;
    line-height: 26px;
    color: #333;
    background-color: #f7f7f7;
    overflow: hidden;
    margin-top: 20px;
  }

  .basic ul li {
    position: relative;
    float: left;
    margin-right: 1%;
    width: 28%;
    padding-left: 130px;
    line-height: 26px;
    vertical-align: top;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: #666666;
  }

  .basic ul li strong {
    position: absolute;
    width: 130px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    left: 0;
    top: 0;
    text-align: right;
    color: #999999;
  }

  .basic ul .row {
    width: 84%;
    overflow: inherit;
    white-space: normal;
  }

  .basic ul .row span {
    float: left;
    margin-left: 10px;
  }

  h4,
  h3 {
    clear: both;
    display: inline-block;
  }

  .reference {
    font-size: 16px;
    color: #333;
    margin-top: 26px;
    padding-bottom: 20px;
  }

  .reference a {
    color: #333;
  }

  .detaile_article {
    padding-top: 20px;
    font-size: 16px;
    line-height: 32px;
  }

  .detaile_article.s {
    font-size: 16px;
    line-height: 30px;
  }

  .title {
    text-align: center;
    clear: both;
    height: 100px;
    line-height: 100px;
  }

  .sub-title {
    text-align: center;
  }

  .point {
    color: red;
  }

  .point.active {
    background-color: red;
    color: #FFFFFF;
  ;
  }

  .hit {
    display: none;
  }

  .reference_btn {
    display: inline-block;
  }
  /*转发部分样式*/

  .transpond {
    padding-top: 20px;
    position: fixed;
    top: 110px;
    right: 4%;
    width: 600px;
    height: 517px;
    box-shadow: 0 0 30px #888888;
    background-color: #FFFFFF;
    z-index: 99;
    font-size: 14px;
    display: none;
  }

  .transpond_box {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
  }

  .transpond i {
    position: absolute;
    right: -15px;
    top: -15px;
    display: block;
    width: 28px;
    height: 28px;
    border-radius: 14px;
    background-color: #FFFFFF;
  }

  .transpond i:hover {
    cursor: pointer;
    background-color: #218fc4;
  }

  .transpond_list .transpond_lists {
    padding-bottom: 10px;
    overflow: hidden;
  }

  .transpond_option {
    float: left;
    width: 170px;
    text-align: right;
    line-height: 28px;
    color: #666;
  }

  .transpond_blank {
    float: left;
  }

  .transpond_blank input {
    box-sizing: border-box;
    border: 1px solid #cccccc;
    display: block;
    width: 365px;
    height: 28px;
    padding-left: 10px;
  }

  .transpond_blank textarea {
    display: block;
    width: 363px;
    height: 239px;
    border: 1px solid #ccc;
  }

  .transpond_btns {
    clear: both;
    padding-top: 34px;
    padding-bottom: 34px;
    overflow: hidden;
  }

  .transpond_btns_1 {
    float: left;
    width: 150px;
    height: 40px;
    background-color: #06a9ee;
    color: #FFFFFF;
    margin-left: 100px;
    text-align: center;
    line-height: 40px;
  }

  .transpond_btns_2 {
    float: left;
    width: 150px;
    height: 40px;
    background-color: #bfbfbf;
    color: #FFFFFF;
    margin-left: 50px;
    text-align: center;
    line-height: 40px;
  }

  .transpond_btns_1:hover {
    cursor: pointer;
    background-color: #218fc4;
  }

  .transpond_btns_2:hover {
    cursor: pointer;
    background-color: #999999;
  }

  body,
  div,
  dl,
  dt,
  dd,
  ul,
  ol,
  li,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  pre,
  code,
  form,
  fieldset,
  legend,
  input,
  textarea,
  p,
  blockquote,
  th,
  td,
  hr,
  button,
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    margin: 0;
    padding: 0;
  }

  body {
    color: #333
  }

  ol,
  ul {
    list-style: none;
  }

  a {
    text-decoration: none;
    outline: none
  }

  img {
    border: none;
  }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px white inset;
  }

  .size18 {
    font-size: 18px;
    line-height: 28px;
  }

  .size14 {
    font-size: 14px;
    line-height: 20px;
  }

  .fl {
    float: left;
  }

  .mgn51 {
    margin-left: 51%
  }

  .mgn18 {
    margin-left: 18px;
  }

  .mgn36 {
    margin-left: 36px;
  }

  .mgn54 {
    margin-left: 54px;
  }

  .scroll {
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 100%;
    background: #f1f1f1;
  }

  .handle {
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    width: 100%;
    height: 50%;
    border-radius: 3px;
    background: #ddd
  }

  .handle:hover {
    background: #aaa;
  }

  .anchorBL {
    display: none;
  }

  .bubble {
    padding: 2px 8px;
    text-align: center;
    line-height: 16px;
    font-size: 12px;
  }
  /*ie8下图标字体的修改*/

  .iconIe8 {
    background: url("/resource/common/images/iconImg.png") no-repeat \9;
  }
  /*头部*/

  .head {
    width: 98%;
    height: 43px;
    /* border-bottom: 1px solid #68758b; */
    padding: 0 1%;
    position: relative;
    background: #edf6ff;
    /* margin-top: -10px; */
    color: #fff;
    font-size: 14px;
  }

  .logo {
    float: left;
  }

  .portal {
    position: absolute;
    top: 5px;
    right: 1%;
    padding-left: 72px;
    min-width: 100px;
  }

  .box-v5 {
    position: absolute;
    left: 0;
    top: 0;
    width: 72px;
  }

  .box-v5 .sch {
    padding-left: 26px;
    background: url(/resource/official/images/icon.png) 0 -2px no-repeat;
    line-height: 30px;
    display: inline-block;
    margin: 0 auto;
    cursor: pointer
  }

  .unline,
  .online {
    display: none
  }

  .online {
    line-height: 32px;
  }

  .online span {
    cursor: pointer
  }

  .online .out {
    display: inline-block;
    border: 1px solid #fff;
    color: #fff;
    font-size: 14px;
    line-height: 26px;
    text-align: center;
    width: 64px;
    margin: 0 6px;
    margin-left: 15px;
    cursor: pointer
  }

  .online>span:hover {
    background: #325dc0;
    border-color: #325dc0
  }

  .online span.name {
    padding-left: 5px;
    font-weight: bold;
    color: white;
    cursor: pointer;
    max-height: 70px;
    overflow: hidden
  }

  .unline>span {
    display: inline-block;
    border: 1px solid #fff;
    color: #fff;
    font-size: 14px;
    line-height: 26px;
    text-align: center;
    width: 64px;
    margin: 0 6px;
    cursor: pointer
  }

  .unline>span:hover {
    background: #325dc0;
    border-color: #325dc0
  }

  .link-v5 {
    width: 267px;
    height: 130px;
    background: #fff;
    position: absolute;
    top: 32px;
    right: -100px;
    color: #333;
    display: none
  }

  .x-v5 {
    position: absolute;
    right: -12px;
    top: -12px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #fff url(/resource/official/images/icon.png) -3px -184px no-repeat;
    cursor: pointer
  }

  .link-v5 .menu {
    background: #c3dbf5;
    border-bottom: 2px solid #498dde;
    line-height: 36px;
    text-align: center;
    height: 36px
  }

  .link-v5 .menu label {
    float: left;
    width: 89px;
    cursor: pointer
  }

  .link-v5 .menu input {
    display: none
  }

  .link-v5 .menu input:checked+p {
    background: #478ede;
    color: #fff
  }

  .link-v5 .inp {
    padding: 15px 20px;
    line-height: 28px;
  }

  .link-v5 .inp input {
    height: 24px;
    width: 160px
  }

  .link-v5 .btn {
    display: inline-block;
    background: #478ede;
    color: #fff;
    width: 56px;
    text-align: center;
    cursor: pointer
  }

  .link-v5 .mode {
    padding: 0 20px;
  }

  .link-v5 .mode label {
    cursor: pointer;
  }

  .link-v5 .mode input {
    outline: none;
    vertical-align: middle
  }
  /*尾部*/

  .foot {
    background: #444;
    text-align: center;
    line-height: 20px;
    font-size: 14px;
    color: #fff;
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 80px !important;
    padding-top: 0 !important;
    top: auto !important;
    z-index: 100;
  }

  .foot a {
    color: #fff
  }

  .background-color-whilte {
    background: white;
  }

  .mmp {
    display: inline-block;
    /*padding-right:260px;*/
    /*background: url("/resource/official/images/sen/wx.png") right no-repeat;*/
    padding-top: 20px;
    height: 60px;
    /*background-size:auto 70px */
  }

  @media (max-height:900px) {
    .directory-nav {
      max-height: 510px;
      font-size: 12px;
    }
    .directory-nav ul {
      max-height: 380px;
    }
  }

  .detail_content_wrap div a.alink {
    /* color: #2d405e !important; */
    /* cursor: default; */
    /* color: #000!important; */
    /* padding: 20px 30px; */
    /* text-align: left; */
    /* line-height: 23px; */
    /* margin-bottom: 20px; */
    padding: 0 !important;
    margin: 0 !important;
  }

  .detail_content_wrap .tiao-wrap {
    margin-bottom: 20px;
  }
</style>
<style scoped lang="less">
 .fbzc_wrap{
    .fbzc_wrap_ul{
      padding: 0;
      margin: 0;
      list-style: none;
      overflow: hidden;
      font-size: 16px;
      .item{
        float: left;
        width: 50%;
        text-align: left;
        margin: 10px 0;
      }
      .item.block_item{
        width: 90%;
        text-align: left;
      }
      .item_title{
        float: left;
        margin-right: 6px;
        // padding-right: 15px;
      }
      .item_txt{
        display: block;
      }
    }
  }
  .aim_law_change {
    border: 1px solid #a9c4df;
    margin: 10px;
  }

  .aim_law_change .change_header {
    border-top: 2px solid #a8bdce;
    background-color: #daedfb;
    font-size: 14px;
    text-align: left;
    padding-left: 15px;
    height: 38px;
    line-height: 38px;
    color: #2d405e;
    padding-right: 15px;
  }

  .aim_law_change .change_header .change_icon {
    float: right;
    cursor: pointer;
  }

  .aim_law_change .change_header .change_icon i {
    font-size: 18px;
    vertical-align: text-bottom;
  }
  .header_ul_zksq_wrap{
    background-color: #fff;
    text-align: center;
    .header_ul_zksq_btn{
      background-color: #ecf1fa;
      display: inline-block;
      padding: 0;
      margin: 0;
      padding: 8px 12px;
      cursor: pointer;
      .one{

      }
    }
  }
  .detail-header-txt_wrap{
    margin: 15px 0;
    background-color: #ecf1fa;
    text-align: left;
    .header-ul{
      padding: 20px 20px;
      box-sizing: border-box;
      overflow: hidden;
      .item{
        display: inline-block;
        width: 45%;
        margin: 10px 0;
        .item_txt{
          display: block;
          margin-left: 100px;
          color: #4084f0;
        }
      }
      .item.row{
        width: 100%;
      }
    }
    .fansi_span_sb{
      color: #4f5e78;
      display: inline-block;
      width: 98px;
      text-align: right;
      float: left;
    }
  }
</style>
