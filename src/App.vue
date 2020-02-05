<template>
	<div id="app">
		<router-view />
		<loading />
		<msg />
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Loading from '@/components/core/loading/index.vue';
import Msg from '@/components/core/msg/index.vue';

@Component({
	components: {
		Loading,
		Msg
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
