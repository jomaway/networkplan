<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let src: string;
    export let alt: string = src;

    const dispatch = createEventDispatcher();

    export let active: boolean = false;
    export let size: number = 24;
</script>

<button class="tool-button" on:click|preventDefault={(e) => dispatch("click", { ctrlKey: e.ctrlKey })} class:active>
    <img width={size} height={size} {src} {alt} />
</button>

<style>
    .tool-button {
        width: 2.5em;
        height: 2.5em;
        border-radius: 100%;
        display: flex;
        padding: 0;
        justify-content: center;
        align-items: center;
        outline: none;
        background-color: var(--panel-color);
        border: 1px solid var(--panel-border);
        color: var(--text);
    }

    .tool-button.active,
    .tool-button.active:hover {
        background-color: var(--primary-color);
    }

    .tool-button:hover {
        background-color: var(--panel-hover);
    }

    .tool-button img {
        width: 24px;
        height: 24px;
    }
</style>
