<template>
  <div class="hy-icon" :class="icon" @click="action"></div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class HyIcon extends Vue {
  @Prop({
    type: String,
    default: ''
  })
  private name!: string;

  get icon() {
    return `hy-icon-${this.name}`;
  }

  // methods
  private action() {
    this.$emit('click');
  }
}
</script>
<style lang="scss">
.hy-icon {
  position: relative;
  display: inline-block;
  width: 25px;
  height: 25px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
  & + & {
    margin-left: 5px;
  }
  &:active {
    background-color: #dadada;
  }
  &-account {
    background-image: url('../assets/scenes/icons/account.png');
  }
  &-lock {
    background-image: url('../assets/scenes/icons/lock.png');
  }
  &-eye {
    background-image: url('../assets/scenes/icons/eye.png');
    &.open {
      background-image: url('../assets/scenes/icons/eye-open.png');
    }
  }
  &-open-eye {
    background-image: url('../assets/scenes/icons/eye-open.png');
  }
  &-mobile {
    background-image: url('../assets/scenes/icons/mobile.png');
  }
  &-safety {
    background-image: url('../assets/scenes/icons/safety.png');
  }
  &-close,
  &-clear {
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 2px;
      height: 22px;
      background: #999;
      border-radius: 2px;
    }
    &::before {
      transform: translate3d(-50%, -50%, 0) rotate(-45deg);
    }
    &::after {
      transform: translate3d(-50%, -50%, 0) rotate(45deg);
    }
  }
  &-back {
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 12px;
      height: 12px;
      transform: translate3d(-50%, -50%, 0) rotate(-45deg);
      border-width: 2px;
      border-style: solid;
      border-color: #999 transparent transparent #999;
    }
  }
  &-lock__w {
    background-image: url('../assets/scenes/icons/lock-w.png');
  }
  &-mobile__w {
    background-image: url('../assets/scenes/icons/mobile-w.png');
  }
  &-kf__w {
    background-image: url('../assets/scenes/icons/kf-w.png');
  }
  &-bbs__w {
    background-image: url('../assets/scenes/icons/bbs-w.png');
  }
  &-switch__w {
    background-image: url('../assets/scenes/icons/switch-w.png');
  }
}
</style>
