import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta:{title:'ShenDezhou@THU'},
      component: ()=>import('@/view/index'),
      beforeEnter: (to, from, next) => {
        next({ path: '/acdemic' })
      }
    },
    {
      path: '/acdemic',//Acdemic
      name: 'acdemic',
      meta:{title:'acdemic'},
      component: ()=>import('@/view/acdemic')
    },
    {
      path: '/coca/:keyword',//Coca words
      name: 'Corpus of Contemporary American English',
      meta:{title:'coca'},
      component: ()=>import('@/view/coca')
    },
    {
      path: '/books',//Acdemic
      name: 'books',
      meta:{title:'books'},
      component: ()=>import('@/view/books')
    },
    {
      path: '/works',//
      name: 'works',
      meta:{title:'Wroks'},
      component: ()=>import('@/view/works')
    },
		{
		  path: '/oneStopSearch',//一站式
		  name: 'oneStopSearch',
		  meta:{title:'一站式检索'},
		  component: ()=>import('@/view/oneStopSearch')
		},
    {
      path: '/lawsNew',//法宝
      name: 'lawsNew',
      meta:{title:'法律法规'},
      component: ()=>import('@/view/lawsNew')
    },
    {
      path: '/detail/:type/:gid',
      name: 'detail1',
      meta:{title:'法律法规'},
      component: ()=>import('@/view/detail')
    },
    {
      path: '/detail/:type/:gid/:keyword',
      name: 'detail1',
      meta:{title:'法律法规'},
      component: ()=>import('@/view/detail')
    },
    {
      path: '/detail/:type/:gid/:cid',
      name: 'detail',
      meta:{title:'法律法规'},
      component: ()=>import('@/view/detail')
    },
    {
      path: '/example',
      name: 'example',
      meta:{title:'司法案例'},
      component: ()=>import('@/view/example/example')
    },
		{
		  path: '/journalLaw',
		  name: 'journalLaw',
		  meta:{title:'法学期刊'},
		  component: ()=>import('@/view/journal/journalLaw')
    },
    {
		  path: '/lawsChange',
		  name: 'lawsChange',
		  meta:{title:'法规变迁'},
		  component: ()=>import('@/view/lawsChange')
    }
  ]
})
