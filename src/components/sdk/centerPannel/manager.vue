<template>
  <msg-box key="manager" :show.sync="showModel" @close="hideModel">
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
      <ul v-show="showControl" class="manager">
        <li v-if="hasMobile" class="disabled">
          <svg-icon icon-class="phone" class-name="prefix phone" />
          <div>
            已绑定手机号
          </div>
          <svg-icon icon-class="up" class-name="suffix" />
        </li>
        <li v-else @click="switchForm('mobile')">
          <svg-icon icon-class="phone" class-name="prefix phone" />
          <div>
            绑定手机号码
            <badge is-dot />
          </div>
          <svg-icon icon-class="up" class-name="suffix" />
        </li>
        <li @click="switchForm('psw')">
          <svg-icon icon-class="lock" class-name="prefix lock" />
          <div>
            修改密码
          </div>
          <svg-icon icon-class="up" class-name="suffix" />
        </li>
        <li @click="switchForm('logOut')">
          <svg-icon icon-class="switch" class-name="prefix switch" />
          <div>
            切换账号
          </div>
          <svg-icon icon-class="up" class-name="suffix" />
        </li>
      </ul>
      <c-form
        v-if="showMobile"
        key="bind-mobile"
        submit-btn-text="确认绑定"
        get-code-field="code"
        rely-field="mobile"
        :fields="mobileFields"
        :rules="mobileRules"
        :get-code-params="{ ...sdkOptions, action: 'bind_mobile' }"
        @submit="mobileBind"
      />
      <c-form
        v-if="showPsw"
        key="psw"
        submit-btn-text="确认修改"
        get-code-field="code"
        rely-field="mobile"
        :fields="hasMobile ? pswMFields : pswFields"
        :rules="hasMobile ? pswMRules : pswRules"
        :get-code-params="{ ...sdkOptions, action: 'register' }"
        @submit="changePsw"
      />
    </template>
    <span slot="footer"></span>
  </msg-box>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { mapState } from 'vuex';
import MsgBox from '@/components/core/msgBox/index.vue';
import Badge from '@/components/core/badge/index.vue';
import CForm from '@/components/core/form/index.vue';
import { regMobile } from '@/utils/ts/regexps';

@Component({
  components: {
    MsgBox,
    Badge,
    CForm
  },
  computed: {
    ...mapState('sdk', {
      hasMobile(state: any) {
        this.switchForm();
        return !!state.user.mobile
      },
    })
  }
})
export default class Manager extends Vue {
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
      title: '账号管理',
      showControl: true,
      showBack: false,
      showMobile: false,
      showPsw: false,
      mobileFields: {
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
      pswFields: {
        old_password: {
          type: 'text',
          switchedType: 'password',
          placeholder: '请输入原密码',
          prefix: 'lock',
          suffix: 'show',
          switchedSuffix: 'hide',
          clearable: false,
          msg: '',
          value: ''
        },
        password: {
          type: 'text',
          switchedType: 'password',
          placeholder: '请输入新密码',
          prefix: 'lock',
          suffix: 'show',
          switchedSuffix: 'hide',
          clearable: false,
          msg: '',
          value: ''
        },
        re_password: {
          type: 'text',
          switchedType: 'password',
          placeholder: '请确认新密码',
          prefix: 'lock',
          suffix: 'show',
          switchedSuffix: 'hide',
          clearable: false,
          msg: '',
          value: ''
        }
      },
      pswRules: {
        old_password: [{ required: true, msg: '原密码不能为空' }],
        password: [
          { required: true, msg: '新密码不能为空' },
          { minLength: 6, msg: '密码长度应不小于6位' },
        ],
        re_password: [
          { required: true, msg: '新密码不能为空' },
          { minLength: 6, msg: '密码长度应不小于6位' },
          { matchField: 'password', msg: '两次密码不匹配' },
        ]
      },
      pswMFields: {
        mobile: {
          prefix: 'phone',
          type: 'number',
          placeholder: '请输入手机号码',
          clearable: false,
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
        },
        password: {
          type: 'text',
          switchedType: 'password',
          placeholder: '请输入新密码',
          prefix: 'lock',
          suffix: 'show',
          switchedSuffix: 'hide',
          clearable: false,
          msg: '',
          value: ''
        }
      },
      pswMRules: {
         mobile: [{ required: true, msg: '手机号码不能为空'}, { reg: regMobile, msg: '手机号格式错误' }],
        code: [{ required: true, msg: '短信验证码不能为空'}, { minLength: 4, msg: '短信验证码错误' }],
        password: [
          { required: true, msg: '新密码不能为空' },
          { minLength: 6, msg: '密码长度应不小于6位' },
        ],
      }
    }
  }

  get showModel() {
    return this.show;
  }

  private hideModel() {
    this.switchForm();
    this.$emit('update:show', false);
  }

  // 切换表单
  private async switchForm(type: string = '') {
    switch(type) {
      case 'mobile':
        this.$data.title = '绑定手机号';
        this.$data.showBack = true;
        this.$data.showMobile = true;
        this.$data.showControl = false;
        break;
      case 'psw':
        this.$data.title = '修改密码';
        this.$data.showBack = true;
        this.$data.showPsw = true;
        this.$data.showControl = false;
        break;
      case 'logOut':
        const result = await this.$store.dispatch('sdk/logOut', this.sdkOptions);
        if (result) {
          this.hideModel();
        }
        break;
      default:
        this.$data.title = '账号管理';
        this.$data.showControl = true;
        this.$data.showMobile = false;
        this.$data.showBack = false;
        this.$data.showPsw = false;
        break;
    }
  }
  // 绑定手机号
  private mobileBind(params: any = {}) {
    this.$emit('bindMobile', params);
  }
  // 修改密码
  private changePsw(params: any = {}) {
    this.$emit('changePsw', params);
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
.manager {
  li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f5f5f5;
    div {
      flex: 1;
      justify-content: flex-start;
      align-items: center;
      margin: 0 12px;
      font-size: 14px;
    }
  }
  li.disabled div {
    color: #999;
  }
  .prefix {
    font-size: 23px;
    color: #5EB633;
  }
  .suffix {
    font-size: 20px;
    color: #999;
    transform: rotate(90deg);
  }
}
</style>