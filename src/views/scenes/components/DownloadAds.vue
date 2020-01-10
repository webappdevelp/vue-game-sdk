<template>
  <div class="hy-dwl-ads">
    <hy-drag
      class="hy-dwl-float"
      :drag-style="dragStyle"
      @click="toggleShow"
      @drag-start="dragStart"
      @drag-move="dragMove"
      @drag-end="dragEnd"
      >
      <img :src="require(`@/assets/games/${appid}/float.png`)" />
    </hy-drag>
    <hy-dialog :show="show" z-index="30">
      <template slot-scope="scope">
        <div class="hy-dwlads" :style="scope.scope.frontStyle">
          <img :src="require(`@/assets/games/${appid}/ads.png`)" />
          <a class="hy-dwlads-close" @click="toggleShow"></a>
          <a class="hy-dwlads-download" @click="download"></a>
        </div>
      </template>
    </hy-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import HyDialog from '@/components/Dialog.vue';
import HyDrag from '@/components/Drag.vue';
import { getCookie, setCookie } from '@/utils/ts/cookies';
import isWx from '@/utils/ts/device/isWx';
import isIOS from '@/utils/ts/device/isIOS';

let dwl: any = null;
@Component({
  components: {
    HyDialog,
    HyDrag
  }
})
export default class DownloadAds extends Vue {
  private data() {
    return {
      show: false,
      appid: '',
      aid: '',
      page_action: '',
      dragStyle: {
        zIndex: 20,
        left: 0,
        top: '20%'
      }
    };
  }

  // methods
  private toggleShow() {
    const { appid, aid } = this.$data;
    if (!dwl) {
      setCookie(`dwl_${appid}${aid}`, appid as string, 30);
    }
    this.$data.show = !this.$data.show;
  }
  private download() {
    const { aid } = this.$data;
    if (isWx) {
      if (!this.$data.page_action) {
        window.history.pushState(
          null,
          '',
          `${window.location.href}&page_action=dwl`
        );
      }
      this.$emit('btn-action', {
        action: 'wxTip',
        params: '这样玩游戏和下载就可以同时进行。'
      });
    } else if (!isIOS) {
      window.location.href = `http://api.huiyaohuyu.cn/ad/dland?aid=${aid}`;
    } else {
      window.location.href =
        'https://itunes.apple.com/cn/app/id1394434270?mt=8';
    }
  }
  private dragStart() {
    const { dragStyle } = this.$data;
    this.$data.dragStyle = {
      ...dragStyle,
      transition: 'unset',
      webkitTransition: 'unset'
    };
    this.$emit('drag-action', 'start');
  }
  private dragMove(params: { movedX: number; movedY: number }) {
    const { dragStyle } = this.$data;
    const { movedX, movedY } = params;
    this.$data.dragStyle = {
      ...dragStyle,
      left: `${movedX}px`,
      top: `${movedY}px`
    };
    this.$emit('drag-action', 'move');
  }
  private dragEnd(params: {
    dragOffsetLeft: number;
    dragOffsetTop: number;
    dragWidth: number;
    dragHeight: number;
  }) {
    this.$emit('drag-action', 'end');
    const { dragStyle } = this.$data;
    const { dragOffsetLeft, dragOffsetTop, dragWidth, dragHeight } = params;
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
    let left;
    let top;
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === min) {
        switch (key) {
          case 'left':
            left = 0;
            break;
          case 'top':
            top = 0;
            break;
          case 'bottom':
            top = screenHeight - dragHeight;
            break;
          case 'right':
            left = screenWidth - dragWidth;
            break;
        }
      }
    }
    if (left !== undefined) {
      this.$data.dragStyle = {
        ...dragStyle,
        left: `${left}px`,
        right: 'auto',
        bottom: 'auto',
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
        willChange: 'auto',
        transition: 'all .3s ease',
        webkitTransition: 'all .3s ease'
      };
    }
  }

  // lifecycles
  private created() {
    const { gid, aid, page_action } = this.$route.query;
    this.$data.appid = gid;
    this.$data.aid = aid;
    this.$data.page_action = page_action || '';
    if (page_action === 'dwl') {
      window.history.pushState(
        null,
        '',
        `${window.location.href.replace(/&page_action=dwl/i, '')}`
      );
      if (!isWx && !isIOS) {
        window.location.href = `http://api.huiyaohuyu.cn/ad/dland?aid=${aid}`;
      } else if (!isWx) {
        window.location.href =
          'https://itunes.apple.com/cn/app/id1394434270?mt=8';
      }
    }
    dwl = getCookie(`dwl_${gid as string}${aid}`);
    if (!dwl) {
      window.setTimeout(() => {
        this.$data.show = true;
      }, 5 * 60 * 1000);
    }
  }
}
</script>
<style lang="scss" scoped>
.hy-dwl-float {
  width: 50px;
  height: auto;
  overflow: hidden;
  img {
    display: block;
    width: 100%;
    height: auto;
  }
}
.hy-dwlads {
  top: 50%;
  right: 0;
  left: 0;
  transform: translate3d(0, -50%, 0);
  img {
    display: block;
    width: 100%;
    height: auto;
  }
  a {
    position: absolute;
    z-index: 2;
  }
  .hy-dwlads-close {
    top: 10%;
    right: 4%;
    width: 8%;
    height: 15%;
  }
  .hy-dwlads-download {
    right: 15%;
    bottom: 10%;
    width: 24%;
    height: 14%;
  }
}
</style>
