<template>
	<div id="game-docker">
		<div style="display: none">
			<img :src="game.kefu.wxqrcode" alt="二维码" />
		</div>
		<login :show="showLoginPannel" :sdk-options="sdkOptions" />
		<fast-result :sdk-options="sdkOptions" />
		<auth-verify :sdk-options="sdkOptions" />
		<drag
			v-if="logined"
			:wrapper-style="dragStyle"
			:sdk-options="sdkOptions"
			@change="changeGameIframeStyle"
			@click="openCenter"
		/>
		<ad-drag :sdk-options="sdkOptions" @change="changeGameIframeStyle" />
		<center :show.sync="showCenter" :sdk-options="sdkOptions" />
		<pay-pannel :sdk-options="sdkOptions" />
		<retain :sdk-options="sdkOptions" />
		<iframe
			v-if="game.url !== ''"
			@load="initMessager"
			ref="messager"
			:src="game.url"
			id="game-window"
			height="100%"
			width="100%"
			scrolling="auto"
			allowtransparency="true"
			allowfullscreen
			frameborder="0"
			referrerpolicy="unsafe-url"
			:style="gameIframeStyle"
		>
		</iframe>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import { mapGetters, mapState } from 'vuex';
import sdkCommon from '@/mixins/sdkCommon';
import sdkMessager from '@/mixins/sdkMessager';
import sdkApi from '@/mixins/sdkApi';
import Login from '@/components/sdk/login.vue';
import FastResult from '@/components/sdk/fastResult.vue';
import Center from '@/components/sdk/centerPannel/index.vue';
import Drag from '@/components/sdk/drag.vue';
import AdDrag from '@/components/sdk/adDrag.vue';
import PayPannel from '@/components/sdk/payPannel.vue';
import AuthVerify from '@/components/sdk/authVerify.vue';
import Retain from '@/components/retain.vue';

@Component({
	components: {
		Login,
		FastResult,
		Drag,
		AdDrag,
		Center,
		AuthVerify,
		PayPannel,
		Retain
	},
	computed: {
    ...mapState('sdk', {
      game(state: any) {
        return state.game;
      },
      showLoginPannel(state: any) {
				const { step, userId } = state.user;
				switch(step) {
					case 'logined':
						this.$data.showLogin = false;
						userId && this.sendMessage({
							action: 'loginSuccess',
							datas: this.$store.getters['sdk/sdkUserInfo']
						});
						break;
					case 'updated':
						userId && this.sendMessage({
							action: 'update',
							datas: this.$store.getters['sdk/sdkUserInfo']
						});
						break;
					case 'logOut':
						this.$data.showLogin = true;
						this.sendMessage({
							action: 'logOut'
						});
						break;
				}
        return this.$data.showLogin; 
			},
    }),
		...mapGetters('sdk', ['logined'])
	}
})
export default class Huiyao extends Mixins(sdkCommon, sdkMessager, sdkApi) {
	public data() {
		return {
      sdkOptions: {},
      showLogin: false,
			showCenter: false,
			dragStyle: {
				top: '20%',
				right: '-10px',
				width: '45px',
				height: '45px',
				backgroundImage: `url(${require('@/assets/sdk/hy_control.png')}`
			},
			gameIframeStyle: {
        borderWidth: 0,
				borderColor: 'transparent',
				borderStyle: 'none',
				background: 'transparent',
				pointerEvents: 'auto'
      }
		};
	}

  // methods
  // 打开个人中心面板
	private openCenter() {
		this.$data.showCenter = true;
	}

	public async created() {
		const wxAuthed = await this.wxAuth();
		// 假如是微信内，则需等待微信授权后再往下走
		if (wxAuthed === true) {
			this.initSdkOptions({ startOrigin: 'sz' });
			this.initDragStyle();
			// 防止微信内未获取到设备号就先注册了，所以需要先获取设备号成功后再往下走
			const initSuccess = await this.deviceInit();
			if (initSuccess === true) {
				this.getStorageUserInfo();
			}
			await this.getGame();
			this.setPageShare();
		}
	}
}
</script>

<style lang="scss">
html,
body,
#app {
  height: 100%;
}
</style>
<style lang="scss" scoped>
#game-docker,
#game-window {
	position: relative;
	height: 100%;
	width: 100%;
	overflow: hidden;
}
</style>