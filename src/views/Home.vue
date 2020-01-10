<template>
  <div id="home"></div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ClipBoard from '@/components/ClipBoard.vue';
import clipboard from '@/utils/ts/clipboard';
@Component({
  components: {
    copyOne: ClipBoard,
    copyTwo: ClipBoard
  }
})
export default class Home extends Vue {
  private data() {
    return {};
  }

  // lifecycles
  private beforeCreate() {
    clipboard();
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
