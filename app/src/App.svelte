<script>
    import Card from './controls/Card.svelte';
    import Tabs from './controls/Tabs.svelte';
    import NavBar from './NavBar.svelte';
    import RegionSelector from './RegionSelector.svelte';
    import StatSelector from './StatSelector.svelte';
    import TimeSelector from './TimeSelector.svelte';
    import TypeAhead from './controls/TypeAhead.svelte';
    import runQuery from './utils/runQuery';
    import {buildRegionQuery, buildAllRegionsQuery} from './utils/buildQuery';

    let regionMode = 'region';
    let selectedRegions = [];
    $: parentRegion = regionMode === 'landkreise' ? bundesland :
        regionMode === 'gemeinden' ? landkreis : undefined;

    let bundesland;
    let landkreis;
    let gemeinde;
    let regions = [];
    let statistics = [];

    export let name;

    let result = null;

    function doQuery() {
        result = 'waiting for results...';
        runQuery(query, {}).then(data => {
            // console.log(data);
            result = data.data;
            if (selectedTab === 'query') {
                selectedTab = 'json';
            }
        });
    }

    $: subQuery = statistics.length ? statistics.map((stat,i) => {
        return `s${i}: ${stat.merkmal}(statistics: R${stat.statistik}${stat.arg ? `, filter: { ${stat.arg}: { in: ["${stat.values.map(d => d.id).join('", "')}"]} }` : ''}) {
    ${stat.arg ? `type: ${stat.arg}` : ''}
    year
    value
}`
    }).join('\n') : '';

    $: query = regionMode === 'region' ? buildRegionQuery(subQuery, regions.map(r => r.id)) :
        buildAllRegionsQuery(subQuery,
            regionMode === 'alleLaender' ? 1 :
            regionMode === 'alleKreise' || regionMode === 'kreise' ? 3 : 5,
            regionMode.substr(0,4) !== 'alle' ?
                (parentRegion ? parentRegion.id : undefined)  : undefined);

    const previewTabs = [
        {id: 'query', title: 'GraphQL Query'},
        {id: 'json', title: 'Ergebnis (JSON)'},
        {id: 'csv', title: 'Ergebnis (CSV)'}
    ];

    let selectedTab = 'query';

</script>

<style>
    textarea, pre { font-family: monospace; }
    .card { margin-bottom: 20px;}
    .container-fluid {
        margin-top: 20px;
    }
</style>

<NavBar />

<div class="container-fluid">
    <div class="row">
        <div class="col-md-5" style="padding-bottom: 20px">

            <Card title="Statistik und Merkmale wählen">
                <StatSelector
                    bind:values={statistics} />
            </Card>

            <Card title="Regionen auswählen">
                <RegionSelector
                    bind:mode={regionMode}
                    bind:regions
                    bind:regBundesland={bundesland}
                    bind:regLandkreis={landkreis}
                    bind:regGemeinde={gemeinde}
                    />
            </Card>

            <Card title="Zeitraum auswählen">
                <TimeSelector />
            </Card>

            <button on:click="{doQuery}" class="btn-block btn btn-lg btn-primary">
                <span class="oi oi-signal"></span> Anfrage starten
             </button>
        </div>
        <div class="col-md-7">

            <div style="position: sticky; top: 20px">
                <Tabs tabs="{previewTabs}" bind:selected={selectedTab} />
                <Card noBorderTop={true}>
                    {#if selectedTab === 'query'}
                    <pre>{query}</pre>
                    {:else if selectedTab === 'json'}
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                    {:else if selectedTab === 'csv'}
                    <i class="text-muted">TODO</i>
                    {/if}
                </Card>
            </div>
        </div>

    </div>
 <!--    <button class="btn btn-outline-secondary" on:click="{()=>doQuery()}">run query</button>
    <div style="display: flex">
        <textarea bind:value="{query}"></textarea>
        <pre>{JSON.stringify(result, null, 2)}</pre> -->

</div>

