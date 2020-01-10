import { Vue, Component } from 'vue-property-decorator';

@Component
export default class ResetFontSize extends Vue {
  public data() {
    return {
      wrapperStyle: {
        fontSize: '100px'
      }
    };
  }
  public resetFontSize() {
    const appWrapper = document.getElementById('app');
    if (appWrapper) {
      let screenWidth = appWrapper.clientWidth;
      screenWidth = screenWidth > 414 ? 414 : screenWidth;
      const fontSize = (screenWidth / 375) * 100;
      this.$data.wrapperStyle = {
        fontSize: `${fontSize}px`
      };
    }
  }
}
