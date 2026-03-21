<script lang="ts">
  import GameCanvas from "../components/GameCanvas.svelte";
</script>

<main>
  <h1>bounce</h1>
  <GameCanvas />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--space-3);
    min-height: 100vh;
  }

  h1 {
    color: var(--color-primary);
    font-size: 1.5rem;
    letter-spacing: 0.1em;
    text-shadow: 0 0 20px var(--color-primary);
  }
</style>