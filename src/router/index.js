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
        next({ path: '/academic' })
      }
    },
    {
      path: '/academic',//Academic works
      name: 'academic',
      meta:{title:'academic'},
      component: ()=>import('@/view/academic')
    },
    {
      path: '/competition',//Competition works
      name: 'competition',
      meta:{title:'competition'},
      component: ()=>import('@/view/competition')
    },
    {
      path: '/books',//Academic
      name: 'books',
      meta:{title:'non-academic'},
      component: ()=>import('@/view/books')
    },
    {
      path: '/codes',//
      name: 'codes',
      meta:{title:'codes'},
      component: ()=>import('@/view/codes')
    },
    {
      path: '/works',//
      name: 'works',
      meta:{title:'works'},
      component: ()=>import('@/view/works')
    },
    {
      path: '/models',//
      name: 'models',
      meta:{title:'models'},
      component: ()=>import('@/view/model')
    },
    {
      path: '/2021',//
      name: '2021',
      meta:{title:'2021'},
      component: ()=>import('@/view/contributions')
    },
    {
      path: '/presentation',//
      name: 'presentation',
      meta:{title:'presentation'},
      component: ()=>import('@/view/presentation')
    }
  ]
})
