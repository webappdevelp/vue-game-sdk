<template>
  <transition name="fade">
    <div v-if="show" class="hy-wxtobrowser">
      <div ref="bg" class="hy-wxtobrowser-bg" @click="hide"></div>
      <div class="hy-wxtobrowser-box">
        <p>
          您可以点击右上角按钮，选择<i>在浏览器打开</i>，{{ msg }}
        </p>
        <a href="javascript:;" @click="hide">知道了</a>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class HyWxToBrowserTip extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;
  @Prop({
    type: String,
    default: '这样就不影响您玩游戏了哦~'
  })
  private msg!: string;

  // methods
  private hide() {
    this.$emit('update:show', false);
  }

  // lifecycles
  private updated() {
    if (this.show) {
      const bg = this.$refs.bg as Element;
      bg.addEventListener('touchmove', (e: Event) => {
        e.preventDefault();
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.hy-wxtobrowser {
  &-bg,
  &-box {
    position: fixed;
    z-index: 4000;
  }
  &-bg {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.45);
  }
  &-box {
    z-index: 4010;
    top: 15px;
    right: 10px;
    padding: 15px 20px;
    width: 60%;
    max-width: 200px;
    background: #fff;
    border-radius: 5px;
    box-sizing: border-box;
    &::before {
      content: '';
      position: absolute;
      top: -10px;
      right: 10%;
      width: 0;
      height: 0;
      border-width: 10px;
      border-style: dashed solid solid dashed;
      border-color: transparent #fff #fff transparent;
    }
    p {
      font-size: 14px;
      line-height: 1.5;
    }
    i {
      color: #f07234;
    }
    a {
      margin-top: 15px;
      display: block;
      text-decoration: none;
      font-size: 14px;
      color: #f07234;
      padding: 5px 0 7px;
      line-height: 1;
      border: 1px solid #f07234;
      border-radius: 14px;
      overflow: hidden;
      text-align: center;
    }
  }
}
</style>
