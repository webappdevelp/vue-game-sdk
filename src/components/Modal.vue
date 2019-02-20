<template>
<div class="hy-modal">
  <transition name="fade">
    <div v-if="show" ref="bg" class="hy-modal-bg"></div>
  </transition>
  <transition :name="animate">
    <div v-if="show" class="hy-modal-box">
      <slot></slot>
    </div>
  </transition>
</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class HyScenesModal extends Vue {
  @Prop({
    type: String,
    default: ''
  })
  private animate!: string;
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;

  // lifecycles
  private updated() {
    if (this.show) {
      const bg = this.$refs.bg as Element;
      bg.addEventListener('touchmove', (e: Event) => {
        e.preventDefault();
      });
    }
  }
}
</script>
<style lang="scss">
.hy-modal {
  height: 0;
  font-size: 0;
  &-bg,
  &-box {
    position: fixed;
  }
  &-bg {
    z-index: 999;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.45);
  }
  &-box {
    z-index: 1000;
    top: 50%;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 280px;
    padding: 0;
    background-color: #fff;
    transform: translate3d(0, -50%, 0);
    border-radius: 6px;
    box-sizing: border-box;
    overflow: hidden;
  }
}

.fade-enter-active {
  animation: fadeIn .3s;
}
.fade-leave-active {
  animation: fadeIn .3s reverse;
}
@keyframes fadeIn{
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.right-enter-active {
  animation: rightIn .3s;
}
.right-leave-active {
  animation: rightIn .3s reverse;
}
@keyframes rightIn {
  from {
    opacity: 0;
    visibility: hidden;
    transform: translate3d(120%, -50%, 0);
  }
  to {
    opacity: 1;
    visibility: visible;
    transform: translate3d(0, -50%, 0);
  }
}
</style>
