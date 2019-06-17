<script>
    import {beforeUpdate} from 'svelte';
    import TypeAhead from './TypeAhead.svelte';
    import allStats from '../../data/statistics.json';
    import allMerkmale from '../../data/merkmale.json';

    export let value = null;
    export let statistik = null;
    export let arg = null;
    export let argValue = null;

    let query = '';
    let args = [];
    let argValues = [];

    $: items = Object.keys(allMerkmale)
        .filter(id => statistik && statistik.merkmale.indexOf(id) > -1)
        .map(id => {
            const merkmal = allMerkmale[id];
            return {
                id,
                name: merkmal.name,
                display: `${merkmal.name} <span style="color:#bbb">[${id}]</span>`,
                args: Object.keys(merkmal.args).map(id => {
                return {
                    id,
                    ...merkmal.args[id]
                }
            })
            };
        });

    function onSelect() {
        args = value.args;
        arg = args[0];
        onSelectArg();
    }

    function onSelectArg() {
        argValues = !arg ? [] : arg.values.map(v => {
            return {
                id: v.value,
                name: v.name,
                display: `${v.name} <span style="color:#bbb">(${v.value})</span>`
            };
        });
    }

    let _lastStat;

    beforeUpdate(() => {
        if (statistik && statistik.id !== _lastStat) {
            _lastStat = statistik.id;
            value = items[0];
            onSelect();
        }
    })
</script>

{#if statistik}
<TypeAhead
    label="Merkmal"
    placeholder="auswählen..."
    width="100%"
    bind:value
    bind:query
    on:select={onSelect}
    items="{items}"
    />

    {#if args.length}
    <TypeAhead
        label="Merkmalausprägung"
        placeholder="auswählen..."
        width="100%"
        bind:value={arg}
        on:select={onSelectArg}
        items="{args}"
        />

        {#if argValues.length}
        <TypeAhead
            label="Wert der Merkmalausprägung"
            placeholder="auswählen..."
            width="100%"
            bind:value={argValue}
            items="{argValues}"
            />
        {/if}
    {/if}
{/if}