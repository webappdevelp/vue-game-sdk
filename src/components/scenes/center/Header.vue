<template>
  <div class="hy-center-header">
    <div
      class="user-avatar"
      style="background-image: url('https://thirdqq.qlogo.cn/qqapp/101338948/780DF1D16026306DE02AC9C0E77DD0E5/100')"
    ></div>
    <ul class="user-info">
      <li>
        <a href="javascript:;" @click="action('account')">『账号管理』</a>
        <a href="javascript:;" @click="action('logOut')">『切换账号』</a>
      </li>
      <li>平台账号：{{ datas.username }}</li>
    </ul>
    <a class="wxtip" href="javascript:;" @click="action('wxTip')">边聊边玩</a>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
@Component
export default class HyCenterHeader extends Vue {
  @Prop({
    type: Object,
    default: () => {
      return {};
    }
  })
  private datas!: object;

  // methods
  @Emit()
  private action(action: string) {
    if (action === 'wxTip') {
      return {
        action,
        params: '这样玩游戏和聊天就可以同时进行。'
      };
    }
    return {
      action
    };
  }
}
</script>
<style lang="scss" scoped>
.hy-center-header {
  position: relative;
  padding: 10px 12px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .user-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
  }
  .user-info {
    flex: 1;
    padding-left: 10px;
    font-size: 12px;
    color: #999;
    li {
      line-height: 24px;
    }
    a {
      color: #018ffd;
      font-size: 13px;
      text-decoration: none;
    }
    a + a {
      margin-left: 10px;
    }
  }
  .wxtip {
    position: absolute;
    top: 50%;
    right: 12px;
    padding: 2px 5px;
    font-size: 12px;
    border: 1px solid #ebc89e;
    border-radius: 10px;
    color: #a16945;
    background: #f5ddc0;
    overflow: hidden;
    transform: translate3d(0, -50%, 0);
  }
}
</style>
