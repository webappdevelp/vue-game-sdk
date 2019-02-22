<template>
  <transition name="fade">
    <div v-if="show" class="hy-toast">
      <div class="hy-toast-text">{{ msg }}</div>
    </div>
  </transition>
</template>
<script lang="ts">
let timer: any = null;
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class HyToast extends Vue {
  @Prop({
    type: Number,
    default: 2000
  })
  private time!: number;
  @Prop({
    type: String,
    default: ''
  })
  private msg!: string;
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;

  // methods
  private hide() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      this.$emit('update:show', false);
    }, this.time);
  }

  private updated() {
    if (this.show) {
      this.hide();
    }
  }
}
</script>
<style lang="scss" scoped>
.fade-enter,
.fade-leave-to {
  opacity: 0;
  visibility: hidden;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter-to,
.fade-leave {
  opacity: 1;
  visibility: visible;
}
.hy-toast {
  &-bg,
  &-text {
    position: fixed;
    z-index: 1001;
  }
  &-bg {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: transparent;
    width: 100%;
    height: 100%;
  }
  &-text {
    top: 50%;
    left: 50%;
    padding: 5px 7px;
    border-radius: 2px;
    font-size: 14px; /*px*/
    color: #fff;
    background: rgba(0, 0, 0, 0.75);
    transform: translate3d(-50%, -50%, 0);
  }
}
</style>
