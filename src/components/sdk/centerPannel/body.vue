<template>
  <div class="body">
    <ul class="nav">
      <li
        v-if="!!gifts.length"
        :class="currentPannel === 0 ? 'active' : ''"
        @click="switchPannel(0)">
        <svg-icon icon-class="gift" class-name="icon gift" />
          礼包
      </li>
      <li
        v-if="!!infos.length"
        :class="currentPannel === 1 ? 'active' : ''"
        @click="switchPannel(1)">
        <svg-icon icon-class="info" class-name="icon info" />
          资讯
      </li>
      <li
        v-if="!!infos.length || !!gifts.length"
        :class="currentPannel === 2 ? 'active' : ''"
        @click="switchPannel(2)">
        <svg-icon icon-class="kefu" class-name="icon kefu" />
        {{ nav.name }}
      </li>
    </ul>
    <div class="content">
      <div v-if="currentPannel === 0 && !!gifts.length" class="gift-pannel">
        <div class="gift-item">
          <div>
            <h4>新手礼包</h4>
            <p>大马甲*1，测试女*2，攻击提升*100</p>
          </div>
          <btn class="gift-btn" text="领取" />
        </div>
      </div>
      <div v-if="currentPannel === 1 && !!infos.length" class="info-pannel">
        <div class="info-item">
          <span class="title">打怪升级看这里</span>
          <span class="timer">02/12</span>
        </div>
      </div>
      <div v-show="currentPannel === 2" class="kefu-pannel">
        <img class="kefu-banner" :src="require('@/assets/icons/service.png')" alt="联系客服" />
        <p class="kefu-tel" v-html="kefu.numbers"></p>
        <div class="kefu-qrcode" v-html="kefu.qrcode"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapState } from 'vuex';
import Btn from '@/components/core/btn/index.vue';

@Component({
  components: {
    Btn
  },
  computed: {
    ...mapState('sdk', {
      gifts: (state: any) => state.game.gifts,
      infos: (state: any) => state.game.infos,
      kefu: (state: any) => state.game.kefu
    })
  }
})
export default class CBody extends Vue {
  private data() {
    return {
      navs: [
        { name: '礼包', icon: 'gift' },
        { name: '资讯', icon: 'info' },
        { name: '客服', icon: 'kefu' },
      ],
      currentPannel: 2
    }
  }
  // 切换信息面板
  private switchPannel(id: number) {
    const { currentPannel } = this.$data;
    if (id === currentPannel) {
      return;
    }
    this.$data.currentPannel = id;
  }
}
</script>

<style lang="scss" scoped>
.nav {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  line-height: 1;
  background: #f5f5f5;
  li {
    flex: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 8px 0;
    font-size: 13px;
    color: #666;
  }
  li.active {
    background: #fff;
  }
  li.active,
  li.active .icon {
    color: #ed7321;
  }
  .icon {
    margin-bottom: 3px;
    font-size: 15px;
    display: block;
  }
  .gift {
    color: #f9d993;
  }
  .info {
    color: #B5E6FB;
  }
  .kefu {
    color: #D9C6F7;
  }
}
.content {
  height: calc(100vh - 150px);
  overflow: hidden;
  overflow-y: auto;
  background: #fff;
}
.gift-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 12px 12px 8px;
  border-bottom: 1px solid #f5f5f5;
  overflow: hidden;
  & > div {
    flex: 1;
    min-width: 75%;
    line-height: 1.5;
  }
  h4 {
    margin-bottom: 2px;
    font-size: 13px;
    color: #333;
  }
  p {
    font-size: 12px;
    color: #999;
  }
}
.gift-btn {
  font-size: 12px;
  padding: 11px 0 10px;
  width: 20%;
  margin-left: 5%;
  border-radius: 4px;
}
.info-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 12px 12px 8px;
  border-bottom: 1px solid #f5f5f5;
  span {
    font-size: 12px;
  }
  .title {
    flex: 1;
    color: #333;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .timer {
    color: #999;
  }
}
.kefu-pannel {
  padding: 24px 12px 12px;
  text-align: center;
}
.kefu-banner {
  display: block;
  margin: 0 auto 15px;
  width: 150px;
  height: auto;
}

</style>
<style lang="scss">
.kefu-tel {
  font-size: 13px;
  color: #333;
  font-weight: 700;
  a {
    color: #333;
  }
}
.kefu-qrcode {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  & > img {
    width: 125px;
    height: auto;
  }
  p {
    font-size: 12px;
    color: #999;
    line-height: 1.5;
  }
  strong {
    font-size: 13px;
    color: #333;
  }
}
</style>