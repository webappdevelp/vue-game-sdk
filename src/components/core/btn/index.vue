<template>
  <button :class="className" :type="type" :disabled="disabled" @click="click">{{ text }}</button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Btn extends Vue {
  @Prop({
    type: String,
    default: '按钮'
  })
  private text!: string;

  @Prop({
    type: String,
    default: 'button'
  })
  private type!: string;

  @Prop({
    type: Boolean,
    default: false
  })
  private disabled!: boolean;

  @Prop({
    type: String,
    default: ''
  })
  private disabledClass!: string;

  get className() {
    return `btn ${this.disabled ? `disabled ${this.disabledClass}` : ''}`
  }

  private click() {
    if (this.disabled) {
      return;
    }
    this.$emit('click');
  }

}
</script>

<style lang="scss" scoped>
.btn {
  display: inline-block;
  line-height: .8;
  padding: 15px 0 14px;
  width: 100%;
  font-size: 14px;
  text-align: center;
  color: #fff;
  background: #f07234;
  border-radius: 20px;
  overflow: hidden;
  &:active {
    background: #e73c00;
  }
  &.disabled {
    background: #ddd;
    color: #999;
  }
}
</style>