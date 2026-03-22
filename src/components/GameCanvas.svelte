<script lang="ts">
  import { onMount } from 'svelte';
  import { initGPU, type GPUContext } from '$lib/gpu/context';
  import {
    buildUniformData,
    createQuadInstance,
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

      const pipeline = createQuadPipeline(gpu);

      const quadParams = [
        { x: 50, y: 200, width: 100, height: 50 },
        { x: 200, y: 500, width: 100, height: 50 },
        { x: 500, y: 350, width: 100, height: 50 },
      ];

      const quads = quadParams.map((params) =>
        createQuadInstance(
          gpu,
          pipeline,
          buildUniformData(params, canvasWidth, canvasHeight),
        ),
      );

      const loop = () => {
        quads.forEach((quad, i) => {
          gpu.device.queue.writeBuffer(
            quad.uniformBuffer,
            0,
            buildUniformData(quadParams[i], canvasWidth, canvasHeight),
          );
        });
        renderQuad(gpu, pipeline, quads);
        quadParams.forEach((p, i) => {
          p.x++;
          if (p.x > canvasWidth + 20) {
            p.x = -100;
          }
        });

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
