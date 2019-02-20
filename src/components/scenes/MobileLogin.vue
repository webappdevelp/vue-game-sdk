<template>
  <modal :show="show" animate="right">
    <form ref="mobileLogin" class="hy-form" @submit="submit">
      <h2 class="hy-form-header">
        <Icon name="back" @click="hide" />
        手机号登录
      </h2>
      <div class="hy-form-body">
        <div class="hy-form-item" v-for="(obj, key) in form" :key="key" :class="obj.msg !== '' ? 'error' : ''">
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
        <btn style="width: 100%" text="注册/登录" type="submit" />
      </div>
    </form>
  </modal>
</template>
<script lang="ts">
let tempForm: any = {};
import deepCopy from '@/utils/ts/deepCopy';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Modal from '../Modal.vue';
import Icon from '../Icon.vue';
import HyInput from '../form/Input.vue';
import GetCode from '../GetCodeBtn.vue';
import Btn from '../Btn.vue';
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

  private data() {
    return {
      form: {
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
      }
    };
  }

  // watches
  @Watch('form', { deep: true })
  private changeForm(val: any, old: any) {
    for (const key in val) {
      if (
        val.hasOwnProperty(key) &&
        !!tempForm[key] &&
        val[key].value !== tempForm[key].value
      ) {
        val[key].msg = '';
      }
    }
  }

  // methods
  private hide() {
    this.$emit('update:show', false);
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
  private submit(e: any) {
    const { form } = this.$data;
    tempForm = deepCopy({
      ...tempForm,
      form
    });
    console.log(this.$data.form);
    e.preventDefault();
  }
}
</script>
<style lang="scss" scoped>
.hy-form {
  position: relative;
  padding: 0 24px 24px;
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
</style>
