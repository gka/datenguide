<script>
    export let options = [];
    export let value = '';

    const id = Math.round(Math.random()*1e7).toString(36);

</script>

{#each options as option,i}
<div class="custom-control custom-radio">
    <input
        bind:group={value}
        value={option.id}
        type="radio"
        id="{id}{i}"
        name="{id}"
        class="custom-control-input"
    >
    <label class="custom-control-label" for="{id}{i}">{option.title}</label>
    <div>
        <div class="form-group">
            <label for="exampleInputEmail1">Bundesland</label>
            <TypeAhead
                placeholder="auswählen..."
                width="100%"
                bind:value={bundesland}
                items="{bundeslaender}"
                />
        </div>
    </div>
</div>
{/each}
