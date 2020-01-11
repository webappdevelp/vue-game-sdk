<template>
  <div class="sw"></div>
</template>

<script lang="ts">
// 二合一切换链接
import { Vue, Component } from 'vue-property-decorator';
import isAndroid from '@/utils/ts/device/isAndroid';

@Component
export default class SW extends Vue {
  private created() {
    const { query } = this.$route;
    const { io, an } = query;
    delete query.io;
    delete query.an;
    this.$router.replace({
      path: '/scenes',
      query: {
        ...query,
        gid: isAndroid ? an : io
      }
    });
  }
}
</script>