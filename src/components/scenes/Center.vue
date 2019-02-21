<template>
  <div class="hy-center">
    <transition name="fade">
      <div v-if="show" class="hy-center-bg" @click="hide"></div>
    </transition>
    <transition name="left">
      <div v-if="show" class="hy-center-box">
        <center-header />
        <ul class="hy-center-current">
          <li>
            <p>您正在玩：贪玩蓝月</p>
          </li>
        </ul>
        <div class="hy-center-body">
          <menus :current.sync="currentTab" />
          <div class="center-info-box">
            <gifts v-if="currentTab === 1" />
            <infos v-else-if="currentTab === 2" />
          </div>
        </div>
        <div class="hy-center-control">
          <a href="javascript:;" @click="hide">
            <icon name="back" />
          </a>
          <a href="javascript:;" @click="refresh">
            <icon name="refresh__b" />
            刷新游戏
          </a>
        </div>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import CenterHeader from './center/Header.vue';
import Menus from './center/Menus.vue';
import Gifts from './center/Gifts.vue';
import Infos from './center/Infos.vue';
import Icon from '../Icon.vue';
@Component({
  components: {
    CenterHeader,
    Menus,
    Gifts,
    Infos,
    Icon
  }
})
export default class HyScenesCenter extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;

  private data() {
    return {
      currentTab: 1
    };
  }

  // methods
  private hide() {
    this.$emit('update:show', false);
  }
  private refresh() {
    window.location.reload();
  }
}
</script>
<style lang="scss" scoped>
.hy-center {
  height: 0;
  font-size: 0;
  &-bg,
  &-box {
    position: fixed;
    z-index: 110;
  }
  &-bg {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
  }
  &-box {
    z-index: 111;
    top: 0;
    bottom: 0;
    left: 0;
    width: 85%;
    background: #fff;
  }
}
.hy-center-current {
  padding: 0 12px;
  background: url('../../assets/scenes/center/gl-panel-server.jpg') center
    no-repeat;
  background-size: 100% auto;
  li {
    padding: 10px 0;
    font-size: 15px;
    color: #333;
  }
}
.center-info-box {
  height: calc(100vh - 159px);
}
.hy-center-control {
  position: absolute;
  right: -28px;
  top: 50%;
  transform: translate3d(0, -50%, 0);
  a {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    min-height: 78px;
    width: 28px;
    padding: 10px 0;
    border-radius: 0 5px 5px 0;
    box-sizing: border-box;
    background: #f5f6f7;
    overflow: hidden;
    .hy-icon {
      width: 18px;
      height: 18px;
    }
    .hy-icon-back {
      margin-right: -10px;
    }
  }
  a + a {
    margin-top: 20px;
    color: #926b43;
    word-break: break-all;
    writing-mode: vertical-lr;
    background: #f5dec6;
  }
}

.fade-enter-active {
  animation: fadeIn 0.3s;
}
.fade-leave-active {
  animation: fadeIn 0.3s reverse;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.left-enter-active {
  animation: leftIn 0.3s;
}
.left-leave-active {
  animation: leftIn 0.3s reverse;
}
@keyframes leftIn {
  from {
    opacity: 0;
    visibility: hidden;
    transform: translate3d(-120%, 0, 0);
  }
  to {
    opacity: 1;
    visibility: visible;
    transform: translate3d(0, 0, 0);
  }
}
</style>
