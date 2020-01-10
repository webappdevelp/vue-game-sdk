<template>
  <div class="not-found">
    <hy-error/>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import HyError from '@/components/ErrorTips.vue';
@Component({
  components: {
    HyError
  }
})
export default class NotFount extends Vue {}
</script>
<style>
html,
body,
#app {
  height: 100%;
}
</style>

<style lang="scss" scoped>
.not-found {
  position: relative;
  height: 100%;
}
</style>
