import type { GPUContext } from '$lib/gpu/context';
import { renderQuad, type QuadPipeline } from '$lib/gpu/quad';
import { createTileInstances } from './tiles';

export interface CanvasDimensions {
  readonly width: number;
  readonly height: number;
}

let frameId: number;

export const startLoop = (gpu: GPUContext, pipeline: QuadPipeline): void => {
  const tiles = createTileInstances(gpu, pipeline);

  const tick = () => {
    renderQuad(gpu, pipeline, tiles);
    frameId = requestAnimationFrame(tick);
  };

  frameId = requestAnimationFrame(tick);
};

export const stopLoop = () => {
  cancelAnimationFrame(frameId);
};
