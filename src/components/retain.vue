<template>
  <msg-box
    title="温馨提示"
    :show.sync="show"
    :cancel-btn="{ style: { color: 'rgba(0, 122, 255, .65)' }, text: '残忍离开' }"
    :ok-btn="{ style: { color: '#007aff' }, text: '再玩会儿' }"
    @close="hideRetain"
    @cancel="goBack"
    @ok="hideRetain"
  >
    <template slot="body">
      <div class="content">
        <p>扫描二维码关注“{{ game.kefu.wxname || game.name }}”公众号, 获取更多内容, 有快速进入游戏的入口哦~</p>
        <img class="qrcode" :src="game.kefu.wxqrcode" alt="二维码" />
      </div>
    </template>
  </msg-box>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { mapState } from 'vuex';
import MsgBox from '@/components/core/msgBox/index.vue';

@Component({
  components: {
    MsgBox
  },
  computed: {
    ...mapState('sdk', {
      game(state: any) {
        return state.game;
      }
    })
  }
})
export default class Retain extends Vue {
  @Prop({
    type: Object,
    default: () => ({})
  })
  private sdkOptions!: { [propName: string]: any };

  private data() {
    return {
      show: false
    }
  }

  // methods
  private hideRetain() {
    this.$data.show = false;
  }

  // 返回上一页
  private goBack() {
    window.history.back();
  }

  private created() {
    const { query } = this.$route;
    const { wl } = query;
    if (!!wl) {
      window.history.pushState(null, '', '#');
      window.addEventListener('popstate', () => {
        this.$data.show = true;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.qrcode {
  display: block;
  width: 100%;
  max-width: 50%;
  height: auto;
  min-height: 138px;
  margin: 5px auto 0;
}
</style>