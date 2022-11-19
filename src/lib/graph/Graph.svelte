<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";

    import type { Position, NodeType, LinkType, TextBox, ShapeType, Dragable } from "./types";

    import Grid from "./Grid.svelte";
    import Node from "./Node.svelte";
    import Line from "./Line.svelte";
    import Label from "./Label.svelte";

    // Components
    export let nodes: Array<NodeType> = [];
    export let links: Array<LinkType> = [];
    export let shapes: Array<ShapeType> = [];
    export let labels: Array<TextBox> = [];

    // Selected Components
    export let selectedNode: NodeType | null = null;
    export let selectedLink: LinkType | null = null;
    export let selectedShape: ShapeType | null = null;
    export let selectedTextBox: TextBox | null = null;

    // Layout
    export let showGrid: boolean = true;
    export let activeLines: boolean = false;

    let viewport: SVGElement;
    export let mousePosition: Position = { x: 0, y: 0 };

    const dispatch = createEventDispatcher();

    let draggingElement: Dragable | null = null; // todo add type

    $: if (selectedNode) {
        nodes = nodes;
    }

    $: if (draggingElement) {
        nodes = nodes;
        labels = labels;
        shapes = shapes;
    }

    $: if (selectedTextBox) {
        labels = labels;
    }

    $: if (selectedShape) {
        shapes = shapes;
    }

    onMount(() => {
        // add Event Listener
        window.addEventListener("mousemove", followMouse);
    });

    onDestroy(() => {
        // remove Event Listener if Component isn't rendered
        window.removeEventListener("mousemove", followMouse);
    });

    function followMouse(e: MouseEvent) {
        mousePosition.x = e.clientX;
        mousePosition.y = e.clientY;

        if (draggingElement) {
            draggingElement.pos = { ...mousePosition };
        }

        // todo remove Node if finished draggingElement
    }

    function handleCanvasClick(e: MouseEvent) {
        if (selectedNode || selectedLink || selectedTextBox || selectedShape) {
            selectedNode = null;
            selectedLink = null;
            selectedTextBox = null;
            selectedShape = null;
        }

        // dispatch Canvas click
        dispatch("canvas-click", { pos: mousePosition });
    }

    function handleNodeClick(node: NodeType) {
        clearSelection();
        dispatch("node-click", { node: node });
    }

    function handleLinkClick(link: LinkType) {
        clearSelection();
        selectedLink = selectedLink == link ? null : link;
        dispatch("link-click", link);
    }

    function handleShapeClick(shape: ShapeType) {
        clearSelection();
        selectedShape = shape;
        dispatch("shape-click", shape);
    }

    function handleLabelClick(label: TextBox) {
        clearSelection();
        selectedTextBox = selectedTextBox == label ? null : label;
        dispatch("label-click", label);
    }

    // todo : add type Dragable
    function startDragElement(element: Dragable) {
        draggingElement = element;
    }

    function endDragElement(element: Dragable) {
        draggingElement = null;
    }

    export function clearSelection() {
        selectedNode = null;
        selectedLink = null;
        selectedTextBox = null;
        selectedShape = null;
    }
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<svg
    class="canvas"
    tabindex="0"
    xmlns="http://www.w3.org/2000/svg"
    on:click={handleCanvasClick}
    on:keyup={(e) => {
        if (e.key == "Escape") selectedNode = null;
    }}
>
    <!-- grid -->
    {#if showGrid}
        <Grid />
    {/if}

    <!-- viewport: pan/zoomable (maybe in the future) -->
    <g class="viewport" bind:this={viewport}>
        <!-- shapes -->
        {#each shapes as shape}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <g
                on:click|stopPropagation={() => handleShapeClick(shape)}
                on:mousedown|stopPropagation={() => startDragElement(shape)}
                on:mouseup|stopPropagation={() => endDragElement(shape)}
            >
                <circle
                    cx={shape.pos.x}
                    cy={shape.pos.y}
                    r={shape.radius}
                    fill={shape.color}
                    stroke="var(--primary-color)"
                    stroke-width={selectedShape == shape ? 4 : 0}
                />
            </g>
        {/each}

        <!-- lines -->
        {#each links as link}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <g on:click|stopPropagation={() => handleLinkClick(link)}>
                <Line
                    start={link.startNode.pos}
                    end={link.endNode.pos}
                    width={4}
                    selected={selectedLink == link}
                    active={activeLines}
                />
            </g>
        {/each}

        <!-- example: create a line which is following the mouse -->
        <slot name="custom-line" />

        <!-- nodes -->
        {#each nodes as node (node.id)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <g
                on:click|stopPropagation={() => handleNodeClick(node)}
                on:mousedown|stopPropagation={() => startDragElement(node)}
                on:mouseup|stopPropagation={() => endDragElement(node)}
            >
                <Node
                    bind:position={node.pos}
                    radius={node.size}
                    type={node.type}
                    color={"teal"}
                    label={node.label}
                    selected={selectedNode == node}
                >
                    <svelte:fragment slot="icon">
                        <!-- slot to overwrite the icons -->
                        <slot name="custom-node-icon" {node}>
                            <svg
                                x={node.pos.x - node.size / 2}
                                y={node.pos.y - node.size / 2}
                                width={node.size}
                                height={node.size}
                                viewBox="0 0 512 512"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                role="img"
                                class="iconify iconify--fxemoji"
                                preserveAspectRatio="xMidYMid meet"
                            >
                                <path
                                    fill="#2B3B47"
                                    d="M379.063 148.114c0 89.948-99.942 83.84-99.942 146.026v.336c0 7.174-5.815 12.989-12.989 12.989h-54.53c-7.174 0-12.989-5.815-12.989-12.989v-3.668c0-96.055 87.727-89.947 87.727-134.921c0-19.433-14.436-31.093-38.311-31.093c-19.423 0-39.271 8.493-57.314 25.851c-4.624 4.448-11.854 4.729-16.907.776l-35.862-28.05c-6.044-4.727-6.745-13.685-1.402-19.193c29.94-30.865 68.846-49.343 120.369-49.343c81.618.001 122.15 43.864 122.15 93.279zm-88.838 260.403c0 27.762-22.209 50.526-50.525 50.526c-27.762 0-50.526-22.764-50.526-50.526c0-27.761 22.764-50.525 50.526-50.525c28.317 0 50.525 22.764 50.525 50.525z"
                                />
                            </svg>
                        </slot>
                    </svelte:fragment>
                </Node>
            </g>
        {/each}

        <!-- labels -->
        {#each labels as label}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <g
                on:click|stopPropagation={() => handleLabelClick(label)}
                on:mousedown|stopPropagation={() => startDragElement(label)}
                on:mouseup|stopPropagation={() => endDragElement(label)}
            >
                <Label
                    pos={label.pos}
                    bind:text={label.text}
                    color={selectedTextBox == label ? "red" : "var(--text)"}
                    editable={true}
                />
            </g>
        {/each}
    </g>
    <!-- end viewport -->
</svg>

<style>
    svg {
        width: 100vw;
        height: 100%;
        display: block;
        background: var(--canvas-color);
    }

    svg g {
        cursor: pointer;
    }
</style>
