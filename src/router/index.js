import Vue from 'vue'
import Router from 'vue-router'
import course from './course'
import learn from './learn'
import center from './center'
import login from './login'
import pay from './pay'
import edp from './edp'
import live from './live'
Vue.use(Router)
let routes = []
let modulesRoutes = [
  {
    path: '/',
    name: 'index',
    redirect: '/index',
    component: resolve => require(['@/pages/index'], resolve),
  },
  {
    path: '*',
    name: 'Page404',
    component: resolve => require(['@/pages/common/page404'], resolve)
  }
]
modulesRoutes = modulesRoutes.concat(course)
modulesRoutes = modulesRoutes.concat(learn)
modulesRoutes = modulesRoutes.concat(center)
modulesRoutes = modulesRoutes.concat(login)
modulesRoutes = modulesRoutes.concat(pay)
modulesRoutes = modulesRoutes.concat(edp)
modulesRoutes = modulesRoutes.concat(live)

export default new Router({
  mode: 'history', // 去掉hash值，后台需要做相应的配置
  routes: routes.concat(modulesRoutes)
})
