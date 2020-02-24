<template>
  <section class="poly">
    <component :is="comId" :key="comId" :datas="comDatas"></component>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import poly195 from './195/index.vue';
import poly196 from './196/index.vue';
import poly198 from './198/index.vue';
import poly201 from './201/index.vue';
import poly202 from './202/index.vue';
import poly204 from './204/index.vue';
import poly206 from './206/index.vue';
import poly207 from './207/index.vue';
import poly208 from './208/index.vue';
import poly209 from './209/index.vue';
import poly210 from './210/index.vue';
import poly211 from './211/index.vue';
import poly212 from './212/index.vue';
import poly213 from './213/index.vue';
import poly214 from './214/index.vue';
import poly215 from './215/index.vue';
import poly216 from './216/index.vue';
import poly217 from './217/index.vue';
import poly218 from './218/index.vue';
import poly219 from './219/index.vue';
import poly221 from './221/index.vue';
import poly222 from './222/index.vue';
import poly223 from './223/index.vue';
import poly224 from './224/index.vue';
import poly226 from './226/index.vue';
import poly227 from './227/index.vue';
import poly229 from './229/index.vue';
import poly230 from './230/index.vue';
import poly231 from './231/index.vue';
import poly234 from './234/index.vue';
import poly237 from './237/index.vue';
import poly238 from './238/index.vue';
import poly239 from './239/index.vue';
import poly240 from './240/index.vue';
import poly241 from './241/index.vue';

@Component({
  components: {
    poly195,
    poly196,
    poly198,
    poly201,
    poly202,
    poly204,
    poly206,
    poly207,
    poly208,
    poly209,
    poly210,
    poly211,
    poly212,
    poly213,
    poly214,
    poly215,
    poly216,
    poly217,
    poly218,
    poly219,
    poly221,
    poly222,
    poly223,
    poly224,
    poly226,
    poly227,
    poly229,
    poly230,
    poly231,
    poly234,
    poly237,
    poly238,
    poly239,
    poly240,
    poly241,
    poly243: poly239,
  }
})
export default class Poly extends Vue {
  private data() {
    return {
      comId: '',
      comDatas: {}
    };
  }
  private created() {
    const { query } = this.$route;
    const { hy_channel_id, channel_id } = query;
    this.$data.comId = `poly${hy_channel_id || channel_id}`;
    this.$data.comDatas = {
      ...query,
      start_origin: 'grf'
    };
  }
}
</script>
<style>
html,
body,
#app,
.poly {
  height: 100%;
}
</style>

<style lang="scss" scoped>
.poly,
#gameWindow {
  width: 100%;
  overflow: hidden;
}
</style>
