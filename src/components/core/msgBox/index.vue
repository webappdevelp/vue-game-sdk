<template>
  <transition name="fade">
    <div v-if="show">
      <div class="msg-mask"></div>
      <div :class="className">
        <svg-icon v-if="closeable" icon-class="close" class-name="close" @click="close" />
        <slot name="header">
          <div class="msg-title">
            {{ title }}
          </div>
        </slot>
        <div class="msg-content">
          <slot name="body">这里是内容</slot>
        </div>
        <div class="msg-footer">
          <slot name="footer">
            <a class="msg-btn" :style="cancelBtn.style" @click="cancel">{{ cancelBtn.text }}</a>
            <a class="msg-btn" :style="okBtn.style" @click="confirm">{{ okBtn.text }}</a>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class MsgBox extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;

  @Prop({
    type: String,
    default: '标题'
  })
  private title!: string;

  @Prop({
    type: Boolean,
    default: true
  })
  private closeable!: boolean;

  @Prop({
    type: Object,
    default: () => ({
      style: {
        color: 'rgba(0, 122, 255, .65)'
      },
      text: '取消'
    })
  })
  private cancelBtn!: { [propName: string]: any };

  @Prop({
    type: Object,
    default: () => ({
      style: {
        color: '#007aff'
      },
      text: '确定'
    })
  })
  private okBtn!: { [propName: string]: any };

  @Prop({
    type: String,
    default: ''
  })
  private wrapperClass!: string;

  get className() {
    return `msg ${this.wrapperClass}`
  }

  private close() {
    if(this.$listeners.close) {
      return this.$emit('close');
    }
    this.$emit('update:show', false);
  }

  private cancel() {
    if (this.$listeners.cancel) {
      return this.$emit('cancel')
    }
    this.$emit('update:show', false);
  }

  private confirm() {
    this.$emit('ok');
  }

}
</script>

<style lang="scss" scoped>
.msg-mask {
  position: fixed;
  z-index: 998;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .46);
}
.msg {
  position: fixed;
  z-index: 999;
  top: 50%;
  left: 0;
  right: 0;
  width: 300px;
  margin: 0 auto;
  background: #fff;
  line-height: 1;
  border-radius: 5px;
  overflow: hidden;
  transform: translate3d(0, -50%, 0);
}
.msg-title {
  padding: 10px 12px 0;
  font-size: 16px;
  color: #333;
  text-align: center;
}
.close {
  position: absolute;
  z-index: 1;
  top: 2px;
  right: 2px;
  font-size: 28px;
  color: #999;
  cursor: pointer;
}
.msg-content {
  padding: 22px 12px 12px;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
}
.msg-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #d9d9d9;
  & > a {
    flex: 1;
    padding: 14px 0 12px;
    font-size: 14px;
    text-align: center;
    color: rgba(0, 122, 255, .65);
    box-sizing: border-box;
    &:hover,
    &:active {
      background: rgba(221, 221, 221, .2)
    }
  }
  & > a + a {
    color: #007aff;
    border-left: 1px solid #d9d9d9;
  }
}

</style>