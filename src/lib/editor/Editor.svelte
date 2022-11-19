<script lang="ts">
    import { confirm } from "@tauri-apps/api/dialog";
    import { onDestroy, onMount } from "svelte";
    import Graph from "../graph/Graph.svelte";
    import Line from "../graph/Line.svelte";
    import ToolBar from "./Components/ToolBar.svelte";
    import type { Dragable, LinkType, NodeType, Position, ShapeType, TextBox } from "../graph/types";

    import ComputerIcon from "./icons/ComputerIcon.svelte";
    import RouterIcon from "./icons/RouterIcon.svelte";
    import SwitchIcon from "./icons/SwitchIcon.svelte";
    import ServerIcon from "./icons/ServerIcon.svelte";
    import CloudIcon from "./icons/CloudIcon.svelte";
    import { PrimaryTool, Direction } from "./types";

    import { toast } from "@zerodevx/svelte-toast";
    import { keepToolSelected } from "./stores/editor";

    /**********************************************
    // Lifecyle methods
    **********************************************/
    onMount(() => {
        window.addEventListener("keyup", handleKeyUp);
    });

    onDestroy(() => {
        // remove event listener if component isn't rendered.
        window.removeEventListener("keyup", handleKeyUp);
    });

    /**********************************************
    // Variables
    **********************************************/

    // reference to graph element
    let graphview: Graph;
    // show grid in background
    let showGrid = true;
    let showHelp = false;

    // Graph components
    let nodes: Array<NodeType> = [];
    let links: Array<LinkType> = [];

    let shapes: Array<ShapeType> = [];
    let labels: Array<TextBox> = [];

    let selectedNode: NodeType | null = null;
    let selectedLink: LinkType | null = null;
    let selectedLabel: TextBox | null = null;
    let selectedShape: ShapeType | null = null;

    // Editor specific elements
    let startNode: NodeType | null = null;
    let mousePosition: Position = { x: 0, y: 0 };

    $: if (selectedNode) {
        nodes = nodes;
        links = links;
    }

    // variable for the current selected Tool
    let selectedTool: PrimaryTool;

    $: if (selectedTool == PrimaryTool.Delete) {
        handleDeleteAction();
        selectedTool = PrimaryTool.Select;
    }

    /**********************************************
     *  Functions
     **********************************************/

    function addNode(pos: Position, type: string) {
        const newNode: NodeType = {
            id: crypto.randomUUID(),
            pos: { ...mousePosition },
            size: 50,
            type,
            color: "teal",
            label: type + nodes.length,
            dragable: true,
        };
        nodes = [...nodes, newNode];

        return newNode;
    }

    function addLink(startNode: NodeType, endNode: NodeType) {
        const newLine = {
            id: crypto.randomUUID(),
            startNode: startNode,
            endNode: endNode,
        };
        links = [...links, newLine];
    }

    function addConnection() {
        if (nodes.length < 2) {
            toast.push("Can't add connection with less than 2 nodes!", { classes: ["error"] });
            return;
        }
        selectedTool = PrimaryTool.Connect;
        startNode = selectedNode ?? null;
    }

    function addShape() {
        const newShape: ShapeType = {
            id: crypto.randomUUID(),
            pos: { ...mousePosition },
            color: "#40A09988",
            radius: 100,
            type: "circle",
            dragable: true,
        };
        shapes = [...shapes, newShape];
    }

    function handleDeleteAction() {
        if (startNode) {
            startNode = null;
        } else if (selectedLink) {
            links = links.filter((link) => link != selectedLink);
            selectedLink = null;
        } else if (selectedNode) {
            nodes = nodes.filter((node) => node != selectedNode);
            //lines = lines.filter((line) => line.startNode != selectedNode && line.endNode != selectedNode );
            selectedNode = null;
        } else if (selectedLabel) {
            labels = labels.filter((text) => text != selectedLabel);
        } else if (selectedShape) {
            shapes = shapes.filter((shape) => shape != selectedShape);
        } else {
            deleteDialog().then((confirmed) => {
                if (confirmed) {
                    // Delete everything
                    startNode = null;
                    selectedNode = null;
                    selectedLink = null;
                    nodes = [];
                    links = [];
                }
            });
        }
    }

    async function deleteDialog() {
        return confirm("Do you want to delete everything?", "Delete Networkplan");
    }

    /********************************************
     *  Event Handler
     **********************************************/

    function onEscape() {
        selectedTool = PrimaryTool.Select;
        if (!startNode) selectedNode = null;
        selectedLink = null;
        startNode = null;
        keepToolSelected.set(false);
        graphview.clearSelection();
    }

    function onTab() {
        // todo! improve
        if (selectedNode) {
            const idx = nodes.findIndex((node) => selectedNode == node);
            selectedNode = nodes[(idx + 1) % nodes.length];
        }
    }

    /** handle global keyboard events */
    function handleKeyUp(e: KeyboardEvent) {
        if (e.altKey) {
            switch (e.key) {
                case "1":
                    selectedTool = PrimaryTool.AddComputer;
                    break;
                case "2":
                    selectedTool = PrimaryTool.AddServer;
                    break;
                case "3":
                    selectedTool = PrimaryTool.AddRouter;
                    break;
                case "4":
                    selectedTool = PrimaryTool.AddSwitch;
                    break;
                case "5":
                    selectedTool = PrimaryTool.AddCloud;
                    break;
            }
            return;
        }

        switch (e.key) {
            case "Escape":
                onEscape();
                break;
            case "Delete":
                handleDeleteAction();
                break;
            case "Tab":
                onTab();
                break;
            case "Down": // IE/Edge specific value
            case "ArrowDown":
                // Move node down
                if (selectedNode) moveObject(selectedNode, Direction.Down);
                break;
            case "Up": // IE/Edge specific value
            case "ArrowUp":
                // Move node up
                if (selectedNode) moveObject(selectedNode, Direction.Up);
                break;
            case "Left": // IE/Edge specific value
            case "ArrowLeft":
                // Move node left
                if (selectedNode) moveObject(selectedNode, Direction.Left);
                break;
            case "Right": // IE/Edge specific value
            case "ArrowRight":
                // Move node right
                if (selectedNode) moveObject(selectedNode, Direction.Right);
                break;
            case "Enter":
                // Do something for "enter" or "return" key press.
                break;
            case "c":
                addConnection();
                break;
            case "e":
                selectedTool = PrimaryTool.TextEdit;
                break;
            case "h":
                if (!e.ctrlKey) return;
                showHelp = true;
                break;
            case "g":
                if (e.ctrlKey) {
                    showGrid = !showGrid;
                }
                break;
        }
    }

    function moveObject(obj: Dragable, direction: Direction, step: number = 10) {
        switch (direction) {
            case Direction.Down:
                obj.pos.y += step;
                break;
            case Direction.Up:
                obj.pos.y -= step;
                break;
            case Direction.Left:
                obj.pos.x -= step;
                break;
            case Direction.Right:
                obj.pos.x += step;
                break;
            default:
                break;
        }
    }

    /** handle a click on the graph canvas */
    function handleCanvasClick(event: CustomEvent) {
        switch (selectedTool) {
            case PrimaryTool.AddComputer:
            case PrimaryTool.AddServer:
            case PrimaryTool.AddRouter:
            case PrimaryTool.AddSwitch:
            case PrimaryTool.AddCloud:
                selectedNode = addNode(event.detail.pos, selectedTool.toString());
                break;
            case PrimaryTool.AddTextBox:
                labels = [
                    ...labels,
                    {
                        id: crypto.randomUUID(),
                        pos: { ...event.detail.pos },
                        text: "testlabel",
                        size: 14,
                        color: "#1a5276",
                        dragable: true,
                    },
                ];
                break;
            case PrimaryTool.AddBgArea:
                addShape();
                break;
            default:
                return;
        }

        if ($keepToolSelected == false) {
            selectedTool = PrimaryTool.Select;
        }
    }

    /** handle a click on a node */
    function handleNodeClick(event: CustomEvent) {
        if (selectedTool == PrimaryTool.Select) {
            const node = event.detail.node;
            selectedNode = selectedNode == node ? null : node;
            selectedLink = null;
        }

        if (selectedTool == PrimaryTool.Connect) {
            const node = event.detail.node;
            if (startNode && startNode != node) {
                addLink(startNode, node);
                startNode = null;
            } else {
                startNode = node;
                return;
            }
        }
    }

    function handleShapeClick(event: CustomEvent) {
        if (selectedTool != PrimaryTool.Select) {
            selectedShape = null;
            handleCanvasClick(event);
        }
    }
</script>

<div class="editor">
    <Graph
        bind:this={graphview}
        bind:nodes
        bind:links
        bind:labels
        bind:shapes
        bind:selectedNode
        bind:selectedLink
        bind:selectedTextBox={selectedLabel}
        bind:selectedShape
        bind:mousePosition
        {showGrid}
        on:canvas-click={handleCanvasClick}
        on:node-click={handleNodeClick}
        on:shape-click={handleShapeClick}
    >
        <svelte:fragment slot="custom-line">
            {#if startNode}
                <Line start={startNode.pos} end={mousePosition} width={2} selected={false} />
            {/if}
        </svelte:fragment>

        <svelte:fragment slot="custom-node-icon" let:node>
            {#if node.type == "computer"}
                <ComputerIcon position={node.pos} size={{ width: node.size, height: node.size }} />
            {:else if node.type == "router"}
                <RouterIcon position={node.pos} size={{ width: node.size * 1.3, height: node.size }} />
            {:else if node.type == "switch"}
                <SwitchIcon position={node.pos} size={{ width: node.size * 1.3, height: node.size }} />
            {:else if node.type == "server"}
                <ServerIcon position={node.pos} size={{ width: node.size, height: node.size }} />
            {:else if node.type == "cloud"}
                <CloudIcon position={node.pos} size={{ width: node.size, height: node.size }} />
            {/if}
        </svelte:fragment>
    </Graph>

    <ToolBar bind:selectedTool />
</div>

<style>
    .editor {
        display: block;
        height: 100vh;
    }
</style>
