<template>
  <div class="hy-control" @click="action">
    <badge v-if="msg !== ''" :msg="msg"></badge>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Badge from '../Badge.vue';
@Component({
  components: {
    Badge
  }
})
export default class HyControl extends Vue {
  @Prop({
    type: String,
    default: ''
  })
  private msg!: string;

  // methods
  private action() {
    this.$emit('click');
  }
}
</script>
<style lang="scss" scoped>
.hy-control {
  position: absolute;
  z-index: 100;
  top: 13%;
  left: 0;
  width: 40px;
  height: 40px;
  overflow: hidden;
  will-change: auto;
  background: url('../../assets/scenes/control.png') center no-repeat;
  background-size: contain;
  transform: translate3d(-20px, 0, 0);
  .hy-badge {
    position: absolute;
    top: 0;
    right: 0;
    text-align: center;
  }
}
</style>
