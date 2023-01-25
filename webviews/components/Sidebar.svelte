<script lang="ts">
    import { onMount } from "svelte";

    let photos: Array<{ url: string; title: string }> = [];

    onMount(() => {
        fetch(`https://jsonplaceholder.typicode.com/photos`)
            .then((d) => d.json())
            .then((j) => (photos = j.slice(1).slice(-5)));
    });

    const nav = (photoData: { url: string; title: string }) => {
        tsvscode.postMessage({
            type: "onPick",
            value: photoData
        })
        console.log("onclick");
    }
</script>

<h1>Sidebar Panel</h1>

{#each photos as photo}
    <button on:click={() => nav(photo)}>
        <img src={photo.url} width="150" alt={photo.title} />
    </button>
{/each}
