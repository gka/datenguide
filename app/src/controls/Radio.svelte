<script>
    export let options = [];
    export let value = '';
    export let inline = false;

    const id = Math.round(Math.random()*1e7).toString(36);

</script>

{#each options as option,i}
<div class="custom-control custom-radio"
class:custom-control-inline={inline}>
    <input
        bind:group={value}
        value={option.id}
        type="radio"
        id="{id}{i}"
        name="{id}"
        class="custom-control-input"
    >
    <label class="custom-control-label" for="{id}{i}">{option.title}</label>
</div>
{/each}
