// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'
import vueCookies from 'vue-cookies'


// 前后端交互，引入axios，修改原型链，axios不是插件
import axios from 'axios'
Vue.prototype.axios = axios
//生产环境的打包的方式
if(process.env.NODE_ENV == "production"){
  axios.defaults.baseURL="http://143.3.119.224:8081/search/csb-broker/fb";
}else{
  axios.defaults.baseURL = 'apis';
}

Vue.use(vueCookies)


// 允许携带cookie
axios.defaults.withCredentials=true
//添加请求头,下载文件的请求需要单独设置！！！！！
axios.defaults.headers.common['dsb-api-name'] = "fabao02";
axios.defaults.headers.common['dsb-api-version'] = "1.0";
//引入插件ElementUi，使用 Vue.use()来注册，引入插件需要注册
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import echarts from 'echarts'
Vue.prototype.$echarts = echarts


import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'

Vue.use(contentmenu)

import '@/styles/index.css' // global css
// 解决ie不支持promise
import Promise from 'es6-promise'
Promise.polyfill()
/* eslint-disable no-new */

// 引入阿里图标库
import './assets/iconfont/iconfont.css'
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
