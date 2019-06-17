<script>
    import SelectBundesland from './controls/SelectBundesland.svelte';
    import SelectLandkreis from './controls/SelectLandkreis.svelte';
    import SelectGemeinde from './controls/SelectGemeinde.svelte';

    const options = [{
        id: 'region',
        title: 'einzelne Regionen'
    }, {
        id: 'gemeinden',
        title: 'alle Gemeinden eines Landkreises'
    },{
        id: 'landkreise',
        title: 'alle Landkreise eines Bundeslands'
    }, {
        id: 'alleLaender',
        title: 'alle Bundesländer'
    }, {
        id: 'alleKreise',
        title: 'alle Landkreise <span style="color:#888">(kann etwas dauern)</span>'
    } ];

    const id = Math.round(Math.random()*1e7).toString(36);

    export let mode = 'region';
    export let regBundesland = null;
    export let regLandkreis = null;
    export let regGemeinde = null;
    export let regions = [];

    let refBundesland1;
    let refLandkreis1;
    let refGemeinde1;
    let refBundesland2;
    let refLandkreis2;
    let refBundesland3;

    function addRegion() {
        const region = regGemeinde || regLandkreis || regBundesland;
        if (region) {
            for (let i = regions.length - 1; i >= 0; i--) {
                if (regions[i].id === region.id) return;
            }
            regions.push(region);
            regions = regions;
        }
    }

    function removeRegion(index) {
        regions.splice(index, 1);
        regions = regions;
    }
</script>

<style>
    .ctrls {
        margin-top: 5px;
        margin-bottom: 10px;
    }
</style>

<h5>Daten suchen für...</h5>

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
    {#if option.id === 'region' && mode === 'region'}
    <div class="ctrls row">
        <div class="col-8">
            {#if regions.length}
            <ul class="selected-regions">
                {#each regions as region,i}
                <li>{@html region.display} <a href="#delete" on:click|preventDefault="{() => removeRegion(i)}"><span class="oi oi-trash"></span></a></li>
                {/each}
            </ul>
            {/if}
            <SelectBundesland
                bind:this={refBundesland1}
                next={refLandkreis1}
                bind:value={regBundesland} />
            <SelectLandkreis
                bind:this={refLandkreis1}
                parent={refBundesland1}
                next={refGemeinde1}
                bind:value={regLandkreis} />
            <SelectGemeinde
                bind:this={refGemeinde1}
                parent={refLandkreis1}
                bind:value={regGemeinde} />
            <button
                style="margin-top:10px"
                on:click={addRegion}
                disabled="{!regBundesland && !regLandkreis && !regGemeinde}"
                class="btn btn-primary">Gewählte Region hinzufügen</button>
        </div>
    </div>
    {:else if option.id === 'gemeinden' && mode === 'gemeinden'}
    <div class="ctrls row">
        <div class="col-8">
            <SelectBundesland
                bind:this={refBundesland2}
                bind:value={regBundesland}
                next={refLandkreis2}
                />
            <SelectLandkreis
                parent={refBundesland2}
                bind:value={regLandkreis}
                bind:this={refLandkreis2} />
        </div>
    </div>
    {:else if option.id === 'landkreise' && mode === 'landkreise'}
    <div class="ctrls row">
        <div class="col-8">
            <SelectBundesland
                bind:this={refBundesland3}
                bind:value={regBundesland} />
        </div>
    </div>
    {/if}
</div>
{/each}