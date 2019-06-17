<script>
	export let title = '';
	export let noBorderTop = false;
</script>

<style>
	.card {
		margin-bottom: 20px;
	}
</style>

<div class:rounded-0={noBorderTop} class:border-top-0={noBorderTop} class="card">
	<div class="card-body">
		<h5 class="card-title">{title}</h5>
		<slot />
	</div>
</div>
