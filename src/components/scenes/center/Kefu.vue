<template>
  <div class="hy-kefu">
    <div class="hy-kefu-default">
      <div class="hy-kefu-avatar"></div>
      <p>请点击下方“咨询客服”按钮 <br /> 我们的专业客服马上为您服务</p>
      <btn text="咨询客服" @click="action" />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import Btn from '@/components/Btn.vue';
@Component({
  components: {
    Btn
  }
})
export default class HyCenterKeFu extends Vue {
  // methods
  @Emit()
  private action() {
    return {
      action: 'wxTip',
      params: '这样玩游戏和聊天就可以同时进行。'
    };
  }
}
</script>
<style lang="scss" scoped>
.hy-kefu {
  &-avatar {
    margin: 24px auto;
    width: 150px;
    height: 150px;
    background: url('../../../assets/scenes/center/kf-person.png') center center
      no-repeat;
    background-size: 82px 82px;
    border: 1px solid #57a4ff;
    box-sizing: border-box;
    border-radius: 50%;
    overflow: hidden;
  }
  &-default {
    text-align: center;
    p {
      margin-bottom: 24px;
      font-size: 14px;
      color: #999;
      line-height: 1.3;
    }
    .hy-btn {
      width: 50%;
      margin: 0 auto;
      border-radius: 4px;
    }
  }
}
</style>
