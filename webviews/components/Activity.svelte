<script lang="ts">
  const d = data;
</script>

<h1>Hello world!</h1>

{#if d}
  <img src={d.url} />
{/if}