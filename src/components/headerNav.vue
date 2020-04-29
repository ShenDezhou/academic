<!-- 收藏笔记顶部导航栏 --> 
<template>
<div class="header-row">
	<div id="header-row">
		<div id="stages_logo">
			<a href="#/">
				<img src="../../static/img/logo3.png" alt="logo">
				<span class="stage_wz">中文法律数据库</span>
			</a>
		</div>
		<div id="tab_target">
			<ul class="tab_target_ulNav">
				<li class="item">
					<a :href="collect" :class="isCurrentNav == collect ? 'active' : ''">收藏</a>
				</li>
				<li class="item">
					<a :href="note" :class="isCurrentNav == note ? 'active' : ''">笔记</a>
				</li>
				<li class="item">
					<a :href="history" :class="isCurrentNav== history ? 'active' : ''">历史</a>
				</li>
			</ul>
		</div>
		<!--  -->
		<div class="search_wrap_personal">
			<template  v-if="isShowSearch">
				<el-divider direction="vertical"></el-divider>
				<div class="search_input_wrap">
					<el-input placeholder="请输入搜索内容" clearable v-model="keyWord" 
						class="input-with-select">
						<el-button slot="append" icon="el-icon-search" >搜索</el-button>
					</el-input>
				</div>
			</template>	
		</div>	
	</div>
</div>
</template>

<script>
	export default {
		name: "headercommon",
		data() {
			return {
				note:'#/personal/note',
				collect:'#/personal/collect',
				history:'#/personal/history',
				currentNav:'',
				isCurrentNav:'',
				keyWord:'',//搜索关键字
			};
		},
		created: function() {
			
			this.currentNav = window.location.href;
			// #/personal/noteDetail
			if(this.currentNav.indexOf('#/personal/noteDetail') != -1){
				this.isCurrentNav = this.note;
			}else if(this.currentNav.indexOf(this.note) != -1){
				this.isCurrentNav = this.note;
			}else if(this.currentNav.indexOf(this.collect) != -1){
				this.isCurrentNav = this.collect;
			}else if(this.currentNav.indexOf(this.history) != -1){
				this.isCurrentNav = this.history;
			}
			console.log(this.isCurrentNav,'------------当前路径------------')
		},
		methods: {
			handleSelect(key, keyPath) {
				var queryData={
					key:key,
					keyPath:keyPath
				};
				this.$emit("handleSelect", queryData);
				// window.location.reload();
			}
		},
		props:{
			activeIndex:{
				type:String,
				default:""
			},
			logo_url:{
				type:String,
				default:"../../static/img/logo3.png"
			},
			isShowSearch:{
				type:Boolean,
				default:true
			},

		}
	}
</script>

<style scoped lang="less">
	.header-row{
		min-width: 1200px;
    max-width: 100%;
		height:84px;
		margin: 0;
		padding: 0;
		background:linear-gradient(180deg,rgba(64,132,240,1),rgba(80,145,247,1));
	}
	.header-row #header-row{
		min-width: 1200px;
    max-width: 1592px;
		height: 84px;
		margin: 0 auto;
		display: flex;
	}
	// a{
	// 	float: left;
	// 	line-height: 84px;
	// }
	.input-with-select{
		// width: 299px;
		// height:39px;
	}
	.header-row img{
    	// margin-top: 15px;
	}
  .header-row .stage_wz{
		width:180px;
		font-size:24px;
		font-family:Microsoft YaHei;
		font-weight:bold;
		color:rgba(255,255,255,1);
		padding-right: 26px;
    border-right: 1px solid white;
    height: 56px;
    line-height: 56px;
    margin-top: 14px;
	}
	#tab_target a{
		// display: flex;
		// font-size: 20px;
		// color: white;
	}
	#tab_target a:hover{
		// color: white;
		// font-weight: bold;
	}
	.input_ys{
		float: left;
		width:299px;
		height:39px;
		background:rgba(255,255,255,1);
		border-radius:3px 0px 0px 3px;
	}
	.bottun_ys{
		width:32px;
		height:16px;
		font-size:16px;
		font-family:Microsoft YaHei;
		font-weight:400;
		color:rgba(255,255,255,1);
		line-height:25px;
	}
	#tab_target{
		// float: left;
		// margin: 0 330px 0 260px;
		// height:84px;
		flex: 1;
		.tab_target_ulNav{
			padding:0;
			margin: 0;
			list-style: none;
			width: 100%;
			overflow: hidden;
			box-sizing: border-box;
			.item{
				padding: 0;
				margin: 0;
				float: left;
				width: 33%;
				line-height: 84px;
				box-sizing: border-box;
				a{
					color: #fff;
					font-size: 18px;
					font-weight: 400; 
				}
				a.active{
					color: #fff;
    				font-weight: 700;
				}
			}
		}
	}
	#header-row{
		#stages_logo{
			text-align: left;
			// float: left;
			width: 255px;
			a{
				display: inline-block;
				margin-top: 6%;
				span{
					vertical-align: top;
				}
			}
		}
	}
	
	
</style>
<style lang="less">
	.search_wrap_personal{
		// float: right;
		width: 350px;
		.search_input_wrap{
			width: 90%;
			line-height: 84px;
			float: right;
			.el-input-group__append{
				background-color: #498BF4 !important;
				color: #fff !important;
				padding: 0 15px !important;
			}
		}
		.el-divider--vertical{
			height: 35px !important;
			margin-top: 8%;
		}
	}
</style>
