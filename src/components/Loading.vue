<template>
  <transition name="fade">
    <div v-if="show" class="hy-loading">
      <div class="hy-loading-bg"></div>
      <div class="hy-loading-animate">
        <div class="hy-loading-shape hy-loading-shape1"></div>
        <div class="hy-loading-shape hy-loading-shape2"></div>
        <div class="hy-loading-shape hy-loading-shape3"></div>
        <div class="hy-loading-shape hy-loading-shape4"></div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class HyLoading extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;
}
</script>
<style lang="scss" scoped>
.hy-loading {
  &-bg {
    position: fixed;
    z-index: 1009;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
  }
  &-animate {
    position: fixed;
    z-index: 1100;
    top: 50%;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 30px;
    height: 30px;
    transform: translate3d(0, -50%, 0) rotate(10deg);
    animation: rotation 1s infinite;
  }
  &-shape {
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  &-shape1 {
    left: 0;
    background: #5c6bc0;
    animation: shape1 0.5s ease 0s infinite alternate;
  }
  &-shape2 {
    right: 0;
    background: #8bc34a;
    animation: shape2 0.5s ease 0s infinite alternate;
  }
  &-shape3 {
    bottom: 0;
    background: #ffb74d;
    animation: shape3 0.5s ease 0s infinite alternate;
  }
  &-shape4 {
    bottom: 0;
    right: 0;
    background: #f44336;
    animation: shape4 0.5s ease 0s infinite alternate;
  }
}

@keyframes rotation {
  from {
    transform: translate3d(0, -50%, 0) rotate(0deg);
  }
  to {
    transform: translate3d(0, -50%, 0) rotate(360deg);
  }
}

@keyframes shape1 {
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(25px, 25px);
  }
}

@keyframes shape2 {
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(-25px, 25px);
  }
}

@keyframes shape3 {
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(25px, -25px);
  }
}

@keyframes shape4 {
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(-25px, -25px);
  }
}
</style>
