<template>
  <div class="hy-kefu">
    <div class="hy-kefu-default" v-if="showDefault">
      <div class="hy-kefu-avatar"></div>
      <p>请点击下方“咨询客服”按钮
        <br>我们的专业客服马上为您服务
      </p>
      <btn text="咨询客服" @click="action"/>
    </div>
    <div class="hy-kefu-content">
      <div class="hy-kefu-numbers">
        <img :src="require('../../../assets/xiaoyaoyou/cusServiceImg.png')" alt>
        <p v-html="datas.kefu.numbers"></p>
      </div>
      <div class="hy-kefu-qrcode">
        <img :src="datas.kefu.wx_qrcode">
        <p>
          <strong>关注公众号</strong>
          <br>
          <strong>账号不丢失</strong>
          <br>
          <strong>游戏随时玩</strong>
          <br>长按或扫描二维码
          <br>
          关注“{{datas.name}}”公众号
        </p>
      </div>
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
  @Prop({
    type: Object,
    default: () => {
      return {};
    }
  })
  private datas!: {};

  private data() {
    return {
      showDefault: false
    };
  }

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
<style lang="scss">
.hy-kefu {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  &-avatar {
    margin: 24px auto;
    width: 150px;
    height: 150px;
    background: url('../../../assets/scenes/center/kf-person.png') center center no-repeat;
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
  &-content {
    padding: 24px 0 0;
    user-select: auto;
  }
  &-qrcode {
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: auto;
    p,
    img,
    strong {
      user-select: auto;
    }
    img {
      width: 125px;
      height: auto;
    }
    p {
      font-size: 12px;
      color: #999;
      line-height: 1.5;
      text-align: center;
      user-select: auto;
      strong {
        font-size: 13px;
        color: #333;
      }
    }
  }
  &-numbers {
    margin-bottom: 24px;
    user-select: auto;
    text-align: center;
    p,
    img,
    a {
      user-select: auto;
    }
    p {
      display: inline;
      font-size: 14px;
      color: #333;
      font-weight: bold;
    }
    img {
      display: block;
      width: 150px;
      height: auto;
      margin: 0 auto 15px;
    }
    a {
      color: #333;
    }
  }
}
</style>
