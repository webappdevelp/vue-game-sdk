<template>
  <component v-if="comId" :is="comId" :datas="comDatas"></component>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Ad10277 from './g10277.vue';

@Component({
  components: {
    Ad10277,
    Ad10282: Ad10277
  }
})
export default class Ad extends Vue {
  private data() {
    return {
      comId: '',
      comDatas: {}
    }
  }

  private created() {
    const { query } = this.$route;
    const { an, io } = query;
    this.$data.comId = `Ad${an || io}`;
  }
}
</script>

<style lang="scss" scoped>

</style>