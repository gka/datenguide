<script>
    import Card from './controls/Card.svelte';
    import Radio from './controls/Radio.svelte';
    import Tabs from './controls/Tabs.svelte';
    import NavBar from './NavBar.svelte';
    import RegionSelector from './RegionSelector.svelte';
    import StatSelector from './StatSelector.svelte';
    import TimeSelector from './TimeSelector.svelte';
    import TypeAhead from './controls/TypeAhead.svelte';
    import runQuery from './utils/runQuery';
    import resultToCSV from './utils/resultToCSV';
    import {buildRegionQuery, buildAllRegionsQuery, buildStatQuery} from './utils/buildQuery';

    let regionMode = 'alleLaender';
    let selectedRegions = [];
    $: parentRegion = regionMode === 'landkreise' ? bundesland :
        regionMode === 'gemeinden' ? landkreis : undefined;

    let bundesland;
    let landkreis;
    let gemeinde;
    let regions = [];
    let statistics = [];
    let timesMode = 'all';
    let times = [];

    export let name;

    let result = null;
    let waitingForResult = false;

    function doQuery() {
        waitingForResult = true;
        runQuery(query, {}).then(data => {
            // console.log(data);
            result = data.data;
            waitingForResult = false;
            if (selectedTab === 'query') {
                selectedTab = 'json';
            }
        });
    }

    $: subQuery = buildStatQuery(statistics, timesMode, times);

    $: query = regionMode === 'region' ? buildRegionQuery(subQuery, regions.map(r => r.id)) :
        buildAllRegionsQuery(subQuery,
            regionMode === 'alleLaender' ? 1 :
            regionMode === 'alleKreise' || regionMode === 'landkreise' ? 3 : 5,
            regionMode.substr(0,4) !== 'alle' ?
                (parentRegion ? parentRegion.id : undefined)  : undefined);

    const previewTabs = [
        {id: 'query', title: 'GraphQL Query'},
        {id: 'json', title: 'Ergebnis (JSON)'},
        {id: 'csv', title: 'Ergebnis (CSV)'}
    ];

    let selectedTab = 'query';
    let csvMode = 'long';
    const csvModeOptions = [
        {id: 'long', title: 'eine Zeile pro Wert'},
        {id: 'wideRegion', title: 'eine Zeile pro Region'},
        {id: 'wideTime', title: 'eine Zeile pro Jahr'}
    ];

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
            <button
                disabled={!statistics.length}
                class:btn-secondary={!statistics.length}
                class:btn-primary={statistics.length}
                on:click="{doQuery}"
                style="margin-bottom: 20px"
                class="btn-block btn btn-lg">
                <span class="oi oi-signal"></span> Anfrage starten
             </button>

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
                <TimeSelector
                    bind:mode={timesMode}
                    bind:values={times} />
            </Card>
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
                    CSV-Format:&nbsp;&nbsp;<Radio inline={true} bind:value={csvMode} options={csvModeOptions} />
                    <pre style="margin-top:20px">{resultToCSV(result,
                        regionMode,
                        regionMode === 'region' ? regions : parentRegion,
                        statistics,
                        times,
                        csvMode
                    )}</pre>
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

