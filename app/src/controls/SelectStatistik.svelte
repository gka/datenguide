<script>
    import TypeAhead from './TypeAhead.svelte';
    import allStats from '../../data/statistics.json';
    import allMerkmale from '../../data/merkmale.json';

    export let value = null;
    let query = '';

    function displayStat(stat, query) {
        const qLower = query.toLowerCase();
        const merkmale = query ? (stat.merkmale || [])
            .map(d => allMerkmale[d].name)
            .filter(d => d.toLowerCase().indexOf(qLower) > -1) :
            [];
        return `${stat.title_de}<div style="color:#888">${merkmale.join('<br>')}</div>`
    }

    $: items = Object.keys(allStats).map(id => {
        const merkmale = allStats[id].merkmale || [];
        return {
            id,
            name: allStats[id].title_de,
            search: `${allStats[id].title_de} ${merkmale.map(id => allMerkmale[id].name).join(' ')}`,
            display: displayStat(allStats[id], query),
            validFrom: allStats[id].valid_from,
            periodicity: allStats[id].periodicity.toLowerCase(),
            merkmale: merkmale
        };
    });

    function onSelect() {

    }
</script>

<TypeAhead
    label="Statistik"
    placeholder="auswählen..."
    width="100%"
    bind:value
    bind:query
    on:select={onSelect}
    items="{items}"
    />
