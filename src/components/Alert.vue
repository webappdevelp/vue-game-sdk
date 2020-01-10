<template>
  <modal :show="show" :z-index="zIndex" animate="fade">
    <div class="hy-alert">
      <div class="hy-alert-title">
        {{ title }}
        <Icon v-if="needClose" name="close" @click="hide" />
      </div>
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
import Icon from '@/components/Icon.vue';
@Component({
  components: {
    Modal,
    Icon
  }
})
export default class HyAlert extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;

  @Prop({
    type: Boolean,
    default: false
  })
  private needClose!: boolean;

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
  private hide() {
    this.$emit('update:show');
  }
  private action() {
    this.$emit('action');
  }
}
</script>
<style lang="scss">
.hy-alert {
  &-title {
    position: relative;
    padding: 20px 0;
    font-size: 16px;
    color: #333;
    text-align: center;
    .hy-icon {
      position: absolute;
      z-index: 2;
      top: 5px;
      right: 5px;
    }
  }
  &-content {
    padding: 0 20px 30px;
    font-size: 14px;
    color: #848484;
    word-break: break-all;
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
    font-size: 14px;
    text-align: center;
    color: #018ffd;
    &:active {
      background-color: #f5f5f5;
    }
  }
}
</style>
