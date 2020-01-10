<template>
  <hy-alert title="充值中心" :show.sync="showPay" :needClose="true">
    <div slot="content">
      <div class="price">
        <p class="num">￥{{ (Number(datas.amount || 0) / 100).toFixed(2) }}</p>
        <p>{{ datas['subject'] }}充值</p>
      </div>
      <ul class="pay-ways">
        <li>
          <a @click="payChannelHandle('WXPAY')">
            <icon name="weixin_pay" />
            <span>微信支付</span>
          </a>
        </li>
        <li>
          <a @click="payChannelHandle('ALIPAY')">
            <icon name="ali_pay" />
            <span>支付宝支付</span>
          </a>
        </li>
      </ul>
      <iframe
        referrerpolicy="unsafe-url"
        :style="{ display: 'none', pointerEvents: 'auto', cursor: 'auto'}"
        v-if="!!pay_info_str" :src="pay_info_str">
      </iframe>
    </div>
    <div slot="footer"></div>
  </hy-alert>
</template>
<script lang="ts">
import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import CommonMix from '@/mixins/common';
import HyAlert from './Alert.vue';
import Icon from './Icon.vue';
import {
  ApiGetOrderOptions,
} from '@/api/api.d';
import { getOrder, getNotifyStatus } from '@/api/gamesPay';
let timerInterval: any = null;
let timer: number = 35;

@Component({
  components: {
    HyAlert,
    Icon
  }
})
export default class HyModal extends Mixins(CommonMix) {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;
  @Prop({
    type: Object,
    default: () => ({
      subject: '',
      amount: '',
    })
  })
  private datas!: ApiGetOrderOptions
  @Prop({
    type: Object,
    default: () => {}
  })
  extDatas!: { ctype?: string; mapp?: string; };

  private data() {
    return {
      showPay: this.show,
      pay_info_str: ''
    }
  }

  @Watch('showPay', { deep: true })
  resetData() {
    clearInterval(timerInterval);
    if (this.$data.showPay) {
      timer = 35;
    } else {
      this.$data.pay_info_str = '';
      this.$emit('update:show');
    }
  }

  // methods
  private async payChannelHandle(payChannel: string) {
    this.updateLoading(true);
    clearInterval(timerInterval);
    try {
      const result = await getOrder({
        ...this.datas,
        http_source: 'WEB',
        pay_channel: payChannel,
        is_native_payment: 1
      });
      this.updateLoading(false);
      const { data, status, message } = result;
      const { ctype, mapp } = this.extDatas;
      if (status === 0) {
        const { pay_info_str, order_id } = data;
        this.datas = {
            ...this.datas,
            order_id
          };
        // 火箭渠道ios包跳
        if (ctype === 'hy_hj' && !!mapp) {
          try {
            window.webkit.messageHandlers.winOpen.postMessage({ url: pay_info_str })
          } catch (err) {
            this.$data.pay_info_str = pay_info_str;
          }
        } else {
          this.$data.pay_info_str = pay_info_str;
        }
        timerInterval = setInterval(() => {
          if (timer <= 0) {
            clearInterval(timerInterval);
            return;
          }
          timer--;
          this.checkOrderResult();
        }, 8000);
      } else {
        this.updateToast(message || '订单初始化失败');
      }
    } catch (err) {
      this.updateLoading(false);
      this.updateToast(err && err.message);
    }
  }
  // 订单轮询
  private async checkOrderResult() {
    try {
      await getNotifyStatus({ ...this.datas });
      this.$data.showPay = false;
      this.$emit('confirm');
    } catch (err) {
      console.log(err && err.message);
    }
  }
  private updated() {
    this.$data.showPay = this.show;
  }
  private mounted() {
    this.$data.showPay = this.show;
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
  }
}
.pay-ways {
  margin-top: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  white-space: nowrap;
  li {
    flex: 1;
  }
  a {
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
  .hy-icon {
    width: 60px;
    height: 60px;
  }
}
</style>
