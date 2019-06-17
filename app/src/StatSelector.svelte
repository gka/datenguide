<script>
    import SelectStatistik from './controls/SelectStatistik.svelte';
    import SelectMerkmal from './controls/SelectMerkmal.svelte';

    let statistik = null;
    let merkmal = null;
    let merkmalArg = null;
    let merkmalArgValue = null;

    export let values = [];

    function addMerkmal() {
        values.push({
            display: `${statistik.name}<br>${merkmal.name}<span style="color:#888">${merkmalArg ? ` (${merkmalArgValue.name})` : ''}</span>`,
            statistik: statistik.id,
            merkmal: merkmal.id,
            arg: merkmalArg ? merkmalArg.id : null,
            value: merkmalArg && merkmalArgValue ? merkmalArgValue.id : null
        });
        values = values;
    }
</script>

<h5>Statistik und Merkmale wählen</h5>

<div class="row">
    <div class="col">
        {#if values.length}
        <ul>
            {#each values as val,i}
            <li>{@html val.display}</li>
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
            class="btn btn-primary">Gewähltes Merkmal hinzufügen</button>
    </div>
</div>