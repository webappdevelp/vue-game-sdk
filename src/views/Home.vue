<template>
  <div id="home"></div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class Home extends Vue {
  private data() {
    return {};
  }
}
</script>
<style lang="scss" scoped>
.copy-one,
.copy-two {
  width: 300px;
  height: 80px;
  background: red;
}
</style>
