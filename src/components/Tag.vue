<template>
  <span class="hy-tag" :class="colorClass">{{ text }}</span>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class HyTag extends Vue {
  @Prop({
    type: String,
    default: ''
  })
  private text!: string;
  @Prop({
    type: String,
    default: ''
  })
  private color!: string;

  // computed
  get colorClass() {
    return `hy-tag--${this.color}`;
  }
}
</script>
<style lang="scss" scoped>
.hy-tag {
  border: 1px solid currentColor;
  padding: 0 3px;
  color: #e73c00;
  font-size: 12px;
  box-sizing: border-box;
  border-radius: 3px;
  overflow: hidden;
  &--blue {
    color: #2799fa;
  }
  &--orange {
    color: #ff881f;
  }
  &--purple {
    color: #e200a7;
  }
}
</style>
