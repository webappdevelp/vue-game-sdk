<template>
  <msg-box key="pay-pannel" title="充值中心" :show="show" @close="cancel">
    <div slot="body">
      <div class="price">
        <p class="num">￥{{ (Number(datas.amount || 0) / 100).toFixed(2) }}</p>
        <p>{{ datas['subject'] }}充值</p>
      </div>
      <ul class="pay-ways">
        <li @click="pay('WXPAY')">
          <div>
            <svg-icon icon-class="wxpay" class-name="pay-icon" />
            <span>微信支付</span>
          </div>
        </li>
        <li @click="pay('ALIPAY')">
          <div>
            <svg-icon icon-class="alipay" class-name="pay-icon" />
            <span>支付宝支付</span>
          </div>
        </li>
      </ul>
      <iframe
        referrerpolicy="unsafe-url"
        :style="{ display: 'none', pointerEvents: 'auto', cursor: 'auto'}"
        v-if="!!payLink"
        :src="payLink"
      ></iframe>
    </div>
    <div slot="footer"></div>
  </msg-box>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { mapState } from 'vuex';
import MsgBox from '@/components/core/msgBox/index.vue';
import { EMPTYPAY } from '@/store/types';
let timerInterval: any = null;
let timer: number = 35;

@Component({
  components: {
    MsgBox
  },
  computed: {
    ...mapState('sdk', {
      datas: (state: any) => state.pay,
      show(state: any) {
        const { app_order_id } = state.pay;
        if (app_order_id) {
          timer = 35;
        } else {
          this.cancel();
        }
        return !!app_order_id;
      }
    })
  }
})
export default class HyModal extends Vue {
  @Prop({
    type: Object,
    default: () => ({})
  })
  private sdkOptions!: { [props: string]: any };

  private data() {
    return {
      payLink: ''
    };
  }

  // 取消支付（关闭支付面板）
  private cancel() {
    clearInterval(timerInterval);
    this.$data.payLink = '';
    this.$store.commit(`sdk/${EMPTYPAY}`);
  }
  // 获取支付地址并实现跳转到对应app或链接
  private async pay(channel: string) {
    const payInfo = this.$store.state.sdk.pay;
    const result = await this.$store.dispatch('sdk/getOrder', {
      ...payInfo,
      pay_channel: channel
    });
    if (result) {
      const { pay_info_str, order_id } = result;
      clearInterval(timerInterval);
      timerInterval = null;
      // 开始启动订单状态检查机制，以便自动关闭支付面板弹窗
      timerInterval = setInterval(async () => {
        if (timer <= 0) {
          clearInterval(timerInterval);
          return;
        }
        timer--;
        const checkResult = await this.$store.dispatch('sdk/getOrderState', {
          order_id
        });
        if (checkResult) {
          this.cancel();
        }
      }, 8000);
      // 若是壳包或原生app跳转协议时，则采用iframe打开，通过壳包代理抓包打开原生支付app或浏览器
      const { mapp } = this.sdkOptions;
      if (mapp) {
        return (this.$data.payLink = pay_info_str);
      }
      return (window.location.href = pay_info_str);
    }
  }
}
</script>
<style lang="scss" scoped>
.hy-modal {
  top: 50%;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 300px;
  padding: 0;
  background-color: #fff;
  will-change: auto;
  transform: translate3d(0, -50%, 0);
  border-radius: 10px;
  box-sizing: border-box;
  overflow: hidden;
}
.price {
  color: #222;
  font-size: 16px;
  line-height: 1;
  text-align: center;
  .num {
    font-size: 30px;
    color: #ff0000;
  }
  p + p {
    margin-top: 5px;
    color: #888;
  }
}
.pay-ways {
  margin: 25px 10% auto;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  white-space: nowrap;
  li {
    flex: 1;
  }
  div {
    width: 80%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #9b9b9b;
    span {
      display: block;
      line-height: 1.5;
    }
  }
  .pay-icon {
    font-size: 60px;
  }
}
</style>
