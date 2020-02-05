<template>
  <transition name="fade">
    <div v-if="show">
      <div class="loading-mask" v-if="mask"></div>
      <div class="loading">
        <div class="sprite" ref="sprite"></div>
        <div v-if="msg" class="content">{{ msg }}</div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { mapState } from 'vuex';
import { Spinner } from 'spin.js';

@Component({
  computed: {
    ...mapState('global', {
      show: (state: any) => state.loading.show,
      msg: (state: any) => state.loading.content
    })
  }
})
export default class Loading extends Vue {
  @Prop({
    type: Boolean,
    default: true
  })
  private mask!: boolean;

  private initSpinner() {
    const spriteBox = this.$refs.sprite as HTMLElement;
    if (!spriteBox) return;
    spriteBox.innerHTML = '';
    let sprite: any = new Spinner({ top: '32px', left: '50px', width: 3, color: '#fff' }).spin(
      spriteBox
    );
    this.$once('hook:beforeDestroy', () => {
      sprite = null;
    });
  }
  private updated() {
    this.initSpinner();
  }
}
</script>

<style lang="scss" scoped>
.loading-mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}
.loading {
  position: fixed;
  z-index: 1010;
  top: 50%;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100px;
  min-height: 58px;
  background: rgba(0, 0, 0, .46);
  color: #fff;
  transform: translate3d(0, -50%, 0);
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  font-size: 13px;
}
.sprite {
  position: relative;
  height: 58px;
}
.content {
  padding: 8px 12px;
  white-space: nowrap;
  line-height: 1.2;
}
</style>