<template>
  <ul class="hy-center-menus">
    <li :class="current === 1 ? 'active' : ''" @click="switchMenu(1)">
      <span class="icon icon-gift"></span>
      礼包
    </li>
    <li :class="current === 2 ? 'active' : ''" @click="switchMenu(2)">
      <span class="icon icon-info"></span>
      资讯
    </li>
    <li :class="current === 3 ? 'active' : ''" @click="switchMenu(3)">
      <span class="icon icon-kf"></span>
      客服
    </li>
  </ul>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class HyCenterMenus extends Vue {
  @Prop({
    type: Number,
    default: 1
  })
  private current!: number;

  // methods
  private switchMenu(num: number) {
    this.$emit('update:current', num);
  }
}
</script>
<style lang="scss" scoped>
.hy-center-menus {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
  overflow: hidden;
  li {
    flex: 1;
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    text-align: center;
    color: #999;
    background: #f5f6f7;
    border-bottom: 1px solid #ced2d6;
    &.active {
      background: #fff;
      color: #ed7321;
    }
  }
  li + li {
    border-left: 1px solid #f1f1f1;
  }
}
.icon {
  display: inline-block;
  width: 15px;
  height: 15px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.icon-gift {
  background-image: url('../../../../assets/scenes/center/icon-gl-gift.png');
}
.active .icon-gift {
  background-image: url('../../../../assets/scenes/center/icon-gl-gift-a.png');
}
.icon-info {
  background-image: url('../../../../assets/scenes/center/icon-gl-info.png');
}
.active .icon-info {
  background-image: url('../../../../assets/scenes/center/icon-gl-info-a.png');
}
.icon-kf {
  background-image: url('../../../../assets/scenes/center/icon-gl-kf.png');
}
.active .icon-kf {
  background-image: url('../../../../assets/scenes/center/icon-gl-kf-a.png');
}
</style>
