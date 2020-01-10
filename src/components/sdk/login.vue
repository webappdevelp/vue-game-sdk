<template>
  <msg-box key="login-pannel" :show="show" :closeable="false">
    <div slot="header" class="title">
      <svg-icon
        v-if="showBack"
        icon-class="up"
        class-name="back"
        @click="switchForm()"
      />
        {{ title }}
    </div>
    <template slot="body">
      <div class="box">
        <h-form
          v-show="showLogin"
          key="login"
          submit-btn-text="立即登录"
          :fields="login"
          :rules="loginRules"
          @submit="accountlogin"
        />
        <h-form
          v-show="showRegister"
          key="register"
          submit-btn-text="立即注册"
          :fields="register"
          :rules="registerRules"
          @submit="accountlogin"
        />
        <h-form
          v-show="showMobile"
          key="mobile"
          :fields="mobile"
          submit-btn-text="立即登录"
          get-code-field="code"
          rely-field="mobile"
          :rules="mobileRules"
          :get-code-btn="getCodeBtn"
          :get-code-params="{ ...sdkOptions, action: 'register' }"
          @submit="mobileLogin"
        />
        <ul class="switch-pannel">
          <li v-if="showLogin || showRegister" @click="switchForm('mobile')">
            <svg-icon icon-class="phone" class-name="switch-icon" />手机登录
          </li>
          <li v-if="showMobile" @click="switchForm('register')">
            <svg-icon icon-class="user" class-name="switch-icon" />账号注册
          </li>
          <li @click="switchForm('fast')">
            <svg-icon icon-class="guest" class-name="switch-icon" />游客注册
          </li>
        </ul>
      </div>
    </template>
    <span slot="footer"></span>
  </msg-box>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Cookies from 'js-cookie';
import MD5 from 'md5';
import MsgBox from '@/components/core/msgBox/index.vue';
import HForm from '@/components/core/form/index.vue';
import Btn from '@/components/core/btn/index.vue';
import { regMobile } from '@/utils/ts/regexps';
import { userStorageName } from '@/config';

@Component({
  components: {
    MsgBox,
    HForm,
    Btn
  }
})
export default class Login extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;

  @Prop({
    type: Object,
    default: () => ({})
  })
  private sdkOptions!: { [propName: string]: any };

  private data() {
    return {
      title: '游戏登录',
      showMsgBox: true,
      showLogin: true,
      showRegister: false,
      showMobile: false,
      showBack: false,
      login: {
        username: {
          prefix: 'user',
          type: 'text',
          placeholder: '请输入账号',
          autocomplete: true,
          clearable: true,
          msg: '',
          value: ''
        },
        password: {
          prefix: 'lock',
          type: 'password',
          switchedType: 'text',
          placeholder: '请输入密码',
          autocomplete: true,
          suffix: 'hide',
          switchedSuffix: 'show',
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
        code: [{ required: true, msg: '短信验证码不能为空'}, { length: 4, msg: '短信验证码错误' }]
      },
      register: {
        username: {
          prefix: 'user',
          type: 'text',
          placeholder: '请输入账号',
          autocomplete: true,
          clearable: true,
          msg: '',
          value: ''
        },
        password: {
          prefix: 'lock',
          type: 'password',
          switchedType: 'text',
          placeholder: '请输入密码',
          autocomplete: true,
          suffix: 'hide',
          switchedSuffix: 'show',
          clearable: false,
          msg: '',
          value: ''
        }
      },
      registerRules: {
        username: [{ required: true, msg: '账号不能为空' }],
        password: [{ required: true, msg: '密码不能为空' }, { minLength: 6, msg: '密码错误' }]
      },
      getCodeBtn: {
        text: '获取验证码',
        disabled: false
      }
    }
  }

  @Watch('show', { deep: true })
  private fillDefaultForm() {
    if (this.show) {
      const { app, start_origin } = this.sdkOptions;
      const userInfo = JSON.parse(Cookies.get(`${userStorageName}${app}-${start_origin}`) || '{}');
      const { username, password } = userInfo;
      this.$data.login.username.value = username || '';
      this.$data.login.password.value = password || '';
    }
  }

  private async switchForm(type: string = '') {
    switch (type) {
      case 'mobile':
        this.$data.showLogin = false;
        this.$data.showRegister = false;
        this.$data.title = '游戏登录';
        this.$data.showMobile = true;
        this.$data.showBack = true;
        break;
      case 'register':
        this.$data.showMobile = false;
        this.$data.title = '账号注册';
        this.$data.showRegister = true;
        break;
      case 'fast':
        await this.$store.dispatch(`sdk/fastReg`, {
          ...this.sdkOptions,
          password: MD5(`uu${new Date().getTime()}game`)
        });
        break;
      default:
        this.$data.showMobile = false;
        this.$data.showRegister = false;
        this.$data.showBack = false;
        this.$data.title = '游戏登录';
        this.$data.showLogin = true;
        break;
    }
  }

  private async mobileLogin(params: any = {}) {
    await this.$store.dispatch('sdk/mobileLogin', {
      ...this.sdkOptions,
      ...params
    });
  }

  private async accountlogin(params: any = {}) {
    await this.$store.dispatch('sdk/login', {
      ...this.sdkOptions,
      ...params
    });
  }

  private created() {
    this.fillDefaultForm();
  }
}
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 12px 0 0;
  font-size: 15px;
  text-align: center;
  line-height: 1.3;
}
.back {
  position: absolute;
  z-index: 1;
  left: 8px;
  font-size: 22px;
  color: #999;
  transform: rotate(-90deg);
}
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