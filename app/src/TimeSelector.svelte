<script>

    import range from 'lodash-es/range';

    const options = [{
        id: 'all',
        title: 'alle vorhandenen Jahre'
    }, {
        id: 'single',
        title: 'einzelne Jahre'
    },{
        id: 'range',
        title: 'von ... bis ...'
    }];

    const id = Math.round(Math.random()*1e7).toString(36);

    export let mode = 'all';
    let singleValues = [];
    let singleTime = '';
    let rangeFrom = '';
    let rangeTo = '';


    export let values;
    $: values = mode === 'single' ? singleValues :
        mode === 'range' ? range(Number(rangeFrom), Number(rangeTo)+1) :
        [];

    function addTime(){
        singleValues.push(singleTime);
        singleTime = '';
        singleValues = singleValues;
    }

    function removeTime(index) {
        singleValues.splice(index, 1);
        singleValues = singleValues;
    }
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
    {#if singleValues.length}
    <ul>
        {#each singleValues as val,i}
        <li>
            {val}
            <a class="text-danger" href="#delete" on:click|preventDefault="{() => removeTime(i)}"><span class="oi oi-trash"></span></a>
        </li>
        {/each}
    </ul>
    {/if}
    <input
        bind:value={singleTime}
        class="form-control"
        placeholder="2015"
        type="text" style="width: 5em" />
    <button
        style="margin-top:10px"
        on:click={addTime}
        class="btn btn-outline-primary">Gewähltes Jahr hinzufügen</button>

    {:else if option.id === 'range' && mode === 'range'}
    <div class="form-inline">
        von <input
            bind:value={rangeFrom}
            class="form-control"
            placeholder="2000"
            type="text"
            style="width: 5em" />
        bis <input
            bind:value={rangeTo}
            class="form-control"
            placeholder="2010"
            type="text"
            style="width: 5em" />
    </div>
    {/if}
</div>
{/each}
