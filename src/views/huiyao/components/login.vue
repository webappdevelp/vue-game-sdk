<template>
  <msg-box :show.sync="showMsgBox" :title="title">
    <template slot="body">
      <div class="box">
        <h-form v-if="showLogin" key="login" submit-btn-text="立即登录" :fields="login" :rules="loginRules" />
        <h-form
          v-if="showMobile"
          key="mobile"
          :fields="mobile"
          :rules="mobileRules"
          :get-code-btn="getCodeBtn"
          @get-code="getCode"
          submit-btn-text="立即登录"
          get-code-field="code"
        />
        <ul class="switch-pannel">
          <li v-if="showLogin" @click="switchFormPannel('mobile')">
            <svg-icon icon-class="phone" class-name="switch-icon" />手机登录
          </li>
          <li v-if="showMobile" @click="switchFormPannel('login')">
            <svg-icon icon-class="user" class-name="switch-icon" />账号登录
          </li>
          <li>
            <svg-icon icon-class="user" class-name="switch-icon" />游客模式
          </li>
        </ul>
      </div>
    </template>
    <span slot="footer"></span>
  </msg-box>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import MsgBox from '@/components/core/msgBox/index.vue';
import HForm from '@/components/core/form/index.vue';
import Btn from '@/components/core/btn/index.vue';
import { regMobile } from '@/utils/ts/regexps';

@Component({
  components: {
    MsgBox,
    HForm,
    Btn
  }
})
export default class Login extends Vue {
  private data() {
    return {
      title: '游戏登录',
      showMsgBox: true,
      showLogin: true,
      showMobile: false,
      login: {
        username: {
          prefix: 'user',
          type: 'text',
          placeholder: '请输入账号',
          clearable: true,
          msg: '',
          value: ''
        },
        password: {
          prefix: 'lock',
          type: 'password',
          switchedType: 'text',
          placeholder: '请输入密码',
          suffix: 'hide',
          switchedSuffix: 'view',
          clearable: false,
          msg: '',
          value: ''
        }
      },
      loginRules: {
        username: [{ required: true, msg: '账号不能为空' }],
        password: [{ required: true, msg: '密码不能为空' }, { minLength: 6, msg: '密码错误' }]
      },
      mobile: {
        mobile: {
          prefix: 'phone',
          type: 'number',
          placeholder: '请输入手机号码',
          clearable: true,
          msg: '',
          value: ''
        },
        code: {
          prefix: 'security',
          type: 'number',
          placeholder: '请输入短信验证码',
          clearable: false,
          msg: '',
          value: ''
        }
      },
      mobileRules: {
        mobile: [{ required: true, msg: '手机号码不能为空'}, { reg: regMobile, msg: '手机号格式错误' }],
        code: [{ required: true, msg: '短信验证码不能为空'}, { minLength: 4, msg: '短信验证码错误' }]
      },
      getCodeBtn: {
        text: '获取验证码',
        disabled: false
      }
    }
  }

  // 倒计时
  private cutdown(times: number = 60) {
    let interval: any = null;
    let cutTime: number = times;
    this.$data.getCodeBtn = {
      text: `${cutTime}秒`,
      disabled: true
    };
    interval = setInterval(() => {
      if (cutTime < 2) {
        cutTime = 60;
        clearInterval(interval);
        interval = null;
        this.$data.getCodeBtn = {
          text: '获取验证码',
          disabled: false
        };
        return;
      }
      cutTime--;
      this.$data.getCodeBtn.text = `${cutTime}秒`;
    }, 1000);
  }

  private getCode(mobile: string) {
    console.log(mobile);
    this.cutdown()
  }

  private switchFormPannel(type: string) {
    switch (type) {
      case 'mobile':
        this.$data.showLogin = false;
        this.$data.showMobile = true;
        break;
      default:
        this.$data.showMobile = false;
        this.$data.showLogin = true;
        break;
    }
  }
}
</script>

<style lang="scss" scoped>
.switch-pannel {
  display: flex;
  justify-content: center;
  align-items: center;
  li {
    position: relative;
    padding: 4px 0;
    font-size: 11px;
    line-height: 1;
  }
  li + li {
    margin-left: 20px;
  }
  li + li::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -10px;
    width: 1px;
    height: 12px;
    background: #dfdfdf;
    transform: translate3d(0, -50%, 0);
  }
  .switch-icon {
    font-size: 18px;
    color: #e73c00;
    vertical-align: -4px;
  }
}
</style>