<template>
  <span class="tag">{{ text }}</span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Tag extends Vue {
  @Prop({
    type: String,
    default: ''
  })
  private text!: string;

}
</script>

<style lang="scss" scoped>
.tag {
  display: inline-block;
  border: 1px solid currentColor;
  padding: 3px;
  color: #e73c00;
  font-size: 12px;
  line-height: .8;
  border-radius: 3px;
  overflow: hidden;
}
</style>