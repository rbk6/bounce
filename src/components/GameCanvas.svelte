<script lang="ts">
  import { onMount } from 'svelte';
  import { initGPU, type GPUContext } from '$lib/gpu/context';
  import { createQuadPipeline } from '$lib/gpu/quad';
  import { startLoop, stopLoop } from '$lib/game/loop';
  import { CANVAS_HEIGHT, CANVAS_WIDTH } from '$lib/game/config';
  import { destroyBinds, initBinds } from '$lib/game/binds';

  let canvas!: HTMLCanvasElement;

  onMount(() => {
    const init = async () => {
      const gpu: GPUContext | null = await initGPU(canvas);
      if (!gpu) return; // TODO: error state for unsupported browsers
      const pipeline = createQuadPipeline(gpu);
      initBinds();
      startLoop(gpu, pipeline);
    };

    init();
    return () => {
      stopLoop();
      destroyBinds();
    };
  });
</script>

<canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} bind:this={canvas}></canvas>

<style>
  canvas {
    display: block;
    background: var(--color-bg-raised);
    border: 2px solid var(--color-border);
  }
</style>
