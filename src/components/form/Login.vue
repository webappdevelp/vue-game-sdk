<template>
  <modal :show="show" animate="fade">
    <div ref="login" class="hy-form">
      <!-- <Icon name="close" @click="hide"/> -->
      <div class="hy-form-header">游戏登录</div>
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
          <div v-if="obj.msg !== ''" class="hy-form-item--error">{{ obj.msg }}</div>
        </div>
        <btn style="width: 100%; margin-top: 10px;" text="立即登录" @click="submit"/>
      </div>
      <div class="hy-form-footer">
        <div>
          <btn text="手机号登录" color="green" @click="btnAction('mobile')"/>
          <btn v-if="fastBtnText" :text="fastBtnText" color="purple" @click="btnAction('fast')"/>
        </div>
        <p>
          温馨提示: 游客模式在<strong>实名认证</strong>前提下, 玩家将<strong>只有一小时的体验时长</strong>, 完成实名认证后方可继续游戏!
        </p>
      </div>
    </div>
  </modal>
</template>
<script lang="ts">
let tempForm: any = {};
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Cookies from 'js-cookie';
import Modal from '@/components/Modal.vue';
import Icon from '@/components/Icon.vue';
import HyInput from '@/components/form/Input.vue';
import Btn from '@/components/Btn.vue';
import { validateForm } from '@/utils/ts/form';
import deepCopy from '@/utils/ts/deepCopy';
import { userStorageName } from '@/config';
@Component({
  components: {
    Modal,
    Icon,
    HyInput,
    Btn
  }
})
export default class HyScenesLogin extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;
  @Prop({
    type: String,
    default: ''
  })
  private fastBtnText!: string;
  @Prop({
    type: Object,
    default: () => ({})
  })
  private sdkOptions!: { [propsName: string]: any }

  private data() {
    return {
      form: {
        username: {
          icon: 'account',
          type: 'text',
          placeholder: '请输入账号',
          value: '',
          msg: ''
        },
        password: {
          icon: 'lock',
          type: 'password',
          showPsw: true,
          placeholder: '请输入密码',
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
      if (val.hasOwnProperty(key) && !!tempForm[key] && val[key].value !== tempForm[key].value) {
        val[key].msg = '';
      }
    }
  }
  @Watch('show', { deep: true })
  private completeForm() {
    if (this.show) {
      // const userInfo = this.$store.getters['user/userInfo'];
      const { app, startOrigin } = this.sdkOptions;
      const userInfo: any = JSON.parse(Cookies.get(`${userStorageName}${app || ''}-${startOrigin || ''}`) || '{}');
      this.$data.form.username.value = userInfo.username;
      this.$data.form.password.value = userInfo.password;
    }
  }

  // methods
  private hide() {
    this.$emit('update:show', false);
  }
  private btnAction(action: string) {
    this.$emit('btn-action', action);
  }
  private submit() {
    const { form } = this.$data;
    tempForm = deepCopy(form);
    const rules = {
      username: [{ required: true, msg: '请输入账号' }],
      password: [{ required: true, msg: '请输入密码' }, { minLength: 6, msg: '密码错误' }]
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
    this.$emit('submit', { action: 'login', datas: { ...datas } });
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
    & > div {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    & > p {
      margin-top: 10px;
      font-size: 12px;
      color: #999;
    }
  }
  .hy-icon-close {
    position: absolute;
    z-index: 2;
    top: 8px;
    right: 8px;
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
</style>
