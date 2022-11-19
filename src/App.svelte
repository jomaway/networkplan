<script lang="ts">
    import Editor from "./lib/editor/Editor.svelte";
    import { SvelteToast } from "@zerodevx/svelte-toast";

    // Ref for Editor
    let editor: Editor;

    // options for svelte-toast
    const options = {
        duration: 3000,
    };
</script>

<Editor bind:this={editor} />

<SvelteToast {options} />
