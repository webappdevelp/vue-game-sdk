<template>
  <hy-dialog :show="show" z-index="40" @close="hide">
    <template slot-scope="scope">
      <div class="hy-article" :style="scope.scope.frontStyle">
        <icon name="close" @click="hide"/>
        <div class="hy-article-box">
          <div class="hy-article-title">{{ datas.title }}</div>
          <p class="hy-article-date">{{ datas.date }}</p>
          <div class="hy-article-content" v-html="datas.content"></div>
        </div>
      </div>
    </template>
  </hy-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import HyDialog from '@/components/Dialog.vue';
import Icon from '@/components/Icon.vue';
@Component({
  components: {
    HyDialog,
    Icon
  }
})
export default class HyScenesArticle extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private show!: boolean;

  @Prop({
    type: Object,
    default: () => {
      return {};
    }
  })
  private datas!: object;

  // methods
  private hide() {
    this.$emit('update:show');
  }
}
</script>
<style lang="scss">
.hy-article {
  top: 50%;
  left: 0;
  right: 0;
  width: 80%;
  height: 80%;
  padding-top: 25px;
  margin: 0 auto;
  background: #fff;
  border-radius: 4px;
  box-sizing: border-box;
  overflow: hidden;
  text-align: right;
  transform: translate3d(0, -50%, 0);
  .hy-icon {
    position: absolute;
    top: 0;
    right: 0;
  }
  &-box {
    padding: 0 12px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
  &-title {
    line-height: 1.5;
    font-size: 15px;
    font-weight: 500;
    color: #333;
    text-align: center;
  }
  &-date {
    font-size: 12px;
    color: #999;
    line-height: 32px;
    text-align: center;
    padding: 6px 0;
    border-bottom: 1px solid #e5e5e5;
    box-sizing: border-box;
  }
  &-content {
    padding: 10px 0 24px;
    font-size: 12px;
    color: #333;
    line-height: 2;
    text-indent: 24px;
    text-align: left;
  }
}
</style>
