<script>
    import NavBar from './NavBar.svelte';
    import RegionSelector from './RegionSelector.svelte';
    import StatSelector from './StatSelector.svelte';
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

    let statsQuery = `cdu: WAHL09(statistics: R14111, PART04: CDU) {
      year
      value
    }
    spd: WAHL09(statistics: R14111, PART04: SPD) {
      year
      value
    }
`;
    let result = null;

    function doQuery() {
        result = 'waiting for results...';
        runQuery(query, {}).then(data => {
            // console.log(data);
            result = data.data;
        });
    }

    $: query = regionMode === 'region' ? buildRegionQuery(statsQuery, regions.map(r => r.id)) :
        buildAllRegionsQuery(statsQuery,
            regionMode === 'alleLaender' ? 1 :
            regionMode === 'alleKreise' || regionMode === 'kreise' ? 3 : 5,
            regionMode.substr(0,4) !== 'alle' ?
                (parentRegion ? parentRegion.id : undefined)  : undefined);



</script>

<style>
    textarea, pre { font-family: monospace; }
    .card { padding: 20px; margin-bottom: 20px;}
    .container-fluid {
        margin-top: 20px;
    }
</style>

<NavBar />

<div class="container-fluid">
    <div class="row">
        <div class="col-md-4">
            <div class="card">
                <RegionSelector
                    bind:mode={regionMode}
                    bind:regions
                    bind:regBundesland={bundesland}
                    bind:regLandkreis={landkreis}
                    bind:regGemeinde={gemeinde}
                    />
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <StatSelector
                    bind:values={statistics} />
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <h5>Query Preview</h5>
                <pre>{query}</pre>
            </div>
        </div>
    </div>
 <!--    <button class="btn btn-outline-secondary" on:click="{()=>doQuery()}">run query</button>
    <div style="display: flex">
        <textarea bind:value="{query}"></textarea>
        <pre>{JSON.stringify(result, null, 2)}</pre> -->

</div>

