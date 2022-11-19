<script lang="ts">
    import type { Position } from "./types";

    export let position: Position;
    export let radius: number = 30; // Size of the icon on a circle it is the diameter anand on a rect it is the length of both sides (square).
    export let color: string = "teal";
    export let type: string = "circle";
    export let label: string = "Node";
    export let selected: boolean = false;

    $: cx = position.x;
    $: cy = position.y;
</script>

<g class="node">
    {#if type == "circle"}
        <circle {cx} {cy} r={radius / 2} fill={color} />
    {:else if type == "rect"}
        <rect
            x={cx - radius * 0.55}
            y={cy - radius * 0.25}
            width={radius * 1.1}
            height={radius / 2}
            fill={color}
            rx="5"
        />
    {:else if type == "custom"}
        <circle {cx} {cy} r={radius / 2} fill={color} />
        <slot name="icon" />
    {:else}
        <slot name="icon" />
    {/if}

    <text x={cx} y={cy + radius / 1.2} font-family="Source Code Pro" font-size="14" fill="#1a5276" text-anchor="middle">
        {label}
    </text>

    {#if selected}
        <circle {cx} {cy} r={radius / 1.5} fill="none" stroke="#f1c40f" stroke-width="4" />
    {/if}
</g>
