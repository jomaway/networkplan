<script lang="ts">
    import { PrimaryTool } from "../types";
    import ToolButton from "./ToolButton.svelte";
    import { keepToolSelected } from "../stores/editor";
    import { getAssetsIconUrl } from "../utils";

    export let selectedTool: PrimaryTool = PrimaryTool.Select;
    type ToolType = { name: string; tool: PrimaryTool };

    let tools: Array<ToolType> = [
        { name: "computer", tool: PrimaryTool.AddComputer },
        { name: "server", tool: PrimaryTool.AddServer },
        { name: "router", tool: PrimaryTool.AddRouter },
        { name: "switch", tool: PrimaryTool.AddSwitch },
        { name: "cloud", tool: PrimaryTool.AddCloud },
        { name: "connect", tool: PrimaryTool.Connect },
        { name: "text", tool: PrimaryTool.AddTextBox },
        { name: "area", tool: PrimaryTool.AddBgArea },
        { name: "delete", tool: PrimaryTool.Delete },
    ];

    function onButtonClick(tool: ToolType, keep: boolean) {
        if (selectedTool == tool.tool) {
            selectedTool = PrimaryTool.Select;
            keepToolSelected.set(false);
        } else {
            selectedTool = tool.tool;
            if (keep) keepToolSelected.set(true);
        }
        tools = tools;
    }
</script>

<div class="primary-tools-container">
    <nav>
        {#each tools as tool}
            <ToolButton
                active={selectedTool == tool.tool}
                src={getAssetsIconUrl(tool.name + ".svg")}
                alt={tool.name}
                on:click={(event) => onButtonClick(tool, event.detail.ctrlKey)}
            />
        {/each}
    </nav>
</div>

<style>
    .primary-tools-container {
        background-color: var(--panel-color);
        border: 1 solid var(--panel-border);
        border-radius: 10px;
        padding: 1px;
        display: flex;
        flex-direction: row;
    }

    nav {
        display: flex;
        gap: 0.3em;
        flex-direction: row;
        align-items: center;
        padding: 0.3em;
        margin: 0;
    }
</style>
