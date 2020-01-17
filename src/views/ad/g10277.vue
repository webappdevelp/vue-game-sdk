<template>
  <section class="main">
    <img
      v-show="!showStep2"
      key="step1"
      class="img animated infinite swing"
      alt="戳我"
      :src="require('@/assets/ad/douyin/10277/01.png')"
      @click="step"
    />
    <transition name="fade" type="animation">
      <img
        v-show="showStep2"
        key="step2"
        class="img"
        alt="进入游戏领取奖励"
        :src="require('@/assets/ad/douyin/10277/02.png')"
        @click="play"
      />
    </transition>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Ad10277 extends Vue {
  private data() {
    return {
      showStep2: false
    }
  }

  private step() {
    this.$data.showStep2 = true;
  }
  private play() {
    const { query } = this.$route;
    this.$router.push({
      path: '/sw',
      query: {
        ...query
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.main {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #222;
  overflow: hidden;
}
.img {
  width: 100%;
  height: auto;
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  max-width: 750px;
}
.animated {
  animation-duration: 4s;
  animation-fill-mode: both;
}
.animated.infinite {
  animation-iteration-count: infinite;
}
@keyframes swing {
  0% {
    transform: rotate3d(0, 0, 1, 0deg);
  }
  5% {
    transform: rotate3d(0, 0, 1, 15deg);
  }

  10% {
    transform: rotate3d(0, 0, 1, -10deg);
  }

  15% {
    transform: rotate3d(0, 0, 1, 5deg);
  }

  20% {
    transform: rotate3d(0, 0, 1, -5deg);
  }

  25%,
  50% {
    transform: rotate3d(0, 0, 1, 0deg);
  }

  55% {
    transform: rotate3d(0, 0, 1, 15deg);
  }

  60% {
    transform: rotate3d(0, 0, 1, -10deg);
  }

  65% {
    transform: rotate3d(0, 0, 1, 5deg);
  }

  70% {
    transform: rotate3d(0, 0, 1, -5deg);
  }

  75%,
  100% {
    transform: rotate3d(0, 0, 1, 0deg);
  }

}

.swing {
  transform-origin: 50% 50%;
  animation-name: swing;
}


</style>