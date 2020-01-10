<template>
  <section class="main">
    <div v-if="!showStep2" class="step step1" key="step1">
      <img
        class="img animated swing infinite"
        alt="戳我"
        :src="require('@/assets/ad/douyin/10277/01.png')"
        @click="step"
      />
    </div>
    <transition name="fade">
      <div v-if="showStep2" class="step step2" key="step2">
        <img
          class="img"
          alt="进入游戏领取奖励"
          :src="require('@/assets/ad/douyin/10277/02.png')"
          @click="play"
        />
      </div>
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
.img {
  width: 100%;
  height: auto;
  position: absolute;
  top: 50%;
  transform: translate3d(0, -50%, 0);
}
.step {
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #222;
  overflow: hidden;
}
.animated {
  animation-duration: 4s;
  animation-fill-mode: both;
}
.animated.infinite {
  animation-iteration-count: infinite;
}
@keyframes swing {
  5% {
    transform: translate3d(0, -50%, 0) rotate3d(0, 0, 1, 15deg);
  }

  10% {
    transform: translate3d(0, -50%, 0) rotate3d(0, 0, 1, -10deg);
  }

  15% {
    transform: translate3d(0, -50%, 0) rotate3d(0, 0, 1, 5deg);
  }

  20% {
    transform: translate3d(0, -50%, 0) rotate3d(0, 0, 1, -5deg);
  }

  25%,
  50% {
    transform: translate3d(0, -50%, 0) rotate3d(0, 0, 1, 0deg);
  }

  55% {
    transform: translate3d(0, -50%, 0) rotate3d(0, 0, 1, 15deg);
  }

  60% {
    transform: translate3d(0, -50%, 0) rotate3d(0, 0, 1, -10deg);
  }

  65% {
    transform: translate3d(0, -50%, 0) rotate3d(0, 0, 1, 5deg);
  }

  70% {
    transform: translate3d(0, -50%, 0) rotate3d(0, 0, 1, -5deg);
  }

  75%,
  100% {
    transform: translate3d(0, -50%, 0) rotate3d(0, 0, 1, 0deg);
  }

}

.swing {
  transform-origin: center center;
  animation-name: swing;
}

</style>