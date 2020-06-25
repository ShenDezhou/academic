<!-- 顶部导航栏 -->
<template>
	<el-row class="header-row">
		<el-col :span="3" id="stages_logo">
			<a href="#/">
				<img :src="logo_url" alt="logo">
			</a>
		</el-col>
		<el-col :span="20" id="tab_target">
			<el-menu :default-active="activeIndex"
			class="el-menu-demo"
			mode="horizontal"
			@select="handleSelect"
			id="fb_el_menu">
				<el-menu-item index="acdemic">
					<a :href="acdemic">
						<span slot="title">Acdemic</span>
					</a>
				</el-menu-item>
        <el-menu-item index="competetion">
          <a :href="competetion">
            <span slot="title">Competetion</span>
          </a>
        </el-menu-item>
        <el-menu-item index="books">
          <a :href="books">
            <span slot="title">Books</span>
          </a>
        </el-menu-item>
        <el-menu-item index="works">
          <a :href="works">
            <span slot="title">Works</span>
          </a>
        </el-menu-item>
<!--				<el-menu-item index="lawsNew">-->
<!--					<a :href="lawsNew">-->
<!--						<span slot="title">法律法规</span>-->
<!--					</a>-->
<!--				</el-menu-item>-->
<!--				<el-menu-item index="example">-->
<!--					<a :href="example">-->
<!--						<span slot="title">司法案例</span>-->
<!--					</a>-->
<!--				</el-menu-item>-->
<!--				<el-menu-item index="journalLaw">-->
<!--					<a :href="journalLaw">-->
<!--						<span slot="title">法学期刊</span>-->
<!--					</a>-->
<!--				</el-menu-item>-->
			</el-menu>
		</el-col>
	</el-row>
</template>

<script>
	export default {
		name: "headercommon",
		data() {
			return {
        acdemic:'#/acdemic',
        competetion:'#/competetion',
        books:'#/books',
        works:'#/works',
				onestopUrl:'#/oneStopSearch',
				journalLaw:'#/journalLaw',
				example:'#/example',
				lawsNew:'#/lawsNew',
			};
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
				default:"../../static/img/logoo.png"
			}
		}
	}
</script>

<style scoped>

	#stages_logo{
		height: 100%;
		/* padding: 10px; */
		/* width: 145px; */
	}
	#stages_logo img{
		width: 90%;
		height: 95%;
		object-fit: contain;
	}
	#tab_target{
		margin-left: 10px;
	}
	#tab_target .el-menu.el-menu--horizontal{
		border-bottom:none !important;
	}
	#tab_target #fb_el_menu{
		/* border-bottom: 1px solid #A9C4DF !important; */
		overflow: hidden;
	}
	#tab_target #fb_el_menu .el-menu-item{
		height: 50px !important;
		line-height: 50px !important;
		font-size: 16px !important;
		/* color: #2D405E !important; */
		/* color: #4F5E78  !important; */
		color: #5C79B0 !important;
		padding: 0;
	}
	#tab_target #fb_el_menu .el-menu-item a{
		display: inline-block;
		padding: 0 20px;
	}
	/* #tab_target  */
	#tab_target #fb_el_menu .is-active{
		color: #165AC6  !important;
		border-bottom:2px solid #165AC6 !important;
	}
	.header-row{
		border-bottom: 1px solid #A9C4DF !important;
		height: 51px;
	}
</style>
