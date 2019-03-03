<template>
  <modal :show="show" animate="right">
    <form ref="mobilePsw" class="hy-form" @submit="submit">
      <div class="hy-form-header">
        <Icon name="back" @click="hide"/>修改密码
      </div>
      <div v-if="!mobile" class="hy-password-tip">*一键注册账号原密码可输入任意字符</div>
      <div class="hy-form-body">
        <div
          class="hy-form-item"
          v-for="(obj, key) in form"
          :key="key"
          :class="obj.msg !== '' ? 'error' : ''"
        >
          <hy-input
            :icon="obj.icon"
            v-model="obj.value"
            :name="key"
            :type.sync="obj.type"
            :placeholder="obj.placeholder"
            :showPsw="obj.showPsw"
          />
          <get-code
            v-if="key === 'code'"
            class="hy-getcode"
            :mobile="form.mobile.value"
            @cb="getCodeErrCb"
          />
          <div v-if="obj.msg !== ''" class="hy-form-item--error">{{ obj.msg }}</div>
        </div>
        <btn style="width: 100%;margin-top: 10px;" text="确认修改" type="submit"/>
      </div>
    </form>
  </modal>
</template>
<script lang="ts">
const defaultForm: any = {
  mobile: {
    icon: 'mobile',
    type: 'number',
    placeholder: '请输入手机号',
    value: '',
    msg: ''
  },
  code: {
    icon: 'safety',
    type: 'text',
    placeholder: '请输入验证码',
    value: '',
    msg: ''
  },
  password: {
    icon: 'lock',
    type: 'password',
    placeholder: '请输入密码',
    showPsw: true,
    value: '',
    msg: ''
  }
};
const defaultPForm: any = {
  old_password: {
    icon: 'lock',
    type: 'password',
    placeholder: '请输入原密码',
    showPsw: true,
    value: '',
    msg: ''
  },
  password: {
    icon: 'lock',
    type: 'password',
    placeholder: '请输入新密码',
    showPsw: true,
    value: '',
    msg: ''
  },
  re_password: {
    icon: 'lock',
    type: 'password',
    placeholder: '请再次输入新密码',
    showPsw: true,
    value: '',
    msg: ''
  }
};
let tempForm: any = {};
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue';
import Icon from '@/components/Icon.vue';
import HyInput from '@/components/form/Input.vue';
import GetCode from '@/components/GetCodeBtn.vue';
import Btn from '@/components/Btn.vue';
import deepCopy from '@/utils/ts/deepCopy';
import { regMobile } from '@/utils/ts/regexps';
import { validateForm } from '@/utils/ts/form';

@Component({
  components: {
    Modal,
    Icon,
    HyInput,
    GetCode,
    Btn
  }
})
export default class HyPassword extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;
  @Prop({
    type: Boolean,
    default: false
  })
  private mobile!: boolean;

  private data() {
    return {
      form: this.mobile ? deepCopy(defaultForm) : deepCopy(defaultPForm)
    };
  }

  // watches
  @Watch('form', { deep: true })
  private changeForm(val: any, old: any) {
    for (const key in val) {
      if (val.hasOwnProperty(key) && !!tempForm[key] && val[key].value !== tempForm[key].value) {
        val[key].msg = '';
      }
    }
  }

  // methods
  private hide() {
    this.updateLayout();
    this.$emit('back');
  }
  private updateLayout() {
    this.$data.form = this.mobile ? deepCopy(defaultForm) : deepCopy(defaultPForm);
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
  private submit(e: Event) {
    e.preventDefault();
    const { form } = this.$data;
    tempForm = deepCopy(form);
    let rules: any = {
      mobile: [{ required: true, msg: '请输入手机号' }, { reg: regMobile, msg: '手机号格式错误' }],
      code: [{ required: true, msg: '请输入验证码' }, { length: 4, msg: '验证码错误 ' }],
      password: [
        { required: true, msg: '请输入密码' },
        { minLength: 6, msg: '密码长度不能小于6位' }
      ]
    };
    if (!this.mobile) {
      rules = {
        old_password: [{ required: true, msg: '请输入原密码' }],
        password: [
          { required: true, msg: '请输入新密码' },
          { minLength: 6, msg: '密码长度不能小于6位' }
        ],
        re_password: [
          { required: true, msg: '请再次输入新密码' },
          { minLength: 6, msg: '密码长度不能小于6位' }
        ]
      };
    }
    this.$data.form = validateForm(form, rules);
    const datas: any = {};
    for (const key in form) {
      if (form.hasOwnProperty(key)) {
        if (!!form[key].msg) {
          return;
        }
        datas[key] = form[key].value;
      }
    }
    if (!this.mobile && form.password.value !== form.re_password.value) {
      return form.re_password.msg = '两次密码输入不一致';
    }
    this.$emit('submit', { action: this.mobile ? 'mobile' : 'psw', params: { ...datas } });
    // this.updateLayout();
  }

  // lifecycles (谨慎使用 updated 钩子函数)
  private updated() {
    const form = this.mobile ? JSON.stringify(defaultForm) : JSON.stringify(defaultPForm);
    if (!this.show && JSON.stringify(this.$data.form) !== form) {
      this.$data.form = JSON.parse(form);
    }
  }
}
</script>
<style lang="scss" scoped>
.hy-form {
  position: relative;
  padding: 0 20px 20px;
  overflow: hidden;
  &-header {
    position: relative;
    margin: 0;
    position: relative;
    margin-top: 20px;
    font-size: 18px;
    font-weight: 400;
    color: #333;
    text-align: center;
    user-select: none;
  }
  &-body {
    padding-top: 25px;
    width: 100%;
    overflow: hidden;
  }
  &-footer {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .hy-icon-back {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate3d(0, -50%, 0);
  }
}

.hy-form-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  margin-bottom: 25px;
  border-bottom: 1px solid #f5f5f5;
  &.error {
    border-color: #e73c00;
  }
  &--error {
    position: absolute;
    top: 30px;
    padding-top: 5px;
    font-size: 11px;
    color: #e73c00;
  }
}

.hy-getcode {
  height: 30px;
  line-height: 30px;
  max-width: 100px;
}

.hy-password-tip {
  margin: 15px 0 -15px;
  font-size: 10px;
  color: #f07234;
  text-align: center;
}
</style>
