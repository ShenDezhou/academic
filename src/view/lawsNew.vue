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
            <el-col :span="16" id="lawsNewCol" class="lawsNewCol_operation_wrap">
              <!-- @change="searchMethod"
                @blur="searchMethod"
                @clear="searchMethod"
                @keyup.enter.native="searchMethod"
              @change="(item)=>titleChange(item,'input')"-->
              <el-input
                :placeholder="select == '1'? '默认在标题和发文字号中检索':'请输入检索内容'"
                clearable
                v-model="keyword"
                class="input-with-select search_input_wrap"
                prefix-icon="el-icon-search"
                @keyup.enter.native="getList"
                @clear="getList"
                @blur="findHistoryBlur"
              >
              <!-- @focus="findHistory" -->
                <el-select
                  v-model="select"
                  slot="prepend"
                  class="search_select_wrap"
                  @change="(item)=>titleChange(item,'select')"
                >
                  <el-option label="默认" value="1" v-if="tab_nav_select == 'chl' || tab_nav_select == 'lar'"></el-option>
                  <el-option label="标题" value="title"></el-option>
                  <el-option label="全文" value="fulltext"></el-option>
                  <el-option label="发文字号" value="DocumentNO" v-if="tab_nav_select == 'chl' || tab_nav_select == 'lar'"></el-option>
                </el-select>
              </el-input>
              <!--下拉选框子-->
              <div class="lawslishiorothertips_main_wrap" >
                <template v-for=" (key,index) in keywordsDrop">
                  <div :key="index" class="lawslishiorothertips_item">
                    <div @click="getKeywords(key,$event) ">
                      <span v-html="key.keyword"></span>
                    </div>
                  </div>
                </template>
              </div>

            </el-col>
            <el-col :span="8" id="advancedRetrieval_wrap_one" class="advancedRetrieval_btn_link_wrap">
              <el-button type="primary" class="primary-btn-main" @click="getList">
                <span>开始检索</span>
              </el-button>
                      <span v-if="queryWord.filterList.length > 0 || queryWord.keyword">
                <el-button type="primary" class="primary-btn-main_jie" @click="resultGetList">
                  结果中检索
                </el-button>
                      </span>
              <span class="advancedRetrieval_gao" @click="advancedRetrieval()">高级检索</span>
              <!-- <span class="fagui_bian_wrap_lin">
                <a href="#/lawsChange">法规变迁</a>
              </span> -->
            </el-col>
          </el-row>

          <el-row>
            <el-col class="radio_main_wrap">
              <ul>
                <li class="radio_qing_mo">
				  	<template>
						<el-radio-group v-model="inquiryMode">
							<template v-if="select == '1'">
								<el-radio label="0" disabled>精确</el-radio>
								<el-radio label="1" disabled>模糊</el-radio>
							</template>
							<template v-if="select == 'title'">
								<el-radio label="0" >精确</el-radio>
								<el-radio label="1" >模糊</el-radio>
							</template>
							<template v-if="select == 'fulltext'">
								<el-radio label="0" >精确</el-radio>
								<el-radio label="1" >模糊</el-radio>
							</template>
						</el-radio-group>
					</template>
                </li>
				<template v-if="select != 'DocumentNO'">
					<li class=""><el-divider direction="vertical"></el-divider></li>
				</template>

                <li class="radio_qing_mo">
					<template>
						<el-radio-group v-model="rangeType">
							<template v-if="select == '1'">
								<el-radio  label="" disabled>同篇</el-radio>
								<!-- <el-radio  label="2" disabled>同条</el-radio> -->
								<el-radio  label="0" disabled>同段</el-radio>
								<el-radio  label="1" disabled>同句</el-radio>
							</template>
							<template v-if="select == 'title'">
								<el-radio  label="" disabled>同篇</el-radio>
								<!-- <el-radio  label="2" disabled>同条</el-radio> -->
								<el-radio  label="0" disabled>同段</el-radio>
								<el-radio  label="1" disabled>同句</el-radio>
							</template>
							<template v-if="select == 'fulltext'">
								<el-radio  label="" >同篇</el-radio>
								<!-- <el-radio  label="2" >同条</el-radio> -->
								<el-radio  label="0" >同段</el-radio>
								<el-radio  label="1" >同句</el-radio>
							</template>
						</el-radio-group>
					</template>

                </li>
                <!-- <li class="fuzzy_wrap">&nbsp;</li>
							  <li class="radio_qing_mo">
                 路径跳转而已
                  <a href="#/lawsChange">法规变迁</a>
                </li>-->
              </ul>
            </el-col>
          </el-row>
          <el-row class="tab_nav_wrap">
            <el-menu
              default-active="chl"
              class="el-menu-vertical-demo"
              background-color="#fff"
              text-color="#666"
              active-text-color="#065d9d"
              mode="horizontal"
              @select="selectIndex"
            >
              <el-menu-item index="chl">
                <span slot="title">中央法规 ({{navbarVal.chl}})</span>
              </el-menu-item>
              <el-menu-item index="lar">
                <span slot="title">地方法规({{navbarVal.lar}})</span>
              </el-menu-item>
              <el-submenu index="protocol">
                <template slot="title">立法资料</template>
                <el-menu-item index="protocol" style="color:#5c79b0;">草案({{navbarVal.protocol}})</el-menu-item>
                <el-menu-item
                  index="lawexplanation"
                  style="color:#5c79b0;"
                >法规解读({{navbarVal.lawexplanation}})</el-menu-item>
                <el-menu-item index="whitebook" style="color:#5c79b0;">白皮书({{navbarVal.whitebook}})</el-menu-item>
                <el-menu-item
                  index="workreport"
                  style="color:#5c79b0;"
                >工作报告({{navbarVal.workreport}})</el-menu-item>
              </el-submenu>
              <el-menu-item index="legislation">
                <span slot="title">立法计划({{navbarVal.legislation}})</span>
              </el-menu-item>
              <el-menu-item index="eagn">
                <span slot="title">中外条约({{navbarVal.eagn}})</span>
              </el-menu-item>
              <el-menu-item index="iel">
                <span slot="title">外国法规({{navbarVal.iel}})</span>
              </el-menu-item>
              <el-menu-item index="hkd">
                <span slot="title">香港法规({{navbarVal.hkd}})</span>
              </el-menu-item>
              <el-menu-item index="aom">
                <span slot="title">澳门法规({{navbarVal.aom}})</span>
              </el-menu-item>
              <el-menu-item index="twd">
                <span slot="title">台湾法规({{navbarVal.twd}})</span>
              </el-menu-item>
            </el-menu>
          </el-row>
          <el-row>
            <div class="breadcrumb">
              <span>
                <a href="#/">首页</a>
              </span>
              <span>
                <i>></i>
                <a href="#/lawsNew">{{secondName}}</a>
              </span>
            </div>
            <div class="jians_conditions_wrap" v-if="searchKeywordArr.length > 0 || queryWord.filterList.length > 0">
              <div class="jians_conditions">
                <div class="conditions_left">检索条件：</div>
                <div class="conditions_right">
                  <ul>
                    <li
                      class="search_txt_item"
                      v-for="(item,index) in searchKeywordArr"
                      :key="index"
                    >
                    <template v-if="select == 1">
                      <span @click="searchHistoryItem($event)">标题+发文字号 : {{item}}</span>
                    </template>
                    <template v-if="select == 'title'">
                      <span @click="searchHistoryItem($event)">标题 : {{item}}</span>
                    </template>
                    <template v-if="select == 'fulltext'">
                      <span @click="searchHistoryItem($event)">全文 : {{item}}</span>
                    </template>
                    <template v-if="select == 'DocumentNO'">
                      <span @click="searchHistoryItem($event)">发文字号 : {{item}}</span>
                    </template>
                      <i class="el-icon-error error_item" @click="clearHistoryItem(item,index)"></i>
                    </li>
                    <li
                      class="search_txt_item"
                      v-for="(item,index) in queryWord.filterList"
                      :key="index"
                    >
                      <template v-if="item.field == 'EffectivenessDic'">
                        <span>效力级别：{{item.name}}</span>
                      </template>
                      <template v-if="item.field == 'IssueDepartment'">
                        <span v-if="tab_nav_select == 'eagn'">国家与国际组织：{{item.name}}</span>
                        <span v-else-if="tab_nav_select == 'iel'">相关组织：{{item.name}}</span>
                        <span v-else>发布部门：{{item.name}}</span>
                      </template>
                      <template v-if="item.field == 'TimelinessDic'">
                        <span>时效性：{{item.name}}</span>
                      </template>
                      <template v-if="item.field == 'Category'">

                        <span v-if="tab_nav_select == 'legislation'">类别：{{item.name}}</span>
                        <span v-else-if="tab_nav_select == 'eagn'">条约分类：{{item.name}}</span>
                        <span v-else-if="tab_nav_select == 'iel'">条约分类：{{item.name}}</span>
                        <span v-else>法规类别：{{item.name}}</span>
                      </template>
                      <template v-if="item.field == 'RangeOf'">
                        <span>所属范围：{{item.name}}</span>
                      </template>
                      <template v-if="item.field == 'SolicitationState'">
                        <span>征集状态：{{item.name}}</span>
                      </template>
                      <template v-if="item.field == 'LevelGrade'">
                        <span>级别：{{item.name}}</span>
                      </template>

                      <template v-if="item.field == 'Kind'">
                        <span>条约种类：{{item.name}}</span>
                      </template>
                      <template v-if="item.field == 'LawCategory'">
                        <span>法规分类：{{item.name}}</span>
                      </template>
                       <template v-if="item.field == 'RegulationOrder'">
                        <span>法规位阶：{{item.name}}</span>
                      </template>
                      <template v-if="item.field == 'ValidState'">
                        <span>有效状态：{{item.name}}</span>
                      </template>

                      <i class="el-icon-error error_item" @click="clearHistoryItem02(item,index)"></i>
                    </li>
                  </ul>
                </div>
                <div
                  class="conditions_icon_clean"
                  v-if="searchKeywordArr.length > 0 || queryWord.filterList.length > 0"
                  @click="clearHistory"
                >
                  <i class="el-icon-delete"></i>清空
                </div>
              </div>
            </div>
          </el-row>
        </div>
        <div
          class="center_wrap"
          v-loading="fullscreenLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0)"
        >
          <el-container v-if="chlShow">
            <el-aside width="300px;" style="background-color:#fff;">
              <div v-for="(item, siderBarNum) in resData.sidebar" :key="siderBarNum">
                <sider-bar :siderData="item" :siderBarNum="siderBarNum" @secondmenu="secondMenu"></sider-bar>
              </div>
            </el-aside>
            <el-main class="center_el_main">
              <div id="textExample">法律法规</div>
              <!-- <div class="total_wrap">
                总共检索到
                <span class="total">{{totalNum}}</span>篇
              </div> -->
              <div id="filerSelect" >
                <div class="filerSelect_ul_left_checkAll">
                    <!-- <p class="checkAll_wrap" >
                      <el-checkbox  v-model="checkAllState" @change="checkAllChange">全选</el-checkbox>
                    </p>
                    <p class="piliangdelete" @click="downFilesAll">
                      <i class="iconfont" style="margin-right:5px;">&#xe65a;</i>批量下载
                    </p> -->
                    总共检索到
                    <span class="total" style="color:#f35c0a;"> {{totalNum}} </span>篇
                </div>
                <ul class="filerSelect_ul" v-if="queryWord.index != 'hkd'" id="filerSelect_ul_sort_wrap">
                  <template v-if="queryWord.index == 'chl' || queryWord.index == 'lar'">
                    <li class="fen_group">
                      <label for>分组：</label>
                      <el-select
                        v-model="queryWord.groupByIndex"
                        placeholder="分组"
                        @change="((item)=>{changeGroupOrTime(item)})"
                      >
                        <el-option
                          v-for="item in filerSelect_group_arr"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </li>

                    <li class="sort_wrao_select">
                      <label for="sort_select">排序：</label>
                      <el-select
                        v-model="queryWord.orderByIndex"
                        placeholder="排序"
                        @change="((item)=>{changeSort(item)})"
                        id="sort_select"
                      >
                        <el-option
                          v-for="item in filerSelect_sort_arr"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </li>
                  </template>
                  <template
                    v-if="queryWord.index == 'workreport' || queryWord.index == 'whitebook'
                  || queryWord.index == 'lawexplanation' || queryWord.index == 'protocol' || queryWord.index == 'legislation'
                  || queryWord.index == 'twd'"
                  >
                    <li class="sort_wrao_select">
                      <label for="sort_select">排序：</label>
                      <el-select
                        v-model="queryWord.orderByIndex"
                        placeholder="排序"
                        @change="((item)=>{changeSort(item)})"
                        id="sort_select"
                      >
                        <el-option
                          v-for="item in filerSelect_sort_arr01"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </li>
                  </template>
                  <template v-if="queryWord.index == 'eagn'">
                    <li class="sort_wrao_select">
                      <label for="sort_select">排序：</label>
                      <el-select
                        v-model="queryWord.orderByIndex"
                        placeholder="排序"
                        @change="((item)=>{changeSort(item)})"
                        id="sort_select"
                      >
                        <el-option
                          v-for="item in filerSelect_sort_arr02"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </li>
                  </template>
                  <template v-if="queryWord.index == 'iel'">
                    <li class="sort_wrao_select">
                      <label for="sort_select">排序：</label>
                      <el-select
                        v-model="queryWord.orderByIndex"
                        placeholder="排序"
                        @change="((item)=>{changeSort(item)})"
                        id="sort_select"
                      >
                        <el-option
                          v-for="item in filerSelect_sort_arr03"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </li>
                  </template>
                  <template v-if="queryWord.index == 'aom'">
                    <li class="sort_wrao_select">
                      <label for="sort_select">排序：</label>
                      <el-select
                        v-model="queryWord.orderByIndex"
                        placeholder="排序"
                        @change="((item)=>{changeSort(item)})"
                        id="sort_select"
                      >
                        <el-option
                          v-for="item in filerSelect_sort_arr04"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </li>
                  </template>
                </ul>
              </div>
              <template v-if="queryWord.groupByIndex != 2">
                <!-- {{totalNum}}cc -->
                <!-- <template v-if="resData.maincontent != undefined"> -->
                <div v-if="totalNum <= 0">
                  <div class="no_data_wrap">
                    <img :src="no_data_logo" alt="未查询到相关数据" />
                    <p class="one">未查询到相关数据</p>
                    <p class="two">建议您修改相关查询条件重新查询</p>
                  </div>
                </div>
                <!-- </template> -->
                <template v-if="totalNum > 0">
                  <div v-for="(item,index) in resData.maincontent[0].group" :key="index">
                    <law-content
                      :maincontent="item"
                      :select="select"
                      :keyword="keyword"
                      :dataIndex="index"
                      :contentIndex="resData.maincontent[0].index"
                      :pagesize="queryWord.size"
                      :pagecount="queryWord.page"
                      :defalutNum="defalutNum"
                      @changePagination="changePagination"
                      @compareNum="compareNumCriminal"
                      :checkAllState="checkAllState"
                      :checkAllList="checkAllList"
                      @isCheckOne="isCheckOne"
                    ></law-content>
                  </div>
                </template>
              </template>
              <template v-if="queryWord.groupByIndex == 2">
                <div v-if="totalNum <= 0">
                  <div class="no_data_wrap">
                    <img :src="no_data_logo" alt="未查询到相关数据" />
                    <p class="one">未查询到相关数据</p>
                    <p class="two">建议您修改相关查询条件重新查询</p>
                  </div>
                </div>
                <div v-if="totalNum > 0">
                  <law-nogroup
                    :maincontent="resData.maincontent[0]"
                    :pagesize="queryWord.size"
                    :pagecount="queryWord.page"
                    :keyword="keyword"
                    :select="select"
                    @changePagination="compareNumchl"
                    :checkAllState="checkAllState"
                    :checkAllList="checkAllList"
                    @isCheckOne="isCheckOne"
                  ></law-nogroup>
                </div>
              </template>
            </el-main>
          </el-container>
          <el-container v-if="!chlShow">
            <el-aside width="300px" style="background-color:#fff;">
              <cricase-siderbar
                :siderData="cricaseResData.sidebar"
                :dataItem="cricaseQueryWord.item"
                @secondmenu="cricaseSecondMenu"
              ></cricase-siderbar>
            </el-aside>
            <el-main style="padding: 0 0 20px;">
              <template v-if="GroupShow&&cricaseResData.maincontent[0].group.length>0">
                <div v-for="(item,index) in cricaseResData.maincontent[0].group" :key="index">
                  <law-content
                    :index="index"
                    :maincontent="item"
                    :contentIndex="cricaseResData.maincontent[0].index"
                    :pagesize="cricaseQueryWord.size"
                    :pagecount="cricaseQueryWord.page"
                    :defalutNum="defalutNum"
                    @compareNum="compareNum"
                    @changePagination="cricaseChangePagination"
                    v-if="defalutNum==-1||defalutNum==index"
                  ></law-content>
                </div>
              </template>
              <template v-else>
                <law-nogroup
                  :maincontent="cricaseResData.maincontent[0]"
                  :pagesize="queryWord.size"
                  :pagecount="queryWord.page"
                  @changePagination="cricaseChangePagination"
                ></law-nogroup>
              </template>
            </el-main>
          </el-container>
        </div>
      </div>

      <!-- 高级检索模态框 -->
      <el-dialog title="高级检索" :visible.sync="advancedVisible" class="gaoji_search_dialog lawNew_search_dialog">
        <el-form
          :inline="true"
          class="advanced_form lawsNew_dialog_form_wrap"
          ref="advancedForm"
          :model="advancedForm"
          label-width="80px"
        >
          <template
            id="dialog-one"
            v-if="tab_nav_select != 'eagn' && tab_nav_select != 'iel' && tab_nav_select != 'hkd' && tab_nav_select != 'aom' && tab_nav_select != 'twd'"
          >
            <el-form-item label="标题" prop="keyword">
              <el-input v-model="advancedForm.keyword"
              @change="((item)=>{setTagJson(item,'000',false,'Title')})"
              ></el-input>
            </el-form-item>
            <el-form-item label="全文" prop="CheckFullText">
              <el-input
                v-model="advancedForm.CheckFullText"
                @change="((item)=>{setTagJson(item,'011',false,'CheckFullText')})"
              ></el-input>
			  	<div class="rangeType_wrap">
				  <template>
						<el-radio-group v-model="rangeType">
							<template v-if="tab_nav_select == 'chl' || tab_nav_select == 'lar'">
								<el-radio  label="" >同篇</el-radio>
								<!-- <el-radio  label="2" >同条</el-radio> -->
								<el-radio  label="0" >同段</el-radio>
								<el-radio  label="1" >同句</el-radio>
							</template>
							<template v-if="tab_nav_select != 'chl' && tab_nav_select != 'lar'">
								<el-radio  label="" >同篇</el-radio>
								<el-radio  label="0" >同段</el-radio>
								<el-radio  label="1" >同句</el-radio>
							</template>
						</el-radio-group>
				  </template>
			  	</div>
            </el-form-item>
            <el-form-item label="发布部门" prop="IssueDepartment">
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.IssueDepartment"
                @change="((item)=>{setTagJson(item,'002',false,'IssueDepartment')})"
              >
                <el-option
                  v-for="(item,index) in IssueDepartmentArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="发文字号"
              prop="DocumentNO"
              v-if="tab_nav_select!='whitebook' && tab_nav_select!='workreport'"
            >
              <el-input
                v-model="advancedForm.DocumentNO"
                @change="((item)=>{setTagJson(item,'001',false,'DocumentNO')})"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="批准部门"
              prop="RatifyDepartment"
              v-if="tab_nav_select!='protocol' && tab_nav_select!='lawexplanation' &&
            tab_nav_select!='whitebook' && tab_nav_select!='workreport' && tab_nav_select!='legislation'"
            >
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.RatifyDepartment"
                @change="((item)=>{setTagJson(item,'003',false,'RatifyDepartment')})"
              >
                <!-- <el-option value="5" label="XA01" fieldname="IssueDepartment"></el-option>
                <el-option value="XA0105" label="XA0105"></el-option>-->
                <el-option
                  v-for="(item,index) in RatifyDepartmentArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="批准日期"
              prop="RatifyDate"
              class="date_input"
              v-if="tab_nav_select!='protocol' && tab_nav_select!='lawexplanation' &&
            tab_nav_select!='whitebook' && tab_nav_select!='workreport' && tab_nav_select!='legislation'"
            >
              <el-date-picker
                v-model="advancedForm.RatifyDate"
                value-format="yyyy.MM.dd"
                format="yyyy.MM.dd"
                type="daterange"
                @change="((item)=>{setTagJson(item,'004',true,'RatifyDate')})"
                range-separator="至"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="发布日期" prop="IssueDate" class="date_input">
              <el-date-picker
                v-model="advancedForm.IssueDate"
                value-format="yyyy.MM.dd"
                format="yyyy.MM.dd"
                type="daterange"
                @change="((item)=>{setTagJson(item,'005',true,'IssueDate')})"
                range-separator="至"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              label="实施日期"
              prop="ImplementDate"
              class="date_input"
              v-if="tab_nav_select!='protocol' && tab_nav_select!='lawexplanation' && tab_nav_select!='whitebook' && tab_nav_select!='workreport'"
            >
              <el-date-picker
                v-model="advancedForm.ImplementDate"
                value-format="yyyy.MM.dd"
                format="yyyy.MM.dd"
                type="daterange"
                @change="((item)=>{setTagJson(item,'006',true,'ImplementDate')})"
                range-separator="至"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              label="截止日期"
              prop="ExpirationDate"
              class="date_input"
              v-if="tab_nav_select=='protocol'"
            >
              <el-date-picker
                v-model="advancedForm.ExpirationDate"
                value-format="yyyy.MM.dd"
                format="yyyy.MM.dd"
                type="daterange"
                @change="((item)=>{setTagJson(item,'006',true,'ExpirationDate')})"
                range-separator="至"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              label="时效性"
              prop="TimelinessDic"
              v-if="tab_nav_select!='protocol' && tab_nav_select!='lawexplanation' && tab_nav_select!='whitebook' && tab_nav_select!='workreport'"
            >
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.TimelinessDic"
                @change="((item)=>{setTagJson(item,'007',false,'TimelinessDic')})"
              >
                <el-option
                  v-for="(item,index) in TimelinessDicArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="专题"
              prop="Specialtopic"
              v-if="tab_nav_select!='protocol' && tab_nav_select!='lawexplanation' &&
            tab_nav_select!='whitebook' && tab_nav_select!='workreport' && tab_nav_select!='legislation'"
            >
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.Specialtopic"
                @change="((item)=>{setTagJson(item,'008',false,'Specialtopic')})"
              >
                <!-- <el-option value="0" label="全部"></el-option> -->
                <el-option
                  v-for="(item,index) in SpecialtopicArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="效力级别"
              prop="EffectivenessDic"
              v-if="tab_nav_select!='whitebook' && tab_nav_select!='workreport' && tab_nav_select!='legislation'"
            >
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.EffectivenessDic"
                @change="((item)=>{setTagJson(item,'009',false,'EffectivenessDic')})"
              >
                <!-- <el-option value="XA01" label="XA01" fieldname="EffectivenessDic"></el-option>
                <el-option value="XA0105" label="XA0105"></el-option>-->
                <el-option
                  v-for="(item,index) in EffectivenessDicArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="法规类别"
              prop="Category"
              v-if="tab_nav_select!='protocol' && tab_nav_select!='lawexplanation' &&
            tab_nav_select!='whitebook' && tab_nav_select!='workreport' && tab_nav_select!='legislation'"
            >
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.Category"
                @change="((item)=>{setTagJson(item,'010',false,'Category')})"
              >
                <el-option
                  v-for="(item,index) in CategoryArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="所属范围"
              prop="RangeOf"
              v-if="tab_nav_select=='protocol' || tab_nav_select=='lawexplanation'"
            >
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.RangeOf"
                @change="((item)=>{setTagJson(item,'010',false,'RangeOf')})"
              >
                <el-option
                  v-for="(item,index) in RangeOfArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="征集状态" prop="SolicitationState" v-if="tab_nav_select=='protocol'">
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.SolicitationState"
                @change="((item)=>{setTagJson(item,'010',false,'SolicitationState')})"
              >
                <el-option
                  v-for="(item,index) in SolicitationStateArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
          <div id="dialog-two" v-if="tab_nav_select == 'eagn'">
            <el-form-item label="标题" prop="keyword" class="eagn_label">
              <el-input v-model="advancedForm.keyword"></el-input>
            </el-form-item>
            <el-form-item label="全文" prop="CheckFullText" style="margin-right: 10px;">
              <el-input
                v-model="advancedForm.CheckFullText"
                @change="((item)=>{setTagJson(item,'011',false,'CheckFullText')})"
              ></el-input>
              	<div class="rangeType_wrap">
                  <template>
                    <el-radio-group v-model="rangeType">
                        <el-radio  label="" style="width:inherit !important;">同篇</el-radio>
                        <el-radio  label="0"  style="width:inherit !important;">同段</el-radio>
                        <el-radio  label="1"  style="width:inherit !important;">同句</el-radio>
                    </el-radio-group>
                  </template>
                </div>
            </el-form-item>
            <el-form-item label="签订日期" prop="IssueDate" class="date_input eagn_label">
              <el-date-picker
                v-model="advancedForm.IssueDate"
                value-format="yyyy.MM.dd"
                format="yyyy.MM.dd"
                type="daterange"
                @change="((item)=>{setTagJson(item,'006',true,'IssueDate')})"
                range-separator="至"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="国家与国际组织" prop="IssueDepartment" style="margin-right: 10px;">
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.IssueDepartment"
                @change="((item)=>{setTagJson(item,'010',false,'IssueDepartment')})"
              >
                <el-option
                  v-for="(item,index) in IssueDepartmentArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="批准日期" prop="RatifyDate" class="date_input eagn_label">
              <el-date-picker
                v-model="advancedForm.RatifyDate"
                value-format="yyyy.MM.dd"
                format="yyyy.MM.dd"
                type="daterange"
                @change="((item)=>{setTagJson(item,'006',true,'RatifyDate')})"
                range-separator="至"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="批准机关:" prop="RatifyDepartment" style="margin-right: 10px;">
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.RatifyDepartment"
                @change="((item)=>{setTagJson(item,'010',false,'RatifyDepartment')})"
              >
                <el-option
                  v-for="(item,index) in RatifyDepartmentArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生效日期" prop="ImplementDate" class="date_input eagn_label">
              <el-date-picker
                v-model="advancedForm.ImplementDate"
                value-format="yyyy.MM.dd"
                format="yyyy.MM.dd"
                type="daterange"
                @change="((item)=>{setTagJson(item,'006',true,'ImplementDate')})"
                range-separator="至"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              label="类别"
              prop="Category"
              v-if="tab_nav_select=='protocol' || tab_nav_select=='lawexplanation' || tab_nav_select=='workreport' || tab_nav_select=='legislation'"
            >
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.Category"
                @change="((item)=>{setTagJson(item,'010',false,'Category')})"
              >
                <el-option
                  v-for="(item,index) in CategoryArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="条约分类:" prop="Category" style="margin-right: 10px;">
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.Category"
                @change="((item)=>{setTagJson(item,'010',false,'Category')})"
              >
                <el-option
                  v-for="(item,index) in CategoryArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="条约种类" prop="Kind" class="eagn_label">
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.Kind"
                @change="((item)=>{setTagJson(item,'010',false,'Kind')})"
              >
                <el-option
                  v-for="(item,index) in KindArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="广泛熟知的条约" prop="KnowWell" style="margin-right: 10px;">
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.KnowWell"
                @change="((item)=>{setTagJson(item,'010',false,'KnowWell')})"
              >
                <el-option
                  v-for="(item,index) in KnowWellArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div id="el-dialog_three" v-if="tab_nav_select == 'iel'">
            <el-form-item label="标题" prop="keyword">
              <el-input v-model="advancedForm.keyword"></el-input>
            </el-form-item>
            <el-form-item label="全文" prop="CheckFullText">
              <el-input
                v-model="advancedForm.CheckFullText"
                @change="((item)=>{setTagJson(item,'011',false,'CheckFullText')})"
              ></el-input>
              <div class="rangeType_wrap">
                  <template>
                    <el-radio-group v-model="rangeType">
                        <el-radio  label="" >同篇</el-radio>
                        <el-radio  label="0" >同段</el-radio>
                        <el-radio  label="1" >同句</el-radio>
                    </el-radio-group>
                  </template>
                </div>
            </el-form-item>
            <el-form-item label="相关组织" prop="IssueDepartment">
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.IssueDepartment"
                @change="((item)=>{setTagJson(item,'010',false,'IssueDepartment')})"
              >
                <el-option
                  v-for="(item,index) in IssueDepartmentArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="颁布日期" prop="IssueDate" class="date_input">
              <el-date-picker
                v-model="advancedForm.IssueDate"
                value-format="yyyy.MM.dd"
                format="yyyy.MM.dd"
                type="daterange"
                @change="((item)=>{setTagJson(item,'006',true,'IssueDate')})"
                range-separator="至"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="生效日期" prop="ImplementDate" class="date_input">
              <el-date-picker
                v-model="advancedForm.ImplementDate"
                value-format="yyyy.MM.dd"
                format="yyyy.MM.dd"
                type="daterange"
                @change="((item)=>{setTagJson(item,'006',true,'ImplementDate')})"
                range-separator="至"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="类别" prop="Category">
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.Category"
                @change="((item)=>{setTagJson(item,'010',false,'Category')})"
              >
                <el-option
                  v-for="(item,index) in CategoryArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div id="dialog_hkd" v-if="tab_nav_select == 'hkd'">
            <el-form-item label="标题" prop="keyword">
              <el-input v-model="advancedForm.keyword"></el-input>
            </el-form-item>
            <el-form-item label="全文" prop="CheckFullText">
              <el-input
                v-model="advancedForm.CheckFullText"
                @change="((item)=>{setTagJson(item,'011',false,'CheckFullText')})"
              ></el-input>
              <div class="rangeType_wrap">
                  <template>
                    <el-radio-group v-model="rangeType">
                        <el-radio  label="" >同篇</el-radio>
                        <el-radio  label="0" >同段</el-radio>
                        <el-radio  label="1" >同句</el-radio>
                    </el-radio-group>
                  </template>
                </div>
            </el-form-item>
            <el-form-item label="英文标题" prop="TitleEn">
              <el-input
                v-model="advancedForm.TitleEn"
                @change="((item)=>{setTagJson(item,'001',false,'TitleEn')})"
              ></el-input>
            </el-form-item>
            <el-form-item label="英文全文" prop="TitleEn">
              <el-input
                v-model="advancedForm.TitleEn"
                @change="((item)=>{setTagJson(item,'001',false,'TitleEn')})"
              ></el-input>
            </el-form-item>
            <el-form-item label="法规分类" prop="Category">
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.Category"
                @change="((item)=>{setTagJson(item,'010',false,'Category')})"
              >
                <el-option
                  v-for="(item,index) in CategoryArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时效性" prop="TimelinessDic">
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.TimelinessDic"
                @change="((item)=>{setTagJson(item,'007',false,'TimelinessDic')})"
              >
                <el-option
                  v-for="(item,index) in TimelinessDicArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="颁布日期" prop="Date" class="date_input">
              <el-date-picker
                v-model="advancedForm.Date"
                value-format="yyyy.MM.dd"
                format="yyyy.MM.dd"
                type="daterange"
                @change="((item)=>{setTagJson(item,'006',true,'Date')})"
                range-separator="至"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div id="dialog_aom" v-if="tab_nav_select == 'aom'">
            <el-form-item label="标题:" prop="keyword">
              <el-input v-model="advancedForm.keyword"></el-input>
            </el-form-item>
            <el-form-item label="全文:" prop="CheckFullText">
              <el-input
                v-model="advancedForm.CheckFullText"
                @change="((item)=>{setTagJson(item,'011',false,'CheckFullText')})"
              ></el-input>
              <div class="rangeType_wrap">
                  <template>
                    <el-radio-group v-model="rangeType">
                        <el-radio  label="" >同篇</el-radio>
                        <el-radio  label="0" >同段</el-radio>
                        <el-radio  label="1" >同句</el-radio>
                    </el-radio-group>
                  </template>
                </div>
            </el-form-item>
            <el-form-item label="法规分类" prop="LawCategory">
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.LawCategory"
                @change="((item)=>{setTagJson(item,'010',false,'LawCategory')})"
              >
                <el-option
                  v-for="(item,index) in LawCategoryArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类别:" prop="Category">
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.Category"
                @change="((item)=>{setTagJson(item,'010',false,'Category')})"
              >
                <el-option
                  v-for="(item,index) in CategoryArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="相关信息:" prop="Relevance">
              <el-select
              filterable
                placeholder="请选择"
                v-model="advancedForm.Relevance"
                @change="((item)=>{setTagJson(item,'010',false,'Relevance')})"
              >
                <el-option
                  v-for="(item,index) in RelevanceArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item label="刊登日期:" prop="IssueDate" class="date_input">
              <el-date-picker
                v-model="advancedForm.IssueDate"
                value-format="yyyy.MM.dd"
                format="yyyy.MM.dd"
                type="daterange"
                @change="((item)=>{setTagJson(item,'006',true,'IssueDate')})"
                range-separator="至"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="相关信息:" prop="Relevance">
              <el-input
                v-model="advancedForm.Relevance"
                @change="((item)=>{setTagJson(item,'011',false,'Relevance')})"
              ></el-input>
            </el-form-item>
          </div>
          <div id="dialog_twd" v-if="tab_nav_select == 'twd'">
            <el-form-item label="标题:" prop="keyword">
              <el-input v-model="advancedForm.keyword"></el-input>
            </el-form-item>
            <el-form-item label="全文:" prop="CheckFullText">
              <el-input
                v-model="advancedForm.CheckFullText"
                @change="((item)=>{setTagJson(item,'011',false,'CheckFullText')})"
              ></el-input>
              <div class="rangeType_wrap">
                  <template>
                    <el-radio-group v-model="rangeType">
                        <el-radio  label="" style="width:inherit !important;">同篇</el-radio>
                        <el-radio  label="0"  style="width:inherit !important;">同段</el-radio>
                        <el-radio  label="1"  style="width:inherit !important;">同句</el-radio>
                    </el-radio-group>
                  </template>
                </div>
            </el-form-item>
            <el-form-item label="有效状态" prop="ValidState">
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.ValidState"
                @change="((item)=>{setTagJson(item,'010',false,'ValidState')})"
              >
                <el-option
                  v-for="(item,index) in ValidStateArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发布日期" prop="ReleaseDate" class="date_input">
              <el-date-picker
                v-model="advancedForm.ReleaseDate"
                value-format="yyyy.MM.dd"
                format="yyyy.MM.dd"
                type="daterange"
                @change="((item)=>{setTagJson(item,'006',true,'ReleaseDate')})"
                range-separator="至"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="修正日期" prop="ReviseDate" class="date_input">
              <el-date-picker
                v-model="advancedForm.ReviseDate"
                value-format="yyyy.MM.dd"
                format="yyyy.MM.dd"
                type="daterange"
                @change="((item)=>{setTagJson(item,'006',true,'ReviseDate')})"
                range-separator="至"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="废止日期" prop="AbolitionDate" class="date_input">
              <el-date-picker
                v-model="advancedForm.AbolitionDate"
                value-format="yyyy.MM.dd"
                format="yyyy.MM.dd"
                type="daterange"
                @change="((item)=>{setTagJson(item,'006',true,'AbolitionDate')})"
                range-separator="至"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="法规类别" prop="Category">
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.Category"
                @change="((item)=>{setTagJson(item,'010',false,'Category')})"
              >
                <el-option
                  v-for="(item,index) in CategoryArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="法规位阶:" prop="RegulationOrder">
              <el-select
                filterable
                placeholder="请选择"
                v-model="advancedForm.RegulationOrder"
                @change="((item)=>{setTagJson(item,'010',false,'RegulationOrder')})"
              >
                <el-option
                  v-for="(item,index) in RegulationOrderArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发文字号" prop="DocumentNO">
              <el-input
                v-model="advancedForm.DocumentNO"
                @change="((item)=>{setTagJson(item,'001',false,'DocumentNO')})"
              ></el-input>
            </el-form-item>
            <el-form-item label="发文单位" prop="Department">
              <el-input
                v-model="advancedForm.Department"
                @change="((item)=>{setTagJson(item,'001',false,'Department')})"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="发文单位:" prop="Department">
              <el-select
              filterable
                placeholder="请选择"
                v-model="advancedForm.Department"
                @change="((item)=>{setTagJson(item,'010',false,'Department')})"
              >
                <el-option
                  v-for="(item,index) in DepartmentArr"
                  :key="item.itemkey"
                  :value="item.itemkey"
                  :label="item.itemname"
                ></el-option>
              </el-select>
            </el-form-item>-->
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="advancedSearch('advancedForm')">检 索</el-button>
          <el-button @click="resetForm('advancedForm')">重 置</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import siderBar from "@/components/siderBar.vue";
import cricaseSiderbar from "@/components/cricaseSiderBar.vue";
import lawContent from "@/components/lawContent.vue";
import lawNogroup from "@/components/lawNogroup.vue";
import Publichead from "@/components/headerCommon";
import { getZYLawSelect ,Download} from "../select_api";
import { showKeyWordHistory,showLikeQuery ,hotKeywordQuery,addKeyWordHistory,getAggs, getCases, addSearch, getJSON, getCollectList } from "../api";
export default {
  name: "index",
  components: {
    siderBar,
    lawContent,
    lawNogroup,
    cricaseSiderbar,
    Publichead
  },
  data() {
    return {
      type:"law",
      selectStatus:false,
       // 全选
      checkAllState:false,
      checkAllList:[],//全选
      checkAllListArr:[],//全选
      checkAllListJson:{},//全选
      keywordsDrop:[],

      searchTypeOfManyWorld:false,
		rangeType: "", //同段:0; 同句:1 空 默认同篇
		inquiryMode:"",//模糊 精确:0 查询:1


      showPrise: false,//是否展示结果中检索按钮
      showRentPrise: false,
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
      fullscreenLoading: true,
      totalNum: 10,
      // paginationShow:false,
      //tab切换
      tab_nav_select: "chl",
      no_data_logo: "../static/img/no_data.png",
      //是否模糊查询 2 模糊 1精确
      radio_fuzzy: "1",
      radio_type: "",
      headerArr: {
        activeIndex: "lawsNew",
        logo_url: "../../static/img/logoo.png"
      },
      //同义词推荐
      // keyword: '',
      // menu: "",
      // size: 10,
      //热搜推荐
      // keyword: '',
      // menu: "",
      // size: 10,
      // 直达法规
      directRegulationlist: {
        keyword: "",
        index: "",
        size: 10
      },
      // keyword: "",
      // index: "",
      // size: "",
      //直达法条
      // keywords: "",
      // library: "",
      // size: "",
      //分组数据
      filerSelect_group: "0",
      filerSelect_group_arr: [
        {
          value: 0,
          label: "效力级别"
        },
        {
          value: 1,
          label: "时效性"
        },
        {
          value: 2,
          label: "不分组"
        }
      ],
      //排序数据
      filerSelect_sort: "2",
      filerSelect_sort_arr: [
        {
          value: 0,
          label: "↓ 发布日期"
        },
        {
          value: 1,
          label: "↑ 发布日期"
        },
        {
          value: 2,
          label: "↑ 实施日期"
        },
        {
          value: 3,
          label: "↓ 实施日期"
        },
        {
          value: 4,
          label: "↓ 引用量"
        },
        {
          value: 5,
          label: "↓ 相关度"
        }
      ],
      filerSelect_sort_arr01: [
        {
          value: 0,
          label: "↓ 发布日期"
        },
        {
          value: 1,
          label: "↑ 发布日期"
        }
      ],
      filerSelect_sort_arr02: [
        //签订日期
        {
          value: 0,
          label: "↓ 签订日期"
        },
        {
          value: 1,
          label: "↑ 签订日期"
        }
      ],
      filerSelect_sort_arr03: [
        //颁布日期
        {
          value: 0,
          label: "↓ 颁布日期"
        },
        {
          value: 1,
          label: "↑ 颁布日期"
        }
      ],
      filerSelect_sort_arr04: [
        //刊登日期
        {
          value: 0,
          label: "↓ 刊登日期"
        },
        {
          value: 1,
          label: "↑ 刊登日期"
        }
      ],
      // 是否高级检索
      searchType: false,
      // 模态框是够显示 默认 不显示
      advancedVisible: false,
      IssueDepartmentArr: [], //发布部门
      RatifyDepartmentArr: [], //批准部门
      SpecialtopicArr: [], //专题
      EffectivenessDicArr: [], //效力级别
      CategoryArr: [], //法规类别
      SolicitationStateArr: [], //范围
      RangeOfArr: [], //搜书范围
      TimelinessDicArr: [],
      select_Special: "1",
      searchKeywordArr: [],
      KnowWellArr: [], //广泛熟知
      KindArr: [], //种类
      LawCategoryArr: [], //澳门
      RelevanceArr: [], //相关信息
      ValidStateArr: [], //有效状态
      RegulationOrderArr: [], //twd
      DepartmentArr: [], //twdbumen
      advancedForm: {
        //刑事法规参数
        scope: "default", //顶部搜索框作用域
        sort: "date", //排序规则
        page: 1, //分页页码
        size: 10, //分页大小，
        index: "chl", //索引标识
        keyword: "", //顶部检索框字段值
        group: true, //是否分组查询(仅中央和地方)
        groupByIndex: 0, //0:效力级别; 1:时效性; 2:不分组
        orderByIndex: 0, //排序规则 0:发布日期倒序; 1:发布日期正序; 2:实施日期正序; 3:实施日期倒叙; 4:引用量倒叙(中央和地方可用)
        title: "", //右下侧结果中检索字段值
        // rangeType: 0, //同段:0; 同句:1
        // inquiryMode: 0, //精确查询:0; 模糊查询:1
        filterList: [],
        modules: [
          1,
          2,
          3 //右下侧结果列表
        ],
        tagJson: [
          // {
          //   "id": "001",
          //   "adv_type": "fuzzy",
          //   "data_type": "text",
          //   "name": "发文字号",
          //   "namelist": [],
          //   "fieldname": "DocumentNO",//字段名称
          //   "min": "",
          //   "max": "",
          //   "itemlist": [],//input内容在这里面
          //   "relatetype": "in",//input要用in
          //   "relatevalue": "",
          //   "searchhistory": ""
          // },
          // {
          //   "id": "002",
          //   "adv_type": "exact",
          //   "data_type": "tag",
          //   "name": "发布部门",
          //   "namelist": [],
          //   "fieldname": "IssueDepartment",
          //   "min": "",
          //   "max": "",
          //   "itemlist": [],//选择的key值 例如3
          //   "relatetype": "or",
          //   "relatevalue": "",
          //   "searchhistory": ""
          // },
          // {
          //   "id": "003",
          //   "adv_type": "exact",
          //   "data_type": "tag",
          //   "name": "批准部门",
          //   "namelist": [],
          //   "fieldname": "RatifyDepartment",
          //   "min": "",
          //   "max": "",
          //   "itemlist": [],//选择的key值 例如3
          //   "relatetype": "or",
          //   "relatevalue": "",
          //   "searchhistory": ""
          // },
          // {
          //   "id": "004",
          //     "adv_type": "condition",
          //     "data_type": "daterange",
          //     "name": "",
          //     "namelist": [],
          //     "fieldname": "RatifyDate",
          //     "min": "",//日期区间最小值
          //     "max": "",//日期区间最大值
          //     "itemlist": [],
          //     "relatetype": "range",
          //     "relatevalue": ""
          // },
          // {
          //   "id": "005",
          //     "adv_type": "condition",
          //     "data_type": "daterange",
          //     "name": "",
          //     "namelist": [],
          //     "fieldname": "IssueDate",//fabu
          //     "min": "",//日期区间最小值
          //     "max": "",//日期区间最大值
          //     "itemlist": [],
          //     "relatetype": "range",
          //     "relatevalue": ""
          // },
          // {
          //   "id": "006",
          //     "adv_type": "condition",
          //     "data_type": "daterange",
          //     "name": "",
          //     "namelist": [],
          //     "fieldname": "ImplementDate",//实施日期
          //     "min": "",//日期区间最小值
          //     "max": "",//日期区间最大值
          //     "itemlist": [],
          //     "relatetype": "range",
          //     "relatevalue": ""
          // },
          // {
          //   "id": "007",
          //   "adv_type": "exact",
          //   "data_type": "tag",
          //   "name": "时效性",
          //   "namelist": [],
          //   "fieldname": "TimelinessDic",
          //   "min": "",
          //   "max": "",
          //   "itemlist": [],//选择的key值 例如3
          //   "relatetype": "or",
          //   "relatevalue": "",
          //   "searchhistory": ""
          // },
          // {
          //   "id": "008",
          //   "adv_type": "exact",
          //   "data_type": "tag",
          //   "name": "专题",
          //   "namelist": [],
          //   "fieldname": "Specialtopic",
          //   "min": "",
          //   "max": "",
          //   "itemlist": [],//选择的key值 例如3
          //   "relatetype": "or",
          //   "relatevalue": "",
          //   "searchhistory": ""
          // },
          // {
          //   "id": "009",
          //   "adv_type": "exact",
          //   "data_type": "tag",
          //   "name": "效力级别",
          //   "namelist": [],
          //   "fieldname": "EffectivenessDic",
          //   "min": "",
          //   "max": "",
          //   "itemlist": [],//选择的key值 例如3
          //   "relatetype": "or",
          //   "relatevalue": "",
          //   "searchhistory": ""
          // },
          // {
          //   "id": "010",
          //   "adv_type": "exact",
          //   "data_type": "tag",
          //   "name": "法规类别",
          //   "namelist": [],
          //   "fieldname": "Category",
          //   "min": "",
          //   "max": "",
          //   "itemlist": [],//选择的key值 例如3
          //   "relatetype": "or",
          //   "relatevalue": "",
          //   "searchhistory": ""
          // },
          // {
          //   "id": "011",
          //   "adv_type": "fuzzy",
          //   "data_type": "longtext",
          //   "name": "全文",
          //   "namelist": [],
          //   "fieldname": "CheckFullText",//字段名称
          //   "min": "",
          //   "max": "",
          //   "itemlist": [],//input内容在这里面
          //   "relatetype": "in",//input要用in
          //   "relatevalue": "",
          //   "searchhistory": ""
          // }
        ],
        DocumentNO: "", //发文字号
        IssueDepartment: "", //发布部门
        RatifyDepartment: "", //批准部门
        RatifyDate: "", //批准日期
        IssueDate: "", //发布日期、签订日期
        ImplementDate: "", //实施日期、生效日期
        ExpirationDate: "", //截止日期
        Specialtopic: "", //专题
        EffectivenessDic: "", //效力级别
        Category: "", //法规类别
        CheckFullText: "", //全文
        CheckFullTextRadio: "1", //全文类别选择
        TimelinessDic: "", //失效
        RangeOf: "", //所属范围
        SolicitationState: "", //征集状态
        Kind: "", //条约中磊
        KnowWell: "",
        TitleEn: "", //英文标题
        Date: "", //颁布日期
        LawCategory: "", //faguileibie
        Relevance: "", //相关
        ValidState: "",
        ReviseDate: "", //修正日期
        ReleaseDate: "", //台湾发布日期
        AbolitionDate: "", //台湾废纸
        RegulationOrder: "",
        Department: ""
      },
      tagJson: [],
      //发布日期排序
      optionspx: [
        {
          value: "date",
          label: "发布日期排序"
        },
        {
          value: "",
          label: "相关度排序"
        }
      ],
      valuepx: "date",
      //筛选条件:发布日期
      optionsfbrq: [
        {
          value: "1",
          label: "近一月"
        },
        {
          value: "2",
          label: "近三月"
        },
        {
          value: "3",
          label: "近半年"
        },
        {
          value: "4",
          label: "近一年"
        },
        {
          value: "-1",
          label: "全部"
        }
      ],
      valuefbrq: "",
      //筛选条件:实施日期
      optionsssrq: [
        {
          value: "1",
          label: "近一月"
        },
        {
          value: "2",
          label: "近三月"
        },
        {
          value: "3",
          label: "近半年"
        },
        {
          value: "4",
          label: "近一年"
        },
        {
          value: "-1",
          label: "全部"
        }
      ],
      valuessrq: "",
      //筛选条件:时效性
      optionssxx: [
        {
          value: "01",
          label: "现行有效"
        },
        {
          value: "02",
          label: "失效"
        },
        {
          value: "03",
          label: "已被修订"
        },
        {
          value: "04",
          label: "尚未生效"
        },
        {
          value: "05",
          label: "部分失效"
        },
        {
          value: "-1",
          label: "全部"
        }
      ],
      valuesxx: "",
      //筛选条件:有效状态
      optionyxzt: [
        {
          value: "01",
          label: "现行"
        },
        {
          value: "02",
          label: "废止"
        },
        {
          value: "-1",
          label: "全部"
        }
      ],
      valueyxzt: "",
      //筛选条件:时效变更
      optionssxbg: [
        {
          value: "1",
          label: "近一月"
        },
        {
          value: "2",
          label: "近三月"
        },
        {
          value: "3",
          label: "近半年"
        },
        {
          value: "4",
          label: "近一年"
        },
        {
          value: "-1",
          label: "全部"
        }
      ],
      valuesxbg: "",
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
      subChoseType: "chl",
      choseType: "chl", //选中的类型
      keyword: "",
      defalutNum: "-1",
      chlShow: true, //刑事法规显示
      GroupShow: true, //专家精实、学说观点显示
      cricaseQueryWord: {
        //裁判专家、专家精释等的请求参数
        index: "cricase",
        field: "CriAccusation",
        item: "",
        scope: "title",
        keyword: "",
        title: "",
        baseFilter: {
          field: "",
          itemkey: ""
        },
        modules: [1, 2, 3],
        page: 1,
        size: 10
      },
      cricaseResData: {
        maincontent: [
          {
            name: "裁判规则",
            index: "cricase",
            total: 2222,
            data: [],
            group: []
          }
        ],
        sidebar: [
          {
            label: "危害国家安全罪",
            value: "00101",
            count: "4",
            children: [
              {
                label: "颠覆国家政权罪",
                value: "0010105",
                count: "1"
              },
              {
                label: "间谍罪",
                value: "0010110",
                count: "1"
              },
              {
                label: "为境外窃取、刺探、收买、非法提供国家秘密、情报罪",
                value: "0010111",
                count: "2"
              }
            ]
          },
          {
            label: "危害公共安全罪",
            value: "00102",
            count: "142",
            children: [
              {
                label: "放火罪",
                value: "0010201",
                count: "6"
              },
              {
                label: "爆炸罪",
                value: "0010203",
                count: "6"
              },
              {
                label: "投放危险物质罪",
                value: "0010204",
                count: "4"
              },
              {
                label: "以危险方法危害公共安全罪",
                value: "0010205",
                count: "17"
              },
              {
                label: "失火罪",
                value: "0010206",
                count: "1"
              },
              {
                label: "过失以危险方法危害公共安全罪",
                value: "0010210",
                count: "1"
              },
              {
                label: "破坏交通设施罪",
                value: "0010212",
                count: "4"
              },
              {
                label: "破坏电力设备罪",
                value: "0010213",
                count: "6"
              },
              {
                label: "劫持船只、汽车罪",
                value: "0010222",
                count: "1"
              },
              {
                label: "暴力危及飞行安全罪",
                value: "0010223",
                count: "1"
              },
              {
                label: "破坏广播电视设施、公用电信设施罪",
                value: "0010224",
                count: "1"
              },
              {
                label: "非法制造、买卖、运输、邮寄、储存枪支、弹药、爆炸物罪",
                value: "0010226",
                count: "22"
              },
              {
                label: "非法制造、买卖、运输、储存危险物质罪",
                value: "0010227",
                count: "2"
              },
              {
                label: "盗窃、抢夺枪支、弹药、爆炸物、危险物质罪",
                value: "0010229",
                count: "3"
              },
              {
                label: "抢劫枪支、弹药、爆炸物、危险物质罪",
                value: "0010230",
                count: "1"
              },
              {
                label: "非法持有、私藏枪支、弹药罪",
                value: "0010231",
                count: "18"
              },
              {
                label: "交通肇事罪",
                value: "0010237",
                count: "19"
              },
              {
                label: "重大责任事故罪",
                value: "0010238",
                count: "7"
              },
              {
                label: "重大劳动安全事故罪",
                value: "0010239",
                count: "2"
              },
              {
                label: "危险物品肇事罪",
                value: "0010240",
                count: "1"
              },
              {
                label: "工程重大安全事故罪",
                value: "0010241",
                count: "1"
              },
              {
                label: "投毒罪",
                value: "0010244",
                count: "2"
              },
              {
                label: "不报、谎报安全事故罪",
                value: "0010249",
                count: "1"
              },
              {
                label: "危险驾驶罪",
                value: "0010250",
                count: "22"
              }
            ]
          },
          {
            label: "破坏社会主义市场经济秩序罪",
            value: "00103",
            count: "316",
            children: [
              {
                label: "生产、销售伪劣商品罪",
                value: "0010301",
                count: "55",
                children: [
                  {
                    label: "生产、销售伪劣产品罪",
                    value: "001030101",
                    count: "26"
                  },
                  {
                    label: "生产、销售假药罪",
                    value: "001030102",
                    count: "9"
                  },
                  {
                    label: "生产、销售不符合卫生标准的食品罪",
                    value: "001030104",
                    count: "3"
                  },
                  {
                    label: "生产、销售有毒、有害食品罪",
                    value: "001030105",
                    count: "17"
                  },
                  {
                    label: "生产、销售不符合安全标准的产品罪",
                    value: "001030107",
                    count: "1"
                  },
                  {
                    label: "生产、销售伪劣农药、兽药、化肥、种子罪",
                    value: "001030108",
                    count: "6"
                  },
                  {
                    label: "生产、销售不符合安全标准的食品罪",
                    value: "001030110",
                    count: "1"
                  }
                ]
              },
              {
                label: "走私罪",
                value: "0010302",
                count: "30",
                children: [
                  {
                    label: "走私武器、弹药罪",
                    value: "001030201",
                    count: "4"
                  },
                  {
                    label: "走私文物罪",
                    value: "001030204",
                    count: "1"
                  },
                  {
                    label: "走私珍贵动物、珍贵动物制品罪",
                    value: "001030206",
                    count: "2"
                  },
                  {
                    label: "走私珍稀植物、珍稀植物制品罪",
                    value: "001030207",
                    count: "1"
                  },
                  {
                    label: "走私普通货物、物品罪",
                    value: "001030209",
                    count: "17"
                  },
                  {
                    label: "走私废物罪",
                    value: "001030210",
                    count: "1"
                  },
                  {
                    label: "走私国家禁止进出口的货物、物品罪",
                    value: "001030212",
                    count: "1"
                  }
                ]
              },
              {
                label: "妨害对公司、企业的管理秩序罪",
                value: "0010303",
                count: "25",
                children: [
                  {
                    label: "虚报注册资本罪",
                    value: "001030301",
                    count: "8"
                  },
                  {
                    label: "虚假出资、抽逃出资罪",
                    value: "001030302",
                    count: "1"
                  },
                  {
                    label: "提供虚假财会报告罪",
                    value: "001030304",
                    count: "3"
                  },
                  {
                    label: "隐匿、故意销毁会计凭证、会计帐簿、财务会计报告罪",
                    value: "001030306",
                    count: "1"
                  },
                  {
                    label: "公司、企业人员受贿罪",
                    value: "001030307",
                    count: "5"
                  },
                  {
                    label: "非法经营同类营业罪",
                    value: "001030309",
                    count: "1"
                  },
                  {
                    label: "签订、履行合同失职被骗罪",
                    value: "001030311",
                    count: "2"
                  },
                  {
                    label: "违规披露、不披露重要信息罪",
                    value: "001030316",
                    count: "1"
                  },
                  {
                    label: "非国家工作人员受贿罪",
                    value: "001030318",
                    count: "3"
                  }
                ]
              },
              {
                label: "破坏金融管理秩序罪",
                value: "0010304",
                count: "37",
                children: [
                  {
                    label: "伪造货币罪",
                    value: "001030401",
                    count: "2"
                  },
                  {
                    label: "出售、购买、运输假币罪",
                    value: "001030402",
                    count: "1"
                  },
                  {
                    label: "持有、使用假币罪",
                    value: "001030404",
                    count: "1"
                  },
                  {
                    label: "高利转贷罪",
                    value: "001030408",
                    count: "1"
                  },
                  {
                    label: "非法吸收公众存款罪",
                    value: "001030409",
                    count: "4"
                  },
                  {
                    label: "伪造、变造金融票证罪",
                    value: "001030410",
                    count: "4"
                  },
                  {
                    label: "擅自发行股票、公司、企业债券罪",
                    value: "001030413",
                    count: "1"
                  },
                  {
                    label: "内幕交易、泄露内幕信息罪",
                    value: "001030414",
                    count: "9"
                  },
                  {
                    label: "操纵证券、期货交易价格罪",
                    value: "001030417",
                    count: "4"
                  },
                  {
                    label: "违法发放贷款罪",
                    value: "001030420",
                    count: "3"
                  },
                  {
                    label: "非法出具金融票证罪",
                    value: "001030422",
                    count: "1"
                  },
                  {
                    label: "洗钱罪",
                    value: "001030425",
                    count: "1"
                  },
                  {
                    label: "骗取贷款、票据承兑、金融票证罪",
                    value: "001030426",
                    count: "2"
                  },
                  {
                    label: "利用未公开信息交易罪",
                    value: "001030435",
                    count: "4"
                  }
                ]
              },
              {
                label: "金融诈骗罪",
                value: "0010305",
                count: "37",
                children: [
                  {
                    label: "集资诈骗罪",
                    value: "001030501",
                    count: "8"
                  },
                  {
                    label: "贷款诈骗罪",
                    value: "001030502",
                    count: "9"
                  },
                  {
                    label: "票据诈骗罪",
                    value: "001030503",
                    count: "4"
                  },
                  {
                    label: "金融凭证诈骗罪",
                    value: "001030504",
                    count: "7"
                  },
                  {
                    label: "信用证诈骗罪",
                    value: "001030505",
                    count: "2"
                  },
                  {
                    label: "信用卡诈骗罪",
                    value: "001030506",
                    count: "8"
                  },
                  {
                    label: "保险诈骗罪",
                    value: "001030508",
                    count: "3"
                  }
                ]
              },
              {
                label: "危害税收征管罪",
                value: "0010306",
                count: "25",
                children: [
                  {
                    label: "偷税罪",
                    value: "001030601",
                    count: "3"
                  },
                  {
                    label: "骗取出口退税罪",
                    value: "001030604",
                    count: "2"
                  },
                  {
                    label:
                      "虚开增值税专用发票、用于骗取出口退税、抵扣税款发票罪",
                    value: "001030605",
                    count: "15"
                  },
                  {
                    label: "伪造、出售伪造的增值税专用发票罪",
                    value: "001030606",
                    count: "2"
                  },
                  {
                    label: "非法出售增值税专用发票罪",
                    value: "001030607",
                    count: "1"
                  },
                  {
                    label: "非法制造、出售非法制造的发票罪",
                    value: "001030610",
                    count: "4"
                  }
                ]
              },
              {
                label: "侵犯知识产权罪",
                value: "0010307",
                count: "48",
                children: [
                  {
                    label: "假冒注册商标罪",
                    value: "001030701",
                    count: "8"
                  },
                  {
                    label: "销售假冒注册商标的商品罪",
                    value: "001030702",
                    count: "11"
                  },
                  {
                    label: "非法制造、销售非法制造的注册商标标识罪",
                    value: "001030703",
                    count: "3"
                  },
                  {
                    label: "侵犯著作权罪",
                    value: "001030705",
                    count: "15"
                  },
                  {
                    label: "侵犯商业秘密罪",
                    value: "001030707",
                    count: "12"
                  }
                ]
              },
              {
                label: "扰乱市场秩序罪",
                value: "0010308",
                count: "79",
                children: [
                  {
                    label: "损害商业信誉、商品声誉罪",
                    value: "001030801",
                    count: "2"
                  },
                  {
                    label: "合同诈骗罪",
                    value: "001030804",
                    count: "23"
                  },
                  {
                    label: "非法经营罪",
                    value: "001030805",
                    count: "39"
                  },
                  {
                    label: "强迫交易罪",
                    value: "001030806",
                    count: "2"
                  },
                  {
                    label: "伪造、倒卖伪造的有价票证罪",
                    value: "001030807",
                    count: "3"
                  },
                  {
                    label: "倒卖车票、船票罪",
                    value: "001030808",
                    count: "1"
                  },
                  {
                    label: "非法转让、倒卖土地使用权罪",
                    value: "001030809",
                    count: "1"
                  },
                  {
                    label: "出具证明文件重大失实罪",
                    value: "001030811",
                    count: "2"
                  },
                  {
                    label: "组织、领导传销活动罪",
                    value: "001030813",
                    count: "1"
                  }
                ]
              }
            ]
          },
          {
            label: "侵犯公民人身权利民主权利罪",
            value: "00104",
            count: "409",
            children: [
              {
                label: "故意杀人罪",
                value: "0010401",
                count: "179"
              },
              {
                label: "过失致人死亡罪",
                value: "0010402",
                count: "13"
              },
              {
                label: "故意伤害罪",
                value: "0010403",
                count: "105"
              },
              {
                label: "强奸罪",
                value: "0010405",
                count: "56"
              },
              {
                label: "强制猥亵、侮辱妇女罪",
                value: "0010406",
                count: "5"
              },
              {
                label: "猥亵儿童罪",
                value: "0010407",
                count: "7"
              },
              {
                label: "非法拘禁罪",
                value: "0010408",
                count: "14"
              },
              {
                label: "绑架罪",
                value: "0010409",
                count: "28"
              },
              {
                label: "拐卖妇女、儿童罪",
                value: "0010410",
                count: "14"
              },
              {
                label: "收买被拐卖的妇女、儿童罪",
                value: "0010411",
                count: "4"
              },
              {
                label: "诬告陷害罪",
                value: "0010413",
                count: "2"
              },
              {
                label: "非法侵入住宅罪",
                value: "0010417",
                count: "1"
              },
              {
                label: "侮辱罪",
                value: "0010418",
                count: "1"
              },
              {
                label: "诽谤罪",
                value: "0010419",
                count: "3"
              },
              {
                label: "刑讯逼供罪",
                value: "0010420",
                count: "1"
              },
              {
                label: "暴力取证罪",
                value: "0010421",
                count: "1"
              },
              {
                label: "报复陷害罪",
                value: "0010429",
                count: "1"
              },
              {
                label: "破坏选举罪",
                value: "0010431",
                count: "1"
              },
              {
                label: "重婚罪",
                value: "0010433",
                count: "7"
              },
              {
                label: "虐待罪",
                value: "0010435",
                count: "2"
              },
              {
                label: "拐骗儿童罪",
                value: "0010437",
                count: "2"
              },
              {
                label: "奸淫幼女罪",
                value: "0010440",
                count: "2"
              },
              {
                label: "组织残疾人、儿童乞讨罪",
                value: "0010441",
                count: "1"
              },
              {
                label: "出售、非法提供公民个人信息罪",
                value: "0010442",
                count: "1"
              },
              {
                label: "非法获取公民个人信息罪",
                value: "0010443",
                count: "4"
              },
              {
                label: "组织未成年人进行违反治安管理活动罪",
                value: "0010444",
                count: "1"
              },
              {
                label: "组织出卖人体器官罪",
                value: "0010445",
                count: "3"
              },
              {
                label: "强迫劳动罪",
                value: "0010446",
                count: "1"
              }
            ]
          },
          {
            label: "侵犯财产罪",
            value: "00105",
            count: "353",
            children: [
              {
                label: "抢劫罪",
                value: "0010501",
                count: "155"
              },
              {
                label: "盗窃罪",
                value: "0010502",
                count: "116"
              },
              {
                label: "诈骗罪",
                value: "0010503",
                count: "48"
              },
              {
                label: "抢夺罪",
                value: "0010504",
                count: "3"
              },
              {
                label: "侵占罪",
                value: "0010506",
                count: "10"
              },
              {
                label: "职务侵占罪",
                value: "0010507",
                count: "17"
              },
              {
                label: "挪用资金罪",
                value: "0010508",
                count: "13"
              },
              {
                label: "敲诈勒索罪",
                value: "0010510",
                count: "23"
              },
              {
                label: "故意毁坏财物罪",
                value: "0010511",
                count: "5"
              },
              {
                label: "破坏生产经营罪",
                value: "0010512",
                count: "2"
              },
              {
                label: "拒不支付劳动报酬罪",
                value: "0010513",
                count: "2"
              }
            ]
          },
          {
            label: "妨害社会管理秩序罪",
            value: "00106",
            count: "383",
            children: [
              {
                label: "扰乱公共秩序罪",
                value: "0010601",
                count: "80",
                children: [
                  {
                    label: "妨害公务罪",
                    value: "001060101",
                    count: "6"
                  },
                  {
                    label: "招摇撞骗罪",
                    value: "001060103",
                    count: "3"
                  },
                  {
                    label: "伪造、变造、买卖国家机关公文、证件、印章罪",
                    value: "001060104",
                    count: "4"
                  },
                  {
                    label: "伪造、变造居民身份证罪",
                    value: "001060107",
                    count: "1"
                  },
                  {
                    label: "非法获取国家秘密罪",
                    value: "001060109",
                    count: "1"
                  },
                  {
                    label: "破坏计算机信息系统罪",
                    value: "001060114",
                    count: "9"
                  },
                  {
                    label: "聚众扰乱社会秩序罪",
                    value: "001060116",
                    count: "2"
                  },
                  {
                    label: "聚众扰乱公共场所秩序、交通秩序罪",
                    value: "001060118",
                    count: "1"
                  },
                  {
                    label: "投放虚假危险物质罪",
                    value: "001060119",
                    count: "1"
                  },
                  {
                    label: "聚众斗殴罪",
                    value: "001060120",
                    count: "10"
                  },
                  {
                    label: "寻衅滋事罪",
                    value: "001060121",
                    count: "17"
                  },
                  {
                    label: "组织、领导、参加黑社会性质组织罪",
                    value: "001060122",
                    count: "18"
                  },
                  {
                    label: "包庇、纵容黑社会性质组织罪",
                    value: "001060124",
                    count: "1"
                  },
                  {
                    label: "传授犯罪方法罪",
                    value: "001060125",
                    count: "2"
                  },
                  {
                    label: "组织、利用会道门、邪教组织、利用迷信破坏法律实施罪",
                    value: "001060130",
                    count: "1"
                  },
                  {
                    label: "盗窃、侮辱尸体罪",
                    value: "001060134",
                    count: "1"
                  },
                  {
                    label: "赌博罪",
                    value: "001060135",
                    count: "6"
                  },
                  {
                    label: "编造、故意传播虚假恐怖信息罪",
                    value: "001060137",
                    count: "11"
                  }
                ]
              },
              {
                label: "妨害司法罪",
                value: "0010602",
                count: "92",
                children: [
                  {
                    label: "伪证罪",
                    value: "001060201",
                    count: "3"
                  },
                  {
                    label: "辩护人、诉讼代理人毁灭证据、伪造证据、妨害作证罪",
                    value: "001060202",
                    count: "2"
                  },
                  {
                    label: "妨害作证罪",
                    value: "001060203",
                    count: "6"
                  },
                  {
                    label: "帮助毁灭、伪造证据罪",
                    value: "001060204",
                    count: "4"
                  },
                  {
                    label: "窝藏、包庇罪",
                    value: "001060207",
                    count: "16"
                  },
                  {
                    label: "窝藏、转移、收购、销售赃物罪",
                    value: "001060209",
                    count: "7"
                  },
                  {
                    label: "拒不执行判决、裁定罪",
                    value: "001060210",
                    count: "7"
                  },
                  {
                    label: "非法处置查封、扣押、冻结的财产罪",
                    value: "001060211",
                    count: "3"
                  },
                  {
                    label: "脱逃罪",
                    value: "001060213",
                    count: "6"
                  },
                  {
                    label: "聚众持械劫狱罪",
                    value: "001060217",
                    count: "1"
                  },
                  {
                    label: "掩饰、隐瞒犯罪所得、犯罪所得收益罪",
                    value: "001060218",
                    count: "42"
                  }
                ]
              },
              {
                label: "妨害国（边）境管理罪",
                value: "0010603",
                count: "5",
                children: [
                  {
                    label: "组织他人偷越国（边）境罪",
                    value: "001060301",
                    count: "1"
                  },
                  {
                    label: "骗取出境证件罪",
                    value: "001060302",
                    count: "1"
                  },
                  {
                    label: "运送他人偷越国（边）境罪",
                    value: "001060305",
                    count: "1"
                  },
                  {
                    label: "偷越国（边）境罪",
                    value: "001060306",
                    count: "2"
                  }
                ]
              },
              {
                label: "妨害文物管理罪",
                value: "0010604",
                count: "9",
                children: [
                  {
                    label: "倒卖文物罪",
                    value: "001060405",
                    count: "1"
                  },
                  {
                    label: "盗掘古文化遗址、古墓葬罪",
                    value: "001060407",
                    count: "8"
                  },
                  {
                    label: "抢夺、窃取国有档案罪",
                    value: "001060409",
                    count: "1"
                  }
                ]
              },
              {
                label: "危害公共卫生罪",
                value: "0010605",
                count: "5",
                children: [
                  {
                    label: "非法行医罪",
                    value: "001060509",
                    count: "4"
                  },
                  {
                    label: "非法进行节育手术罪",
                    value: "001060510",
                    count: "1"
                  }
                ]
              },
              {
                label: "破坏环境资源保护罪",
                value: "0010606",
                count: "19",
                children: [
                  {
                    label: "重大环境污染事故罪",
                    value: "001060601",
                    count: "4"
                  },
                  {
                    label: "非法捕捞水产品罪",
                    value: "001060604",
                    count: "1"
                  },
                  {
                    label:
                      "非法收购、运输、出售珍贵、濒危野生动物、珍贵、濒危野生动物制品罪",
                    value: "001060606",
                    count: "5"
                  },
                  {
                    label: "非法狩猎罪",
                    value: "001060607",
                    count: "1"
                  },
                  {
                    label: "非法占用农用地罪",
                    value: "001060608",
                    count: "2"
                  },
                  {
                    label: "盗伐林木罪",
                    value: "001060613",
                    count: "1"
                  },
                  {
                    label: "污染环境罪",
                    value: "001060619",
                    count: "5"
                  }
                ]
              },
              {
                label: "走私、贩卖、运输、制造毒品罪",
                value: "0010607",
                count: "143",
                children: [
                  {
                    label: "走私、贩卖、运输、制造毒品罪",
                    value: "001060701",
                    count: "122"
                  },
                  {
                    label: "非法持有毒品罪",
                    value: "001060702",
                    count: "10"
                  },
                  {
                    label: "窝藏、转移、隐瞒毒品、毒赃罪",
                    value: "001060704",
                    count: "2"
                  },
                  {
                    label: "走私制毒物品罪",
                    value: "001060705",
                    count: "1"
                  },
                  {
                    label: "非法买卖制毒物品罪",
                    value: "001060706",
                    count: "3"
                  },
                  {
                    label: "容留他人吸毒罪",
                    value: "001060711",
                    count: "2"
                  }
                ]
              },
              {
                label: "组织、强迫、引诱、容留、介绍卖淫罪",
                value: "0010608",
                count: "17",
                children: [
                  {
                    label: "组织卖淫罪",
                    value: "001060801",
                    count: "6"
                  },
                  {
                    label: "强迫卖淫罪",
                    value: "001060802",
                    count: "3"
                  },
                  {
                    label: "协助组织卖淫罪",
                    value: "001060803",
                    count: "4"
                  },
                  {
                    label: "引诱、容留、介绍卖淫罪",
                    value: "001060804",
                    count: "5"
                  },
                  {
                    label: "传播性病罪",
                    value: "001060806",
                    count: "1"
                  },
                  {
                    label: "嫖宿幼女罪",
                    value: "001060807",
                    count: "2"
                  }
                ]
              },
              {
                label: "制作、贩卖、传播淫秽物品罪",
                value: "0010609",
                count: "18",
                children: [
                  {
                    label: "制作、复制、出版、贩卖、传播淫秽物品牟利罪",
                    value: "001060901",
                    count: "15"
                  },
                  {
                    label: "传播淫秽物品罪",
                    value: "001060903",
                    count: "1"
                  }
                ]
              }
            ]
          },
          {
            label: "危害国防利益罪",
            value: "00107",
            count: "2",
            children: [
              {
                label: "破坏武器装备、军事设施、军事通信罪",
                value: "0010703",
                count: "1"
              },
              {
                label: "接送不合格兵员罪",
                value: "0010711",
                count: "1"
              }
            ]
          },
          {
            label: "贪污贿赂罪",
            value: "00108",
            count: "327",
            children: [
              {
                label: "贪污罪",
                value: "0010801",
                count: "109"
              },
              {
                label: "挪用公款罪",
                value: "0010802",
                count: "40"
              },
              {
                label: "受贿罪",
                value: "0010803",
                count: "232"
              },
              {
                label: "行贿罪",
                value: "0010805",
                count: "21"
              },
              {
                label: "对单位行贿罪",
                value: "0010806",
                count: "1"
              },
              {
                label: "介绍贿赂罪",
                value: "0010807",
                count: "2"
              },
              {
                label: "单位行贿罪",
                value: "0010808",
                count: "4"
              },
              {
                label: "巨额财产来源不明罪",
                value: "0010809",
                count: "22"
              },
              {
                label: "私分国有资产罪",
                value: "0010811",
                count: "2"
              }
            ]
          },
          {
            label: "渎职罪",
            value: "00109",
            count: "96",
            children: [
              {
                label: "滥用职权罪",
                value: "0010901",
                count: "25"
              },
              {
                label: "玩忽职守罪",
                value: "0010902",
                count: "34"
              },
              {
                label: "故意泄露国家秘密罪",
                value: "0010903",
                count: "7"
              },
              {
                label: "徇私枉法罪",
                value: "0010905",
                count: "4"
              },
              {
                label: "执行判决、裁定滥用职权罪",
                value: "0010908",
                count: "1"
              },
              {
                label: "徇私舞弊减刑、假释、暂予监外执行罪",
                value: "0010911",
                count: "2"
              },
              {
                label: "徇私舞弊不移交刑事案件罪",
                value: "0010912",
                count: "7"
              },
              {
                label: "徇私舞弊不征、少征税款罪",
                value: "0010914",
                count: "3"
              },
              {
                label: "徇私舞弊发售发票、抵扣税款、出口退税罪",
                value: "0010915",
                count: "3"
              },
              {
                label: "违法发放林木采伐许可证罪",
                value: "0010918",
                count: "1"
              },
              {
                label: "环境监管失职罪",
                value: "0010919",
                count: "2"
              },
              {
                label: "放纵走私罪",
                value: "0010923",
                count: "1"
              },
              {
                label: "放行偷越国（边）境人员罪",
                value: "0010930",
                count: "1"
              },
              {
                label: "帮助犯罪分子逃避处罚罪",
                value: "0010933",
                count: "4"
              },
              {
                label: "食品监管渎职罪",
                value: "0010943",
                count: "6"
              }
            ]
          }
        ],
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
      },
      secondName: "法律法规",
      thirdName: "中央法规",
      queryWord: {
        //刑事法规参数
        scope: "default", //顶部搜索框作用域
        sort: "date", //排序规则
        page: 1, //分页页码
        size: 10, //分页大小，
        index: "chl", //索引标识
        keyword: "", //顶部检索框字段值
        group: false, //是否分组查询(仅中央和地方)
        groupByIndex: 0, //0:效力级别; 1:时效性; 2:不分组
        orderByIndex: 0, //排序规则 0:发布日期倒序; 1:发布日期正序; 2:实施日期正序; 3:实施日期倒叙; 4:引用量倒叙(中央和地方可用) 5：相关度倒叙(中央和地方可用)
        title: "", //右下侧结果中检索字段值
        // rangeType: 0, //同段:0; 同句:1
        // inquiryMode: 0, //精确查询:0; 模糊查询:1
        filterList: [
          //过滤及聚类规则
          // {
          //   field: "", //字段标识
          //   item: [
          //     //字段值
          //   ],
          //   type: "rank" //字段数据类型
          // }
        ],
        tagJson: [],
        modules: [
          //需要返回数据模块
          1, //左侧聚类数据
          2, //上侧统计数据
          3 //右下侧结果列表
        ]
      },
      select: "1",
      maincontentAll:[],
      resData: {
        navbar: {
          hkd: 20,
          twd: 41,
          chl: 5817,
          cribookcontent: 5942,
          lar: 35010,
          eagn: 133,
          cricase: 2222,
          crijournal: 322,
          crilaw: 4288
        },
        maincontent: [
          {
            name: "中央法规",
            index: "chl",
            total: 5817,
            data: [],
            group: []
          }
        ],
        sidebar: [
          {
            data: [
              {
                label: "法律",
                value: "XA01",
                count: "147"
              },
              {
                label: "行政法规",
                value: "XC02",
                count: "231"
              },
              {
                label: "行业规定",
                value: "XK06",
                count: "11"
              },
              {
                label: "部门规章",
                value: "XE03",
                count: "3362"
              },
              {
                label: "司法解释",
                value: "XG04",
                count: "2010"
              },
              {
                label: "团体规定",
                value: "XI05",
                count: "44"
              },
              {
                label: "军事法规规章",
                value: "XQ09",
                count: "12"
              }
            ],
            value: "EffectivenessDic",
            label: "效力级别"
          },
          {
            data: [
              {
                label: "全国人民代表大会",
                value: "1",
                count: "11"
              },
              {
                label: "全国人大常委会",
                value: "2",
                count: "134"
              },
              {
                label: "最高人民法院",
                value: "3",
                count: "1405"
              },
              {
                label: "最高人民检察院",
                value: "4",
                count: "991"
              },
              {
                label: "国务院",
                value: "5",
                count: "141"
              },
              {
                label: "国务院各机构",
                value: "6",
                count: "3522"
              },
              {
                label: "中央其他机构",
                value: "7",
                count: "459"
              }
            ],
            value: "IssueDepartment",
            label: "发布部门"
          },
          {
            data: [
              {
                label: "宪法",
                value: "001",
                count: "8"
              },
              {
                label: "国家机关",
                value: "002",
                count: "24"
              },
              {
                label: "机关工作",
                value: "003",
                count: "46"
              },
              {
                label: "法制工作",
                value: "004",
                count: "11"
              },
              {
                label: "律师",
                value: "005",
                count: "9"
              },
              {
                label: "公证",
                value: "006",
                count: "3"
              },
              {
                label: "民族事务",
                value: "007",
                count: "1"
              },
              {
                label: "华侨事务",
                value: "008",
                count: "2"
              },
              {
                label: "港澳事务",
                value: "009",
                count: "1"
              },
              {
                label: "台湾事务",
                value: "010",
                count: "3"
              },
              {
                label: "宗教事务",
                value: "011",
                count: "2"
              },
              {
                label: "国家安全",
                value: "012",
                count: "4"
              },
              {
                label: "外交外事",
                value: "013",
                count: "25"
              },
              {
                label: "公安",
                value: "014",
                count: "3295"
              },
              {
                label: "民政",
                value: "015",
                count: "18"
              },
              {
                label: "民法",
                value: "016",
                count: "23"
              },
              {
                label: "合同",
                value: "017",
                count: "4"
              },
              {
                label: "知识产权",
                value: "018",
                count: "18"
              },
              {
                label: "反不正当竞争",
                value: "021",
                count: "1"
              },
              {
                label: "婚姻赡养收养继承",
                value: "022",
                count: "17"
              },
              {
                label: "改革开放",
                value: "023",
                count: "2"
              },
              {
                label: "计划",
                value: "024",
                count: "3"
              },
              {
                label: "统计",
                value: "025",
                count: "10"
              },
              {
                label: "土地",
                value: "026",
                count: "2"
              },
              {
                label: "资源",
                value: "028",
                count: "9"
              },
              {
                label: "能源",
                value: "029",
                count: "1"
              },
              {
                label: "国有资产",
                value: "030",
                count: "1"
              },
              {
                label: "财政",
                value: "031",
                count: "52"
              },
              {
                label: "税收",
                value: "032",
                count: "61"
              },
              {
                label: "财务",
                value: "033",
                count: "19"
              },
              {
                label: "银行",
                value: "037",
                count: "29"
              },
              {
                label: "外汇",
                value: "038",
                count: "3"
              },
              {
                label: "票据",
                value: "039",
                count: "1"
              },
              {
                label: "证券",
                value: "040",
                count: "5"
              },
              {
                label: "期货",
                value: "042",
                count: "3"
              },
              {
                label: "价格",
                value: "043",
                count: "5"
              },
              {
                label: "保险",
                value: "044",
                count: "17"
              },
              {
                label: "企业",
                value: "045",
                count: "8"
              },
              {
                label: "公司",
                value: "046",
                count: "3"
              },
              {
                label: "外商投资企业",
                value: "047",
                count: "3"
              },
              {
                label: "个体经济",
                value: "048",
                count: "1"
              },
              {
                label: "建设业",
                value: "049",
                count: "9"
              },
              {
                label: "工业管理",
                value: "050",
                count: "24"
              },
              {
                label: "农业",
                value: "061",
                count: "4"
              },
              {
                label: "林业",
                value: "062",
                count: "12"
              },
              {
                label: "水利",
                value: "065",
                count: "4"
              },
              {
                label: "气象",
                value: "066",
                count: "4"
              },
              {
                label: "地质矿产",
                value: "067",
                count: "1"
              },
              {
                label: "交通运输",
                value: "068",
                count: "135"
              },
              {
                label: "仓储",
                value: "069",
                count: "3"
              },
              {
                label: "邮政电讯",
                value: "070",
                count: "23"
              },
              {
                label: "旅游",
                value: "072",
                count: "11"
              },
              {
                label: "咨询",
                value: "073",
                count: "1"
              },
              {
                label: "房地产",
                value: "074",
                count: "4"
              },
              {
                label: "商贸物资",
                value: "075",
                count: "20"
              },
              {
                label: "对外经贸",
                value: "076",
                count: "7"
              },
              {
                label: "商品检验与动植物检疫",
                value: "077",
                count: "5"
              },
              {
                label: "海关",
                value: "078",
                count: "8"
              },
              {
                label: "广告",
                value: "081",
                count: "1"
              },
              {
                label: "工商管理",
                value: "082",
                count: "23"
              },
              {
                label: "标准化管理和认证认可",
                value: "083",
                count: "13"
              },
              {
                label: "质量管理和监督",
                value: "085",
                count: "13"
              },
              {
                label: "调解与仲裁",
                value: "086",
                count: "3"
              },
              {
                label: "劳动工会",
                value: "087",
                count: "54"
              },
              {
                label: "人事",
                value: "088",
                count: "29"
              },
              {
                label: "环境保护",
                value: "089",
                count: "9"
              },
              {
                label: "地震",
                value: "090",
                count: "3"
              },
              {
                label: "教育",
                value: "091",
                count: "26"
              },
              {
                label: "科技",
                value: "092",
                count: "6"
              },
              {
                label: "文物文史",
                value: "094",
                count: "40"
              },
              {
                label: "文化",
                value: "095",
                count: "24"
              },
              {
                label: "卫生",
                value: "096",
                count: "43"
              },
              {
                label: "人口与计划生育",
                value: "097",
                count: "2"
              },
              {
                label: "体育",
                value: "098",
                count: "4"
              },
              {
                label: "军事",
                value: "099",
                count: "11"
              },
              {
                label: "刑法",
                value: "100",
                count: "1011"
              },
              {
                label: "民事诉讼",
                value: "101",
                count: "67"
              },
              {
                label: "经济审判",
                value: "102",
                count: "8"
              },
              {
                label: "行政诉讼",
                value: "104",
                count: "17"
              },
              {
                label: "刑事诉讼",
                value: "105",
                count: "675"
              },
              {
                label: "国家赔偿",
                value: "106",
                count: "110"
              },
              {
                label: "劳改劳教监所狱政",
                value: "107",
                count: "342"
              },
              {
                label: "检察业务",
                value: "109",
                count: "606"
              },
              {
                label: "电子商务",
                value: "111",
                count: "6"
              }
            ],
            value: "Category",
            label: "法规类别"
          }
        ]
      }
    };
  },
  created: function() {
    if (window.location.href.indexOf("keyword") != -1) {
      this.keyword = decodeURIComponent(
        window.location.href.split("keyword=")[1]
      );
    } else {
      this.keyword = this.$route.params.keyword;
    }
    this.choseType = "chl";
    this.queryWord.keyword = this.keyword;
    document.title = this.$route.meta.title;
    this.searchMethod();
    // this.directRegulation(); //直达法规
    // this.totheLaw();  //直达发条
    // this.synonymecRommendation(); //同义词推荐
    // this.hotsearchRecommendation(); //热搜推荐
    // this.insertMySearchKeyList(); // 插入搜索历史
  },
  methods: {
    getKeywords(key,e){
      // console.log(key,'--------------------点击 搜索 热刺------------------',$(e.target),$(e.target)[0].innerText);
      this.keyword = $(e.target)[0].innerText;
      this.getList();
    },
    // 全选
    checkAllChange(val){
      console.log(this.checkAllState,'全选状态更改-------------------',this.filerSelect_group);
      let _this = this;
      // this.checkAllList = [];
      // if(this.filerSelect_group != 2 && this.filerSelect_group != '2'){
      //   console.log('分组')
      //   this.resData.maincontent[0].group.forEach((ele,index) => {
      //     ele.data.forEach((ele2,index2) => {
      //       _this.checkAllList.push({
      //         Gid:ele2.Gid,
      //         status:false,
      //       });
      //       // this.$set(_this.checkAllListArr, ele.Gid, true);
      //     });
      //   });
      // }else{
      //   console.log('不分组')
      //   this.resData.maincontent[0].data.forEach((ele,index) => {
      //     // console.log(ele)
      //     // ele.data.forEach((ele2,index2) => {
      //       _this.checkAllList.push({
      //         Gid:ele.Gid,
      //         status:false,
      //       });
      //       // this.$set(_this.checkAllListArr, ele.Gid, true);
      //     // });
      //   });
      // }
      console.log(_this.checkAllList,'-------_this.checkAllList----------------',this.checkAllListArr,this.checkAllListJson)
    },
    // 批量下载
    downFilesAll(){
      console.log('批量下载----------------------------')
      let downArr = [];
      this.checkAllList.forEach((ele,index)=>{
        if(ele.status){
          downArr.push(ele.Gid);
        }
      });
      if(downArr.length <= 0){
        this.$message({
          showClose: true,
          type: 'info',
          message: '请勾选要删除的选项!'
        });
        return;
      }
      console.log('----------------下载目标文件id数组----------------',downArr.join(","))
        var gid = downArr.join(",");
        var index = this.tab_nav_select;
        Download({
            library: index,
            curLib: index,
            gids: gid,
            keepFields: "false",
            downloadType:"word"
        })
    },
    isCheckOne(item){
      console.log('点个点击-----------------------',item)
      this.checkAllList = item;
      let _this = this;
      for(let xy = 0; xy < item.length;xy++){
        if(!item[xy].status){
          _this.checkAllState = false;
          break;
        }else{
          _this.checkAllState = true;
        }
      }
       console.log('父级组件里面单个点击-----------------------',this.checkAllState)
    },
    fenyecaozuoChange: function(val) {
      console.log("----------分页操作---------------", val);
      this.checkAllState = false;
    },
    kaishi() {
      this.showPrise = !this.showPrise;
      this.showRentPrise = !this.showRentPrise;
    },
    //头补选中
    handleSelect(queryData) {
      console.log(queryData, "---------------------------------------------");
    },
    //批量下载
    downloadTemplate() {
      this.axios
        .get("/QuestionBank/templateDownload", { responseType: "blob" })
        .then(data => {
          console.log(data);
          let blob = new Blob([data.data], {
            type:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8"
          });
          let objectUrl = URL.createObjectURL(blob);
          window.location.href = objectUrl;
        });
    },
    hiddenAll(){
      this.selectStatus =false;
    },
    //查询搜索的历史
    findHistory(){
      // console.log(this.type);
      this.selectStatus =true;
      console.log("进入查找用户搜索历史------------------------",this.type);

      if(this.keyword == null ||this.keyword==undefined || this.keyword == '' ){
        showKeyWordHistory("law").then(res=>{
          console.log(res,"-----------------搜索历史返回结果---搜索--------------------");
          if(res){
            var  resultList = [];
            if( res.data.data){
              $(".lawslishiorothertips_main_wrap").css({'display':'block'});
              res.data.data.forEach(key =>{
                var result = {
                  name : key.keyword,
                  value : key.keyword,
                }
                resultList.push(result);
              })
            }else{
              // $(".lawslishiorothertips_main_wrap").css({'display':'none'});
            }
            this.keywordsDrop = resultList;
            console.log(this.keywordsDrop,"下拉条中的搜索历史--------------------------------------------")
          }

        })
      }
    },
    // 失去焦点
    findHistoryBlur(){
      setTimeout(function () {
        $(".lawslishiorothertips_main_wrap").css({'display':'none'});
      },1000);
    },
    //输入框 搜索 结果
    getList() {
      this.searchTypeOfManyWorld =false;

		this.queryWord.rangeType = this.rangeType ? parseInt(this.rangeType) : "";
		this.queryWord.inquiryMode = this.inquiryMode ? parseInt(this.inquiryMode) : "";
    this.queryWord.keyword = this.keyword;
    this.queryWord.orderByIndex = 5;
    this.queryWord.page = 1;
		console.log('---------------------按钮开始检索-----------------参数：',this.queryWord,this.rangeType,this.inquiryMode);
    this.searchMethod();
    sessionStorage.setItem("keywordNew",this.keyword);
		var url = this.$route.path;
		var absolutePath = window.location.href;
		addSearch(this.keyword, url);

    //   if (this.select == "documentno") {
    //     this.queryWord.tagJson.push({
    //       id: "",
    //       adv_type: "fuzzy",
    //       data_type: "text",
    //       name: "发文字号",
    //       namelist: [],
    //       fieldname: "DocumentNO",
    //       min: "",
    //       max: "",
    //       itemlist: [this.keyword],
    //       relatetype: "in",
    //       relatevalue: "",
    //       searchhistory: ""
    //     });
    //     this.queryWord.scope = "documentno";
    //     if (!$.isEmptyObject(this.queryWord.tagJson)) {
    //       for (let i in this.queryWord.tagJson) {
    //         if (
    //           this.queryWord.tagJson[i].fieldname == "DocumentNO" &&
    //           i < this.queryWord.tagJson.length - 1
    //         ) {
    //           this.queryWord.tagJson.splice(i, 1); //删除这个过滤项
    //           break;
    //         }
    //       }
    //     }
    //   }
    //   if (this.keyword == "" || this.keyword == undefined) {
    //     this.queryWord.tagJson = [];
    //     this.queryWord.filterList = [];
    //   }
    //   this.searchMethod();
    //   var url = this.$route.path;
    //   var absolutePath = window.location.href;
    //   addSearch(this.keyword, url);
    },
    // 结果中检索
    resultGetList(){
      this.searchTypeOfManyWorld = true;
      console.log('---------------------结果中检索参数-----------------',this.queryWord,sessionStorage.getItem("keywordNew"));
      this.queryWord.keyword = sessionStorage.getItem("keywordNew") ? sessionStorage.getItem("keywordNew") : "";
      this.queryWord.title = this.keyword;
      this.queryWord.page = 1;
      this.searchMethod();
      var url = this.$route.path;
      var absolutePath = window.location.href;
      addSearch(this.keyword, url);
    },
    // 高级检索模态框
    advancedRetrieval() {
      console.log(
        this.tab_nav_select,
        "00000000000000000this.tab_nav_select00000000000000"
      );
      this.advancedVisible = true;
      this.searchType = true;
      if (this.tab_nav_select == "chl") {
        // 发布部门
        getZYLawSelect("IssueDepartment").then(res => {
          console.log("发布部门:", res);
          this.IssueDepartmentArr = res.data.data;
        });
        // 批准部门
        getZYLawSelect("RatifyDepartment").then(res => {
          console.log("批准部门:", res);
          this.RatifyDepartmentArr = res.data.data;
        });
        // 时效
        getZYLawSelect("TimelinessDic").then(res => {
          // console.log("时效:",res);
          this.TimelinessDicArr = res.data.data;
        });
        // 专题
        getZYLawSelect("Specialtopic").then(res => {
          // console.log("专题:",res);
          this.SpecialtopicArr = res.data.data;
        });

        // 类别
        getZYLawSelect("Category").then(res => {
          // console.log("类别:",res);
          this.CategoryArr = res.data.data;
        });

        // 效力级别
        getZYLawSelect("EffectivenessDic").then(res => {
          // console.log("效力级别:",res);
          this.EffectivenessDicArr = res.data.data;
        });
      } else if (this.tab_nav_select == "lar") {
        // 发布部门
        getZYLawSelect("lar_IssueDepartment").then(res => {
          // console.log("发布部门:",res);
          this.IssueDepartmentArr = res.data.data;
        });
        // 批准部门
        getZYLawSelect("lar_RatifyDepartment").then(res => {
          // console.log("批准部门:",res);
          this.RatifyDepartmentArr = res.data.data;
        });
        // 时效
        getZYLawSelect("lar_TimelinessDic").then(res => {
          // console.log("时效:",res);
          this.TimelinessDicArr = res.data.data;
        });
        // 专题
        getZYLawSelect("lar_Specialtopic").then(res => {
          // console.log("专题:",res);
          this.SpecialtopicArr = res.data.data;
        });

        // 类别
        getZYLawSelect("lar_Category").then(res => {
          // console.log("类别:",res);
          this.CategoryArr = res.data.data;
        });

        // 效力级别
        getZYLawSelect("lar_EffectivenessDic").then(res => {
          // console.log("效力级别:",res);
          this.EffectivenessDicArr = res.data.data;
        });
      } else if (this.tab_nav_select == "protocol") {
        // 发布部门
        getZYLawSelect("protocol_IssueDepartment").then(res => {
          // console.log("发布部门:",res);
          this.IssueDepartmentArr = res.data.data;
        });
        // 类别
        getZYLawSelect("protocol_Category").then(res => {
          // console.log("类别:",res);
          this.CategoryArr = res.data.data;
        });

        // 效力级别
        getZYLawSelect("protocol_EffectivenessDic").then(res => {
          // console.log("效力级别:",res);
          this.EffectivenessDicArr = res.data.data;
        });
        // 范围
        getZYLawSelect("protocol_RangeOf").then(res => {
          // console.log("效力级别:",res);
          this.RangeOfArr = res.data.data;
        });
        // 状态
        getZYLawSelect("protocol_SolicitationState").then(res => {
          // console.log("效力级别:",res);
          this.SolicitationStateArr = res.data.data;
        });
      } else if (this.tab_nav_select == "lawexplanation") {
        // 发布部门
        getZYLawSelect("lawexplanation_IssueDepartment").then(res => {
          // console.log("发布部门:",res);
          this.IssueDepartmentArr = res.data.data;
        });
        // 类别
        getZYLawSelect("lawexplanation_Category").then(res => {
          // console.log("类别:",res);
          this.CategoryArr = res.data.data;
        });

        // 效力级别
        getZYLawSelect("lawexplanation_EffectivenessDic").then(res => {
          // console.log("效力级别:",res);
          this.EffectivenessDicArr = res.data.data;
        });
        // 范围
        getZYLawSelect("lawexplanation_RangeOf").then(res => {
          // console.log("效力级别:",res);
          this.RangeOfArr = res.data.data;
        });
      } else if (this.tab_nav_select == "whitebook") {
        // 发布部门
        getZYLawSelect("whitebook_IssueDepartment").then(res => {
          // console.log("发布部门:",res);
          this.IssueDepartmentArr = res.data.data;
        });
      } else if (this.tab_nav_select == "workreport") {
        // 发布部门
        getZYLawSelect("workreport_IssueDepartment").then(res => {
          // console.log("发布部门:",res);
          this.IssueDepartmentArr = res.data.data;
        });
        // 类别
        getZYLawSelect("workreport_Category").then(res => {
          // console.log("类别:",res);
          this.CategoryArr = res.data.data;
        });
      } else if (this.tab_nav_select == "legislation") {
        // 发布部门
        getZYLawSelect("legislation_IssueDepartment").then(res => {
          // console.log("发布部门:",res);
          this.IssueDepartmentArr = res.data.data;
        });
        // 类别
        getZYLawSelect("legislation_Category").then(res => {
          // console.log("类别:",res);
          this.CategoryArr = res.data.data;
        });
        // 时效
        getZYLawSelect("legislation_TimelinessDic").then(res => {
          // console.log("时效:",res);
          this.TimelinessDicArr = res.data.data;
        });
      } else if (this.tab_nav_select == "eagn") {
        // 条约种类
        getZYLawSelect("eagn_Kind").then(res => {
          // console.log("发布部门:",res);
          this.KindArr = res.data.data;
        });
        // 批准机关
        getZYLawSelect("eagn_RatifyDepartment").then(res => {
          // console.log("类别:",res);
          this.RatifyDepartmentArr = res.data.data;
        });
        // fenlei
        getZYLawSelect("eagn_Category").then(res => {
          this.CategoryArr = res.data.data;
        });
        // 广泛
        getZYLawSelect("eagn_KnowWell").then(res => {
          // console.log("类别:",res);
          this.KnowWellArr = res.data.data;
        });
        // 组织
        getZYLawSelect("eagn_IssueDepartment").then(res => {
          this.IssueDepartmentArr = res.data.data;
        });
      } else if (this.tab_nav_select == "iel") {
        // 发布部门
        getZYLawSelect("iel_IssueDepartment").then(res => {
          // console.log("发布部门:",res);
          this.IssueDepartmentArr = res.data.data;
        });
        // 类别
        getZYLawSelect("iel_Category").then(res => {
          // console.log("类别:",res);
          this.CategoryArr = res.data.data;
        });
      } else if (this.tab_nav_select == "hkd") {
        //失效
        getZYLawSelect("hkd_TimelinessDic").then(res => {
          // console.log("时效:",res);
          this.TimelinessDicArr = res.data.data;
        });
        // 类别
        getZYLawSelect("hkd_Category").then(res => {
          // console.log("类别:",res);
          this.CategoryArr = res.data.data;
        });
      } else if (this.tab_nav_select == "aom") {
        getZYLawSelect("aom_LawCategory").then(res => {
          // console.log("类别:",res);
          this.LawCategoryArr = res.data.data;
        });
        getZYLawSelect("aom_Category").then(res => {
          // console.log("类别:",res);
          this.CategoryArr = res.data.data;
        });
        getZYLawSelect("aom_Relevance").then(res => {
          console.log("澳门相关信息:", res);
          this.RelevanceArr = res.data.data;
        });
      } else if (this.tab_nav_select == "twd") {
        getZYLawSelect("twd_ValidState").then(res => {
          // console.log("twd_ValidState:",res);
          this.ValidStateArr = res.data.data;
        });
        getZYLawSelect("twd_Category").then(res => {
          // console.log("类别:",res);
          this.CategoryArr = res.data.data;
        });
        getZYLawSelect("twd_RegulationOrder").then(res => {
          // console.log("澳门相关信息:",res);
          this.RegulationOrderArr = res.data.data;
        });
        getZYLawSelect("eagn_IssueDepartment").then(res => {
          // console.log("澳门相关信息:",res);
          this.DepartmentArr = res.data.data;
        });
      }
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      var _this = this;
      this.advancedForm.tagJson = [];
      // 			this.advancedForm.tagJson.forEach(function(item,index){
      //             _this.advancedForm.tagJson[index].min="";
      //             _this.advancedForm.tagJson[index].max="";
      //
      //             _this.advancedForm.tagJson[index].itemlist=[];
      //       });
    },
    //
    // 高级检索结果集
    advancedSearch(formName) {
      this.advancedForm.index = this.queryWord.index;
	    this.advancedForm.groupByIndex = this.queryWord.groupByIndex;

      this.advancedForm.rangeType = this.rangeType ? parseInt(this.rangeType) : "";
    //   this.advancedForm.inquiryMode = this.queryWord.inquiryMode;
      var data = this.advancedForm;
      this.select = "1";
      data.scope = "title";
      console.log("---------------高级检索参数-----------------------------",data);
      // this.axios.post(`/xsfb/criminal/search`, data).then(res => {
      //      // console.log(res);
      //        this.resData = res.data;
      //        this.navbarVal = res.data.navbar;
      //        this.advancedVisible=false;
      //        this.advancedForm.group=this.queryWord.group;
      // });

      this.axios
        .post(`/json`, data, {
          headers: {
            _api_name: "fb_criminal",
            _api_version: "1.0.0"
          }
        })
        .then(res => {
          console.log("----------高级检索------------", res);
          if (!res.data.maincontent[0].pathToResult) {
            this.resData = res.data;
            this.navbarVal = res.data.navbar;
            this.advancedVisible = false;
            this.searchType = false;
            // 重置 同条等。。。
            this.rangeType = "";
            // this.keyword=this.advancedForm.keyword;
            this.queryWord.tagJson = this.advancedForm.tagJson;
            this.totalNum = res.data.maincontent[0].total;
          } else {
            this.totalNum = 0;
          }
          this.advancedVisible = false;
          this.searchType = false;
          // this.keyword=this.advancedForm.keyword;
          this.queryWord.tagJson = this.advancedForm.tagJson;
          // this.resData = res.data;
          // this.navbarVal = res.data.navbar;
          // this.advancedVisible = false;
          // this.searchType=false;
          // this.keyword=this.advancedForm.keyword;
          // this.queryWord.tagJson=this.advancedForm.tagJson;
          // this.totalNum=res.data.maincontent[0].total;
        });
    },
    //排序更改
    changeSort(val) {
      //日期降序 默认
      this.searchMethod(); //传参执行数据请求渲染
      this.checkAllState = false;
    },

    // set
    setTagJson(val, fieldId, isDate, fieldname) {
      // console.log(val,fieldId,isDate,fieldname);
      var _this = this;
      let tagJsonData = this.advancedForm.tagJson || [];
      let itemlist = [val];
      if (val == "" || val == undefined || val == null) {
        itemlist = [];
      }
      // this.advancedForm.tagJson.forEach(function(item,index){
      //   // console.log(item,index);
      //   if(item.id == fieldId){
      //     if(isDate){
      //       _this.advancedForm.tagJson[index].min=val[0];
      //       _this.advancedForm.tagJson[index].max=val[1];
      //     }else{
      //       _this.advancedForm.tagJson[index].itemlist.push(val);
      //     }
      //   }
      // });
console.log(fieldname)
      if (
        fieldname == "IssueDepartment" ||
        fieldname == "RatifyDepartment" ||
        fieldname == "TimelinessDic" ||
        fieldname == "EffectivenessDic" ||
        fieldname == "Specialtopic" ||
        fieldname == "Category" ||
        fieldname == "RangeOf" ||
        fieldname == "SolicitationState" ||
        fieldname == "KnowWell" ||
        fieldname == "Kind" ||
        fieldname == "LawCategory" ||
        // fieldname == "Relevance" ||
        fieldname == "ValidState" ||
        fieldname == "RegulationOrder"
        // fieldname == "Department"
      ) {
        tagJsonData.push({
          id: "",
          adv_type: "exact",
          data_type: "tag",
          name: "",
          namelist: [],
          fieldname: fieldname,
          min: "",
          max: "",
          itemlist: itemlist,
          relatetype: "or",
          relatevalue: "",
          searchhistory: ""
        });
      } else if (
        fieldname == "DocumentNO" ||
        fieldname == "TitleEn" ||
        fieldname == "Relevance" ||
        fieldname == "Department"
      ) {
        tagJsonData.push({
          id: "",
          adv_type: "fuzzy",
          data_type: "text",
          name: "",
          namelist: [],
          fieldname: fieldname,
          min: "",
          max: "",
          itemlist: itemlist,
          relatetype: "in",
          relatevalue: "",
          searchhistory: ""
        });
      } else if (fieldname == "CheckFullText"||fieldname == "Title") {
        tagJsonData.push({
          id: "",
          adv_type: "fuzzy",
          data_type: "longtext",
          name: "",
          namelist: [],
          fieldname: fieldname,
          min: "",
          max: "",
          itemlist: itemlist,
          relatetype: "in",
          relatevalue: "",
          searchhistory: ""
        });
      } else if (
        fieldname == "IssueDate" ||
        fieldname == "RatifyDate" ||
        fieldname == "ImplementDate" ||
        fieldname == "ExpirationDate" ||
        fieldname == "Date" ||
        fieldname == "ReleaseDate" ||
        fieldname == "AbolitionDate" ||
        fieldname == "ReviseDate"
      ) {
        tagJsonData.push({
          id: "",
          adv_type: "condition",
          data_type: "daterange",
          name: "",
          namelist: [],
          fieldname: fieldname,
          min: val[0],
          max: val[1],
          itemlist: [],
          relatetype: "range",
          relatevalue: ""
        });
      }
      for (let i in tagJsonData) {
        if (
          tagJsonData[i].fieldname == fieldname &&
          i < tagJsonData.length - 1
        ) {
          tagJsonData.splice(i, 1); //删除这个过滤项
          break;
        }
      }

      console.log(this.advancedForm.tagJson);
    },

    //分组综合
    changeGroupOrTime(value) {
      this.filerSelect_group = this.queryWord.groupByIndex;
      this.defalutNum = -1;
      // console.log(value,'---------group--------');
      // if(value == '1'){
      //     //效力
      //     console.log('--------------效力----------------------');
      //   this.queryWord.group=true;
      //   this.searchMethod();
      // }else if(value =='2'){
      //   //时效性
      //   this.queryWord.group=true;
      //   console.log('----------------时效性---------------------');
      //   let filterData = this.queryWord.filterList || [];
      //   //如果选择全部，则不追加，去除前边有这个type的元素
      //   for (let i in filterData) {
      //     if (filterData[i].field == type) {
      //       filterData.splice(i, 1); //删除这个过滤项
      //       break;
      //     }
      //   }
      //   this.searchMethod();
      // }else{
      //   //不分组
      //   console.log('-------------------不分组-----------------------')
      //   this.queryWord.group=false;
      this.searchMethod();
      this.checkAllState = false;
      // }
    },

    //时间排序相关度排序
    changePx: function(val) {
      this.queryWord.sort = val;
      this.searchMethod(); //传参执行数据请求渲染
    },
    //刑事法规的筛选条件
    changeFilter: function(val, type) {
      // console.log('-------------------',val)
      let filterData = this.queryWord.filterList || [];
      let flagData = true;
      // if (filterData.length == 0) {
      //   if (
      //     type == "IssueDate" ||
      //     type == "ImplementDate" ||
      //     type == "LastTimelinessChangeDate" ||
      //     type == "ReleaseDate"
      //   ) {

      //     this.queryWord.filterList.push({
      //       field: type, //字段标识
      //       item: [val],
      //       type: "date" //字段数据类型
      //     });
      //   }
      //   if (
      //     type == "TimelinessDic" ||
      //     type == "ValidState" ||
      //     type == "ReviseDate" ||
      //     type == "AbolitionDate"
      //   ) {
      //     this.queryWord.filterList.push({
      //       field: type, //字段标识
      //       item: [val],
      //       type: "rank" //字段数据类型
      //     });
      //   }
      // } else {
      //   for (let i in filterData) {
      //     if (filterData[i].field == type) {
      //       if (val == "-1") {
      //         flagData = false;
      //           console.info(JSON.stringify(filterData));
      //         filterData.splice(i, 1); //删除这个过滤项
      //         console.info(JSON.stringify(filterData));
      //         this.queryWord.filterList = filterData;
      //       } else {
      //         flagData = false;
      //         filterData[i].item[0] = val; //给item赋新值
      //         this.queryWord.filterList = filterData;
      //       }
      //       break;
      //     }
      //   }
      //   if (flagData) {
      //     //既没有改值也没有删除值，则需要向其中追加值，添加这个对象到数组
      //     if (
      //       type == "IssueDate" ||
      //       type == "ImplementDate" ||
      //       type == "LastTimelinessChangeDate" ||
      //       type == "ReleaseDate"
      //     ) {
      //       this.queryWord.filterList.push({
      //         field: type, //字段标识
      //         item: [val],
      //         type: "date" //字段数据类型
      //       });
      //     }
      //     if (
      //       type == "TimelinessDic" ||
      //       type == "ValidState" ||
      //       type == "ReviseDate" ||
      //       type == "AbolitionDate"
      //     ) {
      //       this.queryWord.filterList.push({
      //         field: type, //字段标识
      //         item: [val],
      //         type: "rank" //字段数据类型
      //       });
      //     }
      //   }
      // }
      //  for (let i in filterData) {
      //       if (filterData[i].item[0] == "-1") {
      //         filterData.splice(i, 1); //删除这个过滤项
      //         this.queryWord.filterList = filterData;
      //       }
      //   }
      if (val == "-1") {
        //如果选择全部，则不追加，去除前边有这个type的元素
        for (let i in filterData) {
          if (filterData[i].field == type) {
            filterData.splice(i, 1); //删除这个过滤项
            break;
          }
        }
      } else {
        //如果不选择全部，则追加，然后判定是否前边存在这个type，存在则删除
        if (
          type == "IssueDate" ||
          type == "ImplementDate" ||
          type == "LastTimelinessChangeDate" ||
          type == "ReleaseDate"
        ) {
          filterData.push({
            field: type, //字段标识
            item: [val],
            type: "date" //字段数据类型
          });
        }

        if (
          type == "TimelinessDic" ||
          type == "ValidState" ||
          type == "ReviseDate" ||
          type == "AbolitionDate"
        ) {
          filterData.push({
            field: type, //字段标识
            item: [val],
            type: "rank" //字段数据类型
          });
        }
        // console.log("-------filterData---------------",filterData)
        for (let i in filterData) {
          if (filterData[i].field == type && i < filterData.length - 1) {
            filterData.splice(i, 1); //删除这个过滤项
            break;
          }
        }
        // console.log("-------filterDatawww---------------",filterData)
      }
      this.searchMethod(); //传参执行数据请求渲染
    },
    //刑事法规的右侧内容区，点击更多，只显示一个组
    compareNumCriminal: function(index) {
      console.log("----------youcefenzu---------------", index);
      this.defalutNum = 100;
      this.secondMenu(index[0]);
      this.checkAllState = false;
      $(document).scrollTop(0);
    },
    //刑事法规的右侧内容区，不分组，分页
    compareNumchl: function(query) {
      this.queryWord.page = query.page;
      this.queryWord.size = query.size;

      this.cricaseQueryWord.size = query.size;
      this.cricaseQueryWord.page = query.page;
      if (this.searchType) {
        this.advancedForm.page = query.page;
        this.advancedForm.size = query.size;
        this.advancedSearch("advancedForm");
      } else {
        this.searchMethod();
      }
      this.checkAllState = false;
      $(document).scrollTop(0);
      //
    },
    //点击组A，A显示
    compareNum: function(index) {
      console.log("--------compareNum-----------------", index);
      this.defalutNum = index[1];
    },
    //更多，触发分页功能
    changePagination: function(queryData) {
      this.queryWord.size = queryData.size;
      this.queryWord.page = queryData.page;

      this.cricaseQueryWord.size = queryData.size;
      this.cricaseQueryWord.page = queryData.page;
      // this.searchMethod();
      if (this.searchType) {
        this.advancedForm.page = queryData.page;
        this.advancedForm.size = queryData.size;
        this.advancedSearch("advancedForm");
      } else {
        this.searchMethod();
      }
      this.checkAllState = false;
      $(document).scrollTop(0);
    },
    //更多，触发分页功能cricase
    cricaseChangePagination: function(queryData) {
      this.queryWord.size = queryData.size;
      this.queryWord.page = queryData.page;

      this.cricaseQueryWord.size = queryData.size;
      this.cricaseQueryWord.page = queryData.page;
      if (queryData.index) {
        this.cricaseQueryWord.baseFilter = {
          field: "CaseGrade",
          itemkey: "0" + (queryData.index + 1)
        };
      }
      this.cricaseSearchMethod();
    },
    //点击导航，面包屑变化，刷新数据
    clickBread: function(name) {
      if (this.chlShow) {
        this.queryWord.filterList = [];
        this.searchMethod();
      } else {
        switch (name) {
          case "裁判规则":
            this.GroupShow = true;
            this.chlShow = false;
            this.choseType = "cricase";
            this.cricaseQueryWord.index = "cricase";
            this.cricaseSearchMethod();
            break;
          case "专家精释":
            this.GroupShow = false;
            this.chlShow = false;
            this.choseType = "cribookcontent";
            this.cricaseQueryWord.index = "cribookcontent";
            this.cricaseSearchMethod();
            break;
          case "法律依据":
            this.chlShow = false;
            this.GroupShow = true;
            this.choseType = "crilaw";
            this.cricaseQueryWord.index = "crilaw";
            this.cricaseSearchMethod();
            break;
          case "法学观点":
            this.chlShow = false;
            this.GroupShow = false;
            this.choseType = "crijournal";
            this.cricaseQueryWord.index = "crijournal";
            this.cricaseSearchMethod();
            break;
          default:
            break;
        }
      }
    },
    //二级菜单分类
    secondMenu: function(jueryData) {
      console.log('----------------------点击左侧聚类查询数据--------------------')
      let filterList = this.queryWord.filterList;
      for (let i in filterList) {
        if (jueryData.field == filterList[i].field) {
          filterList.splice(i, 1, jueryData);
          this.queryWord.filterList = filterList;
          // this.cricaseQueryWord.page = 1;
          this.queryWord.page = 1;
          this.searchMethod();
          return;
        }
      }
      filterList.push(jueryData);
      this.queryWord.filterList = filterList;
      // this.cricaseQueryWord.page = 1;
      this.queryWord.page = 1;
      this.searchMethod();
      // this.searchKeywordArr
    },

    //二级菜单分类(裁判规则)
    cricaseSecondMenu: function(jueryData) {
      this.defalutNum = -1; //默认右侧结果区域全部显示
      this.cricaseQueryWord.item = jueryData;
      this.cricaseQueryWord.page = 1;
      this.queryWord.page = 1;
      this.cricaseSearchMethod();
    },
    //search方法的index参数如何获得
    selectIndex: function(index) {
      this.tab_nav_select = index;
	  console.log( "--------------tab更改时---------------参数");
		if(!(index == 'lar' || index == 'chl')){
			this.select = 'title';
		}else{
			this.select = '1';
		}
      this.subChoseType = index;
      this.queryWord.filterList = [];
      this.queryWord.tagJson = [];
      this.queryWord.page = 1;
      this.keyword = "";
      if (index == "chl" || index == "lar") {
        this.queryWord.groupByIndex = 0;
        this.filerSelect_group = this.queryWord.groupByIndex;
        this.queryWord.orderByIndex = 5;
      } else {
        this.queryWord.groupByIndex = 2;
        this.filerSelect_group = this.queryWord.groupByIndex;
        this.queryWord.orderByIndex = 0;
      }
      this.defalutNum = -1;
      this.checkAllState = false;
      this.searchMethod();
    },
    //search方法的index参数如何获得
    selectIndexThird: function(index) {
      switch (index) {
        case "chl":
          this.thirdName = "中央法规";
          this.subChoseType = index;
          break;
        case "lar":
          this.thirdName = "地方法规";

          this.subChoseType = index;
          break;
        case "eagn":
          this.thidName = "中外条约";
          this.queryWord.group = false;
          this.subChoseType = index;
          break;
        case "hkd":
          this.thirdName = "香港法规";
          this.queryWord.group = false;
          this.subChoseType = index;
          break;
        case "twd":
          this.thirdName = "台湾法规";
          this.queryWord.group = false;
          this.subChoseType = index;
          break;
      }
      this.valuefbrq = "";
      this.valuessrq = "";
      this.valuesxx = "";
      this.valueyxzt = "";
      this.valuepx = "date";
      this.valuesxbg = "";

      this.queryWord.filterList = [];
      this.searchMethod();
    },
    // 清空搜索历史
    clearHistory() {
      this.searchKeywordArr = [];
      sessionStorage.removeItem("searchKeyword");
      this.keyword = "";
      this.tagJson = [];
      this.filterList = [];
      this.queryWord.filterList = [];
      this.advancedForm.tagJson = [];
      this.queryWord.tagJson = [];
      this.advancedForm.filterList = [];
      this.queryWord.keyword = null;
      this.queryWord.title = null;
      this.queryWord.orderByIndex = 0;
      this.searchMethod();
    },
    //清空选项
    clearHistoryItem(item, index) {
      // console.log(item,index)
     /* this.searchKeywordArr.splice(index, 1);
      sessionStorage.setItem("searchKeyword", this.searchKeywordArr);*/
      console.log(item,"入参");
      var title = this.queryWord.title;
      console.log(title,"title");
      var keyword = this.queryWord.keyword;
      console.log(keyword,"keyword");
      if( item == title){
        this.queryWord.title =null;
      }
      if(item == keyword ){
        console.log(this.queryWord.title)
        if(this.queryWord.title){
          this.queryWord.keyword = this.queryWord.title;
        }else{
          this.queryWord.keyword =null;
        }
        this.queryWord.title =null;
      }
      this.searchTypeOfManyWorld =false;
      this.keyword = this.queryWord.keyword;
      this.searchMethod();
    },
    // 清空聚类
    clearHistoryItem02(item,index){
      var _this = this;
      console.log(this.queryWord.filterList,item,index,'------------------------左侧聚类查询条件删除---------------')
      this.queryWord.filterList.forEach((ele,index02)=>{
        if(ele.field == item.field){
          _this.queryWord.filterList.splice(index02,1);
        }
      });
      this.getList();
    },
    searchHistoryItem(event) {
      // console.log($(event.target).html());
      this.keyword = $(event.target).html();
      this.searchMethod();
    },
    //搜索框下拉更改
    titleChange(val, type) {
      	console.log(val,type,'-----------------------------搜索框下拉更改-----------------------------title');

		if(val =='title'){
			this.inquiryMode = "0";
			this.rangeType = "";
			this.queryWord.scope = val;
    }else if(val == "DocumentNO"){
			this.inquiryMode = "";
			this.rangeType = "";
			this.queryWord.scope = val;

		}else if(val == "fulltext"){
			this.inquiryMode = "0";
			this.rangeType = "";
			this.queryWord.scope = val;

		}else if( val == "1"){
			this.queryWord.scope = "title";
			this.inquiryMode = "";
			this.rangeType = "";
		}
      	// this.searchMethod();
    },

    // 直达法规
    directRegulation() {
      let data = this.directRegulationList;
      console.log(this.directRegulationList);
      this.axios
        .post(`/json`, data, {
          headers: {
            _api_name: "fb_xsfb_criminal_lawRule",
            _api_version: "1.0.0"
          }
        })
        .then(res => {
          console.log("-----------------直达法规-------------------", res);
        });
    },

    // 直达法规
    // directRegulation() {
    // 	let data = this.cricaseQueryWord;
    // 	this.axios.post(`/xsfb/criminal/lawRule`, data).then(res => {
    // 		this.tableDataA = res.data
    // 		console.log(tableDataA,"_____tableDataA")
    // 	})
    // },
    //直达法条
    // totheLaw() {
    // let data = this.cricaseQueryWord;
    // 	this.axios.post(`/xsfb/criminal/lawArtilce`,data).then(res => {
    // 		this.tableDataB = res.data
    // 		console.log(tableDataB,"_____tableDataB")
    // 	})
    // },
    // //同义词推荐
    // synonymecRommendation() {
    // 	let data = this.cricaseQueryWord;
    // 	this.axios.post(`/json`, data, {
    // 				headers: {
    // 					_api_name: "fb_xsfb_criminal_synonym",
    // 					_api_version: "1.0.0"
    // 				}
    // 			})
    // 			.then(res => {
    // 				console.log('-----------------tongyici-------------------', res, );
    //         }
    // 			)},
    // //热搜推荐
    // hotsearchRecommendation() {
    // 	let data = this.cricaseQueryWord;
    // 	this.axios.post(`/xsfb/criminal/hotKeyword`,data).then(res => {
    // 		this.tableDataD = res.data
    // 		console.log(tableDataD,_____tableDataD)
    // 	})
    // },
    // // //插入搜索历史
    // insertMySearchKeyList() {
    // 	let data = this.keyWord;
    // 	this.axios.post(`/xsfb/criminal/insertMySearchKeyList`,data).then(res => {
    // 		this.tableDataE = res.data
    // 		console.log(tableDataE,_____tableDataE)
    // 	})
    // },

    //搜索方法
    searchMethod: function() {
      this.selectStatus =false;
      // if(this.keyword==""){
      //   return;
      // }
      // if (this.choseType == "chl") {
      this.fullscreenLoading = true;
      if (this.searchType) {
        //高级检索
        this.advancedForm = this.queryWord;
        this.advancedSearch("advancedForm");
      } else {
        // this.queryWord.keyword = this.keyword;
        this.queryWord.index = this.subChoseType;
        let data = this.queryWord;
        console.log("--------------查询数据----------------------", data);
        // this.axios.post(`/xsfb/criminal/search`, data).then(res => {
        // console.log('-----------------法律法规返回数据-------------------',res)
        // this.resData = res.data;
        // this.navbarVal = res.data.navbar;
        // // this.resData.sidebar = res.data.sidebar;
        // });
       /* if (
          sessionStorage.getItem("searchKeyword") != "" &&
          sessionStorage.getItem("searchKeyword") != null &&
          sessionStorage.getItem("searchKeyword") != undefined
        ) {
          this.searchKeywordArr = sessionStorage
            .getItem("searchKeyword")
            .split(",");
        }
        if (
          this.queryWord.keyword != undefined &&
          this.queryWord.keyword != ""
        ) {
          let mu = this.searchKeywordArr.find(n => {
            if (n == this.queryWord.keyword) {
              return true;
            } else {
              return false;
            }
          });
          if (!mu) {
            this.searchKeywordArr.push(this.queryWord.keyword);
          }
        }
        sessionStorage.setItem("searchKeyword", this.searchKeywordArr);
       */ // console.log('searchKeywordArr',this.searchKeywordArr,sessionStorage.getItem('searchKeyword'))

        if (this.queryWord.index != "chl" && this.queryWord.index != "lar") {
          this.queryWord.group = false;
          // this.filerSelect_group = "3";
        }
        this.axios
          .post(`/json`, data, {
            headers: {
              _api_name: "fb_criminal",
              _api_version: "1.0.0"
            }
          })
          .then(res => {
            console.log(
              "-----------------法律法规返回数据-------------------",
              res
            );
            this.fullscreenLoading = false;
            // -----typeof res.data---',typeof res.data
            if (res.data.result == "XSS_ATTACK") {
              this.totalNum = 0;
              this.navbarVal = res.data.navbar;
              this.resData = res.data;
            } else {
              if(res.data.maincontent.length > 0){
                this.resData = res.data;
                this.navbarVal = res.data.navbar;
                this.totalNum = res.data.maincontent[0].total;
                let _this = this;
                this.checkAllList = [];
                if(this.filerSelect_group != 2 && this.filerSelect_group != '2'){
                  this.resData.maincontent[0].group.forEach((ele,index) => {
                    ele.data.forEach((ele2,index2) => {
                      _this.checkAllList.push({
                        Gid:ele2.Gid,
                        status:false,
                      });
                      // this.$set(_this.checkAllListArr, ele.Gid, true);
                    });
                  });
                  if(this.queryWord.scope != 'fulltext'){
										this.resData.maincontent[0].group.forEach((ele2,index2)=>{
                      ele2.data.forEach((ele22,index22) => {
                        ele22.hitTimes='0';
											  ele22.highLighter="";
                      });
										});
                  }
                  console.log('处理不是全文zhihou------------------------',this.resData.maincontent[0].group)
                }else{
                  this.resData.maincontent[0].data.forEach((ele,index) => {
                    // ele.data.forEach((ele2,index2) => {
                      _this.checkAllList.push({
                        Gid:ele.Gid,
                        status:false,
                      });
                      // this.$set(_this.checkAllListArr, ele.Gid, true);
                    // });
                  });
                  if(this.queryWord.scope != 'fulltext'){
										this.resData.maincontent[0].data.forEach((ele2,index2)=>{
											ele2.hitTimes='0';
											ele2.highLighter="";
										});
									}
                }
                console.log("-----------------全选更改-------------------",this.checkAllList,this.filerSelect_group);
              }else{
                 this.totalNum = 0;
                this.navbarVal = res.data.navbar;
                this.resData = res.data;
              }



            }
            // if(this.select == "fulltext"){
            //   console.log($(".highlightFullText_wrap_hidden .hitclass"),'cishu')
            // }
          });
        if(this.searchTypeOfManyWorld) {
          this.searchKeywordArr =[];

          if( this.queryWord.keyword){
            this.searchKeywordArr.push(this.queryWord.keyword);
          }
          if(this.queryWord.title){
            this.searchKeywordArr.push(this.queryWord.title);
          }
          sessionStorage.setItem('searchKeyword', this.searchKeywordArr);
        }else{
          this.searchKeywordArr = [];
          if(this.queryWord.keyword){
            this.searchKeywordArr.push(this.queryWord.keyword)
            sessionStorage.setItem('searchKeyword', this.searchKeywordArr);
          }else{
            this.searchKeywordArr = [];
            sessionStorage.setItem('searchKeyword', []);
          }
          // console.log(this.searchKeywordArr);
          // console.log("空数组!!!!!","结果");
        }








      }
      // } else {
      //   this.cricaseQueryWord.keyword = this.keyword;
      //   this.cricaseQueryWord.index = this.choseType;
      //   this.cricaseSearchMethod();
      // }
      try {
        // addKeyWordHistory(this.queryForm.keyword,this.type);
      }catch (e) {
        console.log("添加历史记录异常!!")
      }
    },
    //搜索方法(裁判规则等)
    cricaseSearchMethod: function() {
      let data = this.cricaseQueryWord;
      this.axios.post(`/xsfb/charge/search`, data).then(res => {
        this.cricaseResData = res.data;
        this.navbarVal = res.data.navbar;
        // this.resData.sidebar = res.data.sidebar;
      });
    }
  },
  watch: {

    keyword: function(key){
      // $(".lawslishiorothertips_main_wrap").css({'display':'block'});
      if(key != null && key != '' && key != undefined){
        console.log(key,"---------------------相关----------------------");
        hotKeywordQuery(key,"law").then(res =>{
          if(res){
            console.log(res,"热搜词搜索");
            var resultList = [];
            if(res.data.success){
              $(".lawslishiorothertips_main_wrap").css({'display':'block'});
              if(res.data.data){
                this.keywordsDrop = res.data.data;
              }
              // res.data.data.forEach(key =>{
              //   var result = {
              //     name : key.synonymskeyword[0],
              //     id : key.id,
              //     value : key.synonymskeyword[0],
              //   }
              //   resultList.push(result);
              // })
            }
            // this.keywordsDrop = resultList;
          }
        })
      }


    },
























    select: function(value) {
      if (value == "fulltext") {
        // console.log($(".highlightFullText_wrap_hidden"))
      }
    },
    resData:function(val){
      // this.checkAllList=[];
      // let _this = this;
      // if(this.filerSelect_group == 2 || this.filerSelect_group == '2'){
      //   this.resData.maincontent[0].group.forEach((ele,index) => {
      //     ele.forEach((ele2,index2) => {
      //       _this.checkAllList.push({
      //         Gid:ele2.Gid,
      //         status:false,
      //       });
      //     });
      //   });
      //   // this.checkAllList
      //   console.log(_this.checkAllList,'-------_this.checkAllList----------------')
      // }

    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.fagui_bian_wrap_lin {
  display: inline-block;
  font-weight: 400;
  font-style: normal;
  font-size: 13px;
  color: #879bba;
  line-height: 40px;
  cursor: pointer;
  /* margin-left: -80px; */
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
  /* height: 17px;
  border-right: 1px solid #cad0d7;
  margin: 0 15px; */
}

.el-radio {
  color: #879bba !important;
  margin-right: 20px;
}

#lawsNewCol.lawsNewCol_operation_wrap .search_input_wrap {
  width:100% !important;
}

#lawsNewCol.lawsNewCol_operation_wrap .search_select_wrap {
  width: 110px;
  background-color: #ffffff !important;
  /* border: 1px solid #a9c4df; */
  margin: 0;
}

#lawsNewCol.lawsNewCol_operation_wrap .el-input-group__prepend {
  padding: 0;
  border-radius: 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  overflow: hidden;
  /* border: 1px solid #a9c4df; */
}

#lawsNewCol.lawsNewCol_operation_wrap .search_select_wrap .el-input__inner {
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

.el-menu-vertical-demo.el-menu--horizontal.el-menu li .el-submenu__title,
.el-menu-vertical-demo.el-menu--horizontal.el-menu li .el-submenu__title i {
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
  overflow: hidden;
}

#filerSelect .el-select {
  padding-right: 18px;
  margin-bottom: 10px;
}

#textExample {
  border-top: 2px solid #a8bdce;
  background-color: #daedfb;
  font-family: "Microsoft YaHei", Arial, "Avenir", Helvetica, sans-serif;
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

#lawsNew .el-aside {
  background-color: #e3f1fa;
  color: #4f4f8a;
  text-align: left;
  height: calc(100%-20px);
  width: calc(100%-20px);
  margin: 10px;
}

#lawsNewCol[class*="el-col-"] {
  padding-left: 10px;
  position: absolute;
  z-index: 1000;
  text-align: left;
}

#lawsNew .el-main {
  color: #4f4f8a;
  height: calc(100%-20px);
  width: calc(100%-20px);
  margin: 10px 0;
  border: 1px solid #ccc;
}

.advanced_form.lawsNew_dialog_form_wrap input,
.advanced_form.lawsNew_dialog_form_wrap select {
  width: 275px !important;
  /* height: 40px !important; */
  padding: 0 10px !important;
}

.advanced_form.lawsNew_dialog_form_wrap .date_input .el-range-input {
  width: 82px !important;
  /* height: 29px !important; */
  padding: 0 !important;
}

.advanced_form.lawsNew_dialog_form_wrap .el-date-editor {
  width: 275px !important;
  /* height: 40px !important; */
  padding: 3px 7px !important;
  padding-right: 0px !important;
  /* padding-left: 10px !important; */
}

.advanced_form.lawsNew_dialog_form_wrap .el-input__icon {
  /* width: 15px !important;
  line-height: 28px !important;
  margin-left: 0 !important; */
}

.advanced_form.lawsNew_dialog_form_wrap .el-date-editor .el-range-separator {
  color: #c4c5c7 !important;
  /* line-height: 28px !important; */
}

.gaoji_search_dialog.lawNew_search_dialog .el-dialog {
  width: 850px !important;
}

.filerSelect_ul {
  overflow: hidden;
}
#filerSelect_ul_sort_wrap{
  float: right;
}
.filerSelect_ul_left_checkAll{
  overflow: hidden;
  float: left;
  margin-top: 8px;
}
.filerSelect_ul_left_checkAll .checkAll_wrap,
.filerSelect_ul_left_checkAll .piliangdelete{
  padding: 0;
  margin: 0;
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;
}
.filerSelect_ul_left_checkAll .el-checkbox{
  color: #879bba;
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
.primary-btn-main {
  margin-left: 10px;
}

#advancedRetrieval_wrap_one {
  /* width: 22%; */
  height: 40px;
  float: right;
}
.advancedRetrieval_btn_link_wrap{
	text-align: left;
}

.advancedRetrieval_gao {
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  color: #879bba;
  height: 40px;
  line-height: 40px;
  margin: 0 10px;
  display: inline-block;
  /* padding-right: 100px; */
  cursor: pointer;
}

.advancedRetrieval:hover {
  color: #4da0fb;
}
.lawslishiorothertips_main_wrap{
  background-color: #fff;
  box-shadow: 0 0 10px 1px #a9c4df;
  border: 1px solid #a9c4df;
  border-top: none;
  width: calc(100% - 113px);
  float: right;
  /* padding: 10px; */
  box-sizing: border-box;
  display: none;
}

</style>
