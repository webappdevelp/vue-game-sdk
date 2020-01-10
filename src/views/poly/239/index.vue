<template>
	<section class="poly">
		<iframe
			v-if="gameDatas.link !== ''"
			@load="gameInit"
			ref="gameWindow"
			:src="gameDatas.link"
			id="gameWindow"
			height="100%"
			width="100%"
			scrolling="auto"
			allowtransparency="true"
			allowfullscreen
			frameborder="0"
			:style="iframeStyle"
		></iframe>
	</section>
</template>
<script lang="ts">
// 火箭-H5融合sdk
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';
import pageCommonMix from '../mixins/pageCommon';
import loadJS from '@/utils/ts/loadJS';
import { getCookie } from '@/utils/ts/cookies';
import { post } from '@/utils/ts/fetch';
let hyPSMSource: any = null;
let postInterval: any = null;
let wan511SDK: any = null;

@Component
export default class Poly extends Mixins(pageCommonMix) {
	@Prop({
		type: Object,
		default: () => {}
	})
	private datas!: {
		hy_gid: string;
		hy_channel_id: string;
		aid: string;
		start_origin: string;
		ptid: string;
		gid: string;
	};

	private data() {
		return {
			sdkOptions: {
				app_id: '',
				app: '',
				channel_id: '',
				channel: '',
				aid: '0',
				deviceId: '',
				start_origin: ''
			},
			userInfo: {
				hyUid: '',
				channelUserId: '',
				channelUserName: '',
				userId: '',
				token: '',
				openid: '',
				mobile: ''
			},
			iframeStyle: {
				borderWidth: 0,
				borderColor: 'transparent',
				borderStyle: 'none',
				background: 'transparent',
				pointerEvents: 'auto'
			},
			gameDatas: {
				link: ''
			}
		};
	}
	// 获取页面初始化信息
	private async getInitData() {
		const { sdkOptions, gameDatas } = this.$data;
		let { device_type } = this.$data;
		device_type = device_type || '';
		try {
			const result = await this.getPageDatas();
			if (result) {
				const { cp_url, json_param } = result;
				document.title = (json_param && json_param.title) || '';
				this.$data.gameDatas = {
					...gameDatas,
					...json_param,
					link:
						cp_url.indexOf('?') >= 0
							? `${cp_url}&device_type=${device_type}`
							: `${cp_url}?device_type=${device_type}`
				};
			}
		} catch (err) {
			this.updateToast(err && err.message);
		}
	}
	// 游戏载入后初始化通信
	private async gameInit() {
		hyPSMSource = (this.$refs.gameWindow as HTMLIFrameElement).contentWindow;
		// 设备初始化
		await this.deviceInit('//u9php.gaoruifa.cn/u9/init');
		// sdk 之间初始化通信
		const _self = this;
		postInterval = setInterval(() => {
			_self.postMessage({
				action: 'init'
			});
		}, 800);
	}
	// sdk通信连接
	private postMessage(params: { action: string; datas?: any }) {
		if (hyPSMSource) {
			hyPSMSource.postMessage(JSON.stringify(params), '*');
		} else {
			console.log('初始时，通信连接失败，正尝试重新连接');
		}
	}
	// 接收cpsdk消息，并根据消息行为进行其他操作
	private async dispatchMessage(e: MessageEvent) {
		const { origin, data } = e;
		if (origin === window.location.origin || typeof data === 'object') {
			return;
		}
		let cpDatas = JSON.parse(data || 'null');
		cpDatas = cpDatas || {};
		const { action, datas } = cpDatas;

		if (action) {
			console.log(`${action}：hyCpSDK -> hySDK successed`);
			switch (action) {
				case 'blur':
					if (document.scrollingElement) {
						document.scrollingElement.scrollIntoView({
							behavior: 'smooth',
							block: 'start'
						});
					}
					window.MKSDK.focusout();
					break;
				case 'initSuccess':
					clearInterval(postInterval);
					postInterval = null;
					break;
				case 'login':
					this.sdkLogin();
					break;
				case 'cpReport':
					this.sdkReport({
						...datas
					});
					break;
				case 'pay':
					const result = await this.requestPay({
						productOrderId: datas.productOrderId,
						amount: datas.amount,
						callbackUrl: datas.callbackUrl,
						appExt: datas.appExt
					});
					const { Code, OrderId } = result;
					if (Code === 0) {
						const payParams = { ...datas };
						payParams.orderId = OrderId;
						this.sdkPay(payParams);
					} else {
						this.postMessage({
							action: 'payFail'
						});
					}
					break;
			}
		}
	}
	// 登录
	private async requestLogin({ pid, gid }: { pid: string; gid: string }) {
		this.updateLoading(true);
		const { sdkOptions, userInfo } = this.$data;
		const deviceImei = JSON.parse(getCookie('device') || '{}');
		const storageImei = (deviceImei && deviceImei.imei) || '';
		let users = { ...userInfo };
		try {
			const result = await post('//u9php.gaoruifa.cn/login/loginRequest', {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				datas: {
					productId: sdkOptions.app,
					channelId: sdkOptions.channel,
					aid: sdkOptions.aid,
					token: userInfo.token,
					deviceId: sdkOptions.deviceId,
					mobileInfo: JSON.stringify({ imei: storageImei }),
					ext: JSON.stringify({ pid, gid }),
					channelUserId: userInfo.channelUserId || '',
					channelUserName: userInfo.channelUserName || ''
				}
			});
			const { Code, Ext, UserId } = result;
			if (Code === 0) {
				const { data } = Ext;
				const { channel_userid, channel_username, puid } = data;
				this.$data.userInfo = {
					...userInfo,
					hyUid: channel_userid,
					channelUserId: channel_userid,
					channelUserName: channel_username || channel_userid,
					userId: UserId
				};
				users = this.$data.userInfo;
			}
			this.updateLoading(false);
		} catch (err) {
			this.updateLoading(false);
			this.updateToast(err && err.message);
		}
		return users;
	}
	// 支付
	private async requestPay({
		productOrderId,
		amount,
		callbackUrl,
		appExt
	}: {
		productOrderId: string;
		amount: string;
		callbackUrl: string;
		appExt: string;
	}) {
		this.updateLoading(true);
		const { sdkOptions, userInfo } = this.$data;
		let result: any = {};
		try {
			result = await post('//u9php.gaoruifa.cn/payRequest/payRequest', {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				datas: {
					userId: userInfo.userId,
					deviceId: sdkOptions.deviceId,
					productId: sdkOptions.app,
					channelId: sdkOptions.channel,
					aid: sdkOptions.aid,
					payChannel: '',
					productOrderId,
					amount,
					callbackUrl,
					appExt
				}
			});
			this.updateLoading(false);
		} catch (err) {
			this.updateLoading(false);
			this.updateToast(err && err.message);
		}
		return result;
	}
	// sdk登录
	private sdkLogin() {
		window.MKSDK.login();
	}
	// sdk report
	private sdkReport(params: {
		cpAction: string;
		serverId: string;
		serverName: string;
		roleId: string;
		roleName: string;
		level: number;
		vip: number;
		partyName: string;
		balance: string;
		roleCreateTime: number;
		roleUpgradeTime: number;
	}) {
		const { cpAction } = params;
		const reportParams = {
			...params,
			roleLevel: params.level || 0,
			vipLevel: params.vip || 0,
			balance: params.balance || '0',
			partName: params.partyName || '',
			roleCTime: params.roleCreateTime,
			roleUTime: params.roleUpgradeTime
		};
		switch (cpAction) {
			case 'create':
				window.MKSDK.createRole(reportParams, (res: any) => console.log(res));
				break;
			case 'enter':
				window.MKSDK.entergame(reportParams, (res: any) => console.log(res));
				break;
			case 'upgrade':
				window.MKSDK.roleLevelUp(reportParams, (res: any) => console.log(res));
				break;
		}
	}
	// 设置接口回调
	private listenEventCallBack() {
		window.MKSDK.bind('MKSDK_LOGIN_SUCCESS', async (data: any) => {
			const { token, ptid, gid } = data;
			if (token) {
				const { userInfo, sdkOptions } = this.$data;
				this.$data.userInfo = {
					...userInfo,
					token
				};
				const user = await this.requestLogin({
					pid: ptid,
					gid
				});
				this.postMessage({
					action: 'loginSuccess',
					datas: {
						...user
					}
				});
			} else {
				this.updateToast('登录失败, 请重新登录');
			}
		});
		window.MKSDK.bind('MKSDK_PAY_SUCCESS', (data: any) => {
			alert(JSON.stringify(data));
		});
	}
	// sdk pay
	private sdkPay(params: {
		orderId: string;
		amount: number;
		appExt: string;
		productName: string;
		serverId: number;
		serverName: string;
		roleId: number;
		roleName: string;
		level: number;
		vip: number;
		balance: string;
	}) {
		try {
			const { gameDatas } = this.$data;
			window.MKSDK.pay({
				cpId: params.orderId,
				productName: params.productName || '',
				price: Number(params.amount) / 100,
				coinName: gameDatas.coinName || '元宝',
				ratio: Number(gameDatas.ratio) || 100,
				cpExt: params.appExt || params.orderId,
				serverId: params.serverId || '1',
				serverName: params.serverName || params.serverId || '',
				roleId: params.roleId || '',
				roleName: params.roleName || params.roleId || '',
				roleLevel: params.level || 1,
				balance: params.balance || 0,
				vipLevel: params.vip || 1
			});
		} catch (err) {
			this.updateToast(err && err.message);
		}
	}
	private async created() {
		try {
			window.addEventListener('message', this.dispatchMessage);
			const { sdkOptions, userInfo } = this.$data;
			const { hy_gid, hy_channel_id, aid, start_origin } = this.datas;
			this.$data.sdkOptions = {
				...sdkOptions,
				app_id: hy_gid,
				app: hy_gid,
				channel_id: hy_channel_id,
				channel: hy_channel_id,
				aid: aid || '0',
				start_origin
			};
			await loadJS('//xingyunddz.com/h5/lib.js');
			this.listenEventCallBack();
			this.getInitData();
		} catch (err) {
			this.updateToast((err && err.message) || '渠道SDK加载失败');
			setTimeout(() => {
				window.location.reload();
			}, 3000);
		}
	}
	private mounted() {
		// this.init();
	}
}
</script>
<style>
html,
body,
#app,
.poly {
	height: 100%;
}
</style>

<style lang="scss" scoped>
.poly,
#gameWindow {
	width: 100%;
	overflow: hidden;
}
.btn {
	position: fixed;
	z-index: 100;
	top: 50%;
	left: 0;
	right: 0;
	width: 50%;
	margin: 0 auto;
	height: 35px;
	line-height: 35px;
	font-size: 14px;
	color: #fff;
	background: #409eff;
	text-align: center;
}
</style>
