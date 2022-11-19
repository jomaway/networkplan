<script lang="ts">
    import { fly } from "svelte/transition";
    import HelpButton from "./HelpButton.svelte";
    export let showHelp = false;
    const speed = 300;

    const shortcutList = [
        { key: "ESC", desc: "Cancel current action/tool/selection." },
        { key: "DEL", desc: "Delete selceted element/complete diagram." },
        { key: "TAB", desc: "Cycle through nodes." },
        { key: "Ctrl + g", desc: "Toggle grid" },
        { key: "c", desc: "Connecting selected node." },
        { key: "e", desc: "Edit the selected label" },
        { key: "Ctrl + h", desc: "Show this help diaglog" },
    ];

    function focus(element: HTMLElement) {
        element.focus();
    }
</script>

{#if showHelp}
    <section
        transition:fly={{ duration: speed, y: -40 }}
        on:keyup={(e) => {
            if (e.key == "Escape") showHelp = false;
        }}
    >
        <div class="v-scroll-container">
            <h1>Networkplan editor</h1>
            <p>This editor is can be used to create simple network diagrams for presentation or education purpose.</p>
            <p>
                Different network components, connection links, labels and areas can be added by selcting the according
                tool in the toolbar. There are also some usefull keyboard shortcuts for some of the actions.
            </p>
            <h3>Keyboard shortcuts</h3>
            <table class="shortcuttable">
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Desc</th>
                    </tr>
                </thead>
                <tbody>
                    {#each shortcutList as shortcut}
                        <tr>
                            <td>{shortcut.key}</td>
                            <td>{shortcut.desc}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <p class="centered">
                <button use:focus on:click={() => (showHelp = false)}>Ok</button>
            </p>
        </div>
    </section>
{/if}

<span>
    <HelpButton bind:showHelp />
</span>

<style>
    section {
        position: fixed;
        z-index: 100;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: min(90%, 600px);
        max-height: 90vh;
        padding: 30px;
        background-color: var(--panel-color);
        border: 1px solid var(--panel-border);
        box-shadow: 0px 0px 1px #000a;
        border-radius: 10px;
        font-size: 20px;
        text-align: justify;
    }

    .v-scroll-container {
        display: block;
        height: 100%;
        overflow-y: auto;
        scrollbar-width: small;
    }

    h1 {
        text-align: center;
        padding-bottom: 10px;
        font-size: 34px;
    }

    p {
        margin: 10px 0px;
    }

    p:last-child {
        margin-top: 20px;
    }

    button {
        display: block;
        width: 3em;
        height: 3em;
        margin: 0;
        border: 0;
        align-content: center;
        background-color: var(--primary-color);
        border-radius: 5px;
    }

    .shortcuttable {
        table-layout: fixed;
        width: 100%;
        border-collapse: collapse;
        border: 3px solid var(--primary-color);
    }

    .shortcuttable thead th:nth-child(1) {
        width: 20%;
    }

    .shortcuttable th,
    .shortcuttable td {
        padding: 0.4em 1em;
    }
</style>
