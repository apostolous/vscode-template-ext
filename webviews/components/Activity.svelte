<script lang="ts">
  const d = data;
  console.log("in activity")
</script>

<h1>Hello People!</h1>

{#if d}
  <img src={d.url} />
{/if}