<script lang="ts">
    import PrimaryTools from "./PrimaryTools.svelte";
    import HelpPanel from "./HelpPanel.svelte";
    import type { PrimaryTool } from "../types";

    export let selectedTool: PrimaryTool;

    let side = "bottom";
</script>

<div class="toolbar" class:side-left={side == "left"} class:side-bottom={side == "bottom"}>
    <div class="center-wrap">
        <div
            class="primary-tools-wrapper"
            class:vertical={side == "left" || side == "right"}
            class:horizontal={side == "bottom"}
        >
            <PrimaryTools bind:selectedTool />
            <HelpPanel />
        </div>
    </div>
</div>

<style>
    .toolbar {
        position: fixed;
        width: 100%;
        min-width: 0px;
        max-width: 100%;
        height: 64px;
        gap: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 200;
        overflow: hidden;
    }

    .toolbar.side-bottom {
        left: 0px;
        right: 0px;
        bottom: 4px;
    }

    .toolbar.side-left {
        width: 64;
        height: 100%;
        left: 0px;
    }

    .center-wrap {
        display: flex;
        width: fit-content;
        height: fit-content;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 4px;
    }

    .primary-tools-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        height: fit-content;
        gap: 8px;
    }

    .horizontal {
        flex-direction: row;
    }

    .vertical {
        flex-direction: column;
    }
</style>
