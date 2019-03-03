<template>
  <div class="clipboard" @click="copy" :data-clipboard-text="text">
    <slot></slot>
  </div>
</template>
<script lang="ts">
// 必须结合utils -> ts 目录里面的 clipboard 来使用
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class ClipBoard extends Vue {
  @Prop({
    type: String,
    default: ''
  })
  private text!: string;

  // methods
  private copy() {
    if (window.ClipboardJS) {
      const clipboard = new window.ClipboardJS('.clipboard');
      clipboard.on('success', () => {
        alert('复制成功');
      });
    }
  }
}
</script>
