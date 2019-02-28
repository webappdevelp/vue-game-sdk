<template>
  <div class="hy-badge" :style="customStyle">{{ msg }}</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class HyBadge extends Vue {
  @Prop({
    type: String,
    default: ''
  })
  private msg!: string;
  @Prop({
    type: Object,
    default: () => {
      return {};
    }
  })
  private customStyle!: object;
}
</script>
<style>
.hy-badge {
  display: inline-block;
  min-width: 15px;
  height: 15px;
  line-height: 1;
  padding: 1px 0 0;
  font-size: 12px;
  color: #fff;
  background: #e73c00;
  border-radius: 50%;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
}
</style>
