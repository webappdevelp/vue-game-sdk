import { Component, Vue, Mixins } from 'vue-property-decorator';
import Common from './common';

@Component
export default class ThirdMix extends Mixins(Common) {
  // 火箭ios壳跳原生支付
  public jumpHuojianPay(url: string) {
    try {
      window.webkit.messageHandlers.winOpen.postMessage({ url })
    } catch (err) {
      this.updateToast(err && err.message);
    }
  }
}
