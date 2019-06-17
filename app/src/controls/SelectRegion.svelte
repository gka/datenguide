<script>
	import TypeAhead from './TypeAhead.svelte';
    import allRegions from '../../data/ags.json';

    export let value = null;
    export let label = 'Region';
    export let startsWith = null;
    export let parent = null;
    export let regions = [];

    let typeahead;
    export let next = null;

    $: filteredRegions = regions.filter(region => {
        return !startsWith || region.id.substr(0, startsWith.length) === startsWith;
    });

    export function focus() {
        typeahead.focus();
    }

    export function syncId(id) {
        regions.forEach(region => {
            if (region.id === id.substr(0, region.id.length)) {
                value = region;
                onSelect(true);
            }
        })
    }

    function onSelect(noFocus) {
        if (next && !noFocus) next.focus();
        if (next) next.$set({startsWith: value ? value.id : '' });
        if (parent && value) parent.syncId(value ? value.id : '');
    }
</script>

{#if filteredRegions.length}
<TypeAhead
    placeholder="auswählen..."
    label="{label}"
    width="100%"
    bind:value
    bind:this={typeahead}
    on:select={onSelect}
    items="{filteredRegions}"
    />
{/if}
