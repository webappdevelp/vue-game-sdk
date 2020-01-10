import { Vue, Component, Watch } from 'vue-property-decorator';
import { UPDATEUSERACTION } from '@/store/types';

@Component
export default class FlagControl extends Vue {
  /* public data() {
    return {
      showControlDrag: true
    };
  } */
  @Watch('showControlDrag', { deep: true })
  public changeControlDrag() {
    const { sdkOptions } = this.$data;
    const { app_id } = sdkOptions;
    return !app_id || app_id === '0';
  }
  // 用户中心控制面板
  public showCenterPannel() {
    // 判断是否登录平台
    if (!this.$store.getters['user/isLogin']) {
      return (this.$data.showLogin = true);
    }
    // 判断是否登录游戏
    if (!this.$store.getters['user/isGameLogin']) {
      this.$data.loginType = 'auto';
      return this.$store.commit({
        type: `user/${UPDATEUSERACTION}`,
        data: 'logined'
      });
    }
    this.$data.showCenter = true;
  }
  // 获取悬浮球状态
  public getServiceInfo() {
    this.$store.dispatch('user/getServiceInfo', {
      ...this.$data.sdkOptions
    });
  }
  // 拖拽功能
  public controlDragStart() {
    const { controlDragStyle, iframeStyle } = this.$data;
    this.$data.controlDragStyle = {
      ...controlDragStyle,
      opacity: '1',
      transition: 'unset',
      webkitTransition: 'unset'
    };
    this.$data.iframeStyle = {
      ...iframeStyle,
      pointerEvents: 'none'
    };
  }
  public controlDragMove(params: { movedX: number; movedY: number }) {
    const { controlDragStyle, iframeStyle } = this.$data;
    const { movedX, movedY } = params;
    this.$data.controlDragStyle = {
      ...controlDragStyle,
      left: `${movedX}px`,
      top: `${movedY}px`
    };
    this.$data.iframeStyle = {
      ...iframeStyle,
      pointerEvents: 'none'
    };
  }
  public controlDragEnd(params: {
    movedX: number;
    movedY: number;
    dragOffsetLeft: number;
    dragOffsetTop: number;
    dragWidth: number;
    dragHeight: number;
  }) {
    const { controlDragStyle, controlBadgeStyle, iframeStyle } = this.$data;
    const { dragOffsetLeft, dragOffsetTop, movedX, movedY, dragWidth, dragHeight } = params;
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
    let left = movedX;
    let top = movedY;
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === min) {
        switch (key) {
          case 'left':
            left = -10;
            top =
              top >= screenHeight - dragHeight ? screenHeight - dragHeight : top < 0 ? 0 : top;
            this.$data.controlBadgeStyle = {
              ...controlBadgeStyle,
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
              left >= screenWidth - dragWidth ? screenWidth - dragWidth : left < 0 ? 0 : left;
            this.$data.controlBadgeStyle = {
              ...controlBadgeStyle,
              left: '50%',
              top: 'auto',
              right: 'auto',
              bottom: '0',
              transform: 'translateX(-50%)'
            };
            break;
          case 'bottom':
            top = screenHeight - dragHeight;
            left =
              left >= screenWidth - dragHeight ? screenWidth - dragHeight : left < 0 ? 0 : left;
            this.$data.controlBadgeStyle = {
              ...controlBadgeStyle,
              top: '0',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              transform: 'translateX(-50%)'
            };
            break;
          case 'right':
            left = screenWidth - dragWidth;
            top =
              top >= screenHeight - dragWidth ? screenHeight - dragWidth : top < 0 ? 0 : top;
            this.$data.controlBadgeStyle = {
              ...controlBadgeStyle,
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
    this.$data.controlDragStyle = {
      ...controlDragStyle,
      left: `${left}px`,
      top: `${top}px`,
      right: 'auto',
      bottom: 'auto',
      willChange: 'auto',
      transition: 'all .3s ease',
      webkitTransition: 'all .3s ease'
    };
  }
  public controlDragResize() {
    this.$data.controlDragStyle = {
      zIndex: '10',
      top: '18%',
      right: '-10px'
    };
    this.$data.controlBadgeStyle = {
      top: '0',
      left: 'auto',
      right: '30px',
      bottom: 'auto',
      transform: 'unset'
    };
  }
}
