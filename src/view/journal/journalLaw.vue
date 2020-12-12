<template>
	<div class="one_stop_wrap main_wrap">
		<div class="content_wrap">
			<div class="header_wrap">
				<Publichead :activeIndex="headerArr.activeIndex" :logo_url="headerArr.logo_url" @handleSelect="handleSelect"></Publichead>
			</div>
			<div class="content_main">
				<div class="header_search_wrap">
					<el-row class="search_inpu_one">
						<el-col :span="17" id="lawsNewCol" class="journlLaw_operation_wrap">
              <!--输入框-->
							<el-input :placeholder="select == '1'? '默认在标题和案件字号中检索':'请输入检索内容'" clearable
							v-model="keyword" class="input-with-select search_input_wrap" prefix-icon="el-icon-search"
							 @keyup.enter.native="getList" @clear="getList"  @blur="findHistoryBlur">
							 <!--  @focus="findHistory" -->
								<el-select v-model="select" slot="prepend" class="search_select_wrap" @change="(item)=>titleChange(item,'select')">
									<!-- <el-option label="默认" value="1"></el-option> -->
									<el-option label="标题" value="title"></el-option>
									<el-option label="全文" value="fulltext"></el-option>
									<el-option label="期刊" value="JournalId"></el-option>
									<el-option label="作者" value="InfoAuthor"></el-option>
									<el-option label="作者单位" value="AuthorUnit"></el-option>
								</el-select>
							</el-input>
              <!--下拉选框子-->
              	<div class="lishiorothertips_main_wrap">
				  	<template v-for=" (key,index) in keywordsDrop" >
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
							<span v-if="queryForm.keyword || queryForm.filterList.length > 0">
								<el-button type="primary" class="primary-btn-main" @click="resultGetList">结果中检索</el-button>
							</span>
							<span class="advancedRetrieval_gao" @click="advancedRetrieval()">高级检索</span>
						</el-col>
					</el-row>
					<el-row>
						<el-col class="radio_main_wrap">
							<ul>
								<li class="radio_qing_mo">
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
								</li>
								<template v-if="select == 'fulltext' || select == 'title'">
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
                  <a href="#/journalLaw">{{secondName}}</a>
                </span>
						</div>
						<div class="jians_conditions_wrap" v-if="searchKeywordArr.length > 0 || queryForm.filterList.length > 0">
							<div class="jians_conditions">
								<div class="conditions_left">检索条件：</div>
								<div class="conditions_right">
									<ul>
										<li class="search_txt_item" v-for="(item,index) in searchKeywordArr" :key="index" >
											<template v-if="select == 1">
												<span @click="searchHistoryItem($event)">标题+发文字号 : {{item}}</span>
											</template>
											<template v-if="select == 'title'">
												<span @click="searchHistoryItem($event)">标题 : {{item}}</span>
											</template>
											<template v-if="select == 'fulltext'">
												<span @click="searchHistoryItem($event)">全文 : {{item}}</span>
											</template>
											<template v-if="select == 'JournalId'">
												<span @click="searchHistoryItem($event)">期刊 : {{item}}</span>
											</template>
											<template v-if="select == 'InfoAuthor'">
												<span @click="searchHistoryItem($event)">作者 : {{item}}</span>
											</template>
											<template v-if="select == 'AuthorUnit'">
												<span @click="searchHistoryItem($event)">作者单位 : {{item}}</span>
											</template>
											<i class="el-icon-error error_item" @click="clearHistoryItem(item,index)"></i>
										</li>
										<li class="search_txt_item" v-for="(item02,index02) in queryForm.filterList" :key="index02" >
											<template v-if="item02.field == 'JournalId'">
												<span>期刊名称：{{item02.name}}</span>
											</template>
											<template v-if="item02.field == 'InfoKind'">
												<span>分类：{{item02.name}}</span>
											</template>
											<template v-if="item02.field == 'JournalYear'">
												<span>期刊年份：{{item02.name}}</span>
											</template>
											<template v-if="item02.field == 'NameType'">
												<span>期刊类型：{{item02.name}}</span>
											</template>
											<i class="el-icon-error error_item" @click="clearHistoryItem02(item02,index02)"></i>
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
							<div v-for="(item, siderBarNum) in listAside" :key="siderBarNum">
								<sider-bar :siderData="item" :siderBarNum="siderBarNum" @secondmenu="secondMenu"></sider-bar>
							</div>
						</el-aside>
						<el-main class="center_el_main">
							<div id="textExample">法学期刊</div>
							<!-- <div class="total_wrap">
								总共检索到
								<span class="total">{{this.totalNum?this.totalNum:0}}</span>篇
							</div> -->
							<div id="filerSelect">
								<div class="quaxuan_down_wrap_all">
									<!-- <p class="checkAll_wrap" >
										<el-checkbox  v-model="checkAllState" @change="checkAllChange">全选</el-checkbox>
									</p>
									<p class="piliangdelete" @click="downFilesAll">
										<i class="iconfont" style="margin-right:5px;">&#xe65a;</i>批量下载
									</p> -->
									总共检索到
									<span class="total" style="color:#f35c0a;"> {{this.totalNum?this.totalNum:0}} </span>篇
								</div>
							</div>
							<template v-if="totalNum <= 0">
								<div class="no_data_wrap">
									<img :src="no_data_logo" alt="未查询到相关数据">
									<p class="one">未查询到相关数据</p>
									<p class="two">建议您修改相关查询条件重新查询</p>
								</div>
							</template>
							<template v-if="totalNum > 0 ">
								<div class="exampleList">
									<!-- {{listArr.data}} -->
									<div class="exampleItem" v-for="(item2, index2) in listArr.data" :key="index2" style="padding:20px 0 15px 0;">

										<div class="exampleItemTitle" >
											<!-- <span class="numb_sort_checkall">
												<el-checkbox  :id="item2.CGid" v-model="checkAllList[index2].status" @change="checkedItemNogroup($event,item2,index2)"></el-checkbox>
											</span> -->
											<p class="numb_sort_checkall_p">
												<span class="numb_sort_checkall_sort">
													{{(queryForm.page-1)*queryForm.size + (index2+1)}}.
												</span>
												<span v-html="item2.InfoTitle" v-if="item2.InfoTitle" @click="toDetail(item2.CGid)"></span>
												<span v-html="item2.InfoTitleEn" v-else @click="toDetail(item2.CGid)"></span>
											</p>

										</div>
										<div style="color: #879bba;">
											<div class="contentCon contentCon_display" v-if="item2.JournalId">
												《{{item2.JournalId}}》/
											</div>
											<!-- <template v-if="item2.InfoKind && item2.NameType || item2.JournalId">
												/
											</template> -->
											<div class="contentCon contentCon_display" v-if="item2.NameType">
												{{item2.JournalYear}} /
											</div>
											<div class="contentCon contentCon_display" v-if="item2.JournalIssue">
												<!-- <template v-if="item2.JournalId">/ </template> -->
												{{item2.JournalIssue}}期 /
											</div>

											<div class="contentCon contentCon_display" v-if="item2.InfoPage">
												<!-- <template v-if="item2.JournalIssue">/ </template> -->
												共{{item2.InfoPage}}页 /
											</div>

											<div class="contentCon contentCon_display" v-if="item2.InfoAuthorUnAnalyzed">
												<!-- <template v-if="item2.InfoPage">/ </template> -->
												<span v-for="(item201, index201) in item2.InfoAuthorUnAnalyzed" :key="index201">{{item201}}  </span> /
											</div>

											<div class="contentCon contentCon_display" v-if="item2.InfoAuthorUnitUnAnalyzed">
												<!-- <template v-if="item2.InfoAuthorUnAnalyzed">/ </template> -->
												<span v-for="(item202, index202) in item2.InfoAuthorUnitUnAnalyzed" :key="index202">{{item202}}    </span>
											</div>
										</div>

										<div class="highlightFullText_wrap" v-if="item2.hitTimes != '0' && select=='fulltext'">
											<div class="highlightFullText_wrap_hidden">
												<p class="ckxq_wrap-guanj_minz">
													<span class="minzhong-cishu">命中次数：</span>
													<span class="oblique-cishu">{{keyword}} <span class="one">({{item2.hitTimes}})</span></span>
												</p>
												<p class="ckxq_wrap">
													<a href="javascript:void(0);" @click="openAllFullText($event,item2.CGid,index2)" v-show="!mingzongArr[item2.CGid]">
														展开命中
													</a>
													<a href="javascript:void(0);" @click="openAllFullText($event,item2.CGid,index2)" v-show="mingzongArr[item2.CGid]">
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
							<template v-if="totalNum">
								<div class="block" style="margin: 20px 0;">
									<el-pagination style="text-align: center;"
										 @size-change="handleSizeChange"
										 @current-change="handleCurrentChange"
										  :page-sizes="[10,50,100,200,400]"
										  :page-size="queryForm.size"
										  :current-page.sync="queryForm.page"
										   layout="prev, pager, next,sizes,jumper,->,total,slot"
										   :total="this.totalNum"
										    background></el-pagination>
								</div>
							</template>
						</el-main>
					</el-container>
				</div>
			</div>

			<!-- gao -->
			<el-dialog title="高级检索" :visible.sync="advancedVisible" class="gaoji_search_dialog journal_wrap_one_dialog">
				<el-form :inline="true" class="advanced_form journalLaw_gao_form_dislog" ref="advancedForm" :model="advancedForm" label-width="90px">
					<el-form-item label="标题" prop="keyword">
						<el-input v-model="advancedForm.keyword"></el-input>
					</el-form-item>
					<el-form-item label="全文" prop="CheckFullText">
						<el-input v-model="advancedForm.CheckFullText" @change="((item)=>{setTagJson(item,'011',false,'CheckFullText')})"></el-input>
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

					<el-form-item label="期刊名称" prop="JournalId">
						<el-select filterable placeholder="请选择" v-model="advancedForm.JournalId" @change="((item)=>{setTagJson(item,'002',false,'JournalId')})">
							<el-option v-for="(item,index) in JournalId" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="作者" prop="InfoAuthorUnAnalyzed">
						<el-input v-model="advancedForm.InfoAuthorUnAnalyzed" @change="((item)=>{setTagJson(item,'011',false,'InfoAuthorUnAnalyzed')})"></el-input>
					</el-form-item>
					<el-form-item label="作者单位" prop="InfoAuthorUnitUnAnalyzed">
						<el-input v-model="advancedForm.InfoAuthorUnitUnAnalyzed" @change="((item)=>{setTagJson(item,'011',false,'InfoAuthorUnitUnAnalyzed')})"></el-input>
					</el-form-item>

					<el-form-item label="分类" prop="InfoKind">
						<el-select filterable placeholder="请选择" v-model="advancedForm.InfoKind" @change="((item)=>{setTagJson(item,'003',false,'InfoKind')})">
							<el-option v-for="(item,index) in InfoKind" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="期刊年份" prop="JournalYear">
						<el-select filterable placeholder="请选择" v-model="advancedForm.JournalYear" @change="((item)=>{setTagJson(item,'003',false,'JournalYear')})">
							<el-option v-for="(item,index) in JournalYear" :key="item.itemkey" :value="item.itemkey" :label="item.itemname"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="期号" prop="JournalIssue" class="date_input JournalIssue_min">
						<el-input v-model="advancedForm.JournalIssue_min" @change="((item)=>{setTagJson(item,'011',false,'JournalIssue')})"></el-input>
						<span class="wrap_span"> - </span>
						<el-input v-model="advancedForm.JournalIssue_max" @change="((item)=>{setTagJson(item,'011',false,'JournalIssue')})"></el-input>
					</el-form-item>
					<!-- <el-form-item label="期号:" prop="JournalIssue" class="date_input">
              <el-input
                v-model="advancedForm.JournalIssue"
                @change="((item)=>{setTagJson(item,'011',false,'JournalIssue')})"
              ></el-input>
            </el-form-item> -->

					<el-form-item label="中文关键词" prop="InfoKeyword">
						<el-input v-model="advancedForm.InfoKeyword" @change="((item)=>{setTagJson(item,'011',false,'InfoKeyword')})"></el-input>
					</el-form-item>
					<el-form-item label="摘要" prop="InfoReference">
						<el-input v-model="advancedForm.InfoReference" @change="((item)=>{setTagJson(item,'011',false,'InfoReference')})"></el-input>
					</el-form-item>
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
	import { getZYLawSelect ,Download} from "../../select_api";
	import { addKeyWordHistory,getAggs, getCases, addSearch, getJSON, getCollectList,showKeyWordHistory,showLikeQuery } from "../../api";

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
			  selectStatus:false,
				// 全选
				checkAllState:false,
				checkAllList:[],//全选
				checkAllListArr:[],//全选
				checkAllListJson:{},//全选

        		searchTypeOfManyWorld:false,
			  keywordsDrop:[],
				currentFulltextTotal:[],
				currentPageFulltext:[],
				currentFulltextData:[],
				fulltextPageSize:5,
				highLighter:[],
				mingzongArr:{},

				rangeType: "", //同段:0; 同句:1
				inquiryMode:"0",//模糊 精确:0 查询:1


				showPrise: false,
				showRentPrise: false,

				openAllFullTextFlag: false,
				openOrClose: "展开",

				fullscreenLoading: true,
				no_data_logo: '../../static/img/no_data.png',
				searchKeywordArr: [],
				listAside: [],
				//是否模糊查询 2 模糊 1精确
				radio_fuzzy: "1",
				radio_type: "",
				headerArr: {
					activeIndex: "journalLaw",
					logo_url: "../../static/img/logoo.png"
				},
				// 是否高级检索
				searchType: false,
				// 模态框是够显示 默认 不显示
				advancedVisible: false,
				advancedForm: {
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
					tagJson: [

					],
					JournalId: "", //期刊名称
					InfoAuthorUnitUnAnalyzed: "",
					JournalYear: "", //qikan 参数
					InfoKeyword: "", //qikan 参数
					CheckFullText: "", //qikan 参数
					InfoAuthorUnAnalyzed: "", //qikan 参数
					InfoKind: "", //qikan 参数
					JournalIssue: "", //qikan 参数
					InfoReference: "", //qikan 参数
					JournalIssue_max: '',
					JournalIssue_min: '',
				},
				queryForm: {
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
					modules: [1,2,3],//右下侧结果列表
					tagJson: [],
				},
				JournalId: [], //期刊名称
				JournalYear: [],
				InfoKind: [],
				tagJson: [],
				subChoseType: "qikan",
				keyword: "",
				defalutNum: "-1",
				secondName: "法学期刊",
				select: "title",
				listArr: {}, //返回数据
				totalNum: 10, //总条数
				pagenum: 1,
				pageSize: 10,
			};
		},
		created: function() {

			if(window.location.href.indexOf("keyword") != -1) {
				this.keyword = decodeURIComponent(window.location.href.split("keyword=")[1]);
			} else {
				this.keyword = this.$route.params.keyword;
			}
			console.log(this.keyword)
			this.choseType = "qikan";
			document.title = this.$route.meta.title;
			this.queryForm.keyword = this.keyword;
			this.searchMethod();
		},

		watch :{
			keyword: function(key){
				if(key != null && key != '' && key != undefined){
					console.log(key,"---------------------相关----------------------");
					hotKeywordQuery(key,"journal").then(res =>{
					if(res){
						console.log(res,"热搜词搜索");
						var resultList = [];
						if(res.data.success){
							$(".lishiorothertips_main_wrap").css({'display':'block'});
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
				});
				}
			}
		},
		methods: {

			// 全选
			checkAllChange(val){
				let _this = this;
				this.checkAllListArr=[];
				this.checkAllList.forEach((ele,index)=>{
					ele.status = this.checkAllState;
				});
				console.log(this.checkAllState,'全选状态更改-------------------');
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
          var index = "qikan";
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
			initCheckAll(data){
				// console.log('初始数据，',groupByIndex,data)
				let _this = this;
                this.checkAllList = [];
                  data.data.forEach((ele,index) => {
                      _this.checkAllList.push({
                        Gid:ele.CGid,
                        status:false,
                      });
                  });
                console.log("-----------------全选更改or初始化数据-------------------",this.checkAllList,this.queryForm.groupByIndex);
			},

			getKeywords(key){
			console.log(key,'--------------------点击 搜索 热刺------------------',$(e.target),$(e.target)[0].innerText);
			this.keyword = $(e.target)[0].innerText;
			this.getList();

      },

			// 全文分页
			packUp(){
				// currentFulltextTotal
				let _this = this;
				_this.currentFulltextTotal =[];
				_this.currentPageFulltext=[],
				_this.highLighter = [];
				console.log(_this.listArr.data,'-------------packUp-------------------')
				_this.listArr.data.forEach((ele,index)=>{
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


			kaishi() {
				this.showPrise = !this.showPrise;
				this.showRentPrise = !this.showRentPrise;
			},
			openAllFullText(e,currentId,index) {
				console.log($(e.target),'4444444444444444444444444444444444444')
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
			openSQFullText(e,currentId,index){

			},
			titleChange(val, type) {
				console.log(val,type,'-----------------------------搜索框下拉更改-----------------------------title');
				if(val =='title'){
					this.inquiryMode = "0";
					this.rangeType = "";
					this.queryForm.scope = val;

				}else if(val == "fulltext"){
					this.inquiryMode = "0";
					this.rangeType = "";
					this.queryForm.scope = val;

				}else if(val == "JournalId"){
					this.inquiryMode = "";
					this.rangeType = "";
					this.queryForm.scope = val;

				}else if(val == "InfoAuthor"){
					this.inquiryMode = "";
					this.rangeType = "";
					this.queryForm.scope = val;

				}else if(val == "AuthorUnit"){
					this.inquiryMode = "";
					this.rangeType = "";
					this.queryForm.scope = val;

				}else if( val == "1"){
					this.queryForm.scope = "title";
					this.inquiryMode = "";
					this.rangeType = "";
				}

				// this.searchMethod();
			},
      hiddenAll(){
        this.selectStatus =false;
      },
      //查询搜索的历史
      findHistory(){
        this.selectStatus =true;
			  console.log("历史",this.type);

        if(this.keyword == null ||this.keyword==undefined || this.keyword == '' ){
          showKeyWordHistory("journal").then(res=>{
           console.log(res,"-----------------搜索历史--------------------");
           if(res){
             var  resultList = [];
             if( res.data.data){
				 $(".lishiorothertips_main_wrap").css({'display':'block'});
             res.data.data.forEach(key =>{
               var result = {
                 name : key.keyword,
                 value : key.keyword,
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
			$(".lishiorothertips_main_wrap").css({'display':'none'});
		},1000);
	  },
			//搜索按钮历史记录
			getList() {
        this.searchTypeOfManyWorld =false;

				console.log('----------------关键词输入 或者下拉更改搜索传参-----------',this.queryForm,this.rangeType,this.inquiryMode);
				this.queryForm.rangeType = this.rangeType ? parseInt(this.rangeType) : "";
				this.queryForm.inquiryMode =  this.inquiryMode ? parseInt(this.inquiryMode) : "";
				this.queryForm.keyword = this.keyword;
				this.queryForm.page = 1;
				this.searchMethod();
				sessionStorage.setItem("keywordJou",this.keyword);
				var url = this.$route.path;
				var absolutePath = window.location.href;
				addSearch(this.keyword, url);

			},
			// 结果中检索
			resultGetList(){
        this.searchTypeOfManyWorld = true;
				console.log('---------------------结果中检索参数-----------------',this.queryForm);
				this.queryForm.keyword = sessionStorage.getItem("keywordJou") ? sessionStorage.getItem("keywordJou") : "";
				this.queryForm.title = this.keyword;
				this.queryForm.page = 1;
				this.searchMethod();
				var url = this.$route.path;
				var absolutePath = window.location.href;
				addSearch(this.keyword, url);
			},

			//头补选中
			handleSelect(queryData) {
				// console.log(queryData, "---------------------------------------------");
			},
			handleSizeChange(val) {
				// console.log('ssssssssssggggggggggggggggsssssssssssssssssssss');
				this.pageSize = val;
				if(this.searchType_gao) {
					this.advancedForm.page = this.pagenum;
					this.advancedForm.size = val;
					this.advancedSearch('advancedForm');
				} else {
					this.queryForm.page = this.pagenum;
					this.queryForm.size = val;
					this.searchMethod();
				}
				$(".highlightFullText_wrap_hidden").find("#hidden_highLighter").css("display", "none");
				$(".highlightFullText_wrap_hidden").find("#play_highLighter").css("display", "block");
				this.mingzongArr={};
				this.checkAllState = false;
				$(document).scrollTop(0);
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
					this.searchMethod();
				}
				$(".highlightFullText_wrap_hidden").find("#hidden_highLighter").css("display", "none");
				$(".highlightFullText_wrap_hidden").find("#play_highLighter").css("display", "block");
				this.mingzongArr={};
				this.checkAllState = false;
				$(document).scrollTop(0);
			},

			// 高级检索模态框
			advancedRetrieval() {
				this.advancedVisible = true;
				this.searchType = true;
				// 发布部门
				getZYLawSelect("qikan_JournalId").then(res => {
					// console.log("发布部门:",res);
					this.JournalId = res.data.data;
				});
				// 批准部门
				getZYLawSelect("qikan_JournalYear").then(res => {
					// console.log("批准部门:",res);
					this.JournalYear = res.data.data;
				});
				// 时效
				getZYLawSelect("qikan_InfoKind").then(res => {
					// console.log("时效:",res);

					this.InfoKind = res.data.data;

				});
			},
			// 重置
			resetForm(formName) {
				this.$refs[formName].resetFields();
				var _this = this;
				this.advancedForm.keyword = "";
				this.advancedForm.filterList = [];
				this.advancedForm.tagJson = [];
				this.filterList = [];
				this.tagJson = [];
				this.keyword = "";
			},
			// 高级检索结果集
			advancedSearch(formName) {
				this.advancedForm.rangeType = this.rangeType ? parseInt(this.rangeType) : "";
				var data = this.advancedForm;
				data.scope = "title";
				console.log('----------------------期刊高检参数----------', data)

				this.axios
					.post(`/json`, data, {
						headers: {
							_api_name: "fb_criminal",
							_api_version: "1.0.0"
						}
					})
					.then(res => {
						console.log('-----------------------期刊高检返回数据----------', res)
						// 重置 同条 同句 等参数
						this.rangeType = "";
						this.listArr = res.data.maincontent[0];
						this.listAside = res.data.sidebar;
						this.totalNum = res.data.maincontent[0].total;
						this.advancedVisible = false;
						// this.keyword=this.advancedForm.keyword;
					});
			},
			//
			// set
			setTagJson(val, fieldId, isDate, fieldname) {
				var _this = this;
				let tagJsonData = this.advancedForm.tagJson || [];
				let itemlist = [val];
				if(val == "" || val == undefined || val == null) {
					itemlist = [];
				}
				if(
					fieldname == "JournalId" ||
					fieldname == "JournalYear" ||
					fieldname == "InfoKind"
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
				} else if(fieldname == "InfoAuthorUnitUnAnalyzed" ||
					fieldname == "InfoKeyword" ||
					fieldname == "InfoAuthorUnAnalyzed" ||
					fieldname == "InfoReference"
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
				} else if(fieldname == "CheckFullText") {
					tagJsonData.push({
						id: "",
						adv_type: "fuzzy",
						data_type: "longtext",
						name: "全文",
						namelist: [],
						fieldname: fieldname,
						min: "",
						max: "",
						itemlist: itemlist,
						relatetype: "in",
						relatevalue: "",
						searchhistory: ""
					});
				} else if(fieldname == "JournalIssue") {
					// tagJsonData.push({
					//   id: "",
					//   adv_type: "fuzzy",
					//   data_type: "text",
					//   name: "期号",
					//   namelist: [],
					//   fieldname: fieldname,
					//   min: this.advancedForm.JournalIssue_min,
					//   max: this.advancedForm.JournalIssue_max,
					//   itemlist: [],
					//   relatetype: "in",
					//   relatevalue: "",
					//   searchhistory: ""
					// });
					tagJsonData.push({
						"id": "",
						"adv_type": "condition",
						"data_type": "daterange",
						"name": "",
						"namelist": [],
						"fieldname": "JournalIssue",
						"min": this.advancedForm.JournalIssue_min,
						"max": this.advancedForm.JournalIssue_max,
						"itemlist": [],
						"relatetype": "range",
						"relatevalue": "",
						"searchhistory": ""
					});
				}
				for(let i in tagJsonData) {
					if(
						tagJsonData[i].fieldname == fieldname &&
						i < tagJsonData.length - 1
					) {
						tagJsonData.splice(i, 1); //删除这个过滤项
						break;
					}
				}

				console.log(this.advancedForm.tagJson);
			},






			//二级菜单分类
			secondMenu: function(jueryData) {
				let filterList = this.filterList || [];
				for(let i in filterList) {
					if(jueryData.field == filterList[i].field) {
						filterList.splice(i, 1, jueryData);
						this.filterList = filterList;
						// this.queryWord.page = 1;
						this.searchMethod();
						return;
					}
				}
				filterList.push(jueryData);
				this.filterList = filterList;
				this.queryForm.filterList = this.filterList;
				this.searchMethod();
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
				console.log("--------------tab更改时---------------参数", index);
				this.subChoseType = index;
				this.searchMethod();
			},








			// 清空搜索历史
			clearHistory() {
				this.searchKeywordArr = [];
				sessionStorage.removeItem('searchKeyword_journal');
				this.queryForm.keyword = "";
				this.queryForm.filterList = [];
				this.queryForm.tagJson = [];
				this.filterList = [];
				this.tagJson = [];
				this.keyword = "";
				//this.queryForm.keyword = this.keyword;
        this.queryForm.keyword = null;
        this.queryForm.title = null;
				this.searchMethod();
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
			this.keyword = this.queryForm.keyword;
			this.searchMethod();
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
				// console.log($(event.target).html());
				this.keyword = $(event.target).html();
				this.queryForm.keyword = this.keyword;
				this.searchMethod();
			},
			// 跳转到详情页
			toDetail(id) {
				console.log(id, '-------------------id-------------')
				// let routeData = this.$router.resolve({ path: `/detail/detail/${id}` });
				let routeData = this.$router.resolve({
					path: `/detail/${this.subChoseType}/${id}`
				});
				window.open(routeData.href, "_blank");
			},
			//搜索方法
			searchMethod: function() {
        this.selectStatus =false;
				// if(this.select != this.advancedForm.scope){
				//   this.advancedForm.scope=this.select;
				// }
				this.fullscreenLoading = true;
				// if (this.searchType) {
				//   //高级检索
				// } else {
				// this.queryForm.keyword = this.keyword;
				this.queryForm.index = this.subChoseType;
				let data = this.queryForm;
				console.log('--------------查询数据----------------------', data);

			/*	if(sessionStorage.getItem('searchKeyword_journal') != "" &&
					sessionStorage.getItem('searchKeyword_journal') != null &&
					sessionStorage.getItem('searchKeyword_journal') != undefined) {
					this.searchKeywordArr = sessionStorage.getItem('searchKeyword_journal').split(",");
				}
				if(this.queryForm.keyword != undefined && this.queryForm.keyword != "") {

					let mu = this.searchKeywordArr.find((n) => {
						if(n == this.queryForm.keyword) {
							return true;
						} else {
							return false;
						}
					});
					if(!mu) {
						this.searchKeywordArr.push(this.queryForm.keyword);
					}
				}
				sessionStorage.setItem('searchKeyword_journal', this.searchKeywordArr);
*/
				this.axios.post(`/json`, data, {
						headers: {
							_api_name: "fb_criminal",
							_api_version: "1.0.0"
						}
					})
					.then(res => {
						console.log('-----------------期刊返回数据-------------------', res)



						this.fullscreenLoading = false;
						if(res.data.result == 'XSS_ATTACK') {
							this.totalNum = 0;
							this.listAside = res.data.sidebar;
						} else {
							if(res.data.maincontent.length > 0){
								this.listArr = res.data.maincontent[0];
								this.listAside = res.data.sidebar;
								this.totalNum = res.data.maincontent[0].total;
								// console.log(this.listArr)
								this.initCheckAll(this.listArr);
								if(this.queryForm.scope != 'fulltext'){
									this.listArr.data.forEach((ele,index)=>{
										ele.hitTimes='0';
										ele.highLighter="";
									});
								}
							}else{
								this.totalNum = 0;
								this.listAside = res.data.sidebar;
							}

						}
						this.packUp();
					});

        if(this.searchTypeOfManyWorld) {
          this.searchKeywordArr =[];

          if( this.queryForm.keyword){
            this.searchKeywordArr.push(this.queryForm.keyword);
          }
          if(this.queryForm.title){
            this.searchKeywordArr.push(this.queryForm.title);
          }
          sessionStorage.setItem('searchKeyword_journal', this.searchKeywordArr);
        }else{
          this.searchKeywordArr = [];
          if(this.queryForm.keyword){
            this.searchKeywordArr.push(this.queryForm.keyword)
            sessionStorage.setItem('searchKeyword_journal', this.searchKeywordArr);
          }else{
            this.searchKeywordArr = [];
            sessionStorage.setItem('searchKeyword_journal', []);
          }
        //   console.log(this.searchKeywordArr);
        //   console.log("空数组!!!!!","结果");
        }





        try {
        //   addKeyWordHistory(this.queryForm.keyword,this.type);
        }catch (e) {
          console.log("添加历史记录异常!!")
        }



				// }
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
		}
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
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
		// text-indent: 15px;
	}

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
		/* float: right;
		text-align: right;
		padding-right: 20px; */
	}

	.circle {
		position: absolute;
		left: -5px;
		top: 20px;
		display: block;
	}

	.JournalIssue_min .el-form-item__content .el-input {
		display: inline-block;
		width: 44%;
	}

	.JournalIssue_min .wrap_span {
		margin: 0 4.5px;
	}

	.JournalIssue_min .el-form-item__content .el-input input {
		width: 102px !important;
	}

	.journal_wrap .el-form--inline .el-form-item {
		margin-right: 35px;
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
		border-bottom: 1px solid #a9c4df;
		min-height: 32px;
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
		margin-top: -15px
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

	#lawsNewCol.journlLaw_operation_wrap .search_input_wrap {
		width: 100% !important;
	}

	#lawsNewCol.journlLaw_operation_wrap .search_select_wrap {
		width: 110px;
		background-color: #ffffff !important;
		/* border: 1px solid #a9c4df; */
		margin: 0;
	}

	#lawsNewCol.journlLaw_operation_wrap .el-input-group__prepend {
		padding: 0;
		border-radius: 0;
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
		overflow: hidden;
		/* border: 1px solid #a9c4df; */
	}

	#lawsNewCol.journlLaw_operation_wrap .search_select_wrap .el-input__inner {
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
		font-family: 'Microsoft YaHei', Arial, "Avenir", Helvetica, sans-serif;
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

	.advanced_form.journalLaw_gao_form_dislog input,
	.advanced_form.journalLaw_gao_form_dislog select {
		width: 240px !important;
		/* height: 35px !important; */
		padding: 0 10px !important;
	}

	.advanced_form.journalLaw_gao_form_dislog .date_input .el-range-input {
		width: 82px !important;
		/* height: 29px !important; */
		padding: 0 !important;
	}

	.advanced_form.journalLaw_gao_form_dislog .el-date-editor {
		width: 240px !important;
		/* height: 35px !important; */
		padding: 3px 7px !important;
		padding-right: 0px !important;
		/* padding-left: 10px !important; */
	}

	.advanced_form.journalLaw_gao_form_dislog .el-input__icon {
		width: 15px !important;
		/* line-height: 28px !important; */
		margin-left: 0 !important;
	}

	.advanced_form.journalLaw_gao_form_dislog .el-date-editor .el-range-separator {
		color: #c4c5c7 !important;
		/* line-height: 28px !important; */
	}

	.gaoji_search_dialog.journal_wrap_one_dialog .el-dialog {
		width: 800px !important;
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

	#advancedRetrieval_wrap_one {
		/* width: 200px; */
		height: 40px;
		float: right;
		text-align: left;
		/* margin-right: -20px; */
	}

	.primary-btn-main_kai {
		margin-left: 8px;
	}

	.advancedRetrieval_gao {
		font-weight: 400;
		font-style: normal;
		font-size: 14px;
		color: #879bba;
		line-height: 40px;
		height: 40px;
		margin: 0 10px;
		/* padding-right: 125px; */
		cursor: pointer;
	}

	.advancedRetrieval:hover {
		color: #4da0fb;
	}
</style>
<style lang="less">
  .numb_sort_checkall{
    display: inline-block;
    float: left;
  }
  .numb_sort_checkall_p{
    // margin-left: 25px;
  }
  	.quaxuan_down_wrap_all{
	  	.piliangdelete{
	  	}
	  	.checkAll_wrap,.piliangdelete{
			padding: 0;
			margin: 0;
			display: inline-block;
			margin-right: 20px;
			cursor: pointer;
		}
		.el-checkbox{
			color: #879bba;
		}
	}
  .lishiorothertips_main_wrap{
    background-color: #fff;
    box-shadow: 0 0 10px 1px #a9c4df;
    border: 1px solid #a9c4df;
    border-top: none;
    width: calc(100% - 113px);
    float: right;
  }
</style>
