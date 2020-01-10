<template>
	<drag
		:style="dragStyle"
    @click="handleClick"
		@start="dragStart"
		@move="dragMove"
		@end="dragEnd"
		@resize="dragResize"
	>
		<slot>
			<badge v-if="dot" :style="badgeStyle" :is-dot="true" />
		</slot>
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
		type: Object,
		default: () => ({})
	})
	private sdkOptions!: { [propName: string]: any };

	@Prop({
		type: Object,
		default: () => ({
      top: '20%',
      right: '-10px',
			width: '45px',
			height: '45px',
			backgroundImage: `url(${require('@/assets/sdk/gf_control.png')}`,
		})
  })
  private wrapperStyle!: { [propName: string]: any };

  @Prop({
    type: Object,
    default: () => ({
      position: 'absolute'
    })
  })
  private innerStyle!: { [propName: string]: any };

  @Prop({
    type: Boolean,
    default: false
  })
  private dot!: boolean;

	private data() {
		return {
			dragStyle: this.wrapperStyle,
			badgeStyle: this.innerStyle
		};
  }
  
  private handleClick() {
    this.$emit('click');
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
		const { dragStyle, badgeStyle } = this.$data;
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
						left = -10;
						top =
							top >= screenHeight - dragHeight ? screenHeight - dragHeight : top < 0 ? 0 : top;
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
							left >= screenWidth - dragWidth ? screenWidth - dragWidth : left < 0 ? 0 : left;
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
						top = screenHeight - dragHeight + 10;
						left =
							left >= screenWidth - dragWidth ? screenWidth - dragWidth : left < 0 ? 0 : left;
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
						left = screenWidth - dragWidth + 10;
						top =
							top >= screenHeight - dragHeight ? screenHeight - dragHeight : top < 0 ? 0 : top;
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
		this.$data.badgeStyle = this.innerStyle;
	}
}
</script>

<style lang="scss" scoped>
</style>