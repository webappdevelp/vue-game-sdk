<template>
  <div class="hy-infos">
    <div v-if="!datas.infos || !datas.infos.length" class="hy-infos-empty">暂无相关资讯哦~</div>
    <template v-else>
      <div
        class="hy-info-item"
        v-for="(item, index) in datas.infos"
        :key="index"
        @click="action(index)">
        <template v-if="!!item.tags">
          <Tag v-for="(tag, id) in item.tags" :key="id" :text="tag.text" :color="tag.color"/>
        </template>
        <span class="title">{{ item.title }}</span>
        <span class="timer">{{ item.date }}</span>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import Tag from '../../Tag.vue';
@Component({
  components: {
    Tag
  }
})
export default class HyCenterInfos extends Vue {
  @Prop({
    type: Object,
    default: () => {
      return {};
    }
  })
  private datas!: object;

  // methods
  @Emit()
  private action(id: number) {
    return {
      action: 'article',
      params: id
    }
  }
}
</script>
<style lang="scss">
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
@media screen and (max-width: 320px) {
  .hy-infos {
    .hy-info-item {
      padding: 14px 0 8px;
      .title,
      .timer {
        font-size: 13px;
      }
    }
  }
}
</style>
