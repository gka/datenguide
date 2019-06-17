<script>
	export let title = '';
</script>

<style>
	.card {
		margin-bottom: 20px;
	}
</style>

<div class="card shadow-sm">
	<div class="card-body">
		<h5 class="card-title">{title}</h5>
		<slot />
	</div>
</div>
