<template>
  <div class="hy-infos">
    <div class="hy-infos-empty">
      暂无相关资讯哦~
    </div>
    <template v-if="!!datas.length">
      <div class="hy-info-item">
        <Tag text="置顶" />
        <span class="title">《大天使H5》拍卖行提示“帐号存在安全隐患”公告</span>
        <span class="timer">02-18</span>
      </div>
      <div class="hy-info-item">
        <Tag text="置顶" />
        <Tag text="攻略" color="blue" />
        <span class="title">《大天使H5》拍卖行提示“帐号存在安全隐患”公告</span>
        <span class="timer">02-10</span>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Tag from '../../Tag.vue';
@Component({
  components: {
    Tag
  }
})
export default class HyCenterInfos extends Vue {
  private data() {
    return {
      datas: []
    };
  }
}
</script>
<style lang="scss" scoped>
.hy-infos {
  height: 100%;
  padding: 0 12px;
  overflow-x: hidden;
  overflow-y: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  &-empty {
    padding: 35% 0 0;
    font-size: 14px;
    color: #999;
    text-align: center;
  }
  .hy-info-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 18px 0 12px;
    border-bottom: 1px dashed #e5e5e5;
    .title,
    .timer {
      margin: 0;
      font-size: 15px;
    }
    .title {
      margin-right: 12px;
      flex: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color: #333;
    }
    .timer {
      color: #999;
    }
  }
  .hy-tag + .hy-tag {
    margin-left: 5px;
  }
}
</style>
