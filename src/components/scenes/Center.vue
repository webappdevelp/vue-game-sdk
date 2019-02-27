<template>
  <hy-dialog :show="show" animate="left" z-index="30" @close="hide">
    <template slot-scope="scope">
      <div class="hy-center" :style="scope.scope">
        <center-header :datas="userDatas" @action="action" />
        <ul class="hy-center-current">
          <li>
            <p>您正在玩：{{ gameDatas.name }}</p>
          </li>
        </ul>
        <div class="hy-center-body">
          <menus :current.sync="currentTab"/>
          <div class="center-info-box">
            <gifts v-if="currentTab === 1"/>
            <infos v-else-if="currentTab === 2"/>
            <kefu v-else @action="action"/>
          </div>
        </div>
        <div class="hy-center-control">
          <a href="javascript:;" @click="hide">
            <icon name="back"/>
          </a>
          <a href="javascript:;" @click="refresh">
            <icon name="refresh__b"/>刷新游戏
          </a>
        </div>
      </div>
    </template>
  </hy-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import HyDialog from '../Dialog.vue';
import CenterHeader from './center/Header.vue';
import Menus from './center/Menus.vue';
import Gifts from './center/Gifts.vue';
import Infos from './center/Infos.vue';
import Kefu from './center/Kefu.vue';
import Icon from '../Icon.vue';
@Component({
  components: {
    HyDialog,
    CenterHeader,
    Menus,
    Gifts,
    Infos,
    Kefu,
    Icon
  }
})
export default class HyScenesCenter extends Vue {
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
  private userDatas!: object;
  @Prop({
    type: Object,
    default: () => {
      return {};
    }
  })
  private gameDatas!: object;

  private data() {
    return {
      currentTab: 1
    };
  }

  // methods
  @Emit()
  private action(params: { action: string; params: any}) {
    return params;
  }
  private hide() {
    this.$emit('update:show', false);
  }
  private refresh() {
    window.location.reload();
  }
}
</script>
<style lang="scss" scoped>
.hy-center {
  top: 0;
  bottom: 0;
  left: 0;
  width: 85%;
  background: #fff;
}
.hy-center-current {
  padding: 0 12px;
  background: url('../../assets/scenes/center/gl-panel-server.jpg') center no-repeat;
  background-size: 100% auto;
  li {
    padding: 10px 0;
    font-size: 15px;
    color: #333;
  }
}
.center-info-box {
  height: calc(100vh - 159px);
}
.hy-center-control {
  position: absolute;
  right: -28px;
  top: 50%;
  transform: translate3d(0, -50%, 0);
  a {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    min-height: 78px;
    width: 28px;
    padding: 10px 0;
    border-radius: 0 5px 5px 0;
    box-sizing: border-box;
    background: #f5f6f7;
    overflow: hidden;
    .hy-icon {
      width: 18px;
      height: 18px;
    }
    .hy-icon-back {
      margin-right: -10px;
    }
  }
  a + a {
    margin-top: 20px;
    color: #926b43;
    word-break: break-all;
    writing-mode: vertical-lr;
    background: #f5dec6;
  }
}
</style>
