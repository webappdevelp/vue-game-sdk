<template>
  <div class="ad" v-if="!!datas.adsc">
    <ad-drag
      :show="true"
      :bg-img="''"
      :drag-style="{ zIndex: '10', top: 'auto', bottom: '30%', right: '0', width: '75px', height: '75px' }"
      @click="toggleWelfare"
    >
      <div class="ad-drag">
        <img
          class="ad-logo animated infinite headShake"
          :src="require(`@/assets/ad/${datas.adsc}/logo.png`)"
          alt="抖音"
        />
        <p>戳我领红包</p>
      </div>
    </ad-drag>
    <transition-group name="fade">
      <div v-show="welfare" class="mask" key="mask"></div>
      <div v-show="welfare" class="welfare" key="box">
        <a class="close" @click="toggleWelfare"></a>
        <img :src="require('@/assets/ad/douyin/10277/03.png')" alt="抖音专享福利" />
      </div>
    </transition-group>
    <msg-box
      :show.sync="retain"
      :cancel-btn="{ style: { color: 'rgba(0, 122, 255, .65)' }, text: '残忍离开' }"
      :ok-btn="{ style: { color: '#007aff' }, text: '再玩会儿' }"
      @close="hideRetain"
      @cancel="goBack"
      @ok="hideRetain"
    >
      <span slot="header"></span>
      <template slot="body">
        <div class="retain-content">
          <img class="qrcode" :src="require(`@/assets/games/${datas.gameId ? `${datas.gameId}/` : ''}wxqrcode.jpg`)" :alt="datas.gameName" />
          <p>扫描二维码关注“{{ datas.gameName }}”公众号, 获取更多内容, 有快速进入游戏的入口哦~</p>
        </div>
      </template>
    </msg-box>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import MsgBox from '@/components/core/msgBox/index.vue';
import AdDrag from './Drag.vue';

@Component({
  components: {
    AdDrag,
    MsgBox
  }
})
export default class Ad extends Vue {
  @Prop({
    type: Object,
    default: () => ({})
  })
  private datas!: { adsc: string; wl: string };

  private data() {
    return {
      welfare: false,
      retain: false
    }
  }

  // methods
  private toggleWelfare() {
    this.$data.welfare = !this.$data.welfare;
  }

  // 返回上一页
  private goBack() {
    window.history.back();
  }
  // 继续停留
  private hideRetain() {
    this.$data.retain = false;
    // window.history.pushState(null, '', '#');
  }

  // lifecycle
  private created() {
    const { wl } = this.datas;
    // 存在挽留字段，则操作
    if (wl) {
      window.history.pushState(null, '', '#');
      window.addEventListener('popstate', () => {
        this.$data.retain = true;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  z-index: 200;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .46);
}
.welfare {
  position: fixed;
  z-index: 210;
  top: 50%;
  right: 0;
  left: 0;
  transform: translate3d(0, -50%, 0);
  margin: 0 auto;
  img {
    width: 100%;
    height: auto;
  }
  .close {
    position: absolute;
    z-index: 1;
    top: 5px;
    right: 30px;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
}
.retain-btn {
  flex: 1;
  padding: 14px 0 12px;
  font-size: 14px;
  text-align: center;
  color: rgba(0, 122, 255, .65);
  box-sizing: border-box;
  &:hover,
  &:active {
    background: rgba(221, 221, 221, .2)
  }
}

.ad-drag {
  padding: 5px 0;
  background: #000;
  border-radius: 20%;
  overflow: hidden;
  text-align: center;
  p {
    color: #fff;
    font-size: 12px;
    white-space: nowrap;
  }
}
.ad-logo {
  display: block;
  width: 50%;
  height: auto;
  margin: 0 auto 5px;
}

.retain-content {
  .qrcode {
    display: block;
    width: 100%;
    max-width: 50%;
    height: auto;
    margin: 0 auto 5px;
  }
}


.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

.animated.infinite {
  animation-iteration-count: infinite;
}

@keyframes headShake {
  0% {
    transform: translateX(0);
  }

  6.5% {
    transform: translateX(-3px) rotateY(-9deg);
  }

  18.5% {
    transform: translateX(2px) rotateY(7deg);
  }

  31.5% {
    transform: translateX(-2px) rotateY(-5deg);
  }

  43.5% {
    transform: translateX(1px) rotateY(3deg);
  }

  50% {
    transform: translateX(0);
  }
}

.headShake {
  animation-timing-function: ease-in-out;
  animation-name: headShake;
}
.shake {
  animation-name: shake;
}
</style>