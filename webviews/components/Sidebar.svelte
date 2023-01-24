<script lang="ts">
    import { onMount } from "svelte";

    let photos: Array<{ url: string, title: string }> = [];

    onMount(() => {
        // Listen for messages from the extension
        window.addEventListener("message", (event) => {
            const message = event.data;
            switch (message.type) {
                case "onSomething": {
                    // code here...
                    break;
                }
            }
        });

        fetch(`https://jsonplaceholder.typicode.com/photos`)
            .then(d => d.json())
            .then(j => photos = j.slice(1).slice(-5));
    });
</script>

<h1>Sidebar Panel</h1>

{#each photos as photo}
    <img src={photo.url} width=150 alt={photo.title} />
{/each}
