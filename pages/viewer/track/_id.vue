<template>
	<h1>{{ track_id }}</h1>
</template>

<script>
	export default {
		computed: {
			track_id() {
				return this.$route.params.id
			}
		},
	}
</script>