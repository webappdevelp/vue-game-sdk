<template>
  <transition name="fade" type="animation">
    <div v-if="show" class="hy-toast">{{ msg }}</div>
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

  get activeClass() {
    return this.show ? 'show' : 'hide';
  }
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
.hy-toast {
  position: fixed;
  z-index: 1001;
  top: 50%;
  left: 50%;
  max-width: 65%;
  text-align: center;
  line-height: 1.5;
  padding: 10px 30px;
  word-break: break-all;
  background: rgba(46, 46, 46, 0.8);
  border-radius: 7px;
  box-sizing: border-box;
  color: #fff;
  font-size: 14px; /*px*/
  transform: translate3d(-50%, -50%, 0);
  will-change: auto;
}
.fade-enter-active {
  animation: fadeIn 0.3s;
}
.fade-leave-active {
  animation: fadeOut 0.3s;
}
@keyframes fadeIn {
  from {
    transform: translate3d(-50%, 100%, 0);
    opacity: 0;
    visibility: hidden;
  }
  to {
    transform: translate3d(-50%, -50%, 0);
    opacity: 1;
    visibility: visible;
  }
}
@keyframes fadeOut {
  from {
    opacity: 1;
    visibility: visible;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
}
</style>
