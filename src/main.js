// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Cookies from 'js-cookie'
import VueCookie from 'vue-cookie'
import axios from 'axios'
import config from './config/config'
import * as filters from './utils/filters'
import 'amfe-flexible'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import '../static/animate.min.css'
import '../static/style.css'
// 使用mintui, 按需要的引用，不使用的不引用
import 'mint-ui/lib/style.css'
// 使用自定义样式
import '../static/custom.css'
import '../static/mint-ui-change.css'
import getFilePreviewUrl from './utils/getFilePreviewUrl'
import FastClick from 'fastclick'
import { addCookie, getCookie, delCookie } from './utils/cookie'
import 'babel-polyfill'
import pdSelect from 'pd-select'
import VueLazyLoad from 'vue-lazyload'
import IScroll from 'iscroll'

Vue.use(VueLazyLoad, {
  error: '/static/course-default.jpg',
  loading: '/static/course-default.jpg'
})


import Es6Promise from 'es6-promise'
Es6Promise.polyfill()
// let vconsole = require('./utils/vconsole')
import VeLine from 'v-charts/lib/line'
import MetaInfo from 'vue-meta-info'
//mint-ui
import {
  Indicator,
  Toast,
  Button,
  Header,
  Tabbar,
  TabItem,
  Loadmore,
  Switch,
  Cell,
  Field,
  Spinner,
  Swipe,
  SwipeItem,
  Search,
  MessageBox,
  InfiniteScroll,
  TabContainer,
  Navbar,
  TabContainerItem,
  Actionsheet,
  Popup,
  Progress
} from 'mint-ui'

// 自己写的通用组件
import Modal from './components/common/modal'
import ModalSignIn from './components/common/modal-sign'
import ModalReadMe from './components/common/modal-readme'
import ModalCoupon from './components/common/modal-coupon'
import ModalSuccess from './components/common/modal-success'
import ModalQ from './components/common/modal-question'
import ModalPro from './components/common/modal-prompt'
import Affix from './components/common/affix'
import popupMenu from '@/components/common/popup'          // 弹框组件
// 指令
import { swiper, goTop } from './config/directive.js'
// 页面相关组件
import PageTabbar from './pages/base/page-tabbar'
import PageHeader from './pages/base/page-header'
import PageContent from './pages/base/page-content'
import PageFooter from './pages/base/page-footer'
import CommonNav from './pages/base/nav'
import { mapGetters } from 'vuex'
Vue.component(Actionsheet.name, Actionsheet);
Vue.component(Button.name, Button)
Vue.component(Header.name, Header)
Vue.component(Tabbar.name, Tabbar)
Vue.component(TabItem.name, TabItem)
Vue.component(Loadmore.name, Loadmore)
Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)
Vue.component(Switch.name, Switch)
Vue.component(Cell.name, Cell)
Vue.component(Field.name, Field)
Vue.component(Spinner.name, Spinner)
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.component(Search.name, Search)
Vue.component(Navbar.name, Navbar)
Vue.component(VeLine.name, VeLine)
Vue.component(Popup.name, Popup)
Vue.component(Progress.name, Progress)
Vue.use(InfiniteScroll)
Vue.use(VueCookie)
Vue.use(MetaInfo)
Vue.use(pdSelect)
Vue.component('popup-menu', popupMenu)
// 全局注入，页面里面可以直接用this.$toast。
Vue.prototype.$toast = Toast
Vue.prototype.$message = MessageBox
Vue.prototype.$baseImageUrl = config.baseImageUrl
Vue.prototype.$baseVideoUrl = config.baseVideoUrl
Vue.prototype.$uploadParamsUser = config.uploadParamsUser
Vue.prototype.$getFilePreviewUrl = getFilePreviewUrl
// 引入样式
Vue.prototype.$requireLinkStyle = (url, id) => {
  if (!document.getElementById('edpSwitchStyle')) {
    let link = document.createElement("link")
    link.rel = "stylesheet"
    link.type = "text/css"
    link.href = url
    if (id) {
      link.id = id
    }
    document.getElementsByTagName("head")[0].appendChild(link)
  }
}

//自定义的通用组件
Vue.component('Modal', Modal)
Vue.component('Affix', Affix)
Vue.component('ModalSuccess', ModalSuccess)
Vue.component('ModalSignIn', ModalSignIn)
Vue.component('ModalCoupon', ModalCoupon)
Vue.component('ModalReadMe', ModalReadMe)
Vue.component('ModalQ', ModalQ)
Vue.component('ModalPro', ModalPro)
Vue.component('PageTabbar', PageTabbar)
Vue.component('PageHeader', PageHeader)
Vue.component('PageContent', PageContent)
Vue.component('PageFooter', PageFooter)
Vue.component('CommonNav', CommonNav)

Vue.config.productionTip = false

// 注册全局通用过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 注册全局指令
Vue.directive('swiper', {             // 右滑返回上一页
  inserted: function (el, binding, vnode) {
    if (binding.value) {
      swiper(el, binding.arg, binding.value, vnode.context)
    } else {
      return ''
    }
  }
})
Vue.directive('goTop', {                // 点击头部返回页面顶部
  inserted: function (el, binding, vnode) {
    if (binding.value) {
      goTop(el, binding.arg, vnode.context)
    } else {
      return ''
    }
  }
})

// 注册一个全局自定义指令 `v-iscroll`
Vue.directive('iscroll', {
  bind: (el, binding, vnode, oldVnode) => {
    // 判断输入参数
    // let vtype = binding.value ? [].toString.call(binding.value) : undefined
    let configs = vnode.data.attrs ? (vnode.data.attrs.options ? vnode.data.attrs.options : undefined) : undefined

    let options = {
      mouseWheel: true,
      scrollbar: true,
      click: true,
      preventDefault: true,
      tap: true,
      // bounce: false,
      disableTouch: true
    }

    // 用户传入的配置会覆盖默认配置
    if (configs) {
      for (let key in configs) {
        options[key] = configs[key]
      }
    }

    // 设置iscorll属性的参数
    let iscrollOptions = options

    // 阻止touchmove默认事件
    el.addEventListener('touchmove', event => {
      event.preventDefault()
    })

    // 使用vnode绑定iscroll是为了让iscroll对象能够夸状态传递，避免iscroll重复建立
    vnode.scroll = new IScroll(el, iscrollOptions)
  },
  inserted: () => {

  },
  update: (el, binding, vnode, oldVnode) => {
    // 将scroll绑定到新的vnode上
    vnode.scroll = oldVnode.scroll

    // 使用settimeout让refresh跳到事件流结尾，保证refresh时数据已经更新完毕
    setTimeout(() => {
      vnode.scroll.refresh()
    }, 0)
  },
  componentUpdated: () => {

  },
  unbind: (el, binding, vnode, oldVnode) => {
    // 解除绑定时要把iscroll销毁
    vnode.scroll = oldVnode.scroll
    vnode.scroll.destroy()
    vnode.scroll = null
  }
})

let indexScrollTop = 0;

// 导航守卫
router.beforeEach((to, from, next) => {

  let moveCourse = to.query.moveCourse
  let courseState = to.query.courseState
  let redirectUrl = to.fullPath
  // console.log('redirectUrl: ' + redirectUrl)
  if (moveCourse) {
    if (courseState) {
      window.location.href = '/login'
    }
    Cookies.set('categoryId', '')
    Cookies.set('system', '')
    // 移动端跳转至学员端，提前记录
    Cookies.set('moveCourse', moveCourse)

  }

  let system = to.query.system
  let categoryId = to.query.categoryId
  if (categoryId && system) {
    Cookies.set('moveCourse', '')
    Cookies.set('courseState', '')
    Cookies.set('categoryId', categoryId)
    Cookies.set('system', system)
    window.location.href = '/login'
  }


  /* 路由发生变化修改页面meta */
  if (to.meta.content) {
    let head = document.getElementsByTagName('head');
    let meta = document.createElement('meta');
    meta.content = to.meta.content;
    head[0].appendChild(meta)
  }
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  // 进度条
  NProgress.start();
  if (to.fullPath !== '/') {
    // console.log(document.body.scrollTop)
    indexScrollTop = document.body.scrollTop;
  }

  let wxData = Cookies.get('userData');
  // console.log('检查userData', wxData)
  if (wxData && wxData != 'undefined') {
    wxData = JSON.parse(wxData)
  } else {
    wxData = {}
  }

  // 所有检测都在login进行，如果没有微信授权，登陆状态，就直接去登陆
  //检测是微信登录，则开始检测微信
  let dev = config.isProduction
  let ua = window.navigator.userAgent.toLowerCase();
  let userInfo = store.getters['login/userInfo'] ? store.getters['login/userInfo'] : {};
  let wxLoginStatus = store.getters['login/wxLoginStatus'] ? store.getters['login/wxLoginStatus'] : false;
  let loginStatus = store.getters['login/loginStatus'] ? store.getters['login/loginStatus'] : false;
  Cookies.set('beforeLoginUrl', to.fullPath);// 保存用户进入的url

  /**
   * 需要检测的状态
   * 1、微信无授权
   * 2、未登录
   */
  if (
    to.fullPath.indexOf("login") < 0 &&
    to.fullPath.indexOf("forget") < 0 &&
    to.fullPath.indexOf("registry") < 0 &&
    to.fullPath.indexOf("bind-phone") < 0 &&
    (
      (ua.match(/MicroMessenger/i) == 'micromessenger'
        && dev && Object.keys(wxData).length == 0) && (userInfo && (Object.keys(userInfo).length <= 0 && !userInfo.token)) ||
      (userInfo && (Object.keys(userInfo).length <= 0 && !userInfo.token))
    )
  ) {
    next({ path: '/login', query: { redirect: redirectUrl } });
  } else if (
    to.fullPath.indexOf("login") < 0 && (
      (ua.match(/MicroMessenger/i) == 'micromessenger'
        && dev && Object.keys(wxData).length > 0 && wxData.openId) && (userInfo && (Object.keys(userInfo).length > 0 && userInfo.token)) ||
      (userInfo && (Object.keys(userInfo).length > 0 && userInfo.token))
    )) {
    next()
  } else if (to.matched.some(record => record.meta.requiresAuth) && to.fullPath.indexOf("login") > 0) {

    //首先判断是否微信，如果是微信：
    //第一步，判断本地是否有openId,token, 如果少了一个就走一次登录流程
    //第二步，先去授权，重定向拿到code,换openId，再用openId自动登录，如果返回信息带token,则认为登录成功，否则，跳转至登录界面，且不允许退回，登录后，跳转至绑定界面，完成信息绑定，
    //至此，完成了微信登录的过程
    //如果不是微信，则走一般登录过程
    //判断本地是否有登录信息，如果没有则跳转至登录界面

    const code = to.query.code || void 0;
    //除了授权和登录相关页面，所有页面都需要已完全登录的状态
    if (to.fullPath.indexOf("bind-phone") > 0) {
      let loginStatus = store.getters['login/loginStatus'] ? store.getters['login/loginStatus'] : false;
      if (!loginStatus) {
        next({ path: '/login', query: { redirect: redirectUrl } });
      } else {
        next();
      }
      // 只有登陆界面需要检测
    } else if (to.fullPath.indexOf("login") > 0) {
      let before = Cookies.get('beforeLoginUrl')
      //如果用户登录成功，既有token，就在header加入token
      if (userInfo && (Object.keys(userInfo).length > 0 && userInfo.token) || wxData && Object.keys(wxData).length > 0 && wxData.token) {
        axios.defaults.headers.common['token'] = userInfo.token || wxData.token;
      }

      //检测是微信登录，则开始检测微信
      let dev = config.isProduction
      let ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger' && dev) {
        //判断是否传来code,直接去换openId
        let loginStatus = Cookies.get('loginStatus') === 'true' ? true : false
        if (Object.keys(to.query).length > 0 && to.query.code && Object.keys(wxData).length == 0) {
          let data = {
            params: {
              code: code,
              channel: 2
            },
            callback: (data) => {
              if (data.code === 0) {
                let newData = {
                  params: {
                    openId: data.data.openId,
                    // stationId: 2
                  },
                  callback: (d) => {
                    if (d.code === 0) {
                      store.commit('login/LOGIN', d.data)
                      //只要是自动登录成功，则是已经绑定微信用户，
                      Cookies.set('wxBindUser', 'true', { expires: 180 })
                      next('/index');
                    } else {
                      //既微信未绑定用户
                      Cookies.set('wxBindUser', 'false', { expires: 180 })
                      // 自动登录失败，去登录
                      next();
                    }
                  }
                }
                //检查是否自动登录
                let checkAuto = Cookies.get('canAutoLogin')
                if (loginStatus === false && (!checkAuto || checkAuto == '1')) {
                  store.dispatch('login/onAutoLogin', newData)//code换取openId等微信信息，并存入本地
                } else if (loginStatus === false && checkAuto == '0') {
                  //既微信未绑定用户
                  Cookies.set('wxBindUser', 'false', { expires: 180 })
                  // 自动登录失败，去登录
                  next()
                } else {
                  next()
                }
              }
            }
          }
          store.dispatch('login/onGetOpenId', data)//code换取openId等微信信息，并存入本地

        } else {
          //如果本地没有微信信息，就去授权界面
          if (!wxData.openId) {
            //  微信后台设置回调地址
            const url = encodeURIComponent(`${config.origin}` + before);
            setTimeout(function () {
              window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.wx.appid}&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`)
            }, 1000)
            return false
          } else {
            // 本地有微信信息，自动登录
            let newData2 = {
              params: {
                openId: wxData.openId,
                // stationId: 2
              },
              callback: (d) => {
                if (d.code === 0) {
                  Cookies.set('wxBindUser', 'true', { expires: 180 })
                  store.commit('login/LOGIN', d.data)
                  next('/index')
                } else {
                  //既微信未绑定用户
                  Cookies.set('wxBindUser', 'false', { expires: 180 })
                  // 自动登录失败，去登录
                  next();
                }
              }
            }
            //检查是否自动登录
            let checkAuto = Cookies.get('canAutoLogin')
            if (loginStatus === false && (!checkAuto || checkAuto == '1')) {
              store.dispatch('login/onAutoLogin', newData2)//code换取openId等微信信息，并存入本地
            } else if (loginStatus === false && checkAuto == '0') {
              //既微信未绑定用户
              Cookies.set('wxBindUser', 'false', { expires: 180 })
              // 自动登录失败，去登录
              next();
            } else {

              next()

            }
          }
        }
      } else {
        console.log("!-------------------")
        console.log(to.fullPath)
        //非微信浏览器用户，只判断是否登录，如果未登录，则跳转登录界面
        let loginStatus = Cookies.get('loginStatus') === 'true' ? true : false
        if (loginStatus === false) {
          if (to.fullPath.indexOf("login") < 0) {
            next({ path: '/login', query: { redirect: redirectUrl } });
          } else {
            next();
          }
        } else {

          next()

        }
      }
    }
  } else {
    next()
  }
});

router.afterEach(route => {
  NProgress.done();
  if (route.path !== '/') {
    document.body.scrollTop = 0;
  } else {
    Vue.nextTick(() => {
      document.body.scrollTop = indexScrollTop;
    });
  }
});
/* eslint-enable */
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
