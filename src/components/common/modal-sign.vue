<template>
  <div class="modal" v-show="visible">
    <div class="mask"></div>
    <div class="modal-content">
      <div class="modal-content-inner animated fixedAnimatedTime" :class="{zoomIn: changeClass, zoomOut: !changeClass}">
        <a href="javascript:;" class="close" @click="hide">
          <!-- <span>×</span> -->
        </a>
        <div class="bd">
          <slot name="bd"></slot>
        </div>
        <div class="fd">
          <slot name="fd"></slot>
        </div>
        <div class="fd">
          <slot name="sd"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    value: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      visible: false,
      changeClass: false
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.visible = val
        this.changeClass = val
      } else {
        // 为了动画
        setTimeout(() => {
          this.visible = val
        }, 300)
        this.changeClass = val
      }
    },
    visible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    hide () {
      // 为了动画
      setTimeout(() => {
        this.visible = false
        // this.$emit("input", false);
      }, 300)

      this.changeClass = false
    },

    show () {
      // 为了动画
      setTimeout(() => {
        this.visible = true
        // this.$emit("input", true);
      }, 300)

      this.changeClass = true
    }
  },

  mounted () { },

  updated () { }
}
</script>

<style scoped lang="less">
@import '../../assets/mixin.less';
.fixedAnimatedTime {
  animation-duration: 0.3s;
}

.modal {
  position: fixed;
  top: -100px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
}
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(51, 51, 51, 1);
  opacity: 0.5;
}
.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  width: 75%;
  border-radius: 3px;
  font-size: 16px;
  /*-webkit-user-select: none;*/
  /*overflow: hidden;*/
  /*-webkit-backface-visibility: hidden;*/
  /*backface-visibility: hidden;*/
  /*-webkit-transition: .2s;*/
  /*transition: .2s;*/

  .bd {
    text-align: center;
    font-size: 30px;
  }

  .modal-content-inner {
    position: relative;
    // padding: 30px 50px;
    background-color: #fff;
    border-radius: 8px;

    .close {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 34px;
      height: 34px;
      // line-height: 54px;
      color: #fff;
      border-radius: 100%;

      background-size: 100%;
      background-repeat: no-repeat;
      .bg-image('../assets/img/points/closeP');

    }
  }

  .fd {
    text-align: center;
  }
}
</style>
