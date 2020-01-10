<template>
  <hy-dialog :show="show" z-index="20">
    <template slot-scope="scope">
      <div class="select" :style="scope.scope.frontStyle">
        <span class="close" @click="handler('close')"></span>
        <span class="btn" @click="handler('submit')"></span>
        <select name="zones" @change="zoneChange">
          <option value="">请选择区服</option>
          <option
            v-for="opt in datas.zones"
            :key="opt"
            :selected="datas.zone_id === opt"
            :value="opt"
          >
            {{ opt }}
          </option>
        </select>
        <select name="roles" @change="roleChange">
          <option value="">请选择角色</option>
          <option
            v-for="opt in datas.roles"
            :key="opt.id"
            :selected="datas.role_id === opt.id"
            :value="opt.id"
          >
            {{ opt.name }}
          </option>
        </select>
      </div>
    </template>
  </hy-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import HyDialog from '@/components/Dialog.vue';

@Component({
  components: {
    HyDialog
  }
})
export default class SelectDialog extends Vue {
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
  private handler(action: string) {
    this.$emit('btn-action', action);
  }
  private zoneChange(event: any) {
    this.$emit('zone-change', event.target.value);
  }
  private roleChange(event: any) {
    this.$emit('role-change', event.target.value);
  }
}
</script>

<style lang="scss" scoped>
.hy-dialog {
  font-size: inherit;
}
.select {
  top: 50%;
  left: 0;
  right: 0;
  width: 3.42em;
  height: 2.29em;
  margin: 0 auto;
  padding: 0.63em 0.54em 0.3em 1.3em;
  box-sizing: border-box;
  background: url('../../../assets/games/1019/select-bg.png') top center
    no-repeat;
  background-size: contain;
  transform: translate(0, -50%);
  select {
    display: block;
    width: 100%;
    -webkit-appearance: none;
    font-size: 0.14em;
    line-height: 1.5;
    color: #fff;
  }
  select + select {
    margin-top: 1.6em;
  }
}
.close {
  position: absolute;
  z-index: 2;
  top: 0.04em;
  right: 0;
  width: 0.32em;
  height: 0.32em;
  cursor: pointer;
}
.btn {
  position: absolute;
  z-index: 2;
  left: 1.09em;
  bottom: 0.3em;
  width: 1.225em;
  height: 0.375em;
  cursor: pointer;
}
@media screen and (max-width: 320px) {
  .select select {
    line-height: 1.5;
  }
  .select select + select {
    margin-top: 1.4em;
  }
}
</style>
