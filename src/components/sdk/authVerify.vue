<template>
  <msg-box
    key="auth-verify"
    :show="!!step"
    :title="title"
    :closeable="['loginLimit', 'payLimit'].indexOf(step) < 0"
    @close="hideModel">
    <template slot="body">
      <c-form
        v-if="['auth', 'payAuth'].indexOf(step) > -1"
        key="auth"
        submit-btn-text="立即认证"
        :fields="fields"
        :rules="rules"
        @submit="verifyName">
        <div slot="header" class="auth-title">
          <p v-if="step === 'auth'">根据国家相关规定, 游戏用户需进行实名认证, 否则后续将<span>无法正常游戏</span></p>
          <p v-else>根据国家相关规定, 游戏用户需进行实名认证, 方可进行付费操作</p>
        </div>
      </c-form>
      <div v-if="['loginLimit', 'payLimit'].indexOf(step) > -1" class="limit-tips" v-html="LimitTips"></div>
    </template>
    <div slot="footer">
      <div v-if="['auth', 'payAuth'].indexOf(step) > -1" class="auth-tips">
        根据<span @click="openBrowser(!!sdkOptions.mapp, 'http://www.sapprft.gov.cn/sapprft/contents/6588/407807.shtml')">《关于防止未成年人沉迷网络游戏的通知》</span>, 游戏用户应使用有效身份证件实名认证, 我们承若将依法保护您的个人信息安全!
      </div>
      <div v-if="['loginLimit', 'payLimit'].indexOf(step) > -1" class="btn" @click="hideModel">好的, 知道了</div>
    </div>
  </msg-box>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { mapState } from 'vuex';
import MsgBox from '@/components/core/msgBox/index.vue';
import CForm from '@/components/core/form/index.vue';
import openBrowser from '@/utils/ts/openBrowser';
import { UPDATECERTIFY } from '@/store/types';

@Component({
  components: {
    MsgBox,
    CForm
  },
  computed: {
    ...mapState('sdk', {
      step(state: any) {
        const { step } = state.certify;
        return step;
      },
      title(state: any) {
        const { step } = state.certify;
        return ['loginLimit', 'payLimit'].indexOf(step) > -1 ? '温馨提示' : '实名认证';
      },
      LimitTips(state: any) {
        const { tips } = state.certify;
        return tips;
      }
    })
  },
  methods: {
    openBrowser
  }
})
export default class AuthVerify extends Vue {
  @Prop({
    type: Object,
    default: () => ({})
  })
  private sdkOptions!: { [propName: string]: string }

  private data(){
    return {
      showVerify: false,
      fields: {
        realname: {
          type: 'text',
          clearable: true,
          placeholder: '请输入您的真实姓名',
          msg: '',
          value: ''
        },
        id_card: {
          type: 'text',
          clearable: true,
          placeholder: '请输入对应的身份证号码',
          msg: '',
          value: ''
        }
      },
      rules: {
        realname: [{ required: true, msg: '真实姓名不能为空' }],
        id_card: [{ required: true, msg: '身份证号码不能为空' }]
      }
    }
  }

  // methods
  private async verifyName(params: any = {}) {
    await this.$store.dispatch('sdk/verifyName', {
      ...this.sdkOptions,
      ...params
    });
  }

  private async hideModel() {
    const { step, limit_type } = this.$store.getters['sdk/certify'];
    switch(step) {
      case 'auth':
        if (limit_type === 5) {
          await this.$store.dispatch('sdk/logOut', this.sdkOptions);
        }
        this.$store.commit(`sdk/${UPDATECERTIFY}`, { limit_type: -1, step: '' });
        break;
      case 'payAuth':
      case 'payLimit':
        this.$store.commit(`sdk/${UPDATECERTIFY}`, { pay_limit: 0, step: '' });
        break;
      case 'loginLimit':
        this.$store.commit(`sdk/${UPDATECERTIFY}`, { limit_type: -1, step: '' });
        await this.$store.dispatch('sdk/logOut', this.sdkOptions);
        break;
    }
  }
}
</script>

<style lang="scss" scoped>
.auth-title {
  font-size: 12px;
  color: #333;
  padding: 0 0 15px;
  span {
    color: #e73c00;
  }
}
.auth-tips {
  padding: 0 12px 12px;
  margin-top: -13px;
  font-size: 12px;
  line-height: 1.5;
  background: #fff;
  color: #999;
  span {
    text-decoration: underline;
  }
}
.limit-tips {
  font-size: 13px;
  color: #666;
}
.btn {
  padding: 14px 0 12px;
  font-size: 14px;
  text-align: center;
  color: #007aff;
  box-sizing: border-box;
  &:hover,
  &:active {
    background: rgba(221, 221, 221, .2)
  }
}
</style>