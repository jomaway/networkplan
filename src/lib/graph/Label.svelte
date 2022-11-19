<script lang="ts">
    import type { Position } from "./types";

    export let pos: Position;
    export let text: string;
    export let size: number = 14;
    export let anchor: string = "start"; // start, middle, end
    export let color: string = "#1a5276";
    export let boxed: boolean = true;

    export let editable: boolean = false;

    $: edit = false;

    $: x = pos.x;
    $: y = pos.y;

    $: if (text) {
    }

    const padding: number = 4;
</script>

<g
    on:dblclick={() => {
        if (editable) edit = true;
    }}
>
    {#if boxed}
        <rect {x} {y} width={text.length * 10} height={size * 2} fill="white" stroke={color} stroke-width="1" />
    {/if}

    <text
        x={x + padding}
        y={y + size + padding}
        font-family="Source Code Pro"
        font-size={size}
        fill={color}
        text-anchor={anchor}
    >
        {text}
    </text>

    {#if edit}
        <foreignObject {x} {y} width="200px" height={size * 2}>
            <div class="editwrap">
                <input
                    class="editlabel"
                    bind:value={text}
                    on:keypress={(e) => {
                        if (e.key == "Enter") edit = false;
                    }}
                />
            </div>
        </foreignObject>
    {/if}
</g>

<style>
    foreignObject {
        padding: 1px;
        display: block;
    }

    input.editlabel {
        font-family: "Source Code Pro";
        width: 190px;
    }
</style>
