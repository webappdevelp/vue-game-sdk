<template>
  <form slot="body" @submit.prevent="submit">
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
        :switched-suffix-icon="obj.switchedSuffix"
      />
    </div>
    <div class="item">
      <btn text="立即登录" type="submit" />
    </div>
  </form>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import HInput from '@/components/core/input/index.vue';
import Btn from '@/components/core/btn/index.vue';

@Component({
  components: {
    HInput,
    Btn
  }
})
export default class Login extends Vue {
  private data() {
    return {
      show: true,
      form: {
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
      rules: {
        username: [{ required: true, msg: '请输入账号' }],
        password: [{ required: true, msg: '请输入密码' }, { minLength: 6, msg: '密码错误' }]
      }
    }
  }


  private submit() {
    console.log(this.$data.form);
  }
}
</script>

<style lang="scss" scoped>
.item {
  margin-bottom: 15px;
}
</style>