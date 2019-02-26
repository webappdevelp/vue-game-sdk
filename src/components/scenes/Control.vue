<template>
  
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Badge from '../Badge.vue';
@Component({
  components: {
    Badge
  }
})
export default class HyControl extends Vue {
  @Prop({
    type: String,
    default: ''
  })
  private msg!: string;

  private data() {
    return {
      move: false,
      movePosition: {
        x: 0,
        y: 0
      },
      current: {
        x: 0,
        y: 0
      }
    };
  }

  get style() {
    const { current } = this.$data;
    return {
      top: `${current.y}px`,
      left: `${current.x}px`
    };
  }

  // methods
  private action() {
    this.$emit('click');
  }
  // 拖拽交互
  private moveAction() {
    this.$emit('movestart');
  }
}
</script>
<style lang="scss" scoped>
.hy-control {
  position: fixed;
  z-index: 10;
  top: 13%;
  right: 0;
  width: 40px;
  height: 40px;
  overflow: hidden;
  will-change: auto;
  background: url('../../assets/scenes/control.png') center no-repeat;
  background-size: contain;
  transform: translate3d(20px, 0, 0);
  .hy-badge {
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
  }
}
</style>
