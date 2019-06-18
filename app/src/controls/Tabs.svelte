<script>
	export let tabs = [];
	export let selected = null;
</script>

<ul class="nav nav-tabs">
	{#each tabs as tab}
    <li class="nav-item">
        <a class="nav-link"
        	on:click|preventDefault="{() => selected = tab.id}"
        	class:active={selected === tab.id}
        	href="#${tab.id}">{tab.title}</a>
    </li>
    {/each}
</ul>
