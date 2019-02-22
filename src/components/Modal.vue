<template>
  <hy-dialog :show="show" :animate="animate" :z-index="zIndex">
    <template slot-scope="scope">
      <div class="hy-modal" :style="scope.scope">
        <slot></slot>
      </div>
    </template>
  </hy-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import HyDialog from './Dialog.vue';
@Component({
  components: {
    HyDialog
  }
})
export default class HyModal extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;
  @Prop({
    type: String,
    default: 'fade'
  })
  private animate!: string;
  @Prop({
    type: String,
    default: '20'
  })
  private zIndex!: string;
}
</script>
<style lang="scss" scoped>
.hy-modal {
  top: 50%;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 280px;
  padding: 0;
  background-color: #fff;
  transform: translate3d(0, -50%, 0);
  border-radius: 6px;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
