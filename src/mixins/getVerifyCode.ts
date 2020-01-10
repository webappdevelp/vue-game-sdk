import { Vue, Component } from 'vue-property-decorator';
let lock: boolean = false;

@Component
export default class GetVerifyCode extends Vue {
  /* public data() {
    return {
      codeBtn: {
        color: 'green',
        text: '获取验证码'
      }
    };
  } */

  // 倒计时
  public cutdown(times: number = 60) {
    let interval: any = null;
    let cutTime: number = times;
    this.$data.codeBtn = {
      color: 'disabled',
      text: `${cutTime}秒`
    };
    interval = setInterval(() => {
      if (cutTime < 2) {
        cutTime = 60;
        clearInterval(interval);
        interval = null;
        this.$data.codeBtn = {
          color: 'green',
          text: '获取验证码'
        };
        lock = false;
        return;
      }
      cutTime--;
      this.$data.codeBtn.text = `${cutTime}秒`;
    }, 1000);
  }
  // 获取短信验证码
  public async getVerifyCode({
    mobile,
    action,
    cutdown,
    success,
    fail
  }: {
    mobile: string;
    action: string;
    cutdown: boolean;
    success?: () => void;
    fail?: () => void;
  }) {
    if (lock) {
      return;
    }
    lock = true;
    try {
      const result = await this.$store.dispatch('user/getVerifyCode', {
        ...this.$data.sdkOptions,
        mobile,
        action
      });
      if (result === 0) {
        if (success && success instanceof Function) {
          success();
        }
        if (cutdown) {
          this.cutdown();
        } else {
          lock = false;
        }
      } else {
        lock = false;
        if (fail && fail instanceof Function) {
          fail();
        }
      }
    } catch (err) {
      lock = false;
      if (fail && fail instanceof Function) {
        fail();
      }
    }
  }
}
