<template>
    <!-- 回到顶部组件 -->
    <div class="turnbacktop_wrap">
        <div class="backTop_main_wrap" v-if="isShow"> 
            <el-tooltip class="item" effect="light" content="回到顶部" placement="left">
                <p class="backTop_target" @click="turnbacktop">
                    <i class="el-icon-caret-top"></i>
                </p>
            </el-tooltip>
        </div>
    </div>
</template>

<script>
    export default {
        name: "turnBackTop",
        props: {},
        data() {
            return {
                scroll:"",//是否滚动
                isShow:false,//是否显示
            };
        },
        watch: {},
        mounted() {
            window.addEventListener('scroll',this.menu);
        },
        created() {},
        methods: {
            menu(){
                this.scroll=document.documentElement.scrollTop || document.body.scrollTop;  
                // console.log(this.scroll,'juli')
                if(this.scroll >= 600){
                    this.isShow=true;
                }else{
                    this.isShow=false;
                }
            },
            turnbacktop(){
                // $(document).scrollTop(0);
                $('body,html').stop().animate({scrollTop:0},500);
            },
        },
    };
</script>      
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .turnbacktop_wrap{

    }
    .backTop_main_wrap{
        position: fixed;
        right: 20px;
        bottom: 60px;
    }
    .backTop_main_wrap .backTop_target{
        background-color: #fff;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        color: #409eff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 0 6px rgba(0,0,0,.12);
        cursor: pointer;
        z-index: 5;
    }
    .backTop_main_wrap .backTop_target:hover{
        background-color: #ccdffc;
    }
    .backTop_main_wrap .backTop_target i{
        font-size: 24px;
    }
</style>
<!-- 全局样式 -->
<style>
</style>
