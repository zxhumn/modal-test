<template>
  <div id="app">
    <transition :name="transitionName">
      <div class="keep-alive-ctn">
        <keep-alive>
          <router-view class="pages router-view child-view" v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view class="pages router-view child-view" v-if="!$route.meta.keepAlive"></router-view>
      </div>
    </transition>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  name: 'App',
  data () {
    return {
      transitionName: 'fade',
      selected: '课程'
    }
  },
  watch: {
    '$route' (to, from) {
      // console.log(to, from)
      // 路由切换动画
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slideInRight' : 'slideInLeft'
    }
  },
  mounted () {
    /* if (Cookies.get('stationId') == 2) { */
      // require('/static/style-2.css')
      this.$requireLinkStyle('/static/style-2.css', 'edpSwitchStyle')
    // }
  }
}
</script>

<style lang="less">
@import './assets/common';

/*flex 布局*/
.pages {
  display: -webkit-box;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  height: 100%;
  // overflow: hidden;
}

.keep-alive-ctn {
  width: 100%;
  height: 100%;
}

.child-view {
  transition: all 0.3s ease;
}
</style>
