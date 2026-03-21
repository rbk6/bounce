<script lang="ts">
  import { onMount } from 'svelte';
  import { initGPU, type GPUContext } from '$lib/gpu/context';
  import {
    createQuadPipeline,
    renderQuad,
    type QuadResources,
  } from '$lib/gpu/quad';

  let canvas!: HTMLCanvasElement;

  onMount(() => {
    let frameId: number;

    const init = async () => {
      const gpu: GPUContext | null = await initGPU(canvas);
      if (!gpu) return;

      const pipeline: QuadResources = createQuadPipeline(gpu);

      const loop = () => {
        renderQuad(gpu, pipeline);
        frameId = requestAnimationFrame(loop);
      };

      requestAnimationFrame(loop);
    };

    init();

    return () => cancelAnimationFrame(frameId);
  });
</script>

<canvas width={800} height={600} bind:this={canvas}></canvas>

<style>
  canvas {
    display: block;
    background: var(--color-bg-raised);
    border: 1px solid var(--color-border);
  }
</style>
