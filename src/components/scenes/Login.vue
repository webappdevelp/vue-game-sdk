<template>
  <div class="hy-login">
    <modal :show="show" animate="fade">
      <form ref="login" class="hy-form" @submit="submit">
        <Icon name="close" @click="hide" />
        <div class="hy-form-header">普通账号登录</div>
        <div class="hy-form-body">
          <div class="hy-form-item" v-for="(obj, key) in form" :key="key">
            <hy-input
              :icon="obj.icon"
              v-model="obj.value"
              :name="key"
              :type.sync="obj.type"
              :placeholder="obj.placeholder"
              :showPsw="obj.showPsw"
            />
          </div>
          <btn style="width: 100%" text="立即登录" type="submit" />
        </div>
        <div class="hy-form-footer">
          <btn text="手机号登录" color="green" @click="mobileLogin"/>
          <btn text="一键注册" color="purple" />
        </div>
      </form>
    </modal>
    <mobile :show.sync="showMobile" @cb="showLogin" />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Modal from '../Modal.vue';
import Icon from '../Icon.vue';
import HyInput from '../form/Input.vue';
import Btn from '../Btn.vue';
import Mobile from './Mobile.vue';
@Component({
  components: {
    Modal,
    Icon,
    HyInput,
    Btn,
    Mobile
  }
})
export default class HyScenesLogin extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;

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
      },
      showMobile: false
    };
  }

  // methods
  private hide() {
    this.$emit('update:show', false);
  }
  private mobileLogin() {
    this.$data.showMobile = true;
    this.hide();
  }
  private showLogin() {
    this.$emit('update:show', true);
  }
  private submit(e: any) {
    console.log(this.$data.form);
    e.preventDefault();
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
  .hy-icon-close {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}

.hy-form-item {
  position: relative;
  margin-bottom: 25px;
  border-bottom: 1px solid #f5f5f5;
  &.error {
    border-color: #e73c00;
  }
  &__error {
    position: absolute;
    padding-top: 10px;
    font-size: 11px;
    color: #e73c00;
  }
}
</style>
