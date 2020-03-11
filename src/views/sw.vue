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
    const { io, an, an_cn, io_cn } = query;
    delete query.io;
    delete query.an;
    delete query.an_cn;
    delete query.io_cn;
    this.$router.replace({
      path: '/play',
      query: {
        ...query,
        gid: isAndroid ? an : io,
        channel: isAndroid ? an_cn : io_cn
      }
    });
  }
}
</script>