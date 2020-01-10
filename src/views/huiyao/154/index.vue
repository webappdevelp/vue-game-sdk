<template>
  <div class="game-wrapper">
    <iframe
			v-if="game.url !== ''"
			@load="gameInit"
			ref="gameWindow"
			:src="game.url"
			id="gameWindow"
			height="100%"
			width="100%"
			scrolling="auto"
			allowtransparency="true"
			allowfullscreen
			frameborder="0"
			referrerpolicy="unsafe-url"
			:style="iframeStyle">
    </iframe>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { mapState } from 'vuex';

@Component({
  computed: {
    ...mapState('sdk', {
      game: 'game'
    })
  }
})
export default class Channel154 extends Vue {
  private data() {
    return {
      iframeStyle: {}
    }
  }

  // methods
  private gameInit() {
    console.log('game loaded');
  }
}
</script>

<style scoped lang="scss">

</style>