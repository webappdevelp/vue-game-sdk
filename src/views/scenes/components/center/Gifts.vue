<template>
  <div class="hy-gifts">
    <div v-if="!datas.gifts || !datas.gifts.length" class="hy-gifts-empty">暂无礼包相关信息哦~</div>
    <template v-else>
      <div
        class="hy-gift-item"
        v-for="(item, index) in datas.gifts"
        :key="index"
      >
        <div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.desc }}</p>
        </div>
        <btn
          :text="item.status === 1 ? '查看' : '领取'"
          @click="action(item.id)"
        />
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import Btn from '@/components/Btn.vue';
@Component({
  components: {
    Btn
  }
})
export default class HyCenterGifts extends Vue {
  @Prop({
    type: Object,
    default: () => {
      return {};
    }
  })
  private datas!: object;

  // methods
  @Emit()
  private action(id: string) {
    return {
      action: 'gift',
      params: id
    };
  }
}
</script>
<style lang="scss" scoped>
.hy-gifts {
  padding: 0 12px;
  height: 100%;
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
  .hy-gift-item {
    position: relative;
    padding: 12px 0 8px;
    border-bottom: 1px solid #f4f4f4;
    overflow: hidden;
    div {
      width: 75%;
    }
    h3 {
      position: relative;
      padding-left: 16px;
      margin-bottom: 5px;
      font-size: 14px;
      line-height: 1.5;
      color: #333;
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        width: 12px;
        height: 12px;
        background: url('../../../../assets/scenes/center/icon-game-gift.png') center no-repeat;
        background-size: contain;
        transform: translate3d(0, -50%, 0);
      }
    }
    p {
      line-height: 1.5;
      font-size: 12px;
      color: #999;
    }
    .hy-btn {
      position: absolute;
      top: 18px;
      right: 0;
      width: 65px;
      max-width: 65px;
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      border-radius: 4px;
    }
  }
}
@media screen and (max-width: 320px) {
  .hy-gifts {
    .hy-gift-item {
      div {
        width: 72%;
      }
      h3 {
        font-size: 13px;
      }
    }
  }
}
</style>
