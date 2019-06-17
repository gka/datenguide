<script>
    import { createEventDispatcher, beforeUpdate } from 'svelte';
    const dispatch = createEventDispatcher();

    export let icon = false;
    export let label = '';
    export let placeholder = '';
    export let filter = 'indexOf';
    export let items = [];
    export let width = '100%';
    export let query = '';

    let open = false;
    export let value;
    export let selectedIndex = -1;
    let searching = false;
    let selection = '';
    // refs
    let dropdown;
    let searchInput;

    const maxItems = 100;

    $: firstMatches = matches.slice(0, maxItems);

    $: matches = !filter || !query ? items :
        !items || items.constructor.name !== 'Array' ? [] :
        items.filter(item => {
            return (item.search || item.title || item.name)
                .toLowerCase().indexOf(query.toLowerCase()) > -1;
        });

    let _lastValueId;

    beforeUpdate(() => {
        if (value && value.id !== _lastValueId) {
            _lastValueId = value.id;
            query = value.name || value.title || value.display;
        }
        if (!value && _lastValueId) {
            query = '';
            _lastValueId = undefined;
        }
    });

    function onClick(event) {
        open = true;
        focus();
        query = '';
        dispatch('focus', event);
    }

    export function focus() {
        searchInput.focus();
    }

    export function blur() {
        searchInput.blur();
    }

    function search() {
        open = true;
        // we're firing the "search" event so that the
        // parent component can update the "items" list
        dispatch('search', { query });
    }

    function buttonOpen() {
        open = true;
        focus();
        query = '';
    }

    function close() {
        open = false;
        blur();
        if (value) {
            query = value.title || value.name || value.display;
        }
    }

    function select(item) {
        value = item;
        close();
        dispatch('select', { item });
    }

    function keyup(event) {
        if (!event) return;
        if (event.keyCode === 13) {
            // RETURN key
            select(value);
        }
        if (event.keyCode === 38 || event.keyCode === 40) {
            // ARROW UP/DOWN
            if (isNaN(selectedIndex)) selectedIndex = -1;
            const len = firstMatches.length || 0;
            if (event.keyCode === 38) {
                selectedIndex = (selectedIndex - 1 + len) % len;
            }
            if (event.keyCode === 40) {
                selectedIndex = (selectedIndex + 1) % len;
            }

            value = firstMatches[selectedIndex];
        }
        if (event.keyCode === 27) {
            // ESCAPE
            close();
        }
    }

</script>

<style>
    label {
        font-size: 14px;
        text-transform: uppercase;
        color: #888;
        margin-bottom: 3px;
    }
    .form-group {
        margin-bottom:0;
    }
    .typeahead {
        position: relative;
        width: 100%;
    }
    input {
        width: 100%
    }
    button {
        background: white;
        border: 0;
        border-left: 1px solid #ced4da;
        position: absolute;
        right: 5px;
        top: 5px;
        bottom: 5px;
        padding: 0 5px 0 7px;
    }
    .dropdown {
        display: flex;
        flex-wrap: wrap;
        position: relative;
    }
    svg {
        opacity: 0.3;
        transition: opacity 0.3s;
    }
    button:hover svg,
    input:hover + button svg,
    input:focus + button svg {
        opacity: 0.6;
    }
    input:focus + button:hover svg {
        opacity: 0.8;
    }
    .dropdown.icon input {
        padding-left: 30px;
    }
    .dropdown.icon .icon {
        position: absolute;
        left: 7px;
        top: 6px;
        color: #ccc;
        font-size: 17px;
    }
    .dropdown.icon .icon.im {
        top: 8px;
    }
    .dropdown.selection input::-webkit-input-placeholder {
        color: #222;
        font-weight: 300;
        opacity: 1;
    }
    .dropdown.selection input::-moz-placeholder {
        color: #222;
        font-weight: 300;
        opacity: 1;
    }
    .dropdown.selection input:-ms-input-placeholder {
        color: #222;
        font-weight: 300;
        opacity: 1;
    }
    .dropdown.selection input:-moz-input-placeholder {
        color: #222;
        font-weight: 300;
        opacity: 1;
    }
    .dropdown-results li.selected {
        background: #18a1cd33;
    }
    input {
        margin-bottom: 0px;
        flex-grow: 4;
    }
    .btn-wrap {
        flex-grow: 1;
    }
    .btn-small {
        max-width: 60px;
        padding: 4px 10px;
        border-radius: 0px 3px 3px 0px !important;
        margin-left: -4px;
        border-left: none;
    }
    .dropdown-results {
        max-height: 20em;
        overflow: auto;
        margin: 0px;
        z-index: 9999;
        width: 100%;
        position: absolute;
        top: 4.2ex;
        background-color: white;
        border: 1px solid #cccccc;
        margin-top: 0px;
        border-top: 0;
        box-shadow: 2px 2px 2px #000 1;
    }
    .dropdown-results li {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
        padding: 5px 6px;
    }
    .dropdown-results li:hover {
        background-color: #18a1cd33;
        cursor: pointer;
    }
</style>


<svelte:window on:click="{() => close()}" />

<div class="form-group">
    {#if label}
    <label>{@html label}</label>
    {/if}
    <div on:click|stopPropagation="{d => d}" style="width: {width}">
        <div class:icon class:selection="{!open && selection}" class="dropdown" on:click="{(e) => onClick(e)}">

            <div class="typeahead">
                <input
                    class="form-control"
                    type="search"
                    bind:this={searchInput}
                    placeholder="{open ? placeholder : selection||placeholder}"
                    bind:value={query}
                    on:keydown="{event => keyup(event)}"
                    on:input="{d => search()}"
                />
                {#if icon}
                <i class="icon {icon}"></i>
                {/if}
                <button on:click="{d=> buttonOpen()}">
                    <slot name="button">
                        <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>
                    </slot>
                </button>
            </div>

            {#if open && firstMatches.length}
            <ul bind:this={dropdown} class="dropdown-results">
                {#each firstMatches as item,i}

                <li class:selected="{i===selectedIndex}" style="{item.style||''}" on:click|stopPropagation="{() => select(item)}">
                    {@html item.display || item.title || item.name}
                </li>

                {/each}
            </ul>
            {/if}
        </div>
    </div>
</div>

