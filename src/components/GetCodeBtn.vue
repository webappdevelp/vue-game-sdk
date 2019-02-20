<template>
  <btn :color="color" :text="text" @click="getCode" />
</template>
<script lang="ts">
let lock: boolean = false;
import { Vue, Component, Prop } from 'vue-property-decorator';
import Btn from './Btn.vue';
@Component({
  components: {
    Btn
  }
})
export default class HyGetCodeBtn extends Vue {
  @Prop({
    type: String,
    default: ''
  })
  private mobile!: string;

  private data() {
    return {
      color: 'green',
      text: '获取验证码'
    };
  }

  // methods
  private getCode() {
    this.$emit('cb', '手机号错误');
    console.log(this.mobile);
  }
}
</script>
