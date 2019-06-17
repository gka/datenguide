<script>

    const options = [{
        id: 'all',
        title: 'alle vorhandenen Jahre'
    }, {
        id: 'single',
        title: 'einzelnes Jahr'
    },{
        id: 'range',
        title: 'von ... bis ...'
    }];

    const id = Math.round(Math.random()*1e7).toString(36);

    export let mode = 'all';


</script>

<style>
    .ctrls {
        margin-top: 5px;
        margin-bottom: 10px;
    }

</style>

{#each options as option,i}
<div class="custom-control custom-radio">
    <input
        bind:group={mode}
        value={option.id}
        type="radio"
        id="{id}{i}"
        name="{id}"
        class="custom-control-input"
    >
    <label class="custom-control-label" for="{id}{i}">{@html option.title}</label>
    {#if option.id === 'single' && mode === 'single'}
    <input class="form-control" type="text" style="width: 5em" />
    {:else if option.id === 'range' && mode === 'range'}
    <br>von <input class="form-control form-inline" type="text" style="width: 5em" /> bis
    <input class="form-control form-inline" type="text" style="width: 5em" />
    {/if}
</div>
{/each}
