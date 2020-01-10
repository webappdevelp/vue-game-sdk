<template>
  <sup v-if="!isDot" class="badge">{{ text }}</sup>
  <sup v-else class="dot"></sup>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Badge extends Vue {
  @Prop({
    type: String,
    default: ''
  })
  private text!: string;

  @Prop({
    type: Boolean,
    default: false
  })
  private isDot!: boolean;

}
</script>

<style lang="scss" scoped>
.badge {
  display: inline-block;
  font-size: 12px;
  line-height: .8;
  padding: 4px 6px;
  color: #fff;
  border-radius: 10px;
  border: 1px solid #fff;
  background: #f56c6c;
  text-align: center;
  white-space: nowrap;
  &.warning {
    background: #e6a23c;
  }
}
.dot {
  display: inline-block;
  width: 8px;
  padding: 4px 0;
  line-height: .8;
  border-radius: 50%;
  border: 1px solid #fff;
  background: #f56c6c;
}
</style>