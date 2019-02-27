<template>
  <div class="hy-dialog">
    <transition name="fade">
      <div v-if="show" ref="bg" class="hy-dialog-bg" :style="bgStyle" @click="close"></div>
    </transition>
    <transition :name="animate">
      <template v-if="show">
        <slot :scope="frontStyle"></slot>
      </template>
    </transition>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class HyScenesModal extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;
  @Prop({
    type: String,
    default: 'fade'
  })
  private animate!: string;
  @Prop({
    type: String,
    default: '20'
  })
  private zIndex!: string;
  @Prop({
    type: String,
    default: '0'
  })
  private width!: string;
  @Prop({
    type: String,
    default: '0'
  })
  private height!: string;

  // computed
  get bgStyle() {
    return {
      zIndex: this.zIndex
    };
  }
  get frontStyle() {
    return {
      position: 'fixed',
      zIndex: Number(this.zIndex) + 1
    };
  }

  // methods
  private close() {
    this.$emit('close');
  }

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
.hy-dialog {
  height: 0;
  font-size: 0;
  &-bg {
    position: fixed;
    z-index: 20;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.45);
  }
}

.fade-enter-active {
  animation: fadeIn 0.2s;
}
.fade-leave-active {
  animation: fadeIn 0.2s reverse;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.right-enter-active {
  animation: rightIn 0.3s;
}
.right-leave-active {
  animation: rightIn 0.3s reverse;
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