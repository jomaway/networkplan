<script lang="ts">
    import type { Position } from "./types";

    export let start: Position;
    export let end: Position;
    export let width: number = 3;
    export let color: string = "#2e86c1";
    export let selected: boolean = false;
    export let active: boolean = false;

    $: lineColor = active ? "#e74c3c" : selected ? "#f1c40f" : color;
    $: x1 = start.x;
    $: y1 = start.y;
    $: x2 = end.x;
    $: y2 = end.y;
</script>

<defs>
    <!-- arrowhead marker definition -->
    <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX={5}
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
    >
        <path d="M 0 0 L 10 5 L 0 10 z" />
    </marker>
</defs>

<!-- invisible line for better selecting -->
<line {x1} {y1} {x2} {y2} stroke={"#fff0"} stroke-width={10} />

<!-- line which is shown as link between nodes -->
<line
    {x1}
    {y1}
    {x2}
    {y2}
    stroke={lineColor}
    stroke-width={selected ? width + 1 : width}
    stroke-dasharray={active ? "4 8" : "none"}
    stroke-linecap={"round"}
    stroke-linejoin={"round"}
    marker-mid={"url(#arrow)"}
/>

<style>
</style>
