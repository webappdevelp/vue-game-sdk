<template>
  <div class="hy-dialog">
    <transition name="fade" type="animation">
      <div v-if="show" ref="bg" class="hy-dialog-bg" :style="bgStyle" @click="close"></div>
    </transition>
    <transition :name="animate" type="animation">
      <template v-if="show">
        <slot :scope="{frontStyle}"></slot>
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
  animation: fadeOut 0.2s;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.right-enter-active {
  animation: rightIn 0.3s;
}
.right-leave-active {
  animation: rightOut 0.3s;
}
@keyframes rightIn {
  from {
    opacity: 0;
    visibility: hidden;
    transform: translate(120%, -50%);
  }
  to {
    opacity: 1;
    visibility: visible;
    transform: translate(0, -50%);
  }
}
@keyframes rightOut {
  from {
    opacity: 1;
    visibility: visible;
    transform: translate(0, -50%);
  }
  to {
    opacity: 0;
    visibility: hidden;
    transform: translate(120%, -50%);
  }
}

.left-enter-active {
  animation: leftIn 0.3s;
}
.left-leave-active {
  animation: leftOut 0.3s;
}
@keyframes leftIn {
  from {
    opacity: 0;
    visibility: hidden;
    transform: translate(-120%, 0);
  }
  to {
    opacity: 1;
    visibility: visible;
    transform: translate(0, 0);
  }
}
@keyframes leftOut {
  from {
    opacity: 1;
    visibility: visible;
    transform: translate(0, 0);
  }
  to {
    opacity: 0;
    visibility: hidden;
    transform: translate(-120%, 0);
  }
}
</style>
