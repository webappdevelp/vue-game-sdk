<template>
  <div class="drag">
    <hy-drag
      :drag-style="controlDragStyle"
      @click="showCenter"
      @drag-start="controlDragStart"
      @drag-move="controlDragMove"
      @drag-end="controlDragEnd"
      @resize="controlDragResize"
    >
      <div class="hy-control"></div>
    </hy-drag>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import HyDrag from '@/components/Drag.vue';
@Component({
  components: {
    HyDrag
  }
})
export default class Drag extends Vue {
  private data() {
    return {
      controlDragStyle: {
        zIndex: '10',
        top: '13%',
        right: '-10px'
      }
    };
  }

  // methods
  private controlDragStart() {
    const { controlDragStyle } = this.$data;
    this.$data.controlDragStyle = {
      ...controlDragStyle,
      opacity: '1',
      transition: 'unset',
      webkitTransition: 'unset'
    };
  }
  private controlDragMove(params: { movedX: number; movedY: number }) {
    const { controlDragStyle } = this.$data;
    const { movedX, movedY } = params;
    this.$data.controlDragStyle = {
      ...controlDragStyle,
      left: `${movedX}px`,
      top: `${movedY}px`
    };
  }
  private controlDragEnd(params: { dragOffsetLeft: number; dragOffsetTop: number }) {
    const { controlDragStyle, controlBadgeStyle } = this.$data;
    const { dragOffsetLeft, dragOffsetTop } = params;
    const screenWidth = document.body.clientWidth || document.documentElement.clientWidth;
    const screenHeight = document.body.clientHeight || document.documentElement.clientHeight;
    const difX = screenWidth - dragOffsetLeft;
    const difY = screenHeight - dragOffsetTop;
    const obj: any = {
      left: dragOffsetLeft,
      top: dragOffsetTop,
      right: difX,
      bottom: difY
    };
    const min = Math.min(dragOffsetLeft, dragOffsetTop, difX, difY);
    let left = 0;
    let top = 0;
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === min) {
        switch (key) {
          case 'left':
            left = -10;
            break;
          case 'top':
            top = -10;
            break;
          case 'bottom':
            top = screenHeight - 30;
            break;
          case 'right':
            left = screenWidth - 30;
            break;
        }
      }
    }
    if (left !== 0) {
      this.$data.controlDragStyle = {
        ...controlDragStyle,
        left: `${left}px`,
        right: 'auto',
        bottom: 'auto',
        willChange: 'auto',
        transition: 'all .3s ease',
        webkitTransition: 'all .3s ease'
      };
    } else {
      this.$data.controlDragStyle = {
        ...controlDragStyle,
        top: `${top}px`,
        right: 'auto',
        bottom: 'auto',
        willChange: 'auto',
        transition: 'all .3s ease',
        webkitTransition: 'all .3s ease'
      };
    }
  }
  private controlDragResize() {
    this.$data.controlDragStyle = {
      zIndex: '10',
      top: '13%',
      right: '-10px'
    }
  }
}
</script>
<style lang="scss" scoped>
.hy-control {
  position: relative;
  width: 40px;
  height: 40px;
  background: url('../assets/scenes/control.png') center no-repeat;
  background-size: contain;
  .hy-badge {
    position: absolute;
    top: 0;
    left: auto;
    right: 30px;
    text-align: center;
    transition: all 0.3s ease;
  }
}
</style>
