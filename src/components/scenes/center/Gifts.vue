<template>
  <div class="hy-gifts">
    <div class="hy-gifts-empty">
      暂无礼包相关信息哦~
    </div>
    <template v-if="!!datas.length">
      <div class="hy-gift-item">
        <div>
          <h3>大天使之剑H5新手礼包</h3>
          <p>礼包内容：灵魂宝石*3 ，祝福宝石*10，玛雅宝石*1 ，2倍经验药水*1，钻石*50</p>
        </div>
        <btn text="领取" />
      </div>
      <div class="hy-gift-item">
        <div>
          <h3>大天使之剑H5新手礼包</h3>
          <p>礼包内容：灵魂宝石*3 ，祝福宝石*10，玛雅宝石*1 ，2倍经验药水*1，钻石*50</p>
        </div>
        <btn text="领取" />
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Btn from '../../Btn.vue';
@Component({
  components: {
    Btn
  }
})
export default class HyCenterGifts extends Vue {
  private data() {
    return {
      datas: []
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
      padding-left: 20px;
      margin-bottom: 5px;
      font-size: 14px;
      line-height: 1.5;
      color: #333;
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        width: 15px;
        height: 15px;
        background: url('../../../assets/scenes/center/icon-game-gift.png')
          center no-repeat;
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
</style>
