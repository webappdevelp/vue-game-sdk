<template>
  <div class="hy-error">
    <div class="hy-error-tips">{{ msg }}</div>
    <img src="../assets/error.jpg" />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class HyErrorTip extends Vue {
  @Prop({
    type: String,
    default: '404，您访问的页面不存在~'
  })
  private msg!: string;
}
</script>
<style lang="scss" scoped>
.hy-error {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  font-size: 20px;
  color: #333;
  text-align: center;
  transform: translate3d(0, -50%, 0);
  img {
    display: block;
    margin: 10px auto 0;
    width: 150px;
    height: auto;
  }
}
</style>
