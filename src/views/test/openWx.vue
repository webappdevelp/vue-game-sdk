<template>
  <div class="open-weixin">
    <btn text="打开百度" @click="startOpen('https://m.baidu.com')" />
    <btn text="打开微信" @click="startOpen('weixin://')" />
    <!-- <iframe :src="link" @load="startOpen"></iframe> -->
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Btn from '@/components/Btn.vue';
@Component({
  components: {
    Btn
  }
})
export default class OpenWeiXin extends Vue {
  // methods
  private startOpen(link: string) {
    const state = window.open(link, '_blank');
    console.log(state);
  }
}
</script>
<style lang="scss" scoped>

</style>
