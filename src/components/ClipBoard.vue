<template>
  <div class="clipboard" @click="copy" :data-clipboard-text="text">
    <slot>复制</slot>
  </div>
</template>
<script lang="ts">
// 必须结合utils -> ts 目录里面的 clipboard 来使用
import { Vue, Component, Prop } from 'vue-property-decorator';
import { UPDATETOAST } from '@/store/types';

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
        this.$emit('click');
        this.$store.commit({
          type: UPDATETOAST,
          data: '复制成功'
        });
        clipboard.destroy();
      });
      clipboard.on('error', () => {
        this.$store.commit({
          type: UPDATETOAST,
          data: '复制失败, 您可手动进行复制'
        });
        clipboard.destroy();
      });
    } else {
      this.$store.commit({
        type: UPDATETOAST,
        data: '缺少ClipBoard支持'
      });
    }
  }
}
</script>
