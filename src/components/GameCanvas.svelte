<script lang="ts">
  import { onMount } from 'svelte';
  import { initGPU, type GPUContext } from '$lib/gpu/context';
  import { createQuadPipeline } from '$lib/gpu/quad';
  import { startLoop, stopLoop } from '$lib/game/loop';

  let canvas!: HTMLCanvasElement;
  const width = 800;
  const height = 600;

  onMount(() => {
    const init = async () => {
      const gpu: GPUContext | null = await initGPU(canvas);
      if (!gpu) return; // TODO: error state for unsupported browsers
      const pipeline = createQuadPipeline(gpu);
      startLoop(gpu, pipeline, { width, height });
    };

    init();
    return () => stopLoop();
  });
</script>

<canvas {width} {height} bind:this={canvas}></canvas>

<style>
  canvas {
    display: block;
    background: var(--color-bg-raised);
    border: 1px solid var(--color-border);
  }
</style>
