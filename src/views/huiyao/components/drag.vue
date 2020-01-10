<template>
  <drag
    :style="dragStyle"
    @start="dragStart"
    @move="dragMove"
    @end="dragEnd"
    @resize="dragResize"
    @click="click">
      <badge :style="badgeStyle" :is-dot="true" />
  </drag>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Drag from '@/components/core/drag/index.vue';
import Badge from '@/components/core/badge/index.vue';

@Component({
  components: {
    Drag,
    Badge
  }
})
export default class HDrag extends Vue {
  @Prop({
    type: String,
    default: require('@/assets/huiyao/drag.png')
  })
  private bgImg!: string;


  private data() {
    return {
      dragStyle: {
        backgroundImage: `url(${this.bgImg}`,
        width: '45px',
        height: '45px'
      },
      badgeStyle: {
        position: 'absolute'
      }
    }
  }

  private click() {
    this.$emit('click');
  }

  // 拖拽功能
  private dragStart() {
    const { dragStyle, iframeStyle } = this.$data;
    this.$data.dragStyle = {
      ...dragStyle,
      opacity: '1',
      transition: 'unset',
      webkitTransition: 'unset'
    };
    this.$data.iframeStyle = {
      ...iframeStyle,
      pointerEvents: 'none'
    };
  }
  private dragMove(params: { movedX: number; movedY: number }) {
    const { dragStyle, iframeStyle } = this.$data;
    const { movedX, movedY } = params;
    this.$data.dragStyle = {
      ...dragStyle,
      left: `${movedX}px`,
      top: `${movedY}px`
    };
    this.$data.iframeStyle = {
      ...iframeStyle,
      pointerEvents: 'none'
    };
  }
  private dragEnd(params: {
    movedX: number;
    movedY: number;
    dragOffsetLeft: number;
    dragOffsetTop: number;
  }) {
    const { dragStyle, badgeStyle, iframeStyle } = this.$data;
    const { dragOffsetLeft, dragOffsetTop, movedX, movedY } = params;
    const screenWidth = window.screen.availWidth ||
      document.body.clientWidth || document.documentElement.clientWidth;
    const screenHeight =
      window.screen.availHeight || document.body.clientHeight || document.documentElement.clientHeight;
    const difX = screenWidth - dragOffsetLeft;
    const difY = screenHeight - dragOffsetTop;
    const obj: any = {
      left: dragOffsetLeft,
      top: dragOffsetTop,
      right: difX,
      bottom: difY
    };
    const min = Math.min(dragOffsetLeft, dragOffsetTop, difX, difY);
    let left = movedX;
    let top = movedY;
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === min) {
        switch (key) {
          case 'left':
            left = -10;
            top =
              top >= screenHeight - 30 ? screenHeight - 40 : top < 0 ? 0 : top;
            this.$data.badgeStyle = {
              ...badgeStyle,
              top: '0',
              right: 'auto',
              left: '30px',
              bottom: 'auto',
              transform: 'unset'
            };
            break;
          case 'top':
            top = -10;
            left =
              left >= screenWidth - 30 ? screenWidth - 40 : left < 0 ? 0 : left;
            this.$data.badgeStyle = {
              ...badgeStyle,
              left: '50%',
              top: 'auto',
              right: 'auto',
              bottom: '0',
              transform: 'translateX(-50%)'
            };
            break;
          case 'bottom':
            top = screenHeight - 30;
            left =
              left >= screenWidth - 30 ? screenWidth - 40 : left < 0 ? 0 : left;
            this.$data.badgeStyle = {
              ...badgeStyle,
              top: '0',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              transform: 'translateX(-50%)'
            };
            break;
          case 'right':
            left = screenWidth - 30;
            top =
              top >= screenHeight - 30 ? screenHeight - 40 : top < 0 ? 0 : top;
            this.$data.badgeStyle = {
              ...badgeStyle,
              top: '0',
              left: 'auto',
              right: '30px',
              bottom: 'auto',
              transform: 'unset'
            };
            break;
        }
      }
    }
    this.$data.iframeStyle = {
      ...iframeStyle,
      pointerEvents: 'auto'
    };
    this.$data.dragStyle = {
      ...dragStyle,
      left: `${left}px`,
      top: `${top}px`,
      right: 'auto',
      bottom: 'auto',
      willChange: 'auto',
      transition: 'all .3s ease',
      webkitTransition: 'all .3s ease'
    };
  }
  private dragResize() {
    this.$data.dragStyle = {
      zIndex: '10',
      top: '18%',
      right: '-10px'
    };
    this.$data.badgeStyle = {
      top: '0',
      left: 'auto',
      right: '30px',
      bottom: 'auto',
      transform: 'unset'
    };
  }
}
</script>

<style lang="scss" scoped>

</style>