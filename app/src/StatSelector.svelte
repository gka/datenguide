<script>
    import SelectStatistik from './controls/SelectStatistik.svelte';
    import SelectMerkmal from './controls/SelectMerkmal.svelte';

    let statistik = null;
    let merkmal = null;
    let merkmalArg = null;
    let merkmalArgValue = null;

    export let values = [];
    let valuesByKey = {};
    $: {
        valuesByKey = {};
        values.forEach(value => {
            valuesByKey[value.key] = value;
        });
    };

    function addMerkmal() {
        const newKey = `${statistik.id}/${merkmal.id}/${merkmalArg ? merkmalArg.id : '-'}`;
        if (!valuesByKey[newKey]) {
            valuesByKey[newKey] = {
                key: newKey,
                statistik: statistik.id,
                statistikName: statistik.name,
                merkmal: merkmal.id,
                merkmalName: merkmal.name,
                arg: merkmalArg ? merkmalArg.id : null,
                argName: merkmalArg ? merkmalArg.name : null,
                values: []
            };
            values.push(valuesByKey[newKey]);
        }
        if (merkmalArgValue) valuesByKey[newKey].values.push(merkmalArgValue);
        values = values;
    }

    function removeMarkmal(index) {
        values.splice(index, 1);
        values = values;
    }
</script>



<div class="row">
    <div class="col">
        {#if values.length}
        <ul>
            {#each values as val,i}
            <li>
                {val.statistikName}<br />
                &nbsp;&nbsp;&gt;&nbsp;{val.merkmalName} {#if val.values.length}
                <span title="{val.values.map(d => d.name).join(', ')}" style="color:#888">({val.values.length} Werte)</span>
                {/if}
                <a class="text-danger" href="#delete" on:click|preventDefault="{() => removeMarkmal(i)}"><span class="oi oi-trash"></span></a>
            </li>
            {/each}
        </ul>
        {/if}
        <SelectStatistik bind:value={statistik} />
        <SelectMerkmal
            bind:statistik
            bind:value={merkmal}
            bind:arg={merkmalArg}
            bind:argValue={merkmalArgValue} />

        <button
            style="margin-top:10px"
            on:click={addMerkmal}
            class="btn btn-outline-primary">Gewähltes Merkmal hinzufügen</button>
    </div>
</div>
