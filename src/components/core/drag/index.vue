<template>
  <div
    ref="drag" 
    class="drag"
    @click="click"
    @touchstart="touchStart"
    @mousedown="touchStart">
      <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Drag extends Vue {

  private click() {
    this.$emit('click');
  }

  private touchStart(event: any) {
    let touch: any;
    if (event.touches) {
      touch = event.touches[0];
    } else {
      touch = event;
    }
    const dragEl = this.$refs.drag as HTMLElement;
    const dragWidth = dragEl.clientWidth;
    const dragHeight = dragEl.clientHeight;
    const movedX = dragEl.offsetLeft;
    const movedY = dragEl.offsetTop;
    this.$data.movedX = movedX;
    this.$data.movedY = movedY;
    this.$emit('start', {
      dragWidth,
      dragHeight,
      movedX,
      movedY
    });
    this.$data.moving = true;
  }
  private touchMove(event: TouchEvent | MouseEvent) {
    if (this.$data.moving) {
      let touch: any;
      if ((event as TouchEvent).touches) {
        touch = (event as TouchEvent).touches[0];
      } else {
        touch = event;
      }
      const { clientX, clientY } = touch;
      this.$data.movedX = clientX;
      this.$data.movedY = clientY;
      const dragEl = this.$refs.drag as HTMLElement;
      this.$emit('move', {
        movedX: clientX,
        movedY: clientY
      });
      event.preventDefault();
    }
  }
  private touchEnd() {
    if (this.$data.moving) {
      const { movedX, movedY } = this.$data;
      const dragEl = this.$refs.drag as HTMLElement;
      const dragWidth = dragEl.clientWidth;
      const dragHeight = dragEl.clientHeight;
      const dragOffsetLeft = dragEl.offsetLeft;
      const dragOffsetTop = dragEl.offsetTop;
      this.$emit('end', {
        movedX,
        movedY,
        dragOffsetLeft,
        dragOffsetTop,
        dragWidth,
        dragHeight
      });
    }
    this.$data.moving = false;
  }
  // lifecycles
  private mounted() {
    const drag = this;
    document.addEventListener('touchmove', drag.touchMove, { passive: false });
    document.addEventListener('touchend', drag.touchEnd, false);
    document.addEventListener('mousemove', drag.touchMove, { passive: false });
    document.addEventListener('mouseup', drag.touchEnd, false);
    window.addEventListener(
      'resize',
      () => {
        drag.$emit('resize');
      },
      false
    );
  }
  private destoryed() {
    const drag = this;
    document.removeEventListener('touchmove', drag.touchMove, false);
    document.removeEventListener('mousemove', drag.touchMove, false);
    document.removeEventListener('touchend', drag.touchEnd, false);
    document.removeEventListener('touchmove', drag.touchEnd, false);
  }
}
</script>

<style lang="scss" scoped>
.drag {
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>