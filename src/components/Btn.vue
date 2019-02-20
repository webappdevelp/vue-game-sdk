<template>
  <button class="hy-btn" :class="colorClass" :type="type" @click="action">{{ text }}</button>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
@Component
export default class HyBtn extends Vue {
  @Prop({
    type: String,
    default: 'button'
  })
  private type!: string;
  @Prop({
    type: String,
    default: '按钮'
  })
  private text!: string;
  @Prop({
    type: String,
    default: ''
  })
  private color!: string;

  get colorClass() {
    return `hy-btn--${this.color}`;
  }

  // methods
  private action() {
    this.$emit('click');
  }
}
</script>
<style lang="scss" scoped>
.hy-btn {
  flex: 1;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  background-color: #f07234;
  border-radius: 2px;
  overflow: hidden;
  & + & {
    margin-left: 15px;
  }
  &:active {
    background-color: #e73c00;
  }
  &--green {
    background-color: #5eb633;
    &:active {
      background-color: #469d1a;
    }
  }
  &--purple {
    background-color: #658196;
    &:active {
      background-color: #64727d;
    }
  }
  &--disabled,
  &--disabled:active {
    background-color: #dadada;
    color: #999;
  }
}
</style>
