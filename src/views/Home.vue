<template>
  <div id="home">
    <ul class="games">
      <li>
        <router-link to="/scenes?gid=10147">末日围城</router-link>
      </li>
      <li>
        <router-link to="/scenes?gid=1014">梦幻西游</router-link>
      </li>
    </ul>
    <hy-drag
      :drag-style="dragStyle"
      @drag-start="dragStart"
      @drag-move="dragMove"
      @drag-end="dragEnd">
        <div class="hy-control">
          <badge msg="1"/>
        </div>
    </hy-drag>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import HyDrag from '@/components/Drag.vue';
import Badge from '@/components/Badge.vue';
@Component({
  components: {
    HyDrag,
    Badge
  }
})
export default class Home extends Vue {
  private data() {
    return {
      dragStyle: {
        zIndex: '20'
      }
    };
  }

  // methods
  private dragStart() {
    const { dragStyle } = this.$data;
    this.$data.dragStyle = {
      ...dragStyle,
      opacity: '1',
      transition: 'unset',
      webkitTransition: 'unset'
    };
  }
  private dragMove(params: { movedX: number; movedY: number }) {
    const { dragStyle } = this.$data;
    const { movedX, movedY } = params;
    this.$data.dragStyle = {
      ...dragStyle,
      left: `${movedX}px`,
      top: `${movedY}px`
    };
  }
  private dragEnd(params: {
    movedX: number;
    movedY: number;
    dragWidth: number;
    dragHeight: number;
    dragOffsetLeft: number;
    dragOffsetTop: number;
  }) {
    const { dragStyle } = this.$data;
    const {
      movedX,
      movedY,
      dragWidth,
      dragHeight,
      dragOffsetLeft,
      dragOffsetTop
    } = params;
    const screenWidth =
      document.body.clientWidth || document.documentElement.clientWidth;
    const screenHeight =
      document.body.clientHeight || document.documentElement.clientHeight;
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
            left = -20;
            break;
          case 'top':
            top = -20;
            break;
          case 'bottom':
            top = screenHeight - 20;
            break;
          case 'right':
            left = screenWidth - 20;
            break;
        }
      }
    }
    if (left !== 0) {
      this.$data.dragStyle = {
        ...dragStyle,
        left: `${left}px`,
        right: 'auto',
        bottom: 'auto',
        opacity: '.3',
        willChange: 'auto',
        transition: 'all .3s ease',
        webkitTransition: 'all .3s ease'
      };
    } else {
      this.$data.dragStyle = {
        ...dragStyle,
        top: `${top}px`,
        right: 'auto',
        bottom: 'auto',
        opacity: '.3',
        willChange: 'auto',
        transition: 'all .3s ease',
        webkitTransition: 'all .3s ease'
      };
    }
  }
}
</script>
<style lang="scss" scoped>
.games {
  li {
    display: inline-block;
  }
  li + li {
    margin-left: 10px;
  }
  a {
    color: green;
  }
}
.hy-control {
  position: relative;
  width: 40px;
  height: 40px;
  overflow: hidden;
  will-change: auto;
  background: url('../assets/scenes/control.png') center no-repeat;
  background-size: contain;
  transition: all 0.3s ease;
  .hy-badge {
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    transition: all 0.3s ease;
  }
}
</style>
