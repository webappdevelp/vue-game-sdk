<template>
  <modal :show="show" animate="right">
    <form ref="mobileLogin" class="hy-form" @submit="submit">
      <div class="hy-form-header">
        <Icon name="back" @click="hide"/>
        {{ title }}
      </div>
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
            :action="action"
            @cb="getCodeErrCb"
          />
          <div v-if="obj.msg !== ''" class="hy-form-item--error">{{ obj.msg }}</div>
        </div>
        <btn style="width: 100%; margin-top: 10px;" :text="btnText" type="submit"/>
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
import { validateForm } from '@/utils/ts/form';
import { regMobile } from '@/utils/ts/regexps';
@Component({
  components: {
    Modal,
    Icon,
    HyInput,
    GetCode,
    Btn
  }
})
export default class HyScenesMobileLogin extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;
  @Prop({
    type: String,
    default: '手机号登录'
  })
  private title!: string;
  @Prop({
    type: String,
    default: '注册/登录'
  })
  private btnText!: string;
  @Prop({
    type: String,
    default: 'register'
  })
  private action!: string;

  private data() {
    return {
      form: deepCopy(defaultForm)
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
    this.$data.form = deepCopy(defaultForm);
    this.$emit('back');
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
    const rules = {
      mobile: [{ required: true, msg: '请输入手机号' }, { reg: regMobile, msg: '手机号格式错误' }],
      code: [{ required: true, msg: '请输入验证码' }, { length: 4, msg: '验证码错误 ' }]
    };
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
    this.$emit('submit', { action: 'mobile', params: { ...datas } });
  }

  // lifecycles (谨慎使用 updated 钩子函数)
  private updated() {
    if (!this.show && JSON.stringify(this.$data.form) !== JSON.stringify(defaultForm)) {
      this.$data.form = deepCopy(defaultForm);
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
    z-index: 2;
    top: 30px;
    left: 0;
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
</style>
