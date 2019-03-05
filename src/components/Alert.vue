<template>
  <modal :show="show" :z-index="zIndex" animate="fade">
    <div class="hy-alert">
      <div class="hy-alert-title">{{ title }}</div>
      <div class="hy-alert-content">
        <slot name="content">提示内容</slot>
      </div>
      <div class="hy-alert-footer">
        <slot name="footer">
          <div class="hy-alert-btn" @click="action">{{ btnText }}</div>
        </slot>
      </div>
    </div>
  </modal> 
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue';
@Component({
  components: {
    Modal
  }
})
export default class HyAlert extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;
  @Prop({
    type: String,
    default: '20'
  })
  private zIndex!: string;
  @Prop({
    type: String,
    default: '提示信息'
  })
  private title!: string;
  @Prop({
    type: String,
    default: '确定'
  })
  private btnText!: string;

  // methods
  private action() {
    this.$emit('action');
  }
}
</script>
<style lang="scss">
.hy-alert {
  &-title {
    padding: 18px 0;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    text-align: center;
  }
  &-content {
    padding: 0 20px 18px;
    font-size: 13px;
    color: #333;
  }
  &-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #e5e5e5;
  }
  &-btn {
    flex: 1;
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    text-align: center;
    color: #018ffd;
  }
}
</style>
