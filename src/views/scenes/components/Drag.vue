<template>
  <hy-drag
    v-if="show"
    :drag-style="controlDragStyle"
    @click="handleClick"
    @drag-start="controlDragStart"
    @drag-move="controlDragMove"
    @drag-end="controlDragEnd"
    @resize="controlDragResize">
      <slot>
        <div class="hy-control" :style="{backgroundImage: `url(${bgImg}` }">
          <badge
            v-if="datas.num"
            :msg="datas.num"
            :custom-style="controlBadgeStyle">
          </badge>
        </div>
      </slot>
  </hy-drag>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Mixins } from 'vue-property-decorator';
import HyDrag from '@/components/Drag.vue';
import Badge from '@/components/Badge.vue';
import flagControl from '../mixins/flagControl';
@Component({
  components: {
    HyDrag,
    Badge
  }
})
export default class DragControll extends Mixins(flagControl) {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;

  @Prop({
    type: String,
    default: require('@/assets/scenes/gf_control.png')
  })
  private bgImg!: string;

  @Prop({
    type: Object,
    default: () => ({
      zIndex: '10',
      top: '18%',
      right: '-10px'
    })
  })
  private dragStyle!: object;

  @Prop({
    type: Object,
    default: () => ({})
  })
  private badgeStyle!: object;

  @Prop({
    type: Object,
    default: () => {
      return {};
    }
  })
  private datas!: object;

  private data() {
    return {
      controlDragStyle: this.dragStyle,
			controlBadgeStyle: this.badgeStyle,
    };
  }

  // methods
  private handleClick() {
    this.$emit('click');
  }
}
</script>
<style lang="scss" scoped>
.hy-control {
	position: relative;
	width: 45px;
	height: 45px;
  background-position: center;
  background-repeat: no-repeat;
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
