<template>
  <div class="form">
    <slot name="header"></slot>
    <div class="item" v-for="(obj, key) in form" :key="key">
      <h-input
        v-model="obj.value"
        :name="key"
        :type="obj.type"
        :switched-type="obj.switchedType"
        :prefix-icon="obj.prefix"
        :clearable="obj.clearable"
        :placeholder="obj.placeholder"
        :suffix-icon="obj.suffix"
        :switched-suffix-icon="obj.switchedSuffix">
          <btn
            slot="suffix"
            class="get-code"
            v-if="getCodeField === key"
            :text="codeBtn.text"
            :disabled="codeBtn.disabled"
            @click="getCode"
          />
      </h-input>
      <p v-if="obj.msg !== ''" class="error">{{ obj.msg }}</p>
    </div>
    <slot name="footer">
      <div class="item">
        <btn :text="submitBtnText" @click="submit" />
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import HInput from '@/components/core/input/index.vue';
import Btn from '@/components/core/btn/index.vue';
import { validateForm } from '@/utils/ts/form';
import deepCopy from '@/utils/ts/deepCopy';
import { regMobile } from '@/utils/ts/regexps';
import { get } from '@/utils/ts/fetch';
let tempForm:any = {};

@Component({
  components: {
    HInput,
    Btn
  }
})
export default class HForm extends Vue {
  @Prop({
    type: Object,
    default: () => {}
  })
  private rules!: { [propName: string]: any };

  @Prop({
    type: Object,
    default: () => {}
  })
  private fields!: { [propName: string]: any };

  @Prop({
    type: String,
    default: '提交'
  })
  private submitBtnText!: string;

  @Prop({
    type: String,
    default: ''
  })
  private getCodeField!: string;

  @Prop({
    type: String,
    default: ''
  })
  private getCodeApi!: string;

  @Prop({
    type: Object,
    default: () => {}
  })
  private getCodeParams!: { [propName: string]: any };

  @Prop({
    type: String,
    default: ''
  })
  private relyField!: string;

  @Prop({
    type: Number,
    default: 60
  })
  private duration!: number;

  @Prop({
    type: Object,
    default: () => ({
      text: '获取验证码',
      disabled: false
    })
  })
  private getCodeBtn!: { [propName: string]: any };

  private data() {
    return {
      form: this.fields,
      codeBtn: this.getCodeBtn
    }
  }

  @Watch('form', { deep: true })
  private changeForm(val: any, old: any) {
    for (const key in val) {
      if (val.hasOwnProperty(key) && !!tempForm[key] && val[key].value !== tempForm[key].value) {
        val[key].msg = '';
      }
    }
  }

  private getCodeErrCb(msg: string) {
    if (msg) {
      const { form } = this.$data;
      form.mobile.msg = msg;
      tempForm = deepCopy({
        ...form
      });
      this.$data.form = form;
    }
  }

  // 倒计时
  private cutdown() {
    let interval: any = null;
    let cutTime: number = this.duration;
    this.$data.codeBtn = {
      ...this.getCodeBtn,
      text: `${cutTime}秒`,
      disabled: true
    };
    interval = setInterval(() => {
      if (cutTime < 2) {
        cutTime = 60;
        clearInterval(interval);
        interval = null;
        this.$data.codeBtn = this.getCodeBtn;
        return;
      }
      cutTime--;
      this.$data.codeBtn.text = `${cutTime}秒`;
    }, 1000);
  }

  private async getCode() {
    const { form } = this.$data;
    try {
      const field = form[this.relyField];
      const { value } = field;
      if (!value) {
        return this.getCodeErrCb('请输入手机号');
      } else if (!regMobile.test(value)) {
        return this.getCodeErrCb('手机号格式错误');
      } else if (this.$listeners['getCodeCallBack']) {
        return this.$emit('getCodeCallBack', value)
      }
      const params: any = {
        ...this.getCodeParams
      };
      params[this.relyField] = value;
      const result = await this.$store.dispatch('sdk/getVerifyCode', params);
      if (result) {
        this.cutdown();
      }
    } catch(err) {
      this.$emit('getCodeCallBack', err && err.message);
    }
  }

  private submit() {
    const { form } = this.$data;
    tempForm = deepCopy(form);
    this.$data.form = validateForm(form, this.rules);
    const datas: any = {};
    for (const key in form) {
      if (form.hasOwnProperty(key)) {
        if (!!form[key].msg) {
          return;
        }
        datas[key] = form[key].value;
      }
    }
    this.$emit('submit', datas);
  }
}
</script>

<style lang="scss" scoped>
.item {
  margin-bottom: 15px;
}
.error {
  padding-left: 10px;
  font-size: 11px;
  color: #e73c00;
}
.get-code {
  flex: 1;
  padding: 11px 0 10px;
  max-width: 80px;
  background: transparent;
  color: #333;
  font-size: 12px;
  border-radius: unset;
  border-left: 1px solid #dfdfdf;
  &:active {
    background: transparent;
  }
  &.disabled {
    background: transparent;
  }
}
</style>