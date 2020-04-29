<template>
	<div class="one_stop_wrap main_wrap">
		<div class="content_wrap">
			<div class="header_wrap">
				<Publichead :activeIndex="headerArr.activeIndex" :logo_url="headerArr.logo_url" @handleSelect="handleSelect"></Publichead>
			</div>
			<div class="content_main">
				<div class="header_search_wrap">
					<el-row class="search_inpu_one">
						<el-col :span="17" id="lawsNewCol" class="example_btn_link_wrap">
							<el-input :placeholder="searchType == '1'? '默认在标题和案件字号中检索':'请输入检索内容'"
							clearable v-model="keyWord" class="input-with-select search_input_wrap"
							prefix-icon="el-icon-search" @keyup.enter.native="getList"   @clear="getList" @blur="findHistoryBlur">
							<!-- @focus="findHistory" -->
								<el-select v-model="searchType" slot="prepend" class="search_select_wrap"
								 @change="(item)=>titleChange(item,'select')">
									<el-option label="默认" value="1" v-if="subChoseType == 'pfnl'"></el-option>
									<el-option label="标题" value="title"></el-option>
									<el-option label="全文" value="fulltext"></el-option>
									<el-option label="文号" value="CaseFlag" v-if="subChoseType == 'bankruptcy'"></el-option>
									<el-option label="企业名称" value="CompanyName" v-if="subChoseType == 'bankruptcy'"></el-option>

									<el-option label="案件字号" value="CaseFlag" v-if="subChoseType == 'gac' || subChoseType == 'pfnl' "></el-option>
									<el-option label="案由" value="Category" v-if="subChoseType == 'pfnl' || subChoseType == 'gac'"></el-option>

									<el-option label="关键词" value="Core"  v-if="subChoseType == 'gac'"></el-option>

									<el-option label="法院" value="Court" v-if="subChoseType == 'pfnl'"></el-option>
									<el-option label="法院" value="LastInstanceCourt" v-if="subChoseType == 'gac'"></el-option>
									<el-option label="法官" value="Judge" v-if="subChoseType == 'pfnl' || subChoseType == 'gac'"></el-option>
									<el-option label="律所" value="AgentLawOffice" v-if="subChoseType == 'pfnl'"></el-option>
									<el-option label="律所" value="Agent" v-if=" subChoseType == 'gac'"></el-option>
									<el-option label="律师" value="Agent" v-if="subChoseType == 'pfnl' || subChoseType == 'gac'"></el-option>

									<el-option label="当事人" value="PartyDic" v-if="subChoseType == 'pfnl'"></el-option>
									<el-option label="当事人" value="Party" v-if="subChoseType == 'gac'"></el-option>


									<el-option label="核心问题" value="DisputedIssues" v-if="subChoseType == 'pfnl' || subChoseType == 'gac'"></el-option>

									<hr style="border: 1px solid #dde5ec;" v-if="subChoseType == 'pfnl' || subChoseType == 'gac'" />

									<el-option label="裁判要点" value="ConetentCpyd" v-if="subChoseType == 'gac'"></el-option>
									<el-option label="相关法条" value="RelevantLaw" v-if="subChoseType == 'gac'"></el-option>
									<el-option label="基本案情" value="BasicFacts" v-if="subChoseType == 'gac'"></el-option>
									<el-option label="审理经过" value="TrialAfter" v-if="subChoseType == 'pfnl'"></el-option>
									<el-option label="诉讼请求" value="PlaintiffClaims" v-if="subChoseType == 'pfnl'"></el-option>
									<el-option label="辩方观点" value="DefenseViewpoint" v-if="subChoseType == 'pfnl'"></el-option>
									<el-option label="争议焦点" value="ControversialFocus" v-if="subChoseType == 'pfnl'"></el-option>
									<el-option label="本院查明" value="Ascertain" v-if="subChoseType == 'pfnl'"></el-option>
									<el-option label="本院认为" value="Identified" v-if="subChoseType == 'pfnl'"></el-option>
									<el-option label="裁判依据" value="RefereeBasis" v-if="subChoseType == 'pfnl'"></el-option>
									<el-option label="裁判结果" value="RefereeResult" v-if="subChoseType == 'pfnl' || subChoseType == 'gac'"></el-option>
									<el-option label="裁判理由" value="JudgeReason" v-if="subChoseType == 'gac'"></el-option>
									<el-option label="指导意义" value="GuidingSense" v-if="subChoseType == 'gac'"></el-option>
								</el-select>
							</el-input>
              <!--下拉选框子-->
              <div class="examplelishiorothertips_main_wrap">
				  	<template v-for=" (key,index) in keywordsDrop">
						<div :key="index" class="lawslishiorothertips_item">
							<div @click="getKeywords(key,$event) ">
								<span v-html="key.keyword"></span>
							</div>
						</div>
				  	</template>
                
              </div>
						</el-col>
						<el-col :span="7" id="advancedRetrieval_wrap_one">
							<el-button type="primary" class="primary-btn-main_kai" @click="getList">
								<span>开始检索</span>
							</el-button>
							<span v-if="searchKeywordArr.length > 0">
								<el-button type="primary" class="primary-btn-main" @click="resultGetList">结果中检索</el-button>
							</span>
							<span class="advancedRetrieval_gao" @click="advancedRetrieval()">高级检索</span>
						</el-col>
					</el-row>
					<el-row>
						<el-col class="radio_main_wrap">
							<ul>
								<li class="radio_qing_mo">
									<el-radio-group v-model="inquiryMode" @change="changeRangeType">
										<template v-if="searchType == '1'">
											<el-radio label="0" disabled>精确</el-radio>
											<el-radio label="1" disabled>模糊</el-radio>
										</template>
										<template v-if="searchType == 'title'">
											<el-radio label="0" >精确</el-radio>
											<el-radio label="1" >模糊</el-radio>
										</template>
										<template v-if="searchType == 'fulltext'">
											<el-radio label="0" >精确</el-radio>
											<el-radio label="1" >模糊</el-radio>
										</template>
									</el-radio-group>
								</li>
								<template v-if="searchType == '1' || searchType == 'title' || searchType == 'fulltext'">
									<li class=""><el-divider direction="vertical"></el-divider></li>
								</template>
								<li class="radio_qing_mo">
									<el-radio-group v-model="rangeType">
										<template v-if="searchType == '1'">
											<el-radio  label="" disabled>同篇</el-radio>
											<!-- <el-radio  label="2" disabled>同条</el-radio> -->
											<el-radio  label="0" disabled>同段</el-radio>
											<el-radio  label="1" disabled>同句</el-radio>
										</template>
										<template v-if="searchType == 'title'">
											<el-radio  label="" disabled>同篇</el-radio>
											<!-- <el-radio  label="2" disabled>同条</el-radio> -->
											<el-radio  label="0" disabled>同段</el-radio>
											<el-radio  label="1" disabled>同句</el-radio>
										</template>
										<template v-if="searchType == 'fulltext'">
											<template v-if='searchType2'>
												<el-radio  label="" disabled>同篇</el-radio>
												<!-- <el-radio  label="2" >同条</el-radio> -->
												<el-radio  label="0" disabled>同段</el-radio>
												<el-radio  label="1" disabled>同句</el-radio>
											</template>
											<template v-else>
												<el-radio  label="" >同篇</el-radio>
												<!-- <el-radio  label="2" >同条</el-radio> -->
												<el-radio  label="0" >同段</el-radio>
												<el-radio  label="1" >同句</el-radio>
											</template>
										</template>
									</el-radio-group>
								</li>
							</ul>
						</el-col>
					</el-row>
					<el-row class="tab_nav_wrap ">
						<el-menu default-active="pfnl" class="el-menu-vertical-demo" background-color="#fff"
						text-color="#5c79b0" active-text-color="#5c79b0" mode="horizontal"
						@select="selectIndex">
							<el-menu-item index="pfnl">
								<span slot="title">案例与裁判文书({{navbarVal.pfnl}})</span>
							</el-menu-item>
							<el-menu-item index="payz">
								<span slot="title">裁判规则({{navbarVal.payz}})</span>
							</el-menu-item>
							<el-menu-item index="gac">
								<span slot="title">指导性案例实证应用({{navbarVal.gac}})</span>
							</el-menu-item>
							<el-menu-item index="bankruptcy">
								<span slot="title">破产信息({{navbarVal.bankruptcy}})</span>
							</el-menu-item>
							<el-menu-item index="pal">
								<span slot="title">案例报道({{navbarVal.pal}})</span>
							</el-menu-item>
							<el-menu-item index="atr">
								<span slot="title">仲裁案例({{navbarVal.atr}})</span>
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
                    <a href="#/example">司法案例</a>
                  </span>
						</div>
						<div class="jians_conditions_wrap" v-if="searchKeywordArr.length > 0 || queryForm.filterList.length > 0">
							<div class="jians_conditions">
								<div class="conditions_left">检索条件：</div>
								<div class="conditions_right">
									<ul>
										<li class="search_txt_item" v-for="(item,index) in searchKeywordArr" v-if="index==0" :key="index">
										    <template v-if="queryForm.scope == 'default'">
													<span @click="searchHistoryItem($event)">标题+发文字号 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'title'">
													<span @click="searchHistoryItem($event)">标题 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'fulltext'">
													<span @click="searchHistoryItem($event)">全文 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'CaseFlag'">
													<span @click="searchHistoryItem($event)">文号 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'CompanyName'">
													<span @click="searchHistoryItem($event)">企业名称 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'CaseFlag'">
													<span @click="searchHistoryItem($event)">案件字号 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'Category'">
													<span @click="searchHistoryItem($event)">案由 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'Core'">
													<span @click="searchHistoryItem($event)">关键词 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'Court'">
													<span @click="searchHistoryItem($event)">法院 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'LastInstanceCourt'">
													<span @click="searchHistoryItem($event)">法院 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'Judge'">
													<span @click="searchHistoryItem($event)">法官 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'AgentLawOffice'">
													<span @click="searchHistoryItem($event)">律所 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'Agent'">
													<span @click="searchHistoryItem($event)">律所 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'PartyDic'">
													<span @click="searchHistoryItem($event)">当事人 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'Party'">
													<span @click="searchHistoryItem($event)">当事人 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'DisputedIssues'">
													<span @click="searchHistoryItem($event)">核心问题 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'ConetentCpyd'">
													<span @click="searchHistoryItem($event)">裁判要点 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'RelevantLaw'">
													<span @click="searchHistoryItem($event)">相关法条 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'BasicFacts'">
													<span @click="searchHistoryItem($event)">基本案情 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'TrialAfter'">
													<span @click="searchHistoryItem($event)">审理经过 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'PlaintiffClaims'">
													<span @click="searchHistoryItem($event)">诉讼请求 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'DefenseViewpoint'">
													<span @click="searchHistoryItem($event)">辩方观点 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'ControversialFocus'">
													<span @click="searchHistoryItem($event)">争议焦点 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'Ascertain'">
													<span @click="searchHistoryItem($event)">本院查明 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'RefereeBasis'">
													<span @click="searchHistoryItem($event)">裁判依据 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'RefereeResult'">
													<span @click="searchHistoryItem($event)">裁判结果 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'JudgeReason'">
													<span @click="searchHistoryItem($event)">裁判理由 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'GuidingSense'">
													<span @click="searchHistoryItem($event)">指导意义 : {{item}}</span>
												</template>
											<i class="el-icon-error error_item" @click="clearHistoryItem(item,index)"></i>
										</li>
										<li class="search_txt_item" v-for="(item,index) in searchKeywordArr" v-if="index==1" :key="index">
										    <template v-if="queryForm.scope == 'default'">
													<span @click="searchHistoryItem($event)">标题+发文字号 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'title'">
													<span @click="searchHistoryItem($event)">标题 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'fulltext'">
													<span @click="searchHistoryItem($event)">全文 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'CaseFlag'">
													<span @click="searchHistoryItem($event)">文号 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'CompanyName'">
													<span @click="searchHistoryItem($event)">企业名称 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'CaseFlag'">
													<span @click="searchHistoryItem($event)">案件字号 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'Category'">
													<span @click="searchHistoryItem($event)">案由 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'Core'">
													<span @click="searchHistoryItem($event)">关键词 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'Court'">
													<span @click="searchHistoryItem($event)">法院 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'LastInstanceCourt'">
													<span @click="searchHistoryItem($event)">法院 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'Judge'">
													<span @click="searchHistoryItem($event)">法官 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'AgentLawOffice'">
													<span @click="searchHistoryItem($event)">律所 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'Agent'">
													<span @click="searchHistoryItem($event)">律所 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'PartyDic'">
													<span @click="searchHistoryItem($event)">当事人 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'Party'">
													<span @click="searchHistoryItem($event)">当事人 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'DisputedIssues'">
													<span @click="searchHistoryItem($event)">核心问题 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'ConetentCpyd'">
													<span @click="searchHistoryItem($event)">裁判要点 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'RelevantLaw'">
													<span @click="searchHistoryItem($event)">相关法条 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'BasicFacts'">
													<span @click="searchHistoryItem($event)">基本案情 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'TrialAfter'">
													<span @click="searchHistoryItem($event)">审理经过 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'PlaintiffClaims'">
													<span @click="searchHistoryItem($event)">诉讼请求 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'DefenseViewpoint'">
													<span @click="searchHistoryItem($event)">辩方观点 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'ControversialFocus'">
													<span @click="searchHistoryItem($event)">争议焦点 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'Ascertain'">
													<span @click="searchHistoryItem($event)">本院查明 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'RefereeBasis'">
													<span @click="searchHistoryItem($event)">裁判依据 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'RefereeResult'">
													<span @click="searchHistoryItem($event)">裁判结果 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'JudgeReason'">
													<span @click="searchHistoryItem($event)">裁判理由 : {{item}}</span>
												</template>
												<template v-if="queryForm.scope == 'GuidingSense'">
													<span @click="searchHistoryItem($event)">指导意义 : {{item}}</span>
												</template>
											<i class="el-icon-error error_item" @click="clearHistoryItem(item,index)"></i>
										</li>
										<li class="search_txt_item" v-for="(item01,index01) in queryForm.filterList" :key="index01">
											<template v-if="item01.field == 'Category'">
												<span v-if="subChoseType=='atr'">仲裁分类：{{item01.name}}</span>
												<span v-else>案由：{{item01.name}}</span>
											</template>
											<template v-if="item01.field == 'CaseGrade'">
												<span v-if="subChoseType=='payz'">规则分类：{{item01.name}}</span>
												<span v-else>参照级别：{{item01.name}}</span>
											</template>
											<template v-if="item01.field == 'CourtGrade'">
												<span>法院级别：{{item01.name}}</span>
											</template>
											<template v-if="item01.field == 'LastInstanceCourt'">
												<span>审理法院：{{item01.name}}</span>
											</template>
											<template v-if="item01.field == 'TrialStep'">
												<span>审理程序：{{item01.name}}</span>
											</template>
											<template v-if="item01.field == 'DocumentAttr'">
												<span>文书类型：{{item01.name}}</span>
											</template>
											<template v-if="item01.field == 'TrialStepCount'">
												<span>终审结果：{{item01.name}}</span>
											</template>
											<template v-if="item01.field == 'SubjectClassification'">
												<span>专题：{{item01.name}}</span>
											</template>
											<template v-if="item01.field == 'GuideCaseReleaseApplication'">
												<span>指导性案例发布与应用：{{item01.name}}</span>
											</template>
											<template v-if="item01.field == 'InstrumentType'">
												<span>文书样式：{{item01.name}}</span>
											</template>
											<template v-if="item01.field == 'IndustryClassify'">
												<span>行业分类：{{item01.name}}</span>
											</template>
											<template v-if="item01.field == 'CorporateProperty'">
												<span>企业性质：{{item01.name}}</span>
											</template>
											<template v-if="item01.field == 'LastInstanceDate'">
												<span>审结年份：{{item01.name}}</span>
											</template>
											<template v-if="item01.field == 'SpecialCase'">
												<span>专题案例：{{item01.name}}</span>
											</template>
											<template v-if="item01.field == 'Court'">
												<span>审理法院：{{item01.name}}</span>
											</template>
											<template v-if="item01.field == 'IssueDepartment'">
												<span>裁决机构：{{item01.name}}</span>
											</template>
											<i class="el-icon-error error_item" @click="clearHistoryItem02(item01,index01)"></i>
										</li>
									</ul>
								</div>
								<div class="conditions_icon_clean" v-if="searchKeywordArr.length > 0 || queryForm.filterList.length > 0" @click="clearHistory">
									<i class="el-icon-delete"></i>清空
								</div>
							</div>
						</div>
					</el-row>
				</div>
				<div class="center_wrap" v-loading="fullscreenLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0)">
					<el-container>
						<el-aside width="300px;" style="background-color:#fff;">
							<div v-for="(item, siderBarNum) in list" :key="siderBarNum">
								<sider-bar :siderData="item" :siderBarNum="siderBarNum" @secondmenu="secondMenu"></sider-bar>
							</div>
						</el-aside>
						<!-- <el-aside  style="background-color:#fff;">
              <div
                id="siderbarWWarp"
                v-for="(item, index) in list"
                :key="index"
              >
                <div id="label">{{item.label}}</div>
                <el-tree
                  :data="item.data"
                  :props="defaultProps"
                  @node-click="(msg) => { treeClick(item.label,msg) }"
                  :default-expand-all="true"
                  :itemName="item.label"
                ></el-tree>
              </div>
            </el-aside> -->
						<el-main class="center_el_main">
							<div id="textExample">司法案例</div>
							<!-- <div class="total_wrap">
								总共检索到
								<span class="total">{{this.totalNum?this.totalNum:0}}</span>篇
							</div> -->
							<div id="filerSelect">
								<div class="filerSelect_ul_left_checkAll">
									<!-- <p class="checkAll_wrap" >
									<el-checkbox  v-model="checkAllState" @change="checkAllChange">全选</el-checkbox>
									</p>
									<p class="piliangdelete" @click="downFilesAll">
									<i class="iconfont" style="margin-right:5px;">&#xe65a;</i>批量下载
									</p> -->
									总共检索到
									<span class="total" style="color:#f35c0a;"> {{this.totalNum?this.totalNum:0}} </span>篇
								</div>
								<ul class="filerSelect_ul" id="filerSelect_ul_sort_wrap">
									<template v-if="subChoseType == 'pfnl'">

										<li class="fen_group">
											<label>分组：</label>
											<el-select v-model="queryForm.groupByIndex" placeholder="分组" @change="((item)=>{changeGroupOrTime(item)})">
												<el-option v-for="item in filerSelect_group_arr" :key="item.value" :label="item.label" :value="item.value"></el-option>
											</el-select>
										</li>

										<li class="sort_wrao_select">
											<label for>排序：</label>
											<el-select v-model="queryForm.orderByIndex" placeholder="排序" @change="((item)=>{changeGroupOrTime(item)})">
												<el-option v-for="item in filerSelect_sort_arr" :key="item.value" :label="item.label" :value="item.value"></el-option>
											</el-select>
										</li>
									</template>
									<template v-if="subChoseType == 'payz'">
										<li class="fen_group">
											<label>分组：</label>
											<el-select v-model="queryForm.groupByIndex" placeholder="分组" @change="((item)=>{changeGroupOrTime(item)})">
												<el-option v-for="item in filerSelect_group_arr01" :key="item.value" :label="item.label" :value="item.value"></el-option>
											</el-select>
										</li>

										<li class="sort_wrao_select">
											<label for>排序：</label>
											<el-select v-model="queryForm.orderByIndex" placeholder="排序" @change="((item)=>{changeGroupOrTime(item)})">
												<el-option v-for="item in filerSelect_sort_arr01" :key="item.value" :label="item.label" :value="item.value"></el-option>
											</el-select>
										</li>
									</template>
									<template v-if="subChoseType == 'gac'">
										<li class="fen_group">
											<label>分组：</label>
											<el-select v-model="queryForm.groupByIndex" placeholder="分组" @change="((item)=>{changeGroupOrTime(item)})">
												<el-option v-for="item in filerSelect_group_arr02" :key="item.value" :label="item.label" :value="item.value"></el-option>
											</el-select>
										</li>

										<li class="sort_wrao_select">
											<label for>排序：</label>
											<el-select v-model="queryForm.orderByIndex" placeholder="排序" @change="((item)=>{changeGroupOrTime(item)})">
												<el-option v-for="item in filerSelect_sort_arr02" :key="item.value" :label="item.label" :value="item.value"></el-option>
											</el-select>
										</li>
									</template>
									<template v-if="subChoseType == 'bankruptcy'">
										<li class="sort_wrao_select">
											<label for>排序：</label>
											<el-select v-model="queryForm.orderByIndex" placeholder="排序" @change="((item)=>{changeGroupOrTime(item)})">
												<el-option v-for="item in filerSelect_sort_arr" :key="item.value" :label="item.label" :value="item.value"></el-option>
											</el-select>
										</li>
									</template>
									<template v-if="subChoseType == 'pal' || subChoseType == 'atr'">
										<li class="sort_wrao_select">
											<label for>排序：</label>
											<el-select v-model="queryForm.orderByIndex" placeholder="排序" @change="((item)=>{changeGroupOrTime(item)})">
												<el-option v-for="item in filerSelect_sort_arr03" :key="item.value" :label="item.label" :value="item.value"></el-option>
											</el-select>
										</li>
									</template>
								</ul>
							</div>
							<template v-if="this.totalNum > 0">
								<template v-if="queryForm.groupByIndex == 0 ||  queryForm.groupByIndex == 1 || queryForm.groupByIndex == 3">
									<!-- //参照级别
									文书类型
									法院级别
									{{list0}} -->
									<div v-for="(item,index) in list0.group" :key="index">
										<law-content
										 	:maincontent="item"
											:contentIndex="list0.index"
											:index="index"
											:select="searchType"
											:keyword="keyWord"
											:pagesize="queryForm.size"
											:pagecount="queryForm.page"
											:defalutNum="defalutNum"
											@changePagination="changePagination"
											@compareNum="compareNumCriminal"
											:checkAllState="checkAllState"
											:checkAllList="checkAllList"
											@isCheckOne="isCheckOne"
											:dataIndex="index"
										 ></law-content>
									</div>
								</template>
								<!-- 不分组 -->
								<template v-if="queryForm.groupByIndex == 2">
									<div class="exampleList">
										<div class="exampleItem" v-for="(item2, index2) in list3.data" :key="index2">
											<div class="exampleItemTitle" >
												<!-- <span class="numb_sort_checkall">
													<el-checkbox v-model="checkAllList[index2].status" :id="item2.Gid" @change="checkedItemNogroup($event,item2,index2)"></el-checkbox>
												</span> -->
												<p class="numb_sort_checkall_p">
													<span class="numb_sort_checkall_sort">
														{{(queryForm.page-1)*queryForm.size + (index2+1)}}.
													</span>
													<!-- <a :href="'#/detail/'+maincontent.index+'/'+item.Gid" target="_blank">
														<span v-html="item.Title"></span>
													</a> -->
													<span v-html="item2.Title" @click="toDetail(item2.Gid)"></span>

													<span v-if="!item2.Title" v-html="item2.highlightFullText"  @click="toDetail(item2.Gid)"
													style="display: inline-block;width:100%;height:20px;overflow: hidden;white-space: nowrap; text-overflow: ellipsis;">
													</span>
												</p>

											</div>

											<!-- 文书类型 审理法院 案件字号;审结日期; -->
											 <template v-if="subChoseType=='payz'">
												<template v-if="item2.LastInstanceDate">
													<template >
														<div class="contentCon contentCon_display">
															规则日期：<span v-html="item2.LastInstanceDate"></span>
														</div>
													</template>
												</template>
											</template>

											<template v-else>
												<template v-if="item2.TrialStep">
													<template v-for="(item, index) in item2.TrialStep">
														<div class="contentCon contentCon_display" :key="index" v-if="item">
															<span v-html="item"></span> 
														</div>
													</template>
												</template>

												<!-- <template v-if="item2.DocumentAttr">
													<template v-for="(item, index) in item2.DocumentAttr">
														<div class="contentCon contentCon_display" :key="index" v-if="item">
															<span v-html="item"></span> / 
														</div>
													</template>
												</template> -->
												<template v-if="item2.DocumentAttr">
													<template >
														<div class="contentCon contentCon_display">
															<span v-html="item2.DocumentAttr"></span>/ 
														</div>
													</template>
												</template>

												<template v-if="item2.LastInstanceCourt">
													<template v-for="(item, index) in item2.LastInstanceCourt">
														<div class="contentCon contentCon_display" :key="index" v-if="item && (item2.LastInstanceCourt.length-1) == index">
															<span v-html="item"></span> / 
														</div>
													</template>
												</template>
												<!-- <template v-if="item2.Court">
													<template>
														<div class="contentCon contentCon_display">
															<span v-html="item2.Court"></span>/ 
														</div>
													</template>
												</template> -->
												<template v-if="item2.CaseFlag">
													<template>
														<div class="contentCon contentCon_display">
															<span v-html="item2.CaseFlag"></span> / 
														</div>
													</template>
												</template>
												<template v-if="item2.LastInstanceDate">
													<template>
														<div class="contentCon contentCon_display">
															<span v-html="item2.LastInstanceDate"></span>
														</div>
													</template>
												</template>	
											</template>
																				

											<div class="highlightFullText_wrap" v-if="item2.hitTimes != '0'&& searchType=='fulltext'">
												<div class="highlightFullText_wrap_hidden">
													<p class="ckxq_wrap-guanj_minz">
														<span class="minzhong-cishu">命中次数：</span>
														<span class="oblique-cishu">{{keyWord}} <span class="one">({{item2.hitTimes}})</span></span>
													</p>
													<p class="ckxq_wrap">
														<a href="javascript:void(0);" @click="openAllFullText($event,item2.Gid,index2)" v-show="!mingzongArr[item2.Gid]">
															展开命中
														</a>
														<a href="javascript:void(0);" @click="openAllFullText($event,item2.Gid,index2)" v-show="mingzongArr[item2.Gid]">
															收起命中
														</a>
													</p>
													<ul class="highlightFullText_wrap_ul">
														<div id="hidden_highLighter" style="display:none;">
															<li v-for="(item01,index01) in highLighter[index2]" :key="index01">
																<span v-html="item01" v-if="index01 < 5"></span>
															</li>
															<div class="fenye" v-if="item2.highLighter.length > 5">
																<el-pagination style="text-align: right;"
																background
																@current-change="handleCurrentChangeFll($event,item2.highLighter,index2)"
																:page-size="fulltextPageSize"
																:current-page.sync="currentPageFulltext[index2]"
																layout="prev,pager,next,slot"
																:total="currentFulltextTotal[index2]"
																></el-pagination>
															</div>
														</div>
														<div id="play_highLighter">
															<li v-for="(item01,index01) in item2.highLighter" :key="index01">
																<span v-html="item01" v-if="index01 < 1"></span>
															</li>
														</div>
													</ul>

												</div>
											</div>
										</div>
									</div>
								</template>
								<template v-if="queryForm.groupByIndex == 2">
									<div class="block">
										<el-pagination style="text-align: center;"
											@size-change="handleSizeChange"
											@current-change="handleCurrentChange"
											:page-sizes="[10,50,100,200,400]"
											:page-size="queryForm.size"
											layout="prev, pager, next,sizes,jumper,->,total,slot"
											:total="this.totalNum"
											:current-page.sync="queryForm.page"
											background
										></el-pagination>
									</div>
								</template>
							</template>
							<template v-if="this.totalNum <= 0 || totalNum == undefined">
								<div class="no_data_wrap">
									<img :src="no_data_logo" alt="未查询到相关数据">
									<p class="one">未查询到相关数据</p>
									<p class="two">建议您修改相关查询条件重新查询</p>
								</div>
							</template>
						</el-main>
					</el-container>
				</div>
			</div>
			<el-dialog title="高级检索" :visible.sync="advancedVisible" class="gaoji_search_dialog  gaoji_search_dialog_exp">
				<el-form :inline="true" class="advanced_form example_gao_form_dealog" ref="advancedForm" :model="advancedForm" label-width="120px">
					<div id="dialog_pfnl" v-if="subChoseType=='pfnl'">
						<el-form-item label="标题:" prop="keyword">
							<el-input v-model="advancedForm.keyword"></el-input>
						</el-form-item>
						<el-form-item label="全文:" prop="CheckFullText" class="">
							<el-input v-model="advancedForm.CheckFullText" @change="((item)=>{setTagJson(item,'024',false,'CheckFullText')})"></el-input>
							<div class="rangeType_wrap">
								<template>
									<el-radio-group v-model="rangeType">
										<template>
											<el-radio  label="" >同篇</el-radio>
											<el-radio  label="0" >同段</el-radio>
											<el-radio  label="1" >同句</el-radio>
										</template>
									</el-radio-group>
								</template>
							</div>
						</el-form-item>
						<el-form-item label="案由:" prop="Category">
							<el-select placeholder="请选择" filterable v-model="advancedForm.Category" @change="((item)=>{setTagJson(item,'010',false,'Category')})">
								<el-option v-for="(item,index) in advancedCategory" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="案件字号:" prop="CaseFlag">
							<el-input v-model="advancedForm.CaseFlag" @change="((item)=>{setTagJson(item,'001',false,'CaseFlag')})"></el-input>
						</el-form-item>
						<el-form-item label="审理法院:" prop="LastInstanceCourt">
							<el-select placeholder="请选择" filterable v-model="advancedForm.LastInstanceCourt" @change="((item)=>{setTagJson(item,'011',false,'LastInstanceCourt')})">
								<el-option v-for="(item,index) in advancedLastInstanceCourt" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="法院级别:" prop="CourtGrade">
							<el-select placeholder="请选择" filterable v-model="advancedForm.CourtGrade" @change="((item)=>{setTagJson(item,'012',false,'CourtGrade')})">
								<el-option v-for="(item,index) in advancedCourtGrade" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="审理法官:" prop="Judge">
							<el-input v-model="advancedForm.Judge" @change="((item)=>{setTagJson(item,'002',false,'Judge')})"></el-input>
						</el-form-item>
						<el-form-item label="代理律师:" prop="Agent">
							<el-input v-model="advancedForm.Agent" @change="((item)=>{setTagJson(item,'003',false,'Agent')})"></el-input>
						</el-form-item>
						<el-form-item label="审理程序:" prop="TrialStep">
							<el-select placeholder="请选择" filterable v-model="advancedForm.TrialStep" @change="((item)=>{setTagJson(item,'013',false,'TrialStep')})">
								<el-option v-for="(item,index) in advancedTrialStep" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="代理律所:" prop="Agent">
							<el-input v-model="advancedForm.Agent" @change="((item)=>{setTagJson(item,'003',false,'Agent')})"></el-input>
						</el-form-item>
						<!-- <el-form-item label="代理律所:" prop="AgentSuo">
							<el-input v-model="advancedForm.AgentSuo"
								@change="((item)=>{setTagJson(item,'004',false,'Agent')})"></el-input>
						</el-form-item> -->
						<el-form-item label="终审结果:" prop="TrialStepCount">
							<el-select placeholder="请选择" filterable v-model="advancedForm.TrialStepCount" @change="((item)=>{setTagJson(item,'014',false,'TrialStepCount')})">
								<el-option v-for="(item,index) in advancedTrialStepCount" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="文书类型:" prop="DocumentAttr">
							<el-select placeholder="请选择" filterable v-model="advancedForm.DocumentAttr" @change="((item)=>{setTagJson(item,'015',false,'DocumentAttr')})">
								<el-option v-for="(item,index) in DocumentAttr" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="审结日期:" prop="LastInstanceDate" class="date_input">
							<el-date-picker placeholder="选择日期" v-model="advancedForm.LastInstanceDate" value-format="yyyy.MM.dd" format="yyyy.MM.dd" type="daterange" @change="((item)=>{setTagJson(item,'023',true,'LastInstanceDate')})" range-separator="至"></el-date-picker>
						</el-form-item>
						<el-form-item label="关键词:" prop="Core">
							<el-input v-model="advancedForm.Core" @change="((item)=>{setTagJson(item,'005',false,'Core')})"></el-input>
						</el-form-item>
						<el-form-item label="裁判要点:" prop="CaseGist">
							<el-input v-model="advancedForm.CaseGist" @change="((item)=>{setTagJson(item,'006',false,'CaseGist')})"></el-input>
						</el-form-item>
						<el-form-item label="核心问题:" prop="DisputedIssues">
							<el-input v-model="advancedForm.DisputedIssues" @change="((item)=>{setTagJson(item,'007',false,'DisputedIssues')})"></el-input>
						</el-form-item>
						<el-form-item label="权责关键词:" prop="CriminalPunish">
							<el-select placeholder="请选择" filterable v-model="advancedForm.CriminalPunish" @change="((item)=>{setTagJson(item,'016',false,'CriminalPunish')})">
								<el-option v-for="(item,index) in CriminalPunish" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="参照级别:" prop="CaseGrade">
							<el-select placeholder="请选择" filterable v-model="advancedForm.CaseGrade" @change="((item)=>{setTagJson(item,'017',false,'CaseGrade')})">
								<el-option v-for="(item,index) in CaseGrade" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="刑罚:" prop="Criminal">
							<el-input v-model="advancedForm.Criminal" @change="((item)=>{setTagJson(item,'008',false,'Criminal')})"></el-input>
						</el-form-item>
						<el-form-item label="判定罪名:" prop="Accusation">
							<el-select placeholder="请选择" filterable v-model="advancedForm.Accusation" @change="((item)=>{setTagJson(item,'018',false,'Accusation')})">
								<el-option v-for="(item,index) in Accusation" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="案例编号:" prop="GuidingCaseNO">
							<el-input v-model="advancedForm.GuidingCaseNO" @change="((item)=>{setTagJson(item,'009',false,'GuidingCaseNO')})"></el-input>
						</el-form-item>
						<el-form-item label="附带民事赔偿:" prop="CivilLaw">
							<el-select placeholder="请选择" filterable v-model="advancedForm.CivilLaw" @change="((item)=>{setTagJson(item,'019',false,'CivilLaw')})">
								<el-option v-for="(item,index) in CivilLaw" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="案例发布日期:" prop="SourceNote">
							<el-select placeholder="请选择" filterable v-model="advancedForm.SourceNote" @change="((item)=>{setTagJson(item,'021',false,'SourceNote')})">
								<el-option v-for="(item,index) in SourceNote" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="指导案例批次:" prop="GuidingCaseDoc">
							<el-select placeholder="请选择" filterable v-model="advancedForm.GuidingCaseDoc" @change="((item)=>{setTagJson(item,'020',false,'GuidingCaseDoc')})">
								<el-option v-for="(item,index) in GuidingCaseDoc" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="公报年份:" prop="SourceNote">
							<el-select placeholder="请选择" filterable v-model="advancedForm.SourceNote" @change="((item)=>{setTagJson(item,'021',false,'SourceNote')})">
								<el-option v-for="(item,index) in SourceNote" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div id="dialog_payz" v-if="subChoseType == 'payz'">
						<el-form-item label="规则标题:" prop="DisputedIssues">
							<el-input v-model="advancedForm.DisputedIssues" @change="((item)=>{setTagJson(item,'001',false,'DisputedIssues')})"></el-input>
						</el-form-item>

						<el-form-item label="关键词:" prop="Core">
							<el-input v-model="advancedForm.Core" @change="((item)=>{setTagJson(item,'001',false,'Core')})"></el-input>
						</el-form-item>
						<el-form-item label="裁判要点:" prop="CheckFullText">
							<el-input v-model="advancedForm.CheckFullText" @change="((item)=>{setTagJson(item,'001',false,'CheckFullText')})"></el-input>
						</el-form-item>
						<el-form-item label="规则分类:" prop="CaseGrade">
							<el-select placeholder="请选择" filterable v-model="advancedForm.CaseGrade" @change="((item)=>{setTagJson(item,'011',false,'CaseGrade')})">
								<el-option v-for="(item,index) in CaseGrade" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<!-- //全文 -->

						<el-form-item label="适用法律:" prop="Summary">
							<el-input v-model="advancedForm.Summary" @change="((item)=>{setTagJson(item,'001',false,'Summary')})"></el-input>
						</el-form-item>
						<!-- 标题 -->
						<el-form-item label="渊源案例标题:" prop="keyword">
							<el-input v-model="advancedForm.keyword"></el-input>
						</el-form-item>
						<el-form-item label="规则日期:" prop="LastInstanceDate" class="date_input">
							<el-date-picker placeholder="选择日期" v-model="advancedForm.LastInstanceDate" value-format="yyyy.MM.dd" format="yyyy.MM.dd" type="daterange" @change="((item)=>{setTagJson(item,'023',true,'LastInstanceDate')})" range-separator="至"></el-date-picker>
						</el-form-item>
					</div>
					<div id="dialog_gac" v-if="subChoseType == 'gac'">
						<el-form-item label="标题:" prop="keyword">
							<el-input v-model="advancedForm.keyword"></el-input>
						</el-form-item>
						<el-form-item label="全文:" prop="CheckFullText" class="">
							<el-input v-model="advancedForm.CheckFullText" @change="((item)=>{setTagJson(item,'024',false,'CheckFullText')})"></el-input>
							<div class="rangeType_wrap">
								<template>
									<el-radio-group v-model="rangeType">
										<template>
											<el-radio  label="" >同篇</el-radio>
											<el-radio  label="0" >同段</el-radio>
											<el-radio  label="1" >同句</el-radio>
										</template>
									</el-radio-group>
								</template>
							</div>
						</el-form-item>
						<el-form-item label="案由:" prop="Category">
							<el-select placeholder="请选择" filterable v-model="advancedForm.Category" @change="((item)=>{setTagJson(item,'010',false,'Category')})">
								<el-option v-for="(item,index) in advancedCategory" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="发布机构:" prop="PublishOrgan">
							<el-select placeholder="请选择" filterable v-model="advancedForm.PublishOrgan" @change="((item)=>{setTagJson(item,'014',false,'PublishOrgan')})">
								<el-option v-for="(item,index) in PublishOrgan" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="案件字号:" prop="CaseFlag">
							<el-input v-model="advancedForm.CaseFlag" @change="((item)=>{setTagJson(item,'001',false,'CaseFlag')})"></el-input>
						</el-form-item>
						<el-form-item label="审理法院:" prop="LastInstanceCourt">
							<el-select placeholder="请选择" filterable v-model="advancedForm.LastInstanceCourt" @change="((item)=>{setTagJson(item,'011',false,'LastInstanceCourt')})">
								<el-option v-for="(item,index) in advancedLastInstanceCourt" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="法院级别:" prop="CourtGrade">
							<el-select placeholder="请选择" filterable v-model="advancedForm.CourtGrade" @change="((item)=>{setTagJson(item,'012',false,'CourtGrade')})">
								<el-option v-for="(item,index) in advancedCourtGrade" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="审理法官:" prop="Judge">
							<el-input v-model="advancedForm.Judge" @change="((item)=>{setTagJson(item,'002',false,'Judge')})"></el-input>
						</el-form-item>
						<el-form-item label="审结日期:" prop="LastInstanceDate" class="date_input">
							<el-date-picker placeholder="选择日期" v-model="advancedForm.LastInstanceDate" value-format="yyyy.MM.dd" format="yyyy.MM.dd" type="daterange" @change="((item)=>{setTagJson(item,'023',true,'LastInstanceDate')})" range-separator="至"></el-date-picker>
						</el-form-item>
						<el-form-item label="审理程序:" prop="TrialStep">
							<el-select placeholder="请选择" filterable v-model="advancedForm.TrialStep" @change="((item)=>{setTagJson(item,'013',false,'TrialStep')})">
								<el-option v-for="(item,index) in advancedTrialStep" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="代理律师:" prop="Agent">
							<el-input v-model="advancedForm.Agent" @change="((item)=>{setTagJson(item,'003',false,'Agent')})"></el-input>
						</el-form-item>
						<el-form-item label="当事人:" prop="Party">
							<el-input v-model="advancedForm.Party" @change="((item)=>{setTagJson(item,'007',false,'Party')})"></el-input>
						</el-form-item>
						<el-form-item label="代理律所:" prop="Agent">
							<el-input v-model="advancedForm.Agent" @change="((item)=>{setTagJson(item,'003',false,'Agent')})"></el-input>
						</el-form-item>
						<el-form-item label="关键词:" prop="Core">
							<el-input v-model="advancedForm.Core" @change="((item)=>{setTagJson(item,'005',false,'Core')})"></el-input>
						</el-form-item>
						<el-form-item label="判定罪名:" prop="Accusation">
							<el-select placeholder="请选择" filterable v-model="advancedForm.Accusation" @change="((item)=>{setTagJson(item,'018',false,'Accusation')})">
								<el-option v-for="(item,index) in Accusation" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="裁判要点:" prop="CaseGist">
							<el-input v-model="advancedForm.CaseGist" @change="((item)=>{setTagJson(item,'006',false,'CaseGist')})"></el-input>
						</el-form-item>

						<!-- <el-form-item label="刑罚:" prop="Criminal">
							<el-input v-model="advancedForm.Criminal"
								@change="((item)=>{setTagJson(item,'008',false,'Criminal')})"></el-input>
						</el-form-item> -->
						<el-form-item label="指导案例批次:" prop="GuidingCaseDoc">
							<el-select placeholder="请选择" filterable v-model="advancedForm.GuidingCaseDoc" @change="((item)=>{setTagJson(item,'020',false,'GuidingCaseDoc')})">
								<el-option v-for="(item,index) in GuidingCaseDoc" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="发布年份:" prop="PublishYear">
							<el-select placeholder="请选择" filterable v-model="advancedForm.PublishYear" @change="((item)=>{setTagJson(item,'015',false,'PublishYear')})">
								<el-option v-for="(item,index) in PublishYear" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="案例编号:" prop="GuidingCaseNO">
							<el-input v-model="advancedForm.GuidingCaseNO" @change="((item)=>{setTagJson(item,'009',false,'GuidingCaseNO')})"></el-input>
						</el-form-item>
						<el-form-item label="应用方式:" prop="AppliedMode">
							<el-select placeholder="请选择" filterable v-model="advancedForm.AppliedMode" @change="((item)=>{setTagJson(item,'016',false,'AppliedMode')})">
								<el-option v-for="(item,index) in AppliedMode" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="应用主体:" prop="AppliedAgents">
							<el-select placeholder="请选择" filterable v-model="advancedForm.AppliedAgents" @change="((item)=>{setTagJson(item,'019',false,'AppliedAgents')})">
								<el-option v-for="(item,index) in AppliedAgents" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="应用表述:" prop="AppliedExpression">
							<el-select placeholder="请选择" filterable v-model="advancedForm.AppliedExpression" @change="((item)=>{setTagJson(item,'017',false,'AppliedExpression')})">
								<el-option v-for="(item,index) in AppliedExpression" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="应用内容:" prop="AppliedContent">
							<el-select placeholder="请选择" filterable v-model="advancedForm.AppliedContent" @change="((item)=>{setTagJson(item,'019',false,'AppliedContent')})">
								<el-option v-for="(item,index) in AppliedContent" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="公报年份:" prop="SourceNote">
							<el-select placeholder="请选择" filterable v-model="advancedForm.SourceNote" @change="((item)=>{setTagJson(item,'021',false,'SourceNote')})">
								<el-option v-for="(item,index) in SourceNote" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="应用结果:" prop="AppliedResult">
							<el-select placeholder="请选择" filterable v-model="advancedForm.AppliedResult" @change="((item)=>{setTagJson(item,'019',false,'AppliedResult')})">
								<el-option v-for="(item,index) in AppliedResult" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div id="dialog_bankruptcy" v-if="subChoseType == 'bankruptcy'">
						<el-form-item label="标题:" prop="keyword">
							<el-input v-model="advancedForm.keyword"></el-input>
						</el-form-item>
						<el-form-item label="全文:" prop="CheckFullText" class="">
							<el-input v-model="advancedForm.CheckFullText" @change="((item)=>{setTagJson(item,'024',false,'CheckFullText')})"></el-input>
							<div class="rangeType_wrap">
								<template>
									<el-radio-group v-model="rangeType">
										<template>
											<el-radio  label="" >同篇</el-radio>
											<el-radio  label="0" >同段</el-radio>
											<el-radio  label="1" >同句</el-radio>
										</template>
									</el-radio-group>
								</template>
							</div>
						</el-form-item>
						<el-form-item label="文书样式:" prop="InstrumentType">
							<el-select placeholder="请选择" filterable v-model="advancedForm.InstrumentType" @change="((item)=>{setTagJson(item,'019',false,'InstrumentType')})">
								<el-option v-for="(item,index) in InstrumentType" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="文号:" prop="CaseFlag">
							<el-input v-model="advancedForm.CaseFlag" @change="((item)=>{setTagJson(item,'001',false,'CaseFlag')})"></el-input>
						</el-form-item>
						<el-form-item label="文书类型:" prop="DocumentAttr">
							<el-select placeholder="请选择" filterable v-model="advancedForm.DocumentAttr" @change="((item)=>{setTagJson(item,'015',false,'DocumentAttr')})">
								<el-option v-for="(item,index) in DocumentAttr" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="发布日期:" prop="IssueDate" class="date_input">
							<el-date-picker placeholder="选择日期" v-model="advancedForm.IssueDate" value-format="yyyy.MM.dd" format="yyyy.MM.dd" type="daterange" @change="((item)=>{setTagJson(item,'022',true,'IssueDate')})" range-separator="至"></el-date-picker>
						</el-form-item>

						<el-form-item label="企业名称:" prop="CompanyName">
							<el-input v-model="advancedForm.CompanyName" @change="((item)=>{setTagJson(item,'001',false,'CompanyName')})"></el-input>
						</el-form-item>
						<el-form-item label="参照级别:" prop="CaseGrade">
							<el-select placeholder="请选择" filterable v-model="advancedForm.CaseGrade" @change="((item)=>{setTagJson(item,'011',false,'CaseGrade')})">
								<el-option v-for="(item,index) in CaseGrade" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="受理法院:" prop="AppellateCourt">
							<el-select placeholder="请选择" filterable v-model="advancedForm.AppellateCourt" @change="((item)=>{setTagJson(item,'011',false,'AppellateCourt')})">
								<el-option v-for="(item,index) in AppellateCourt" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="法院级别:" prop="CourtGrade">
							<el-select placeholder="请选择" filterable v-model="advancedForm.CourtGrade" @change="((item)=>{setTagJson(item,'012',false,'CourtGrade')})">
								<el-option v-for="(item,index) in advancedCourtGrade" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="审理法官:" prop="Judge">
							<el-input v-model="advancedForm.Judge" @change="((item)=>{setTagJson(item,'002',false,'Judge')})"></el-input>
						</el-form-item>
						<el-form-item label="行业分类:" prop="IndustryClassify">
							<el-select placeholder="请选择" filterable v-model="advancedForm.IndustryClassify" @change="((item)=>{setTagJson(item,'012',false,'IndustryClassify')})">
								<el-option v-for="(item,index) in IndustryClassify" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="企业性质:" prop="CorporateProperty">
							<el-select placeholder="请选择" filterable v-model="advancedForm.CorporateProperty" @change="((item)=>{setTagJson(item,'012',false,'CorporateProperty')})">
								<el-option v-for="(item,index) in CorporateProperty" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>

					</div>
					<div id="dialog_pal" v-if="subChoseType == 'pal'">
						<el-form-item label="标题:" prop="keyword">
							<el-input v-model="advancedForm.keyword"></el-input>
						</el-form-item>
						<el-form-item label="全文:" prop="CheckFullText" class="">
							<el-input v-model="advancedForm.CheckFullText" @change="((item)=>{setTagJson(item,'024',false,'CheckFullText')})"></el-input>
							<div class="rangeType_wrap">
								<template>
									<el-radio-group v-model="rangeType">
										<template>
											<el-radio  label="" >同篇</el-radio>
											<el-radio  label="0" >同段</el-radio>
											<el-radio  label="1" >同句</el-radio>
										</template>
									</el-radio-group>
								</template>
							</div>
						</el-form-item>
						<el-form-item label="案由:" prop="Category">
							<el-select placeholder="请选择" filterable v-model="advancedForm.Category" @change="((item)=>{setTagJson(item,'010',false,'Category')})">
								<el-option v-for="(item,index) in advancedCategory" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="审理法院:" prop="LastInstanceCourt">
							<el-select placeholder="请选择" filterable v-model="advancedForm.LastInstanceCourt" @change="((item)=>{setTagJson(item,'011',false,'LastInstanceCourt')})">
								<el-option v-for="(item,index) in advancedLastInstanceCourt" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="案例特征:" prop="ColumnName">
							<el-select placeholder="请选择" filterable v-model="advancedForm.ColumnName" @change="((item)=>{setTagJson(item,'011',false,'ColumnName')})">
								<el-option v-for="(item,index) in ColumnName" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="专题案例:" prop="SpecialCase">
							<el-select placeholder="请选择" filterable v-model="advancedForm.SpecialCase" @change="((item)=>{setTagJson(item,'011',false,'SpecialCase')})">
								<el-option v-for="(item,index) in SpecialCase" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="发布日期:" prop="IssueDate" class="date_input">
							<el-date-picker placeholder="选择日期" v-model="advancedForm.IssueDate" value-format="yyyy.MM.dd" format="yyyy.MM.dd" type="daterange" @change="((item)=>{setTagJson(item,'022',true,'IssueDate')})" range-separator="至"></el-date-picker>
						</el-form-item>
						<el-form-item label="当事人:" prop="Party">
							<el-input v-model="advancedForm.Party" @change="((item)=>{setTagJson(item,'007',false,'Party')})"></el-input>
						</el-form-item>
					</div>
					<div id="dialog_atr" v-if="subChoseType == 'atr'">
						<el-form-item label="标题:" prop="keyword">
							<el-input v-model="advancedForm.keyword"></el-input>
						</el-form-item>
						<el-form-item label="全文:" prop="CheckFullText" class="">
							<el-input v-model="advancedForm.CheckFullText" @change="((item)=>{setTagJson(item,'024',false,'CheckFullText')})"></el-input>
							<div class="rangeType_wrap">
								<template>
									<el-radio-group v-model="rangeType">
										<template>
											<el-radio  label="" >同篇</el-radio>
											<el-radio  label="0" >同段</el-radio>
											<el-radio  label="1" >同句</el-radio>
										</template>
									</el-radio-group>
								</template>
							</div>
						</el-form-item>
						<el-form-item label="裁决机构:" prop="IssueDepartment">
							<el-select placeholder="请选择" filterable v-model="advancedForm.IssueDepartment" @change="((item)=>{setTagJson(item,'011',false,'IssueDepartment')})">
								<el-option v-for="(item,index) in IssueDepartment" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="仲裁分类:" prop="Category">
							<el-select placeholder="请选择" filterable v-model="advancedForm.Category" @change="((item)=>{setTagJson(item,'011',false,'Category')})">
								<el-option v-for="(item,index) in advancedCategory" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="裁决日期:" prop="IssueDate" class="date_input">
							<el-date-picker placeholder="选择日期" v-model="advancedForm.IssueDate" value-format="yyyy.MM.dd" format="yyyy.MM.dd" type="daterange" @change="((item)=>{setTagJson(item,'022',true,'IssueDate')})" range-separator="至"></el-date-picker>
						</el-form-item>
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
	import qs from "qs";
	import {addKeyWordHistory, hotKeywordQuery,getAggs, getCases, addSearch, getJSON, getCollectList ,showKeyWordHistory,showLikeQuery} from "../../api";
	import { getZYLawSelect,Download } from "../../select_api"
	import Publichead from "@/components/headerCommen";

	export default {
		index: "0",
		name: "index",
		components: {
			siderBar,
			lawContent,
			cricaseSiderbar,
			Publichead
		},
		data() {
			return {
        Core:"",
        selectStatus:false,
				// 全选
				checkAllState:false,
				checkAllList:[],//全选
				checkAllListArr:[],//全选
				checkAllListJson:{},//全选
        keywordsDrop:[],
			  searchTypeOfManyWorld:false,
				// 有关命中分页的参数
        		currentFulltextTotal:[],
				currentPageFulltext:[],
				currentFulltextData:[],
				fulltextPageSize:5,
				highLighter:[],
				mingzongArr:{},

				searchTypePfnlArr:[
				],//搜索框下拉搜索类型
				showPrise:false,
                showRentPrise:false,

				total_pfnl: 0,
				total_payz: 0,
				total_gac: 0,
				total_bankruptcy: 0,
				total_pal: 0,
				total_atr: 0,
				openOrClose: "展开",
				openAllFullTextFlag: false,

				fullscreenLoading: true,
				defalutNum: -1,
				no_data_logo: '../../static/img/no_data.png',
				headerArr: {
					activeIndex: "example",
					logo_url: "../../static/img/logoo.png"
				},
				tab_nav_select: "pfnl", //默认tab选择
				filerSelect_group: "0", //分组默认选择
				filerSelect_group_arr: [{
						value: 2,
						label: "不分组"
					},
					{
						value: 0,
						label: "参照级别"
					},
					{
						value: 1,
						label: "文书类型"
					},
					{
						value: 3,
						label: "法院级别"
					}
				],
				filerSelect_sort: "3",
				filerSelect_sort_arr: [{
						value: 0,
						label: "↓ 审结日期"
					},
					{
						value: 1,
						label: "↑ 审结日期"
					}
				],
				filerSelect_group_arr01: [{
						value: 2,
						label: "不分组"
					},
					{
						value: 0,
						label: "规则分类"
					},
				],
				filerSelect_sort_arr01: [{
						value: 0,
						label: "↓ 规则日期"
					},
					{
						value: 1,
						label: "↑ 规则日期"
					}
				],
				filerSelect_group_arr02: [{
						value: 2,
						label: "不分组"
					},
					{
						value: 0,
						label: "案例分类"
					},
				],
				filerSelect_sort_arr02: [{
						value: 0,
						label: "↓ 审结日期"
					},
					{
						value: 1,
						label: "↑ 审结日期"
					}
				],
				filerSelect_sort_arr03: [{
						value: 0,
						label: "↓ 发布日期"
					},
					{
						value: 1,
						label: "↑ 发布日期"
					}
				],
				//new
				currentNum: "1",
				currentTotalNum: "4",
				currentTotalData: [],
				//历史检索、
				searchKeywordArr: [],
				pageSize: 10,
				pagenum: 1,
				// 搜索框
				keyWord: "",
				// 展示的总数据量
				totalNum: 10,
				// 左侧树状
				list: [],
				// 有分组的时候
				list2: [],
				list0: [], //参照级别
				list01: [], //文书类型
				list03: [], //法院级别
				list04: [], //规则分类
				list05: [], //案例分类
				// 无分组的时候
				list3: [],
				// 展示有分组list2或者无分组list3，true表示有分组
				showLists: false,
				searchType: "1",//默认 选择默认
				searchType2:false,
				searchType_gao: false,
				queryForm: {
					"scope": "default",
					"sort": "date",
					"page": 1,
					"size": 10,
					"index": "pfnl",
					"keyword": "",
					"group": false,
					"orderByIndex": 0,
					"groupByIndex": 2,
					"title": "",
					"filterList": [],
					"modules": [1, 2, 3],
					"tagJson": [],
				},
				subChoseType: 'pfnl', //index
				data: [{
						label: "刑事（112）",
						children: [{
							label: "刑事1-1",
							children: [{
								label: "刑事1-1-1"
							}]
						}]
					},
					{
						label: "民事（252）",
						children: [{
								label: "民事2-1",
								children: [{
									label: "民事2-1-1"
								}]
							},
							{
								label: "民事2-2",
								children: [{
									label: "民事2-2-1"
								}]
							}
						]
					},
					{
						label: "知识产权（22）",
						children: [{
								label: "知识产权3-1",
								children: [{
									label: "知识产权3-1-1"
								}]
							},
							{
								label: "知识产权3-2",
								children: [{
									label: "知识产权3-2-1"
								}]
							}
						]
					}
				],
				defaultProps: {
					label: function(data, node) {
						return data.label + "(" + data.count + ")";
					}
				},
				categories: [{
						value: "",
						label: "不分组"
					},
					{
						value: "cz",
						label: "文书类型"
					},
					{
						value: "lt",
						label: "案例等级"
					},
					{
						value: "cl",
						label: "法院层级"
					}
				],
				navbarVal: {
					pfnl: "",
					payz: "",
					gac: "",
					bankruptcy: "",
					pal: "",
					atr: "",
				},
				category: "",
				// 用来传递给后台的分组的值，因为点击更多的时候，要传递给后台的分组值是空的，但是页面上缺需要显示你选中的分组值
				apiCategory: "",
				sortType: "relate",
				tagJson: [],
				filterList: [],
				advancedVisible: false,
				advancedForm: {
					//刑事法规参数
					scope: "default", //顶部搜索框作用域
					sort: "date", //排序规则
					page: 1, //分页页码
					size: 10, //分页大小，
					index: "pfnl", //索引标识
					keyword: "", //顶部检索框字段值
					group: false, //是否分组查询(仅中央和地方)
					title: "", //右下侧结果中检索字段值、案例标题
					groupByIndex: 2,
					orderByIndex: 0,
					filterList: [],
					modules: [
						//需要返回数据模块
						1, //左侧聚类数据
						2, //上侧统计数据
						3 //右下侧结果列表
					],
					tagJson: [],
					GuidingCaseNO: "",
					LastInstanceCourt: "", //审理法院
					CourtGrade: "", //法院级别
					Category: "", //案由
					Judge: "", //审理法官
					TrialStep: "", //受理程序
					TrialStepCount: "", //审理结果
					Core: "", //关键字
					CaseGist: "", //裁判要点
					CriminalPunish: "", //全责关键词
					Agent: "", //代理律师/
					AgentSuo: '', //律所
					DocumentAttr: "", //文书类型
					LastInstanceDate: "", //审结日期
					DisputedIssues: "", //核心问题
					CaseGrade: "", //参考级别
					Accusation: "", //判定罪名
					CivilLaw: "", //附带民事赔偿
					GuidingCaseDoc: "", //指导案例批次
					SourceNote: "", //公报年份
					Summary: "", //适用法律
					PublishOrgan: "", //发布机构
					Party: "", //当事人
					PublishYear: "", //发布年份
					AppliedMode: "", //应用
					AppliedExpression: "", //应用
					AppliedAgents: "", //应用
					AppliedContent: "", //应用
					AppliedResult: "", //应用
					InstrumentType: "",
					CompanyName: "",
					AppellateCourt: "",
					CorporateProperty: "",
					IndustryClassify: "",
					ColumnName: "", // 案例特征:
					SpecialCase: "", //专题案例
					// ategory:"",//仲裁分类
					IssueDepartment: "", //裁决机构
				},
				// ategory:[],//仲裁分类
				IssueDepartment: [], //裁决机构
				SpecialCase: [], //专题案例
				ColumnName: [], // 案例特征:
				InstrumentType: [],
				CompanyName: [],
				AppellateCourt: [],
				CorporateProperty: [],
				IndustryClassify: [],
				PublishYear: [],
				AppliedMode: [], //应用
				AppliedExpression: [], //应用
				AppliedAgents: [], //应用
				AppliedContent: [], //应用
				AppliedResult: [], //应用
				PublishOrgan: [], //发布机构
				advancedCategory: [], //案由
				advancedLastInstanceCourt: [], //审理法院
				advancedCourtGrade: [], //法院级别
				advancedTrialStep: [], //审理程序
				advancedTrialStepCount: [], //审理结果
				DocumentAttr: [], //文书类型
				CaseGrade: [], //参考级别
				Accusation: [], //判定罪名
				CivilLaw: [], //附带民事赔偿
				GuidingCaseDoc: [], //指导案例批次
				SourceNote: [], //公报年份
				CriminalPunish: [], //权责关键词
				gao_list: [], //高级检索list
				inquiryMode: '', //精確模糊
				rangeType: '', //同篇 同句 同---等等 同篇 默认无惨
				isSearchHistory: true, //是否保存key值
				myData: [],
				keyWord: '',
				now: -1,
				nowScope:'title',
				titnowScope:'title'
			};
		},
		created: function() {
			document.title = this.$route.meta.title;

			if(window.location.href.indexOf("keyword") != -1) {
				this.keyWord = decodeURIComponent(window.location.href.split("keyword=")[1]);
			} else {
				this.keyWord = this.$route.params.keyword || "";
			}
			// this.getLeftTree();
			this.queryForm.keyword = this.keyWord;
			this.search();
			// getCollectList().then(res => {
			// 	// console.log(res)
			// });
		},
    watch :{
			
      keyWord: function(key){

        if(key){
          console.log(key,"---------------------相关----------------------");
          hotKeywordQuery(key,"case").then(res =>{
            if(res){
				console.log(res,"热搜词搜索");
				var resultList = [];
				if(res.data.success){
					$(".examplelishiorothertips_main_wrap").css({'display':'block'});
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


      }
    } ,
		methods: {
			changeRangeType(i){
	
				if(i=='1'){
					this.rangeType = "";
					this.searchType2= true
				}else{
					this.searchType2= false
				}
				
			},
      updateKey(key){
        console.log("gengxin信息情况!");
        var flag = true;
        while(flag){
          var result = key.indexOf("#");
          if(result == -1){
            flag = false
          }else{
            key=  key.replace("#","、")
          }
        }
       return key;
      },
      getKeywords(key,e){
		console.log(key,'--------------------点击 搜索 热刺------------------',$(e.target),$(e.target)[0].innerText);
       	this.keyWord = $(e.target)[0].innerText;
      	this.getList();
      },
			// 全选
			checkAllChange(val){
				console.log(this.checkAllState,'全选状态更改-------------------',this.filerSelect_group);
				let _this = this;
				if(this.queryForm.groupByIndex == 2 || this.this.queryForm.groupByIndex == '2'){
					// 不分组 处理
					this.checkAllListArr=[];
					this.checkAllList.forEach((ele,index)=>{
						ele.status = this.checkAllState;
					});
					console.log(this.checkAllList,'---------------不分组时----------------');
				}
				console.log(_this.checkAllList,'-------_this.checkAllList----------------',this.checkAllListArr,this.checkAllListJson)
			},
			// 批量下载
			downFilesAll(){
				console.log('批量下载----------------------------',this.checkAllList)
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
				downArr = downArr.join(",");
				console.log('----------------下载目标文件id数组----------------',downArr);
          var gid = downArr;
          var index = this.subChoseType;
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
			// 不分组单个选择
			checkedItemNogroup(val,item,index){
				let _this = this;
				console.log('--------------不分组单个选择-------------',val,this.checkAllList,item,index);
				this.checkAllList.forEach((ele,index)=>{
					if(ele.Gid == item.Gid){
						ele.status = val;
					}
				});
				console.log('--------------不分组单个选择结果-------------',val,this.checkAllList,item,index);
				for(let xy = 0; xy < this.checkAllList.length;xy++){
					if(!_this.checkAllList[xy].status){
						_this.checkAllState = false;
						break;
					}else{
						_this.checkAllState = true;
					}
				}
			},
			fenyecaozuoChange: function(val) {
				console.log("----------分页操作---------------", val);
				this.checkAllState = false;
			},
			// 全选初始化 方法
			initCheckAll(groupByIndex,data){
				console.log('初始数据，',groupByIndex,data)
				let _this = this;
                this.checkAllList = [];
                if(groupByIndex != 2 && groupByIndex != '2'){
                  data.group.forEach((ele,index) => {
                    ele.data.forEach((ele2,index2) => {
                      _this.checkAllList.push({
                        Gid:ele2.Gid,
                        status:false,
                      });
                      // this.$set(_this.checkAllListArr, ele.Gid, true);
                    });
                  });
                }else{
                  data.data.forEach((ele,index) => {
                    // ele.data.forEach((ele2,index2) => {
                      _this.checkAllList.push({
                        Gid:ele.Gid,
                        status:false,
                      });
                      // this.$set(_this.checkAllListArr, ele.Gid, true);
                    // });
                  });
                }
                console.log("-----------------全选更改or初始化数据-------------------",this.checkAllList,this.queryForm.groupByIndex);
			},
            kaishi(){
				this.showPrise = !this.showPrise;
				this.showRentPrise = !this.showRentPrise;
			},
			//展开
			// 全文分页
			packUp(){
			// currentFulltextTotal
			let _this = this;
			_this.currentFulltextTotal =[];
			_this.currentPageFulltext=[],
			_this.highLighter = [];
			console.log(_this.list3.data,'-------------packUp-------------------')
			_this.list3.data.forEach((ele,index)=>{
				// hitTimes
				_this.currentFulltextTotal.push(ele.highLighter.length);
				_this.currentPageFulltext.push(1);
				_this.highLighter.push(ele.highLighter);
			});
			console.log(_this.currentFulltextTotal,this.highLighter);
			},
			// 全文分页
			handleCurrentChangeFll(val,data,index) {
			// this.highLighter[index] = this.doPagation(val,data);
			this.$set(this.highLighter, index, this.doPagation(val,data));
			console.log('--------quanwenfeny------',val,index,this.highLighter[index],this.highLighter);
			},
			//获取当前的数组
			doPagation: function(num, data) {
			let arry = data.slice((num - 1) * 5, num * 5);
			return arry;
			},



			openAllFullText(e,currentId,index) {

			console.log($(e.target),'4444444444444444444444444444444444444')
			this.packUp();
			if(this.mingzongArr[currentId] == true){
				this.$set(this.mingzongArr, currentId, false);
				console.log('4444444444对444444444444444444444444444',this.mingzongArr[currentId])
				$(e.target).parents(".highlightFullText_wrap_hidden").find("#hidden_highLighter").css("display", "none");
				$(e.target).parents(".highlightFullText_wrap_hidden").find("#play_highLighter").css("display", "block");

			}else{
				// 展开命中显示
				this.$set(this.mingzongArr, currentId, true);
				console.log('4444444444错444444444444444444444444444',this.mingzongArr[currentId])
				$(e.target).parents(".highlightFullText_wrap_hidden").find("#hidden_highLighter").css("display", "block");
				$(e.target).parents(".highlightFullText_wrap_hidden").find("#play_highLighter").css("display", "none");
			}
			},
			titleChange(val, type) {
				console.log('-----------搜索框下拉类型 更改------------------',val,type,this.searchType);
				this.queryForm.scope = val;
				if(val == "1"){
					this.queryForm.scope = "default";
					this.inquiryMode = "";
					this.rangeType = "";
				}else{
					this.queryForm.scope = val;
					if(val == "title"){
						this.inquiryMode = "0";
						this.rangeType = "";
					}else if(val == "fulltext"){
						this.inquiryMode = "0";
						this.rangeType = "";
					}else{
						this.inquiryMode = "";
						this.rangeType = "";
					}
				}
			},
			//f分组排序
			changeGroupOrTime(value) {
				this.defalutNum = -1;
				this.checkAllState = false;
				this.search();
			},
			//头补选中
			handleSelect(queryData) {
				console.log(queryData, "---------------------------------------------");
			},
			//search方法的index参数如何获得
			selectIndex: function(index) {
				console.log("--------------tab更改时---------------参数", index);
				this.subChoseType = index;
				this.inquiryMode = "0";
				this.rangeType = "";
				if(index == 'pfnl'){
					this.searchType = "1";
					this.inquiryMode = "";
					this.queryForm.scope = 'default';
				}else{
					this.searchType = "title";
					this.queryForm.scope = this.searchType;
				}
				


				this.queryForm.inquiryMode = this.inquiryMode ? parseInt(this.inquiryMode) : "";
				this.queryForm.rangeType =  this.rangeType ? parseInt(this.rangeType) : "";
				this.filterList = [];
				this.queryForm.tagJson = [];
				this.keyWord = "",
				this.queryForm.groupByIndex = 2;
				this.orderByIndex = 0;
				this.queryForm.page = 1;
				this.defalutNum = -1;
				this.checkAllState = false;
				this.search();

			},
			// 清空搜索历史
			clearHistory() {
				this.searchKeywordArr = [];
				// this.nowScope = this.queryForm.scope;
				sessionStorage.removeItem('searchKeyword_example');
				this.keyWord = "";
				this.tagJson = [];
				this.filterList = [];
				this.queryForm.filterList = [];
				this.advancedForm.tagJson = [];
				this.queryForm.tagJson = [];
				this.advancedForm.filterList = [];
			//	this.queryForm.keyword = this.keyWord;
				this.queryForm.keyword = null;
				this.queryForm.title = null;
				this.search();
			},
			//清空选项
			clearHistoryItem(item, index) {
              console.log(item,"入参");
           var title = this.queryForm.title;
              console.log(title,"title");
           var keyword = this.queryForm.keyword;
              console.log(keyword,"keyword");

           if( item == title){
             this.queryForm.title =null;
           }
           if(item == keyword ){
             console.log(this.queryForm.title)
             if(this.queryForm.title){
             this.queryForm.keyword = this.queryForm.title;
             }else{
               this.queryForm.keyword =null;
             }
             this.queryForm.title =null;
           }
		this.searchTypeOfManyWorld =false;
		this.keyWord = this.queryForm.keyword;
        this.search();
			},
			// 清空聚类
			clearHistoryItem02(item,index){
				var _this = this;
				console.log(this.queryForm.filterList,item,index,'------------------------左侧聚类查询条件删除---------------')
				this.queryForm.filterList.forEach((ele,index02)=>{
					if(ele.field == item.field){
					_this.queryForm.filterList.splice(index02,1);
					}
				});
				this.getList();
			},
			searchHistoryItem(event) {
				console.log(999);
				this.keyWord = $(event.target).html();
				this.queryForm.keyword = this.keyWord;
				this.search();
			},
			//二级菜单分类
			secondMenu: function(jueryData) {
				console.log('----------------------点击左侧聚类查询数据--------------------',jueryData)
				if(jueryData.field == 'LastInstanceDate'){
					jueryData.type = "date";
				}
				let filterList = this.queryForm.filterList;
				for(let i in filterList) {
					if(jueryData.field == filterList[i].field) {
						filterList.splice(i, 1, jueryData);
						this.queryForm.filterList = filterList;
						// this.cricaseQueryWord.page = 1;
						this.queryForm.page = 1;
						this.search();
						return;
					}
				}
				filterList.push(jueryData);
				this.queryForm.filterList = filterList;
				// this.cricaseQueryWord.page = 1;
				this.queryForm.page = 1;
				this.search();
			},

			//分页
			handleCurrentChange(val) {
				this.pagenum = val;
				if(this.searchType_gao) {
					this.advancedForm.page = val;
					this.advancedForm.size = this.pageSize;
					this.advancedSearch('advancedForm');
				} else {
					this.queryForm.page = val;
					this.queryForm.size = this.pageSize;
					this.search();
				}

				$(".highlightFullText_wrap_hidden").find("#hidden_highLighter").css("display", "none");
				$(".highlightFullText_wrap_hidden").find("#play_highLighter").css("display", "block");
				this.mingzongArr={};
				this.checkAllState = false;
				$(document).scrollTop(0);
			},
			handleSizeChange(val) {
				this.pageSize = val;
				if(this.searchType_gao) {
					this.advancedForm.page = this.pagenum;
					this.advancedForm.size = val;
					this.advancedSearch('advancedForm');
				} else {
					this.queryForm.page = this.pagenum;
					this.queryForm.size = val;
					this.search();
				}
				$(".highlightFullText_wrap_hidden").find("#hidden_highLighter").css("display", "none");
				$(".highlightFullText_wrap_hidden").find("#play_highLighter").css("display", "block");
				this.mingzongArr={};
				this.checkAllState = false;
				$(document).scrollTop(0);
			},
      hiddenAll(){
        this.selectStatus =false;
      },
      //查询搜索的历史
      findHistory(){
        this.selectStatus =true;
        console.log("历史",this.type);

        if(this.keyword == null ||this.keyword==undefined || this.keyword == '' ){
          showKeyWordHistory("case").then(res=>{
            console.log(res,"-----------------搜索历史--------------------");
            if(res){
              var  resultList = [];
              if( res.data.data) {
				  $(".examplelishiorothertips_main_wrap").css({'display':'block'});
                res.data.data.forEach(key => {
                  var result = {
                    name: key.keyword,
                    value: key.keyword,
                  }
                  resultList.push(result);
                })
              }
              this.keywordsDrop = resultList;
              console.log(this.keywordsDrop,"下拉条中的搜索历史")
            }

          })
        }
	  },
	  findHistoryBlur(){
		setTimeout(function () {
			$(".examplelishiorothertips_main_wrap").css({'display':'none'});
		},1000);
	  },




			// 搜索框 搜索按钮
			getList() {
				this.searchTypeOfManyWorld =false;
				console.log(22222)
				this.nowScope = this.queryForm.scope;
				console.log('---------------------搜索参数传递------------------',this.queryForm,this.rangeType,this.inquiryMode);
				this.queryForm.title = '';
				this.queryForm.rangeType = this.rangeType ? parseInt(this.rangeType) : "";
				this.queryForm.inquiryMode = this.inquiryMode ? parseInt(this.inquiryMode) : "";
				this.queryForm.keyword = this.keyWord;
				this.queryForm.page = 1;
				this.search();
				sessionStorage.setItem("keywordExp",this.keyWord);
				var url = this.$route.path;
				var absolutePath = window.location.href;
				addSearch(this.keyWord, url);
			},
			// 结果中检索
			resultGetList(){
				console.log('000')
				// this.titnowScope = this.queryForm.scope;
        		this.searchTypeOfManyWorld = true;
				console.log('---------------------结果中检索参数-----------------',this.queryForm);
				this.queryForm.keyword = sessionStorage.getItem("keywordExp") ? sessionStorage.getItem("keywordExp") : "";
				this.queryForm.title = this.keyWord;
				this.queryForm.page = 1;
				this.search();
				var url = this.$route.path;
				var absolutePath = window.location.href;
				addSearch(this.keyWord, url);
			},
			// 改变分组类型的时候，将apiCategory和选中的分组值同步，并且改变showLists，如果选择的是有分组的的，那么要展示有分组的list2，即showLists是true，否则反之
			changeCategory(category) {
				this.apiCategory = category;
				if(category) {
					this.showLists = true;
				} else {
					this.showLists = false;
				}
				this.search();
			},
			// 点击更多的时候，将传递给后台的apiCategory赋值为空，并且将showLists变成false，表示显示list3，即不分组
			more(msg) {
				let isAdd = true;
				this.showLists = false;
				this.apiCategory = "";
				let data = {
					id: msg.id,
					data_type: msg.itemtype,
					name: "法院层级",
					namelist: [msg.itemname],
					fieldname: msg.related,
					itemlist: [msg.itemkey],
					relatetype: "or",
					adv_type: "exact",
					min: "",
					max: "",
					relatevalue: "",
					searchhistory: ""
				};
				this.tagJson.forEach((item, index) => {
					if(item.name == data.name) {
						this.tagJson[index] = data;
						isAdd = false;
					}
				});
				if(isAdd) {
					this.tagJson.push(data);
				}

				this.getLeftTree();
				this.search();
			},
			// 点击树状的时候
			treeClick(name, msg) {
				let isAdd = true;
				// console.log(name, msg);
				let data = {
					id: msg.id,
					data_type: msg.itemtype,
					name,
					namelist: [msg.itemname],
					fieldname: msg.related,
					itemlist: [msg.itemkey],
					relatetype: "or",
					adv_type: "exact",
					min: "",
					max: "",
					relatevalue: "",
					searchhistory: ""
				};
				this.tagJson.forEach((item, index) => {
					if(item.name == data.name) {
						this.tagJson[index] = data;
						isAdd = false;
					}
				});
				if(isAdd) {
					this.tagJson.push(data);
				}
				this.getLeftTree();
				this.search();
			},
			// 改变相关性或者时间
			changeSortType(sortType) {
				this.sortType = sortType;
				this.search();
			},
      //搜索方法
			search() {
        		this.selectStatus =false;
				// if(this.keyWord==""){
				//   return;
				// }
				this.fullscreenLoading = true;
				let data = this.queryForm;
				// data.keyword = this.keyWord;
				data.filterList = this.filterList;
				data.index = this.subChoseType;
				// this.axios.post(`/xsfb/criminal/search`, data).then(res => {
				// 	// console.log('--------------------search-----------------',res);
				// 	if(res.status == 200){
				// 		this.totalNum=res.data.maincontent[0].total;
				// 		this.list=res.data.sidebar;
				// 		if(this.showLists == true){
				// 			this.list2=res.data.maincontent[0];
				// 		}else{
				// 			this.list3=res.data.maincontent[0];
				// 		}
				// 	}else{
				// 		this.$message({
				// 		  type: 'info',
				// 		  message: '获取数据失败，请稍后再试!'
				// 		});
				// 	}
				// 	// console.log(this.list2,this.list3)
				// });

				console.log(data, '-----------search查询参数-----------------------')
				this.axios.post(`/json`, data, {
					headers: {
						_api_name: "fb_criminal",
						_api_version: "1.0.0"
					}
				}).then(res => {
					console.log(res, '-----------search查询返回数据-----------------------')
					this.fullscreenLoading = false;
					if(res.status == 200) {
						if(res.data.result != 'XSS_ATTACK') {
							if(res.data.maincontent.length > 0) {
								this.totalNum = res.data.maincontent[0].total;
								this.list = res.data.sidebar;
								this.navbarVal = res.data.navbar;
								if(this.queryForm.groupByIndex == 2) {
									this.list3 = res.data.maincontent[0];
									this.initCheckAll(2,this.list3);
									if(this.queryForm.scope != 'fulltext'){
										this.list3.data.forEach((ele,index)=>{
											ele.hitTimes='0';
											ele.highLighter="";
										});
									}
								} else {
									this.list0 = res.data.maincontent[0];
									this.initCheckAll(1,this.list0);
									if(this.queryForm.scope != 'fulltext'){
										this.list0.group.forEach((ele,index)=>{
											ele.data.forEach((ele22,index22) => {
												ele22.hitTimes='0';
												ele22.highLighter="";
											});
										});
									}

								}
							} else {
								this.totalNum = 0;
								this.list = res.data.sidebar;
								this.navbarVal = res.data.navbar;
								if(this.queryForm.groupByIndex == 2) {
									this.list3 = [];
								} else {
									this.list0 = [];
								}
							}
						} else if(res.data.result == 'XSS_ATTACK') {
							this.totalNum = 0;
							this.list = res.data.sidebar;
						}


					} else {
						this.$message({
							type: 'info',
							message: '获取数据失败，请稍后再试!'
						});
					}
				});
				console.log(12122)
        if(this.searchTypeOfManyWorld) {
            this.searchKeywordArr =[];

            if( this.queryForm.keyword){
              this.searchKeywordArr.push(this.queryForm.keyword);
            }
            if(this.queryForm.title){
              this.searchKeywordArr.push(this.queryForm.title);
            }
          sessionStorage.setItem('searchKeyword_example', this.searchKeywordArr);
        }else{
          this.searchKeywordArr = [];
          if(this.queryForm.keyword){
            this.searchKeywordArr.push(this.queryForm.keyword)
            sessionStorage.setItem('searchKeyword_example', this.searchKeywordArr);
          }else{
          this.searchKeywordArr = [];
            sessionStorage.setItem('searchKeyword_example', []);
          }
        }
        try {
        //   addKeyWordHistory(this.queryForm.keyword,this.type);
        }catch (e) {
         console.log("添加历史记录异常!!")
        }


			},
			changePagination: function(queryData) {
				this.queryForm.size = queryData.size;
				this.queryForm.page = queryData.page;

				// this.cricaseQueryWord.size = queryData.size;
				// this.cricaseQueryWord.page = queryData.page;
				// this.searchMethod();
				console.log('页码', this.queryForm)
				if(this.searchType_gao) {
					this.advancedForm.page = queryData.page;
					this.advancedForm.size = queryData.size;
					this.advancedSearch("advancedForm");
				} else {
					this.search();
				}
				this.checkAllState = false;
				$(document).scrollTop(0);
			},
			//刑事法规的右侧内容区，点击更多，只显示一个组
			compareNumCriminal: function(index) {
				console.log("----------youcefenzu--更多-------------", index);
				this.defalutNum = 100;
				this.secondMenu(index[0], index);
				this.checkAllState = false;
				$(document).scrollTop(0);
			},
			// 高级检索 模态框
			advancedRetrieval() {
				this.advancedVisible = true;
				this.searchType_gao = true;
				if(this.subChoseType == "pfnl") {
				  console.log("这里是法律法规");
					// 案由
					getZYLawSelect('pfnl_Category').then((res) => {
						// console.log("案由:",res);
						this.advancedCategory = res.data.data;
					});
					// 审理法院
					getZYLawSelect('pfnl_LastInstanceCourt').then((res) => {
						// console.log("审理法院",res);
						this.advancedLastInstanceCourt = res.data.data;
					});
					// 法院级别
					getZYLawSelect('pfnl_CourtGrade').then((res) => {
						// console.log("法院级别:",res);
						this.advancedCourtGrade = res.data.data;
					});
					// 审理程序
					getZYLawSelect('pfnl_TrialStep').then((res) => {
						// console.log("审理程序:",res);
						this.advancedTrialStep = res.data.data;
					});
					// 终身结果
					getZYLawSelect('pfnl_TrialStepCount').then((res) => {
						// console.log("终身结果:",res);
						this.advancedTrialStepCount = res.data.data;
					});
					// 文书类型
					getZYLawSelect('pfnl_DocumentAttr').then((res) => {
						// console.log("文书类型:",res);
						this.DocumentAttr = res.data.data;
					});
					//权责关键词
					getZYLawSelect('pfnl_CriminalPunish').then((res) => {
						// console.log("权责关键词:",res);
						this.CriminalPunish = res.data.data;
					});
					//参照级别
					getZYLawSelect('pfnl_CaseGrade').then((res) => {
						// console.log("参照级别:",res);
						this.CaseGrade = res.data.data;
					});
					//判定罪名
					getZYLawSelect('pfnl_Accusation').then((res) => {
						// console.log("定罪名:",res);
						this.Accusation = res.data.data;
					});
					//附带民事赔偿
					getZYLawSelect('pfnl_CivilLaw').then((res) => {
						// console.log("附带民事赔偿:",res);
						this.CivilLaw = res.data.data;
					});
					//指导案例批次
					getZYLawSelect('pfnl_GuidingCaseDoc').then((res) => {
						// console.log("导案例批次:",res);
						this.GuidingCaseDoc = res.data.data;
					});
					//公报年份
					getZYLawSelect('pfnl_SourceNote').then((res) => {
						// console.log("公报年份:",res);
						this.SourceNote = res.data.data;
					});

				} else if(this.subChoseType == "payz") {
          console.log("这里是司法案例");
					//规则分类
					getZYLawSelect('payz_CaseGrade').then((res) => {
						// console.log("payz_CaseGrade:",res);
						this.CaseGrade = res.data.data;
					});
				} else if(this.subChoseType == "gac") {
					// 案由
					getZYLawSelect('pfnl_Category').then((res) => {
						// console.log("案由:",res);
						this.advancedCategory = res.data.data;
					});
					// 法院级别
					getZYLawSelect('pfnl_CourtGrade').then((res) => {
						// console.log("法院级别:",res);
						this.advancedCourtGrade = res.data.data;
					});
					// 审理程序
					getZYLawSelect('pfnl_TrialStep').then((res) => {
						// console.log("审理程序:",res);
						this.advancedTrialStep = res.data.data;
					});
					//判定罪名
					getZYLawSelect('pfnl_Accusation').then((res) => {
						// console.log("定罪名:",res);
						this.Accusation = res.data.data;
					});
					//指导案例批次
					getZYLawSelect('pfnl_GuidingCaseDoc').then((res) => {
						// console.log("导案例批次:",res);
						this.GuidingCaseDoc = res.data.data;
					});
					//公报年份
					getZYLawSelect('pfnl_SourceNote').then((res) => {
						// console.log("公报年份:",res);
						this.SourceNote = res.data.data;
					});
					getZYLawSelect('gac_AppliedAgents').then((res) => {
						// console.log("公报年份:",res);
						this.AppliedAgents = res.data.data;
					});
					getZYLawSelect('gac_AppliedContent').then((res) => {
						// console.log("公报年份:",res);
						this.AppliedContent = res.data.data;
					});
					getZYLawSelect('gac_AppliedResult').then((res) => {
						// console.log("公报年份:",res);
						this.AppliedResult = res.data.data;
					});
					getZYLawSelect('gac_PublishOrgan').then((res) => {
						// console.log("公报年份:",res);
						this.PublishOrgan = res.data.data;
					});
					getZYLawSelect('pfnl_LastInstanceCourt').then((res) => {
						// console.log("公报年份:",res);
						this.advancedLastInstanceCourt = res.data.data;
					});
					getZYLawSelect('gac_PublishYear').then((res) => {
						// console.log("公报年份:",res);
						this.PublishYear = res.data.data;
					});
					getZYLawSelect('gac_AppliedMode').then((res) => {
						// console.log("公报年份:",res);
						this.AppliedMode = res.data.data;
					});
					getZYLawSelect('gac_AppliedExpression').then((res) => {
						// console.log("公报年份:",res);
						this.AppliedExpression = res.data.data;
					});
				} else if(this.subChoseType == "bankruptcy") {
          console.log("这里是法学期刊");
					// 案由
					getZYLawSelect('bankruptcy_InstrumentType').then((res) => {
						// console.log("案由:",res);
						this.InstrumentType = res.data.data;
					});
					// 文书类型
					getZYLawSelect('bankruptcy_DocumentAttr').then((res) => {
						// console.log("文书类型:",res);
						this.DocumentAttr = res.data.data;
					});

					// 受理法院
					getZYLawSelect('pfnl_LastInstanceCourt').then((res) => {
						// console.log("文书类型:",res);
						this.AppellateCourt = res.data.data;
					});
					// CorporateProperty
					getZYLawSelect('bankruptcy_CorporateProperty').then((res) => {
						// console.log("文书类型:",res);
						this.CorporateProperty = res.data.data;
					});
					//参照级别
					getZYLawSelect('pfnl_CaseGrade').then((res) => {
						// console.log("参照级别:",res);
						this.CaseGrade = res.data.data;
					});
					// 法院级别
					getZYLawSelect('pfnl_CourtGrade').then((res) => {
						// console.log("法院级别:",res);
						this.advancedCourtGrade = res.data.data;
					});
					// IndustryClassify
					getZYLawSelect('bankruptcy_IndustryClassify').then((res) => {
						// console.log("法院级别:",res);
						this.IndustryClassify = res.data.data;
					});

				} else if(this.subChoseType == "pal") {
					// 案由
					getZYLawSelect('pfnl_Category').then((res) => {
						// console.log("案由:",res);
						this.advancedCategory = res.data.data;
					});
					// pal_ColumnName
					getZYLawSelect('pal_ColumnName').then((res) => {
						// console.log("pal_ColumnName:",res);
						this.ColumnName = res.data.data;
					});

					// pal_SpecialCase
					getZYLawSelect('pal_SpecialCase').then((res) => {
						// console.log("pal_SpecialCase:",res);
						this.SpecialCase = res.data.data;
					});
					// 审理法院
					getZYLawSelect('pfnl_LastInstanceCourt').then((res) => {
						// console.log("审理法院",res);
						this.advancedLastInstanceCourt = res.data.data;
					});
				} else if(this.subChoseType == "atr") {
					// 案由
					getZYLawSelect('atr_IssueDepartment').then((res) => {
						// console.log("案由:",res);
						this.IssueDepartment = res.data.data;
					});
					// pal_ColumnName
					getZYLawSelect('atr_Category').then((res) => {
						// console.log("pal_ColumnName:",res);
						this.advancedCategory = res.data.data;
					});
				}

			},
			// 重置
			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.advancedForm.tagJson = [];
				// console.log(this.advancedForm.tagJson)
			},
			//高级检索
			advancedSearch(formName) {
				this.advancedForm.index = this.subChoseType;
				this.advancedForm.rangeType = this.rangeType ? parseInt(this.rangeType) : "";
				var data = this.advancedForm;
				this.searchType = "1";
				data.scope = "title";
				console.log(data, '-----------------高价检索-----参数----------');
				//  this.axios.post(`/xsfb/criminal/search`, data).then(res => {
				//      console.log(res);
				//  // this.gao_list = res.data.maincontent[0];
				//      this.advancedVisible=false;
				//  // this.showLists=false;
				//  // console.log(this.gao_list);
				// if(res.status == 200){
				// 	this.totalNum=res.data.maincontent[0].total;
				// 	this.list=res.data.sidebar;
				// 	if(this.showLists == true){
				// 		this.list2=res.data.maincontent[0];
				// 	}else{
				// 		this.list3=res.data.maincontent[0];
				// 	}
				// }else{
				// 	this.$message({
				// 	  type: 'info',
				// 	  message: '获取数据失败，请稍后再试!'
				// 	});
				// }
				//  });

				this.axios.post(`/json`, data, {
					headers: {
						_api_name: "fb_criminal",
						_api_version: "1.0.0"
					}
				}).then(res => {
					console.log('------------------gaoji返回--------------------', res)
					this.advancedVisible = false;
					// 重置同。。。等
					this.rangeType = "";
					if(res.status == 200) {
						// this.$refs[formName].resetFields();
						this.totalNum = res.data.maincontent[0].total;
						this.list = res.data.sidebar;
						if(this.showLists == true) {
							this.list2 = res.data.maincontent[0];
						} else {
							this.list3 = res.data.maincontent[0];
						}

						// this.keyWord=this.advancedForm.keyword;
						this.queryForm.tagJson = this.advancedForm.tagJson;
					} else {
						this.$message({
							type: 'info',
							message: '获取数据失败，请稍后再试!'
						});
					}
				});

			},
			//赋值tagjson
			setTagJson(val, fieldId, isDate, fieldname) {
				// console.log(val,fieldId,isDate,fieldname);
				var _this = this;
				let tagJsonData = this.advancedForm.tagJson || [];
				let itemlist = [val];
				if(val == "" || val == undefined || val == null) {
					itemlist = [];
				}
				if(fieldname == "Category" ||
					fieldname == "LastInstanceCourt" ||
					fieldname == "TrialStep" ||
					fieldname == "TrialStepCount" ||
					fieldname == "CriminalPunish" ||
					fieldname == "CourtGrade" ||
					fieldname == "DocumentAttr" ||
					fieldname == "CaseGrade" ||
					fieldname == "Accusation" ||
					fieldname == "CivilLaw" ||
					fieldname == "GuidingCaseDoc" ||
					fieldname == "SourceNote" ||
					fieldname == "AppliedAgents" ||
					fieldname == "AppliedContent" ||
					fieldname == "AppliedResult" ||
					fieldname == "PublishOrgan" ||
					fieldname == "PublishYear" ||
					fieldname == "AppliedMode" ||
					fieldname == "AppliedExpression" ||
					fieldname == "InstrumentType" ||
					fieldname == "AppellateCourt" ||
					fieldname == "CorporateProperty" ||
					fieldname == "IndustryClassify" ||
					fieldname == "ColumnName" ||
					fieldname == "SpecialCase" ||
					fieldname == "IssueDepartment") {
					tagJsonData.push({
						"id": "",
						"adv_type": "exact",
						"data_type": "tag",
						"name": "",
						"namelist": [],
						"fieldname": fieldname,
						"min": "",
						"max": "",
						"itemlist": itemlist,
						"relatetype": "or",
						"relatevalue": "",
						"searchhistory": ""
					});
				} else if(fieldname == "Judge" ||
					fieldname == "Core" ||
					fieldname == "CaseGist" ||
					fieldname == "Criminal" ||
					fieldname == "GuidingCaseNO" ||
					fieldname == "CaseFlag" ||
					fieldname == "Agent" ||
					fieldname == "DisputedIssues" ||
					fieldname == "Summary" ||
					fieldname == "ConetentCpyd" ||
					fieldname == "Party" ||
					fieldname == "CompanyName") {
					tagJsonData.push({
						"id": "",
						"adv_type": "fuzzy",
						"data_type": "text",
						"name": "",
						"namelist": [],
						"fieldname": fieldname,
						"min": "",
						"max": "",
						"itemlist": itemlist,
						"relatetype": "in",
						"relatevalue": "",
						"searchhistory": ""
					});
				} else if(fieldname == "CheckFullText") {
					tagJsonData.push({
						"id": "",
						"adv_type": "fuzzy",
						"data_type": "longtext",
						"name": "全文",
						"namelist": [],
						"fieldname": fieldname,
						"min": "",
						"max": "",
						"itemlist": itemlist,
						"relatetype": "in",
						"relatevalue": "",
						"searchhistory": ""
					});
				} else if(fieldname == "IssueDate" ||
					fieldname == "LastInstanceDate") {
					tagJsonData.push({
						"id": "",
						"adv_type": "condition",
						"data_type": "daterange",
						"name": "",
						"namelist": [],
						"fieldname": fieldname,
						"min": val[0],
						"max": val[1],
						"itemlist": [],
						"relatetype": "range",
						"relatevalue": ""
					});
				}
				for(let i in tagJsonData) {
					if(tagJsonData[i].fieldname == fieldname && i < tagJsonData.length - 1) {
						tagJsonData.splice(i, 1); //删除这个过滤项
						break;
					}
				}

				// console.log(this.advancedForm.tagJson)
			},

			// 跳转到详情页
			toDetail(id) {

				// let routeData = this.$router.resolve({ path: `/detail/detail/${id}` });
				let routeData = this.$router.resolve({
					path: `/detail/${this.subChoseType}/${id}`
				});
				window.open(routeData.href, "_blank");
			},
			// 获取左侧菜单
			getLeftTree() {
				let data = {
					keyWord: this.keyWord,
					startNo: 0,
					pageSize: 20,
					sortType: this.sortType,
					tagJson: this.tagJson,
					groupType: this.apiCategory
				};
				getAggs(data).then(res => {
					function filterArray(data, parent) {
						let vm = this;
						var tree = [];
						var temp;
						for(var i = 0; i < data.length; i++) {
							if(data[i].pid == parent) {
								var obj = data[i];
								temp = filterArray(data, data[i].id);
								if(temp.length > 0) {
									obj.children = temp;
								}
								tree.push(obj);
							}
						}
						return tree;
					}

					let filterList = res.data.data.filter(item => {
						return item.count > 0;
					});
					filterList.forEach((item, index) => {
						filterList.forEach((item2, index2) => {
							if(item2.pid == item.id) {
								item2.faItemName = item.itemname;
							}
						});
					});
					// console.log(filterList);
					this.list = filterArray(filterList, "0");
				});
			},
			//点击获取tab分页
			gitTab() {
				this.getLeftTree();
				this.search();
			},
			// titleChange(item2){
			//  let html=((item2.TrialStep?item2.TrialStep[0]:'')+
			//  (item2.DocumentAttr!=undefined?item2.DocumentAttr[0] + '/' : (
			// 	 item2.TrialStep?'/':'') )+  
			// 									(this.nowScope == 'Court'? (+ 
			// 										item2.Court!=undefined?item2.Court:(+ 
			// 											item2.LastInstanceCourt!=undefined?item2.LastInstanceCourt:'')
			// 										) : (
			// 											this.nowScope == 'AgentLawOffice'?(+
			// 										item2.AgentLawOfficeDic!=undefined?item2.AgentLawOfficeDic.join(','):''):(+
			// 										item2.LastInstanceCourt?item2.LastInstanceCourt:'')
			// 									)) + '/' +
			// 									(item2.CaseFlag!=undefined?item2.CaseFlag:'') + '/' +
			// 									(item2.LastInstanceDate?item2.LastInstanceDate:'')).replace('undefined','').replace(/\/\//g,'/').replace(/\/\//g,'/').replace(/^\//,'')
			// 									return html
			// }
		}
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
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
	.contentCon_display {
		display: inline-block;
	}

	.red {
		color: #ff0000;
	}

	.contentCon {
		color: #879bba;
		font-size: 14px;
		margin: 10px 0;
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
	}

	#textExample {
		border-top: 2px solid #a8bdce;
		background-color: #daedfb;
		font-family: 'Microsoft YaHei', Arial, "Avenir", Helvetica, sans-serif;
		font-weight: 400;
		font-style: normal;
		font-size: 16px;
		text-align: left;
		padding-left: 15px;
		height: 38px;
		line-height: 38px;
		color: #2d405e;
	}

	#textExample .secondTitle {
		font-size: 14px;
		color: #999999;
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
		font-family: 'Microsoft YaHei', Arial, "Avenir", Helvetica, sans-serif;
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
		height: calc(100% - 20px);
		width: calc(100% - 20px);
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
		height: calc(100% - 20px);
		width: calc(100% - 20px);
		margin: 10px 0;
		border: 1px solid #ccc;
	}

	.el-form--inline .el-form-item {
		margin-right: 10px;
	}

	.el-form--inline .el-form-item__label {
		/* font-size:10px; */
	}

	.el-input--suffix .el-input__inner {
		/* font-size:12px; */
	}

	.advanced_form.example_gao_form_dealog input,
	.advanced_form.example_gao_form_dealog select {
		width: 240px !important;
		/* height: 35px !important; */
		padding: 0 10px !important;
	}

	.advanced_form.example_gao_form_dealog .date_input .el-range-input {
		width: 82px !important;
		/* height: 29px !important; */
		padding: 0 !important;
	}

	.advanced_form.example_gao_form_dealog .el-date-editor {
		width: 240px !important;
		/* height: 35px !important; */
		padding: 3px 7px !important;
		padding-right: 0px !important;
		/* padding-left: 10px !important; */
	}

	.advanced_form.example_gao_form_dealog .el-input__icon {
		width: 15px !important;
		/* line-height: 28px !important; */
		margin-left: 0 !important;
	}

	.advanced_form.example_gao_form_dealog .el-date-editor .el-range-separator {
		color: #c4c5c7 !important;
		/* line-height: 28px !important; */
	}

	.gaoji_search_dialog.gaoji_search_dialog_exp .el-dialog {
		width: 800px !important;
	}

	.red {
		color: #ff0000;
	}

	.el-tree>div>div:nth-of-type(1)>span:nth-of-type(1) {
		color: #c0c4cc;
	}

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

	#lawsNewCol.example_btn_link_wrap .search_input_wrap {
		width: 100% !important;
	}

	#lawsNewCol.example_btn_link_wrap .search_select_wrap {
		width: 110px;
		background-color: #ffffff !important;
		/* border: 1px solid #a9c4df; */
		margin: 0;
		height: 100%;
	}

	#lawsNewCol.example_btn_link_wrap .el-input-group__prepend {
		padding: 0;
		border-radius: 0;
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
		overflow: hidden;
		/* border: 1px solid #a9c4df; */
	}

	#lawsNewCol.example_btn_link_wrap .search_select_wrap .el-input__inner {
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

	.tab_nav_wrap .el-menu--horizontal {
		padding: 0 10px;
		border-bottom: solid 1px #a9c4df;
	}

	.circle {
		position: absolute;
		left: -5px;
		top: 20px;
		display: block;
	}
</style>
<style scoped>
	.block {
		margin-bottom: 20px;
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

	.el-tree {
		color: #333;
	}

	#siderbarWWarp {
		border: 1px solid #ccc;
		margin-bottom: 10px;
	}

	#label {
		border-top: 2px solid #a8bdce;
		background-color: #daedfb;
		font-family: 'Microsoft YaHei', Arial, "Avenir", Helvetica, sans-serif;
		font-weight: 400;
		font-style: normal;
		font-size: 16px;
		text-align: left;
		padding-left: 15px;
		height: 38px;
		line-height: 38px;
		color: #222;
	}

	#subSider {
		text-align: left;
		padding-left: 50px;
		word-wrap: break-word;
	}

	.exampleList {
		text-align: left;
		padding: 20px 24px;
		padding-top: 0;
		/* border-bottom: 1px solid #cde2f3; */
	}

	.exampleType {
		position: relative;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		padding-left: 20px;
		width: 100%;
		height: 40px;
		color: #222;
		font-weight: bold;
		line-height: 40px;
		text-align: left;
	}

	.exampleType::before {
		width: 5px;
		height: 16px;
		background: #3684d6;
		content: "";
		position: absolute;
		left: 0px;
		top: 12px;
	}

	.exampleMore {
		padding-left: 20px;
		padding-right: 20px;
		color: #666;
		font-weight: normal;
		cursor: pointer;
	}

	.exampleTag {
		display: inline-block;
		padding: 0 5px;
		background: #5b7dcd;
		color: #fff;
		border-radius: 3px;
		font-size: 12px;
		line-height: 20px;
		margin: 0 2px;
	}

	.exampleItem {
		position: relative;
		padding: 20px 20px 15px 25px;
		border-bottom: 1px dashed #a9c4df;
	}

	.exampleItemTitle {
		font-size: 16px;
		color: #4f5e7b;
		margin-bottom: 5px;
		cursor: pointer;
		position: relative;
		/* text-indent: 15px; */
	}
	/* .contentTitle {
    line-height: 30px;
    color: #4f5e7b;

  }*/

	.exampleItemSecondTitle {
		font-size: 12px;
		color: #999;
	}

	.exampleItemTime {
		color: #999;
		margin-bottom: 15px;
	}

	.exampleItemWord {
		color: #999;
		margin-bottom: 10px;
	}

	.exampleItemWord span:nth-of-type(1) {
		color: #666;
		font-weight: bold;
	}

	.exampleExpress {
		position: absolute;
		right: 0;
	}

	.exampleExpress span {
		margin-left: 20px;
		cursor: pointer;
	}

	#advancedRetrieval_wrap_one {
    /* width: 200px; */
    height: 40px;
    float: right;
	text-align: left;
    /* margin-right: -20px;	 */
	}
	.primary-btn-main_kai{
		margin-left: 8px;
	}
	.advancedRetrieval_gao {
		font-weight: 400;
		font-style: normal;
		font-size: 14px;
		color: #879bba;
		line-height: 40px;
		height: 40px;
        /* padding-right: 125px;	 */
		margin: 0 10px;
        cursor:pointer;
	}

	.advancedRetrieval:hover {
		color: #4da0fb;
	}

	.select_xia {
		width: 200px;
		height: 200px;
		background: red;
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
  .examplelishiorothertips_main_wrap{
    background-color: #fff;
    box-shadow: 0 0 10px 1px #a9c4df;
    border: 1px solid #a9c4df;
    border-top: none;
    width: calc(100% - 113px);
	float: right;
	// display: none;
  }
</style>
<style>
  .myCore {
    font-size: 14px;
    color: #879bba;
  }

</style>
