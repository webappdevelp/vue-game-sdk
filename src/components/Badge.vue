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
  min-width: 1.25em;
  height: 1.25em;
  line-height: 1;
  padding: 0.14em 0 0;
  font-size: 0.24em;
  color: #fff;
  background: #e73c00;
  border-radius: 50%;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
}
</style>
