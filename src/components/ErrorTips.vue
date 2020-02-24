<template>
  <div class="hy-error">
    <dl class="hy-error-tips">
      <dt><h2>{{ title }}</h2></dt>
      <dd>{{ msg }}~</dd>
      <dd>{{ url }}</dd>
    </dl>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class HyErrorTip extends Vue {
  @Prop({
    type: String,
    default: '404'
  })
  private title!: string;

  @Prop({
    type: String,
    default: '您当前访问的页面不存在哦~'
  })
  private msg!: string;

  @Prop({
    type: String,
    default: location.href
  })
  private url!: string;

  private created() {
    document.title = this.title;
  }

}
</script>
<style lang="scss" scoped>
.hy-error {
  position: absolute;
  top: 8%;
  left: 0;
  right: 0;
  color: #333;
  padding: 0 30px;
  dt h2 {
    font-size: 40px;
    font-weight: 400;
    line-height: 1;
    text-align: center;
  }
  dt {
    margin-bottom: 15px;
  }
  dd {
    color: #666;
    text-align: left;
    font-size: 14px;
    word-break: break-all;
    word-wrap: break-word;
  }
}
</style>
