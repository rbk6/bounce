<script lang="ts">
  import { onMount } from 'svelte';
  import { initGPU, type GPUContext } from '$lib/gpu/context';
  import {
    buildUniformData,
    createQuadPipeline,
    renderQuad,
  } from '$lib/gpu/quad';

  let canvas!: HTMLCanvasElement;
  const canvasWidth = 800;
  const canvasHeight = 600;

  onMount(() => {
    let frameId: number;
    let x = 0;

    const init = async () => {
      const gpu: GPUContext | null = await initGPU(canvas);
      if (!gpu) return; // TODO: error state for unsupported browsers

      const uniformData = buildUniformData(
        {
          x: x,
          y: 200,
          width: 100,
          height: 50,
        },
        canvasWidth,
        canvasHeight,
      );

      const pipeline = createQuadPipeline(gpu, uniformData);

      const loop = () => {
        gpu.device.queue.writeBuffer(
          pipeline.uniformBuffer,
          0,
          buildUniformData(
            { x, y: 200, width: 100, height: 50 },
            canvasWidth,
            canvasHeight,
          ),
        );
        renderQuad(gpu, pipeline);
        x++;

        if (x > canvasWidth + 20) {
          x = -100;
        }
        frameId = requestAnimationFrame(loop);
      };

      requestAnimationFrame(loop);
    };

    init();

    return () => cancelAnimationFrame(frameId);
  });
</script>

<canvas width={canvasWidth} height={canvasHeight} bind:this={canvas}></canvas>

<style>
  canvas {
    display: block;
    background: var(--color-bg-raised);
    border: 1px solid var(--color-border);
  }
</style>
