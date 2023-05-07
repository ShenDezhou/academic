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
				<el-menu-item index="academic">
					<a :href="academic">
						<span slot="title">Academic</span>
					</a>
				</el-menu-item>
        <el-menu-item index="videos">
          <a :href="videos">
            <span slot="title">Videos</span>
          </a>
        </el-menu-item>
        <el-menu-item index="competition">
          <a :href="competition">
            <span slot="title">Competition</span>
          </a>
        </el-menu-item>
        <el-menu-item index="non-academic">
          <a :href="nonacademic">
            <span slot="title">Non-Academic</span>
          </a>
        </el-menu-item>
        <el-menu-item index="codes">
          <a :href="codes">
            <span slot="title">Codes</span>
          </a>
        </el-menu-item>
         <el-menu-item index="models">
          <a :href="models">
            <span slot="title">Models</span>
          </a>
        </el-menu-item>
        <el-menu-item index="presentation">
          <a :href="presentation">
            <span slot="title">Presentation</span>
          </a>
        </el-menu-item>
        <el-menu-item index="summary">
          <a :href="summary">
            <span slot="title">Summary</span>
          </a>
        </el-menu-item>
        <el-menu-item index="gpt3">
          <a :href="gpt3">
            <span slot="title">GPT3</span>
          </a>
        </el-menu-item>
			</el-menu>
		</el-col>
	</el-row>
</template>

<script>
	export default {
		name: "headercommon",
		data() {
			return {
        academic:'#/academic',
        videos:'#/videos',
        competition:'#/competition',
        nonacademic:'#/books',
        codes:'#/codes',
        works:'#/works',
        models:'#/models',
        summary: '#/2022',
        presentation: '#/presentation',
				onestopUrl:'#/oneStopSearch',
				journalLaw:'#/journalLaw',
				example:'#/example',
				lawsNew:'#/lawsNew',
				gpt3: '#/gpt3',
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
