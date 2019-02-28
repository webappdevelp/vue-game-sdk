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
    default: '出错了哦~'
  })
  private msg!: string;
}
</script>
<style lang="scss" scoped>
.hy-error {
  font-size: 15px;
  color: #333;
  text-align: center;
  img {
    display: block;
    margin: 10px auto 0;
    width: 150px;
    height: auto;
  }
}
</style>
