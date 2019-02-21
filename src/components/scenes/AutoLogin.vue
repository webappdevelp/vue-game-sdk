<template>
  <modal :show="show">
    <div class="hy-auto">
      <div class="hy-auto__header">
        <div class="hy-auto__loading">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
        <span>{{ username }} 正在登陆...</span>
      </div>
      <btn text="切换账号" @click="action" />
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
export default class HyAutoLogin extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;
  @Prop({
    type: String,
    default: ''
  })
  private username!: string;

  // methods
  private action() {
    this.$emit('click');
  }
}
</script>
<style lang="scss" scoped>
.hy-auto {
  padding: 20px;
  &__loading {
    margin-right: 15px;
    width: 25px;
    height: 25px;
    position: relative;
    i {
      position: absolute;
      height: 2px;
      width: 7px;
      background: #5eb633;
      opacity: 0.2;
      animation: load 1.04s ease infinite;
    }
    i:first-child {
      top: 50%;
      left: 0;
      margin-top: -1px;
      opacity: 1;
      animation-delay: 0.13s;
    }
    i:nth-child(2) {
      top: 5px;
      left: 2px;
      transform: rotate(45deg);
      animation-delay: 0.26s;
    }
    i:nth-child(3) {
      left: 50%;
      top: 2px;
      margin-left: -3px;
      transform: rotate(90deg);
      animation-delay: 0.39s;
    }
    i:nth-child(4) {
      top: 5px;
      right: 2px;
      transform: rotate(135deg);
      animation-delay: 0.52s;
    }
    i:nth-child(5) {
      right: 0;
      top: 50%;
      margin-top: -1px;
      transform: rotate(180deg);
      animation-delay: 0.65s;
    }
    i:nth-child(6) {
      right: 2px;
      bottom: 5px;
      transform: rotate(225deg);
      animation-delay: 0.78s;
    }
    i:nth-child(7) {
      bottom: 2px;
      left: 50%;
      margin-left: -3px;
      transform: rotate(270deg);
      animation-delay: 0.91s;
    }
    i:last-child {
      bottom: 5px;
      left: 2px;
      transform: rotate(315deg);
      animation-delay: 1.04s;
    }
  }
  &__header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    span {
      line-height: 1.2;
      font-size: 16px;
      color: #333;
      max-width: 75%;
      word-break: break-all;
    }
  }
}
@keyframes load {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
</style>
