<script lang="ts">
</script>

<!-- grid -->
<defs>
    <!-- grid patter -->
    <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="gray" stroke-width="0.5" stroke-dasharray="2" />
    </pattern>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
        <rect width="80" height="80" fill="url(#smallGrid)" />
        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1" stroke-dasharray="2" />
    </pattern>
</defs>

<rect width="100%" height="100%" fill="url(#grid)" />

<style>
    path {
        stroke: gray;
        fill: none;
    }
</style>
