<script>
    import SelectRegion from './SelectRegion.svelte';
    import getRegions from '../utils/getRegions';

    export let value = null;
    export let next = null;
    export let parent = null;
    export let startsWith = null;

    const regions = getRegions(d => d.id.length === 2);

    let select;
    export function focus() { select.focus(); }
    export function syncId(id) { select.syncId(id); }

</script>

<SelectRegion
    label="Bundesland"
    regions={regions}
    next={next}
    parent={parent}
    startsWith={startsWith}
    bind:this={select}
    bind:value
    />
