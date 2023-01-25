<script lang="ts">
  const urlParams = new URLSearchParams(window.location.search);
  const data = urlParams.get("data");
</script>

<h1>Hello world!</h1>

{data}