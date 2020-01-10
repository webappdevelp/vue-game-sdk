<template>
	<div id="app">
		<router-view />
		<loading :show="loading" />
		<toast :show.sync="toast.show" :msg="toast.msg" :time="toast.time" />
		<new-loading />
		<msg />
	</div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from 'vue-property-decorator';
import Loading from '@/components/Loading.vue';
import Toast from '@/components/Toast.vue';
import NewLoading from '@/components/core/loading/index.vue';
import Msg from '@/components/core/msg/index.vue';
import { mapState } from 'vuex';

@Component({
	components: {
		Loading,
		Toast,
		NewLoading,
		Msg
	},
	computed: {
		...mapState(['toast', 'loading'])
	}
})
export default class App extends Vue {
	private data() {
		return {};
	}

	@Watch('$route', { deep: true })
	setDocumentTitle() {
		const { meta } = this.$route;
		if (meta.title) {
			document.title = meta.title;
		}
	}

	// lifecycles
	private errorCaptured(err: Error, vm: Comment, info: string) {
		console.log(err, vm, info);
	}
}
</script>
<style lang="scss">
@import '@/utils/sass/_reset.scss';
#app {
	width: 100%;
	min-height: 100%;
	overflow: hidden;
}
</style>
