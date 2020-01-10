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
// 火箭-多点通渠道
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';
import pageCommonMix from '../mixins/pageCommon';
import loadJS from '@/utils/ts/loadJS';
import { isObject } from '@/utils/ts/types';
let hyPSMSource: any = null;
let postInterval: any = null;

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
		app_id: string;
		mem_id: string;
		user_token: string;
		sign: string;
		agent_id: string;
		start_origin: string;
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
							? `${cp_url}&device_type=${device_type}&origin=${window.location.hostname}`
							: `${cp_url}?device_type=${device_type}&origin=${window.location.hostname}`
				};
			}
		} catch (err) {
			this.updateToast(err && err.message);
		}
	}
	// 游戏载入后初始化通信
	private async gameInit() {
		hyPSMSource = (this.$refs.gameWindow as HTMLIFrameElement).contentWindow;
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
		if (origin === window.location.origin) {
			return;
		}
		try {
			let cpDatas = isObject(data) ? data : JSON.parse(data || null);
			cpDatas = cpDatas || {};
			const { action, datas } = cpDatas;
			if (action) {
				const { sdkOptions, userInfo } = this.$data;
				console.log(`${action}：hyCpSDK -> hySDK successed`);
				switch (action) {
					case 'blur':
						if (document.scrollingElement) {
							document.scrollingElement.scrollIntoView({
								behavior: 'smooth',
								block: 'start'
							});
						}
						break;
					case 'initSuccess':
						clearInterval(postInterval);
						postInterval = null;
						break;
					case 'login':
						await this.sdkLogin();
						break;
					case 'roleReport':
						this.roleReport({
							...datas
						});
						break;
					case 'cpReport':
						this.sdkReport({
							...datas
						});
						break;
					case 'pay':
						const result = await this.payRequest({
							productOrderId: datas.productOrderId,
							amount: datas.amount,
							productDesc: datas.productDesc,
							productName: datas.productName,
							callbackUrl: datas.callbackUrl,
							appExt: datas.appExt,
							serverId: datas.serverId,
							roleId: datas.roleId,
							level: datas.level,
							goodsId: datas.goodsId
						});
						const { status, data } = result;
						if (status === 0) {
							const { ext, order_id } = data;
							let payParams = JSON.parse(JSON.stringify(ext && ext[0]));
							payParams.order_id = order_id || '';
							this.sdkPay({ ...datas, ...payParams });
						} else {
							this.postMessage({
								action: 'payFail'
							});
						}
						break;
				}
			}
		} catch (err) {
			console.log(err && err.message);
		}
	}
	// sdk report
	private sdkReport(params: {
		cpAction: string | number;
		isNew: number;
		roleCreateTime: number;
		serverId: number;
		serverName: string;
		roleId: number;
		roleName: string;
		roleBalance: string;
		vip: number;
		level: number;
		partyId: number;
		partyName: string;
		onlineTime: number;
	}) {
		window.HuoSdk.uprole({
			'role-event': params.cpAction,
			'role-server_id': params.serverId || '',
			'role-server_name': params.serverName || '',
			'role-role_id': params.roleId || '',
			'role-role_name': params.roleName || '',
			'role-role_level': params.level || 0,
			'role-role_vip': params.vip || 0
		});
	}
	// sdk pay
	private sdkPay(params: any) {
		try {
			const { gameDatas } = this.$data;

			window.HuoSdk.pay({
				'order-currency': gameDatas.CURRENCY || 'CNY',
				'order-cp_order_id': params.order_id,
				'order-product_price': params.amount,
				'order-product_id': params.goodsId,
				'order-product_name': params.productName || '',
				'order-product_desc': params.productDesc || '',
				'order-ext': params.ext || '{}',
				'role-event': 5,
				'role-server_id': params.serverId || '',
				'role-server_name': params.serverName || '',
				'role-role_id': params.roleId || '',
				'role-role_name': params.roleName || '',
				'role-role_level': params.level || 0,
				'role-role_vip': params.vip || 0
			});
		} catch (err) {
			this.updateToast(err && err.message);
		}
	}
	// sdk登录
	private async sdkLogin(res?: any) {
		if (!this.datas.mem_id) {
			return window.HuoSdk.login();
		}
		const loginInfo = res || this.datas;
		const { mem_id, user_token } = loginInfo;
		const { userInfo, sdkOptions } = this.$data;
		this.$data.userInfo = {
			...userInfo,
			hyUid: mem_id,
			channelUserId: mem_id,
			channelUserName: mem_id || '',
			token: user_token
		};
		this.$data.sdkOptions = {
			...sdkOptions,
			imei: `duodiant_${mem_id}`
		};
		await this.deviceInit();
		const user = await this.loginRequest({
			...this.datas,
			...loginInfo
		});
		this.postMessage({
			action: 'loginSuccess',
			datas: {
				...user
			}
		});
	}
	// 设置接口回调
	private listenEventCallBack() {
		window.HuoSdk.callback = {
			init: (res: any) => {
				console.log(`sdk init result: ${JSON.stringify(res)}`);
			},
			login: async (res: any) => {
				const { status, msg, mem_id, user_token } = res;
				if (status === 2) {
					await this.sdkLogin(res);
				} else {
					this.updateToast(msg || 'SDK登录失败');
				}
			},
			pay: (res: any) => {
				const { status, msg } = res;
				if (status === 2) {
					this.postMessage({
						action: 'paySuccess'
					});
				} else {
					this.postMessage({
						action: 'payFail'
					});
				}
			},
			uprole: (res: any) => {},
			logout: (res: any) => {
				this.postMessage({
					action: 'logOut'
				});
			}
		};
	}
	private async created() {
		try {
			window.addEventListener('message', this.dispatchMessage);
			const { sdkOptions, userInfo } = this.$data;
			const { hy_gid, hy_channel_id, aid, start_origin, app_id } = this.datas;
			const sdkUrl = '//static.duodianpay.com/h5sdk/js/huosdk.js';
			await loadJS(sdkUrl);
			this.$data.sdkOptions = {
				...sdkOptions,
				app_id: hy_gid,
				app: hy_gid,
				channel_id: hy_channel_id,
				channel: hy_channel_id,
				aid: aid || '0',
				start_origin
			};
			this.listenEventCallBack();
			// 渠道sdk初始化
			app_id && window.HuoSdk.init({ app_id });
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
