'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/apis': {    //将www.exaple.com印射为/apis
				// target: 'http://192.168.12.58:60080',  // 接口域名
        // target: 'http://192.168.12.68:8090',  // 接口域名
        // target: 'http://192.168.12.68:8080',  // 接口域名二院
        // target: 'http://170.192.100.4:60080',  // 接口域名总线0624
        // target: 'http://192.168.43.170:8080',  // 接口域名总线
        // target: 'http://localhost:8080',  // 接口域名
        // target: 'http://170.192.106.5:8080/csb-broker/fb',//代理接口 暂时不全改 因为会报错 目前改了搜索 下拉
        target: 'http://143.3.119.224:8081/search/csb-broker/fb',
        // target:'http://csb-broker.tyyw.gj.jcy:8086',
        // target: 'http://localhost:8081/search/csb-broker/fb',//线上环境
        // secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true,  //是否跨域
        pathRewrite: {
            '^/apis': '/'   //需要rewrite的,
        }
      }
    },

    // Various Dev Server settings
    // host: '192.168.2.164', // can be overwritten by process.env.HOST
		host: '0.0.0.0',
    port: 8081, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
