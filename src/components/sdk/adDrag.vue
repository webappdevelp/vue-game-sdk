<template>
  <div v-if="!!sdkOptions.adsc">
    <drag
      :style="dragStyle"
      @click="handleClick"
      @start="dragStart"
      @move="dragMove"
      @end="dragEnd"
      @resize="dragResize"
    >
      <slot>
        <div class="ad-drag">
          <img
            class="animated infinite headShake"
            :src="require(`@/assets/ad/${sdkOptions.adsc}/logo.png`)"
            alt="抖音"
          />
          <p>戳我领红包</p>
        </div>
      </slot>
    </drag>
    <transition-group name="fade">
      <div v-show="welfare" class="mask" key="mask"></div>
      <div v-show="welfare" class="welfare" key="box">
        <div class="douyin">
          <a class="close" @click="toggleWelfare"></a>
          <img :src="require('@/assets/ad/douyin/10277/03.png')" alt="抖音专享福利" />
        </div>
      </div>
    </transition-group>
  </div>
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
		type: Object,
		default: () => ({})
	})
	private sdkOptions!: { [propName: string]: any };

	@Prop({
		type: Object,
		default: () => ({
      top: 'auto',
      bottom: '30%',
      right: 0,
			width: '75px',
      height: '75px',
      borderRadius: '10%',
      overflow: 'hidden'
		})
  })
  private wrapperStyle!: { [propName: string]: any };

  @Prop({
    type: Boolean,
    default: false
  })
  private dot!: boolean;

	private data() {
		return {
			dragStyle: this.wrapperStyle,
      welfare: false
		};
  }
  
  private handleClick() {
    this.$data.welfare = true;
    this.$emit('click');
  }

  private toggleWelfare() {
    this.$data.welfare = !this.$data.welfare;
  }

	// 拖拽功能
	private dragStart() {
		const { dragStyle } = this.$data;
		this.$data.dragStyle = {
			...dragStyle,
			opacity: '1',
			transition: 'unset',
			webkitTransition: 'unset'
    };
    this.$emit('change', {
      pointerEvents: 'none'
    });
	}
	private dragMove(params: { movedX: number; movedY: number }) {
		const { dragStyle } = this.$data;
		const { movedX, movedY } = params;
		this.$data.dragStyle = {
			...dragStyle,
			left: `${movedX}px`,
			top: `${movedY}px`
    };
    this.$emit('change', {
      pointerEvents: 'none'
    });
	}
	private dragEnd(params: {
		movedX: number;
		movedY: number;
		dragOffsetLeft: number;
    dragOffsetTop: number;
    dragWidth: number;
    dragHeight: number;
	}) {
		const { dragStyle } = this.$data;
		const { dragOffsetLeft, dragOffsetTop, movedX, movedY, dragWidth, dragHeight } = params;
		const screenWidth =
			window.screen.availWidth ||
			document.body.clientWidth ||
			document.documentElement.clientWidth;
		const screenHeight =
			window.screen.availHeight ||
			document.body.clientHeight ||
			document.documentElement.clientHeight;
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
						left = 0;
						top =
							top >= screenHeight - dragHeight ? screenHeight - dragHeight : top < 0 ? 0 : top;
						break;
					case 'top':
						top = 0;
						left =
							left >= screenWidth - dragWidth ? screenWidth - dragWidth : left < 0 ? 0 : left;
						break;
					case 'bottom':
						top = screenHeight - dragHeight;
						left =
							left >= screenWidth - dragWidth ? screenWidth - dragWidth : left < 0 ? 0 : left;
						break;
					case 'right':
						left = screenWidth - dragWidth;
						top =
							top >= screenHeight - dragHeight ? screenHeight - dragHeight : top < 0 ? 0 : top;
						break;
				}
			}
    }
    this.$emit('change', {
      pointerEvents: 'auto'
    });
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
		this.$data.dragStyle = this.wrapperStyle;
  }
  
}
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  z-index: 200;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .46);
}
.welfare {
  position: fixed;
  z-index: 210;
  top: 50%;
  right: 0;
  left: 0;
  transform: translate3d(0, -50%, 0);
  margin: 0 auto;
  img {
    width: 100%;
    height: auto;
  }
  .close {
    position: absolute;
    z-index: 1;
    top: 5px;
    right: 30px;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
}
.ad-drag {
  padding: 5px 0;
  background: #000;
  border-radius: 10%;
  overflow: hidden;
  text-align: center;
  img {
    display: block;
    width: 50%;
    height: auto;
    margin: 0 auto 5px;
  }
  p {
    color: #fff;
    font-size: 12px;
    white-space: nowrap;
  }
}

.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

.animated.infinite {
  animation-iteration-count: infinite;
}

@keyframes headShake {
  0% {
    transform: translateX(0);
  }

  6.5% {
    transform: translateX(-3px) rotateY(-9deg);
  }

  18.5% {
    transform: translateX(2px) rotateY(7deg);
  }

  31.5% {
    transform: translateX(-2px) rotateY(-5deg);
  }

  43.5% {
    transform: translateX(1px) rotateY(3deg);
  }

  50% {
    transform: translateX(0);
  }
}

.headShake {
  animation-timing-function: ease-in-out;
  animation-name: headShake;
}
.shake {
  animation-name: shake;
}
</style>