<template>
  <div
    ref="drag"
    class="hy-drag"
    :style="dragStyle"
    @click="clickAction"
    @touchstart="touchStart"
    @mousedown="touchStart"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class HyDrag extends Vue {
  @Prop({
    type: Object,
    default: () => {
      return {};
    }
  })
  private dragStyle!: object;

  private data() {
    return {
      moving: false,
      movedX: 0,
      movedY: 0
    };
  }

  // methods
  private clickAction() {
    this.$emit('click');
  }
  private touchStart(event: any) {
    let touch: any;
    if (event.touches) {
      touch = event.touches[0];
    } else {
      touch = event;
    }
    const { clientX, clientY } = touch;
    const dragEl = this.$refs.drag as HTMLElement;
    const dragWidth = dragEl.clientWidth;
    const dragHeight = dragEl.clientHeight;
    const movedX = dragEl.offsetLeft + dragWidth / 2;
    const movedY = dragEl.offsetTop + dragHeight / 2;
    this.$data.movedX = movedX;
    this.$data.movedY = movedY;
    this.$emit('drag-start', {
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
      this.$emit('drag-move', {
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
      this.$emit('drag-end', {
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
    document.addEventListener('mousemove', drag.touchMove, { passive: false });
    document.addEventListener('touchend', drag.touchEnd, false);
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
.hy-drag {
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
}
</style>
