<template>
  <btn :color="color" :text="text" @click="getCode"/>
</template>
<script lang="ts">
let lock: boolean = false;
import { Vue, Component, Prop } from 'vue-property-decorator';
import Btn from './Btn.vue';
import { UPDATETOAST, UPDATELOAD } from '@/stores/types';
import { regMobile } from '@/utils/ts/regexps';
import { getCode } from '@/api/api';
@Component({
  components: {
    Btn
  }
})
export default class HyGetCodeBtn extends Vue {
  @Prop({
    type: String,
    default: ''
  })
  private mobile!: string;
  @Prop({
    type: String,
    default: 'register'
  })
  private action!: string;

  private data() {
    return {
      color: 'green',
      text: '获取验证码'
    };
  }

  // methods
  private showToast(msg: string) {
    this.$store.commit({
      type: UPDATETOAST,
      data: msg
    });
  }
  private updateLoading(show: boolean) {
    this.$store.commit({
      type: UPDATELOAD,
      data: show
    });
  }
  private cutdown(times: number = 60) {
    let interval: any = null;
    let cutTime: number = times;

    this.$data.color = 'disabled';
    this.$data.text = `${cutTime}秒`;
    interval = setInterval(() => {
      if (cutTime < 2) {
        cutTime = 60;
        clearInterval(interval);
        interval = null;
        this.$data.color = 'green';
        this.$data.text = '获取验证码';
        lock = false;
        return;
      }
      cutTime--;
      this.$data.text = `${cutTime}秒`;
    }, 1000);
  }
  private getCode() {
    if (!regMobile.test(this.mobile)) {
      return this.$emit('cb', '手机号错误');
    }
    if (lock) {
      return;
    }
    lock = true;
    this.updateLoading(true);
    getCode({
      mobile: this.mobile,
      action: this.action
    })
      .then(() => {
        this.updateLoading(false);
        this.showToast('验证发送成功');
        this.cutdown();
      })
      .catch((err: { message: string }) => {
        lock = false;
        this.updateLoading(false);
        this.showToast(err.message);
      });
  }
}
</script>
