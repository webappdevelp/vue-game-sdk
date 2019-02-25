<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import Loading from '@/components/Loading.vue';
import Toast from '@/components/Toast.vue';
import { mapState } from 'vuex';
import { UPDATETOAST } from '@/stores/types';
@Component({
  components: {
    Loading,
    Toast
  },
  computed: {
    ...mapState(['toast', 'loading'])
  }
})
export default class App extends Vue {
  private data() {
    return {};
  }

  // lifecycles
  private errorCaptured(err: Error, vm: Comment, info: string) {
    console.log(err, vm, info);
  }
}
</script>
<style lang="scss">
@import '@/utils/sass/_reset.scss';
#app {
  width: 100%;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
}
</style>
