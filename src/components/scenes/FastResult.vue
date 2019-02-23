<template>
  <modal :show="show">
    <div class="hy-fastreg">
      <div class="hy-fastreg-header">注册成功</div>
      <div class="hy-fastreg-body">
        <h4>请牢记您的账号密码！</h4>
        <ul>
          <li>账号：{{ data.username }}</li>
          <li>密码：原始密码</li>
        </ul>
        <btn text="进入游戏" @click="hide"/>
      </div>
    </div>
  </modal>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Modal from '../Modal.vue';
import Btn from '../Btn.vue';
@Component({
  components: {
    Modal,
    Btn
  }
})
export default class HyFastRegister extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;
  @Prop({
    type: Object,
    default: () => {
      return {};
    }
  })
  private data!: object;

  // methods
  private hide() {
    this.$emit('click');
  }
}
</script>
<style lang="scss" scoped>
.hy-fastreg {
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
    padding-top: 20px;
    width: 100%;
    overflow: hidden;
  }
  h4 {
    color: #e73c00;
    font-weight: 400;
    font-size: 15px;
    text-align: center;
  }
  ul {
    margin: 15px 0;
  }
  li {
    font-size: 14px;
    line-height: 2;
    text-indent: 25%;
  }
}
</style>
